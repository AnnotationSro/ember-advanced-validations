import Ember from 'ember';


export function isFieldValid(validationResult, field){
  Ember.assert('Validation result is not provided for isFieldValid helper', Ember.isPresent(validationResult));
  Ember.assert('Field to get validation result is not provided for isFieldValid helper', Ember.isPresent(field));

  let fieldResult = validationResult.find((result) => {
    return isSingleFieldValidated(result.fields, field);
  });

  if (Ember.isNone(fieldResult)){
    return null;
  }

  if (fieldResult.result.length === 0){
    return true;
  }

  if (fieldResult.result.length === 1){
    return fieldResult.result[0];
  }

  return fieldResult.result;
}

export function isFieldValidHelper(params, hash) {

  Ember.assert(Ember.isPresent(hash), 'ValidationResult and field not specified - assign them in helper\'s hash');


  let validationResult = hash.validationResult;
  let field = hash.field;

  return isFieldValid(validationResult, field);
}

function isSingleFieldValidated(field, resultFields) {
  if (Array.isArray(field)) {
    return Ember.isPresent(field.find((f)=> f === resultFields));
  } else {
    return field === resultFields;
  }
}

export default Ember.Helper.helper(isFieldValidHelper);
