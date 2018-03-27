'use strict';

var React = require('react');
var classnames = require('classnames');


var Input = React.createClass({
    propTypes: {
        readOnly: React.PropTypes.bool,
        type: React.PropTypes.string,
        defaultValue: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        classname: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        keyEventCharCode: React.PropTypes.number, // 键盘事件响应charcode
        keyEvent: React.PropTypes.bool, // 是否开启键盘事件
        onKeyPress: React.PropTypes.func, // 键盘事件响应函数
        textLengthLimit: React.PropTypes.number, // 限制输入长度
        onBlur: React.PropTypes.func, // 失去焦点
        autofocus: React.PropTypes.bool // 自动获取焦点
    },
    getInitialState: function () {
        return {
            value: this.props.defaultValue || ''
        };
    },
    handleChange: function (e) {
        if (this.props.readOnly) {
            return;
        }
        var value = e.target.value;
        if (this.props.textLengthLimit && value.length > this.props.textLengthLimit) {
            return;
        }
        this.setState({
            value: value
        }, function () {
            if (this.props.onChange) {
                this.props.onChange(value);
            }
        });
    },
    handleOnKeyDown: function (event) {
        if (this.props.onKeyDown) {
            this.props.onKeyDown(this.refs.input.value, event);
        }
    },
    handleKeyEvent: function (e) {
        if (e.charCode === this.props.keyEventCharCode) {
            var value = e.target.value;
            this.setState({
                value: value
            });
            if (this.props.onKeyPress) {
                this.props.onKeyPress(value);
            }
        }
    },
    handleBlur: function () {
        this.props.onBlur(this.state.value);
    },
    handleFocus: function () {
        var pos = this.state.value.length;
        // ie8以下不支持此方法
        this.refs.input.setSelectionRange(pos, pos);
    },
    getValue: function () {
        return this.state.value;
    },
    getRawValue: function () {
        return this.refs.input.value;
    },
    setValue: function (value) {
        this.setState({
            value: value
        });
    },
    resetInput: function () {
        this.setState({
            value: this.props.defaultValue || ''
        });
    },
    clearInput: function () {
        this.refs.input.value = '';
        this.setState({
            value: ''
        });
    },
    render: function () {
        var props = {
            className: classnames(
                this.props.className,
                'rct-form-control'
            ),
            onChange: this.handleChange,
            onKeyDown: this.handleOnKeyDown,
            type: this.props.type === 'password' ? 'password' : 'text',
            value: this.state.value,
            placeholder: this.props.placeholder ? this.props.placeholder : ''
        };

        var inputProps = Object.assign({}, this.props);
        delete inputProps.autofocus;
        delete inputProps.keyEvent;
        delete inputProps.keyEventCharCode;
        delete inputProps.textLengthLimit;
        delete inputProps.classname;
        /**
         * 去除defaultValue，避免歧义。
         * 详见：https://facebook.github.io/react/docs/forms.html#controlled-components
         */
        delete inputProps.defaultValue;

        if (this.props.keyEvent && !this.props.readOnly) {
            props.onKeyPress = this.handleKeyEvent;
        }
        if (this.props.onBlur && !this.props.readOnly) {
            props.onBlur = this.handleBlur;
        }
        if (this.props.autofocus) {
            props.onFocus = this.handleFocus;
        }
        if (this.props.type === 'textarea') {
            return (<textarea ref="input" {...inputProps} {...props} rows={this.props.rows} />);
        }
        return (<input ref="input" {...inputProps} {...props} />);
    }
});

module.exports = Input;
