import Ember from 'ember';
import AdvValidator from 'adv-validator';


export default Ember.Service.extend(AdvValidator, {

  validate: function (config, field) {
   //TODO your validator goes here
  },

  isAsync: false

});
