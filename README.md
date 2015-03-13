# express-request-validator
A validator middleware for express which can intercept requests, validate request body, params, param and respond with error code, message, all customisable.

## Usage

```javascript
var v = require('express-request-validator');
app.route('/api/user')
		.get(v.query('email').notEmpty().isEmail().m(), admin.listUsers)
		.post(v.body('name').notEmpty().m(), v.body('email').isEmail().m(), 
		      users.hasAuthorization(['admin']), admin.createLocation);
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
