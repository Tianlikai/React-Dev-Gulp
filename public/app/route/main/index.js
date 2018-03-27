import React from 'react';
import Reflux from 'reflux';
import actions from '../../actions/actions';
import AsideDataStore from '../../stores/asideDataStore';
import transitionTo from '../../common/utils/transitionTo';
import AsideData from '../../data/AsideData';
import SystemValue from '../../data/SystemValue';
import PageMethod from '../../common/PageMethod';
import Header from '../../layout/layout/Header';
import Aside from '../../layout/layout/Aside';
import Footer from '../../layout/layout/Footer';
import Mock from 'mockjs';
import { APPS, LIST, DASHBOARDdLIST, CANVASDATA, ORIENT, INDUS, INDUSDATA } from '../../mock/Mock';

const Main = React.createClass({
    mixins: [
        Reflux.listenTo(AsideDataStore, 'pubsub')
    ],
    propTypes: {
        ComponentTag: React.PropTypes.node
    },
    getInitialState: function () {
        let allUrls = PageMethod.getAllUrls(AsideData.adminData);
        allUrls.push('/main');
        let apps = [
            {
                id: -1,
                name: SystemValue.menutip.Dashboard
            }
        ];
        let asideData = PageMethod.getAsideData(apps, AsideData.adminData);
        return {
            isAsideActive: false, // 是否从getApps获得了数据
            apps: apps,
            asideData: asideData, // 左侧导航栏的数据
            allUrls: allUrls // 所有AsideData中的to
        };
    },
    componentDidMount: function () {
        Mock.mock('/lae/server/dashboard/list', LIST);
        Mock.mock('/lae/org/apps', APPS);
        Mock.mock('/lae/dashboard/chart/list?dashboard_id=412', DASHBOARDdLIST)
        Mock.mock('/lae/cal/tasks/dashboardnew3?id=1&page=1', CANVASDATA)
        actions.getApps(); // 获取用户 的应用权限 
        let iDList = localStorage.getItem('canvasCondListID');
        let iDArray = iDList ? iDList.split(',') : null;
        if (iDArray) {
            iDArray.forEach(function (item) {
                localStorage.removeItem(`canvas${item}Cond`);
            });
        }
        localStorage.removeItem('canvasCondListID');
        window.addEventListener('resize', this.updateHeight);
    },
    componentWillUnmount: function () {
        window.removeEventListener('resize', this.updateHeight);
    },
    setActivePage: function () {
        let path = this.props.location.pathname;
        if (this.state.allUrls.indexOf(path) > -1) {
            let name = path.split('/')[2];
            let activePage;
            let activePageName;
            if (name) {
                activePageName = SystemValue.menutip[name];
                activePage = PageMethod.getDataByIds([name], AsideData.adminData, 'subtitle')[0].id;
            } else {
                activePageName = this.state.apps[0].name;
                activePage = this.state.apps[0].id;
            }
            return {
                id: activePage,
                name: activePageName
            };
        }
        return {
            id: '',
            name: ''
        };
    },
    // 当浏览器大小改变时，触发
    updateHeight: function () {
        actions.updateHeight();
    },
    pubsub: function (type, data) {
        if (type === 'getAppsSuccess') {
            let apps = this.state.apps.concat(data);
            let asideData = PageMethod.getAsideData(apps, AsideData.adminData);
            this.setState({
                isAsideActive: true,
                apps: apps,
                asideData: asideData
            });
        }
    },
    changeCurrentPage: function (item) {
        transitionTo(item.to);
    },
    render: function () {
        let asideData = this.state.asideData;
        let active = this.setActivePage();
        return (
            <div key='divwrapper'
                className='userMain'
            >
                <Aside
                    data={asideData}
                    onChange={this.changeCurrentPage}
                    key='asidewrpper'
                    activePage={active.id} />
                <div className='content-wrapper'
                    key='contentwrapper'>
                    <Header key='headerwrapper'
                        isAdminPlatform={false}
                        activePageName={active.name}
                        onChange={this.changeCurrentPage} />
                    <div className='content'
                        ref='pageContent'>
                        {this.props.children && React.cloneElement(this.props.children, {
                            isAsideActive: this.state.isAsideActive,
                            asideData: this.state.asideData
                        })}
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
});

export default Main;
