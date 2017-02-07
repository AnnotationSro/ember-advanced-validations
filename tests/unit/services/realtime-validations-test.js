import { expect } from 'chai';
import { setupTest } from 'ember-mocha';
import { beforeEach, it, describe } from 'mocha';

import Ember from 'ember';
import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';
import AdvValidator from 'ember-advanced-validations/mixins/adv-validator';
import configuration from 'ember-advanced-validations/configuration';


describe(
  'Unit : Service : adv validation manager - realtime validator',
  function () {
    setupTest('service:adv-validation-manager', {
      // Specify the other units that are required for this test.
        needs: ['service:i18n']
    });

    beforeEach(function () {
      configuration.setProperty('realtime_debounce', 0);
    });


    it('validates one field', function (done) {
      let service = this.subject();
      let hasParams = false;

      let sampleObject = Ember.Controller.extend(AdvValidable, {
        validations: [
          {
            fields: 'field1',
            validator: function (field, config, params) {
              if (params && params.hello === 'world'){
                hasParams = true;
              }
              return true;
            },
            realtime: true
          }
        ],
        field1: 'test'
      }).create();

      let onValidation = (vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: [], params: {}}, JSON.stringify(result[0]));

        expect(hasParams).to.be.true;
        done();

      };

      service.startRealtimeValidation(sampleObject, onValidation, {hello: 'world'});

      //trigger runtime validation
      sampleObject.set('field1', 'hello');

    });

    it('validates one field - twice', function (done) {
      let service = this.subject();

      let sampleObject = Ember.Controller.extend(AdvValidable, {
        validations: [
          {
            fields: 'field1',
            validator: function () {
              return true;
            },
            realtime: true
          }
        ],
        field1: 'test'
      }).create();

      let callbackCalled = 0;

      let onValidation = () => {
        callbackCalled++;
        if (callbackCalled === 2) {
          done();
        }
      };

      service.startRealtimeValidation(sampleObject, onValidation);

      //trigger runtime validation
      sampleObject.set('field1', 'hello');
      Ember.run.later(this, function () {
        sampleObject.set('field1', 'hello2');
      }, 200);


      //I am asserting, that validation is not run, so there is no place to finish this test (mark it as 'done')
      //so I give validation a little time to see if it actually happens or not
      setTimeout(()=> {
        if (callbackCalled !== 2){
          done("validation should be performed twice, but it wasn't");
        }
      }, 600);
    });

    it('validates one field - stop validation works', function (done) {
      let service = this.subject();

      let sampleObject = Ember.Controller.extend(AdvValidable, {
        validations: [
          {
            fields: 'field1',
            validator: function () {
              return true;
            },
            realtime: true
          }
        ],
        field1: 'test'
      }).create();

      let validationCallback = 0;
      let onValidation = () => {
        validationCallback++;
        done("error");
      };

      let stopFunction = service.startRealtimeValidation(sampleObject, onValidation);
      stopFunction();

      //trigger runtime validation
      sampleObject.set('field1', 'hello');

      //I am asserting, that validation is not run, so there is no place to finish this test (mark it as 'done')
      //so I give validation a little time to see if it actually happens or not
      setTimeout(()=> {
        if (validationCallback===0) {
          done();
        }
      }, 200);

    });

    it('validates multiple fields', function (done) {
      let service = this.subject();

      let sampleObject = Ember.Controller.extend(AdvValidable, {
        validations: [
          {
            fields: ['field1', 'field2'],
            validator: function () {
              return true;
            },
            realtime: true
          }
        ],
        field1: 'test'
      }).create();

      let onValidation = (vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({
          fields: ['field1', 'field2'],
          result: [],
          params: {}
        }, JSON.stringify(result[0]));
        done();
      };

      service.startRealtimeValidation(sampleObject, onValidation);

      //trigger runtime validation
      sampleObject.set('field1', 'hello');

    });


    it('combines 2 validators on the same field', function (done) {

      let service = this.subject();

      let sampleObject = Ember.Controller.extend(AdvValidable, {
        validations: [
          {
            fields: 'field1',
            validator: ['test-validator1', 'test-validator2'],
            realtime: true
          }
        ],
        field1: 'test'
      }).create();


      let testValidator1 = Ember.Service.extend(AdvValidator, {
        validate: function () {
          return true;
        },
        isAsync: false
      });

      let testValidator2 = Ember.Service.extend(AdvValidator, {
        validate: function () {
          return false;
        },
        isAsync: false
      });

      this.register('validator:test-validator1', testValidator1);
      this.register('validator:test-validator2', testValidator2);

      let onValidation = (vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: [false], params: {}}, JSON.stringify(result[0]));
        done();
      };

      service.startRealtimeValidation(sampleObject, onValidation);

      //trigger runtime validation
      sampleObject.set('field1', 'hello');

    });


    it('conditional validation (runIf) - realtime validation shoult not be triggered', function (done) {
      let service = this.subject();

      let assertValidatorRun = 0;

      var validationObject = Ember.Controller.extend(AdvValidable, {
        validations: [
          {
            fields: 'field1',
            validator: 'test-validator',
            runIf: 'runProperty',
            realtime: true
          }
        ],
        field1: 'test',

        runProperty: false
      }).create();


      let testValidator = Ember.Service.extend(AdvValidator, {
        validate: function () {
          assertValidatorRun++;
          return false;
        },
        isAsync: false
      });

      this.register('validator:test-validator', testValidator);

      let onValidation = () => {
        done("cannot validate before runProperty is true");
      };

      service.startRealtimeValidation(validationObject, onValidation);

      //try to trigger runtime validation (should not work, since runProperty is false)
      validationObject.set('field1', 'hello');

      //I am asserting, that validation is not run, so there is no place to finish this test (mark it as 'done')
      //so I give validation a little time to see if it actually happens or not
      setTimeout(()=> {
        done();
      }, 200);

    });


    it('respects debounce time - global time config', function (done) {

      configuration.setProperty('realtime_debounce', 200);

      let service = this.subject();

      let sampleObject = Ember.Controller.extend(AdvValidable, {
        validations: [
          {
            fields: 'field1',
            validator: function () {
              return true;
            },
            realtime: true
          }
        ],
        field1: 'test'
      }).create();

      let validationRunCount = 0;

      let onValidation = () => {
        validationRunCount++;
        if (validationRunCount === 2) {
          done("realtime validation should be called just once - not twice for (every property change)");
        }
      };

      service.startRealtimeValidation(sampleObject, onValidation);

      //trigger runtime validation
      sampleObject.set('field1', 'hello');
      Ember.run.later(this, function () {
        sampleObject.set('field1', 'hello2');
      }, 150);

      //I am asserting, that validation is not run, so there is no place to finish this test (mark it as 'done')
      //so I give validation a little time to see if it actually happens or not
      setTimeout(()=> {
        if (validationRunCount === 1) {
          done();
        }
      }, 600);

    });

    it('respects debounce time - per validation time config', function (done) {

      let service = this.subject();

      let sampleObject = Ember.Controller.extend(AdvValidable, {
        validations: [
          {
            fields: 'field1',
            validator: function () {
              return true;
            },
            config: {
              realtime_debounce: 200
            },
            realtime: true
          }
        ],
        field1: 'test'
      }).create();

      let validationRunCount = 0;

      let onValidation = () => {
        validationRunCount++;
        if (validationRunCount === 2) {
          done("realtime validation should be called just once - not twice for (every property change)");
        }
      };

      service.startRealtimeValidation(sampleObject, onValidation);

      //trigger runtime validation
      sampleObject.set('field1', 'hello');
      Ember.run.later(this, function () {
        sampleObject.set('field1', 'hello2');
      }, 150);

      //I am asserting, that validation is not run, so there is no place to finish this test (mark it as 'done')
      //so I give validation a little time to see if it actually happens or not
      setTimeout(()=> {
        if (validationRunCount === 1) {
          done();
        }
      }, 400);

    });
  }
);
