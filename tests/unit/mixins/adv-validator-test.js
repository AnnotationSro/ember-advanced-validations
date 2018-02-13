import EmberObject from '@ember/object';
import AdvValidatorMixin from 'ember-advanced-validations/mixins/adv-validator';
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('Unit : Mixin : adv validator', function(){
 it('works', function() {
    let AdvValidatorObject = EmberObject.extend(AdvValidatorMixin);
    let subject = AdvValidatorObject.create();
    expect(subject).to.exist;
  });

});
