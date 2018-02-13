import Service from '@ember/service';
import EmberObject from '@ember/object';
import Controller from '@ember/controller';
import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';

import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';
import AdvValidator from 'ember-advanced-validations/mixins/adv-validator';


describe('Unit : Service : adv validation manager - configuration', function () {
  setupTest('service:adv-validation-manager', {
      needs: ['service:i18n']
  });

  it('exists', function () {
    let service = this.subject();
    expect(service).to.exist;
  });


  var plainJson_ConfigObject = Controller.extend(AdvValidable, {
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

  var emberObject_ConfigObject = Controller.extend(AdvValidable, {
    validations: [
      {
        fields: 'field1',
        validator: 'test-validator',
        config: EmberObject.extend({}).create({
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


        let testValidator = Service.extend(AdvValidator, {
          validate: function (field, config) {
            return config.length === 1 && config.favouriteJsFramework === 'EmberJS';
          },
          isAsync: false
        });

        this.register('validator:test-validator', testValidator);

        let validationResult = service.validateObject(validationObject);
        expect(validationResult).to.exist;
        validationResult
          .then((vResult) => {
            let result = vResult.result;
            expect(result).to.exist;
            expect(result.length).to.equal(1);
            expect(result[0]).to.deep.equal({fields:'field1', result: [], params: {}}, JSON.stringify(result[0]));
            done();
          })
          .catch((e) => {
            done(e);
          });
      });
    });


  it('config attribute has the same name as validator and there is just 1 validator specified', function (done) {
    let service = this.subject();


    let testValidator = Service.extend(AdvValidator, {
      validate: function (arg, config) {
        return config['test-validator'] === 1 && arg === 'test';
      },
      isAsync: false
    });

    var validationObject = Controller.extend(AdvValidable, {
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
      .then((vResult) => {
        let result = vResult.result;
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({fields:'field1', result: [], params: {}}, JSON.stringify(result[0]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});
