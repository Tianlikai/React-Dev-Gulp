/*
Dashboard: 添加画布-图表
*/
import React, { PureComponent } from 'react';
import Reflux from 'reflux';
const RModal = require('react-modal-bootstrap');
import classnames from 'classnames';

import {removeModalOpenClass} from '../../../../common/utils/removeModalOpenClass';
import validationIputStrType1 from '../../../../common/utils/validationIputStrType1';
import PageMethod from '../../../../common/PageMethod';
import Config from '../../../../common/Config';
import FormValidateData from '../../../../data/FormValidateData';

import actions from '../../../../actions/actions';
import DashboardStore from '../../../../stores/DashboardStore';
import UtilStore from '../../../../stores/UtilStore';

import PopInfo from '../../../../component/PopInfo';
import Close from '../../../../component/form/Close';
import Button from '../../../../component/form/Button';
import InputWithErrMsg from '../../../../component/InputWithErrMsg';
import Input from "../../../../component/Input";
import SelectWithHint from '../../../../component/SelectWithHint';

import { MeasurePattern, GroupPattern } from '../graphic/MeasureGroup';
import ChartTypeSelect from '../graphic/ChartTypeSelect';
import ChartTypeTable from '../ChartTypeTable';
import Filter from '../graphic/Filter';

const AddModal = React.createClass({
    mixins: [
        Reflux.listenTo(DashboardStore, 'pubsub')
    ],
    setDefaultState: function () {
        return {
            isModalOpen: false,
            cols: [],
            condition: [],
            selectedAppId: 0, // 选择的应用-id
            selectedDsId: 0, // 选中的数据源id
            activePage: 1, // 当前在第几页
            createBy: 'app', // 创建依据, app'应用' ds'数据源'
            canvasFrom: this.props.canvasFrom,
            dashboardId: this.props.dashboardId,
            isVisible: true // 是否为显示当前modal 默认显示
        };
    },
    getInitialState: function () {
        return this.setDefaultState();
    },
    pubsub: function (type, data, from) {
        if (type === 'getDashChartColsSuccess') {
            let cols = PageMethod.convertSelectData(data.cols);
            this.setState({
                cols: cols
            });
        } else if (type === 'addDashChartFail') {
            if (from.fromPage === this.props.fromPage) {
                if (data.errcode === 162001) {
                    this.setState({
                        activePage: 1
                    }, function () {
                        this.refs.operation.refs.chartName.setHint(data.errmsg);
                    });
                } else {
                    this.hideModal();
                    PopInfo.showinfo(data.errmsg, 'danger');
                }
            }
        }
    },
    hideModal: function () {
        this.setState(this.setDefaultState());
        removeModalOpenClass(); // 移除body的‘modal-open’
    },
    openModal: function () {
        this.setState({
            isModalOpen: true,
        });
    },
    changeActivePage: function (page) {
        if (page === 2) {
            let page1 = this.refs.operation.getValue();
            if (!page1) {
                return;
            }
        }
        this.setState({
            activePage: page
        });
    },
    // 改变创建依据，改变数据源
    handleChange: function (from, data) {
        if (from === 'createBy') {
            this.setState({
                createBy: data,
                selectedAppId: 0, // 选择的应用-id
                selectedDsId: 0, // 选中的数据源id
                cols: []
            });
        } else if (from === 'selectedDsId') {
            this.setState({
                selectedDsId: data,
                cols: []
            });
        } else if (from === 'selectedAppId') {
            this.setState({
                selectedAppId: data
            });
        }
        this.refs.chartFilter.reset();
    },
    handleCommit: function () {
        let page1 = this.refs.operation.getValue();
        if (!page1) {
            return;
        }
        let page2 = this.refs.chartFilter.getValue();
        page1.postData.condition = page2;
        // page1.fromData.fromPage = this.props.fromPage;
        actions.addDashChart(page1.fromData, page1.postData, this.props.fromPage);
    },
    setModalIsVisible: function (isVisible) {
        this.setState({
            isVisible: isVisible,
        });
    },
    render: function () {
        if (!this.state.isModalOpen) {
            return null;
        }

        let pageBtn = null;
        let confirmBtn = null;
        if (this.state.activePage === 1) {
            pageBtn = (
                <Button className='confirm'
                    onClick={this.changeActivePage.bind(null, 2)}>下一步</Button>
            );
        } else if (this.state.activePage === 2) {
            pageBtn = (
                <Button className='confirm'
                    onClick={this.changeActivePage.bind(null, 1)}>上一步</Button>
            );
            confirmBtn = (
                <Button className='confirm'
                    onClick={this.handleCommit}>确定</Button>
            );
        }
        let classes = classnames(
            'dashboard-addModal',
            { 'dashboard-addModal-none': !this.state.isVisible }
        );
        let { cols, condition } = this.state;
        return (
            <RModal.Modal
                className={classes}
                isOpen={this.state.isModalOpen}
                onRequestHide={this.hideModal}>
                <Close icon onClick={this.hideModal}
                    style={{ position: 'relative', top: 8, right: 8 }} />

                <div className="modal-header">
                    <div className='title'>新建画布</div>
                </div>

                <div className='modal-body'>
                    <div style={{ display: this.state.activePage === 1 ? 'block' : 'none', overflow: 'inherit' }}>
                        <Operation
                            ref='operation'
                            activePage={this.state.activePage}
                            createBy={this.state.createBy}
                            onChange={this.handleChange}
                            canvasFrom={this.props.canvasFrom}
                            dashboardId={this.props.dashboardId}
                            from={this.props.from}
                        />
                    </div>
                    <div style={{ display: this.state.activePage === 2 ? 'block' : 'none' }}>
                        <Filter
                            ref='chartFilter'
                            supportDelInInputgroup // 支持在inputgroup中直接删除选中下拉框中的选项
                            hasPopInfo={true}
                            cols={cols}
                            activePage={this.state.activePage}
                            title='添加过滤器'
                            createBy={this.state.createBy}
                            appId={this.state.selectedAppId}
                            dsId={this.state.selectedDsId}
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    {confirmBtn}
                    {pageBtn}
                    <Button className='cancel'
                        onClick={this.hideModal}>取消</Button>
                </div>
            </RModal.Modal>
        );
    }
});

