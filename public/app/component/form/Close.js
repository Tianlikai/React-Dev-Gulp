'use strict';
var React = require('react');
var classNames = require('classnames');
var ClassNameMixin = require('../mixins/ClassNameMixin');
var Icon = require('./Icon');

var Close = React.createClass({
    mixins: [ClassNameMixin],
    propTypes: {
        classPrefix: React.PropTypes.string,
        componentTag: React.PropTypes.node,
        icon: React.PropTypes.bool,
        spin: React.PropTypes.bool
    },
    getDefaultProps: function () {
        return {
            classPrefix: 'close',
            type: 'button'
        };
    },
    render: function () {
        var classes = this.getClassSet();
        var Component = this.props.componentTag || 'button';
        classes[this.prefixClass('spin')] = this.props.spin;

        var props = Object.assign({}, this.props);
        delete props.classPrefix;
        delete props.spin;
        delete props.icon;
        delete props.componentTag;

        return (
            <Component {...props}
                className={classNames(classes, this.props.className)}>
                {this.props.icon ? <Icon icon='remove' /> : '\u00D7'}
            </Component>
        );
    }
});

module.exports = Close;
