import $ from 'jquery';
import { isPresent } from '@ember/utils';
import { assert } from '@ember/debug';
import Service from '@ember/service';
import AdvValidator from '../mixins/adv-validator';

/**
 * Checks if field is a number in a certain range.
 * If a field is not a number, field will be immediately marked as invalid.
 *
 * Configuration:
 *  - maxValue - field's value must be less or equal to this parameter
 *  - minValue - field's value must be greater or equal to this parameter
 *
 * At least on of these configuration parameters must be specified.
 * On case both parameters are specified, field must satisfy both restrictions.
 */
export default Service.extend(AdvValidator, {

  validate: function (field, config) {

    assert(
      "At least one configuration parameter of maxValue or minValue must be specified for number-value validator",
      isPresent(config) && (isPresent(config.maxValue) || isPresent(config.minValue))
    );

    if (!$.isNumeric(field)){
      return false;
    }

    let maxValue = config.maxValue;
    let minValue = config.minValue;

    let result = false;

    if (maxValue) {
      result = result || field <= maxValue;
    }

    if (minValue) {
      result = result || field >= minValue;
    }

    return result;
  },

  isAsync: false,
  validationMessage: 'validation.number_value'

});
