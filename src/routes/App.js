/*
 * @Author: jason.tian 
 * @Date: 2017-09-17 20:26:48 
 * @Last Modified by: jason.tian
 * @Last Modified time: 2017-09-19 23:08:14
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
    constructor(props) {
        super(props);
        this.updateHeight = this.updateHeight.bind(this);
    }
    componentDidMount() {
        window.addEventListener('rseize', this.updateHeight);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateHeight);
    }
    updateHeight() {

    }
    render() {
        let sideHeight = window.innerHeight;
        return (
            <div className='Container'>
                <div className="SideMenu" style={{ height: sideHeight }}></div>
                <div className="HeaderAndMainContent">
                    <div className="HeaderContainer"></div>
                    <div className="MainContentContainer">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}

export default App;