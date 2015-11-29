import Ember from 'ember';
import AdvValidator from '../mixins/adv-validator';

/**
 * Checks if field satisfies a specific regex expression.
 * Note, that regex passed as configuration parameter must be properly escaped!
 *
 * Configuration:
 *  - expression
 *  - flags [optional]
 *
 *  Configuration example:
 *  {
 *  "expression":"[abc]+"
 *  "flags": "gi"
 *  }
 */
export default Ember.Service.extend(AdvValidator, {

  validate: function (config, field) {

    Ember.assert(
      "Regex validation does not contain necessary configuration parameter 'regex'",
      Ember.isPresent(config) && Ember.isPresent(config.regex)
    );

    if (typeof field === "undefined" || field === null){
      return false;
    }

    var regex = new RegExp(config.regex, config.flags);
    return !!regex.exec(field);
  },

  isAsync: false,
  validatorMessage: 'regex'

});
