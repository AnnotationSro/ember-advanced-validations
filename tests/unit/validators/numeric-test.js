import { expect } from 'chai';
import { describeModule, it } from 'ember-mocha';

import Ember from 'ember';
import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';


describeModule('service:adv-validation-manager', 'Unit : Validator : Numeric validator', {
  needs:['validator:numeric']
}, function () {


  it('valid object', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'numeric'
        }
      ],
      field1: '0123456'
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;

    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: []}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('invalid object', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'numeric'
        }
      ],
      field1: '12abcd'
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;

    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: ["validation.is_number"]}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('invalid object - null field', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'numeric'
        }
      ],
      field1: null
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;

    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: ["validation.is_number"]}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('invalid object - without regex flags (assert that next tests really make a difference)', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'numeric'
        }
      ],
      field1: 'Abcd'
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;

    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: ["validation.is_number"]}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

});
