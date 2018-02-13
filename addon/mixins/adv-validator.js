/*jshint unused:false*/
import { assert } from '@ember/debug';

import Mixin from '@ember/object/mixin';

/**
 * An instance of AdvancedValidator
 */
export default Mixin.create({
  validate(){
    assert("You have to override this method with your own validation alogrithm");
  },

  isAsync: false,
  validationMessage:'',
  config: {}
});
