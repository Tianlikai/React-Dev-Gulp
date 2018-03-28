//新建或者编辑仪表盘-模态框
import React, { PureComponent } from 'react';
import actions from '../../../../actions/actions';
import DashboardManageStore from '../../../../stores/DashboardManageStore';
import InputWithErrMsg from '../../../../component/InputWithErrMsg';
import Button from '../../../../component/form/Button';
import Close from '../../../../component/form/Close';
import FormValidateData from '../../../../data/FormValidateData';
import {removeModalOpenClass} from '../../../../common/utils/removeModalOpenClass';
import validationIputStrType1 from '../../../../common/utils/validationIputStrType1';

const RModal = require('react-modal-bootstrap');

class DashboardModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = this.setDefaultState();
        this.hideModal = this.hideModal.bind(this);
        this.onCommit = this.onCommit.bind(this);
    }
    setDefaultState() {
        return {
            isModalOpen: false,
            isAdd: true, // 是否是新建角色
            name: '', // 角色名称
            desc: '', // 角色描述
            id: '' // 角色id
        };
    }
    componentDidMount() {
        this.unsubscribe = DashboardManageStore.listen(this.pubsub, this);
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    pubsub(type, data) {
        switch (type) {
            case 'addDashboardFail':
            case 'editDashboardFail':
                if (data.errcode === 162001) {
                    this.refs.roleName.setHint(data.errmsg);
                } else {
                    this.hideModal();
                    PopInfo.showinfo(data.errmsg, 'danger');
                }
                break;
            case 'addDashboardSuccess':
            case 'editDashboardSuccess':
                this.hideModal();
                break;
            default:
                break;
        }
    }
    openModal(isAdd, data) {
        // 如果是新建
        if (isAdd) {
            this.setState({
                isModalOpen: true,
                isAdd: isAdd
            });
        } else {
            this.setState({
                isModalOpen: true,
                isAdd: isAdd, // 是否是新建仪表盘
                name: data.name, // 仪表盘名称
                desc: data.desc, // 仪表盘描述
                id: data.id // 仪表盘id
            });
        }
    }
    hideModal() {
        this.refs.roleName.clearInput();
        let initState = this.setDefaultState();
        initState.isAdd = this.state.isAdd;
        this.setState(initState);
        removeModalOpenClass(); // 移除body的‘modal-open’
    }
    onCommit() {
        let name = this.refs.roleName.getRawValue();
        if (this.refs.roleName.handleChange(name)) {
            return;
        }
        let data = {
            name: name,
        };
        if (this.state.isAdd) {
            actions.addDashboard(data);
        } else {
            data.id = this.state.id;
            actions.editDashboard(data, this.state.id);
        }
        // this.hideModal();
    }
    render() {
        let title = this.state.isAdd ? '新建仪表盘' : '编辑仪表盘';
        let { hint, maxLength, errhint1, errhint2 } = FormValidateData.input_validation.input_validation_hint_type4;
        return (
            <RModal.Modal
                className='editDwModal'
                isOpen={this.state.isModalOpen}
                onRequestHide={this.hideModal}>
                <Close icon onClick={this.hideModal}
                    style={{ position: 'relative', top: 8, right: 8 }} />

                <div className="modal-header">
                    <div className='title'>{title}</div>
                </div>

                <div className='modal-body'>
                    <div className='line'>
                        <div className='itemName'>
                            <span>仪表盘名称</span>
                        </div>
                        <InputWithErrMsg
                            className='itemValue'
                            ref='roleName'
                            placeholder='请输入仪表盘名称'
                            textLengthLimit={64}
                            hint={hint}
                            validation={validationIputStrType1}
                            validateName='columnExplain'
                            field='请输入仪表盘名称'
                            defaultValue={this.state.name}
                            maxLength={maxLength}
                            errhint1={errhint1}
                            errhint2={errhint2}
                            errhint3='请输入仪表盘名称'
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <Button className='confirm'
                        onClick={this.onCommit}>确定</Button>
                    <Button className='cancel'
                        onClick={this.hideModal}>取消</Button>
                </div>
            </RModal.Modal>
        );
    }
}
export default DashboardModal;