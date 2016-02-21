import { expect } from 'chai';
import { describeModule, it } from 'ember-mocha';

import Ember from 'ember';
import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';
import AdvValidator from 'ember-advanced-validations/mixins/adv-validator';


describeModule('service:adv-validation-manager', 'Unit : Service : adv validation manager - realtime validator', {
  // Specify the other units that are required for this test.
}, function () {

  it('validates one field', function (done) {
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

    let onValidation = (vResult) => {
      let result = vResult.result;
      expect(result).to.exist;
      expect(result.length).to.equal(1);
      expect(result[0]).to.deep.equal({fields: 'field1', result: [], params: {}}, JSON.stringify(result[0]));
      done();

    };

    service.startRealtimeValidation(sampleObject, onValidation);

    //trigger runtime validation
    sampleObject.set('field1', 'hello');

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


    let onValidation = () => {
      done("error");
    };

    let stopFunction = service.startRealtimeValidation(sampleObject, onValidation);
    stopFunction();

    //trigger runtime validation
    sampleObject.set('field1', 'hello');

    //I am asserting, that validation is not run, so there is no place to finish this test (mark it as 'done')
    //so I give validation a little time to see if it actually happens or not
    setTimeout(()=> {
      done();
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

});
