'use strict';

var React = require('react');
var classNames = require('classnames');
var ClassNameMixin = require('../mixins/ClassNameMixin');

var Table = React.createClass({
    mixins: [ClassNameMixin],
    propTypes: {
        classPrefix: React.PropTypes.string,
        striped: React.PropTypes.bool, // 斑马线
        bordered: React.PropTypes.bool,
        hover: React.PropTypes.bool,
        condensed: React.PropTypes.bool, // 紧凑
        responsive: React.PropTypes.bool
    },
    getDefaultProps: function () {
        return {
            classPrefix: 'table',
            hover: true
        };
    },
    render: function () {
        var classSet = this.getClassSet();
        var responsive = this.props.responsive;

        classSet[this.prefixClass('bordered')] = this.props.bordered;
        classSet[this.prefixClass('striped')] = this.props.striped;
        classSet[this.prefixClass('hover')] = this.props.hover;
        classSet[this.prefixClass('condensed')] = this.props.condensed;

        var props = Object.assign({}, this.props);
        delete props.striped;
        delete props.hover;
        delete props.bordered;
        delete props.condensed;
        delete props.classPrefix;
        delete props.responsive;

        var table = (
                <table {...props}
                    className={classNames(classSet, this.props.className)}>
                    {this.props.children}
                </table>
            ); 
        return responsive ? (
                <div className={this.prefixClass('responsive')}>
                    {table}
                </div>
            ) : table;
    }
});
module.exports = Table;
