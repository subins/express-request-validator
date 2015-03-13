
//req.query.id
//req.body.id
//req.params.id


var nodeValidator = require('validator');
var validator = {};

var validationMethods= [
	"notEmpty": function(name) {
		if(name && name!="") {
			return true;
		} else {
			return false;
		}
	},
	"isNumber": function(value) {
		return !isNaN(parseFloat(value)) && isFinite(value);
	},
	"isEmail": function(value) {
		return nodeValidator.isEmail(value);
	}

	
];

validator.init = function() {
	validator.type = null;
	validator.paramName = null;
	validator.minLength = null;
	validator.maxLength = null;
	validator.validations=[];
}
validator.params = function(name) {
	validator.type = "params";
	validator.paramName = name;
	return validator;
}
validator.body = function(name) {
	validator.type = "body";
	validator.paramName = name;
	return validator;		
}
validator.query = function(name) {
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
validator.middleware =  function() {
	function(val) {
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
				if(!func(value)) {
					return res.send(400, {
						message: "validation failure '"+ name +"' for field "+ val.paramName +", in"+ val.type;
					});
				}
			}
			next();
		}
	}(validator)
}
module.exports = validator;