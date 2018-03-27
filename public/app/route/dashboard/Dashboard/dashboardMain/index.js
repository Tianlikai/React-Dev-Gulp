import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import updateHeight from '../../../../common/utils/updateHeight';
import deepClone from '../../../../common/utils/deepClone';
import SystemValue from '../../../../data/SystemValue';
import PageMethod from '../../../../common/PageMethod';
import Config from '../../../../common/Config';

import actions from '../../../../actions/actions';
import DashboardManageStore from '../../../../stores/DashboardManageStore';
import UtilStore from '../../../../stores/UtilStore';

import PopInfo from '../../../../component/PopInfo';
import InputGroup from '../../../../component/InputGroup';

import DashboardGroupSide from './dashboardLeft/DashboardGroupSide';
import DashboardList from './dashboardRight/DashboardList';
import DashboardModal from './DashboardModal';
import DeleteModal from './DeleteModal';
import ShareModal from './ShareModal';

class DashboardMain extends PureComponent {
    static propTypes = {
        self: PropTypes.object, // 顶层对象
        data: PropTypes.object, // 所有数据
        name: PropTypes.string, // 'DashBoardManagement'
        app: PropTypes.object, // 应用数据
        isActive: PropTypes.bool, // tabs是否激活
        isFirstIn: PropTypes.bool, // 是否首次进入
        targetPage: PropTypes.string, // 跳转目标全屏
        onChangeActivePage: PropTypes.func, // 切换tabs
        onChangeActiveDashboard: PropTypes.func, // 切换选中仪表盘
    }
    constructor(props) {
        super(props);
        this.timer = null;
        this.chageActDelayDSTimer = null; // 更换选中仪表盘 设置延迟时间
        let {
            cavasData,
            cavasData: { isSearchDispatch },
            dashboardToggle,
        } = this.props.mainData;
        this.state = {
            activeDashboard: null, // 当前选中的仪表盘
            dashboardList: [], // 仪表盘列表
            isAdmin: PageMethod.isAdminUser(), // 是否是管理员
            isSearchDispatch: isSearchDispatch, // 是否为搜索触发事件、搜索结果为空时，界面为空
            dashboardToggle: dashboardToggle, // 仪表盘列表，默认打开 打开为false、关闭为true
            fullScreenData: null,
            isShow: true,
            isNumberShow: localStorage.getItem(localStorage.getItem('email')) || false, //localstorage记录是否显示数值
        };
    }
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.unsubscribe = UtilStore.listen(this.pubsub, this);
        this.unsubscribe1 = DashboardManageStore.listen(this.pubsub, this);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        this.unsubscribe();
        this.unsubscribe1();
        clearTimeout(this.timer);
        this.timer = null;
        this.chageActDelayDSTimer = null;
    }
    pubsub(type, data, from, from2) {
        let oData = {};
        switch (type) {
            // 高度变化：更新界面
            case 'updateHeight':
                updateHeight(this.refs.dashboardManageChildPage, PageMethod.getInnerHeight1());
                updateHeight(this.refs.dashboardContentWrap, PageMethod.getInnerHeight2());
                let minheights2 = PageMethod.getInnerHeight2();
                let wid = document.body.clientWidth;
                if (!wid) wid = document.documentElement.clientWidth;
                let top = document.body.scrollTop;
                if (!top) top = document.documentElement.scrollTop;
                let dashboardBox = this.refs.dashboardContentWrap;
                if (!dashboardBox) return null;
                let dashboardBoxLeft = dashboardBox.firstChild;
                let dashboardBoxRight = dashboardBox.firstChild.nextSibling;
                let styleDashboardGroupSide = `height:${minheights2}px;`;
                if (top >= 100) {
                    styleDashboardGroupSide = `position:fixed;top:60px;height:${minheights2 + 99}px; width: ${dashboardBox.clientWidth * 0.1666666667}px;`;
                    if (wid <= 768) {
                        dashboardBoxLeft.setAttribute('style', `position:inherit`);
                        dashboardBoxRight.setAttribute('style', `position:inherit`);
                    }
                }
                dashboardBoxLeft.setAttribute('style', styleDashboardGroupSide)
                break;
            // 添加、编辑 仪表盘
            case 'addDashboardSuccess':
            case 'editDashboardSuccess':
                let activeDashboard = this.props.mainData.activeDashboard;
                let fromData = null;
                if (activeDashboard && activeDashboard.id) fromData = activeDashboard.id;
                if (type === 'addDashboardSuccess') {
                    this.refs.nameFilter.reset();
                }
                actions.getDashboardList(fromData, {}, 'addDashboard');
                break;
            // 删除仪表盘
            case 'delDashboardSuccess':
                actions.getDashboardList(null, oData);
                break;
            // 获取分享列表成功
            // 此时打开分享模态框
            case 'getDashboardShareUserSuccess':
                this.refs.shareModal.openModal(from.id, data);
                break;
            // 分享失败
            case 'shareChartFail':
                if (from.fromPage === this.props.name) PopInfo.showinfo(data.errmsg, 'danger');
                break;
            default:
                break;
        }
    }
    /**
     * 渲染页面头部
     * @param {str} name 获取SystemValue.menutip的标识
     * @param {bool} dashboardToggle  仪表盘列表是否打开
     * @param {object} activeDashboard 选中的仪表盘
     */
    renderTitleDiv(name, dashboardToggle, activeDashboard) {
        let title = dashboardToggle ? '关闭仪表盘列表' : '打开仪表盘列表';
        let placeholder = activeDashboard && activeDashboard.name ?
            `搜索 ${activeDashboard.name}中的画布...` : `搜索`;
        let titleDiv = (
            <div
                ref='titleDiv'
                className='titleDiv'>
                <h2>
                    <img src='./dist/images/Dashboard.png' />
                    {SystemValue.menutip[name]}
                </h2>
                <img className='titleDivimg'
                    src="./dist/images/dbToggle.png"
                    title={title}
                    onClick={this.handleDashboardToggle}
                />
                <InputGroup
                    ref='nameFilter'
                    placeholder={placeholder}
                    handleEnterKeyEvent={this.handleSearch}
                />
            </div>
        );
        return titleDiv;
    }
    /**
     * 内容区域：左侧仪表盘列表，右侧画布列表
     * @param {obj} app 应用数据
     * @param {str} name 获取SystemValue.menutip的标识
     * @param {bool} isFirstIn 是否为第一次进入
     * @param {bool} isSearchDispatch 是否有搜索画布功能发起 默认不是
     * @param {bool} dashboardToggle 仪表盘列表是否打开
     * @param {obj} activeDashboard 选中的仪表盘
     * @param {arr} dashboardList 仪表盘列表
     * @param {arr} groups 仪表盘列表分组
     * @param {arr} targetPage 页面类型
     */
    renderContentWrap(app, name, isFirstIn, isSearchDispatch, dashboardToggle, activeDashboard, dashboardList, groups, targetPage) {
        let minheights2 = PageMethod.getInnerHeight2();
        let dbSideClassname = `col-md-2 col-sm-2 ${dashboardToggle ? 'role-wrap' : 'disable'}`;
        let canvasListClassname = `${dashboardToggle ? 'col-md-10 col-sm-10' : 'col-md-12 col-sm-12 full'} member-wrap`;
        let DashboardPageRef = activeDashboard && activeDashboard.id ?
            `dashboardPage${activeDashboard.id}` :
            `dashboardPage`;
        let propsSide = { activeDashboard, dashboardList, isSearchDispatch, groups, isFirstIn };
        let propsList = { activeDashboard, dashboardList, isSearchDispatch, name, targetPage };

        let content = (
            <div ref='dashboardContentWrap' style={{ height: minheights2 }} className='content-wrap'>
                <DashboardGroupSide
                    {...propsSide}
                    ref='dashboardGroupSide'
                    className={dbSideClassname}
                    isAdmin={this.state.isAdmin}
                    onEdit={this.handleOpenDashboardModal}
                    onDel={this.handleOpenDelModal}
                    onShare={this.handleOpenShareModal}
                    onChange={this.handleDashboardSelect}
                />
                <div
                    ref='dashboardPage1Wrap'
                    className={canvasListClassname}>
                    <DashboardList
                        {...propsList}
                        key='canvasList'
                        ref={DashboardPageRef}
                        appId={app.id}
                        isNumberShow={this.state.isNumberShow}
                        onChangeActivePage={this.props.onChangeActivePage}
                    />
                </div>
            </div>
        );
        return content;
    }
    // 处理滚动
    handleScroll = () => {
        let { activeDashboard } = this.props.mainData;
        let wid = document.body.clientWidth;
        if (!wid) wid = document.documentElement.clientWidth;

        let top = document.body.scrollTop;
        if (!top) top = document.documentElement.scrollTop;

        let height = document.body.clientHeight;
        if (!height) height = document.documentElement.clientHeight;

        let dashboardBox = this.refs.dashboardContentWrap;
        let dashboardBoxTitle = this.refs.titleDiv;

        if (!dashboardBox) return null; // 为空时 以下代码无效

        let dashboardBoxLeft = dashboardBox.firstChild;
        let dashboardBoxRight = this.refs.dashboardPage1Wrap;
        let ScrollTop = this.refs.dashboradScroolTop; // 滚动条

        let minheights2 = PageMethod.getInnerHeight2();

        let styleDashboardContentWrap,
            styleDashboardGroupSide,
            styleDashboardGroupSideFixed,
            styleDashboardPage1Wrap,
            classNameScroolTopScroolTop,
            styleFixedSearch;

        if (top >= 100) {
            dashboardBoxTitle.setAttribute('class', 'titleDiv fixed');

            styleDashboardContentWrap = `margin-top:60px;border-top:none;height:${minheights2 + 100}px;`;
            styleDashboardGroupSide = `position:fixed;top:60px;height:${minheights2 + 99}px; width: ${dashboardBox.clientWidth * 0.1666666667}px;`;
            styleDashboardGroupSideFixed = `position:fixed;top:60px;height:${minheights2 + 99}px; width: ${dashboardBox.clientWidth * 0.1666666667}px;`;
            styleDashboardPage1Wrap = `float: right;`;
            classNameScroolTopScroolTop = 'dashboradScroolTop';
            styleFixedSearch = 'position:fixed;top:0px;width:100%;background:white;z-index:12;border-bottom:1px solid #ddd;';
        } else {
            dashboardBoxTitle.setAttribute('class', 'titleDiv');

            styleDashboardContentWrap = `margin-top:0px;height:${minheights2}px;`;
            styleDashboardGroupSide = `height:${minheights2 + top}px;`;
            styleDashboardGroupSideFixed = 'display:none';

            styleDashboardPage1Wrap = `position:inherit`;
            classNameScroolTopScroolTop = 'dashboradScroolTopDisable';
            styleFixedSearch = 'display:none';
        }

        dashboardBox.setAttribute('style', styleDashboardContentWrap);

        if (wid <= 768) {
            dashboardBoxLeft.setAttribute('style', `position:inherit`);
            dashboardBoxRight.setAttribute('style', `position:inherit`);
        } else {
            dashboardBoxLeft.setAttribute('style', styleDashboardGroupSide);
            dashboardBoxRight.setAttribute('style', styleDashboardPage1Wrap);
        }

        ScrollTop.setAttribute('class', classNameScroolTopScroolTop);
        let dashboardPage = activeDashboard && activeDashboard.id ?
            this.refs[`dashboardPage${activeDashboard.id}`] : null;
        if (dashboardPage) dashboardPage.scrollMonitorListener(top, height);
    }
    // 仪表盘开关
    handleDashboardToggle = () => {
        this.setState({
            dashboardToggle: !this.state.dashboardToggle
        }, function () {
            localStorage.setItem('dashboardToggle', this.state.dashboardToggle);
            actions.resizeCanvas();
        })
    }
    // 返回顶部
    handleScrollToTop = () => {
        if (document.body.scrollTop) document.body.scrollTop = 0;
        if (document.documentElement.scrollTop) document.documentElement.scrollTop = 0;
    }
    // 打开
    // 添加模态框
    // 编辑模态框
    // 模态框模态框
    handleOpenDashboardModal = (isAdd, data) => {
        this.refs.dashboardModal.openModal(isAdd, data);
    }
    // 打开
    // 删除仪表盘模态框
    handleOpenDelModal = (item, res) => {
        let delData = [];
        delData.push(item);
        let content = this.deleteHint(delData);
        this.refs.delRoleModal.openModal('删除仪表盘', content, delData, res);
    }
    // 设置
    // 删除时的提示消息
    deleteHint(data) {
        let name = '您确定要删除吗？';
        if (data.length === 1) {
            name = '确定要删除仪表盘“' + data[0].name + '”吗？';
        }
        if (data.length > 1) {
            name = '确定要删除“' + data[0].name + '”等' + data.length + '个仪表盘吗？';
        }
        return name;
    }
    // 删除
    // 仪表盘
    handleCommitDelModal = (data) => {
        let ids = [];
        for (let i = 0, j = data.length; i < j; i++) {
            ids.push(data[i].id);
        }
        actions.delDashboard({ ids: ids.join(',') });
    }
    // 打开分享模态框
    handleOpenShareModal = (id) => {
        actions.getDashboardShareUser({ id: id }, { id: id, fromPage: this.props.name });
    }
    // 确认分享
    // 分享图表模态框的回调函数
    handleCommitShare = (data, ids) => {
        actions.shareChart(data, { id: data.id, fromPage: this.props.name, shared: ids.length });
    }
    /**
     * 搜索仪表盘
     * @param {str} value searchKey
     */
    handleSearch = (value) => {
        this.refs.nameFilter.setValue(value);
        let canvasList = [];
        let { activeDashboard } = this.props.mainData;
        if (activeDashboard && activeDashboard.id && this.refs[`dashboardPage${activeDashboard.id}`]) {
            canvasList = this.refs[`dashboardPage${activeDashboard.id}`].getCanvasList();
        }
        if (canvasList.length <= 0) return null;
        let newList = [];
        canvasList.forEach(function (ele, index) {
            if (ele.name.toLowerCase().indexOf(value.toLowerCase()) > -1) newList.push(ele);
        }, this);
        let oData = {};
        if (value !== '') {
            oData.name = value;
        }
        if (this.timer == null) {
            this.timer = setTimeout(() => {
                this.refs[`dashboardPage${activeDashboard.id}`].setCanvasList(newList);
            }, 700);
        } else {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.refs[`dashboardPage${activeDashboard.id}`].setCanvasList(newList);
            }, 700);
        }
    }
    /**
     * 选中仪表盘、请求数据
     * @param {obj} active 选中的仪表盘
     */
    handleDashboardSelect = (active) => {
        if (active) {
            let oldData = deepClone(this.props.mainData);
            oldData.activeDashboard = active;
            if (this.props.onChangeActiveDashboard) {
                this.props.onChangeActiveDashboard(active, oldData);
                let data = {
                    dashboard_id: active.id
                };
                let formShareUserName = active.beshared === 1 && active.beshared_name ? active.beshared_name : '';
                actions.getDashList(this.props.name, data, formShareUserName);
                this.handleScrollToTop();
                if (this.refs.nameFilter) this.refs.nameFilter.setValue('');
            }
        }
    }
    render() {
        // console.log(this.props, 'props3');
        if (!this.props.isActive || this.props.isFirstIn) return null;
        let {
            dashboardToggle, // 仪表盘列表是否打开
            isSearchDispatch // 是否由搜索画布触发
        } = this.state;
        let {
            app, // 应用数据
            name, // fromPage标识、获取SystemValue.menutip的标识            
            mainData, // 所有data
            mainData: {
                activeDashboard, // 选中的仪表盘
                mainSideData, // 仪表盘列表数据
                mainSideData: {
                        dashboardList, // 仪表盘列表
                    groups // 仪表盘字母
                },
                cavasData // 画布数据
            },
            isFirstIn,
            styleOfDisplay, // 页面是否显示
            targetPage, // 跳转到全屏界面标识
        } = this.props;

        // 动态获取页面高度
        let minheights = PageMethod.getInnerHeight1();
        // 渲染tabs头部
        let titleDiv = this.renderTitleDiv(name, dashboardToggle, activeDashboard);
        // 渲染左侧、右侧界面
        let contentWrap = this.renderContentWrap(app, name, isFirstIn, isSearchDispatch, dashboardToggle, activeDashboard, dashboardList, groups, targetPage);
        let scrollToTop = (
            <img
                ref='dashboradScroolTop'
                className='dashboradScroolTopDisable'
                src='./dist/images/scrollToTop.png'
                title='返回顶部'
                onClick={this.handleScrollToTop}></img>
        );
        return (
            <div
                style={styleOfDisplay}>
                {titleDiv}
                {contentWrap}
                {/* {fixedSearchInput} */}
                {scrollToTop}
                <DashboardModal ref='dashboardModal' />
                <DeleteModal ref='delRoleModal'
                    onDel={this.handleCommitDelModal} />
                {/*暂时取消权限 对用户分享功能的限制  */}
                <ShareModal
                    ref='shareModal'
                    titleName='分享仪表盘'
                    fromPage={name}
                    onShareChart={this.handleCommitShare} />
            </div>
        );
    }
}
export default DashboardMain;





