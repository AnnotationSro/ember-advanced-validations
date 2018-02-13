import $ from 'jquery';
import Service from '@ember/service';
import AdvValidator from '../mixins/adv-validator';

/**
 * Checks if field contains just digits and no letters.
 */
export default Service.extend(AdvValidator, {

  validate: function (field) {
    return $.isNumeric(field);
  },

  isAsync: false,
  validationMessage: 'validation.is_number'

});
