import React, { Component } from 'react';
const RModal = require('react-modal-bootstrap');

const removeModalOpenClass = require('../../../../common/utils/removeModalOpenClass');

const Close = require('../../../../component/form/Close');
const Button = require('../../../../component/form/Button');

class DeleteModal extends Component {
    constructor(props) {
        super(props);
        this.state = this.setDefaultState();
        this.hideModal = this.hideModal.bind(this);
        this.handleCommit = this.handleCommit.bind(this);
    }
    setDefaultState() {
        return {
            isModalOpen: false,
            title: '删除',
            content: '您确定要删除吗？',
            data: [],
        };
    }
    openModal(title, content, data) {
        this.setState({
            isModalOpen: true,
            title: title,
            content: content,
            data: data
        });
    }
    hideModal() {
        this.setState({
            isModalOpen: false,
            data: [],
        });
        removeModalOpenClass(); // 移除body的‘modal-open’
    }
    handleCommit() {
        if (this.props.onDel) {
            this.props.onDel(this.state.data);
        }
        this.hideModal();
    }
    render() {
        if (!this.state.isModalOpen) {
            return null;
        }
        return (
            <RModal.Modal
                className='deleteModal'
                isOpen={this.state.isModalOpen}
                onRequestHide={this.hideModal}>
                <Close icon onClick={this.hideModal}
                    style={{ position: 'relative', top: 8, right: 8 }} />

                <div className="modal-header">
                    <div className='title'>{this.state.title}</div>
                </div>

                <div className='modal-body'>
                    <p>{this.state.content}</p>
                </div>

                <div className="modal-footer">
                    <Button className='confirm'
                        onClick={this.handleCommit}>确定</Button>
                    <Button className='cancel'
                        onClick={this.hideModal}>取消</Button>
                </div>
            </RModal.Modal>
        );
    }
}

module.exports = DeleteModal;
