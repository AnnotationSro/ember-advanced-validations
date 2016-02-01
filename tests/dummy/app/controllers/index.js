import Ember from 'ember';
import {isFieldValid} from 'ember-advanced-validations/helpers/is-field-valid';

export default Ember.Controller.extend({

  validationService: Ember.inject.service('adv-validation-manager'),

  valueSimple: null,
  simpleValidation: 'unknown',

  valuePredefined: null,
  predefinedValidation: 'unknown',

  valueMulti1: null,
  valueMulti2: null,
  multiValidation: 'unknown',

  valueConfig: null,
  configValidation: 'unknown',

  runIfEnabled: false,
  valueRunIf: null,
  runIfValidation: 'unknown',

  valueDependsOn: null,
  dependsOnValidation: 'unknown',

  valueCombine: null,
  combineValidation: 'unknown',

  validations: [
    {
      fields: 'valueSimple',
      validator: function (value) {
        return Ember.isPresent(value);
      }
    },

    {
      fields: 'valuePredefined',
      validator: 'NotEmpty'
    },

    {
      fields: ['valueMulti1', 'valueMulti2'],
      validator: function (value1, value2) {
        return value1 === value2;
      }
    },
    {
      fields: 'valueConfig',
      validator: 'Length',
      config: {
        maxLength: 5
      }
    },

    {
      fields: 'valueCombine',
      validator: ['Numeric', 'Length'],
      config: {
        minLength: 3
      }
    },

    {
      id: 'dependingValidation', //see validation below
      fields: 'valueRunIf',
      validator: 'NotEmpty',
      runIf: 'runIfEnabled'
    },

    {
      fields: 'valueRunProperty',
      validator: 'NotEmpty',
      dependsOn: 'dependingValidation'
    }

  ],

  _getOrElse(value, defaultValue){
    if (Ember.isPresent(value)) {
      return value;
    } else {
      return defaultValue;
    }
  },

  actions: {

    validateAll(){
      this.set('validationResult', null);

      this.get('validationService').validateObject(this)
        .then((validationResult) => {
          this.set('validationResult', validationResult);

          this.set('simpleValidation', isFieldValid(validationResult, 'valueSimple'));
          this.set('predefinedValidation', isFieldValid(validationResult, 'valuePredefined'));
          this.set('multiValidation', isFieldValid(validationResult, 'valueMulti1'));
          this.set('configValidation', isFieldValid(validationResult, 'valueConfig'));
          this.set('combineValidation', isFieldValid(validationResult, 'valueCombine'));


          this.set('runIfValidation', this._getOrElse(isFieldValid(validationResult, 'valueRunIf'), 'unknown'));
          this.set('dependsOnValidation', this._getOrElse(isFieldValid(validationResult, 'valueRunProperty'), 'unknown'));

        });
    }
  }
});
