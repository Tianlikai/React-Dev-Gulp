/**
 * jason.tian
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }
    render(){
        let styHeight = window.innerHeight - 48;
        return(
            <div style={{height:styHeight}}>
                Dashboard
            </div>
        )
    }
}

export default Dashboard;