import Ember from 'ember';
import AdvValidatorMixin from 'ember-advanced-validations/mixins/adv-validator';
import { expect } from 'chai';
import { describe, it} from 'mocha';

describe('Unit : Mixin : adv validator', function(){
 it('works', function() {
    let AdvValidatorObject = Ember.Object.extend(AdvValidatorMixin);
    let subject = AdvValidatorObject.create();
    expect(subject).to.exist;
  });

});
