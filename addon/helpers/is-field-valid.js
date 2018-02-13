import { helper } from '@ember/component/helper';
import { assert } from '@ember/debug';
import { isNone, isPresent, isEmpty } from '@ember/utils';

export function isFieldValid(validationResult, field){
  if (isNone(validationResult) || isNone(validationResult.result)){
    return true;
  }
  assert('Field to get validation result is not provided for isFieldValid helper', isPresent(field));

  let fieldResultList = validationResult.result.filter((result) => {
    return isSingleFieldValidated(result.fields, field);
  });

  if (isEmpty(fieldResultList)){
    return true;
  }

	return fieldResultList.every((fieldResult) => {
		if (fieldResult.result.length === 0){
			return true;
		}

		return fieldResult.result.every((res) => res === true);
	});


}

export function isFieldValidHelper(params, hash) {

  assert(isPresent(hash), 'ValidationResult and field not specified - assign them in helper\'s hash');


  let validationResult = hash.validationResult;
  let field = hash.field;

  return isFieldValid(validationResult, field);
}

function isSingleFieldValidated(field, resultFields) {
  if (Array.isArray(field)) {
    return isPresent(field.find((f)=> f === resultFields));
  } else {
    return field === resultFields;
  }
}

export default helper(isFieldValidHelper);
