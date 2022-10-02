# Ember-advanced-validations

[![Build Status](https://travis-ci.org/AnnotationSro/ember-advanced-validations.svg?branch=master)](https://travis-ci.org/AnnotationSro/ember-advanced-validations)

A quick summary of features provided by this validation framework:

* Validate any Ember object, such as ember-data model, [Object](http://emberjs.com/api/classes/Ember.Object.html), [Controller](http://emberjs.com/api/classes/Ember.Controller.html), .. basically anything
* Apply pre-defined validations or easily **create your own** (and reuse them afterwards)
* Configure validations
* Run validations in async (by default - without the need to configure it)
* Apply validations on multiple fields _(e.g. when field1 is empty, field2 is required)_
* Apply multiple validations on the same field _(e.g. this field must not be empty and it must be an integer and it must be greater than 10)_
* Conditionally run validations
    * based on simple conditions _(e.g. when field1 equals some value, then run this validation)_
    * based on other validations _(e.g. run this validation only if these two validations pass)_
* Validation messages per field
    * Full support of i18n (via [ember-i18n addon](https://github.com/jamesarosen/ember-i18n))
    * Custom validation messages can override default ones provided by this framework    
* helper to check if speficiec [field is valid or retrieve its validation message](#validation-helpers)

# Deprecation warning
This addon is no longer actively developed. I will try my best to provide some kind of support for this addon, but I cannot make any promises :(

# Usage

  To run a validation on an object, run:
  ```
   validationService: Ember.inject.service('adv-validation-manager'),


    this.get('validationService').validateObject(objectToValidate)
        .then((validationResult) => {
        //handle validationResult
    });
  ```

  An object you want to validate must have a `validations` array with validation definitions:

```
validations: [
    Numeric: 'field1', // 'field1' must be a number
    NotEmpty: ['field2', 'field3'] // 'field2' and 'field3' must be both non-empty
]
```
You can also define validations in more complex way that enables more customizations (explained below):
  ```
  validations: [
    {
      fields: 'field1',
      validator: 'Numeric'
    },
    {
      fields: ['field2', 'field3'],
      validator: 'NotEmpty'
    }
  ]
  ```

Note that both notations above are equivalent, the second one however enables more features and more customization options like these:

| Attribute           | Description                                                                                                                                                                                                                                                                                                                                                            |
|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `fields`            | one or multiple object fields/properties that you want to validate (they will be passed as input into validation function)                                                                                                                                                                                                                                             |
| `validator`         | _string_ with a name of a validation or a validation function (see below for more about [validation functions](#custom-validations))                                                                                                                                                                                                                                   |
| `config`            | a JSON with configuration passed into validation function                                                                                                                                                                                                                                                                                                              |
| `id`                | validation definition unique ID (used together with `dependsOn` property described below)    |  
|`customValidationId` | identifier to use in the result to identify field (or group of fields) that the validation result is about - handy for complex validations or when one field has multiple validations and you want to distinguish them |                                                                                                                                                                             
| `runIf`             | condition when a validation should be enabled; could be a _string_ (property on object being validated), array of _strings_ (properties) or _runIf function_ (see below for [more info](#conditional-validations))                                                                                                                                                     |
| `dependsOn`         | ID of a depending validation definition; this validation will be run only if validation definition resolves as _true_/_valid_                                                                                                                                                                                                                                          |
| `validationMessage` | message the be used when field/fields are invalid; if you use [ember-i18n](https://github.com/jamesarosen/ember-i18n) addon, `validationMessage` will be automatically passed as a key to ember-i18n and you will be provided with a translated message,(this can be configured in [global configuration](#global-configuration) - by default, ember-i18n is not used) |
| `realtime`          | _boolean_ property; if _true_ this validation will be run automatically whenever any of the `fields` properties change (default is _false_); to define a debounce time, you can optionally configure the debounce in `config` JSON with parameter `debounceTime` or in [global configuration](#global-configuration)                                                   |
| `params`            | JSON that won't affect validation in any way - it is just a way to pass parameters from validation object to controller or wherever you process the validation result                                                                                                                                                                                                  |

### Validation parameters
Optionally you can pass a JSON with validation parameters to the validation process. Validation parameters will be available in `runIf` and `validate` functions as a last argument.

```
let params = {hello: 'world'};

this.get('validationService').validateObject(objectToValidate, params)
```

### Available pre-defined validations

| Validation name | Description                                                                | Configuration                           |
|-----------------|----------------------------------------------------------------------------|-----------------------------------------|
| `Length`        | a field must be a specific length to be valid                              | `exactLength`, `minLength`, `maxLength` |
| `NotEmpty`     | a field must be non-empty to be valid                                      |                                         |
| `NumberValue`  | a field must be a number and optionally it must be within a specific range | `minValue`, `maxValue`                  |
| `Numeric`       | a field must be contain of only numeric characters 0-9                     |                                         |
| `Regex`         | a field must satisfy specified Regular Expression to be valid              | `regex`, `flags`                        |

### Custom validations
You can easily create your own validation - either with validation definition or globally available for all validation for all objects.
### Custom validations within validation definition

All fields defined in `fields` are passed into validation function (in order specified in `fields`)
```
  validations: [
        {
          fields: ['field1', 'field2'],
          validator: function (field1Value, field2Value) {
            return field1Value === 'test' && field2Value === 42;
          }
        }
    ]
```
### Custom validations accesible globally
If you want to reuse a specific validation it is a good idea to define it once.
All you need to do is to create validation file in `app/validators/` directory (you can also use a generator for this - just run `ember generate adv-validator <validator-name>`).

**app/validators/my-validator.js**
```
import Ember from 'ember';
import AdvValidator from 'adv-validator';

export default Ember.Service.extend(AdvValidator, {

  validate: function (config, field1, field2, field3) { //any number of fields based on your validation
   //TODO your validator goes here
   return true;
  }
});
```
Usage:
 ```
  validations: [
    {
      fields: 'field1',
      validator: 'MyValidator'
    }
  ]
  ```

Besides a required `validate` function you can also define these properties:

| Property            | Description                                                                   |   |
|---------------------|-------------------------------------------------------------------------------|---|
| `isAsync`           | if true, the validation is required to return a _Promise_; default is _false_ |   |
| `validationMessage` | default validation message shown when validation is invalid                   |   |

## Conditional validations
Sometimes you do not want a certain validation to be executed. For this you can use `runIf` property in validation definition.
```
export default Ember.Controller.extend({

     runProperty1: true,  //<---- ordinary boolean property
     runProperty2: false //<---- ordinary boolean property

      validations: [
        {
          fields: 'field1',
          validator: 'numeric',
          runIf: 'runProperty1' <---- this validation will be executed, because 'runProperty1' is currently 'true'
        },
        {
          fields: 'field1',
          validator: 'test-validator',
          runIf: ['runProperty1', 'runProperty2'] // <--- will ne run, because at least one of the properties is currently 'false'
        }
      ],
      field1: 'test'

    }
```

Optionally you can run a certain validation based on some dynamic condition:
```
 export default Ember.Controller.extend(AdvValidable, {
      validations: [
        {
          fields: 'field1',
          validator: 'NotEmpty',
          runIf: [
            'field2', //<--- list of fields that will be passed as input parameters to runIf function            
            'field3',
            function (f2, f3, validationConfig, validationParams) { //values of fields specified above in the same order + validation config (see 'config' attribute in chapter 'Usage' in README) + validation params (see chapter README 'Validation parameters')
              return f2 === 'runMe';
            }
          ]
        }
      ],
      field1: 'test',
      field2: 'runMe',
      field3: 'hello'
    }
```
Complete list of arguments of `runIf` function are (in this order): fields that are being validated, validation configuration,

## Validation helpers

You can make use of 2 helpers provided by this addon:
 - **getValidationMessage** - retrieves validation message for specified field
 - **isFieldValid** - returns simple true/false if specified field is valid

```
{{getValidationMessage field='myField' validationResult=validationResult}}
```

```
{{isFieldValid field='myField' validationResult=validationResult}}
```
or in JS
```
import {isFieldValid, getValidationMessage} from 'ember-advanced-validations/helpers/is-field-valid';

var fieldValid = isFieldValid(validationResult, 'myField');
var validationMessage = getValidationMessage(validationResult, 'myField');
```


## Global configuration

In your `config/environmnet.js` file you can configure ember-advanced-validations:
```
var ENV = {
 ...
   adValidations: {
      i18n_enabled: false, //true if ember-i18n translations for validation messages should be enabled; default is false
      realtime_debounce: 500 //applied for 'realtime' validations; the validation is executed after this timeout (in msec)
    }
 ...

}
```
