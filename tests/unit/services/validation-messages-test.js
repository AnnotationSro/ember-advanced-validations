import { expect } from 'chai';
import { describeModule, it } from 'ember-mocha';

import Ember from 'ember';
import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';
import AdvValidator from 'ember-advanced-validations/mixins/adv-validator';
import EnTranslations from 'ember-advanced-validations/locales/en/translations';


describeModule('service:adv-validation-manager', 'Unit : Service : adv validation manager - validator message', {
  // Specify the other units that are required for this test.
  integration: true
}, function () {

  function initTestTranslations(container) {
    const i18n = container.lookup('service:i18n');
    EnTranslations['validation'] = {
      "test":"Nothing is valid!",
      "test2":"not again!",
      "testParams":"I am translated {0} {1}",
      "testParamsConfig":"I am translated {0} {config.testParam}",
      "override": "Hello world {0}"
    };
    i18n.addTranslations("en", EnTranslations);
  }


  /**
   * note that in all these tests need to have a TranslationInitializer executed before they
   */

  it('validates one field + module validator - custom validation message', function (done) {
    initTestTranslations(this.container);

    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'test-validator'
        }
      ],
      field1: 'test'
    }).create();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function () {
        return false;
      },
      isAsync: false,
      validationMessage: 'validation.test2'
    });

    this.register('validator:test-validator', testValidator);

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((result) => {
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: ['not again!']}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('validates one field + module validator - async - default validation message', function (done) {
    initTestTranslations(this.container);

    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'test-validator'
        }
      ],
      field1: 'test'
    }).create();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function () {
        let promise = new Ember.RSVP.Promise((resolve) => {
          setTimeout(function () {
            resolve(false);
          }, 100);
        });
        return promise;
      },
      isAsync: true
    });

    this.register('validator:test-validator', testValidator);

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((result) => {
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: [false]}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);

      });
  });

  it('validates one field + module validator - async - custom validation message', function (done) {
    initTestTranslations(this.container);

    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'test-validator'
        }
      ],
      field1: 'test'
    }).create();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function () {
        let promise = new Ember.RSVP.Promise((resolve) => {
          setTimeout(function () {
            resolve(false);
          }, 100);
        });
        return promise;
      },
      isAsync: true,
      validationMessage: 'validation.test'
    });

    this.register('validator:test-validator', testValidator);

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((result) => {
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: ['Nothing is valid!']}, JSON.stringify(result[0]));
        done();

      })
      .catch((e) => {
        done(e);

      });
  });

  it('formats validation message', function (done) {
    initTestTranslations(this.container);

    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: ['field1', 'field2'],
          validator: 'test-validator'
        }
      ],
      field1: 'test1',
      field2: 'test2'
    }).create();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function () {
        let promise = new Ember.RSVP.Promise((resolve) => {
          setTimeout(function () {
            resolve(false);
          }, 100);
        });
        return promise;
      },
      isAsync: true,
      validationMessage: 'validation.testParams'
    });

    this.register('validator:test-validator', testValidator);

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((result) => {
        expect(result).to.exist;
        expect(result.length).to.equal(1);

        expect(result[0]).to.deep.equal({
          fields: ['field1', 'field2'],
          result: ['I am translated test1 test2']
        }, JSON.stringify(result[0]));
        done();

      })
      .catch((e) => {
        done(e);

      });
  });

  it('formats validation message - with configuration parameters', function (done) {
    initTestTranslations(this.container);

    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: ['field1', 'field2'],
          validator: 'test-validator',
          config: {
            testParam: 'hello'
          }
        }
      ],
      field1: 'test1',
      field2: 'test2'
    }).create();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function () {
        let promise = new Ember.RSVP.Promise((resolve) => {
          setTimeout(function () {
            resolve(false);
          }, 100);
        });
        return promise;
      },
      isAsync: true,
      validationMessage: 'validation.testParamsConfig'
    });

    this.register('validator:test-validator', testValidator);

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((result) => {
        expect(result).to.exist;
        expect(result.length).to.equal(1);

        expect(result[0]).to.deep.equal({
          fields: ['field1', 'field2'],
          result: ['I am translated test1 hello']
        }, JSON.stringify(result[0]));
        done();

      })
      .catch((e) => {
        done(e);

      });
  });

  it('overrides default validation message', function (done) {
    initTestTranslations(this.container);

    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: ['field1', 'field2'],
          validator: 'test-validator',
          validationMessage: 'validation.override'
        }
      ],
      field1: 'test1',
      field2: 'test2'
    }).create();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function () {
        let promise = new Ember.RSVP.Promise((resolve) => {
          setTimeout(function () {
            resolve(false);
          }, 100);
        });
        return promise;
      },
      isAsync: true,
      validationMessage: 'validation.test'
    });

    this.register('validator:test-validator', testValidator);

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((result) => {
        expect(result).to.exist;
        expect(result.length).to.equal(1);

        expect(result[0]).to.deep.equal({
          fields: ['field1', 'field2'],
          result: ['Hello world test1']
        }, JSON.stringify(result[0]));
        done();

      })
      .catch((e) => {
        done(e);

      });
  });

});
