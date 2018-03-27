import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import sortDashboardListLikeLeftSide from '../../../../common/utils/sortDashboardListLikeLeftSide';
import deepClone from '../../../../common/utils/deepClone';
import Config from '../../../../common/Config';

import actions from '../../../../actions/actions';
import DashboardStore from '../../../../stores/DashboardStore';
import RelayoutStore from '../../../../stores/RelayoutStore';

import DashboardChartTitle from './DashboardChartTitle';
import ConditionShow from './ConditionShow';

import SwitchBtn from '../../../../component/SwitchButton/Button1';
import SelectGroup from '../../../../jComponent/select/SelectGroup';
import DrilledNavigation from './DrilledNavigation';
import IsShowCanvasModal from '../dashboardMain/isShowCanvasModal/IsShowCanvasModal';
import Loading from '../../../../component/Loading';

import EditModal from './EditModal';
import HintModal from './HintModal';
import DrillModal from '../../../../jComponent/modal/DrillModal';
import AddSliceUpModal from '../../../../jComponent/modal/AddSliceUpModal';
import ShowDashboardListModal from './showDashboardListModal/showDashboardListModal';

import ChartDetailHintModal from './ChartDetailHintModal';
import DirllHintModal from './DirllHintModal';

import DeleteModal from '../dashboardMain/DeleteModal';

