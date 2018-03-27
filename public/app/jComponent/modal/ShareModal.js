/*
Dashboard 仪表盘 分享模态框
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import PublishToUser from '../../components/pages/PublishToApp/PublishToUser';
import SelectedItem from '../../components/modules/SelectedItem';

class ShareModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
        };
    }
    static propTypes = {
        titleName: PropTypes.string,
        className: PropTypes.string,
        children: PropTypes.node,
        data: PropTypes.object
    }
    static defaultProps = {
        titleName: '模态框',
        className: '',
        data: {
            userList: [],
            checkList: []
        }
    }
    open() {
        this.refs.Modal.openModal();
    }
    close() {
        this.refs.Modal.hideModal();
    }
    render() {
        if (!this.state.data) return null;
        return (
            <div>
                <Modal
                    ref='Modal'
                    className={this.props.className}
                    titleName={this.props.titleName}>
                    <div className='title-wrap'>
                        <img src='./dist/images/shared-user.png' />
                        已选分享对象
                     <span onClick={this.clearCheckList}>清空全部</span>
                    </div>
                    <SelectedItem
                        dataIsObject={1}
                        data={this.state.data.checkList}
                        onRemove={this.onRemoveItem}
                    />
                    <PublishToUser
                        ref='publishToUser'
                        data={this.state.data.userList}
                        checkList={this.state.data.checkList}
                        onChange={this.onChangeCheckList} />
                </Modal>
            </div>
        );
    }
}

export default ShareModal;
