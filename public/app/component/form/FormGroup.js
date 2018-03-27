'use strict';

var React = require('react');
var classNames = require('classnames');
var ClassNameMixin = require('../mixins/ClassNameMixin.js');

// 表单验证 先不支持 验证图标的显示
var FormGroup = React.createClass({
    mixins: [ClassNameMixin],
    propTypes: {
        bsSize: React.PropTypes.oneOf(['sm', 'lg']),
        validation: React.PropTypes.string
    },
    render: function () {
        var classSet = {};
        classSet[this.setClassNamespace('form-group')] = true;
        this.props.validation &&
            (classSet[this.setClassNamespace('has-' + this.props.validation)] = true);
        if (this.props.bsSize) {
            classSet[this.setClassNamespace('form-group-' + this.props.bsSize)] = true;
        }
        var divProps = Object.assign({}, this.props);
        delete divProps.bsSize;
        delete divProps.validation;

        return (
            <div className={classNames(this.props.className, classSet)}
                    {...divProps}>
                {this.props.children}
            </div>
        );
    }
});

module.exports = FormGroup;
