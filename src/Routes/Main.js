/**
 * jason.tian
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Main extends Component {
    constructor(props) {
        super(props);
    }
    render(){
        return(
            <div>
                123
                {this.props.children}
            </div>
        )
    }
}

export default Main;