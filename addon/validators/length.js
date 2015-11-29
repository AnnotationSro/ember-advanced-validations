import Ember from 'ember';
import AdvValidator from '../mixins/adv-validator';

/**
 * Checks if field is long enough - works for strings, number,... - it basically calls toString() and then checks for length.
 * Available configuration:
 *  - maxLength - field's length must be greater or equal to this parameter
 *  - minLength - field's length must be less or equal to this parameter
 *  - exactLength - field's length must be equal to this parameter
 *
 * At least one configuration parameter must be specified.
 *
 * All configuration parameters must be satisfied to mark the field as valid.
 * Eg. when you configure maxLength=5, minLength=1, exactLength=3 -> field will be always invalid
 */
export default Ember.Service.extend(AdvValidator, {

  validate: function (config, field) {
    Ember.assert(`Cannot run length validation for null/undefined field: ${field}`, Ember.isPresent(field));
    Ember.assert('No configuration specified for length validation.', Ember.isPresent(config) && Object.keys(config).length > 0);

    let text = field.toString();

    let exact = config.exactLength;
    let max = config.maxLength;
    let min = config.minLength;

    Ember.assert('At least one of maxLength, minLength, exactLength configuration parameters must be specified.', Ember.isPresent(exact) || Ember.isPresent(max) || Ember.isPresent(min));

    let result = false;

    if (exact){
      result = result || text.length === exact;
    }

    if (min){
      result = result || text.length >= min;
    }

    if (max){
      result = result || text.length <= max;
    }

    return result;
  },

  isAsync: false,
  validatorMessage: 'string_length'

});
