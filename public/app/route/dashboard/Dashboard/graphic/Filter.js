/*
筛选条件
*/
import React, { Component } from 'react';

const isUndefined = require('../../../../common/utils/isUndefined');
const getNameById = require('../../../../common/utils/getNameById');
const Config = require('../../../../common/Config');
const actions = require('../../../../actions/actions');
import PageMethod from '../../../../common/PageMethod';

import FilterItem from './FilterItem';

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = this.setDefaultState();
        this.addCondition = this.addCondition.bind(this);
        this.onMultiselectSearch = this.onMultiselectSearch.bind(this);
        this.changeCol = this.changeCol.bind(this);
    }
    setDefaultState() {
        return {
            condition: this.props.condition || [], // 用户配置的条件
            cols: this.props.cols || [] // 配置页面配置的字段
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.cols) {
            this.setState({
                cols: nextProps.cols
            });
        }
        if (nextProps.condition) {
            this.setState({
                condition: nextProps.condition
            });
        }
    }
    shouldComponentUpdate(nextProps) {
        if (!isUndefined(this.props.activePage)) {
            if (this.props.activePage !== nextProps.activePage) {
                return false;
            }
        }
        return true;
    }
    // 统计数据过滤中所有有效的筛选条件
    getValue() {
        let condition = [];
        for (let i = 0, j = this.state.condition.length; i < j; i++) {
            let cond = this.refs['CorrelateSelect' + i].getValue();
            // 如果 筛选条件有效，则添加进数组
            if (cond.active) {
                condition.push(cond.condition);
            }
        }
        return condition;
    }
    reset() {
        this.setState(this.setDefaultState());
    }
    // CorrelateSelect组件中 多选下拉框 第一次打开时获取数据、搜索
    onMultiselectSearch(from, data) {
        let fromPage = 'CorrelateSelect' + from;
        if (isUndefined(this.props.appId) || this.props.appId === '') {
            return;
        }
        data.app_id = this.props.appId;
        data.ds_id = this.props.dsId;
        actions.getAppColValues(data, fromPage);
    }
    // FilterItem的回调函数，改变下拉框的选项col
    changeCol(item, type) {
        let cols = this.state.cols;
        if (type === 'del') {
            let delList = [];
            delList.push(item);
            cols = PageMethod.delItems(delList, cols, 'id');
        } else if (type === 'add') {
            cols.push(item);
        }
        this.setState({
            cols: cols
        });
    }
    // 添加更多条件
    addCondition() {
        let condition = this.state.condition;
        condition.push({
            col_name: '',
            cond: '',
            value: []
        });
        this.setState({
            condition: condition
        });
    }
    // 渲染统计数据过滤中的条件
    renderConditions() {
        let length = this.state.condition.length;
        return this.state.condition.map(function (item, index) {
            let zIndex = length - index;
            // 如果有字段名：说明不是新增的
            if (item.col_name) {
                let colDesc = item.col_name;
                if (item.col_desc) {
                    colDesc = item.col_desc;
                }
                let isActive = false;
                let colType = '';
                // 如果有col_type,说明是在后端bug修改后添加的
                if (item.col_type) {
                    isActive = true;
                    colType = item.col_type;
                }
                let data = {
                    active: isActive,
                    colName: item.col_name,
                    colDesc: colDesc,
                    colType: colType,
                    condId: item.cond,
                    condName: getNameById(item.cond, Config.saleClues.condition),
                    condValue: item.value
                };
                return (
                    <FilterItem
                        key={'CorrelateSelect' + index}
                        ref={'CorrelateSelect' + index}
                        hascheckAllShow
                        supportDelInInputgroup={this.props.supportDelInInputgroup} // 支持在inputgroup中直接删除选中下拉框中的选项
                        hasPopInfo={this.props.hasPopInfo}
                        data={data}
                        zindex={zIndex}
                        onMultiselectSearch={this.onMultiselectSearch.bind(this, zIndex)}
                        changeCol={this.changeCol}
                    />
                );
            }
            return (
                <FilterItem
                    key={'CorrelateSelect' + index}
                    ref={'CorrelateSelect' + index}
                    hascheckAllShow
                    supportDelInInputgroup={this.props.supportDelInInputgroup} // 支持在inputgroup中直接删除选中下拉框中的选项
                    hasPopInfo={this.props.hasPopInfo}
                    cols={this.state.cols}
                    zindex={zIndex}
                    onMultiselectSearch={this.onMultiselectSearch.bind(this, zIndex)}
                    changeCol={this.changeCol}
                />
            );
        }.bind(this));
    }
    render() {
        let conditions = this.renderConditions();
        return (
            <div className='dataFilter-page'>
                <div>
                    <span className='addCondition'
                        onClick={this.addCondition}>
                        +{this.props.title ? this.props.title : '添加更多条件'}
                    </span>
                </div>
                <div>{conditions}</div>
            </div>
        );
    }
}

Filter.propTypes = {
    appId: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.string
    ]), // 图表所属应用的应用id
    cols: React.PropTypes.array, // 配置字段
    condition: React.PropTypes.array,
    activePage: React.PropTypes.number, // 当前在第几页
    title: React.PropTypes.string, // 标题
    hasDesk51: React.PropTypes.bool, // cols是否含有51desk区域和行业
    createBy: React.PropTypes.string, // 创建依据(Dashboard新建画布时要用到)
    dsId: React.PropTypes.number, // 数据源id(Dashboard新建画布时要用到)
    supportDelInInputgroup: React.PropTypes.bool // 支持在inputgroup中直接删除选中下拉框中的选项
};
Filter.defaultProps = {
    createBy: '',
    dsId: 0
};

module.exports = Filter;
