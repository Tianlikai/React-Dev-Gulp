/*
开关按钮-样式1
*/
import React, { Component } from 'react';

class Button1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open
        };
        this.changeStatus = this.changeStatus.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            open: nextProps.open
        });
    }
    changeStatus() {
        let flag = this.state.open;
        this.setState({
            open: !flag
        });
        if (this.props.onChange) {
            this.props.onChange();
        }
    }
    render() {
        let class1 = this.state.open ? 'switch-btn1 open1' : 'switch-btn1 close1';
        return (
            <div className={class1} onClick={this.changeStatus}>
                <div></div>
            </div>
        );
    }
}

Button1.propTypes = {
    open: React.PropTypes.bool,
    onChange: React.PropTypes.func
};
Button1.defaultProps = {
    open: false
};

module.exports = Button1;
