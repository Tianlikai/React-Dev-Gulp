/**
 * button 组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FontIcon from '../font_icon/FontIcon';

class Button extends Component {
    constructor(props) {
        super(props);
    }
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.node,
        hoverTitle: PropTypes.string,
        disabled: PropTypes.bool,
        icon: PropTypes.string,
        type: PropTypes.string,
        htmlType: PropTypes.string,
        theme: PropTypes.shape({
            icon: PropTypes.string,
        }),
        shape: PropTypes.string,
        size: PropTypes.string,
        href: PropTypes.string,
        float: PropTypes.string
    }
    static defaultProps = {
        className: '',
        htmlType: 'button',
        type: 'default',
        shape: '',
        size: 'default'
    }
    handleOnClick = (event) => {
        this.buttonNode.blur();
        if (this.props.onClick) this.props.onClick(event);
    };
    render() {
        const {
            children,
            className,
            theme,
            href,
            icon,
            shape,
            type,
            disabled,
            hoverTitle,
            float,
            ...others
            } = this.props;
        const element = href ? 'a' : 'button';
        const classes = classnames(
            'JTBtn',
            type,
            shape,
            float,
            className
        );
        const props = {
            ...others,
            ref: (node) => { this.buttonNode = node; },
            disabled: this.props.disabled,
            title: hoverTitle,
            className: classes,
            onClick: this.handleOnClick
        }
        return React.createElement(element, props,
            icon ? <FontIcon className={theme.icon} type={icon} /> : null,
            children,
        );
    }
}

export default Button;
