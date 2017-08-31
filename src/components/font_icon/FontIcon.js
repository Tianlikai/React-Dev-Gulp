import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const FontIcon = ({ alt, children, className, theme, value, ...other }) => {
    return ( // eslint-disable-line
        <span
            aria-label={alt}
            className={classnames({ 'material-icons': typeof value === 'string' || typeof children === 'string' }, className)}
            {...other}
        >
        </span>
    )
};

FontIcon.propTypes = {
    alt: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    theme: PropTypes.object, // eslint-disable-line
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
};

FontIcon.defaultProps = {
    alt: '',
    className: '',
};

export default FontIcon;
export { FontIcon };