import Service from '@ember/service';
import Controller from '@ember/controller';
import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';

import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';
import AdvValidator from 'ember-advanced-validations/mixins/adv-validator';


describe(
  'Unit : Service : adv validation manager - multiple validators',
  function(){
    setupTest('service:adv-validation-manager', {
      // Specify the other units that are required for this test.
        needs: ['service:i18n']
    });

    it('validates one field per validation + direct function', function(done) {
      let service = this.subject();

      let sampleObject = Controller.extend(AdvValidable, {
        validations: [
          {
            fields: 'field1',
            validator: function() {
              return true;
            }
          },
          {
            fields: 'field2',
            validator: function(arg2) {
              return arg2===42;
            }
          }
        ],
        field1: 'test',
        field2: 42
      }).create();

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


    it('validates one field per validation + module & direct validator ', function(done) {
      let service = this.subject();

      let sampleObject = Controller.extend(AdvValidable, {
        validations: [
          {
            fields: 'field1',
            validator: 'test-validator'
          },
          {
            fields: 'field2',
            validator: function(arg){
              return arg === 42;
            }
          }
        ],
        field1: 'test',
        field2: 10000000
      }).create();


      let testValidator = Service.extend(AdvValidator,{
        validate: function(){
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
          expect(result[1]).to.deep.equal({fields:'field2', result: [false], params: {}}, JSON.stringify(result[1]));

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
