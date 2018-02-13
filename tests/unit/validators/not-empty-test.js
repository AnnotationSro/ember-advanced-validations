import Controller from '@ember/controller';
import { expect } from 'chai';
import { it, describe } from 'mocha';

import { setupTest } from 'ember-mocha';
import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';


describe('Unit : Validator : Not empty validator', function () {
  setupTest('service:adv-validation-manager', {
    needs: ['validator:not-empty', 'service:i18n']
  });

  it('valid object', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'not-empty'
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: [], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('invalid object - empty string', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'not-empty'
        }
      ],
      field1: ''
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;

    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: ['validation.not_empty'], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('invalid object - null string', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'not-empty'
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: ['validation.not_empty'], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('invalid object - undefined string', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'not-empty'
        }
      ],
      field1: undefined
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;

    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: ['validation.not_empty'], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('invalid object - whitespaces string', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'not-empty'
        }
      ],
      field1: '   '
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

  it('valid object - whitespaces string + trim enabled', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'not-empty',
          config: {
            trim: true
          }
        }
      ],
      field1: '   '
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;

    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: ['validation.not_empty'], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});
