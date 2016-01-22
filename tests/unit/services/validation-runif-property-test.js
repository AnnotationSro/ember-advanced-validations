import { expect } from 'chai';
import { describeModule, it } from 'ember-mocha';

import Ember from 'ember';
import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';
import AdvValidator from 'ember-advanced-validations/mixins/adv-validator';


describeModule('service:adv-validation-manager', 'Unit : Service : adv validation manager - runIf configuration', {
  // Specify the other units that are required for this test.
}, function () {


  it('should run - on 1 property', function (done) {
    let service = this.subject();

    let assertValidatorRun = 0;

    var validationObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'test-validator',
          runIf: 'runProperty'
        }
      ],
      field1: 'test',

      runProperty: true
    }).create();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function () {
        assertValidatorRun++;
        return false;
      },
      isAsync: false
    });

    this.register('validator:test-validator', testValidator);

    let validationResult = service.validateObject(validationObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: [false], params: {}}, JSON.stringify(result[0]));
        expect(assertValidatorRun).to.equal(1);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('should not run - on 1 property', function (done) {
    let service = this.subject();

    let assertValidatorRun = 0;

    var validationObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'test-validator',
          runIf: 'runProperty'
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

    let validationResult = service.validateObject(validationObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(0);
        expect(assertValidatorRun).to.equal(0);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('should run - on 2 properties', function (done) {
    let service = this.subject();

    let assertValidatorRun = 0;

    var validationObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'test-validator',
          runIf: ['runProperty1', 'runProperty2']
        }
      ],
      field1: 'test',

      runProperty1: true,
      runProperty2: true

    }).create();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function () {
        assertValidatorRun++;
        return false;
      },
      isAsync: false
    });

    this.register('validator:test-validator', testValidator);

    let validationResult = service.validateObject(validationObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: [false], params: {}}, JSON.stringify(result[0]));
        expect(assertValidatorRun).to.equal(1);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('should not run - on 2 properties', function (done) {
    let service = this.subject();

    let assertValidatorRun = 0;

    var validationObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'test-validator',
          runIf: ['runProperty1', 'runProperty2']
        }
      ],
      field1: 'test',

      runProperty1: true,
      runProperty2: false
    }).create();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function () {
        assertValidatorRun++;
        return false;
      },
      isAsync: false
    });

    this.register('validator:test-validator', testValidator);

    let validationResult = service.validateObject(validationObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(0);
        expect(assertValidatorRun).to.equal(0);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('should run - on 1 function', function (done) {
    let service = this.subject();

    let assertValidatorRun = 0;

    var validationObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'test-validator',
          runIf: function () {
            return true;
          }
        }
      ],
      field1: 'test',

      runProperty: true
    }).create();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function () {
        assertValidatorRun++;
        return false;
      },
      isAsync: false
    });

    this.register('validator:test-validator', testValidator);

    let validationResult = service.validateObject(validationObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: [false], params: {}}, JSON.stringify(result[0]));
        expect(assertValidatorRun).to.equal(1);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('should run - on 1 function + parameter', function (done) {
    let service = this.subject();

    let assertValidatorRun = 0;

    var validationObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'test-validator',
          runIf: [
            'field2',
            function (f1) {
              return f1 === 'runMe';
            }
          ]
        }
      ],
      field1: 'test',
      field2: 'runMe',

      runProperty: true
    }).create();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function () {
        assertValidatorRun++;
        return false;
      },
      isAsync: false
    });

    this.register('validator:test-validator', testValidator);

    let validationResult = service.validateObject(validationObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: [false], params: {}}, JSON.stringify(result[0]));
        expect(assertValidatorRun).to.equal(1);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});
