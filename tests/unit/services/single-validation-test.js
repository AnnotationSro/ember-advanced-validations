import { expect } from 'chai';
import { describeModule, it } from 'ember-mocha';

import Ember from 'ember';
import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';
import AdvValidator from 'ember-advanced-validations/mixins/adv-validator';


describeModule('service:adv-validation-manager', 'Unit : Service : adv validation manager - single validator', {
  // Specify the other units that are required for this test.
}, function () {

  it('exists', function () {
    let service = this.subject();
    expect(service).to.exist;
  });

  it('validates no field + direct function', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: []
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(0);

        expect(vResult.valid).to.be.true;
        expect(vResult.target).to.deep.equal(sampleObject);

        done();
      })
      .catch((e) => {
        done(e);
      });

  });

  it('validates one field + direct function', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: function () {
            return true;
          }
        }
      ],
      field1: 'test'
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields:'field1', result: []}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('validates one field + direct function - with argument manipulation', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: function (arg) {
            return arg === 'test';
          }
        }
      ],
      field1: 'test'
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields:'field1', result: []}, JSON.stringify(result[0]));

        expect(vResult.valid).to.be.true;
        expect(vResult.target).to.deep.equal(sampleObject);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('validates multiple fields + direct function - with argument manipulation', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: ['field1', 'field2'],
          validator: function (arg1, arg2) {
            return arg1 === 'test' && arg2 === 42;
          }
        }
      ],
      field1: 'test',
      field2: 42
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields:['field1', 'field2'], result: []}, JSON.stringify(result[0]));

        expect(vResult.valid).to.be.true;
        expect(vResult.target).to.deep.equal(sampleObject);
        done();
      })
      .catch((e) => {
        done(e);
      });

  });

  it('validates one nested field + direct function - with argument manipulation', function (done) {
    let service = this.subject();

    let nestedObject = Ember.Object.extend({});

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1.nestedField',
          validator: function (arg) {
            return arg === 'test';
          }
        }
      ],
      field1: nestedObject.create({
        nestedField: 'test'
      })
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields:'field1.nestedField', result: []}, JSON.stringify(result[0]));

        expect(vResult.valid).to.be.true;
        expect(vResult.target).to.deep.equal(sampleObject);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('validates and finds an invalid object', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: ['field1', 'field2'],
          validator: function (arg1, arg2) {
            return arg1 === 'test' && arg2 === 42;
          }
        }
      ],
      field1: 'test',
      field2: 43
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields:['field1', 'field2'], result: [false]}, JSON.stringify(result[0]));

        expect(vResult.valid).to.be.false;
        expect(vResult.target).to.deep.equal(sampleObject);
        done();
      })
      .catch((e) => {
        done(e);
      });

  });


  it('validates one field + module validator', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'test-validator'
        }
      ],
      field1: 'test'
    }).create();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function () {
        return true;
      },
      isAsync: false
    });

    this.register('validator:test-validator', testValidator);

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields:'field1', result: []}, JSON.stringify(result[0]));

        expect(vResult.valid).to.be.true;
        expect(vResult.target).to.deep.equal(sampleObject);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('validates one field + nested module validator', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'someDirectory/test-validator'
        }
      ],
      field1: 'test'
    }).create();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function () {
        return true;
      },
      isAsync: false
    });

    this.register('validator:someDirectory/test-validator', testValidator);

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields:'field1', result: []}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('validates one field + module validator - async', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'test-validator'
        }
      ],
      field1: 'test'
    }).create();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function () {
        let promise = new Ember.RSVP.Promise((resolve) => {
          setTimeout(function () {
            resolve(true);
          }, 100);
        });
        return promise;
      },
      isAsync: true
    });

    this.register('validator:test-validator', testValidator);

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields:'field1', result: []}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);

      });
  });

});
