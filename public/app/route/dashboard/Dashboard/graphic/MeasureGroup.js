/*
度量方式 和 分组方式
1. Dashboard 编辑模态框
2. 销售线索 详情页 线索统计-配置模态框
*/
import React, { PureComponent, Component, PropTypes } from 'react';

const Config = require('../../../../common/Config');
const getNameById = require('../../../../common/utils/getNameById');
import PageMethod from '../../../../common/PageMethod';
import Language from '../../../../data/lang';

const SelectWithHint = require('../../../../component/SelectWithHint');

class MeasurePattern extends PureComponent {
    constructor(props) {
        super(props);
        const defaultArr = [];
        this.state = {
            cols: this.props.cols || defaultArr, // 配置页面配置的字段
            intCols: this.props.intCols || defaultArr, // int类型的-配置页面配置的字段
            measureMethodId: this.props.measureMethodId || '',
            measureMethodName: this.props.measureMethodName || '',
            measureColData: this.props.measureColData || defaultArr, // 度量方式-字段下拉框的数据
            measureColId: this.props.measureColId || '', // 度量方式-字段
            measureColName: this.props.measureColName || '', // 度量方式-字段显示名称
            measureColType: this.props.measureColType || '', // 度量方式-字段类型
            nullMeasure: '' // 度量方式为空时提示消息
        };
        this.onSelectChange = this.onSelectChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (typeof (nextProps.measureMethodId) !== 'undefined' && nextProps.measureMethodId !== this.props.measureMethodId) {
            this.setState({
                measureMethodId: nextProps.measureMethodId
            });
        }
        if (typeof (nextProps.measureMethodName) !== 'undefined' && nextProps.measureMethodName !== this.props.measureMethodName) {
            this.setState({
                measureMethodName: nextProps.measureMethodName
            });
        }
        if (typeof (nextProps.measureColId) !== 'undefined' && nextProps.measureColId !== this.props.measureColId) {
            this.setState({
                measureColId: nextProps.measureColId
            });
        }
        if (typeof (nextProps.measureColName) !== 'undefined' && nextProps.measureColName !== this.props.measureColName) {
            this.setState({
                measureColName: nextProps.measureColName
            });
        }
        if (typeof (nextProps.measureColType) !== 'undefined' && nextProps.measureColType !== this.props.measureColType) {
            this.setState({
                measureColType: nextProps.measureColType
            });
        }
        this.setState({
            cols: nextProps.cols,
            intCols: nextProps.intCols,
            measureColData: nextProps.measureColData
        });
    }
    reset() {
        this.setState({
            cols: [], // 配置页面配置的字段
            intCols: [], // int类型的-配置页面配置的字段
            measureMethodId: '',
            measureMethodName: '',
            measureColData: [], // 度量方式-字段下拉框的数据
            measureColId: '', // 度量方式-字段
            measureColName: '', // 度量方式-字段显示名称
            measureColType: '', // 度量方式-字段类型
            nullMeasure: '' // 度量方式为空时提示消息
        });
        this.resetComponent();
    }
    resetComponent() {
        if (this.refs.measureMethod) {
            this.refs.measureMethod.resetSelect();
        }
        if (this.refs.measureCol) {
            this.refs.measureCol.resetSelect();
        }
    }
    // 获取组件数据
    getValue() {
        return {
            method: this.state.measureMethodId,
            col_name: this.state.measureColId,
            col_type: this.state.measureColType,
            col_desc: this.state.measureColName
        };
    }
    // 设置提醒消息
    setHint(hint) {
        this.setState({
            nullMeasure: hint
        });
    }
    // SelectWithHint的回调函数
    onSelectChange(item, from) {
        // 改变度量方式
        if (from === 'measureMethod') {
            if (item.id !== this.state.measureMethodId) {
                if (item.id === 1) {
                    let colData = this.state.measureColData;
                    this.setState({
                        measureMethodId: item.id,
                        measureMethodName: item.name,
                        measureColId: colData[0].id,
                        measureColName: colData[0].name,
                        measureColType: colData[0].type
                    });
                } else {
                    let intCols = this.state.intCols;
                    if (intCols.length > 0) {
                        this.setState({
                            measureMethodId: item.id,
                            measureMethodName: item.name,
                            measureColId: intCols[0].id,
                            measureColName: intCols[0].name,
                            measureColType: intCols[0].type
                        });
                    } else {
                        this.setState({
                            measureMethodId: item.id,
                            measureMethodName: item.name,
                            measureColId: '',
                            measureColName: '',
                            measureColType: ''
                        });
                    }
                }
            }
        } else if (from === 'measureCol') {
            if (item.id !== this.state.measureColId) {
                this.setState({
                    measureColId: item.id,
                    measureColName: item.name,
                    measureColType: item.type
                });
            }
        }
    }
    render() {
        let measureMethodId = this.state.measureMethodId;
        let measureColData = [];
        if (measureMethodId !== '') {
            if (measureMethodId === 1) {
                measureColData = this.state.measureColData;
            } else {
                measureColData = this.state.intCols;
            }
        }
        let defaultMeasureColData = {
            id: this.state.measureColId,
            name: this.state.measureColName,
            type: this.state.measureColType
        };
        return (
            <div className='line'>
                <div className='itemName'>
                    <span>{this.props.label}<span style={{ color: '#FB6271' }}>*</span></span>
                </div>
                <SelectWithHint
                    ref='measureMethod'
                    name='measureMethod'
                    data={Config.saleClues.measure}
                    defaultId={this.state.measureMethodId}
                    defaultValue={this.state.measureMethodName}
                    className='itemValue'
                    dataIsObject={true}
                    onChange={this.onSelectChange}
                />
                <SelectWithHint
                    ref='measureCol'
                    name='measureCol'
                    data={measureColData}
                    defaultData={defaultMeasureColData}
                    defaultId={this.state.measureColId}
                    defaultValue={this.state.measureColName}
                    className='itemValue'
                    dataIsObject={true}
                    onChange={this.onSelectChange}
                />
                <div className='whole hint err'>{this.state.nullMeasure}</div>
            </div>
        );
    }
}
class GroupPattern extends PureComponent {
    constructor(props) {
        super(props);
        this.max = 2; // 最多有2个分组方式,当为环形图时最多有一个分组方式
        let { newCols, newGroups } = this.initCols(this.props.cols, this.props.groups);
        this.state = {
            cols: newCols, // 配置页面配置的字段
            groups: newGroups, // 编辑的时候,多个分组方式的 对象数组
            nullGroup: '' // 分组方式为空时提示消息
        };
        this.changeCol = this.changeCol.bind(this);
        this.addGroup = this.addGroup.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { newCols, newGroups } = this.initCols(nextProps.cols, nextProps.groups);
        this.setState({
            cols: newCols,
            groups: newGroups
        });
    }
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
    reset() {
        this.setState({
            cols: [], // 配置页面配置的字段
            groups: [],
            nullGroup: '' // 分组方式为空时提示消息
        });
    }
    // 获取组件数据
    getValue() {
        let newGroup = [];
        let groups = this.state.groups;
        for (let i = 0, j = groups.length; i < j; i++) {
            if (groups[i].col_name !== '') {
                newGroup.push(groups[i]);
            }
        }
        if (newGroup.length === 0) {
            this.setHint('请选择分组方式');
            return false;
        }
        this.setHint('');
        return newGroup;
    }
    // 设置提醒消息
    setHint(hint) {
        this.setState({
            nullGroup: hint
        });
    }
    // 添加分组方式
    addGroup() {
        let groups = this.state.groups;
        let data = {
            col_name: '',
            col_desc: '',
            col_type: '',
            cond_second: ''
        };
        groups.push(data);
        this.setState({
            groups: groups
        });
        if (this.props.onGroupChange) {
            this.props.onGroupChange(groups);
        }
    }
    // 改变下拉框的选项col
    changeCol(type, index, item) {
        let cols = this.state.cols;
        let groups = this.state.groups;
        // 改变分组方式的第一个下拉框
        if (type === 'groupCol') {
            let delList = [];
            delList.push(item);
            cols = PageMethod.delItems(delList, cols, 'id');
            groups[index].col_name = item.id;
            groups[index].col_desc = item.name;
            groups[index].col_type = item.type;
            if (item.type === 'datetime' || item.type === 'date') {
                groups[index].cond_second = Config.saleClues.dateType[2].id;
            } else {
                groups[index].cond_second = '';
            }
        } else if (type === 'groupCondValue') {
            groups[index].cond_second = item.id;
        } else if (type === 'delCond') {
            let col = {
                id: item.col_name,
                name: item.col_desc,
                type: item.col_type
            };
            cols.push(col);
            groups.splice(index, 1);
        }
        this.setState({
            cols: cols,
            groups: groups
        });
        if (this.props.onGroupChange) {
            this.props.onGroupChange(groups);
        }
    }
    renderGroups(groups) {
        return groups.map(function (item, index) {
            let refName = 'GroupItem' + index;
            return (
                <GroupItem
                    key={refName}
                    ref={refName}
                    index={index}
                    cols={this.state.cols}
                    data={item}
                    changeCol={this.changeCol}
                />
            );
        }.bind(this));
    }
    render() {
        let addBtn = null;
        this.max = this.props.chartType !== 5 ? 2 : 1;
        if (this.state.groups.length < this.max) {
            addBtn = (
                <div
                    className='link-title-wrap specialBytian' // 特殊命名处理
                    onClick={this.addGroup}>
                    +添加分组方式
                </div>
            );
        }
        let errHint = null;
        if (this.state.nullGroup !== '') {
            errHint = (
                <div className='whole hint err'>{this.state.nullGroup}</div>
            );
        }
        let groups = this.state.groups;
        let groupsContent = null;
        if (groups.length > 0) {
            groupsContent = this.renderGroups(groups);
        }
        return (
            <div className='line'>
                <div className='itemName'>
                    <span>{this.props.label}</span>
                </div>
                <div className='multi-group-wrap'>
                    {addBtn}
                    {groupsContent}
                </div>
                {errHint}
            </div>
        );
    }
}
GroupPattern.propTypes = {
    cols: PropTypes.array.isRequired,
    groups: PropTypes.array,
    chartType: PropTypes.number,
};

class GroupItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cols: this.props.cols, // 配置页面配置的字段
            group: this.props.data // 分组方式
        };
        this.onSelectChange = this.onSelectChange.bind(this);
        this.delCond = this.delCond.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            cols: nextProps.cols,
            group: nextProps.data
        });
    }
    // SelectWithHint的回调函数
    onSelectChange(item, from) {
        if (this.props.changeCol) {
            this.props.changeCol(from, this.props.index, item);
        }
    }
    // 删除条件
    delCond() {
        if (this.props.changeCol) {
            this.props.changeCol('delCond', this.props.index, this.state.group);
        }
        this.setState({
            active: false
        });
    }
    renderGroupItem(group, groupConditionId) {
        let groupConditionName = group.col_desc;
        let groupConditionType = group.col_type;
        let groupCondValueId = group.cond_second;
        let groupCondValueName = getNameById(groupCondValueId,
            Config.saleClues.dateType);
        let groupCondition = null;
        if (groupConditionType === 'datetime' || groupConditionType === 'date') {
            groupCondition = (
                <SelectWithHint
                    ref='groupCondValue'
                    name='groupCondValue'
                    data={Config.saleClues.dateType}
                    defaultId={groupCondValueId}
                    defaultValue={groupCondValueName}
                    className='itemValue'
                    dataIsObject={true}
                    onChange={this.onSelectChange}
                />
            );
        }
        return (
            <div className='group-item-page'>
                <div title={groupConditionName} className='rct-form-control text-overflow'>
                    {groupConditionName}
                </div>
                {groupCondition}
                <span className='glyphicon glyphicon-trash del'
                    onClick={this.delCond}
                    title={Language.title.del}
                ></span>
            </div>
        );
    }
    render() {
        let group = this.state.group;
        let groupConditionId = group.col_name;
        // 如果为 ''空字符串，说明还未选择分组方式
        if (groupConditionId === '') {
            return (
                <div className='group-item-page'>
                    <SelectWithHint
                        ref='groupCol'
                        name='groupCol'
                        data={this.state.cols}
                        className='itemValue'
                        dataIsObject={true}
                        onChange={this.onSelectChange}
                    />
                </div>
            );
        }
        return this.renderGroupItem(group, groupConditionId);
    }
}
GroupItem.propTypes = {
    index: PropTypes.number.isRequired, // 用来判断父组件是哪个
    cols: PropTypes.array.isRequired,
    data: PropTypes.object,
    changeCol: PropTypes.func,
};
GroupItem.defaultProps = {
    data: {
        col_name: '',
        col_desc: '',
        col_type: '',
        cond_second: ''
    }
};

module.exports = { MeasurePattern, GroupPattern, GroupItem };
