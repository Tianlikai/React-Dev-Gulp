/*
Dashboard: 编辑-图表类型为：折线图，柱状图，条形图
*/
import React, { PureComponent } from 'react';
import classnames from 'classnames';
const RModal = require('react-modal-bootstrap');

import getNameById from '../../../../common/utils/getNameById';
import removePopinfo from '../../../../common/utils/removePopinfo';
import removeModalOpenClass from '../../../../common/utils/removeModalOpenClass';
import validationIputStrType1 from '../../../../common/utils/validationIputStrType1';
import onInputChangeValidate2 from '../../../../common/utils/onInputChangeValidate2';

import deepClone from '../../../../common/utils/deepClone';
import actions from '../../../../actions/actions';
import PageMethod from '../../../../common/PageMethod';
import Config from '../../../../common/Config';
import Lang from '../../../../data/lang';
import FormValidateData from '../../../../data/FormValidateData';

import PopInfo from '../../../../component/PopInfo';
import Button from '../../../../component/form/Button';
import InputWithErrMsg from '../../../../component/InputWithErrMsg';

import { MeasurePattern, GroupPattern } from './MeasureGroup';
import ChartTypeSelect from './ChartTypeSelect';
import Filter from './Filter';
import ChartTypeTable from '../ChartTypeTable';
import DashboardStore from '../../../../stores/DashboardStore';

class EditModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = this.setDefaultState();
        this.changeActivePage = this.changeActivePage.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleCommit = this.handleCommit.bind(this);
    }
    setDefaultState() {
        return {
            isModalOpen: false,
            id: '', // 图表id
            appId: 0, // 选择的应用-id
            dsId: 0,
            cols: [],
            defaultType: '', // 打开编辑模态框的时候，画布的类型
            defaultCondition: [], // 打开编辑模态框的时候，画布的约束条件
            activePage: 1, // 当前在第几页
            dashboardId: this.props.dashboardId,
            isVisible: true
        };
    }
    componentDidMount() {
        this.unsubscribe = DashboardStore.listen(this.pubsub, this);
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    pubsub(type, data, from) {
        if (type === 'getDashChartDetailSuccess' && this.props.id === this.state.id) {
            let strbody = JSON.parse(data.strbody);
            this.setState({
                defaultCondition: this.addActiveToCond(strbody.condition || [])
            });
        } else if (type === 'editDashChartFail' && this.props.id === this.state.id) {
            if (from.fromPage === this.props.fromPage) {
                if (data.errcode === 162001) {
                    this.refs.editWrap.refs.chartName.setHint(data.errmsg);
                    if (this.state.activePage === 2) {
                        this.setState({
                            activePage: 1
                        });
                    }
                } else {
                    this.hideModal();
                    PopInfo.showinfo(data.errmsg, 'danger');
                }
            }
        } else if (type === 'getDashChartColsSuccess') {
            let cols = PageMethod.convertSelectData(data.cols);
            this.setState({
                cols: cols
            });
        } else if (type === 'getDashChartColsFail') {
            PopInfo.showinfo(data.errmsg, 'danger');
            this.hideModal();
        }
    }
    /**
     * 关闭模态框
     * @param {*} type 如果为'true'，代表为外部操作关闭模态框
     */
    hideModal(type) {
        let id = this.state.id;
        if (type !== 'true' && this.state.defaultType !== 4) {
            let chartData = this.props.chartData;
            let { app_id, ds_id, id, name, plot_type, condition, dimension } = chartData;
            let fromData = {
                app_id,
                ds_id,
                id,
                name,
                dashboard_id: this.props.dashboardId,
                type: plot_type
            };
            let postData = {
                dimension,
                condition
            };
            actions.editDashChart(fromData, postData, 'nocallBack');
        }
        this.setState({
            isModalOpen: false,
            id: '', // 图表id
            appId: 0, // 选择的应用-id
            dsId: 0,
            cols: [],
            defaultType: '', // 打开编辑模态框的时候，画布的类型
            defaultCondition: [], // 打开编辑模态框的时候，画布的约束条件
            activePage: 1, // 当前在第几页
            dashboardId: this.props.dashboardId,
            isVisible: true
        });
        removePopinfo('display:none');
        removeModalOpenClass(); // 移除body的‘modal-open’
    }
    openModal(appId, dsId, id, type) {
        this.setState({
            isModalOpen: true,
            id: id,
            appId: appId,
            dsId: dsId,
            defaultType: type
        }, function () {
            actions.getDashChartDetail({ id: id });
            actions.getDashChartCols({ app_id: appId, ds_id: dsId });
        });
    }
    // getDashChartDetailSuccess返回condition后设置 activ 为 true
    addActiveToCond(data) {
        let conds = [];
        for (let i = 0, j = data.length; i < j; i++) {
            let cond = Object.assign({}, data[i]);
            cond.active = true;
            conds.push(cond);
        }
        return conds;
    }
    changeActivePage(page) {
        if (page !== this.state.activePage) {
            this.setState({
                activePage: page
            });
        }
        if (page === 1) {
            removePopinfo('display:none');
        } else {
            let style = 'position: fixed;left: 21%;top: 20%;';
            removePopinfo(style);
        };
    }
    handleCommit() {
        let condOld = deepClone(this.state.defaultCondition);
        let hasErr = false;
        let page1 = this.refs.editWrap.getValue();
        if (!page1) {
            hasErr = true;
        }
        if (hasErr) {
            if (this.state.activePage === 2) {
                this.setState({
                    activePage: 1
                });
            }
        } else {
            // groupsIsChanged true 为没改变
            // groupsIsChanged false 为改变
            let groupsIsChanged = true; // 分组方式是否改变
            let page2 = this.refs.chartFilter.getValue();
            if (this.props.chartData.plot_type !== 4) { // 非表格类型判断condtion
                let newGroup = this.props.chartData.dimension.newGroup;
                let oldGroupFirst = newGroup[0];
                let newGroupFirst = page1.postData.dimension.newGroup[0];
                if (oldGroupFirst.col_name !== newGroupFirst.col_name
                    || oldGroupFirst.cond_second !== newGroupFirst.cond_second) {
                    groupsIsChanged = false;
                }
            }
            page1.postData.condition = page2;
            let canvasData = {
                fromData: page1.fromData,
                postData: page1.postData
            };
            let oldCond = JSON.stringify(page1.postData.condition);
            localStorage.setItem(`cavansCondtion${page1.fromData.id}`, oldCond);
            localStorage.setItem(`cavansAllinfo${this.state.id}`, JSON.stringify(canvasData));

            actions.editDashChart(page1.fromData, page1.postData, this.props.fromPage);

            if (!groupsIsChanged) {
                let headerData = { chart_id: this.state.id };
                actions.drillDashChart(headerData, {}, 'nocallBack');
            }
        }
        removePopinfo('display:none');
    }
    // 如果是编辑，要从cols里面把groups中已添加的分组方式移除
    initCols(cols, groups) {
        let newCols = cols; // 新的cols
        let newGroups = [];
        if (groups) {
            let delList = []; // 要从cols移除的分组方式
            for (let i = 0, j = groups.length; i < j; i++) {
                delList.push({
                    id: groups[i].col_name,
                    name: groups[i].col_desc,
                    type: groups[i].col_type
                });
            }
            newCols = PageMethod.delItems(delList, cols, 'id');
            newGroups = groups;
        }
        return { newCols, newGroups };
    }
    // 渲染内容组件
    renderTabContent() {
        let editContent = null;
        if (this.state.defaultType === 4) {
            editContent = (
                <TableEdit
                    ref='editWrap'
                    id={this.props.id}
                    activePage={this.state.activePage}
                    dashboardId={this.props.dashboardId}
                />
            );
        } else {
            editContent = (
                <ChartEdit
                    ref='editWrap'
                    id={this.props.id}
                    activePage={this.state.activePage}
                    dashboardId={this.props.dashboardId}
                    from={this.props.from}
                />
            );
        }
        let { cols, defaultCondition } = this.state;
        let { newCols, newGroups } = this.initCols(cols, defaultCondition);
        return (
            <div className='tab_content'>
                <div style={{ display: this.state.activePage === 1 ? 'block' : 'none' }}>
                    {editContent}
                </div>
                <div style={{ display: this.state.activePage === 2 ? 'block' : 'none' }}>
                    <Filter
                        ref='chartFilter'
                        supportDelInInputgroup // 支持在inputgroup中直接删除选中下拉框中的选项
                        hasPopInfo={true}
                        appId={this.state.appId}
                        dsId={this.state.dsId}
                        cols={newCols}
                        condition={newGroups}
                        activePage={this.state.activePage}
                    />
                </div>
            </div>
        );
    }
    setModalIsVisible(isVisible) {
        if (isVisible) {
            let cavansAllinfo = JSON.parse(localStorage.getItem(`cavansAllinfo${this.state.id}`));
            let { fromData, postData } = cavansAllinfo;
            let { app_id, dashboard_id, ds_id, id, name, type } = fromData;
            let { condition, dimension } = postData;
            this.setState({
                id: id, // 图表id
                appId: app_id, // 选择的应用-id
                dsId: ds_id,
                cols: [],
                defaultType: type, // 打开编辑模态框的时候，画布的类型
                defaultCondition: [], // 打开编辑模态框的时候，画布的约束条件
                dashboardId: dashboard_id,
                activePage: 2,
                isVisible: isVisible,
            }, function () {
                actions.getDashChartDetail({ id: id });
                actions.getDashChartCols({ app_id: app_id, ds_id: ds_id });
            });
        } else {
            this.setState({
                isVisible: isVisible,
            })
        }
    }
    render() {
        if (!this.state.isModalOpen) {
            return null;
        }
        let classes = classnames(
            'dashboard-editModal',
            { 'dashboard-editModal-none': !this.state.isVisible }
        );
        let content = this.renderTabContent();
        return (
            <RModal.Modal
                className={classes}
                isOpen={this.state.isModalOpen}
                onRequestHide={this.hideModal}>

                <div className='modal-body'>
                    <ul className='tab_labels'>
                        <li
                            onClick={this.changeActivePage.bind(this, 1)}
                            className={this.state.activePage === 1 ?
                                'tab-title-item active' : 'tab-title-item'}
                        >
                            <div>图表设置</div>
                        </li>
                        <li
                            onClick={this.changeActivePage.bind(this, 2)}
                            className={this.state.activePage === 2 ?
                                'tab-title-item active' : 'tab-title-item'}
                        >
                            <div>过滤器</div>
                        </li>
                    </ul>
                    {content}
                </div>

                <div className="modal-footer">
                    <Button className='confirm'
                        onClick={this.handleCommit}>确定</Button>
                    <Button className='cancel'
                        onClick={this.hideModal}>取消</Button>
                </div>
            </RModal.Modal>
        );
    }
}

