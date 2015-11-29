import { expect } from 'chai';
import { describeModule, it } from 'ember-mocha';

import Ember from 'ember';
import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';
import AdvValidator from 'ember-advanced-validations/mixins/adv-validator';


describeModule('service:adv-validation-manager', 'Unit : Service : adv validation manager - configuration', {
  // Specify the other units that are required for this test.
}, function () {

  it('exists', function () {
    let service = this.subject();
    expect(service).to.exist;
  });


  var plainJson_ConfigObject = Ember.Controller.extend(AdvValidable, {
    validations: [
      {
        fields: 'field1',
        validator: 'test-validator',
        config: {
          length: 1,
          favouriteJsFramework: 'EmberJS'
        }
      }
    ],
    field1: 'test'
  }).create();

  var emberObject_ConfigObject = Ember.Controller.extend(AdvValidable, {
    validations: [
      {
        fields: 'field1',
        validator: 'test-validator',
        config: Ember.Object.extend({}).create({
          length: 1,
          favouriteJsFramework: 'EmberJS'
        })
      }
    ],
    field1: 'test'
  }).create();

  [
    {validationObject: plainJson_ConfigObject, title: "plain JSON config"},
    {validationObject: emberObject_ConfigObject, title: "ember object config"}
  ].forEach((testParam) => {

      let {validationObject, title} = testParam;

      it(`${title}`, function (done) {
        let service = this.subject();


        let testValidator = Ember.Service.extend(AdvValidator, {
          validate: function (config) {
            return config.length === 1 && config.favouriteJsFramework === 'EmberJS';
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
            expect(result[0]).to.deep.equal({fields:'field1', result: []}, JSON.stringify(result[0]));
            done();
          })
          .catch((e) => {
            done(e);
          });
      });
    });


  it('config attribute has the same name as validator and there is just 1 validator specified', function (done) {
    let service = this.subject();


    let testValidator = Ember.Service.extend(AdvValidator, {
      validate: function (config, arg) {
        return config['test-validator'] === 1 && arg === 'test';
      },
      isAsync: false
    });

    var validationObject = Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'test-validator',
          config: {
            'test-validator': 1
          }
        }
      ],
      field1: 'test'
    }).create();

    this.register('validator:test-validator', testValidator);

    let validationResult = service.validateObject(validationObject);
    expect(validationResult).to.exist;
    validationResult
      .then((result) => {
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields:'field1', result: []}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


});
