/**
 * Created by Administrator on 2016/5/16.
 */

'use strict';

var ValidationExtendFactory = require('./ValidationExtendFactory');

var ValidationExtendMixin = {
    /**
     * 表单字段检测
     *
     * @param form_id
     * @param key
     * @param state_form_key
     * @param callback
     * @returns {function(this:ValidationExtendMixin)}
     */
    handleValidation: function (form_id, key, state_form_key, callback) {
        return function (evt) {
            evt.preventDefault();
            this.validate(form_id, key, state_form_key, callback);
        }.bind(this);
    },
    /**
     * 表单字段检测
     *
     * @param form_id
     * @param key
     * @param state_form_key
     * @param callback
     */
    validate: function (form_id, key, state_form_key, callback) {
        state_form_key = state_form_key || 'fields';

        var validationStateErrors = this.state['errors'];
        // var validationStateErrors = {};

        var validator_hook = this.validatorTypes || {};

        var form_data = this.state;
        if (state_form_key) {
            form_data = this.state[state_form_key];
        }

        var validatedObj = ValidationExtendFactory.validate(form_id, validator_hook, form_data, key);
        validationStateErrors[key] = validatedObj[key];

        this.setState({errors: validationStateErrors});

        if (callback) {
            callback(validatedObj[key]);
        }
    },
    /**
     * 清理表单验证数据
     */
    clearValidation: function () {
        return this.setState({errors: {}});
    },
    /**
     * 获取表单数据指定字段错误信息
     *
     * @param error_key
     * @returns {*}
     */
    getValdationMessage: function (error_key) {
        var errors = this.state['errors'];

        if (errors) {
            return errors[error_key];
        } else {
            return '';
        }
    },
    /**
     * 表单统一验证入口
     *
     * @param form_id
     * @param ignore_field
     * @param form_field_array
     * @param state_form_key
     * @param callback
     * @returns {boolean}
     */
    formValidation: function (form_id, ignore_field, form_field_array, state_form_key, callback) {
        state_form_key = state_form_key || 'fields';

        var is_validated = true;
        var validator_hook = this.validatorTypes || {}, validator_schema = {};

        if (form_field_array) {
            for (var i = 0; i < form_field_array.length; i++) {
                validator_schema[form_field_array[i]] = validator_hook[form_field_array[i]];
            }
        } else {
            validator_schema = validator_hook;
        }

        // var validationStateErrors = this.state['errors'];
        var validationStateErrors = {};

        var form_data = this.state;
        if (state_form_key) {
            form_data = this.state[state_form_key];
        }

        for (var schema_item_key in validator_schema) {
            if (ignore_field && schema_item_key == ignore_field) {
                continue;
            }

            var res = ValidationExtendFactory.validate(form_id, validator_schema, form_data, schema_item_key);
            validationStateErrors[schema_item_key] = res[schema_item_key];

            if (is_validated) {
                if (validationStateErrors[schema_item_key]) {
                    is_validated = false;

                    if (callback) {
                        callback(validationStateErrors[schema_item_key]);
                    }
                }
            }
        }

        this.setState({errors: validationStateErrors});
        return is_validated;
    }
};

module.exports = ValidationExtendMixin;
