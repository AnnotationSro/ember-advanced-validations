## TODO list 
 
 > “Right now I’m having amnesia and déjà vu at the same time. I think I’ve forgotten this before.” - Steven Wright


- [ ] document predefined validations (don't forget about documenting validationMessages, too!)
- [X] *runIf* option to make validations run conditionally - either based on fields' values or based on other validations ("why run *this* validation when *that* validation failed?")
- [X] create a blueprint to generate a new validation
- [X] create a helper _isFieldValid_ - it gets validation result and field name as parameters and returns true/false ( or maybe even validation message)
- [X] change order of arguments passed into validate function (config should be last, since it is not used as often as field values) **breaking change** 
- [ ] support alternative validation definitions:
       ```
        validations: [
	    	{
                notEmpty: ['field1', 'field2'] //field1 musn't be empty and field2 mustn't be empty - validation is applied per field, not on both fields at once,
            }, 
            {
    			fields: ['field3','field4'], //current implementation can be used for more advanced validations
	    		validator: 'Match',
		    	config: {
			    	someParams: 'Hello world'
			    }
		    }
    	]
```