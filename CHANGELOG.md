## 1.6.0
  - added validation parameters

## 1.4.0
  - got rid of lodash dependency (shaved of 30KB gzipped)

## 1.1.0
- validation result contains not only detailed results per field, but also:
  - information if object being validated is valid or not (property "valid" - true/false)
  - the object being validated itself (property "target" - the same object that was passed to _validate()_ method)

## 1.0.1
- added support for conditional validations (__runIf__ and __dependsOn__)
- added _Usage guide_


## 0.1.0
 - initial release
