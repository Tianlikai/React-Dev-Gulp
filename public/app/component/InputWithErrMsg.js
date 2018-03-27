import React from 'react';
import classNames from 'classnames';
import NewInput from './Input';
import Icon from './Icon';
import trimStr from '../common/utils/trimStr'

var InputWithErrMsg = React.createClass({
    propTypes: {
        maxLength: React.PropTypes.number, // validate 输入最大长度为
        field: React.PropTypes.string, // validate 检测结果对应提示
        type: React.PropTypes.string, // input type
        placeholder: React.PropTypes.string,
        validation: React.PropTypes.func, // 检测方法
        validateName: React.PropTypes.string, // 检测方法名称
        hint: React.PropTypes.string, // 提示信息
        errhint1: React.PropTypes.string, // 错误提示1
        errhint2: React.PropTypes.string, // 错误提示2
        errhint3: React.PropTypes.string, // 错误提示3
        defaultValue: React.PropTypes.string, // 默认值
        textLengthLimit: React.PropTypes.number, // 限制输入长度
        onKeyDown: React.PropTypes.func
    },
    getDefaultProps: function () {
        return {
            type: 'text',
            textLengthLimit: 0
        };
    },
    initState: function () {
        return {
            value: this.props.defaultValue || '',
            hint: this.props.hint || ''
        };
    },
    getInitialState: function () {
        return this.initState();
    },
    componentWillReceiveProps: function (nextProps) {
        if (this.props.defaultValue !== nextProps.defaultValue) {
            this.setState({
                value: nextProps.defaultValue
            });
            this.refs.input.setValue(nextProps.defaultValue);
        }
    },
    // 新建，编辑 在同一页面时，操作完成后清空
    clearInput: function () {
        let initState = {
            value: '',
            hint: this.props.hint || ''
        };
        this.setState(initState);
        this.refs.input.setValue('');
        this.refs.input.clearInput();
    },
    reset: function () {
        this.refs.input.resetInput();
        let initState = this.initState();
        this.setState(initState);
    },
    // state的值
    getValue: function () {
        return trimStr(this.refs.input.getValue());
    },
    // 输入框里面的值(一般用这个)
    getRawValue: function () {
        return trimStr(this.refs.input.getRawValue());
    },
    handleChange: function (value) {
        var hint = '';
        let flag = true;
        if (this.props.validation) {
            hint = this.props.validation(value, this.props.maxLength, this.props.errhint1, this.props.errhint2, this.props.errhint3);
        }
        if (!hint || hint === '') { // 没有错误
            this.setState({
                hint: this.props.hint
            });
            flag = false;
        } else { // 有错误
            this.setState({
                hint: hint
            });
            flag = true;
        }
        if (this.props.changValue) {
            this.props.changValue(value);
        }
        return flag;
    },
    handleOnKeyDown: function (value, fromEvent) {
        if (this.props.onKeyDown) {
            this.props.onKeyDown(value, fromEvent);
        }
    },
    checkInput: function (value) {
        let hint = '';
        let flag = true;
        if (this.props.validation) {
            hint = this.props.validation(value,
                this.props.validateName,
                this.props.field);
        }

        if (hint === '') { // 没有错误
            this.setState({
                hint: this.props.hint
            });
            flag = false;
        } else { // 有错误
            this.setState({
                hint: hint
            });
            flag = true;
        }
        return flag;
    },
    // 设置hint
    setHint: function (value) {
        this.setState({
            hint: value
        });
    },
    getHint: function () {
        return this.state.hint;
    },
    renderHint: function () {
        let hint = null;
        let hintClass = 'hint err';
        if (this.props.hint) { // 判断props是否有hint
            if (this.props.hint === this.state.hint) {
                hintClass = 'hint';
            }
        }
        // props没有hint或者this.props.hint !== this.state.hint时，用err样式
        hint = (
            <div className={hintClass}>
                {this.state.hint}
            </div>
        );
        return hint;
    },
    render: function () {
        var hint = null;
        if (this.state.hint) {
            hint = this.renderHint();
        } else {
            if (this.props.hint) {
                hint = (
                    <div className='hint'>
                        {this.props.hint}
                    </div>
                );
            }
        }
        var style = { width: '100%', color: '#333' };
        if (this.props.style) {
            style = Object.assign({}, style, this.props.style);
        }
        let divClass = classNames(this.props.className, 'inputWithErrMsg');
        return (
            <div className={divClass}>
                <NewInput ref='input' onChange={this.handleChange}
                    onKeyDown={this.handleOnKeyDown}
                    autofocus={this.props.autofocus}
                    type={this.props.type}
                    style={style}
                    defaultValue={this.state.value}
                    placeholder={this.props.placeholder}
                    textLengthLimit={this.props.textLengthLimit} />
                {hint}
            </div>
        );
    }
});

module.exports = InputWithErrMsg;
