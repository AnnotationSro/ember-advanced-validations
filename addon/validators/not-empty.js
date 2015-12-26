import Ember from 'ember';
import AdvValidator from '../mixins/adv-validator';

/**
 * Checks if a field is not empty (null, undefined or empty string).
 * If optional config "trim" attribute is specified, starting and trailing whitespaces will be trimmed before validation -
 * this is handy if you want to mark string of whitespaces only as invalid as well
 *
 * Configuration
 *  - trim - true/false (default: false)
 */
export default Ember.Service.extend(AdvValidator, {

  validate: function (arg, config) {
    if (Ember.isPresent(config) && config.trim === true){
      arg = arg.trim();
    }
    return typeof arg !== 'undefined' && arg !== null && arg !== '';
  },

  isAsync: false
});
