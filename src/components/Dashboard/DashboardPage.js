/*
Dashboard子页面：我创建的 和 来自分享 共同部分封装
*/
import React from 'react';
import Reflux from 'reflux';

import Util from "../../common/Util"
import actions from "../../actions/actions";
import Config from "../../config/config";
import SystemValue from "../../data/systemValue";
import PageMethod from '../../common/PageMethod';

import DashboardStore from "../../stores/DashboardStore";
import UtilStore from '../../stores/UtilStore';

import Button from "../button"

import GraphPage from "../Dashboard/GraphPage";

// const PopInfo = require('../../../uiComponents/PopInfo');
// const DeleteModal = require('../../modules/DeleteModal');

// const ShareModal = require('../PublishToApp/ShareModal');
// const GraphPage = require('../Dashboard/GraphPage');
// const TablePage = require('../Dashboard/TablePage');
// import AddModal from './AddModal';
// import EditModal from './EditModal';
// import FilterModal from './FilterModal';

class DashboardPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appID: this.props.appID,
            dashList: [], // 进入页面时先获取总共有多少图表
            loadedDashList: [],
            dashComponents: [] // 所有图表组件的集合
        }
    }

    pubsub(type, data, from) {
        if (type === 'getDashListSuccess') {
            if (from === this.props.name) {
                let dashList = [];
                let loadedDashList = [];
                let length1 = data.length;
                let dash = null;
                for (let i = 0; i < length1; i++) {
                    dash = data[i];
                    dash.type = data[i].plot_type;
                    dashList.push(dash);
                }
                let length2 = dashList.length;
                if (length2 > 0) {
                    let j = length2 < Config.pageLimit3 ? length2 : Config.pageLimit3;
                    for (let i = 0; i < j; i++) {
                        loadedDashList.push(dashList[i]);
                    }
                }
                this.setState({
                    dashList: dashList,
                    loadedDashList: loadedDashList
                }, function () {
                    let postData = null;
                    for (let i = 0, j = loadedDashList.length; i < j; i++) {
                        let urlData = {
                            id: loadedDashList[i].id,
                            page: 1
                        };
                        actions.getDashChartData(urlData, {}, this.props.name);
                    }
                })
            }
        }
    }

    renderTitleDiv() {
        let addBtn = null;
        if (this.props.name === 'CreatedByMe') {
            let theme = {
                button: "button",
                accent: "accent",
                flat: "flat",
                floating: "floating",
                icon: "icon",
                neutral: "neutral",
                primary: "primary",
                raised: "raised",
                icon: "add_icon"
            }
            addBtn = (
                <Button
                    className="add_dashboard"
                    theme={theme}
                    icon
                    value='添加画布'
                />
            )
        }
        let titleDiv = (
            <div
                className='titleDiv'
            >
                <h2>
                    <img src='./dist/images/Dashboard.png' />
                    {SystemValue.menutip[this.props.name]}
                </h2>
                <div className="btnGroup">
                    {addBtn}
                </div>
            </div>
        )
        return titleDiv;
    }

    showDelModal() { }

    showFilterModal() { }

    showEditModal() { }

    showShareModal() { }
    
    onChartDbClick() { }

    renderDashComponents(list) {
        let dashId = '';
        return list.map((item, index) => {
            dashId = 'DashComponent' + item.id;
            return (
                <GraphPage
                    ref={dashId}
                    key={dashId}
                    className='col-md-6'
                    fromPage={this.props.name}
                    appId={item.app_id}
                    dsId={item.ds_id}
                    id={item.id}
                    shared={item.shared}
                    onDel={this.showDelModal}
                    onFilter={this.showFilterModal}
                    onEdit={this.showEditModal}
                    onShare={this.showShareModal}
                    onChartDbClick={this.onChartDbClick}
                    fullScreen={false} />
            )
        })
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.shouldUpdate !== this.props.shouldUpdate) {
            return false;
        }
        return true;
    }
    componentDidMount() {
        this.unsubscribe = DashboardStore.listen(this.pubsub, this);
        this.unsubscribe2 = UtilStore.listen(this.pubsub, this);
    }
    componentWillUnmount() {
        this.unsubscribe();
        this.unsubscribe2();
    }

    render() {
        let minheights = PageMethod.getInnerHeight2();
        let addModal = null;
        let shareModal = null;
        let editModal = null;
        let deleteModal = null;
        let titleDiv = this.renderTitleDiv();
        let content = null;
        if (this.state.dashList.length === 0) {
            let hintName = '暂无任何画布';
            if (this.props.name === 'CreatedByMe') {
                hintName = '暂无任何画布，请点击右上角的“添加画布”进行添加';
            }
            content = (
                <div
                    ref='dashboard'
                    style={{ height: minheights }}
                    className='dashboard-null'>
                    <div>
                        <img src='./dist/images/Dashboard_null.png' />
                        <div className='title'>{hintName}</div>
                    </div>
                </div>
            );
            /**
             * return后后面的代码不会执行
             */
            return (
                <div ref='dashboardPage' className='dashboardPage'>
                    {titleDiv}
                    {content}
                </div>
            )
        };
        content = (
            <div ref='dashboard' style={{ height: minheights }}
                className='dashboard'>
                {this.renderDashComponents(this.state.loadedDashList)}
            </div>
        );
        return (
            <div ref='dashboardPage' className='dashboardPage'>
                {titleDiv}
                {content}
            </div>
        )
    }
}

export default DashboardPage;
