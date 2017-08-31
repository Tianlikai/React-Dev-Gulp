import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FontIcon from "../font_icon";

const factory = (FontIcon) => {
    class Button extends Component {
        static propTypes = {
            children: PropTypes.node,
            className: PropTypes.string,
            label: PropTypes.string,
            flat: PropTypes.bool,
            floating: PropTypes.bool,
            raised: PropTypes.bool,
            href: PropTypes.string,
            icon: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.element,
            ]),
            neutral: PropTypes.bool,
            accent: PropTypes.bool,
            primary: PropTypes.bool,
            onMouseUp: PropTypes.func,
            theme: PropTypes.shape({
                accent: PropTypes.string,
                button: PropTypes.string,
                flat: PropTypes.string,
                floating: PropTypes.string,
                icon: PropTypes.string,
                neutral: PropTypes.string,
                primary: PropTypes.string,
                raised: PropTypes.string,
            }),
            type: PropTypes.string,
        }
        static defaultProps = {
            className: '',
            neutral: true,
            accent: false,
            primary: false,
            flat: false,
            floating: false,
            raised: false,
            type: 'button',
        }
        getLevel = () => {
            if (this.props.primary) return 'primary';
            if (this.props.accent) return 'accent';
            return 'neutral'
        }
        getShape = () => {
            if (this.props.raised) return "raised";
            if (this.props.floating) return "floating";
            return "flat";
        }
        handleMouseUp = (event) => {
            this.buttonNode.blur();
            if (this.props.onMouseUp) {
                this.props.onMouseUp();
            }
        }
        render() {
            const {
                className,
                value,
                href,
                icon,
                neutral,
                accent,
                primary,
                raised,
                flat,
                floating,
                theme,
                type,
                ...others
            } = this.props;
            const level = this.getLevel();
            const shape = this.getShape();

            const classes = classnames(theme.button, [theme[shape]], {
                [theme[level]]: neutral,
            }, className);

            const element = href ? 'a' : 'button';
            const props = {
                ...others,
                href,
                ref: (node) => { this.buttonNode = node },
                className: classes,
                onMouseUp: this.handleMouseUp,
                type: !href ? type : null
            }
            let children = (
                <span>{value}</span>
            )
            return React.createElement(element, props,
                icon ? <FontIcon className={theme.icon} value={theme.icon}/> : null,
                children,
            );
        }
    }
    return Button;
}

const Button = factory(FontIcon);
export { factory as buttonFactory };
export { Button };