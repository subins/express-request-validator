
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
	validator.type = null;
	validator.paramName = null;
	validator.minLength = null;
	validator.maxLength = null;
	validator.validations=[];
	return validator;
}
validator.params = function(name) {
	validator.init();
	validator.type = "params";
	validator.paramName = name;
	return validator;
}
validator.body = function(name) {
	validator.init();
	validator.type = "body";
	validator.paramName = name;
	return validator;		
}
validator.query = function(name) {
	validator.init();
	validator.type = "query";
	validator.paramName = name;	
	return validator;
}

validator.notEmpty = function() {
	validator.validations.push("notEmpty");
	return validator;
}
validator.isNumber = function() {
	validator.validations.push("isNumber");
	return validator;
}
validator.minLength = function(length) {
	validator.validations.push("minLength");
	validator.minLength = length;
	return validator;
}
validator.maxLength = function(length) {
	validator.validations.push("maxLength");
	validator.maxLength = length;
	return validator;
}
validator.isEmail = function(length) {
	validator.validations.push("isEmail");
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
					return res.send(400, {
						message: "validation failure '"+ name +"' for field "+ val.paramName +", in "+ val.type
					});
				}
			}
			next();
		}
	})(validator);
	return f;
}
module.exports = validator;