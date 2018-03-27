import React from 'react';
import trimStr from '../common/utils/trimStr';
import Icon from '../component/form/Icon';
import NewInput from './Input';

const InputGroup = React.createClass({
    propTypes: {
        handleEnterKeyEvent: React.PropTypes.func,
        handleTriggerSearch: React.PropTypes.func,
        placeholder: React.PropTypes.string,
        inputWidth: React.PropTypes.object,
    },
    getInitialState: function () {
        return {
            value: ''
        };
    },
    // state中的值
    getValue: function () {
        return this.state.value;
    },
    setValue: function (value) {
        this.setState({
            value: value
        }, function () { });
        this.refs.searchRecom.setValue(value);
    },
    // 重置
    reset: function () {
        this.refs.searchRecom.clearInput();
        this.setState({
            value: ''
        });
    },
    // 输入框中的值
    getRawValue: function () {
        return trimStr(this.refs.searchRecom.getRawValue());
    },
    handleKeyEvent: function (value) {
        let trim = trimStr(value);
        this.setState({
            value: trim
        }, function () {
            if (this.props.handleEnterKeyEvent) {
                this.props.handleEnterKeyEvent(trim);
            }
            if (this.props.handleTriggerSearch) { // 表格处理搜索时  点击开始搜索吼触发
                this.props.handleTriggerSearch(value);
            }
        });
    },
    handleClick: function () {
        var value = trimStr(this.refs.searchRecom.getValue());
        this.setState({
            value: value
        }, function () {
            if (this.props.handleEnterKeyEvent) {
                this.props.handleEnterKeyEvent(value);
            }
            if (this.props.handleTriggerSearch) { // 表格处理搜索时  点击开始搜索吼触发
                this.props.handleTriggerSearch(value);
            }
        });
    },
    /**
     * Todo搜索
     */
    onChange: function (value) {
        if (this.props.handleEnterKeyEvent) {
            this.props.handleEnterKeyEvent(value);
        }
    },
    render: function () {
        return (
            <div className={`input-group-after ${this.props.className}`}
                style={this.props.style}>
                <NewInput
                    style={this.props.inputWidth ? this.props.inputWidth : null}
                    ref='searchRecom'
                    placeholder={this.props.placeholder}
                    keyEvent keyEventCharCode={13}
                    onKeyPress={this.handleKeyEvent}
                    onChange={this.onChange}
                />
                <span className='btn btn-default'
                    style={{ paddingTop: 7 }}
                    onClick={this.handleClick}>
                    {this.props.noIcon ? this.props.noIcon : <Icon icon='search' />}
                </span>
            </div>
        );
    }
});

export default InputGroup;
