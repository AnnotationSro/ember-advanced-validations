import Ember from 'ember';


export function getValidationMessage(validationResult, field) {

  if (Ember.isNone(validationResult) || Ember.isEmpty(validationResult.result)){
    return "";
  }

  let invalidFields = validationResult.result
  .filter((res)=> {
    if (Array.isArray(res.fields)) {
      return res.fields.indexOf(field) > -1;
    } else {
      return res.fields === field;
    }
  })
  .filter((res)=>{
    return Ember.isPresent(res.result); //there is something wrong/invalid in this validation
  })
  ;

  if (Ember.isEmpty(invalidFields)) {
    //no validation message for this field
    return "";
  }

  //pick only the first validation error -> this is probably not the best way to handle this (we should probably return all messages not just the first one)
  let messages = invalidFields[0].result;
  if (Ember.isEmpty(messages)) {
    //no validation message specified
    return "";
  }


  if (messages.length === 1) {
    return messages[0];
  } else {
    return messages;
  }

}

export function getValidationMessageHelper(params, hash) {

  Ember.assert(Ember.isPresent(hash), 'ValidationResult and field not specified - assign them in helper\'s hash');

  let validationResult = hash.validationResult;
  let field = hash.field;

  return getValidationMessage(validationResult, field);
}

export default Ember.Helper.helper(getValidationMessageHelper);
