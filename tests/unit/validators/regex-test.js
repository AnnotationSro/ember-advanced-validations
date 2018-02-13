import Controller from '@ember/controller';
import { expect } from 'chai';
import { it, describe } from 'mocha';

import { setupTest } from 'ember-mocha';
import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';


describe('Unit : Validator : Regex validator', function () {
  setupTest('service:adv-validation-manager', {
    needs:['validator:regex', 'service:i18n']
  });


  it('valid object', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'regex',
          config:{
            regex:'[0-9]+'
          }
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: [], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('invalid object - field does not match regex', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'regex',
          config:{
            regex:'[0-9]+'
          }
        }
      ],
      field1: 'abcd'
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;

    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: ["validation.regex"], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('invalid object - null field', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'regex',
          config:{
            regex:'[0-9]+'
          }
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: ["validation.regex"], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('invalid object - without regex flags (assert that next tests really make a difference)', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'regex',
          config:{
            regex:'^a.'
          }
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: ["validation.regex"], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('valid object - with regex flags', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'regex',
          config:{
            regex:'^a.',
            flags: 'i'
          }
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: [], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('valid object - with regex flags #2', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'regex',
          config:{
            regex:'^a.',
            flags: 'i'
          }
        }
      ],
      field1: 'abcd'
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
});
