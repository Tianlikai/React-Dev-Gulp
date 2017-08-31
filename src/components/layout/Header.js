import React from 'react';
import PropTypes from 'prop-types';

export default class Header extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        activePageName: PropTypes.string,
        onChange: PropTypes.func,
        isAdminPlatform: PropTypes.bool,
    }
    constructor(props) {
        super(props);
    }

    render() {
        
        return (
            <div>
                Header
            </div>
        )
    }
}