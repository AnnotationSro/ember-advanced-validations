import { expect } from 'chai';
import { describeModule, it } from 'ember-mocha';

import Ember from 'ember';
import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';
import AdvValidator from 'ember-advanced-validations/mixins/adv-validator';


describeModule('service:adv-validation-manager', 'Unit : Service : adv validation manager - dependsOn', {
  // Specify the other units that are required for this test.
}, function () {


  it('should run - 1 depending validator', function (done) {
    let service = this.subject();

    let assertValidatorRun = 0;

    var validationObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'test-validator',
          dependsOn: 'my super validator'
        },

        {
          id: 'my super validator',
          fields: 'field2',
          validator: 'test-validator'
        }
      ],
      field1: 'test',
      field2: 'test2',

      runProperty: true
    }).create();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function () {
        assertValidatorRun++;
        return true;
      },
      isAsync: false
    });

    this.register('validator:test-validator', testValidator);

    let validationResult = service.validateObject(validationObject);
    expect(validationResult).to.exist;
    validationResult
      .then((result) => {
        expect(result).to.exist;
        expect(result.length).to.equal(2);
        expect(result[0]).to.deep.equal({fields: 'field2', result: []}, JSON.stringify(result[0]));
        expect(result[1]).to.deep.equal({fields: 'field1', result: []}, JSON.stringify(result[1]));
        expect(assertValidatorRun).to.equal(2);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('should not run - 1 depending validator', function (done) {
    let service = this.subject();

    let assertValidatorRun = 0;

    var validationObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'test-validator',
          dependsOn: 'my super validator'
        },

        {
          id: 'my super validator',
          fields: 'field2',
          validator: 'test-validator'
        }
      ],
      field1: 'test',
      field2: 'test2',

      runProperty: true
    }).create();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function () {
        assertValidatorRun++;
        return false;
      },
      isAsync: false
    });

    this.register('validator:test-validator', testValidator);

    let validationResult = service.validateObject(validationObject);
    expect(validationResult).to.exist;
    validationResult
      .then((result) => {
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields: 'field2', result: [false]}, JSON.stringify(result[0]));
        expect(assertValidatorRun).to.equal(1);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('should run - 2 depending validators', function (done) {
    let service = this.subject();

    let assertValidatorRun = 0;

    var validationObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'test-validator',
          dependsOn: ['my super validator', 'my second validator']
        },

        {
          id: 'my super validator',
          fields: 'field2',
          validator: 'test-validator'
        },

        {
          id: 'my second validator',
          fields: 'field3',
          validator: 'test-validator'
        }
      ],
      field1: 'test',
      field2: 'test2',
      field3: 'test3',

      runProperty: true
    }).create();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function () {
        assertValidatorRun++;
        return true;
      },
      isAsync: false
    });

    this.register('validator:test-validator', testValidator);

    let validationResult = service.validateObject(validationObject);
    expect(validationResult).to.exist;
    validationResult
      .then((result) => {
        expect(result).to.exist;
        expect(result.length).to.equal(3);
        expect(result[0]).to.deep.equal({fields: 'field2', result: []}, JSON.stringify(result[0]));
        expect(result[1]).to.deep.equal({fields: 'field3', result: []}, JSON.stringify(result[1]));
        expect(result[2]).to.deep.equal({fields: 'field1', result: []}, JSON.stringify(result[2]));
        expect(assertValidatorRun).to.equal(3);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('should not run - 2 depending validators', function (done) {
    let service = this.subject();

    let assertValidatorRun = 0;

    var validationObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'test-validator',
          dependsOn: ['my super validator', 'my second validator']
        },

        {
          id: 'my super validator',
          fields: 'field2',
          validator: 'test-validator'
        },

        {
          id: 'my second validator',
          fields: 'field3',
          validator: 'test-validator2'
        }
      ],
      field1: 'test',
      field2: 'test2',
      field3: 'test3',

      runProperty: true
    }).create();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function () {
        assertValidatorRun++;
        return true;
      },
      isAsync: false
    });

    this.register('validator:test-validator', testValidator);

    let testValidator2 = Ember.Service.extend(AdvValidator, {
      validate: function () {
        assertValidatorRun++;
        return false;
      },
      isAsync: false
    });

    this.register('validator:test-validator2', testValidator2);

    let validationResult = service.validateObject(validationObject);
    expect(validationResult).to.exist;
    validationResult
      .then((result) => {
        expect(result).to.exist;
        expect(result.length).to.equal(2);
        expect(result[0]).to.deep.equal({fields: 'field2', result: []}, JSON.stringify(result[0]));
        expect(result[1]).to.deep.equal({fields: 'field3', result: [false]}, JSON.stringify(result[1]));
        expect(assertValidatorRun).to.equal(2);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


});
