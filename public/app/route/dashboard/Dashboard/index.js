import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup.js';
import DashboardMain from './dashboardMain/index';
import FullScreen from './dashboardFullScreen/FullScreen';
import DetailPage from './dashboardDetail/DetailPage';
import divideGroups from '../../../common/utils/divideGroups'
import getFiristDashboard from '../../../common/utils/getFiristDashboard'
import deepClone from '../../../common/utils/deepClone';
import PageMethod from '../../../common/PageMethod';
import Config from '../../../common/Config';

import actions from '../../../actions/actions';
import DashboardManageStore from '../../../stores/DashboardManageStore';
import UtilStore from '../../../stores/UtilStore';

const config = {
    allActivePage: ['Main', 'fullScreen', 'Detail']
}
const TransitionTime = 800;
class DashboardManageChild extends PureComponent {
    static propTypes = {
        self: PropTypes.object, // 顶层对象        
        name: PropTypes.string, // 'DashBoardManagement'
        app: PropTypes.object, // 应用数据
        isActive: PropTypes.bool // tabs是否激活
    }
    constructor(props) {
        let flag = localStorage.getItem('dashboardToggle');
        if (flag === 'false') {
            flag = false;
        } else {
            flag = true;
        }
        super(props);
        this.letters = Config.letters;
        this.SwitchingPageTimer = null;
        this.pageLimit = Config.pageLimit6; // 12条
        this.scrollTop = 0;                      // 滚动条位置  默认为0 
        this.state = {
            activePage: config.allActivePage[0],
            triggerCanvasId: null, // 触发界面跳转到全屏和详情的画布id 
            isFirstIn: true,
            mainData: {
                dashboardToggle: flag, // 仪表盘列表是否打开，默认打开 打开为false、关闭为true
                activeDashboard: null, //选中的仪表盘
                mainSideData: {
                    dashboardList: [], // 仪表盘列表
                    groups: null, // 仪表盘按照拼音首字母分组
                },
                cavasData: {
                    canvasList: [], // 画布列表
                    canvasListSort: [], // 排序时的画布列表 调用的不同接口  正常的接口数量有限制
                    loadedCanvasList: [], // 已经加载的画布列表
                    formShareUserName: '', // 该仪表盘的创建者
                    isSearchDispatch: false, // 是否有搜索画布功能发起 默认不是
                }
            },
            SwitchingData: { // 全屏和返回的切换数据
                slicersValue: null, // 切片器数据
                chartData: null, // 图表数据 
                activeDashboard: null, // 选中的activeDashboard
            }
        };
    }
    componentDidMount() {
        this.unsubscribe = DashboardManageStore.listen(this.pubsub, this);
        if (this.props.isActive) actions.getDashboardList();
    }
    componentWillUnmount() {
        this.unsubscribe();
        this.SwitchingPageTimer = null;
    }
    pubsub(type, data, from, from2) {
        switch (type) {
            // 初始化仪表盘成功
            // 更新仪表盘成功
            case 'getDashboardListSuccess':
                let res = null;
                let groups = null;
                let letters = this.letters;
                groups = divideGroups(data, letters);
                res = getFiristDashboard(letters, groups);
                if (from2 === 'addDashboard') {
                    res = data[0];
                }
                let oldState = deepClone(this.state.mainData);
                oldState.mainSideData.dashboardList = data;
                oldState.activeDashboard = res;
                oldState.mainSideData.groups = groups;
                oldState.cavasData.isSearchDispatch = from2 === 'fromSearch' ? true : false;
                this.setState({
                    mainData: oldState,
                    isFirstIn: false,
                }, function () {
                    if (res) {
                        let data = {
                            dashboard_id: res.id
                        }
                        let formShareUserName = res.beshared === 1 && res.beshared_name ? res.beshared_name : '';
                        actions.getDashList(this.props.name, data, formShareUserName);
                    }
                }
                );
                break;
            default:
                break;
        }
    }
    /**
     * 从全屏返回
     * 回到之前的锚点的位置
     */
    handleBackFromFullToAnchor = () => {
        this.SwitchingPageTimer = setTimeout(() => {
            document.body.scrollTop = this.scrollTop; // 此时全屏页面为830px 所以添加一个830px
            document.documentElement.scrollTop = this.scrollTop;
        }, TransitionTime)
    }
    /**
     * 从详情返回
     * 回到之前的锚点的位置
     */
    handleBackFromDetailToAnchor = () => {
        const scrollMove = 100; // 返回时滚动条回滚100px
        document.body.scrollTop = this.scrollTop;
        document.documentElement.scrollTop = this.scrollTop;
    }
    /**
     * 切换tabs
     * @param {num} activePage 选中的tabs
     */
    handleChangeActivePage = (activePage, SwitchingData) => {
        switch (activePage) {
            case 'fullScreen': // 进入全屏
                let fullTop = document.body.scrollTop; // 滚动条位置
                if (!fullTop) fullTop = document.documentElement.scrollTop;
                this.scrollTop = fullTop;
                this.setState({
                    activePage: activePage,
                    SwitchingData: SwitchingData,
                    triggerCanvasId: SwitchingData.chartData.id
                });
                break;
            case 'Detail': // 进入详情页面 
                let detailTop = document.body.scrollTop; // 滚动条位置
                if (!detailTop) detailTop = document.documentElement.scrollTop;
                this.scrollTop = detailTop;
                this.setState({
                    activePage: activePage,
                    triggerCanvasId: SwitchingData.id
                }, function () {
                    // 进入详情页面、请求数据
                    let urlData = {
                        id: SwitchingData.id,
                        page: 1,
                        size: this.pageLimit,
                        filter_key: SwitchingData.filter_key,
                    };
                    let postData = {
                        condition: SwitchingData.slicerCondition,
                        drill_values: SwitchingData.drill_values,
                        filter_value: SwitchingData.name,                        
                    }
                    actions.getChartDetailData({
                        urlData: urlData,
                        postData: postData,
                        fromPage: 'DashBoardManagement'
                    });
                });
                break;
            default: // 返回'Main'界面
                this.setState({
                    activePage: activePage,
                }, function () {
                    if (SwitchingData === 'fromfull') { // 从全屏返回
                        this.handleBackFromFullToAnchor();
                    } else { // 从详情返回
                        this.handleBackFromDetailToAnchor();
                    }
                    // 从全屏和详情返回，刷新画布
                    actions.resizeEcharts();
                });
                break
        }
    }
    /**
    * 切换选中仪表盘
    * @param {object} activeDashboard 选中的仪表盘  
    * @param {object} mainData dashboard主页面数据
    */
    handleChangeActiveDashboard = (activeDashboard, mainData) => {
        this.setState({
            mainData: mainData,
        });
    }
    render() {
        let minheights = PageMethod.getInnerHeight1();
        let { activePage, isFirstIn, mainData, SwitchingData } = this.state;
        let { ...props } = this.props;
        return (
            <div ref='dashboardManageChildPage'
                className='roleManageChild-page'
                style={{ height: minheights }}>
                <ReactCSSTransitionGroup
                    transitionName='fullScreenAnimation'
                    transitionEnterTimeout={TransitionTime}
                    transitionLeaveTimeout={TransitionTime}
                >
                    {activePage === config.allActivePage[1] ?
                        <FullScreen
                            targetPage={config.allActivePage[0]}
                            SwitchingData={SwitchingData}
                            onChangeActivePage={this.handleChangeActivePage}
                        /> : null
                    }
                </ReactCSSTransitionGroup>
                {
                    activePage === config.allActivePage[2] ?
                        <DetailPage
                            key='DetailPage'
                            name='DashBoardManagement'
                            pageLimit={this.pageLimit}
                            styleOfDisplay={{ display: activePage === config.allActivePage[0] ? 'display' : 'none' }}
                            onChangeActivePage={this.handleChangeActivePage}
                        /> : null
                }
                <DashboardMain
                    ref='DashboardMain'
                    styleOfDisplay={{ display: activePage === config.allActivePage[0] ? 'block' : 'none' }}
                    activePage={activePage}
                    targetPage={config.allActivePage[1]}
                    isFirstIn={isFirstIn}
                    mainData={mainData}
                    SwitchingData={SwitchingData}
                    onChangeActivePage={this.handleChangeActivePage}
                    onChangeActiveDashboard={this.handleChangeActiveDashboard}
                    {...props}
                />
            </div >
        );
    }
}
export default DashboardManageChild;





