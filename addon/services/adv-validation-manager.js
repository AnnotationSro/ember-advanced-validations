import { isHTMLSafe } from '@ember/string';
import EmberObject from '@ember/object';
import { isArray } from '@ember/array';
import { debounce } from '@ember/runloop';
import { addObserver, removeObserver } from '@ember/object/observers';
import { Promise as EmberPromise, all } from 'rsvp';
import { isPresent, isEmpty, isNone, typeOf } from '@ember/utils';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';
import Service from '@ember/service';
import Ember from 'ember';
import AdvValidator from '../mixins/adv-validator';
import configuration from '../configuration';

class AwaitingValidation {
  constructor(dependsOn, validatorFn) {
    this.dependsOn = dependsOn;
    this.validatorFn = validatorFn;
  }
}

export default Service.extend({

  i18n: null,


  init() {
    this._super(...arguments);

    if (configuration.isI18N()) {
      try {
        //this try/catch is a workaround for Ember Error: "registry.resolver.resolve is not a function"
        //which happens when service i18n is not registered - I guess....:(
        let i18n = getOwner(this).lookup('service:i18n');
        this.set('i18n', i18n);

      } catch (e) {
        //nothing, just leave i18n as null
      }
    }
  },

  /**
   * Explicit call to validate an Ember object (Controller, Component, Model,...)
   *
   * {
   *   id: [required only if you want to use "dependsOn"]
   *   fields:
   *   customValidationId:
   *   validator:
   *   validationMessage:
   *   dependsOn:
   * }
   *
   * @param  {any Ember object} emberObject Ember object to validate
   * @param {JSON} validationParams parameters that will be passed into validation - can be used during validation process, runIf function, ...
   * @return {Promise} validation result
   * @public
   */
  validateObject(emberObject, validationParams) {
    assert("Cannot validate null or undefined object", isPresent(emberObject));
    let allFieldValidations = emberObject.get('validations');

    let validationPromises = [];

    //array of validations to be run -> to start an awaiting validations execute them as functions (since elements in this array are functions)
    let awaitingValidations = [];

    let validationResult = [];


    let resolveValidationPromise, rejectValidationPromise;
    let validationDonePromise = new EmberPromise((resolve, reject) => {
      resolveValidationPromise = resolve;
      rejectValidationPromise = reject;
    });



    //map of validations that were already resolved with a validation result (true/false)
    //key = validationID, value=true/false
    //validations without ID won't be in this map
    let validationResultMap = {};

    let doneValidationPartialFn = this._doneValidation(resolveValidationPromise, emberObject);


    if (isEmpty(allFieldValidations)) {
      doneValidationPartialFn(validationResult);
      return validationDonePromise;
    }

    allFieldValidations = this._convertSimpleValidationDefinitions(allFieldValidations);
    if (isEmpty(allFieldValidations)) {
      doneValidationPartialFn(validationResult);
    } else {

      allFieldValidations.forEach((fieldValidation) => {
        let dependsOnValidations = fieldValidation['dependsOn'];
        if (this._validationDependenciesResolved(dependsOnValidations, validationResultMap)) {
          this._runSingleValidation(emberObject, validationParams, fieldValidation, doneValidationPartialFn, rejectValidationPromise, validationResultMap, validationPromises, awaitingValidations, validationResult);
        } else {

          awaitingValidations.push(new AwaitingValidation(
            dependsOnValidations,
            () => {
              this._runSingleValidation(emberObject, validationParams, fieldValidation, doneValidationPartialFn, rejectValidationPromise, validationResultMap, validationPromises, awaitingValidations, validationResult);
            }));
        }
      });

      if (isEmpty(validationPromises)) {
        //there are actually no validations to be run (e.g. none of them are able to run due to "runIf" restrictions)
        doneValidationPartialFn(validationResult);
      }
    }

    return validationDonePromise;
  },

  /**
   * starts real-time validation on all validation definitions marked as real-time
   *
   * DO NOT FORGET to stop real-time validation afterwards (e.g. on route change, component destroy,...)
   * to stop real-time validations, just run a function that you get as a result of this method
   *
   * @param  {any Ember object} emberObject Ember object to validate
   * @param {callback} function to be called when validation is done - function should accept one parameter - validation result
   * @param {JSON} validationParams parameters that will be passed into validation - can be used during validation process, runIf function, ...
   * @return {Promise} validation result
   * @public

   */
  startRealtimeValidation(emberObject, onValidationCallback, validationParams) {
    assert("Cannot validate null or undefined object", isPresent(emberObject));
    assert("It seems you forgot to specify 'onValidationCallback'", isPresent(onValidationCallback));

    let allFieldValidations = emberObject.get('validations');
    allFieldValidations = this._convertSimpleValidationDefinitions(allFieldValidations);

    //find real-time validations
    let realTimeFieldValidations = allFieldValidations.filter((definition) => {
      return definition['realtime'] === true;
    });

    let stopValidationArray = realTimeFieldValidations.map((validationDef) => {
      let fields = validationDef['fields'];

      let debounceTime = configuration.getRealtimeDebounceMsec();
      if (isPresent(validationDef['config']) && validationDef['config']['realtime_debounce']) {
        debounceTime = validationDef['config']['realtime_debounce'];
      }

      const validationFn = () => {
        let validationResultMap = {};
        let validationPromises = [];
        let awaitingValidations = [];
        let validationResult = [];

        let validationPromise = new EmberPromise((resolve, reject) => {
          let doneValidationPartialFn = this._doneValidation(resolve, emberObject);
          this._runSingleValidation(emberObject, validationParams, validationDef, doneValidationPartialFn, reject, validationResultMap, validationPromises, awaitingValidations, validationResult);
        });

        validationPromise.then((result) => {
          onValidationCallback(result);
        }).catch((err) => {
          Ember.Logger.error(`Error while validating field(s) ${fields} - error: ${err}`);
        });
      };

      if (!Array.isArray(fields)) {
        fields = [fields];
      }

      let observers = [];
      const observerFn = () => {
        debounce(this, validationFn, debounceTime);
      };

      //register observers
      fields.forEach((f) => {
        let obs = addObserver(emberObject, f, this, observerFn);
        observers.push(obs);
      });


      //create an array of functions that will be called to unregister/remove observers
      return fields.map((f) => {
        return (object = emberObject) => {
          removeObserver(object, f, this, observerFn);
        };

      });

    });


    return () => {
      stopValidationArray.forEach((fieldUnregisterArray) => {
        fieldUnregisterArray.forEach((unregisterFn) => {
          unregisterFn();
        });
      });
    };
  },


  /**
   * checks all field validations - if a validation is in simple form, it creates advanced equivalent,
   * if validation definition is already in advanced form, it leaves it be
   */
  _convertSimpleValidationDefinitions(allFieldValidations) {

    let advancedDefinitions = [];

    //loop backwards so that we can remove simple validations from the field
    for (var i = allFieldValidations.length - 1; i >= 0; i--) {

      let validation = allFieldValidations[i];
      if (isValidationSimple(validation)) {
        advancedDefinitions = advancedDefinitions.concat(convertSingleSimpleValidation(validation));

        allFieldValidations.splice(i, 1);
      }
    }

    return allFieldValidations.concat(advancedDefinitions);

    function isValidationSimple(validation) {
      return isEmpty(validation['fields']);
    }

    function convertSingleSimpleValidation(simpleDefinition) {
      let keys = Object.keys(simpleDefinition);
      assert('Validation definition invalid format.', isPresent(keys) && keys.length === 1);

      let validatorName = keys[0];
      let simpleFields = simpleDefinition[keys[0]];

      return simpleFields.map((field) => {
        return {
          validator: validatorName,
          fields: field
        };
      });
    }
  },

  _doneValidation(promiseResolve, target) {
    //why??? why, doesn't Javascript support currying out-of-box????
    return function(validationResult) {
      promiseResolve({
        valid: _isObjectValid(validationResult),
        target,
        result: validationResult
      });
    };

    function _isObjectValid(validationResult) {
      return validationResult.every((res) => {
        return isEmpty(res.result);
      });
    }
  },

  _findAvailableWaitingValidations(awaitingValidations, validationResultMap) {
    return awaitingValidations.filter((awValidation) => {
      let dependsOn = awValidation.dependsOn;
      return this._validationDependenciesResolved(dependsOn, validationResultMap);
    });
  },

  _validationDependenciesResolved(dependsOnValidations, validationResultMap) {
    if (isEmpty(dependsOnValidations)) {
      return true;
    } else {
      if (Array.isArray(dependsOnValidations)) {
        //there are multiple items in "dependsOn"
        return dependsOnValidations.every((d) => {
          return validationResultMap[d];
        });
      } else {
        //there is just one dependency in "dependsOn"
        return validationResultMap[dependsOnValidations];
      }
    }
  },

  _runSingleValidation: function(emberObject, validationParams, fieldValidation, resolveValidationPromise, rejectValidationPromise, validationResultMap, validationPromises, awaitingValidations, validationResult) {
    let fields = fieldValidation['fields'];
    let validatorArray = fieldValidation['validator'];
    let validationMessage = fieldValidation['validationMessage'];
    let runIfFields = fieldValidation['runIf'];
    let validatorId = fieldValidation['id'];

    assert('No fields defined for validation', isPresent(fields));
    assert('No validator defined for validation', isPresent(validatorArray));

    if (isNone(fields) || isNone(fields)) {
      rejectValidationPromise();
      return;
    }

    let config = this._getFieldConfig(validatorArray, fieldValidation);
    if (!this._canRunValidation(emberObject, validationParams, config, runIfFields)) {
      return;
    }
    var singleFieldValidation = this._createSingleFieldValidation(fields, emberObject, validationParams, validatorArray, fieldValidation, validationMessage);

    validationPromises.push(singleFieldValidation);

    //when field validation finishes, check if there are any depended validations waiting for this to be resolved
    singleFieldValidation.then((result) => {

      //remember te result
      validationResult.push(result);


      //remember the result of validation
      if (isPresent(validatorId)) {
        assert(`There are multiple validators with the same ID ${validatorId} - this may cause nondeterministic behaviour.`, isNone(validationResultMap[validatorId]));
        validationResultMap[validatorId] = isEmpty(result.result); //when result is empty, validation is OK
      }

      //remove currently done validation from list of running field validations
      let indexValidation = validationPromises.indexOf(singleFieldValidation);
      if (indexValidation !== -1) {
        validationPromises.splice(indexValidation, 1);
      }

      let validationsToBeRun = this._findAvailableWaitingValidations(awaitingValidations, validationResultMap);
      if (isEmpty(validationsToBeRun) && isEmpty(validationPromises)) {
        //there are no running and no awaiting validations => this is the end, my friend
        resolveValidationPromise(validationResult);
      } else {
        //run all validations that can be run
        validationsToBeRun.forEach((validation) => {
          //remove validation from awaiting array
          let indexValidation = awaitingValidations.indexOf(validation);
          if (indexValidation !== -1) {
            awaitingValidations.splice(indexValidation, 1);
          }

          //run validation
          validation.validatorFn();
        });
      }
    }).catch((err) => {
      Ember.Logger.error(`Error while validating field(s) ${fields} - error: ${err}`);
    });
  },

  _getFieldConfig(validatorArray, fieldValidation, validator) {
    if (fieldValidation.config) {
      //if there is just one validation, the whole config belongs to this validation
      if (validatorArray.length === 1) {
        return fieldValidation.config;
      } else {
        return fieldValidation.config[validator] || fieldValidation.config;
      }
    }
    return {};
  },

  _createSingleFieldValidation: function(fields, emberObject, validationParams, validatorArray, fieldValidation, validationMessage) {
    //get values for validation field/fields
    let validatorFields = [];
    if (isArray(fields)) {
      validatorFields = fields.map((f) => emberObject.get(f));
    } else {
      validatorFields.push(emberObject.get(fields));
    }

    if (!Array.isArray(validatorArray)) {
      validatorArray = [validatorArray];
    }

    let fieldValidations = [];
    validatorArray.forEach((validator) => {
      //get validation definition
      let validationDef = this._getValidationDefinition(validator);
      let config = this._getFieldConfig(validatorArray, fieldValidation, validator);
      let singleValidation = this._runValidation(validationDef, validatorFields, config, validationMessage, validationParams);
      fieldValidations.push(singleValidation);
    });


    let singleFieldValidation = new EmberPromise((resolve, reject) => {

      //check if all validations on this field are true - only then resolve this field as valid
      new all(fieldValidations).then((result) => {
        resolve({
          fields: fieldValidation.customValidationId || fields,
          result: result.filter((r) => r !== true),
          params: fieldValidation.params || {}
        });

      }).catch(reject);

    });
    return singleFieldValidation;
  },

  _canRunValidation(validationObject, validationParams, fieldConfig, conditionFields) {
    if (isEmpty(conditionFields)) {
      return true;
    }
    if (!Array.isArray(conditionFields)) {
      conditionFields = [conditionFields];
    }


    //check if it is a run condition with function (last element in array must be a function)
    if (typeof conditionFields[conditionFields.length - 1] === 'function') {
      let conditionFunction = conditionFields[conditionFields.length - 1];
      let conditionArguments = conditionFields.slice(0, conditionFields.length - 1).map((field) => validationObject.get(field));
      return conditionFunction(...conditionArguments, fieldConfig, validationParams);
    } else {
      //nope, just a simple array with properties
      return conditionFields.map((field) => !!validationObject.get(field)).every((item) => item === true);
    }

  },

  /**
   * Returns validator that can be actually run.
   * @return validator AdvValidator
   * @private
   */
  _getValidationDefinition(validatorDef) {

    if (typeOf(validatorDef) === 'string') {
      //it is a name of a Validation rather than a direct validation function
      return this._getValidatorFromModule(validatorDef);
    }
    if (typeOf(validatorDef) === 'function') {
      //it is a direct function that should be executed
      let validator = EmberObject.extend(AdvValidator, {})
        .create({
          isAsync: false,
          validate: validatorDef
        });
      return validator;
    }
    assert(`Cannot determine a validation function for: ${validatorDef}`);
  },

  _runValidation(validator, fields, config, userDefinedValidationMessage, validationParams) {

    assert("Cannot determine if validation is async or not - please override 'isAsync' property in your validator", isPresent(validator.get('isAsync')));

    let validationPromise;
    if (validator.get('isAsync')) {
      validationPromise = new EmberPromise((resolve, reject) => {
        validator.validate(config, ...fields, validationParams).then((result) => {
            this._handleValidationResult(result, fields, config, validator, userDefinedValidationMessage, resolve, reject);
          })
          .catch((err) => reject(err));

      });
    } else {
      validationPromise = new EmberPromise((resolve, reject) => {
        try {
          var result = validator.validate(...fields, config, validationParams);
          this._handleValidationResult(result, fields, config, validator, userDefinedValidationMessage, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    }
    return validationPromise;
  },

  _getValidatorFromModule(validatorModuleName) {
    let validatorModule = getOwner(this).lookup(`validator:${validatorModuleName}`);

    assert(`Validator "validators:${validatorModuleName}" does not exist.`, isPresent(validatorModule));
    assert(`Validator ${validatorModuleName} does not implement mixin AdvValidator`, AdvValidator.detect(validatorModule));

    return validatorModule;
  },

  _handleValidationResult(result, fields, config, validator, userDefinedValidationMessage, resolve, reject) {
    if (result === true) {
      resolve(true);
    } else {
      if (result === false) {

        let message = userDefinedValidationMessage || validator.validationMessage;
        if (isPresent(message)) {
          resolve(this._formatValidationMessage(message, fields, config, this.get('i18n')));
        } else {
          resolve(false);
        }

      } else {
        reject(`Unknown validation result: ${result}`);
      }
    }
  },

  /**
   * Validation messages can contain placeholders such as {0}, {1}, etc
   * Each placeholder will be replaced with value of a field being validated -
   * first argument will be replaced with the first field, second placeholder with second field, etc
   *
   * Configuration parameters can be also used in validationMessage - use a placeholder's syntax: {config.parameterName}
   */
  _formatValidationMessage(validationMessage, args, config, i18n) {
    let formatted;

    if (isPresent(i18n)) {
      formatted = i18n.t(validationMessage);
      if (isHTMLSafe(formatted)) {
        formatted = formatted.toString();
      }
    } else {
      formatted = validationMessage;
    }


    //replace field arguments
    for (let i = 0; i < args.length; i++) {
      formatted = formatted.replace(`{${i}}`, args[i]);
    }

    //replace configuration parameters
    Object.keys(config).forEach((param) => {
      formatted = formatted.replace(`{config.${param}}`, config[param]);
    });

    return formatted;
  }

});
