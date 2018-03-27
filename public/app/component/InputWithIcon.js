'use strict';

var React = require('react');
var NewInput = require('./Input');
var Icon = require('./Icon');

var InputWithErrMsg = React.createClass({
    propTypes: {
        field: React.PropTypes.string, // validate 检测结果对应提示
        type: React.PropTypes.string, // input type
        placeholder: React.PropTypes.string,
        validation: React.PropTypes.func, // 检测方法
        validateName: React.PropTypes.string, // 检测方法名称
        defaultValue: React.PropTypes.string // 默认值
    },
    getDefaultProps: function () {
        return {
            type: 'text',
            placeholder: ''
        };
    },
    getInitialState: function () {
        return {
            value: this.props.defaultValue || ''
        };
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            value: nextProps.defaultValue
        });
    },
    getValue: function () {
        return this.refs.input.getValue();
    },
    handleChange: function (value) {
        if (this.props.onChange) {
            this.props.onChange(value, this.props.validateName, this.props.field);
        }
    },
    render: function () {
        var style = { color: '#333' };
        if (this.props.style) {
            style = Object.assign({}, style, this.props.style);
        }
        return (
            <div className='inputWithIcon'>
                {this.props.children}
                <NewInput ref='input' onChange={this.handleChange}
                    type={this.props.type}
                    style={style}
                    defaultValue={this.state.value}
                    placeholder={this.props.placeholder}/>
            </div>
        );
    }
});

module.exports = InputWithErrMsg;
