/* jshint expr:true */
import Ember from 'ember';
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import {
  getValidationMessage
} from 'ember-advanced-validations/helpers/get-validation-message';

import AdvValidationManager from 'ember-advanced-validations/services/adv-validation-manager';
import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';

describe('GetValidationMessageHelper', function() {


  it('single validation', function (done) {

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: function () {
            return false;
          },
          validationMessage: 'hello world'
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
        var message = getValidationMessage(result, 'field1');
        expect(message).to.equal('hello world');
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('valid result', function (done) {

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: function () {
            return true;
          },
          validationMessage: 'hello world'
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
        var message = getValidationMessage(result, 'field1');
        expect(message).to.equal('');
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});
