import Controller from '@ember/controller';
import { expect } from 'chai';
import { it, describe } from 'mocha';

import { setupTest } from 'ember-mocha';
import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';


describe('Unit : Validator : Numeric value validator', function () {
  setupTest('service:adv-validation-manager', {
    needs: ['validator:number-value', 'service:i18n']
  });

  it('valid object - minValue', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: [], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('valid object - maxValue', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: [], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('valid object - minValue + maxValue', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: [], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('invalid object - maxValue', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: ["validation.number_value"], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('invalid object - minValue', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: ["validation.number_value"], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('invalid object - minValue + maxValue', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: ["validation.number_value"], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('invalid object - not a number', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: ["validation.number_value"], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});
