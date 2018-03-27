/**
提示-模态框
*/
import React, { PureComponent } from 'react';
const RModal = require('react-modal-bootstrap');
import removeModalOpenClass from '../../../../common/utils/removeModalOpenClass';
import Close from '../../../../component/form/Close';
import Button from '../../../../component/form/Button';

class HintModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = this.setDefaultState();
        this.hideModal = this.hideModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.handleCommit = this.handleCommit.bind(this);
    }
    setDefaultState() {
        const obj = null;
        return {
            isModalOpen: false,
            title: 'title',
            content: '提示正文',
            urlData: obj,
            postData: obj
        };
    }
    openModal(title, content, urlData, postData) {
        this.setState({
            isModalOpen: true,
            title: title,
            content: content,
            urlData: urlData,
            postData: postData
        });
    }
    hideModal() {
        const obj = null;
        this.setState({
            isModalOpen: false,
            urlData: obj,
            postData: obj
        });
        removeModalOpenClass(); // 移除body的‘modal-open’
    }
    handleCommit() {
        if (this.props.onCommit) {
            this.props.onCommit(this.state.urlData, this.state.postData);
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
export default HintModal;
