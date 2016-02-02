import Ember from 'ember';


export function getValidationMessage(validationResult, field) {

  if (Ember.isNone(validationResult) || Ember.isEmpty(validationResult.result)){
    return "";
  }

  let resultObject = validationResult.result.find((res)=> {
    if (Array.isArray(res.fields)) {
      return res.fields.contains(field);
    } else {
      return res.fields === field;
    }
  });

  if (Ember.isNone(resultObject)) {
    //no validation message for this field
    return "";
  }

  let messages = resultObject.result;
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
