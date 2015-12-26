import Ember from 'ember';
import AdvValidator from '../mixins/adv-validator';

/**
 * Checks if field contains just digits and no letters.
 */
export default Ember.Service.extend(AdvValidator, {

  validate: function (field) {
    return Ember.$.isNumeric(field);
  },

  isAsync: false,
  validatorMessage: 'is_number'

});
