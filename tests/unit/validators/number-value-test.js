import { expect } from 'chai';
import { describeModule, it } from 'ember-mocha';

import Ember from 'ember';
import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';


describeModule('service:adv-validation-manager', 'Unit : Validator : Numeric value validator', {
  needs: ['validator:number-value']
}, function () {

  it('valid object - minValue', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'number-value',
          config: {
            minValue: 4
          }
        }
      ],
      field1: 5
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


  it('valid object - maxValue', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'number-value',
          config: {
            maxValue: 6
          }
        }
      ],
      field1: 5
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


  it('valid object - minValue + maxValue', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'number-value',
          config: {
            maxValue: 6,
            minValue: 1
          }
        }
      ],
      field1: 5
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


  it('invalid object - maxValue', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'number-value',
          config: {
            maxValue: 4
          }
        }
      ],
      field1: 5
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;

    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: ["validation.number_value"]}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('invalid object - minValue', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'number-value',
          config: {
            minValue: 7
          }
        }
      ],
      field1: 5
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;

    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: ["validation.number_value"]}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('invalid object - minValue + maxValue', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'number-value',
          config: {
            maxValue: 3,
            minValue: 5
          }
        }
      ],
      field1: 4
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;

    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: ["validation.number_value"]}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('invalid object - not a number', function (done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'number-value',
          config: {
            maxValue: 5
          }
        }
      ],
      field1: 'ad45'
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;

    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: ["validation.number_value"]}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


});
