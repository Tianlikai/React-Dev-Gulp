import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const factory = () => {
    class Tab extends Component {
        static propTypes = {
            active: PropTypes.bool,
            activeClassName: PropTypes.string,
            children: PropTypes.node,
            className: PropTypes.string,
            disabled: PropTypes.bool,
            hidden: PropTypes.bool,
            icon: PropTypes.node,
            index: PropTypes.number,
            label: PropTypes.node,
            onActive: PropTypes.func,
            onClick: PropTypes.func,
            theme: PropTypes.shape({
                active: PropTypes.string,
                disabled: PropTypes.string,
                hidden: PropTypes.string,
                label: PropTypes.string,
                rippleWrapper: PropTypes.string,
                withIcon: PropTypes.string,
                withText: PropTypes.string,
            }),
        };

        static defaultProps = {
            active: false,
            className: '',
            disabled: false,
            hidden: false,
        };

        componentDidUpdate(prevProps) {
            if (!prevProps.active && this.props.active && this.props.onActive) {
                this.props.onActive();
            }
        }

        handleClick = (event) => {
            if (!this.props.disabled && this.props.onClick) {
                this.props.onClick(event, this.props.index);
            }
        };

        render() {
            const {
                index,
                onActive,
                active,
                activeClassName,
                children,
                className,
                disabled,
                hidden,
                label,
                icon,
                theme,
                ...other } = this.props;

            const _className = classnames(theme.label, {
                [theme.active]: active,
                // [theme.activeClassName]: active,
            }, className);
            return (
                <div {...other} className={_className} data-react-toolbox="tab" role="tab" tabIndex="0" onClick={this.handleClick}>
                    {/* {icon && <FontIcon className={theme.icon} value={icon} />} */}
                    {label}
                    {children}
                </div>
            );
        }
    }

    return Tab;
};
const Tab = factory();
export { factory as tabFactory };
export { Tab };