// 条形图，柱状图，折线图：图表设置
class ChartEdit extends PureComponent {
    constructor(props) {
        super(props);
        this.state = this.setDefaultState();
        this.changeChartType = this.changeChartType.bind(this);
        this.groupChange = this.groupChange.bind(this);
    }
    setDefaultState() {
        return {
            cols: [], // 配置页面配置的字段
            intCols: [], // int类型的-配置页面配置的字段
            measureColData: [], // 度量方式-字段下拉框的数据
            measureMethodId: '',
            measureMethodName: '',
            measureColId: '', // 度量方式-字段
            measureColName: '', // 度量方式-字段显示名称
            measureColType: '', // 度量方式-字段类型
            groups: [], // 多个分组方式 对象数组
            selectedAppId: 0, // 选择的应用-id
            dsId: 0,
            id: '',
            chartType: 1, // 图表类型: 1条形图，2柱状图，3折线图
            chartName: '', // 图表名称
        };
    }
    componentDidMount() {
        this.unsubscribe = DashboardStore.listen(this.pubsub, this);
    }
    shouldComponentUpdate(nextProps) {
        if (this.props.activePage !== nextProps.activePage) {
            return false;
        }
        return true;
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    pubsub(type, data) {
        if (type === 'getDashChartDetailSuccess') {
            // table表格类型
            if (data.plot_type !== 4 && this.props.id === data.id) {
                let strbody = JSON.parse(data.strbody);
                let dimension = strbody.dimension;
                // 度量方式
                let measureMethodId = dimension.measure.method;
                let measureMethodName = getNameById(measureMethodId, Config.saleClues.measure);
                let measureColId = dimension.measure.col_name;
                let measureColName = dimension.measure.col_desc;
                let measureColType = dimension.measure.col_type;

                // 分组方式
                let newGroup = [];
                /**
                 * 为了兼容历史版本
                 * 历史版本用的是 dimension.group (对象，有 col_name，col_desc，col_type，cond_second 属性)
                 * Atom M16版本改为 多个分组方式 用 dimension.newGroup (对象数组)
                 */
                for (let key in dimension) {
                    if (dimension.hasOwnProperty(key)) {
                        if (key === 'group') {
                            newGroup.push(dimension[key]);
                            break;
                        } else if (key === 'newGroup') {
                            newGroup = dimension[key];
                            break;
                        }
                    }
                }
                this.setState({
                    measureMethodId: measureMethodId,
                    measureMethodName: measureMethodName,
                    measureColId: measureColId,
                    measureColName: measureColName,
                    measureColType: measureColType,

                    groups: newGroup,

                    chartName: data.name,
                    selectedAppId: data.app_id,
                    dsId: data.ds_id,
                    id: data.id,
                    chartType: data.plot_type
                });
            }
        } else if (type === 'getDashChartColsSuccess') {
            let cols = PageMethod.convertSelectData(data.cols);
            let intCols = PageMethod.convertIntSelectData(data.cols);
            let total = Config.saleClues.defaultMeasureColData;
            let measureColData = total.concat(cols);
            this.setState({
                cols: cols,
                intCols: intCols,
                measureColData: measureColData
            });
        }
    }
    groupChange(groups) {
        this.setState({
            groups: groups,
        })
    }
    getValue() {
        let chartName = this.refs.chartName.getRawValue();
        if (this.refs.chartName.handleChange(chartName)) {
            return false;
        }
        let measure = this.refs.measurePattern.getValue();
        if (measure.method === '' || measure.col_name === '') {
            this.refs.measurePattern.setHint('请选择度量方式');
            return false;
        } else {
            this.refs.measurePattern.setHint('');
        }
        let newGroup = this.refs.groupPattern.getValue();
        if (!newGroup) {
            return false;
        }
        let postData = {
            dimension: {
                measure: measure,
                newGroup: newGroup
            }
        };
        let chartType = this.refs.chartTypeSelect.getValue();
        let fromData = {
            name: chartName,
            app_id: this.state.selectedAppId,
            ds_id: this.state.dsId,
            type: chartType,
            id: this.state.id // 编辑-id
        };
        fromData.dashboard_id = this.props.dashboardId;
        return {
            fromData: fromData,
            postData: postData
        };
    }
    // 当选中的应用为‘销售线索’时
    renderDimension() {
        let labelObj = PageMethod.getMeasureOrGroupType(this.state.chartType);
        return (
            <div>
                <MeasurePattern
                    ref='measurePattern'
                    cols={this.state.cols}
                    intCols={this.state.intCols}
                    measureColData={this.state.measureColData}
                    measureMethodId={this.state.measureMethodId}
                    measureMethodName={this.state.measureMethodName}
                    measureColId={this.state.measureColId}
                    measureColName={this.state.measureColName}
                    measureColType={this.state.measureColType}
                    label={labelObj.labelForMeasurePattern}
                />
                <GroupPattern
                    ref='groupPattern'
                    cols={this.state.cols}
                    groups={this.state.groups}
                    label={labelObj.labelForGroupPattern}
                    onGroupChange={this.groupChange}
                    chartType={this.state.chartType}
                />
            </div>
        );
    }
    // 改变图表类型
    changeChartType(type) {
        this.setState({
            chartType: type
        });
    }
    // 图表类型选择
    renderChartType() {
        return (
            <ChartTypeSelect
                ref='chartTypeSelect'
                hasTableType={false}
                chartType={this.state.chartType}
                onChangeType={this.changeChartType}
                groupsLength={this.state.groups.length}
                from={this.props.from}
            />
        );
    }
    render() {
        let chartTypePage = this.renderChartType();
        let dimension = this.renderDimension();
        let { hint, maxLength, errhint1, errhint2 } = FormValidateData.input_validation.input_validation_hint_type1;
        return (
            <div className='graphSetup-page'>
                <div className='line'>
                    <div className='itemName'>
                        <span>图表名称</span>
                    </div>
                    <InputWithErrMsg
                        className='itemValue'
                        ref='chartName'
                        textLengthLimit={64}
                        hint={hint}
                        field='请输入图表名称'
                        validation={validationIputStrType1}
                        validateName='columnExplain'
                        defaultValue={this.state.chartName}
                        maxLength={maxLength}
                        errhint1={errhint1}
                        errhint2={errhint2}
                        errhint3='请输入图表名称'
                    />
                </div>
                {chartTypePage}
                {dimension}
            </div>
        );
    }
}

// 编辑-图表类型为：表格
class TableEdit extends PureComponent {
    constructor(props) {
        super(props);
        this.maxSize = Config.pageLimit; // table表格类型：每页显示最大行数
        this.state = this.setDefaultState();
    }
    setDefaultState() {
        return {
            cols: [], // 配置页面配置的字段
            chartType: 4,
            id: '', // 编辑状态时-图表id
            chartName: '', // 图表名称
            selectedAppId: 0, // 选择的应用-id
            dsId: 0,
            size: '', // table表格类型：每页显示行数
            columns: [], // table表格类型：选中的显示字段
        };
    }
    componentDidMount() {
        this.unsubscribe = DashboardStore.listen(this.pubsub, this);
    }
    shouldComponentUpdate(nextProps) {
        if (this.props.activePage !== nextProps.activePage) {
            return false;
        }
        return true;
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    pubsub(type, data, from) {
        if (type === 'getDashChartDetailSuccess') {
            if (data.plot_type === 4 && this.props.id === data.id) {
                let strbody = JSON.parse(data.strbody);
                let columns = PageMethod.convertSelectData(strbody.cols);
                this.setState({
                    size: strbody.size,
                    columns: columns,
                    id: data.id,
                    chartName: data.name,
                    selectedAppId: data.app_id,
                    dsId: data.ds_id,
                    chartType: data.plot_type
                });
            }
        } else if (type === 'getDashChartColsSuccess') {
            let cols = PageMethod.convertSelectData(data.cols);
            this.setState({
                cols: cols
            });
        }
    }
    getValue() {
        let chartName = this.refs.chartName.getRawValue();
        if (this.refs.chartName.handleChange(chartName)) {
            return false;
        }
        let pageSize = this.refs.chartTypeTable.refs.pageSize.getRawValue();
        if (this.refs.chartTypeTable.refs.pageSize.handleChange(pageSize)) {
            return false;
        }
        if (!pageSize || pageSize.length === 0) {
            this.refs.chartTypeTable.refs.pageSize.setHint('请输入每页显示行数');
            return false;
        } else {
            let size = Number.parseInt(pageSize, 10);
            if (size < 1 || size > this.maxSize) {
                this.refs.chartTypeTable.refs.pageSize.setHint('每页显示行数为1-' + this.maxSize);
                return false;
            }
        }
        let selectedData = this.refs.chartTypeTable.refs.showColumns.getSelectedData();
        if (selectedData.length === 0) {
            this.refs.chartTypeTable.refs.showColumns.setHint('请选择显示字段');
            return false;
        }
        let postColumns = [];
        let column = null;
        for (let i = 0, j = selectedData.length; i < j; i++) {
            column = {
                col_name: selectedData[i].id,
                col_desc: selectedData[i].name,
                col_type: selectedData[i].type
            };
            postColumns.push(column);
        }
        let postData = {
            size: pageSize,
            cols: postColumns
        };
        let chartType = this.state.chartType;
        let fromData = {
            name: chartName,
            app_id: this.state.selectedAppId,
            ds_id: this.state.dsId,
            type: chartType,
            id: this.state.id // 编辑-id
        };
        fromData.dashboard_id = this.props.dashboardId;
        return {
            fromData: fromData,
            postData: postData
        };
    }
    render() {
        return (
            <div className='graphSetup-page'>
                <div className='line'>
                    <div className='itemName'>
                        <span>图表名称</span>
                    </div>
                    <InputWithErrMsg
                        className='itemValue'
                        ref='chartName'
                        textLengthLimit={64}
                        hint={Lang.text_hint.limit + '，图表名称不允许重复'}
                        field='请输入图表名称'
                        validation={onInputChangeValidate2}
                        validateName='columnExplain'
                        defaultValue={this.state.chartName}
                    />
                </div>
                <ChartTypeTable ref='chartTypeTable'
                    columns={this.state.cols}
                    pageSize={this.state.size}
                    maxSize={this.maxSize}
                    selectedColumns={this.state.columns} />
            </div>
        );
    }
}

module.exports = EditModal;
