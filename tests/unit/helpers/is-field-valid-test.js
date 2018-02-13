/* jshint expr:true */
import Controller from '@ember/controller';
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import {
  isFieldValid
} from 'ember-advanced-validations/helpers/is-field-valid';
import AdvValidationManager from 'ember-advanced-validations/services/adv-validation-manager';
import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';


describe('IsFieldValidHelper', function () {

  it('single field in validation result', function (done) {

    let sampleObject = Controller.extend(AdvValidable, {
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

    let validationResult = AdvValidationManager.create().validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult;
        var fieldValid = isFieldValid(result, 'field1');
        expect(fieldValid).to.be.true;
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('multiple fields in validation result', function (done) {


    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: function () {
            return true;
          }
        },
        {
          fields: 'field2',
          validator: function () {
            return true;
          }
        }
      ],
      field1: 'test',
      field2: 'test'
    }).create();

    let validationResult = AdvValidationManager.create().validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult;
        var fieldValid = isFieldValid(result, 'field1');
        expect(fieldValid).to.be.true;
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('multiple fields in validation result - failed validation', function (done) {

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: function () {
            return false;
          }
        },
        {
          fields: 'field2',
          validator: function () {
            return true;
          }
        }
      ],
      field1: 'test',
      field2: 'test'
    }).create();

    let validationResult = AdvValidationManager.create().validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult;
        var fieldValid = isFieldValid(result, 'field1');
        expect(fieldValid).to.be.false;
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('multiple fields in validation result - failed validation - with validation message', function (done) {

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: function () {
            return false;
          },
          validationMessage: 'hello world'
        },
        {
          fields: 'field2',
          validator: function () {
            return true;
          }
        }
      ],
      field1: 'test',
      field2: 'test'
    }).create();

    let validationResult = AdvValidationManager.create().validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult;
        var fieldValid = isFieldValid(result, 'field1');
        expect(fieldValid).to.be.false;
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('single field in multiple validation definitions - validation success', function (done) {

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: function () {
            return true;
          }
        },
        {
          fields: ['field2', 'field1'],
          validator: function () {
            return true;
          }
        }
      ],
      field1: 'test',
      field2: 'test'
    }).create();

    let validationResult = AdvValidationManager.create().validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult;
        var fieldValid = isFieldValid(result, 'field1');
        expect(fieldValid).to.be.true;
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('single field in multiple validation definitions - validation failed', function (done) {

    let sampleObject = Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: function () {
            return true;
          }
        },
        {
          fields: ['field2', 'field1'],
          validator: function () {
            return false;
          }
        }
      ],
      field1: 'test',
      field2: 'test'
    }).create();

    let validationResult = AdvValidationManager.create().validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult;
        var fieldValid = isFieldValid(result, 'field1');
        expect(fieldValid).to.be.false;
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

});