const factory = (GraphicContent) => {
    class Graphic extends PureComponent {
        constructor(props) {
            super(props);
            let { dashId } = this.props;
            let showObj = localStorage.getItem(localStorage.getItem('email')) || false;//localstorage记录是否显示数值   
            let isNumberShow = showObj ? JSON.parse(showObj)[dashId] : false;
            this.isNumberShow = isNumberShow;
            this.state = {
                page: this.props.page || 1,
                active: true,
                slicersValue: this.props.slicersValue || null,
                isLoading: this.props.isLoading === 1 ? false : true, // 是否正在加载数据
                chartData: this.props.chartData,    // 数据
                condition: this.props.condition || [], // 过滤条件
                id: this.props.id, // 图表id
                name: this.props.name || '', // 图表名称
                type: this.props.type || 0, // 图表类型
                appId: this.props.app_Id, // 图表所属的应用id
                dsId: this.props.dsId, // 数据id
                sum: this.props.sum || '-', // 总计(图表类型才有)
                total: this.props.total || '-', // 总计(table类型才有)
                slicer: this.props.slicer || {}, // 切片器
                hasWrongDataSource: this.props.hasWrongDataSource || false, // 是否错误返回 默认为正确返回
            }
        }
        componentDidMount() {
            this.unsubscribe = DashboardStore.listen(this.pubsub, this);
            this.unsubscribe2 = RelayoutStore.listen(this.pubsub, this);
        }
        componentWillUnmount() {
            this.unsubscribe();
            this.unsubscribe2();
        }
        pubsub(type, data, from, method) {
            switch (type) {
                case 'getDashChartDataSuccess': {
                    if (from.fromPage === this.props.fromPage) {
                        if (from.id === this.state.id) {
                            let condition = data.condition;
                            let sum = '-';
                            let total = '-';
                            // hasData 0 正常 ，1 没有数据，2 数据量过大，需要添加约束条件
                            if (data.hasData === 0 || data.hasData === 3) {
                                if (data.sum) sum = data.sum;
                                if (data.total) total = data.total;
                            };
                            this.setState({
                                isLoading: false,
                                name: data.name,
                                chartData: data,
                                condition: condition,
                                slicer: data.slicer,
                                type: data.plot_type,
                                sum: sum,
                                total: total,
                            });
                        }
                    }
                    break;
                }
                case 'getDashChartDataFail': {
                    if (from.fromPage === this.props.fromPage) {
                        if (from.id === this.state.id) {
                            this.setState({
                                isLoading: false,
                                hasWrongDataSource: true,
                            })
                        }
                    }
                    break;
                }
                case 'editDashChartSuccess': {
                    // 编辑成功
                    if (data.fromPage === this.props.fromPage) {
                        if (data.id === this.state.id) {
                            let urlData = {
                                id: data.id,
                                page: 1
                            };
                            // 检验数据是否超过范围
                            actions.verifyDataLength(urlData, {}, 'editModal');
                        }
                    }
                    break;
                }
                case 'refreshDashChartDataSuccess': {
                    if (from.id === this.state.id) { // 获取已经选中的切片器值                 
                        let drill_values = this.state.chartData.drill_values;
                        let slicersValueRefresh = drill_values && drill_values.length > 0 ?
                            this.refs.SelectSlicerGroup.getCouldBeSelectData() :
                            this.refs.SelectSlicerGroup.getSlicerValue();
                        if (from.targetPage === this.props.targetPage) {
                            if (from.targetPage === 'Main') actions.syncSwitchslicer(slicersValueRefresh);
                        }
                        let sum = '-';
                        // hasData 0 正常 ，1 没有数据，2 数据量过大，需要添加约束条件
                        if (data.hasData === 0 || data.hasData === 3) {
                            if (data.sum) sum = data.sum;
                        };
                        this.setState({
                            chartData: data,
                            sum: sum,
                            slicersValue: slicersValueRefresh,
                            page: 1
                        }, function () {
                            // 提交切片器选项 table类型画布返回首页
                            if (this.state.type === 4) {
                                this.refs[`scrollWrap${this.state.id}`].setPage(1);
                            }
                        });
                    }
                    break;
                }
                case 'syncSwitchslicerSuccess': { // 同步来自全屏的切片器value
                    if (this.props.targetPage === 'fullScreen') {
                        this.setState({
                            slicersValue: data
                        });
                    }
                    break;
                }
                case 'syncTablesPageSuccess': { // 同步来自全屏的tables类型的页码
                    if (this.props.targetPage === 'fullScreen' && this.state.type === 4) {
                        this.refs[`scrollWrap${this.state.id}`].setPage(data);
                    }
                    break;
                }
                default:
                    break;
            }
        }
        /**
         * 清洗传入的仪表盘列表
         * 获取自己创建的列表（不包括当前仪表盘）
         * @param {arr} data 所有仪表盘 
         * @param {num} activeDashboardId 选中仪表盘Id 
         * @return {arr} 
         */
        cleanData = (data, activeDashboardId) => {
            if (!data.length) return [];
            let newData = sortDashboardListLikeLeftSide(data, Config.letters);
            let list = newData.filter(function (item) {
                if (item.beshared === 0 && item.id !== activeDashboardId) return item;
            });
            return list;
        }
        /**
         * 打开’编辑‘模态框
         */
        handleOpenEditModal = () => {
            let {
                appId,
                dsId,
                id,
                type
            } = this.state;
            this.refs.editModal.openModal(appId, dsId, id, type);
        }
        /**
        * 关闭‘编辑画布’模态框
        */
        handleCloseEditModal = () => {
            this.refs.editModal.hideModal('true');
        }
        /**
         * 编辑新画布数据超过2000条
         * 编辑添加画布模态框
         */
        handleBackToEditModal = (isVisible, id) => {
            this.refs.editModal.setModalIsVisible(isVisible);
        }
        /**
         * 编辑画布 刷新界面
         */
        handleEiitCanvas = (canvasId) => {
            this.handleRefresh();
        }
        /**
         * 打开'切片器配置'模态框
         */
        handleOpenSliceUpModal = () => {
            let {
                appId,
                dsId,
                id,
                slicer
            } = this.state;
            let copySlicer = deepClone(slicer);
            this.refs.AddSliceUpModal.open(appId, dsId, id, copySlicer);
        }
        /**
         * 编辑切片
         * 提交后刷新画布
         */
        handleCanvasRefresh = () => {
            this.handleRefresh();
        }
        /**
         * 编辑下钻
         * 提交后刷新画布
         * 在此处对比新、旧下钻列表
         * 判断是否回到画布第一层
         * @param {*} newDirll 返回下钻列表数据
         * @return {只要新列表的顺序在旧列表中发生改变就刷新}
         */
        handleDirllRefresh = (newDirll) => {
            let drill_condition = deepClone(this.state.chartData.drill.drill_condition);
            drill_condition.shift();
            if (drill_condition.length) {
                let flag = newDirll.every((item, i) => { // 只要一项不相等 则返回false跳出循环
                    if (drill_condition[i]) {
                        return item.col_name === drill_condition[i].col_name;
                    } else {
                        return true;
                    }
                });
                let isRefresh = flag && newDirll.length ? 'stayPut' : 'BackToTheTop';
                this.handleRefresh(isRefresh);
            } else { // 如果原本没有添加 下钻 不需要传递参数
                this.handleRefresh();
            }
        }
        /**
         * 当画布数据量过大
         * 提示用户到处画布为excel格式文件
         * @param {obj} urlData 
         * @param {obj} postData 
         */
        handleOpenHintModal = (urlData, postData) => {
            let content = '由于数量过大，该画布已被转为Excel表格，您是否继续导出画布？'
            this.refs.hintModal.openModal('导出画布', content, urlData, postData);
        }
        /**
         * 请求下载画布文件
         * excel格式
         * @param {obj} urlData 
         */
        handleCommitDownCancasInExcel = (urlData, postData) => {
            actions.getDashChartData2(urlData, postData, 'canvasOutHint');
        }
        /**
         * 复制到、移动到功能
         * 弹出仪表盘列表模态框
         * @param {number} type 1：复制 2：移动
         * @param {number} canvasId 
          */
        handleOpenDashboardListModal = (type, canvasId) => {
            this.refs.showDashboardListModal.open(type, canvasId);
        }
        /**
         * 关闭仪表盘列表模态框
         */
        handleCloseDashboardListModal() {
            this.refs.showDashboardListModal.close();
        }
        /**
         * 打开下钻模态框
         */
        handleOpenDrillModal = () => {
            let { appId, dsId, id, chartData } = this.state;
            let copyDrill = deepClone(chartData.drill.drill_condition);
            let copyDrillFirst = copyDrill.shift();
            this.refs.DrillModal.open(appId, dsId, id, copyDrill, copyDrillFirst);
        }
        /**
         * 打开'删除'模态框
         */
        handleOpenDelModal = () => {
            let { id, name } = this.state;
            let data = {
                id: id,
                name: name
            };
            let delData = [];
            delData.push(data);
            let content = this.deleteHint(delData);
            this.refs.deleteModal.openModal('删除画布', content, delData);
        }
        /**
         * 设置删除时的提示消息
         * @param {*} data 
         */
        deleteHint = (data) => {
            let name = '您确定要删除吗？';
            if (data.length === 1) {
                name = '删除“' + data[0].name + '”画布后，此画布将不会再出现在仪表盘中，您确定要删除吗？';
            }
            if (data.length > 1) {
                name = '删除“' + data[0].name + '”等' + data.length + '个画布后，画布将不会再出现在仪表盘中，您确定要删除吗？';
            }
            return name;
        }
        /**
         * 请求删除该画布
         * @param {*} data 
         */
        handleCommitDelModal = (data) => {
            let ids = [];
            for (let i = 0, j = data.length; i < j; i++) {
                ids.push(data[i].id);
            }
            actions.delDashChart({ ids: ids.join(',') }, data, this.props.fromPage);
        }
        /**
         * 双击画布
         * 多个分组方式
         * @param {*} filterValue 
         * @param {*} title 
         * @param {*} list 
         * @param {*} dealType 
         */
        handleOpenDetailHintModal = (filterValue, title, list, dealType) => {
            this.refs.detailHintModal.openModal(filterValue, title, list, dealType);
        }
        /**
         * 打开详情页
         * 回调函数、在此获取参数
         */
        hadnleOpenDetailPage = (postData) => {
            let { condition, slicer, id, chartData, slicersValue } = this.state;
            if (!postData.condition || !postData.condition.length > 0) {
                postData.condition = condition;
            }
            if (!postData.filter_key) {
                postData.filter_key = chartData.filter_key;
            }
            postData.id = id;
            postData.drill_values = chartData.drill_values;

            let data = deepClone(slicer.condition);
            let slicerCondition = [];
            if (this.refs.SelectSlicerGroup) {
                let slicerValues = this.refs.SelectSlicerGroup.getSlicerValue();
                data.forEach(function (item, i) {
                    item.cond = "equal";
                    item.value = slicerValues[item.col_name];
                    if (!(item.value.length === 1 && item.value[0] === '所有')) slicerCondition.push(item);
                });
            }
            postData.slicerCondition = slicerCondition;
            if (this.props.onChangeActivePage) this.props.onChangeActivePage('Detail', postData);
        }
        /**
         * 单击画布
         * 单击请求路径
         * 钻取画布、请求API
         * @param {str} drill_values 请求参数
         */
        handleChartClick = (drill_values) => {
            let data = deepClone(this.state.slicer.condition);
            let conditions = [];
            let slicerValues = deepClone(this.state.slicersValue);
            if (slicerValues) {
                data.forEach(function (item, i) {
                    item.cond = "equal";
                    item.value = slicerValues[item.col_name];
                    if (!(item.value.length === 1 && item.value[0] === '所有')) conditions.push(item);
                });
            };
            let urlData = {
                id: this.state.id,
                page: 1
            };
            let postData = {
                condition: conditions.length > 0 ? conditions : {}, // 编辑页面保存切片器数据
                drill_values: drill_values,
            };
            this.setState({
                isLoading: true
            }, () => {
                actions.getDashChartData(urlData, postData, this.props.fromPage);
            })
        }
        /**
         * 单击画布
         * 单击类型为环形图其它类型
         * 弹出下钻提示框
         * @param {*} filterValue 
         * @param {*} title 
         * @param {*} list 
         * @param {*} drillValues 下钻请求路径 请求参数
         */
        handleOpenDirllHintModal = (filterValue, title, list, drillValues) => {
            this.refs.dirllHintModal.openModal(filterValue, title, list, drillValues);
        }
        /**
         * 是否显示图标数据
         */
        handleShowNumber = () => {
            let { dashId } = this.props;
            let isNumberShow = this.isNumberShow;
            this.isNumberShow = !isNumberShow;
            let isShowGroup = localStorage.getItem(localStorage.getItem('email'))
            let groups = isShowGroup ? JSON.parse(isShowGroup) : {};
            groups[dashId] = this.isNumberShow;
            localStorage.setItem(localStorage.getItem('email'), JSON.stringify(groups));
            this.refs[`scrollWrap${this.state.id}`].setShowNumber(this.isNumberShow);
        }
        /**
         * 翻页
         * @param {number} index 
         */
        handleChagePage = (index) => {
            if (!this.state.active || this.state.isLoading) return null;
            let data = deepClone(this.state.slicer.condition);
            let conditions = [];
            if (this.refs.SelectSlicerGroup) {
                let slicerValues = this.refs.SelectSlicerGroup.getSlicerValue();
                data.forEach(function (item, i) {
                    item.cond = "equal";
                    item.value = slicerValues[item.col_name].join(',');
                    if (item.value !== '所有') conditions.push(item);
                });
            }
            let urlData = {
                id: this.state.id,
                page: index
            };
            let postData = {
                condition: conditions.length > 0 ? conditions : {} // 编辑页面保存切片器数据
            }
            this.setState({
                page: index,
                isLoading: true
            }, function () {
                if (this.props.targetPage === 'Main' && this.state.type === 4) actions.syncTablesPage(this.state.page);
                actions.getDashChartData(urlData, postData, this.props.fromPage);
            });
        }
        /**
         * 画布数据更新、刷新画布
         * @param {str} from 操作类型
         * @type {from:CompletelyRefresh} 完全刷新页面 不保留切片器条件和钻取条件
         * @type {from:stayPut} 停在当前图层 保留切片器条件和钻取条件
         * @type {default} 其他情况 仅仅保留切片器条件
         */
        handleRefresh = (from) => {
            let data = deepClone(this.state.slicer.condition);
            let conditions = [];
            if (from !== 'CompletelyRefresh' && from !== 'CompletelyRefreshAndSync' && this.refs.SelectSlicerGroup) {
                let slicerValues = null;
                if (from && from.name && from.changedKey.length > 0) {
                    slicerValues = this.refs.SelectSlicerGroup.getSlicerValue(from);
                } else {
                    slicerValues = this.refs.SelectSlicerGroup.getSlicerValue();
                }
                data.forEach(function (item, i) {
                    item.cond = "equal";
                    item.value = slicerValues[item.col_name] ? slicerValues[item.col_name] : ['所有'];
                    if (!(item.value.length === 1 && item.value[0] === '所有')) conditions.push(item);
                });
            }
            let urlData = {
                id: this.state.id,
                page: 1,
            };
            let postData = {
                condition: conditions.length > 0 ? conditions : {} // 编辑页面保存切片器数据
            }
            if (from === 'stayPut') { // 编辑下钻 返回'stayPut' 则添加drill_values参数
                let drill_values = this.state.chartData.drill_values;
                postData.drill_values = drill_values || []; // 不是表格添加drill_values请求参数
            }
            let slicersValue = deepClone(this.state.slicersValue);
            if (from && from.name && from.changedKey.length > 0 && slicersValue) {
                from.changedKey.forEach((item) => {
                    delete slicersValue[item];
                });
            }
            this.setState({
                isLoading: true,
                slicersValue: from !== 'CompletelyRefresh' && from !== 'CompletelyRefreshAndSync' ? slicersValue : null,
                page: 1
            }, function () {
                if (from === 'CompletelyRefreshAndSync') actions.syncSwitchslicer(null);
                actions.getDashChartData(urlData, postData, this.props.fromPage);
                // 刷新、编辑成功 table类型画布返回首页
                if (this.state.type === 4) {
                    this.refs[`scrollWrap${this.state.id}`].setPage(1);
                }
            });
        }
        render() {
            // console.log(this.props, 'props5');
            // console.log(this.state, 'state5');
            let {
                index,
                className,
                fromPage,
                dashboardList,
                activeDashboard,
                appId,
                useFrom,
                ...others
            } = this.props;

            let {
                page,
                isLoading,
                type,
                active,
                slicer,
                chartData,
                slicersValue, // 切片器选中的数据
            } = this.state;

            let {
                drill_values = [],
                drill = {},
                drill: { drill_condition = [] }
            } = chartData && chartData.plot_type !== 4 ? chartData : { drill_values: [], drill: {} };

            let drill_valuesArr = drill_values;
            let navDeep = drill_values ? drill_valuesArr.length : 0;
            let drillCond = deepClone(drill_condition);
            let drillCondDeep = drill_condition.length;

            for (let i = 0; i < navDeep; ++i) {
                let col_desc = ''.concat(drillCond[i].col_desc);
                drillCond[i].col_desc = `${col_desc}（${drill_valuesArr[i]}）`;
            };

            const classes = classnames(
                className,
                'dash-graphPage',
            );
            const switchBtnClass = classnames(
                'showNumber-wrap',
                {
                    'display-none': type === 4
                }
            );
            let loading = null;
            if (isLoading) {
                loading = (
                    <div className='loading-wrap'>
                        <Loading />
                    </div>
                );
            }

            const list = this.cleanData(dashboardList, activeDashboard.id);
            let hasShowDashboardList = list.length > 0 ? true : false;
            let ShowDashboardListModalStyleName = classnames(
                'showDashboardListModal-chart-modal',
                { 'noData': !hasShowDashboardList }
            );

            // 数据钻取导航开关
            const drillNavToogle = drill_values.length > 0 && navDeep !== 0;

            let origindrill = null,
                origindrillArr = null,
                numberOfNewGroup = 0;
            if (chartData && chartData.dimension) {
                let istables = type === 4 ? true : false; // 是否为tables类型画布
                if (chartData.dimension.group) {
                    origindrill = !istables ? chartData.dimension.group[0] : null;
                    origindrillArr = !istables !== 4 ? chartData.dimension.group : null;
                    numberOfNewGroup = !istables !== 4 ? chartData.dimension.group.length : 0;
                } else if (chartData.dimension.newGroup) {
                    origindrill = !istables !== 4 ? chartData.dimension.newGroup[0] : null;
                    origindrillArr = !istables !== 4 ? chartData.dimension.newGroup : null;
                    numberOfNewGroup = !istables !== 4 ? chartData.dimension.newGroup.length : 0;
                }
            }
            return (
                <div
                    className={classes}
                    style={{ display: active ? 'block' : 'none' }}>
                    {
                        index !== 0 ?
                            <div
                                ref={(mainAnchor) => { this.mainAnchor = mainAnchor }}
                                style={{ position: 'absolute', top: -160 }}
                            ></div> : null
                    }
                    <div className='content-wrap'>
                        <DashboardChartTitle
                            ref={`DashboardChartTitle${this.state.id}`}
                            key={`DashboardChartTitle${this.state.id}`}
                            hasWrongDataSource={this.state.hasWrongDataSource}
                            name={this.state.name}
                            page={this.state.page}
                            canItBeEditedAndSliceUp={!drillNavToogle}
                            chartType={this.state.type}
                            onRefresh={this.handleRefresh}
                            onEdit={this.handleOpenEditModal}
                            onSliceUp={this.handleOpenSliceUpModal}
                            onHint={this.handleOpenHintModal}
                            onCopyTo={this.handleOpenDashboardListModal}
                            onMoveTo={this.handleOpenDashboardListModal}
                            onDrill={this.handleOpenDrillModal}
                            onDel={this.handleOpenDelModal}
                            fromPage={this.props.fromPage}
                            fullScreen={this.props.fullScreen}
                            id={this.state.id}
                            dashboardList={dashboardList}
                            chartData={chartData}
                            slicer={slicer}
                            drillValues={drill_values}
                            slicersValue={slicersValue}
                            activeDashboard={this.props.activeDashboard}
                            getCanvasDatasNew={this.getCanvasDatasNew}
                            onOpenFullScreen={this.handleOpenFullScreen}
                            {...others}
                        />
                        {
                            type === 4 ? null :
                                <ConditionShow
                                    className='GraphicComponent'
                                    impotBy={'DsbChart'}
                                    sum={this.state.sum}
                                />
                        }
                        {
                            type === 4 ? null :
                                <div className={switchBtnClass}>
                                    <SwitchBtn open={this.isNumberShow} onChange={this.handleShowNumber} />
                                    <div className='titleName'>数据显示</div>
                                </div>
                        }
                        {
                            !drillNavToogle ? null :
                                <DrilledNavigation
                                    drillValues={drill_values}
                                    navs={drillCond}
                                    navDeep={navDeep}
                                    onChartClick={this.handleChartClick}
                                />
                        }
                        {this.state.slicer && this.state.slicer.condition && this.state.slicer.condition.length > 0 ?
                            <SelectGroup
                                ref='SelectSlicerGroup'
                                className='float-left'
                                useFrom={useFrom}
                                page={this.page}
                                data={slicer.condition}
                                defaultCondtion={slicersValue}
                                drillValues={drill_values}
                                id={this.state.id}
                                appId={this.state.appId}
                                dsId={this.state.dsId}
                                refreshCavans={this.refreshCavans}
                                {...others}
                            /> : null
                        }
                        <div className='chart-wrap'
                            style={{ width: '100%', height: '466px' }}>
                            <GraphicContent
                                ref={`scrollWrap${this.state.id}`}
                                useFrom={useFrom}
                                page={page}
                                pageHandler={this.handleChagePage}
                                onOpenDetailPage={this.hadnleOpenDetailPage}
                                data={chartData}
                                type={this.state.type}
                                drillValues={drill_values}
                                drillCondDeep={drillCondDeep}
                                navDeep={navDeep}
                                onChartDbClick={this.onChartDbClick}
                                onChartClick={this.handleChartClick}
                                showDetailHintModal={this.handleOpenDetailHintModal}
                                showDirllHintModal={this.handleOpenDirllHintModal}
                                showNumber={this.isNumberShow}
                                fromPage={this.props.fromPage}
                                domWidth={this.props.domWidth}
                            />
                        </div>
                    </div>
                    {loading}
                    <EditModal
                        ref='editModal'
                        id={this.state.id}
                        fromPage={fromPage}
                        dashboardId={activeDashboard.id}
                        chartData={chartData}
                        from={appId}
                    />
                    <AddSliceUpModal
                        ref='AddSliceUpModal'
                        className='AddSliceUpModal'
                        titleName='切片器'
                        canvasId={this.state.id}
                        defaultSlicer={slicer.condition}
                        onRefresh={this.handleRefresh}
                    />
                    <HintModal
                        ref='hintModal'
                        onCommit={this.handleCommitDownCancasInExcel}
                    />
                    <ShowDashboardListModal
                        ref='showDashboardListModal'
                        titleName='请选择目标仪表盘'
                        data={list}
                        styleName={ShowDashboardListModalStyleName}
                        hasData={hasShowDashboardList}
                    />
                    <DeleteModal
                        ref='deleteModal'
                        fromPage={fromPage}
                        onDel={this.handleCommitDelModal}
                    />
                    <DrillModal
                        ref='DrillModal'
                        className='DrillModal'
                        titleName='下钻'
                        id={this.state.id}
                        origindrill={origindrill}
                        origindrillArr={origindrillArr}
                        numberOfNewGroup={numberOfNewGroup}
                        onRefresh={this.handleDirllRefresh}
                    />
                    <ChartDetailHintModal
                        ref='detailHintModal'
                        onCommit={this.hadnleOpenDetailPage}
                    />
                    <DirllHintModal
                        ref='dirllHintModal'
                        onCommit={this.handleChartClick}
                    />
                    <IsShowCanvasModal
                        ref={instance => this.IsShowEditCanvasModalInstance = instance}
                        id={this.state.id}
                        activeDashboard={this.props.activeDashboard}
                        chartData={chartData}
                        backToAddModal={this.handleBackToEditModal}
                        handleCloseModal={this.handleCloseEditModal}
                        handleAddCanvas={this.handleEiitCanvas}
                        key='IsShowEditCanvasModalDsbPage1'
                        className='IsShowCanvasModal'
                        fromPage={name}
                        isDelCallBack={true}
                        methodFrom={'edit'}>
                        <h4 className='IsShowCanvasModalHint'>当前画布仅支持显示2000条数据，是否继续显示？</h4>
                    </IsShowCanvasModal>
                </div>
            );
        }
    }
    return Graphic;
}

export { factory as graphPageFactory };