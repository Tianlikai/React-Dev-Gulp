/**
 * Created by Administrator on 2016/5/16.
 */

'use strict';


var formValidationData = require('../data/FormValidateData');

var ValidationExtendFactory = {
    /**
     *
     * @param form_id
     * @param validator_schema
     * @param formData
     * @param key
     * @returns {{}}
     */
    validate: function (form_id, validator_schema, formData, key) {
        validator_schema = validator_schema || {};
        formData = formData || {};

        var the_validator_schema = validator_schema[key], validator_methods = the_validator_schema.split(' '), errmsg = '';

        for (var i = 0; i < validator_methods.length; i++) {
            var validatedResult = ValidationExtendFactory.checkValidation(form_id, validator_methods[i], formData[key], formData, key);
            if (!validatedResult.isValidated) {
                errmsg = validatedResult.validatedMsg;
                break;
            }
        }
        var validatedObj = {};
        validatedObj[key] = errmsg;
        return validatedObj;
    },
    /**
     * @param form_id
     * @param validator_method
     * @param field_value
     * @param formData
     * @param key
     * @returns {{isValidated: boolean, validatedMsg: string}}
     */
    checkValidation: function (form_id, validator_method, field_value, formData, key) {
        var validatedResult = {isValidated: true, validatedMsg: ''};

        var validator_method_name = false, validator_method_param = false, thisFieldValidated = false;
        if (validator_method.indexOf('_') > -1 ) {
            var validator_method_arr = validator_method.split('_');
            validator_method_name = validator_method_arr[0];
            validator_method_param = validator_method_arr[1];

            thisFieldValidated = ValidationExtendFactory.method[validator_method_name](field_value, validator_method_param, formData);
        } else {
            thisFieldValidated = ValidationExtendFactory.method[validator_method](field_value);
        }

        if (!thisFieldValidated) {
            validatedResult.isValidated = false;

            validatedResult.validatedMsg = formValidationData[form_id][key][validator_method];
        }

        return validatedResult;
    },
    method: {
        required: function (value) {
            return value ? true : false;
        },
        email: function (value) {
            return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
        },
        min: function (value, length) {
            return value.length >= length ? true : false;
        },
        max:function (value, length) {
            return value.length > length ? false : true;
        },
        eq: function (value, lastparam, data) {
            return value == data[lastparam] ? true : false;
        },
        neq: function (value, lastparam, data) {
            return value != data[lastparam] ? true : false;
        },
        phone: function (value) {
            return /^1[2|3|4|5|6|7|8|9]\d{9}$/.test(value);
        },
        onlychartdis: function (value) {
            var re = /[^\w\.\/]/ig.test(value);
            return !re;
        },
        userName: function (value) {
            var re = /^[a-z\u4e00-\u9fa5]+$/i.test(value);
            return re;
        }
    }
};

module.exports = ValidationExtendFactory;
