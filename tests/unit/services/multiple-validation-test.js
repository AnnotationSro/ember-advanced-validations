import { expect } from 'chai';
import { describeModule, it } from 'ember-mocha';

import Ember from 'ember';
import AdvValidable from 'ember-advanced-validations/mixins/adv-validable';
import AdvValidator from 'ember-advanced-validations/mixins/adv-validator';


describeModule('service:adv-validation-manager', 'Unit : Service : adv validation manager - multiple validators', {
  // Specify the other units that are required for this test.
}, function(){
  it('validates one field per validation + direct function', function(done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
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
      .then((result) => {
        expect(result).to.exist;
        expect(result.length).to.equal(2);
        expect(result[0]).to.deep.equal({fields:'field1', result: []}, JSON.stringify(result[0]));
        expect(result[1]).to.deep.equal({fields:'field2', result: []}, JSON.stringify(result[1]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });


  it('validates one field per validation + module & direct validator ', function(done) {
    let service = this.subject();

    let sampleObject = Ember.Controller.extend(AdvValidable, {
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
      field2: 42
    }).create();


    let testValidator = Ember.Service.extend(AdvValidator,{
      validate: function(){
        return true;
      },
      isAsync: false
    });

    this.register('validator:test-validator', testValidator);

    let validationResult = service.validateObject(sampleObject);
    expect(validationResult).to.exist;
    validationResult
      .then((result) => {
        expect(result).to.exist;
        expect(result.length).to.equal(2);
        expect(result[0]).to.deep.equal({fields:'field1', result: []}, JSON.stringify(result[0]));
        expect(result[1]).to.deep.equal({fields:'field2', result: []}, JSON.stringify(result[1]));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

});
