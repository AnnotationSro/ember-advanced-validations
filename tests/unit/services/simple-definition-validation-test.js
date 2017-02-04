import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';

import Ember from 'ember';
import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';
import AdvValidator from 'ember-advanced-validations/mixins/adv-validator';


describe(
  'Unit : Service : adv validation manager - simple definition',
  function () {
    setupTest('service:adv-validation-manager', {
        needs: ['service:i18n']
    });

    it('exists', function () {
      let service = this.subject();
      expect(service).to.exist;
    });

    it('validates single field', function (done) {
      let service = this.subject();

      let sampleObject = Ember.Controller.extend(AdvValidable, {
        validations: [
          {'test-validator': ['field1']}
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
          expect(result[0]).to.deep.equal({fields:'field1', result: [], params: {}}, JSON.stringify(result[0]));

          expect(vResult.valid).to.be.true;
          expect(vResult.target).to.deep.equal(sampleObject);
          done();
        })
        .catch((e) => {
          done(e);
        });
    });

    it('validates multiple field', function (done) {
      let service = this.subject();

      let sampleObject = Ember.Controller.extend(AdvValidable, {
        validations: [
          {'test-validator': ['field1', 'field2']}
        ],
        field1: 'test',
        field2: 'test2'
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
          expect(result.length).to.equal(2);
          expect(result[0]).to.deep.equal({fields:'field1', result: [], params: {}}, JSON.stringify(result[0]));
          expect(result[1]).to.deep.equal({fields:'field2', result: [], params: {}}, JSON.stringify(result[1]));

          expect(vResult.valid).to.be.true;
          expect(vResult.target).to.deep.equal(sampleObject);
          done();
        })
        .catch((e) => {
          done(e);
        });
    });

    it('validates multiple validators', function (done) {
      let service = this.subject();

      let sampleObject = Ember.Controller.extend(AdvValidable, {
        validations: [
          {'test-validator': ['field1']},
          {'test-validator-invalid': ['field2']}
        ],
        field1: 'test',
        field2: 'test'
      }).create();


      let testValidator = Ember.Service.extend(AdvValidator, {
        validate: function () {
          return true;
        },
        isAsync: false
      });

      this.register('validator:test-validator', testValidator);

      let testValidatorInvalid = Ember.Service.extend(AdvValidator, {
        validate: function () {
          return false;
        },
        isAsync: false
      });

      this.register('validator:test-validator-invalid', testValidatorInvalid);

      let validationResult = service.validateObject(sampleObject);
      expect(validationResult).to.exist;
      validationResult
        .then((vResult) => {
          let result = vResult.result;
          expect(result).to.exist;
          expect(result.length).to.equal(2);
          expect(result[1]).to.deep.equal({fields:'field1', result: [], params: {}}, JSON.stringify(result[0]));
          expect(result[0]).to.deep.equal({fields:'field2', result: [false], params: {}}, JSON.stringify(result[1]));

          expect(vResult.valid).to.be.false;
          expect(vResult.target).to.deep.equal(sampleObject);
          done();
        })
        .catch((e) => {
          done(e);
        });
    });


    it('validates multiple validators - same field', function (done) {
      let service = this.subject();

      let sampleObject = Ember.Controller.extend(AdvValidable, {
        validations: [
          {'test-validator': ['field1']},
          {'test-validator-invalid': ['field1']}
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

      let testValidatorInvalid = Ember.Service.extend(AdvValidator, {
        validate: function () {
          return false;
        },
        isAsync: false
      });

      this.register('validator:test-validator-invalid', testValidatorInvalid);

      let validationResult = service.validateObject(sampleObject);
      expect(validationResult).to.exist;
      validationResult
        .then((vResult) => {
          let result = vResult.result;
          expect(result).to.exist;
          expect(result.length).to.equal(2);
          expect(result[0]).to.deep.equal({fields:'field1', result: [false], params: {}}, JSON.stringify(result[0]));
          expect(result[1]).to.deep.equal({fields:'field1', result: [], params: {}}, JSON.stringify(result[0]));

          expect(vResult.valid).to.be.false;
          expect(vResult.target).to.deep.equal(sampleObject);
          done();
        })
        .catch((e) => {
          done(e);
        });
    });
  }
);
