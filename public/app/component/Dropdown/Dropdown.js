'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var ClassNameMixin = require('../mixins/ClassNameMixin');
var classNames = require('classnames');
var Button = require('../Form/Button');
var Icon = require('../form/Icon');
var constants = require('../constants');

var Events = require('../utils/Events');
var isNodeInTree = require('../utils/isNodeInTree');

var Dropdown = React.createClass({
    mixins: [ClassNameMixin],
    propTypes: {
        title: React.PropTypes.any, // 如果是按钮 title 为必须
        btnStyle: React.PropTypes.string,
        btnInlineStyle: React.PropTypes.object,
        toggleClassName: React.PropTypes.string,
        contentInlineStyle: React.PropTypes.object,
        contentClass: React.PropTypes.string,
        drop: React.PropTypes.bool, // 是否有下拉箭头 true you  默认false
        navItem: React.PropTypes.bool,  // 是否是导航栏 item ？ li : div 默认true
        onOpen: React.PropTypes.func, // open callback
        onClose: React.PropTypes.func,
        icon: React.PropTypes.string,
        iconclassname: React.PropTypes.string,
        labelClassName: React.PropTypes.string, // 提示tip，根据 改属性判断
        labelTipCount: React.PropTypes.string,
        open: React.PropTypes.bool
    },
    getDefaultProps: function () {
        return {
            classPrefix: 'dropdown',
            contentTag: 'ul',
            drop: false,
            navItem: true
        };
    },
    getInitialState: function () {
        return {
            open: this.props.open || false
        };
    },
    componentWillReceiveProps: function (nextProp) {
        if (nextProp.open !== this.state.open) {
            this.setState({
                open: nextProp.open
            });
        }
    },
    componentWillUnmount: function () {
        this.unBindOuterHandlers();
    },
    bindOuterHandlers: function () {
        Events.on(document, 'click', this.handlerOuterClick);
    },
    unBindOuterHandlers: function () {
        Events.off(document, 'click', this.handlerOuterClick);
    },
    handlerOuterClick: function (e) {
        if (isNodeInTree(e.target, ReactDOM.findDOMNode(this))) {
            return false;
        }
        this.setDropdownState(false);
    },
    setDropdownState: function (state, callback) {
        if (state) {
            this.bindOuterHandlers();
        } else {
            this.unBindOuterHandlers();
        }

        this.setState({ open: state }, function () {
            callback && callback();
            state && this.props.onOpen && this.props.onOpen();
            !state && this.props.onClose && this.props.onClose();
        });
    },
    handlerDropdownClick: function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.setDropdownState(!this.state.open);
    },
    inputAutoChange: function (ref) {
        this.props.inputChange(ref);
    },
    render: function () {
        var classSet = this.getClassSet();
        var Component = this.props.navItem ? 'li' : 'div';
        var iconcart = (
            <Icon icon='triangle-bottom' className={this.props.iconclassname} />
        );
        if (!this.props.drop) {
            iconcart = (
                <Icon icon={this.props.icon} className={this.props.iconclassname}/>
            );
        }
        if(this.props.contentClass === 'dropdown-menu-dashboard'){
            iconcart = null;
        }
        var animation = this.props.open ?
            this.setClassNamespace('animation-slide-top-fixed') :
            this.setClassNamespace('dropdown-animation');
        var ContentTag = this.props.contentTag;
        classSet[constants.CLASSES.open] = this.state.open;
        var beforeElement = this.props.beforeElement || null;
        var labelTips = null;
        if (this.props.labelClassName) {
            labelTips = (
                <span className={classNames('label', this.props.labelClassName)}>
                    {this.props.labelTipCount}
                </span>
            );
        }
        var content = null;
        if (this.props.title) {
            content = (
                <Button bsStyle={this.props.bsStyle}
                    ref='dropdowntoggle' onClick={this.handlerDropdownClick}
                    className={classNames(this.prefixClass('toggle'), this.props.toggleClassName)}
                    style={this.props.btnInlineStyle}>
                    {this.props.title}
                    {' '}
                    {iconcart}
                </Button>
            );
        } else {
            if (!this.props.autocomplete) {
                content = (
                    <a className={classNames(this.prefixClass('toggle'),
                                this.props.toggleClassName)}
                        ref='dropdowntoggle'
                        onClick={this.handlerDropdownClick}>
                        {beforeElement}
                        {iconcart}
                        {labelTips}
                    </a>
                );
            } else {
                content = this.props.autocomplete;
            }
        }
        return (
            <Component
                className={classNames(this.props.className, classSet)}>
                {content}
                <ContentTag ref='dropdowncontent'
                    style={this.props.contentInlineStyle}
                    className={classNames(this.prefixClass('menu'),
                            animation, this.props.contentClass)}>
                    {this.props.children}
                </ContentTag>
            </Component>
        );
    }
});
Dropdown.item = React.createClass({
    mixins: [ClassNameMixin],
    propTypes: {
        href: React.PropTypes.string,
        title: React.PropTypes.string,
        target: React.PropTypes.string,
        header: React.PropTypes.bool,
        divider: React.PropTypes.bool,
        center: React.PropTypes.bool
    },
    getDefaultProps: function () {
        return {
            header: false
        };
    },
    render: function () {
        var classSet = this.getClassSet();
        var children = null;
        var astyle = null;
        classSet[this.setClassNamespace('dropdown-header')] = this.props.header;
        if (this.props.center) {
            astyle = { textAlign: 'center' };
        }
        if (this.props.header) {
            children = this.props.children;
        } else if (!this.props.divider) {
            children = (
                // onClick={this.props.onclick}
                <a href={this.props.href} title={this.props.title}
                    target={this.props.target} style={astyle}>
                    {this.props.children}
                </a>
            );
        }
        var liProps = Object.assign({}, this.props);
        delete liProps.center;
        delete liProps.header;

        return (
            <li {...liProps}
                href={null} title={null} className={classNames(this.props.className, classSet)}>
                {children}
            </li>
        );
    }
});
module.exports = Dropdown;
