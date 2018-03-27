/*
Dashboard 分享模态框
*/
import React, { Component } from 'react';
const RModal = require('react-modal-bootstrap');

const Close = require('../../component/form/Close');
const Button = require('../../component/form/Button');
const classnames = require('classnames');
const removeModalOpenClass = require('../../common/utils/removeModalOpenClass');
const PropTypes = require('prop-types');

export default class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = this.setDefaultState();
        this.hideModal = this.hideModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.handleCommit = this.handleCommit.bind(this);
    }
    static propTypes = {
        titleName: PropTypes.string,
        handleCommit: PropTypes.func
    }
    static defaultProps = {
        titleName: '模态框',
    }
    setDefaultState() {
        return {
            isModalOpen: false,
        };
    }
    openModal() {
        this.setState({
            isModalOpen: true,
        });
    }
    hideModal() {
        let initState = this.setDefaultState();
        this.setState(initState);
        removeModalOpenClass(); // 移除body的‘modal-open’
    }
    handleCommit() {
        if (this.props.handleCommit) this.props.handleCommit();
    }
    render() {
        if (!this.state.isModalOpen) return null;
        let classMames = classnames(
            this.props.className,
            'default-modal'
        );
        return (
            <RModal.Modal
                className={classMames}
                isOpen={this.state.isModalOpen}
                onRequestHide={this.hideModal}>

                <Close icon onClick={this.hideModal} />
                <div className="modal-header">
                    <div className='title'>{this.props.titleName}</div>
                </div>

                <div className='modal-body'>
                    {this.props.children}
                </div>

                <div className="modal-footer">
                    <Button className='cancel'
                        onClick={this.hideModal}>取消</Button>
                    <Button className='confirm'
                        onClick={this.handleCommit}>确定</Button>
                </div>
            </RModal.Modal>
        );
    }
}
