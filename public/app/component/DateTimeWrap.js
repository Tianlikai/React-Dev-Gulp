
import React, { Component } from 'react';
const ReactDOM = require('react-dom');

const Events = require('./utils/Events');
const isNodeInTree = require('./utils/isNodeInTree');
import DateTimePicker from './DatePicker/DateTimePicker';

class DateTimeWrap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            time: this.props.defaultValue || ''
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.handlerOuterClick = this.handlerOuterClick.bind(this);
        this.toggleDateTimePicker = this.toggleDateTimePicker.bind(this);
        this.clearDateTime = this.clearDateTime.bind(this);
    }
    componentWillUnmount() {
        this.unBindOuterHandlers();
    }
    bindOuterHandlers() {
        Events.on(document, 'click', this.handlerOuterClick);
    }
    unBindOuterHandlers() {
        Events.off(document, 'click', this.handlerOuterClick);
    }
    handlerOuterClick(e) {
        if (isNodeInTree(e.target, ReactDOM.findDOMNode(this))) {
            return false;
        }
        this.setDropdownState(false);
    }
    setDropdownState(state) {
        if (state) {
            this.bindOuterHandlers();
        } else {
            this.unBindOuterHandlers();
        }
        this.setState({
            open: state
        });
    }
    // 是否显示
    toggleDateTimePicker(event) {
        event.stopPropagation();
        this.setDropdownState(!this.state.open);
    }
    // 清空时间
    clearDateTime(event) {
        event.stopPropagation();
        this.setState({
            time: ''
        });
    }
    // 回调函数：选择日期时，设置时间
    handleSelect(res) {
        this.setState({
            time: res
        });
    }
    // 获取当前选中的时间
    getDateTime() {
        return this.state.time;
    }
    render() {
        return (
            <div className={this.props.themeName ? `${this.props.themeName} dateWrap` : 'dateWrap'}
                style={this.props.style}>
                <div className='rct-form-control'
                    onClick={this.toggleDateTimePicker}>
                    <span className='fa fa-calendar'></span>
                    <span>{this.state.time}</span>
                    <span
                        className='glyphicon glyphicon-remove'
                        onClick={this.clearDateTime}
                        style={{ display: this.state.time ? 'inline-block' : 'none' }}
                    ></span>
                </div>
                <DateTimePicker
                    onSelect={this.handleSelect}
                    show={this.state.open}
                    showTimePicker={this.props.showTimePicker}
                    format={this.props.format}
                    style={{ margin: '0 auto' }} />
            </div>
        );
    }
}
DateTimeWrap.propTypes = {
    showTimePicker: React.PropTypes.bool, // 是否显示时间选择器
    format: React.PropTypes.string, // 日期格式 'YYYY-MM-DD HH:mm'
    defaultValue: React.PropTypes.string,
    onSelect: React.PropTypes.func, // 选择日期触发的事件
    themeName: React.PropTypes.string, // 自定义样式名
};
DateTimeWrap.defaultProps = {
    showTimePicker: false,
    format: 'YYYY-MM-DD'
};

module.exports = DateTimeWrap;
