# express-request-validator
A validator middleware for express which can intercept requests, validate request body, params, param and respond with error code, message, all customisable.

http://subins.github.io/express-request-validator/

## Usage

```javascript
var v = require('express-request-validator');
app.route('/api/user')
		.get(v.query('email').notEmpty().isEmail().m(), userManagementController.listUsers)
		.post(v.body('name').notEmpty().m(), 
		      v.body('email').isEmail().m(),
		      v.body('password').minlength(7).maxlength(20).m(), 
		      userManagementController.create);
		      
app.route('/api/user/:email').get(v.params('email').notEmpty().isEmail().m(), userManagementController.readUser)		      
```		      

> for validating req.query.{paramname} use v.query method

> for validating req.params.{paramname} use v.params method

> for validating req.body.{paramname} use v.body method


> .m() returns the middleware.

## Validations

> notEmpty()

> isNumber()

> isEmail()

> minLength()

> maxLength()
