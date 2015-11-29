/*jshint unused:false*/
import Ember from 'ember';

/**
 * An instance of AdvancedValidator
 */
export default Ember.Mixin.create({
  validate(){
    Ember.assert("You have to override this method with your own validation alogrithm");
  },

  isAsync: false,
  validationMessage:'',
  config: {}
});
