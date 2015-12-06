# Ember-advanced-validations

A quick summary of features provided by this validation framework:

* Validate any Ember object, such as ember-data model, [Object](http://emberjs.com/api/classes/Ember.Object.html), [Controller] (http://emberjs.com/api/classes/Ember.Controller.html), .. basically anything
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
 

  
# Usage
  
_**TBD**_


### Created with ♥ by Annotation



# Development instructions

If you want to contribute to this project, you can either open a new issue or create a pull request. Either way, we will greatly appreciate your help 😊.

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).