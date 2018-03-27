'use strict';

import React, { Component, PropTypes } from 'react';

class TabContent extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div style={{ display: this.props.selected ? 'block' : 'none' }}>
                {this.props.children}
            </div>
        );
    }
}

TabContent.propTypes = {
    name: PropTypes.string,
    selected: PropTypes.bool
};

TabContent.defaultProps = {
    selected: false
};

module.exports = TabContent;
