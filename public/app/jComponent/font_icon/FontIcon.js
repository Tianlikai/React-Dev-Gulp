import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const FontIcon = ({ alt, type, children, className, ...other }) => ( // eslint-disable-line
    <span
        aria-label={alt}
        className={classnames('JTimg', type, className)}
        {...other}
    >
    </span>
);

FontIcon.propTypes = {
    alt: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    type: PropTypes.string,
};

FontIcon.defaultProps = {
    alt: '',
    className: '',
    type: ''
};

export default FontIcon;
export { FontIcon };