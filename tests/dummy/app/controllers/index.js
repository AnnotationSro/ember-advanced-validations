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
      validator: function (config, value) {
        return Ember.isPresent(value);
      }
    },

    {
      fields: 'valuePredefined',
      validator: 'NotEmpty'
    },

    {
      fields: ['valueMulti1', 'valueMulti2'],
      validator: function (config, value1, value2) {
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

  actions: {

    validateAll(){
      this.get('validationService').validateObject(this)
        .then((validationResult) => {
          this.set('simpleValidation', Ember.isEmpty(validationResult[0].result));
          this.set('predefinedValidation', Ember.isEmpty(validationResult[1].result));
          this.set('multiValidation', Ember.isEmpty(validationResult[2].result));
          this.set('configValidation', Ember.isEmpty(validationResult[3].result));
          this.set('combineValidation', Ember.isEmpty(validationResult[4].result));

          let runIfResult = validationResult.find((result)=> {
            return result.fields === 'valueRunIf';
          });
          if (runIfResult) {
            this.set('runIfValidation', Ember.isEmpty(runIfResult.result));
          } else {
            this.set('runIfValidation', 'unknown');
          }

          runIfResult = validationResult.find((result)=> {
            return result.fields === 'valueRunProperty';
          });
          if (runIfResult) {
            this.set('runPropertyValidation', Ember.isEmpty(runIfResult.result));
          } else {
            this.set('runPropertyValidation', 'unknown');
          }


        });


    }
  }
});
