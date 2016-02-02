import Ember from 'ember';


export function isFieldValid(validationResult, field){
  if (Ember.isNone(validationResult)){
    return true;
  }
  Ember.assert('Field to get validation result is not provided for isFieldValid helper', Ember.isPresent(field));

  let fieldResult = validationResult.result.find((result) => {
    return isSingleFieldValidated(result.fields, field);
  });

  if (Ember.isNone(fieldResult)){
    return true;
  }

  if (fieldResult.result.length === 0){
    return true;
  }

  return fieldResult.result.every((res) => res === true);
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
