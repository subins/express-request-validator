
//req.query.id
//req.body.id
//req.params.id


var nodeValidator = require('validator');
var validator = {};

var validationMethods= {
	'notEmpty': function(name) {
		if(name && name!="") {
			return true;
		} else {
			return false;
		}
	},
	'isNumber': function(value) {
		return !isNaN(parseFloat(value)) && isFinite(value);
	},
	'isEmail': function(value) {
		return nodeValidator.isEmail(value);
	},
	'minLength': function(value, length) {
		if(value && value.length >= length) {
			return true;
		} else {
			return false;
		}
	},
	'maxLength': function(value, length) {
		if(value && value.length <= length) {
			return true;
		} else {
			return false;
		}
	}
	
};

validator.init = function() {
	validator.curr = {};
	validator.curr.type = null;
	validator.curr.paramName = null;
	validator.curr.minLength = null;
	validator.curr.maxLength = null;
	validator.curr.validations=[];
	return validator;
}
validator.params = function(name) {
	validator.init();
	validator.curr.type = "params";
	validator.curr.paramName = name;
	return validator;
}
validator.body = function(name) {
	validator.init();
	validator.curr.type = "body";
	validator.curr.paramName = name;
	return validator;		
}
validator.query = function(name) {
	validator.init();
	validator.curr.type = "query";
	validator.curr.paramName = name;	
	return validator;
}

validator.notEmpty = function() {
	validator.curr.validations.push("notEmpty");
	return validator;
}
validator.isNumber = function() {
	validator.curr.validations.push("isNumber");
	return validator;
}
validator.minLength = function(length) {
	validator.curr.validations.push("minLength");
	validator.curr.minLength = length;
	return validator;
}
validator.maxLength = function(length) {
	validator.curr.validations.push("maxLength");
	validator.curr.maxLength = length;
	return validator;
}
validator.isEmail = function(length) {
	validator.curr.validations.push("isEmail");
	return validator;
}
validator.m =  function() {
	return validator.middleware();
}
validator.middleware =  function() {
	var f =  (function(val) {
		return function(req,res,next){
			var value = null;
			if(val.type === "query") {
				value = req.query[val.paramName];
			}
			if(val.type === "body") {
				value = req.body[val.paramName];
			}
			if(val.type === "params") {
				value = req.params[val.paramName];
			}
			for(var i=0; i < val.validations.length; i++) {
				var name = val.validations[i];
				var func = validationMethods[name];
				var secondParam = null;
				if(name === "minLength") {
					secondParam = val.minLength;
				}
				if(name === "maxLength") {
					secondParam = val.maxLength;
				}
				if(!func(value, secondParam)) {
					return res.status(400).send({
						message: "validation failure '"+ name +"' for field '"+ val.paramName +"', in "+ val.type
					});
				}
			}
			next();
		}
	})(validator.curr);
	return f;
}
module.exports = validator;