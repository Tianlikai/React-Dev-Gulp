/*
Dashboard 分享模态框
*/
import React, { Component } from 'react';
const RModal = require('react-modal-bootstrap');

const Close = require('../../../../component/form/Close');
const Button = require('../../../../component/form/Button');

const removeModalOpenClass = require('../../../../common/utils/removeModalOpenClass');

const PublishToUser = require('./PublishToUser');
const SelectedItem = require('./SelectedItem');

class ShareModal extends Component {
    constructor(props) {
        super(props);
        this.state = this.setDefaultState();
        this.hideModal = this.hideModal.bind(this);
        this.handleShare = this.handleShare.bind(this);
        this.onRemoveItem = this.onRemoveItem.bind(this);
        this.onChangeCheckList = this.onChangeCheckList.bind(this);
        this.clearCheckList = this.clearCheckList.bind(this);
    }
    setDefaultState() {
        return {
            isModalOpen: false,
            id: '', // 要分享的图表的id
            userList: [],
            checkList: []
        };
    }
    openModal(id, data) {
        this.setState({
            isModalOpen: true,
            id: id,
            userList: data.users,
            checkList: data.shared
        });
    }
    hideModal() {
        let initState = this.setDefaultState();
        this.setState(initState);
        removeModalOpenClass(); // 移除body的‘modal-open’
    }
    // 分享
    handleShare() {
        if (this.props.onShareChart) {
            let ids = this.refs.publishToUser.getValue();
            let data = {
                id: this.state.id,
                uids: ids.join(',')
            };
            this.props.onShareChart(data, ids);
        }
        this.hideModal();
    }
    // SelectedItem的回调函数：移除选中的item
    onRemoveItem(data) {
        let list = this.state.checkList.filter(function (item) {
            return item.id !== data.id;
        });
        this.setState({
            checkList: list
        });
    }
    // PublishToUser的回调函数
    onChangeCheckList(data) {
        this.setState({
            checkList: data
        });
    }
    // 清空全部
    clearCheckList() {
        this.setState({
            checkList: []
        });
    }
    render() {
        if (!this.state.isModalOpen) {
            return null;
        }
        return (
            <RModal.Modal
                className='share-chart-modal'
                isOpen={this.state.isModalOpen}
                onRequestHide={this.hideModal}>
                <Close icon onClick={this.hideModal} />

                <div className="modal-header">
                    <div className='title'>{this.props.titleName}</div>
                </div>

                <div className='modal-body'>
                    <div className='title-wrap'>
                        <img src='./dist/images/shared-user.png' />
                     已选分享对象
                        <span onClick={this.clearCheckList}>清空全部</span>
                    </div>
                    <SelectedItem
                        dataIsObject={1}
                        data={this.state.checkList}
                        onRemove={this.onRemoveItem}
                    />
                    <PublishToUser
                        ref='publishToUser'
                        data={this.state.userList}
                        checkList={this.state.checkList}
                        onChange={this.onChangeCheckList} />
                </div>

                <div className="modal-footer">
                    <Button className='cancel'
                        onClick={this.hideModal}>取消</Button>
                    <Button className='confirm'
                        onClick={this.handleShare}>
                      确定</Button>
                </div>
            </RModal.Modal>
        );
    }
}

module.exports = ShareModal;
