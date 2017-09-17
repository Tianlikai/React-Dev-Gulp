/*
 * @Author: jason.tian 
 * @Date: 2017-09-17 20:26:48 
 * @Last Modified by: jason.tian
 * @Last Modified time: 2017-09-17 20:44:07
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className='Container'>
                <div className="SideMenu"></div>
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