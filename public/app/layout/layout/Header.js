'use strict';

const React = require('react');
const Reflux = require('reflux');
import { Link } from 'react-router';

const actions = require('../../actions/actions');
const lang = require('../../data/lang');
const curlang = require('../../lang');
const SystemValue = require('../../data/SystemValue');
const Dropdown = require('../../component/Dropdown/Dropdown');
const Icon = require('../../component/form/Icon');


const Header = React.createClass({
    getInitialState: function () {
        let userType = parseInt(localStorage.getItem('userType'), 10);
        return {
            lang: curlang(),
            isAdminPlatform: this.props.isAdminPlatform,
            userType: userType
        };
    },
    handleClick: function (type, e) {
        e.stopPropagation();
        this.refs.dropdown.setDropdownState(false);
        if (type === 'logout') {
            actions.logout();
        } else if (type === 'help') {
            let loc = window.location;
            let port = loc.port ? ':' + loc.port : '';
            let url = loc.protocol + '//' + loc.hostname + port + '/help/';
            if (this.state.isAdminPlatform) {
                url += 'ssc_01.html';
            } else {
                url += 'index.html';
            }
            window.open(url);
        } else if (type === 'adminPlatform') {
            this.redirectToAdmin();
        }
    },
    // 打开 管理员平台
    redirectToAdmin: function () {
        let loc = window.location;
        let port = loc.port ? ':' + loc.port : '';
        let url = loc.protocol + '//' + loc.hostname + port + '/#/admin/RoleManagement';
        window.open(url);
    },
    changeTab: function (e) {
        e.stopPropagation();
        let item = {
            id: 'SystemSettingsCenter',
            name: SystemValue.menutip.SystemSettingsCenter,
            to: '/admin/SystemSettingsCenter'
        };
        if (this.props.onChange) {
            this.props.onChange(item);
        }
    },
    render: function () {
        let beforeElement = (
            <span className='userWrapperSpan'>
                <img className='user-image' alt='User' src='/dist/images/userImg.png' />
            </span>
        );
        let adminPlatform = null; // 管理员平台-入口
        let helpDocument = (
            <Dropdown.item center
                onClick={this.handleClick.bind(this, 'help')}>
                帮助文档
            </Dropdown.item>
        ); // 帮助文档-入口
        let dataSource = null; // 数据仓库-入口
        if (this.state.userType === 1) { // 是管理员
            if (this.state.isAdminPlatform) { // 管理平台
                dataSource = (
                    <span className='navbar-custom-help' onClick={this.changeTab}>
                        <span className='glyphicon glyphicon-cog'></span>
                    </span>
                );
            } else {
                adminPlatform = (
                    <Dropdown.item center
                        onClick={this.handleClick.bind(this, 'adminPlatform')}>
                        系统设置中心
                    </Dropdown.item>
                );
            }
        }
        return (
            <div ref='mainheader' className='main-header'>
                <div className='activePageName'>{this.props.activePageName}</div>
                <div className='navbar navbar-static-top'>
                    {dataSource}
                    <div className='navbar-custom-menu'>
                        <ul className='nav navbar-nav'>
                            <Dropdown
                                ref='dropdown'
                                icon='menu-down'
                                contentClass='dropdown-menu-anchor'
                                beforeElement={beforeElement} className='userWrap'>
                                <Dropdown.item>
                                    <div>{localStorage.getItem('username')}</div>
                                    <div>{localStorage.getItem('email')}</div>
                                </Dropdown.item>
                                {helpDocument}
                                {adminPlatform}
                                <Dropdown.item center
                                    onClick={this.handleClick.bind(this, 'logout')}>
                                    <Icon icon='off' /><span>{lang.logout}</span>
                                </Dropdown.item>
                            </Dropdown>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});
module.exports = Header;
