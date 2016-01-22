import { expect } from 'chai';
import { describeModule, it } from 'ember-mocha';

import Ember from 'ember';
import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';
import AdvValidator from 'ember-advanced-validations/mixins/adv-validator';


describeModule('service:adv-validation-manager', 'Unit : Service : adv validation manager - combine validators', {
  // Specify the other units that are required for this test.
}, function () {

  it('combines 2 validators on the same field', function (done) {

    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: ['test-validator1', 'test-validator2']
        }
      ],
      field1: 'test'
    }).create();


    let testValidator1 = Ember.Service.extend(AdvValidator, {
      validate: function (arg) {
        return arg.length === 'test'.length;
      },
      isAsync: false
    });

    let testValidator2 = Ember.Service.extend(AdvValidator, {
      validate: function (arg) {
        return arg === 'test';
      },
      isAsync: false
    });

    this.register('validator:test-validator1', testValidator1);
    this.register('validator:test-validator2', testValidator2);

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

  it('combines 2 validators on the same field with configuration support per validation', function (done) {

    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: ['test-validator1', 'test-validator2'],
          config: {
            'test-validator2': {
              testConfiguration: 'test'
            }
          }
        }
      ],
      field1: 'test'
    }).create();


    let testValidator1 = Ember.Service.extend(AdvValidator, {
      validate: function (arg) {
        return arg.length === 'test'.length;
      },
      isAsync: false
    });

    let testValidator2 = Ember.Service.extend(AdvValidator, {
      validate: function (arg, config) {
        return arg === config.testConfiguration;
      },
      isAsync: false
    });

    this.register('validator:test-validator1', testValidator1);
    this.register('validator:test-validator2', testValidator2);

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

  it('combines 2 validators on the same field with global configuration support', function (done) {

    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: ['test-validator1', 'test-validator2'],
          config: {
            testConfiguration: 'test'
          }
        }
      ],
      field1: 'test'
    }).create();


    let testValidator1 = Ember.Service.extend(AdvValidator, {
      validate: function (arg, config) {
        return arg.length === 'test'.length && arg === config.testConfiguration;
      },
      isAsync: false
    });

    let testValidator2 = Ember.Service.extend(AdvValidator, {
      validate: function (arg, config) {
        return arg === config.testConfiguration;
      },
      isAsync: false
    });

    this.register('validator:test-validator1', testValidator1);
    this.register('validator:test-validator2', testValidator2);

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

  it('combines 2 validators on the same field and one validator fails', function (done) {

    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: ['test-validator1', 'test-validator2'],
          config: {
            testConfiguration: 'test'
          }
        }
      ],
      field1: 'test'
    }).create();


    let testValidator1 = Ember.Service.extend(AdvValidator, {
      validate: function (arg, config) {
        return arg.length === 'test'.length && arg === config.testConfiguration;
      },
      isAsync: false
    });

    let testValidator2 = Ember.Service.extend(AdvValidator, {
      validate: function (arg) {
        return arg === 'blah - this is something wrong that does not match "test"';
      },
      isAsync: false
    });

    this.register('validator:test-validator1', testValidator1);
    this.register('validator:test-validator2', testValidator2);

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: [false], params: {}}, JSON.stringify(result[0]));

        done();
      })
      .catch((e) => {
        done(e);
      });

  });

  it('combines 2 validators on the same field and one validator fails with custom validation message', function (done) {

    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: ['test-validator1', 'test-validator2'],
          config: {
            testConfiguration: 'test'
          }
        }
      ],
      field1: 'test'
    }).create();


    let testValidator1 = Ember.Service.extend(AdvValidator, {
      validate: function (arg, config) {
        return arg.length === 'test'.length && arg === config.testConfiguration;
      },
      isAsync: false
    });

    let testValidator2 = Ember.Service.extend(AdvValidator, {
      validate: function (arg) {
        return arg === 'blah - this is something wrong that does not match "test"';
      },
      validationMessage: 'this is not valid!',
      isAsync: false
    });

    this.register('validator:test-validator1', testValidator1);
    this.register('validator:test-validator2', testValidator2);

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field1', result: ['this is not valid!'], params: {}}, JSON.stringify(result[0]));

        done();
      })
      .catch((e) => {
        done(e);
      });

  });
});
