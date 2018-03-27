import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SelectWithHint from '../../component/SelectWithHint';
import Button from '../button/Button';
import PageMethod from '../../common/PageMethod';
import Config from '../../common/Config';
import Language from '../../data/lang';
import getNameById from '../../common/utils/getNameById';

class SelectListAdd extends Component {
    constructor(props) {
        super(props);
        let { newCols, newGroups } = this.initCols(this.props.cols, this.props.groups);
        this.state = {
            cols: newCols, // 所有可以配置切片器字段
            groups: newGroups, // 已经配好的切片器字段
            nullGroup: '',
            origindrill: this.props.origindrill
        };
        this.changeCol = this.changeCol.bind(this);
        this.addGroup = this.addGroup.bind(this);
    }
    static propTypes = {
        className: PropTypes.string,
        isLimit: PropTypes.bool,
        max: PropTypes.number,
        hasItemName: PropTypes.string,
    }
    static defaultProps = {
        className: '',
        isLimit: false,
        hasItemName: true
    }
    componentWillReceiveProps(nextProps) {
        let { newCols, newGroups } = this.initCols(nextProps.cols, this.state.groups);
        this.setState({
            cols: newCols,
            groups: newGroups
        });
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
    // 重置
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
        let flag = false;
        for (let i = 0, j = groups.length; i < j; i++) {
            let name = groups[i].col_name;
            let type = groups[i].col_type;
            let format = groups[i].format;
            if ((type === 'datetime' || type === 'date') && format !== 'year' && format !== 'quarter' && format !== 'month' && format !== 'week' && format !== 'day') {
                groups[i].format = 'month';
            };
            if (name !== '') {
                newGroup.push(groups[i]);
            };
        };
        this.setHint('');
        return newGroup;
    }
    // 设置提醒消息
    setHint(hint) {
        this.setState({
            nullGroup: hint
        });
    }
    // 添加切片器
    addGroup() {
        let groups = isNaN(this.state.groups.length) ? this.state.groups.drill_condition : this.state.groups;
        let data = {
            col_name: '',
            col_desc: '',
            col_type: '',
            format: ''
        };
        groups.push(data);
        this.setState({
            groups: groups
        });
        if (this.props.onGroupChange) {
            this.props.onGroupChange(groups);
        }
    }
    // 改变下拉框的选项
    changeCol(type, index, item) {
        let cols = this.state.cols;
        let groups = isNaN(this.state.groups.length) ? this.state.groups.drill_condition : this.state.groups;
        // 改变分组方式的第一个下拉框
        if (type === 'groupdrillCol') {
            let delList = [];
            delList.push(item);
            cols = PageMethod.delItems(delList, cols, 'id');
            groups[index].col_name = item.id;
            groups[index].col_desc = item.name;
            groups[index].col_type = item.type;
            groups[index].charttype = '条形图';
            groups[index].plot_type = 1;
            if (item.type === 'datetime' || item.type === 'date') {
                groups[index].format = Config.saleClues.dateType[2].id;
            } else {
                groups[index].format = '';
            }
        } else if (type === 'groupCondValue') {
            groups[index].format = item.id;
        } else if (type === 'delCond') {
            let col = {
                id: item.col_name,
                name: item.col_desc,
                type: item.col_type
            };
            cols.push(col);
            groups.splice(index, 1);
        } else if (type === 'drillCol') {
            let charttype = ['条形图', '柱状图', '折线图', '', '环形图', '条形堆积图', '柱状堆积图'];
            groups[index].charttype = item;
            let plot_type = charttype.indexOf(item);
            groups[index].plot_type = plot_type + 1;
        }
        this.setState({
            cols: cols,
            groups: groups
        });
        if (this.props.onGroupChange) {
            this.props.onGroupChange(groups);
        }
        if (this.props.onSelectListChange) {
            this.props.onSelectListChange(groups);
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
                    numberOfNewGroup={this.props.numberOfNewGroup}
                    changeCol={this.changeCol}
                />
            );
        }.bind(this));
    }
    getErrHint(hasItemName) {
        let errHintClassnames = classnames(
            'whole hint err',
            { 'noLableName': !hasItemName }
        );
        let errHint = null;
        if (this.state.nullGroup !== '') {
            errHint = (
                <div className={errHintClassnames}>{this.state.nullGroup}</div>
            );
        };
        return errHint;
    }
    render() {
        let { isLimit, max, hasItemName } = this.props;
        // 列表是否有限制，
        // 如有：则限制为最多max条
        // 如无：则没有限制
        // 9007199254740992为js能表达的最大数
        // let limit = isLimit && max >= 0 ? max : 9007199254740992;
        let groups = isNaN(this.state.groups.length) ? this.state.groups.drill_condition : this.state.groups;
        let isTheBtnAvailable = max > groups.length ? true : false;
        let btnClassnames = classnames(
            'addConstraintCond',
            'drill',
            { 'disable': !isTheBtnAvailable }
        );
        let btntit = this.props.btntit ? this.props.btntit : null;
        let btnLabel = isLimit ?
            `+${this.props.modalstring}` + `(${max - groups.length})`
            : `+添加切片器`;

        let labelNameClassnames = classnames(
            'itemName',
            { 'disable': !hasItemName }
        );

        let errHint = this.getErrHint(hasItemName);

        let groupsContent = null;
        if (groups.length > 0) {
            groupsContent = this.renderGroups(groups);
        }
        return (
            <div className='line'>
                <div className={labelNameClassnames}>
                    <span>{this.props.label}</span>
                </div>
                <div className='multi-group-wrap drill-body'>
                    <div className='drill-body-span'>{btntit}</div>
                    <div className='drill-body-right'>
                        <Button
                            className={btnClassnames}
                            onClick={this.addGroup}>
                            {btnLabel}
                        </Button>
                        <div className='drill-selected drill-select'>{this.state.origindrill ? this.state.origindrill : null}</div>
                        <div className='drill-select'>
                            {groupsContent}
                        </div>
                    </div>
                    <div style={{ clear: 'both' }}></div>
                </div>
                {errHint}
            </div>
        );
    }
}

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
        let { numberOfNewGroup } = this.props;
        let charttype = numberOfNewGroup === 1 ?
            ['条形图', '柱状图', '折线图', '', '环形图', '条形堆积图', '柱状堆积图'] :
            ['条形图', '柱状图', '折线图', '', '', '条形堆积图', '柱状堆积图'];
        let groupConditionName = group.col_desc;
        let groupConditionType = group.col_type;
        let groupCondValueId = group.format;
        let groupCondValueName = getNameById(groupCondValueId,
            Config.saleClues.dateType);
        let groupCondition = null;
        if (groupConditionType === 'datetime' || groupConditionType === 'date') {
            if (!groupCondValueId) groupCondValueId = 'month';
            if (!groupCondValueName) groupCondValueName = '月';
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
        let defaultChartType = charttype[group.plot_type - 1];
        return (
            <div className='group-item-page'>
                <div title={groupConditionName} className='rct-form-control text-overflow'>
                    {groupConditionName}
                </div>
                {groupCondition}
                <SelectWithHint
                    ref='drillCol'
                    name='drillCol'
                    defaultValue={defaultChartType}
                    data={charttype}
                    className='itemValue'
                    onChange={this.onSelectChange}
                    setdefault={true}
                />
                <span className='glyphicon glyphicon-trash drill del'
                    onClick={this.delCond}
                    title={Language.title.del}
                >
                </span>
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
                        ref='groupdrillCol'
                        name='groupdrillCol'
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
export default SelectListAdd;