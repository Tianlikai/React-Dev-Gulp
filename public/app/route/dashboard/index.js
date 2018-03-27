/*
Dashboard 仪表盘
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import actions from '../../actions/actions';
import SystemValue from '../../data/SystemValue';
import PageMethod from '../../common/PageMethod';

import Tabs from '../../component/tab/Tabs';
import DashboardManageChild from './Dashboard/index';

class Dashboard extends PureComponent {
    static propTypes = {
        isAsideActive: PropTypes.bool, // 是否选中路由
        asideData: PropTypes.array, // 左侧导航栏数据
        name: PropTypes.string, // "Dashboard"
        app: PropTypes.object // 应用数据
    }
    static defaultProps = {
        name: 'Dashboard',
        app: {
            id: -1,
            name: SystemValue.menutip.Dashboard
        }
    }
    constructor(props) {
        super(props);
        let tabLabels = ['DashBoardManagement'];
        this.state = {
            currentTab: tabLabels[0],                   // 当前在的tab
            tabLabels: tabLabels,                       // tab标签页数组
            currentTabLabels: ['DashBoardManagement'],
            tabContents: []                             // tab内容页数组
        };
    }
    componentWillMount() {
        PageMethod.checkPagePermission('user', this.props);
    }
    renderTab(data) {
        let content = null;
        let self = this;
        let currentTabLabels = this.state.currentTabLabels;
        return data.map(function (item, index) {
            return (
                <div
                    className={item + "NoOverflowY"}
                    name={item}
                    key={'Tab' + index} >
                    {self.renderTabContent(item, currentTabLabels)}
                </div>
            );
        });
    }
    renderTabContent(tabName, currentTabLabels) {
        let content = null;
        let flag = currentTabLabels.indexOf(tabName) > -1;
        switch (tabName) {
            case 'DashBoardManagement':
                content = (
                    <DashboardManageChild
                        name='DashBoardManagement'
                        app={this.props.app}
                        self={this}
                        isActive={flag} />
                );
                break;
            default:
                return null;
        }
        return content;
    }
    render() {
        let tabs = null;
        if (this.state.tabLabels.length > 0) tabs = this.renderTab(this.state.tabLabels);
        return (
            <Tabs
                ref='tabs'
                onChange={this.changeCurrentTab}
                initialSelectedIndex={this.state.currentTab}
                className='tabsChild'
                helpUrl='#'>
                {tabs}
            </Tabs>
        );
    }
}
export default Dashboard;
