'use strict';

var sysval = require('../data/SystemValue');

var ValidationFactory = {
    validate: function (schema, data, key) {
        schema = schema || {};
        data = data || {};

        var curschema = schema[key];
        var valarr = curschema.split(' ');
        var errmsg = '';

        for (var i = 0; i < valarr.length; i++) {
            var result = ValidationFactory.checkValidation(valarr[i], data[key], data);
            if (!result.results) {
                errmsg = result.msg;
                break;
            }
        }
        var resultobj = {};
        resultobj[key] = errmsg;
        return resultobj;
    },
    checkValidation: function (param, value, data) {
        var result = { results: true, msg: '' };
        var checkval;
        if (param.indexOf('_') > -1) {
            var subparamarr = param.split('_');
            var subparam1 = subparamarr[0];
            var subparam2 = subparamarr[1];
            checkval = ValidationFactory.method[subparam1](value, subparam2, data);
        } else {
            checkval = ValidationFactory.method[param](value);
        }
        if (!checkval) {
            result.results = false;
            if (subparam1) {
                if (subparam1 == 'min' || subparam1 == 'max') {
                    result.msg = sysval.errormsg[subparam1].replace('{num}',subparam2);
                }
                if (subparam1 == 'eq') {
                    result.msg = sysval.errormsg[param];
                }
            } else {
                result.msg = sysval.errormsg[param];
            }
        }
        return result;
    },
    method: {
        required: function (value) {
            if (value) {
                return true;
            } else {
                return false;
            }
        },
        email: function (value) {
            return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
        },
        min: function (value, length) {
            return value.length >= length ? true : false;
        },
        max: function (value, length) {
            return value.length > length ? false : true;
        },
        eq: function (value, lastparam, data) {
            return value == data[lastparam] ? true : false;
        },
        onlychartdis: function (value) {
            var re = /[^\w\.\/]/ig.test(value);
            return !re;
        }
    }
};

module.exports = ValidationFactory;
