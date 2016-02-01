import env from '../config/environment';
import configuration from 'ember-advanced-validations/configuration';

export function initialize(/* application */) {
  const validationConfig = env['adValidations'] || {};
  configuration.load(validationConfig);
}

export default {
  name: 'read-config',
  initialize
};
