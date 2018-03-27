/*
 * @Author: jason.tian 
 * @Date: 2017-12-21 08:45:03 
 * @Last Modified by: jason.tian
 * @Last Modified time: 2017-12-22 13:25:22
 * checkbox 组件
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class Checkbox extends Component {
    constructor(props) {
        super(props);
    }
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.node,
        hoverTitle: PropTypes.string,
        disabled: PropTypes.bool,
        type: PropTypes.string,
        check: PropTypes.bool,
        item: PropTypes.object,
        onChange: PropTypes.func,
        theme: PropTypes.shape({
            icon: PropTypes.string,
        }),
    }
    static defaultProps = {
        className: '',
        type: 'default',
        disabled: false
    }
    handleToggle = () => {
        if (!this.props.disabled && this.props.onChange) this.props.onChange(this.props.item);
    }
    render() {
        const {
            children,
            className,
            check,
            theme,
            type,
            disabled,
            hoverTitle,
            ...others
            } = this.props;
        const classes = classnames(
            'JTCheckBox',
            { 'disabled': disabled },
            type,
            className
        );
        const props = {
            ...others,
            ref: (node) => { this.CheckBoxNode = node; },
            title: hoverTitle,
            className: classes,
            onClick: this.handleToggle
        }
        let src = check ? "./dist/images/checkboxChoose.png" : "./dist/images/checkbox.png";
        if (disabled) src = "./dist/images/checkboxDisable.png"; // 禁用
        return (
            <label
                {...props}>
                <img src={src} />
                {children}
            </label>
        )
    }
}

export default Checkbox;
