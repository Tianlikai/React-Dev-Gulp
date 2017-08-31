import React from 'react';
import PropTypes from 'prop-types';

class Menu extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        theme: PropTypes.shape({
            list: PropTypes.string,
        }),
    };

    static defaultProps = {
        className: '',
    };
   
    render() {
        return (
            <ul className={this.props.className}>
                {this.props.children}
                {/* {this.renderItems()} */}
            </ul>
        )
    }
}

export default Menu;