'use strict';

var React = require('react');
var classNames = require('classnames');
var fecha = require('fecha');
var omit = require('object.omit');
var Icon = require('../Icon');
var DatePicker = require('./DatePicker');
var TimePicker = require('./TimePicker');


var DateTimePicker = React.createClass({
    prefixClass: function (subClass) {
        return this.props.classPrefix + '-' + subClass;
    },
    propTypes: {
        classPrefix: React.PropTypes.string,
        show: React.PropTypes.bool, // 是否显示
        showTimePicker: React.PropTypes.bool, // 是否显示时间选择器
        showDatePicker: React.PropTypes.bool,
        caretDisplayed: React.PropTypes.bool,
        viewMode: React.PropTypes.string,
        minViewMode: React.PropTypes.string,
        onSelect: React.PropTypes.func.isRequired,
        onClose: React.PropTypes.func,
        daysOfWeekDisabled: React.PropTypes.array,
        format: React.PropTypes.string, // 日期格式 'YYYY-MM-DD HH:mm'
        dateTime: React.PropTypes.string, // 初始时间
        locale: React.PropTypes.string,
        weekStart: React.PropTypes.number,
        minDate: React.PropTypes.string,
        maxDate: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            classPrefix: 'datepicker',
            show: false,
            dateTime: '',
            format: 'YYYY-MM-DD HH:mm',
            showTimePicker: true,
            showDatePicker: true,
            caretDisplayed: false
        };
    },

    getInitialState: function () {
        var showToggle;
        var showTimePicker;

        if (this.props.showTimePicker && this.props.showDatePicker) {
            showToggle = true;
            showTimePicker = false;
        }

        if (!showToggle && !this.props.showDatePicker) {
            showTimePicker = true;
        }

        var date = fecha.parse(this.props.dateTime, this.props.format);
        if (!date) {
            date = new Date();
        }

        return {
            showTimePicker: showTimePicker,
            showDatePicker: this.props.showDatePicker,
            caretDisplayed: this.props.caretDisplayed,
            showToggle: showToggle,
            date: date,
            toggleDisplay: {
                toggleTime: {
                    display: 'block'
                },
                toggleDate: {
                    display: 'none'
                }
            }
        };
    },

    handleToggleTime: function () {
        this.setState({
            showDatePicker: false,
            showTimePicker: true,
            toggleDisplay: {
                toggleTime: {
                    display: 'none'
                },
                toggleDate: {
                    display: 'block'
                }
            }
        });
    },

    handleToggleDate: function () {
        this.setState({
            showDatePicker: true,
            showTimePicker: false,
            toggleDisplay: {
                toggleTime: {
                    display: 'block'
                },
                toggleDate: {
                    display: 'none'
                }
            }
        });
    },

    handleSelect: function (date) {
        this.setState({
            date: date
        });
        this.props.onSelect(fecha.format(date, this.props.format));
    },

    renderToggleTime: function () {
        if (this.state.showToggle) {
            return (
                <div style={this.state.toggleDisplay.toggleTime}
                    className={this.prefixClass('toggle')}
                    onClick={this.handleToggleTime}>
                    <Icon className="fa-clock-o" />
                </div>
            );
        }
        return null;
    },

    renderToggleDate: function () {
        if (this.state.showToggle) {
            return (
                <div style={this.state.toggleDisplay.toggleDate}
                    className={this.prefixClass('toggle')}
                    onClick={this.handleToggleDate}>
                    <Icon className="fa-calendar" />
                </div>
            );
        }
        return null;
    },

    renderDatePicker: function () {
        if (this.state.showDatePicker) {
            return (
                <DatePicker onSelect={this.handleSelect}
                    onClose={this.props.onClose}
                    weekStart={this.props.weekStart}
                    viewMode={this.props.viewMode}
                    minViewMode={this.props.minViewMode}
                    daysOfWeekDisabled={this.props.daysOfWeekDisabled}
                    format={this.props.format}
                    date={this.state.date}
                    locale={this.props.locale}
                    minDate={this.props.minDate}
                    maxDate={this.props.maxDate} />
            );
        }
        return null;
    },

    renderTimePicker: function () {
        if (this.state.showTimePicker) {
            return (
                <TimePicker onSelect={this.handleSelect}
                    date={this.state.date}
                    format={this.props.format} />
            );
        }
        return null;
    },

    renderCaret: function () {
        if (this.state.caretDisplayed) {
            return (<div className={this.prefixClass('caret')}></div>);
        }
        return null;
    },

    render: function () {
        var restProps = omit(this.props, Object.keys(this.constructor.propTypes));
        restProps.style =
         Object.assign(restProps.style || {}, { display: this.props.show ? 'block' : 'none' });

        return (
            <div {...restProps}
                className={this.props.classPrefix}>
                {this.renderCaret()}

                <div className={this.prefixClass('date')}>
                    {this.renderDatePicker()}
                </div>
                <div className={this.prefixClass('time')}>
                    {this.renderTimePicker()}
                </div>
                {this.renderToggleTime()}
                {this.renderToggleDate()}
            </div>
        );
    }
});

module.exports = DateTimePicker;
