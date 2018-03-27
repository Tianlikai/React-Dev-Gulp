/*
DataPermission 新建权限莫泰框
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import SingleSelect from '../../uiComponents/SingleSelect';
import RoleManageStore from '../../stores/RoleManageStore';
import actions from '../../actions/actions';

class AddpermissionsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roleList: this.props.data.roleList,
            roleId: this.props.data.roleId,
            roleName: this.props.data.roleName,
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
            roleList: null, // 角色列表
            roleId: '', // 选中的角色id
            roleName: '', // 选中的角色name
        }
    }
    componentDidMount() {
        this.unsubscribe = RoleManageStore.listen(this.pubsub, this);
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    pubsub(type, data, from) {
        switch (type) {
            case 'getRoleListSuccess':
                if (from === 'DataPermission') {
                    this.setState({
                        roleList: data
                    });
                }
                break;
            default:
                break;
        }
    }
    open() {
        this.refs.Modal.openModal();
    }
    close() {
        this.refs.Modal.hideModal();
    }
    onRoleToggle = () => {
        // 只在第一次获取 角色列表
        if (!this.state.roleList) {
            let oData = {
                app_id: this.props.app.id,
                ds_id: this.props.dsId,
                type: this.props.type
            };
            actions.getRoleList('DataPermission', oData);
        }
    }
    onRoleChange = (item) => {
        if (this.state.roleId !== item.id) {
            let oData = {
                app_id: this.props.app.id,
                ds_id: this.props.dsId,
                role_id: item.id
            };
            actions.getDataRoleCols(oData, 'PermissionPage');
            this.setState({
                isDataTableShow: false,
                roleId: item.id,
                roleName: item.name
            });
        }
        this.refs.roleSelect.setHint('');
    }
    handleRoleSearch = (value) => {
        let oData = {
            app_id: this.props.app.id,
            ds_id: this.props.dsId,
            type: this.props.type,
            name: value
        };
        actions.getRoleList('DataPermission', oData);
        this.refs.roleSelect.setHint('');
    }
    handleCommit = () => {
        let { roleName, roleId } = this.state;
        let data = {
            app_id: this.props.app.id,
            ds_id: this.props.dsId,
            role_id: roleId,
            col_name: roleName,
            col_type: '',
            col_desc: ''
        };
        let colCondition = {};
        actions.addDataRoleCol(data, colCondition);
    }
    render() {
        return (
            <div>
                <Modal
                    ref='Modal'
                    className={this.props.className}
                    titleName={this.props.titleName}
                    handleCommit={this.handleCommit}>
                    <div className='line'>

                        <div className='itemName'>选择角色</div>
                        <SingleSelect
                            ref='roleSelect'
                            className='itemValue'
                            name='roleSelect'
                            data={this.state.roleList}
                            defaultId={this.state.roleId}
                            defaultValue={this.state.roleName}
                            dataIsObject={true}
                            hasSearch={1}
                            onChange={this.onRoleChange}
                            onToggle={this.onRoleToggle}
                            handleSearch={this.handleRoleSearch} />

                    </div>
                </Modal>
            </div>
        );
    }
}

export default AddpermissionsModal;
