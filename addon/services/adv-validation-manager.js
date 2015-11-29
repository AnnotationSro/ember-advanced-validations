import Ember from 'ember';
import AdvValidator from '../mixins/adv-validator';
import _ from 'lodash/lodash';

export default Ember.Service.extend({

  i18n: Ember.inject.service('i18n'),

  /**
   * Explicit call to validate an Ember object (Controller, Component, Model,...)
   *
   * {
   *   fields:
   *   validator:
   *   validationMessage:
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


    allFieldValidations.forEach((fieldValidation) => {

      let fields = fieldValidation['fields'];
      let validatorArray = fieldValidation['validator'];
      let validationMessage = fieldValidation['validationMessage'];

      Ember.assert('No fields defined for validation', Ember.isPresent(fields));
      Ember.assert('No validator defined for validation', Ember.isPresent(fields));

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


      //run all validations for this field
      validationPromises.push(singleFieldValidation);
    });

    return new Ember.RSVP.all(validationPromises);
  },

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
    let formatted ;

    if (Ember.isPresent(i18n)){
      formatted = i18n.t(validationMessage);
      if (formatted instanceof Ember.Handlebars.SafeString){
        formatted = formatted.string;
      }
    }else{
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
