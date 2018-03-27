'use strict';

var React = require('react');
var classNames = require('classnames');

var Icon = React.createClass({
    propTypes: {
        className: React.PropTypes.string, // 图标类名
        componentTag: React.PropTypes.string.isRequired// 包裹标签，默认为span
    },
    getDefaultProps: function () {
        return {
            classPrefix: 'fa',
            componentTag: 'span'
        };
    },
    render: function () {
        var props = this.props;
        var Component = props.componentTag;
        var classname = classNames(
            props.classPrefix,
            props.className
        );
        props = Object.assign({}, props);
        delete props.classPrefix;
        delete props.className;
        delete props.componentTag;

        return (
            <Component
                {...props}
                className={classname}>
                {props.children}
            </Component>
        );
    }
});

module.exports = Icon;
