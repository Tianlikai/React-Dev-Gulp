/*
Dashboard子页面：我创建的 和 来自分享 共同部分封装
*/
import React, { PureComponent } from 'react';
import classnames from 'classnames';

import deepClone from '../../../../../common/utils/deepClone';
import Config from '../../../../../common/Config';
import PageMethod from '../../../../../common/PageMethod';

import DashboardStore from '../../../../../stores/DashboardStore';
import UtilStore from '../../../../../stores/UtilStore';
import actions from '../../../../../actions/actions';

import DashboardListHOCII from './DashboardListHOCII';
import Button from '../../../../../jComponent/button/Button';
import PopInfo from '../../../../../component/PopInfo';
import { graphPageFactory } from '../../graphic/Graphic';
import GraphWrap from '../../GraphWrap';
import TableWrap from '../../TableWrap';

const GraphicTableWrap = graphPageFactory(TableWrap);
const GraphicWrap = graphPageFactory(GraphWrap);

@DashboardListHOCII
class DashboardList extends PureComponent {
    constructor(props) {
        super(props);
        this.List = [];
        this.state = {
            appId: this.props.appId, // 应用id
            canvasList: [], // 画布列表
            canvasListSort: [], // 排序时的画布列表 调用的不同接口  正常的接口数量有限制
            activeDashboard: this.props.activeDashboard, //选中的仪表盘
            loadedCanvasList: [],
            formShareUserName: '', //被分享仪表盘的拥有者
            isSearchDispatch: false,
        }
        this.handleRefreshByAddSucceses = this.handleRefreshByAddSucceses.bind(this);
        this.scrollMonitorListener = this.scrollMonitorListener.bind(this);
        this.onChartDbClick = this.onChartDbClick.bind(this);
        this.sortCanvasList = this.sortCanvasList.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            activeDashboard: nextProps.activeDashboard,
        })
    }
    componentDidMount() {
        this.unsubscribe1 = DashboardStore.listen(this.pubsub, this);
        this.unsubscribe = UtilStore.listen(this.pubsub, this);
    }
    componentWillUnmount() {
        this.unsubscribe();
        this.unsubscribe1();
    }
    pubsub(type, data, from, formShareUserName) {
        switch (type) {
            case 'getDashListSuccess':
                if (from === this.props.name) {
                    if (this.refs.dashboard) this.refs.dashboard.scrollTop = 0;
                    let canvasList = [];
                    let loadedCanvasList = [];
                    let length1 = data.length;
                    let dash = null;
                    for (let i = 0; i < length1; i++) {
                        dash = data[i];
                        dash.type = data[i].plot_type;
                        canvasList.push(dash);
                    }
                    let length2 = canvasList.length;
                    if (length2 > 0) {
                        let j = length2 < Config.pageLimit3 ? length2 : Config.pageLimit3;
                        for (let i = 0; i < j; i++) {
                            loadedCanvasList.push(canvasList[i]);
                        }
                    };
                    let allList = deepClone(this.List);
                    allList = canvasList;
                    this.List = allList;
                    this.setState({
                        canvasList: canvasList,
                        loadedCanvasList: loadedCanvasList,
                        formShareUserName: formShareUserName,
                        isSearchDispatch: false
                    }, function () {
                        let postData = null;
                        for (let i = 0, j = loadedCanvasList.length; i < j; i++) {
                            let urlData = {
                                id: loadedCanvasList[i].id,
                                page: 1
                            };
                            actions.getDashChartData(urlData, {}, this.props.name);
                        }
                    });
                }
                break;
            case 'delDashChartSuccess':
                if (from === this.props.name) {
                    let canvasList = deepClone(this.state.canvasList);
                    let loadedCanvasList = deepClone(this.state.loadedCanvasList);
                    let totalLength = canvasList.length;
                    let loadedLength = loadedCanvasList.length;
                    let willLoad = null;
                    if (totalLength > loadedLength) {
                        willLoad = canvasList[loadedLength];
                    };
                    canvasList = PageMethod.delItems(data, canvasList, 'id');
                    let delList = deepClone(this.List);
                    this.List = PageMethod.delItems(data, delList, 'id');;
                    loadedCanvasList = PageMethod.delItems(data, loadedCanvasList, 'id');
                    if (willLoad) {
                        loadedCanvasList.push(willLoad);
                    }
                    let isSerDispatch = this.List.length > 0 ? true : false;
                    this.setState({
                        canvasList: canvasList,
                        loadedCanvasList: loadedCanvasList,
                        isSearchDispatch: isSerDispatch
                    }, function () {
                        if (willLoad) {
                            let urlData = {
                                id: willLoad.id,
                                page: 1
                            };
                            actions.getDashChartData(urlData, {}, this.props.name);
                        }
                    });
                }
                break;
            case 'addDashChartSuccess':
            case 'verifyDataLengthSuccess':
                if (from.fromPage === this.props.name) {
                    let urlData = {
                        id: data.id,
                        page: 1
                    };
                    actions.verifyDataLength(urlData, {}, 'addModal'); // 检查来自 创建画布的操作
                } else if (from.fromPage === 'verifyDataLength' && formShareUserName === 'addModal') {
                    if (data.hasData === 3) {
                        this.refs.addModal.setModalIsVisible(false);
                        let openData = [{
                            name: data.name,
                            id: data.id
                        }];
                        from.fromPage = 'verifyDataLength';
                        let saveData = {
                            from: from,
                            data: data
                        }
                        this.IsShowCanvasModalInstance.openModal(openData, saveData);
                    } else {
                        from.fromPage = this.props.name;
                        this.handleRefreshByAddSucceses(from, data);
                    }
                } else if (from.fromPage === 'verifyDataLength' && formShareUserName === 'editModal') {
                    if (data.hasData === 3) {
                        this.refs[`DashComponent${data.id}`].refs.editModal.setModalIsVisible(false);
                        let openData = [{
                            name: data.name,
                            id: data.id
                        }];
                        from.fromPage = 'verifyDataLength';
                        let saveData = {
                            from: from,
                            data: data
                        }
                        this.refs[`DashComponent${data.id}`].IsShowEditCanvasModalInstance.openModal(openData, saveData, this.state.activeDashboard.id);
                    } else {
                        this.refs[`DashComponent${data.id}`].refs.editModal.hideModal('true');
                        this.refs[`DashComponent${data.id}`].handleRefresh();
                    }
                }
                break;
            case 'onCommitCopyCanvnsToSuccess':
                this.refs[`DashComponent${from}`].handleCloseDashboardListModal();
                break;
            case 'onCommitMoveCanvnsToSuccess':
                this.refs[`DashComponent${from}`].handleCloseDashboardListModal();
                let canvasId = from; // 传回的是移动画布的Id
                let newLoadedCanvasList = [];
                this.state.loadedCanvasList.map(function (list) {
                    if (list.id !== canvasId) newLoadedCanvasList.push(list);
                });
                let MoveList = deepClone(this.List);
                MoveList = newLoadedCanvasList
                this.List = MoveList;
                this.setState({
                    loadedCanvasList: newLoadedCanvasList,
                    canvasList: newLoadedCanvasList,
                    isSearchDispatch: false
                });
                break;
            case 'onGetAllCanvasSortSuccess':
                this.setState({
                    canvasListSort: data.list
                }, function () {
                    this.refs.sortCanvasModal.open();
                });
                break;
            case 'onCommitSortCanvasSuccess':
                this.handleCloseSortModal();
                break;
            default:
                break;
        }
    }
    /**
     * 添加画布 刷新界面
     * @param {*} from 
     * @param {*} data 
     */
    handleRefreshByAddSucceses(from, data) {
        this.refs.addModal.hideModal();

        let { id, name, plot_type: type, app_id, ds_id } = data;
        let fromData = Object.assign(
            {},
            from,
            { id, name, type, app_id, ds_id });

        let canvasList = deepClone(this.state.canvasList);
        let loadedCanvasList = deepClone(this.state.loadedCanvasList);

        let totalLength = canvasList.length;
        let loadedLength = loadedCanvasList.length;

        if (loadedLength < totalLength) {
            canvasList.push(fromData);
            let addList = deepClone(this.list);
            addList = canvasList
            this.List = addList;
            this.setState({
                canvasList: canvasList
            });
        } else if (loadedLength === totalLength) {
            canvasList.push(fromData);
            loadedCanvasList.push(fromData);
            let addList = deepClone(this.list);
            addList = canvasList
            this.List = addList;
            this.setState({
                canvasList: canvasList,
                loadedCanvasList: loadedCanvasList,
                isSearchDispatch: false
            }, function () {
                let urlData = {
                    id: data.id,
                    page: 1
                };
                actions.getDashChartData(urlData, {}, this.props.name);
            });
        }
    }
    /**
     * 同步父子组件的状态
     * @param {*} arr 返回的排序后的画布列表 
     */
    sortCanvasList(arr) {
        this.setState({
            canvasListSort: arr
        })
    }
    /**
     * 关闭’画布排序‘模态框
     */
    handleCloseSortModal() {
        this.refs.sortCanvasModal.close();
        let data = {
            dashboard_id: this.state.activeDashboard.id
        }
        let formShareUserName = this.state.formShareUserName;
        actions.getDashList(this.props.name, data, formShareUserName); // 刷新当前页面
    }
    /**
     * 从全屏页返回时，设置 图表的 一些状态
     * @param {*} data 
     */
    setChart(data) {
        let whichComponent = 'DashComponent' + data.id;
        if (data.type === 4) {
            this.refs[whichComponent].setIndex(data.page);
        } else {
            this.refs[whichComponent].setShowNumber(data.isNumberShow);
        }
        this.refs[whichComponent].setLoading(true);
        let urlData = {
            id: data.id,
            page: data.page
        };
        let postData = {};
        if (data.cond.length > 0) {
            postData = {
                condition: data.cond
            };
        };
        this.setState({
            cond: data.cond
        }, function () {
            actions.getDashChartData(urlData, postData, this.props.name);
        });
    }
    onChartDbClick(data) {
        if (this.props.onDetailPage) {
            this.props.onDetailPage(data);
        }
    }
    /**
    * 图表在 被隐藏时，如果浏览器窗口发生变化，则ReactEchart的handleResize函数执行时，
    * 会获取不到图表的 大小(width, height)，所以要在图表从隐藏变为显示时，重新绘制
    */
    resizeChart() {
        let dashId = '';
        let list = this.state.loadedCanvasList;
        for (let i = 0, j = list.length; i < j; i++) {
            if (list[i].type !== 4) {
                dashId = 'DashComponent' + list[i].id;
                this.refs[dashId].handleResize();
            }
        }
    }
    /**
     * 滚动监听器
     */
    scrollMonitorListener(top, height) {
        let scrollHeight = top + height; //当前滚动的距离加上可显示区域 IE下滚动条会少10px 所以减掉10px
        if (scrollHeight >= 2730) {
            let canvasList = this.state.canvasList;
            let loadedCanvasList = deepClone(this.state.loadedCanvasList);
            let totalLength = canvasList.length; // 总数
            let loadedLength = loadedCanvasList.length; // 已加载的数量
            let differLength = totalLength - loadedLength; // 还有多少没有加载
            let header = 100; // 顶部 和 tabs组件 头部
            let searchBox = 60; // 仪表盘搜索框
            let canvasHeader = 60; // 画布列表头部 仪表盘名称
            let cavasHeight = 630; // 单个画布所占的高度
            // 判断是佛加载画布标志
            let flag = header + searchBox + canvasHeader + cavasHeight * loadedLength - 10; //IE下滚动条会少10px 所以减掉10px
            if (flag <= scrollHeight) {
                if (totalLength !== loadedLength) {
                    let j = differLength < Config.pageLimit3 ? differLength : Config.pageLimit3;
                    for (let i = 0; i < j; i++) {
                        loadedCanvasList.push(canvasList[loadedLength + i]);
                    }
                    this.setState({
                        loadedCanvasList: loadedCanvasList
                    }, function () {
                        let postData = null;
                        for (let i = 0; i < j; i++) {
                            let urlData = {
                                id: canvasList[loadedLength + i].id,
                                page: 1
                            };
                            actions.getDashChartData(urlData, {}, this.props.name);
                        }
                    });
                }
            }
        }
    }
    // 获取画布List列表
    getCanvasList() {
        let canvasList = deepClone(this.List);
        return canvasList;
    }
    // 设置画布List列表
    setCanvasList(newList) {
        PopInfo.showloading(true);
        if (this.refs.dashboard) this.refs.dashboard.scrollTop = 0;
        let canvasList = [];
        let loadedCanvasList = [];
        let length1 = newList.length;
        let dash = null;
        for (let i = 0; i < length1; i++) {
            dash = newList[i];
            dash.type = newList[i].plot_type || newList[i].type;
            canvasList.push(dash);
        }
        let length2 = canvasList.length;
        if (length2 > 0) {
            let j = length2 < Config.pageLimit3 ? length2 : Config.pageLimit3;
            for (let i = 0; i < j; i++) {
                loadedCanvasList.push(canvasList[i]);
            }
        };
        this.setState({
            canvasList: canvasList,
            loadedCanvasList: loadedCanvasList,
            isSearchDispatch: true
        }, function () {
            setTimeout(function () {
                PopInfo.showloading(false);
            }, 100);
            let postData = null;
            for (let i = 0, j = loadedCanvasList.length; i < j; i++) {
                let urlData = {
                    id: loadedCanvasList[i].id,
                    page: 1
                };
                actions.getDashChartData(urlData, {}, this.props.name);
            }
        });
    }
    /**
     * 先渲染所有图表组件的集合
     * @param {obj} list 已加载的仪表盘列表
     * @param {obj} dashboardList 所有仪表盘列表
    */
    renderDashComponents(list, dashboardList) {
        let domWidth = null;
        if (this.refs.dashboard) domWidth = this.refs.dashboard.clientWidth;
        if (!list.length) return null;
        let dashId = '';
        let pageclass = classnames(
            'col-md-12',
            { 'marBottom': this.state.canvasList.length > 1 }
        )

        let {
            name, // fromPage标识
            SwitchingDataData,
            ...other
        } = this.props;

        return list.map(function (item, index) {
            dashId = 'DashComponent' + item.id;
            // item.type === 4 为table类型表格
            // 否则为 非table类型表格
            return item.type === 4 ?
                <GraphicTableWrap
                    index={index}
                    ref={dashId}
                    key={dashId}
                    className={pageclass}
                    fromPage={name}
                    useFrom={'dashboard'}
                    dashboardList={dashboardList}
                    app_Id={item.app_id}
                    dsId={item.ds_id}
                    id={item.id}
                    {...other}
                />
                :
                <GraphicWrap
                    index={index}
                    ref={dashId}
                    key={dashId}
                    className={pageclass}
                    fromPage={name}
                    useFrom={'dashboard'}
                    dashboardList={dashboardList}
                    app_Id={item.app_id}
                    dsId={item.ds_id}
                    id={item.id}

                    dashId={dashId}
                    onChartDbClick={this.onChartDbClick}
                    domWidth={domWidth}
                    {...other}
                />
        }.bind(this));
    }
    render() {
        // console.log(this.props, 'props4');
        let minheights = PageMethod.getInnerHeight6();
        let {
            name,
            activeDashboard, // 选中的仪表盘
            dashboardList, // 仪表盘列表
        } = this.props;
        let {
            appId,
            loadedCanvasList, // 已经加载的仪表盘
        } = this.state;
        let content = (
            <div style={{ height: 620 }}
                className='dashboard'>
                {this.renderDashComponents(loadedCanvasList, dashboardList)}
            </div>
        );
        return (
            <div className='dashboardPage'>
                {content}
            </div>
        )
    }
}
DashboardList.propTypes = {
    isNumberShow: React.PropTypes.oneOfType([
        React.PropTypes.bool,
        React.PropTypes.string,
    ]),
    activeDashboard: React.PropTypes.object,
    name: React.PropTypes.string,
    canvas: React.PropTypes.array,
    appId: React.PropTypes.number,
    dashboardList: React.PropTypes.oneOfType([
        React.PropTypes.array,
        React.PropTypes.object
    ]),
}

export default DashboardList;
