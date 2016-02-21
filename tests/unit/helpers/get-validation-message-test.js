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


  if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
      if (this === null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value;
        }
      }
      return undefined;
    };
  }


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
