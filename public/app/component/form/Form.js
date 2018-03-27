'use strict';

var React = require('react');
var classNames = require('classnames');
var ClassNameMixin = require('../mixins/ClassNameMixin.js');

var Form = React.createClass({
    mixins: [ClassNameMixin],
    propTypes: {
        classPrefix: React.PropTypes.string.isRequired,
        inline: React.PropTypes.bool,
        horizontal: React.PropTypes.bool
    },
    getDefaultProps: function () {
        return {
            classPrefix: 'form'
        };
    },
    render: function () {
        var classSet = this.getClassSet();
        classSet[this.prefixClass('horizontal')] = this.props.horizontal;
        classSet[this.prefixClass('inline')] = this.props.inline;
        var formProps = Object.assign({}, this.props);
        delete formProps.classPrefix;
        delete formProps.horizontal;

        return (
            <form
                {...formProps}
                className={classNames(this.props.className, classSet)}>
                {this.props.children}
            </form>
        );
    }
});

module.exports = Form;
