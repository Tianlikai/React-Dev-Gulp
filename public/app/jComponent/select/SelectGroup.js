import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SelectItem from './SelectItem';

import actions from '../../actions/actions';
import isUndefined from '../../common/utils/isUndefined';
import deepClone from '../../common/utils/deepClone';

class SelectGroup extends Component {
    constructor(props) {
        super(props);
        this.conditions = this.props.defaultCondtion;
    }
    static propTypes = {
        className: PropTypes.string, // 样式名
        data: PropTypes.array, // 切片器数据
        id: PropTypes.number, // 画布id
        appId: PropTypes.number, // 应用id
        dsId: PropTypes.number, // 数据源id
        useFrom: PropTypes.string, // 该组件被那个页面所引用 全屏 / dashboard
        page: PropTypes.number
    }
    static defaultProps = {
        className: '',
        data: [],
    }
    componentWillReceiveProps(nextProps) {
        this.conditions = nextProps.defaultCondtion;
    }
    /**
     * 获取切片器所有选中的数据
     * @return {obj} 按照col_name获取数据
     */
    getSlicerValue = (from) => {
        let slicerValue = {};
        let { data, id } = this.props;
        data.forEach(function (item, i) {
            let { col_name } = item;
            if (!from || from.changedKey.indexOf(col_name) < 0) {
                slicerValue[col_name] = this.refs[`slicer${id}${col_name}`].getSelectedData();
            }
        }.bind(this));
        return slicerValue;
    }
    getCouldBeSelectData = () => {
        let slicerValue = {};
        let { data, id } = this.props;
        data.forEach(function (item, i) {
            let { col_name } = item;
            let selectedData = this.refs[`slicer${id}${col_name}`].getSelectedData();
            let couldBeSelect = this.refs[`slicer${id}${col_name}`].getCouldBeSelectData();
            let selected = selectedData.filter((ele) => {
                return couldBeSelect.indexOf(ele) > -1;
            });
            if (!selected.length) {
                let selectedAgainst = selectedData.filter(function (ele) {
                    return couldBeSelect.indexOf(ele) < 0;
                });
                slicerValue[col_name] = selectedAgainst;
            } else {
                slicerValue[col_name] = selected;
            }
        }.bind(this));
        return slicerValue;
    }
    getSlicerCondtions = () => {
        let conditions = this.conditions;
        return conditions;
    }
    setSlicerCondtions = () => {
        this.conditions = [];
    }
    /**
     * 渲染切片器组
     * @param {obj} item 当前切片器
     * @param {num} index 切片器下标
     */
    renderGroups = (item, index) => {
        let { id, defaultCondtion } = this.props;
        let { col_name, col_desc, col_type, format } = item;
        let useFrom = this.props.useFrom;
        let selData = defaultCondtion ? defaultCondtion[item.col_name] : [];
        return (
            <SelectItem
                ref={`slicer${id}${col_name}`}
                key={`slicer${id}${col_name}`}
                selectedData={selData}
                col_name={col_name}
                col_desc={col_desc}
                col_type={col_type}
                format={format}
                useFrom={useFrom}
                id={id}
                handleDropUp={this.onMultiselectSearch.bind(this, item)}
                handleSearch={this.handleSearch}
                handleConfirm={this.handleConfirm}
            />
        )
    }
    /**
     * 请求 
     * 切片器选项
     * @param {obj} item 当前切片器
     */
    onMultiselectSearch(item) {
        let { col_name, col_type, format, query } = item;
        let { appId, dsId, id, useFrom } = this.props; // id 为图标id 区分不同图标的切片器

        let data = {
            col_name: col_name,
            app_id: appId,
            ds_id: dsId,
            id: id,
            drill_values: JSON.stringify(this.props.drillValues)
        };
        if (col_type === 'datetime' || col_type === 'date') data.format = format;
        if (isUndefined(appId) || appId === '') {
            return;
        };
        actions.getAppColValues(data, `slicer${id}${col_name}${useFrom}`); // 唯一标识 接收数据
        localStorage.removeItem(`sliceUp${col_name}${id}`);
    }
    /**
     * 请求
     * 切片器内搜索
     * @param {obj} data 请求数据
     * @param {str} value 搜索key
     */
    handleSearch = (data, value) => {
        let { appId, dsId, id, useFrom } = this.props; // id 为图标id 区分不同图标的切片器
        let { col_name } = data;
        data.app_id = appId;
        data.ds_id = dsId;
        data.id = id;
        if (!value) {
            actions.getAppColValues(data, `slicer${id}${col_name}${useFrom}`); // 唯一标识 接收数据
            return null;
        };
        actions.getAppColValues(data, `slicer${id}${col_name}${useFrom}Search`); // 唯一标识 接收数据
    }
    /**
     * 请求
     * 提交切片器 切片数据
     * @param {num} id 切片器所属画布
     */
    handleConfirm = (id) => {
        let {
            drillValues, // 下钻字段 如果不为空 则处于下钻状态
            page,
            targetPage
        } = this.props;
        let data = deepClone(this.props.data);
        let slicerValues = drillValues && drillValues.length > 0 ? this.getCouldBeSelectData() : this.getSlicerValue();

        let conditions = [];
        data.forEach(function (item, i) {
            item.cond = "equal";
            item.value = slicerValues[item.col_name];
            if (item.value[0] !== '所有' && item.value['0'] !== '') conditions.push(item);
        });
        let headerData = {
            id: id,
            page: page || 1,
        };
        let postData = {
            condition: conditions,
            drill_values: drillValues || []
        };
        actions.refreshDashChartData(headerData, postData, `canvas${id}`, targetPage);
    }
    render() {
        const { className, data } = this.props;
        const classes = classnames(
            'JTSelectG',
            className
        );
        return (
            <div className={classes}>
                {data.map(this.renderGroups)}
            </div>
        );
    };
};
export default SelectGroup;