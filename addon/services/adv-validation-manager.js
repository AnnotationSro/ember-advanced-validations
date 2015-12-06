import Ember from 'ember';
import AdvValidator from '../mixins/adv-validator';
import _ from 'lodash/lodash';

class AwaitingValidation {
  constructor(dependsOn, validatorFn) {
    this.dependsOn = dependsOn;
    this.validatorFn = validatorFn;
  }
}

export default Ember.Service.extend({

  i18n: Ember.inject.service('i18n'),

  /**
   * Explicit call to validate an Ember object (Controller, Component, Model,...)
   *
   * {
   *   id: [required only if you want to use "dependsOn"]
   *   fields:
   *   validator:
   *   validationMessage:
   *   dependsOn:
   * }
   *
   * @param  {any Ember object} emberObject Ember object to validate
   * @return {Promise} validation result
   * @public
   */
  validateObject(emberObject) {
    Ember.assert("Cannot validate null or undefined object", Ember.isPresent(emberObject));
    let allFieldValidations = emberObject.get('validations');
    let validationPromises = [];

    //array of validations to be run -> to start an awaiting validations execute them as functions (since elements in this array are functions)
    let awaitingValidations = [];

    let validationResult = [];


    let resolveValidationPromise, rejectValidationPromise;
    let validationDonePromise = new Ember.RSVP.Promise((resolve, reject) => {
      resolveValidationPromise = resolve;
      rejectValidationPromise = reject;
    });


    //map of validations that were already resolved with a validation result (true/false)
    //key = validationID, value=true/false
    //validations without ID won't be in this map
    let validationResultMap = {};


    if (Ember.isEmpty(allFieldValidations)) {
      resolveValidationPromise(validationResult);
    } else {

      allFieldValidations.forEach((fieldValidation) => {
        let dependsOnValidations = fieldValidation['dependsOn'];
        if (this._validationDependenciesResolved(dependsOnValidations, validationResultMap)) {
          this._runSingleValidation(emberObject, fieldValidation, resolveValidationPromise, rejectValidationPromise, validationResultMap, validationPromises, awaitingValidations, validationResult);
        } else {

          awaitingValidations.push(new AwaitingValidation(
            dependsOnValidations,
            ()=> {
              this._runSingleValidation(emberObject, fieldValidation, resolveValidationPromise, rejectValidationPromise, validationResultMap, validationPromises, awaitingValidations, validationResult);
            })
          );
        }
      });

      if (Ember.isEmpty(validationPromises)) {
        //there are actually no validations to be run (e.g. none of them are able to run due to "runIf" restrictions)
        resolveValidationPromise(validationResult);
      }
    }

    return validationDonePromise;
  },

  _findAvailableWaitingValidations(awaitingValidations, validationResultMap){
    return _.filter(awaitingValidations, (awValidation) => {
      let dependsOn = awValidation.dependsOn;
      return this._validationDependenciesResolved(dependsOn, validationResultMap);
    });
  },

  _validationDependenciesResolved(dependsOnValidations, validationResultMap){
    if (Ember.isEmpty(dependsOnValidations)) {
      return true;
    } else {
      if (Array.isArray(dependsOnValidations)) {
        //there are multiple items in "dependsOn"
        return _.every(dependsOnValidations, (d) => {
          return validationResultMap[d];
        });
      } else {
        //there is just one dependency in "dependsOn"
        return validationResultMap[dependsOnValidations];
      }
    }
  },

  _runSingleValidation: function (emberObject, fieldValidation, resolveValidationPromise, rejectValidationPromise, validationResultMap, validationPromises, awaitingValidations, validationResult) {
    let fields = fieldValidation['fields'];
    let validatorArray = fieldValidation['validator'];
    let validationMessage = fieldValidation['validationMessage'];
    let runIfFields = fieldValidation['runIf'];
    let validatorId = fieldValidation['id'];

    Ember.assert('No fields defined for validation', Ember.isPresent(fields));
    Ember.assert('No validator defined for validation', Ember.isPresent(fields));

    if (Ember.isNone(fields) || Ember.isNone(fields)) {
      rejectValidationPromise();
      return;
    }

    if (!this._canRunValidation(emberObject, runIfFields)) {
      return;
    }
    var singleFieldValidation = this._createSingleFieldValidation(fields, emberObject, validatorArray, fieldValidation, validationMessage);

    validationPromises.push(singleFieldValidation);

    //when field validation finishes, check if there are any depended validations waiting for this to be resolved
    singleFieldValidation.then((result) => {

      //remember te result
      validationResult.push(result);


      //remember the result of validation
      if (Ember.isPresent(validatorId)) {
        Ember.assert(`There are multiple validators with the same ID ${validatorId} - this may cause nondeterministic behaviour.`, Ember.isNone(validationResultMap[validatorId]));
        validationResultMap[validatorId] = Ember.isEmpty(result.result); //when result is empty, validation is OK
      }

      //remove currently done validation from list of running field validations
      let indexValidation = validationPromises.indexOf(singleFieldValidation);
      if (indexValidation !== -1) {
        validationPromises.splice(indexValidation, 1);
      }

      let validationsToBeRun = this._findAvailableWaitingValidations(awaitingValidations, validationResultMap);
      if (Ember.isEmpty(validationsToBeRun) && Ember.isEmpty(validationPromises)) {
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
    });
  },

  _createSingleFieldValidation: function (fields, emberObject, validatorArray, fieldValidation, validationMessage) {
    //get values for validation field/fields
    let validatorFields = [];
    if (Ember.isArray(fields)) {
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
      let config = {};
      if (fieldValidation.config) {
        //if there is just one validation, the whole config belongs to this validation
        if (validatorArray.length === 1) {
          config = fieldValidation.config;
        } else {
          config = fieldValidation.config[validator] || fieldValidation.config;
        }
      }
      let singleValidation = this._runValidation(validationDef, validatorFields, config, validationMessage);
      fieldValidations.push(singleValidation);
    });


    let singleFieldValidation = new Ember.RSVP.Promise((resolve, reject) => {

      //check if all validations on this field are true - only then resolve this field as valid
      new Ember.RSVP.all(fieldValidations).then((result) => {
        resolve({fields: fields, result: _.filter(result, (r) => r !== true)});

      }).catch(reject);

    });
    return singleFieldValidation;
  },

  _canRunValidation(validationObject, conditionFields){
    if (Ember.isEmpty(conditionFields)) {
      return true;
    }
    if (!Array.isArray(conditionFields)) {
      conditionFields = [conditionFields];
    }


    //check if it is a run condition with function (last element in array must be a function)
    if (typeof conditionFields[conditionFields.length - 1] === 'function') {
      let conditionFunction = conditionFields[conditionFields.length - 1];
      let conditionArguments = conditionFields.slice(0, conditionFields.length - 1).map((field) => validationObject.get(field));
      return conditionFunction(...conditionArguments);
    } else {
      //nope, just a simple array with properties
      return _.every(conditionFields.map((field)=>!!validationObject.get(field)));
    }

  },

  /**
   * Returns validator that can be actually run.
   * @return validator AdvValidator
   * @private
   */
  _getValidationDefinition(validatorDef) {

    if (Ember.typeOf(validatorDef) === 'string') {
      //it is a name of a Validation rather than a direct validation function
      return this._getValidatorFromModule(validatorDef);
    }
    if (Ember.typeOf(validatorDef) === 'function') {
      //it is a direct function that should be executed
      let validator = Ember.Object.extend(AdvValidator, {})
        .create({
          isAsync: false,
          validate: validatorDef
        });
      return validator;
    }
    Ember.assert(`Cannot determine a validation function for: ${validatorDef}`);
  },

  _runValidation(validator, fields, config, userDefinedValidationMessage) {

    Ember.assert("Cannot determine if validation is async or not - please override 'isAsync' property in your validator", Ember.isPresent(validator.get('isAsync')));

    let validationPromise;
    if (validator.get('isAsync')) {
      validationPromise = new Ember.RSVP.Promise((resolve, reject) => {
        validator.validate(config, ...fields).then((result) => {
            this._handleValidationResult(result, fields, config, validator, userDefinedValidationMessage, resolve, reject);
          })
          .catch((err) => reject(err));

      });
    } else {
      validationPromise = new Ember.RSVP.Promise((resolve, reject) => {
        try {
          var result = validator.validate(config, ...fields);
          this._handleValidationResult(result, fields, config, validator, userDefinedValidationMessage, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    }
    return validationPromise;
  },

  _getValidatorFromModule(validatorModuleName) {
    let container = this.get('container');
    let validatorModule = container.lookup(`validator:${validatorModuleName}`);

    Ember.assert(`Validator "validators:${validatorModuleName}" does not exist.`, Ember.isPresent(validatorModule));
    Ember.assert(`Validator ${validatorModuleName} does not implement mixin AdvValidator`, AdvValidator.detect(validatorModule));

    return validatorModule;
  },

  _handleValidationResult(result, fields, config, validator, userDefinedValidationMessage, resolve, reject) {
    if (result === true) {
      resolve(true);
    } else {
      if (result === false) {

        let message = userDefinedValidationMessage || validator.validationMessage;
        if (Ember.isPresent(message)) {
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
  _formatValidationMessage(validationMessage, args, config, i18n){
    let formatted;

    if (Ember.isPresent(i18n)) {
      formatted = i18n.t(validationMessage);
      if (formatted instanceof Ember.Handlebars.SafeString) {
        formatted = formatted.string;
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
