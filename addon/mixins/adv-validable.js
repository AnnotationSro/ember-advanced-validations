import Ember from 'ember';

/*
 * Mixin that all controllers/components should implement, if they want to make use of this AdvancedValidations addon
 */
export default Ember.Mixin.create({
  validations: []
    /**

  validations:[
  {
    fields:'model.myAttr',
    validator:'NonEmptyValidator'
  },

  {
   fields:'myAttr2',
   validator: function(attr){
    return true;
    }
  },

  {
    fields:['myAttr3', 'myAttr4'],
    validator: 'MultipleFieldsValidator'
  },

  {
    fields:
  }


]

  **/
});