// 第一步操作：选择 图表名称，图表类型,度量方式，分组方式
class Operation extends PureComponent {
    constructor(props) {
        super(props);
        this.maxSize = Config.pageLimit; // table表格类型：每页显示最大行数
        this.state = this.setDefaultState();
        this.onSelectChange = this.onSelectChange.bind(this);
        this.changeChartType = this.changeChartType.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.changeCreateBy = this.changeCreateBy.bind(this);
        this.checkDataSource = this.checkDataSource.bind(this);
        this.groupChange = this.groupChange.bind(this);
    }
    setDefaultState() {
        return {
            createBy: this.props.createBy, // 创建依据, app'应用' ds'数据源'
            cols: [], // 配置页面配置的字段
            intCols: [], // int类型的-配置页面配置的字段
            measureColData: [], // 度量方式-字段下拉框的数据
            chartType: 1, // 图表类型: 1条形图，2柱状图，3折线图，4二维表
            selectApps: [], // 选择应用-下拉框
            selectedAppId: 0, // 选择的应用-id,默认为0 表示数据源
            dataSourceList: [], // 选择数据源-下拉框
            isDsAvailable: false, // 选择的数据源是否可用
            selectedDsId: 0, // 选择的数据源-id
            groups: [], // 多个分组方式 对象数组
        };
    }
    componentDidMount() {
        this.unsubscribe = DashboardStore.listen(this.pubsub, this);
        this.unsubscribe1 = UtilStore.listen(this.pubsub, this);
    }
    shouldComponentUpdate(nextProps) {
        if (this.props.activePage !== nextProps.activePage) {
            return false;
        }
        return true;
    }
    componentWillUnmount() {
        this.unsubscribe();
        this.unsubscribe1();
    }
    pubsub(type, data, from) {
        if (type === 'getDashboardAppsSuccess') {
            this.setState({
                selectApps: data.list
            });
        } else if (type === 'getDashChartColsSuccess') {
            let cols = PageMethod.convertSelectData(data.cols);
            let intCols = PageMethod.convertIntSelectData(data.cols);
            let measureColData = Config.saleClues.defaultMeasureColData.concat(cols);
            this.setState({
                cols: cols,
                intCols: intCols,
                measureColData: measureColData
            });
        } else if (type === 'getDataSourceListSuccess') {
            this.setState({
                dataSourceList: data
            });
        } else if (type === 'checkDsFail') {
            if (from === 'Operation') {
                this.setState({
                    isDsAvailable: false
                });
                if (data.errcode === 162001) {
                    this.refs.dsSelect.setHint(data.errmsg);
                } else {
                    PopInfo.showinfo(data.errmsg, 'danger');
                }
            }
        } else if (type === 'checkDsSuccess') {
            if (from === 'Operation') {
                this.setState({
                    isDsAvailable: true
                });
            }
        }
    }
    // 重置子组件
    resetComponent(type = 'all') {
        if (type === 'all') {
            if (this.refs.selectApp) {
                this.refs.selectApp.resetSelect();
            }
            if (this.refs.dsSelect) {
                this.refs.dsSelect.resetSelect();
            }
        } else if (type === 'selectApp') {
            if (this.refs.dsSelect) {
                this.refs.dsSelect.resetSelect();
            }
        } else if (type === 'dsSelect') {
            if (this.refs.selectApp) {
                this.refs.selectApp.resetSelect();
            }
        }
        if (this.refs.measurePattern) {
            this.refs.measurePattern.reset();
        }
        if (this.refs.groupPattern) {
            this.refs.groupPattern.reset();
        }
    }
    getValue() {
        let chartName = this.refs.chartName.getRawValue();
        if (this.refs.chartName.handleChange(chartName)) {
            return false;
        }
        let createBy = this.state.createBy;
        let selectedAppId = this.state.selectedAppId;
        let selectedDsId = this.state.selectedDsId;
        if (createBy === 'app') {
            if (selectedAppId === 0) {
                this.refs.selectApp.setHint('请选择相应的应用');
                return false;
            }
            this.refs.selectApp.setHint('');
        } else if (createBy === 'ds') {
            if (selectedDsId === 0) {
                this.refs.dsSelect.setHint('请选择数据源');
                return false;
            }
            this.refs.dsSelect.setHint('');
            if (!this.state.isDsAvailable) {
                return false;
            }
        }
        let chartType = this.state.chartType;
        let fromData = {
            name: chartName,
            type: this.state.chartType
        };
        fromData.dashboard_id = this.props.dashboardId;
        if (createBy === 'ds') {
            fromData.ds_id = selectedDsId;
            fromData.app_id = 0;
        } else if (createBy === 'app') {
            fromData.app_id = selectedAppId;
            fromData.ds_id = 0; // 如果选择的是应用，ds_id默认为0
        }
        let postData = {};
        if (chartType === 4) {
            let chartTypeTable = this.refs.chartTypeTable;
            let pageSize = chartTypeTable.refs.pageSize;
            let pageSizeValue = pageSize.getRawValue();
            if (pageSize.handleChange(pageSizeValue)) {
                return false;
            }
            if (!pageSizeValue || pageSizeValue.length === 0) {
                pageSize.setHint('请输入每页显示行数');
                return false;
            } else {
                let size = Number.parseInt(pageSizeValue, 10);
                // 如果pageSizeValue不是数字，size可能为NaN
                if (!size || size < 1 || size > this.maxSize) {
                    pageSize.setHint('每页显示行数为1-' + this.maxSize);
                    return false;
                }
            }
            let selectedData = chartTypeTable.refs.showColumns.getSelectedData();
            if (selectedData.length === 0) {
                chartTypeTable.refs.showColumns.setHint('请选择显示字段');
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
            postData = {
                size: pageSizeValue,
                cols: postColumns
            };
        } else {
            let measure = this.refs.measurePattern.getValue();
            if (measure.method === '' || measure.col_name === '') {
                this.refs.measurePattern.setHint('请选择度量方式');
                return false;
            }
            this.refs.measurePattern.setHint('');
            let newGroup = this.refs.groupPattern.getValue();
            if (!newGroup) {
                return false;
            }
            postData = {
                dimension: {
                    measure: measure,
                    newGroup: newGroup
                }
            };
        }
        return {
            fromData: fromData,
            postData: postData
        };
    }
    // SelectWithHint 打开下拉选项时
    onToggle(from) {
        if (from === 'app') {
            if (this.state.selectApps.length === 0) {
                actions.getDashboardApps();
            }
        } else if (from === 'ds') {
            if (this.state.dataSourceList.length === 0) {
                PageMethod.getDataSourceList();
            }
        }
    }
    // SelectWithHint的回调函数
    onSelectChange(item, from) {
        if (from === 'selectApp') { // 选择应用
            this.refs.selectApp.setHint('');
            if (item.id !== this.state.selectedAppId) {
                this.resetComponent(from);
                this.props.onChange('selectedAppId', item.id);
                this.setState({
                    selectedAppId: item.id,
                    cols: [], // 配置页面配置的字段
                    intCols: [], // int类型的-配置页面配置的字段
                    measureColData: [], // 度量方式-字段下拉框的数据
                    chartType: 1, // 图表类型: 1条形图，2柱状图，3折线图，4二维表
                    isDsAvailable: false, // 选择的数据源是否可用
                    selectedDsId: 0 // 选择的数据源-id
                }, function () {
                    actions.getDashChartCols({ app_id: item.id });
                });
            }
        }
    }
    // 改变图表类型
    changeChartType(type) {
        this.setState({
            chartType: type
        });

    }
    // 改变创建依据
    changeCreateBy(type) {
        this.resetComponent('all');
        this.setState({
            createBy: type,
            cols: [], // 配置页面配置的字段
            intCols: [], // int类型的-配置页面配置的字段
            measureColData: [], // 度量方式-字段下拉框的数据
            chartType: 1, // 图表类型: 1条形图，2柱状图，3折线图，4二维表
            selectedAppId: 0, // 选择的应用-id
            isDsAvailable: false, // 选择的数据源是否可用
            selectedDsId: 0 // 选择的数据源-id
        });
        this.props.onChange('createBy', type);
    }
    // 校验数据源是否可用
    checkDataSource(data, type) {
        this.resetComponent(type);
        this.refs.dsSelect.setHint('');
        if (type === 'dsSelect') {
            let oData = {
                app_id: 0,
                ds_id: data.id
            };
            actions.checkDs(oData, 'Operation');
        }
        if (data.id !== this.state.selectedDsId) {
            this.props.onChange('selectedDsId', data.id);
            this.setState({
                selectedDsId: data.id,
                cols: [], // 配置页面配置的字段
                intCols: [], // int类型的-配置页面配置的字段
                measureColData: [], // 度量方式-字段下拉框的数据
                chartType: 1 // 图表类型: 1条形图，2柱状图，3折线图，4二维表
            }, function () {
                actions.getDashChartCols({ app_id: 0, ds_id: data.id });
            });
        }
    }
    groupChange(groups) {
        this.setState({
            groups: groups
        })
    }
    // 当选中的应用为‘销售线索’时
    renderDimension() {
        let labelObj = PageMethod.getMeasureOrGroupType(this.state.chartType);
        return (
            <div style={{
                display: this.state.chartType === 4
                    ? 'none' : 'block'
            }}>
                <MeasurePattern
                    label={labelObj.labelForMeasurePattern}
                    ref='measurePattern'
                    cols={this.state.cols}
                    intCols={this.state.intCols}
                    measureColData={this.state.measureColData}
                />
                <GroupPattern
                    label={labelObj.labelForGroupPattern}
                    ref='groupPattern'
                    cols={this.state.cols}
                    onGroupChange={this.groupChange}
                    groups={this.state.groups}
                    chartType={this.state.chartType}
                />
            </div>
        );
    }
    // 图表类型选择
    renderChartType() {
        return (
            <ChartTypeSelect
                ref='chartTypeSelect'
                chartType={this.state.chartType}
                hasTableType={true}
                onChangeType={this.changeChartType}
                groupsLength={this.state.groups.length}
                from={this.props.from}
            />
        );
    }
    // 根据创建依据选择应用或者数据源
    renderAppDsSelect(createBy) {
        let periodClass1 = 'btn btn-default';
        let periodClass2 = 'btn btn-default';
        let selectWrap;
        if (createBy === 'app') {
            periodClass1 = 'btn btn-default active';
            selectWrap = (
                <div className='line'>
                    <div className='itemName'>
                        <span>选择应用</span>
                    </div>
                    <SelectWithHint
                        ref='selectApp'
                        name='selectApp'
                        width='514px'
                        data={this.state.selectApps}
                        className='itemValue'
                        dataIsObject={true}
                        onChange={this.onSelectChange}
                        onToggle={this.onToggle.bind(this, 'app')}
                    />
                </div>
            );
        } else if (createBy === 'ds') {
            periodClass2 = 'btn btn-default active';
            selectWrap = (
                <div className='line'>
                    <div className='itemName'>
                        <span>选择数据源</span>
                    </div>
                    <SelectWithHint
                        ref='dsSelect'
                        name='dsSelect'
                        width='514px'
                        data={this.state.dataSourceList}
                        className='itemValue'
                        dataIsObject={true}
                        onChange={this.checkDataSource}
                        onToggle={this.onToggle.bind(this, 'ds')}
                    />
                </div>
            );
        }
        return (
            <div>
                <div className='line'>
                    <div className='itemName' >
                        <span style={{ height: '30px', lineHeight: '30px' }}>选择数据</span>
                    </div>
                    <div className='btn-group'>
                        <button type="button" className={periodClass1}
                            onClick={this.changeCreateBy.bind(this, 'app')}>应用</button>
                        <button type="button" className={periodClass2}
                            onClick={this.changeCreateBy.bind(this, 'ds')}>数据源</button>
                    </div>
                </div>
                {selectWrap}
            </div>
        );
    }
    renderFromDashboard() {
        return (
            <div className='line'>
                <div className="itemName"><span>所属仪表盘</span></div>
                <Input
                    className='itemValue'
                    type={'text'}
                    style={{ color: '#9B9B9B' }}
                    defaultValue={this.props.canvasFrom}
                    readOnly={true} />
            </div>
        )
    }
    render() {
        let createBy = this.state.createBy;
        let chartTypePage = null;
        let dimension = null;
        let chartTypeTable = null;
        // 如果创建依据是应用并且选中的是“销售线索”
        if (createBy === 'app' && this.state.selectedAppId === 3) {
            chartTypePage = this.renderChartType();
            dimension = this.renderDimension();
            chartTypeTable = (
                <ChartTypeTable ref='chartTypeTable'
                    columns={this.state.cols}
                    maxSize={this.maxSize}
                    chartType={this.state.chartType}
                    style={{
                        display: this.state.chartType === 4
                            ? 'block' : 'none'
                    }} />
            );
        } else if (createBy === 'ds' && this.state.selectedDsId !== '') {
            if (this.state.isDsAvailable) {
                chartTypePage = this.renderChartType();
                dimension = this.renderDimension();
                chartTypeTable = (
                    <ChartTypeTable ref='chartTypeTable'
                        columns={this.state.cols}
                        maxSize={this.maxSize}
                        chartType={this.state.chartType}
                        style={{
                            display: this.state.chartType === 4
                                ? 'block' : 'none'
                        }} />
                );
            }
        }
        let appDs = this.renderAppDsSelect(createBy);
        let fromDashboard = this.renderFromDashboard();
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
                        maxLength={maxLength}
                        errhint1={errhint1}
                        errhint2={errhint2}
                        errhint3='请输入图表名称'
                    />
                </div>
                {fromDashboard}
                {appDs}
                {chartTypePage}
                {dimension}
                {chartTypeTable}
            </div>
        );
    }
}
Operation.propTypes = {
    createBy: React.PropTypes.string.isRequired,
    activePage: React.PropTypes.number,
    onChangeAppId: React.PropTypes.func,
    onChange: React.PropTypes.func.isRequired,
    from: React.PropTypes.number, //操作来自什么页面
};

module.exports = AddModal;
