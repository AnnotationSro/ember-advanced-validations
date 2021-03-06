import Controller from '@ember/controller';
import { expect } from 'chai';
import { it, describe } from 'mocha';

import { setupTest } from 'ember-mocha';
import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';


describe('Unit : Validator : String length validator', function () {
  setupTest('service:adv-validation-manager', {
    needs: ['validator:length', 'service:i18n']
  });

  it('valid object - exact length', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'length',
          config: {
            exactLength: 4
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: [], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('valid object - number field - exact length', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'length',
          config: {
            exactLength: 4
          }
        }
      ],
      field1: 1234
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


  it('invalid object - number field - exact length', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'length',
          config: {
            exactLength: 5
          }
        }
      ],
      field1: 1234
    }).create();

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;

    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: ["validation.string_length"], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('invalid object - exact length', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'length',
          config: {
            exactLength: 5
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: ["validation.string_length"], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('valid object - min length', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'length',
          config: {
            minLength: 3
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: [], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('invalid object - min length', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'length',
          config: {
            minLength: 10
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: ["validation.string_length"], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('valid object - max length', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'length',
          config: {
            maxLength: 10
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: [], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('invalid object - max length', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'length',
          config: {
            maxLength: 2
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: ["validation.string_length"], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('valid object - exact + min length', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'length',
          config: {
            minLength: 1,
            exactLength: 4
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: [], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('invalid object - exact + min length (min not satisfied)', function (done) {
    let service = this.subject();

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'length',
          config: {
            minLength: 10,
            exactLength: 4
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
        expect(result[0]).to.deep.equal({fields: 'field1', result: [], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});
