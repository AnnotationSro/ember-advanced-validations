import Ember from 'ember';
import AdvValidableMixin from 'ember-advanced-validations/mixins/adv-validable';
import { expect } from 'chai';
import { describe, it} from 'mocha';

describe('Unit : Mixin : adv validable', function () {
  it('works', function () {
    let AdvValidableObject = Ember.Object.extend(AdvValidableMixin);
    let subject = AdvValidableObject.create();
    expect(subject).to.exist;
  });
});

