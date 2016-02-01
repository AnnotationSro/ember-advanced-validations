import Ember from 'ember';

const CONFIG_PROPERTIES = {
  i18n_enabled: false
};

function getConfigValue(property){
  Ember.assert(`Ember-advanced-validations configuration property is null or undefined`, Ember.isPresent(property));
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
    Ember.assert(`Ember-advanced-validations configuration property is null or undefined`, Ember.isPresent(propertyName));

    CONFIG_PROPERTIES[propertyName] = value;
  },

  isI18N(){
    return getConfigValue('i18n_enabled');
  }
};
