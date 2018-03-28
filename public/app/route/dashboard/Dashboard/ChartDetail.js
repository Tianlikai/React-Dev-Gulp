/**
Dashboard中，图表类型为：折线图，柱状图，条形图时，双击显示详情页
*/
import React, { PureComponent } from 'react';
import ReactTable from "react-table";

import actions from '../../../actions/actions';
import Config from '../../../common/Config';
import SystemValue from '../../../data/SystemValue';
import PageMethod from '../../../common/PageMethod';

import NPagination from '../../../component/NPagination';
import Table from '../../../component/Elements/Table';

import ConditionShow from './graphic/ConditionShow';
import AutoColTable from './AutoColTable';
import ConfigurationColumnsModal from './ConfigurationColumns/ConfigurationColumnsModal'
import DashboardStore from '../../../stores/DashboardStore';
import UtilStore from '../../../stores/UtilStore';

class ChartDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.pageLimit = this.props.pageLimit;
        this.state = {
            urlData: '', // getChartDetailData要传的urlData数据, 参数page 要根据页面改变
            postData: '', // getChartDetailData要传的postData数据
            name: '',
            constraintList: [], // 约束条件
            screeningList: [], // 筛选条件
            title: [], // 表头
            list: [], // 内容
            totalItems: 0, // 所有的条目数
            app_id: null,
            ds_id: null,
        };
        this.pageHandler = this.pageHandler.bind(this);
        this.openConfigurationColumns = this.openConfigurationColumns.bind(this);
        this.closeConfigurationColumns = this.closeConfigurationColumns.bind(this);
    }
    componentDidMount() {
        this.unsubscribe = DashboardStore.listen(this.pubsub, this);
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    pubsub(type, data, from) {
        debugger
        switch (type) {
            case 'getChartDetailDataSuccess':
                if (from.fromPage === this.props.name) {
                    // this.refs.content.scrollTop = 0; // 把tbody父div的滑动条移到最上面
                    const array = [];
                    let screeningList = this.getScreeningFromData(from.postData);
                    this.setState({
                        urlData: from.urlData,
                        postData: from.postData,
                        screeningList: screeningList,
                        name: from.postData.filter_value.join(','),
                        constraintList: data.condition,
                        title: data.title || array,
                        list: data.list,
                        totalItems: data.total,
                        app_id: data.app_id,
                        ds_id: data.ds_id,
                    }, function () {
                        if (this.props.onScrollToDetail) this.props.onScrollToDetail();
                    });
                }
                break;
            case 'onCommitConfigurationColsCDTSuccess':
                this.closeConfigurationColumns();
                this.pageHandler(1);
                break;
            default:
                break;
        }
    }
    // getChartDetailDataSuccess返回的数据中得到screeningList
    getScreeningFromData(data) {
        let screeningList = [];
        if (this.props.showCondition) {
            for (let v in data) {
                if (data.hasOwnProperty(v)) {
                    if (v === 'condition') {
                        screeningList = data[v];
                    }
                }
            }
        }
        return screeningList;
    }
    // 老版本 如果 list 不够20条要补全
    fillList(title, list) {
        let len = list.length;
        if (len < this.pageLimit) {
            let item = []; // 给list补充的(空数据)
            for (let i = 0, j = title.length; i < j; i++) {
                item.push('');
            }
            let emptyList = [];
            for (let i = 0, j = this.pageLimit - len; i < j; i++) {
                emptyList.push(item);
            }
            return list.concat(emptyList);
        }
        return list;
    }
    // 翻页
    pageHandler(index) {
        let urlData = this.state.urlData;
        urlData.page = index;
        actions.getChartDetailData({
            urlData: urlData,
            postData: this.state.postData,
            fromPage: this.props.name
        });
    }
    initTableColumns(columns) {
        if (columns.length <= 0) return [];
        let cols = [];
        columns.forEach(function (item, index) {
            let obj = {};
            obj.Header = item;
            obj.accessor = "h" + index;
            obj.headerClassName = 'tableHeaderCellStyle';
            obj.className = 'tableConetentCellStyle';
            cols.push(obj);
        }, this);
        return cols;
    }
    initTableContent(data, data2) {
        let content = [];
        data.forEach(function (item, index) {
            let obj = {};
            item.forEach(function (value, i) {
                obj['h' + i] = value;
            })
            content.push(obj);
        })
        return content;
    }
    openConfigurationColumns() {
        let data = {
            app_id: this.state.app_id,
            ds_id: this.state.ds_id,
        }
        actions.getCanvasColsResult(data, 'CDT');
        this.refs.configurationColumns.open();
    }
    closeConfigurationColumns() {
        this.refs.configurationColumns.close();
    }
    render() {
        if (this.state.title.length <= 0) return null;
        let condition = null;
        let columns = this.initTableColumns(this.state.title);
        let content = this.initTableContent(this.state.list, this.state.title);

        let showLine = this.pageLimit;
        // let isShowNPagination = this.state.totalItems > 20 ? true : false;
        let noDataHint = SystemValue.tableHint.Nodetails;
        let tableHight = (showLine + 1) * 40 + showLine + 1 + 20;

        if (this.props.showCondition) {
            condition = (
                <ConditionShow
                    sum={this.state.totalItems}
                    impotBy={'noDsbChart'}
                    constraintList={this.state.constraintList}
                />
            );
        }
        return (
            <div className='chart-detail-page'>
                <div className='titleName'>
                    <span style={{ fontSize: 16 }}>{this.state.name}</span>
                    <span className='glyphicon glyphicon-cog config'
                        style={{ marginLeft: '5px', cursor: 'pointer', fontSize: 14 }}
                        title='配置可显示列'
                        onClick={this.openConfigurationColumns}>
                    </span>
                </div>
                {condition}

                <ReactTable
                    columns={columns}
                    data={content}
                    defaultPageSize={showLine}
                    noDataText={noDataHint}
                    showPagination={false}
                    style={{ height: tableHight }}
                    className="-striped -highlight reactTableCellStyle"
                    getTheadThProps={(state, rowInfo, column, instance) => {
                        return {
                            onClick: (e) => {
                                if (column.Header === '创建时间') {
                                    return null;
                                }
                            }
                        }
                    }}
                />

                <NPagination ref='pagination'
                    onChange={this.pageHandler}
                    total={this.state.totalItems}
                    size={this.pageLimit}
                    isshow={true}
                />
                <ConfigurationColumnsModal
                    ref='configurationColumns'
                    titleName='编辑显示字段'
                    app_id={this.state.app_id}
                    ds_id={this.state.ds_id}
                />
            </div >
        );
    }
}
ChartDetail.propTypes = {
    onScreenScroll: React.PropTypes.func,
    pageLimit: React.PropTypes.number,
    name: React.PropTypes.string, // 祖先页面名称('CreatedByMe', 'FromSharing')
    showCondition: React.PropTypes.bool
};
export default ChartDetail;
