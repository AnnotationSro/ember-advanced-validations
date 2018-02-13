import { isPresent } from '@ember/utils';
import { assert } from '@ember/debug';

const CONFIG_PROPERTIES = {
  i18n_enabled: false,
  realtime_debounce: 500 //msec
};

function getConfigValue(property){
  assert(`Ember-advanced-validations configuration property is null or undefined`, isPresent(property));
  return CONFIG_PROPERTIES[property];
}

export default {

  load(config) {
    let hasOwnProperty = ({}).hasOwnProperty;
    for (let property in config){
      if (hasOwnProperty.call(config, property)) {
        CONFIG_PROPERTIES[property] = config[property];
      }
    }
  },

  setProperty(propertyName, value){
    assert(`Ember-advanced-validations configuration property is null or undefined`, isPresent(propertyName));

    CONFIG_PROPERTIES[propertyName] = value;
  },

  isI18N(){
    return getConfigValue('i18n_enabled');
  },

  getRealtimeDebounceMsec(){
    return getConfigValue('realtime_debounce');
  }
};
