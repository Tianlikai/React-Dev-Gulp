import React from 'react';
import PropTypes from 'prop-types';

class MenuItem extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        menutitle: PropTypes.string,
        curmenu: PropTypes.object,
        depth: PropTypes.number,
        onRedirect: PropTypes.func,
        imgsrc: PropTypes.string,
        activeImg: PropTypes.string,
        active: PropTypes.bool,
    }

    handleClick(e) {
        if (this.props.onRedirect) {
            this.props.onRedirect(this.props.curmenu,e);
        }
    }
    render() {
        const {
            menutitle,
            curmenu,
            depth,
            onRedirect,
            imgsrc,
            activeImg,
            active,
            ...other } = this.props;
        let itemClassName = active ? "treeview active" : "treeview";
        var lefticon = (active && activeImg ? <img src={activeImg} style={{ height: 16, position: 'relative' }} />
            : <img src={imgsrc} style={{ height: 16, position: 'relative' }} />);

        return (
            <li className={itemClassName} onClick={this.handleClick.bind(this)}>
                <a>
                    {lefticon}
                    <div className='menutitle'>{menutitle}</div>
                </a>
            </li>
        )
    }
}

export default MenuItem;