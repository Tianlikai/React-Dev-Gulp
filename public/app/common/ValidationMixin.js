'use strict';

var ValidationFactory = require('./ValidationFactory');

var ValidationMixin = {
    handleValidation: function (key, callback) {
        return function (e) {
            e.preventDefault();
            this.validate(key, callback);
        }.bind(this);
    },
    validate: function (key, callback) {
        var schema = this.validatorTypes || {};
        var validationErrors = Object.assign({}, this.state.errors,
            ValidationFactory.validate(schema, this.state, key));
        this.setState({
            errors: validationErrors
        });
    },
    clearValidations: function () {
        return this.setState({
            errors: {}
        });
    },
    getValdationMessages: function (key) {
        var errors = this.state.errors;
        if (errors) {
            return errors[key];
        }
        return '';
    },
    handleSubmitValid: function (ignore, ckparams) {
        var valid = true;
        var schema2 = this.validatorTypes || {};
        var schema = {};
        if (ckparams) {
            for (var i = 0; i < ckparams.length; i++) {
                schema[ckparams[i]] = schema2[ckparams[i]];
            }
        } else {
            schema = schema2;
        }
        var validationErrors = {};
        for (var item in schema) {
            if (ignore && item == ignore) {
                continue;
            }
            validationErrors = Object.assign({}, validationErrors,
                ValidationFactory.validate(schema, this.state, item));
        }
        this.setState({
            errors: validationErrors
        });
        for (var item in validationErrors) {
            if (validationErrors[item]) {
                valid = false;
                break;
            }
        }
        return valid;
    }
};

module.exports = ValidationMixin;
