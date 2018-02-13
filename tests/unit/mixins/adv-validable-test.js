import EmberObject from '@ember/object';
import AdvValidableMixin from 'ember-advanced-validations/mixins/adv-validable';
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('Unit : Mixin : adv validable', function () {
  it('works', function () {
    let AdvValidableObject = EmberObject.extend(AdvValidableMixin);
    let subject = AdvValidableObject.create();
    expect(subject).to.exist;
  });
});

