/*
筛选条件-每一行
*/
import React, { Component } from 'react';
const Reflux = require('reflux');
const Config = require('../../../../common/Config');
const removePopinfo = require('../../../../common/utils/removePopinfo');
const digitInput = require('../../../../common/utils/digitInput');
import Language from '../../../../data/lang';
const SelectWithHint = require('../../../../component/SelectWithHint');
const NewInput = require('../../../../component/Input');
const InputWithErrMsg = require('../../../../component/InputWithErrMsg');
const DateTimeWrap = require('../../../../component/DateTimeWrap');
const Multiselect = require('../../../../component/Multiselect');
import { FilterAreaItem } from './FilterAreaItem';
// import { FilterIndustryItem } from './FilterIndustryItem';

const UtilStore = require('../../../../stores/UtilStore');

class FilterItem extends Component {
    constructor(props) {
        super(props);
        this.timer == null;
        this.state = this.setDefaultState();
        this.onChangeModule2 = this.onChangeModule2.bind(this);
        this.onInputKeyDown2 = this.onInputKeyDown2.bind(this);
        this.onNumInputChange = this.onNumInputChange.bind(this);
        this.onInputKeyDown = this.onInputKeyDown.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.delCond = this.delCond.bind(this);
        this.onChangeModule1 = this.onChangeModule1.bind(this);
    }
    setDefaultState() {
        let data = this.props.data;
        let minInputValue = '';
        let maxInputValue = '';
        if (data) {
            // 不是51DESK区域 或 51DESK行业
            if (Config.saleClues.deskColName.indexOf(data.colName) < 0) {
                if (data.colType.indexOf('int') !== -1) {
                    let arr = data.condValue;
                    if (arr[0] === '0' || arr[0]) {
                        minInputValue = parseFloat(arr[0]);
                    }
                    if (arr[1] === '0' || arr[1]) {
                        maxInputValue = parseFloat(arr[1]);
                    }
                }
            }
        }
        return {
            cols: this.props.cols || [], // 配置页面配置的字段
            active: data ? data.active : true, // 该组件是否可用
            colName: data ? data.colName : '', // 字段
            colDesc: data ? data.colDesc : '', // 字段显示名称
            colType: data ? data.colType : '', // 字段的类型
            // 条件：include、exclude、between、notbetween、scope
            condId: data ? data.condId : '',
            condName: data ? data.condName : '', // 条件：包含、不包含、介于、不介于、绝对
            condValue: data ? data.condValue : '', // 条件的值
            minInputValue: minInputValue,
            maxInputValue: maxInputValue,
            multiSelectData: [] // 多选下拉框
        };
    }
    componentDidMount() {
        this.unsubscribe = UtilStore.listen(this.pubsub, this);
    }
    componentWillReceiveProps(nextProps) {

        if (this.state.active) {
            if (nextProps.zindex !== this.props.zindex) {
                let colType = this.state.colType;
                if (colType) {
                    if (colType.indexOf('int') === -1 && (colType !== 'datetime' || colType !== 'date')) {
                        // 不是51DESK区域 或 51DESK行业
                        if (Config.saleClues.deskColName.indexOf(this.state.colName) < 0) {
                            let condId = this.state.condId;
                            if (Config.dataPermission.isEqual.indexOf(condId) > -1) {
                                if (this.refs.module3) {
                                    let multiselectList = this.refs.module3.getSelectedData();
                                    let value = [];
                                    if (multiselectList.length > 0) {
                                        value = multiselectList;
                                    }
                                    this.setState({
                                        condValue: value
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
        if (this.state.colName === '') {
            if (nextProps.cols) {
                this.setState({
                    cols: nextProps.cols
                });
            }
        }
    }
    componentWillUnmount() {
        this.unsubscribe();
        this.timer == null;
    }
    pubsub(type, data, from) {
        if (type === 'getAppColValuesSuccess') {
            let fromPage = 'CorrelateSelect' + this.props.zindex;
            if (from === fromPage) {
                let multiselectList = this.refs.module3.getSelectedData();
                let value = '';
                if (multiselectList.length > 0) {
                    value = multiselectList;
                }
                this.setState({
                    condValue: value,
                    multiSelectData: data
                });
            }
        }
    }
    // 改变第一个模块(下拉框)
    onChangeModule1(item) {
        if (this.props.changeCol) {
            this.props.changeCol(item, 'del');
        }
        let condId = '';
        let condName = '';
        // 如果是51DESK区域 或者 51DESK行业
        if (Config.saleClues.deskColName.indexOf(item.id) > -1) {
            condId = Config.saleClues.deskCond[0].id;
            condName = Config.saleClues.deskCond[0].name;
        } else {
            if (item.type === 'datetime' || item.type === 'date') {
                condId = Config.saleClues.dateScope[0].id;
                condName = Config.saleClues.dateScope[0].name;
            } else if (item.type.indexOf('int') !== -1) {
                condId = Config.saleClues.isBetween[0].id;
                condName = Config.saleClues.isBetween[0].name;
            } else {
                condId = Config.saleClues.isInclude[0].id;
                condName = Config.saleClues.isInclude[0].name;
            }
        }
        this.setState({
            colName: item.id,
            colDesc: item.name,
            colType: item.type,
            condId: condId,
            condName: condName,
            condValue: '',
            minInputValue: '',
            maxInputValue: '',
            multiSelectData: []
        });
    }
    // 改变第二个模块(int,string类型才出发)
    onChangeModule2(from, item) {
        if (item.id !== this.state.condId) {
            let isUpdate = false;
            if (item.name !== '不等于' && item.name !== '等于') {
                removePopinfo('display:none');
            }
            if (!this.state.condId || from === 'datetime' || from === 'date') {
                isUpdate = true;
            } else {
                let list = Config.dataPermission.isEqual;
                // 如果 this.state.condId 不属于 '等于''不等于'
                if (list.indexOf(this.state.condId) === -1) {
                    // 如果 item.id 属于 '等于''不等于'
                    if (list.indexOf(item.id) > -1) {
                        isUpdate = true;
                    }
                } else { // 如果 this.state.condId 属于 '等于''不等于'
                    // 如果 item.id 不属于 '等于''不等于'
                    if (list.indexOf(item.id) === -1) {
                        isUpdate = true;
                    }
                }
            }
            if (isUpdate) {
                if (from === 'int') {
                    this.setState({
                        condId: item.id,
                        condName: item.name,
                        condValue: '',
                        minInputValue: '',
                        maxInputValue: ''
                    });
                } else if (from === 'string' || from === 'datetime' || from === 'date') {
                    this.setState({
                        condId: item.id,
                        condName: item.name,
                        condValue: ''
                    });
                }
            }
        }
    }
    // 第三个模块(string类型，选择等于、不等于时，多选下拉框第一次打开时)
    onToggle() {
        if (this.state.multiSelectData.length === 0) {
            if (this.props.onMultiselectSearch) {
                let oData = {
                    col_name: this.state.colName
                };
                this.props.onMultiselectSearch(oData);
            }
        }
    }
    // 第三个模块(string类型，选择等于、不等于时，多选下拉框搜索)
    handleSearch(name) {
        if (this.props.onMultiselectSearch) {
            let oData = {
                col_name: this.state.colName,
                query: name
            };
            if (this.timer == null) {
                this.timer = setTimeout(() => {
                    this.props.onMultiselectSearch(oData);
                }, 700);
            } else {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.props.onMultiselectSearch(oData);
                }, 700);
            }
        }
    }
    // 删除条件
    delCond() {
        if (this.props.changeCol) {
            let item = {
                id: this.state.colName,
                name: this.state.colDesc,
                type: this.state.colType
            };
            this.props.changeCol(item, 'add');
        }
        this.setState({
            active: false
        });
    }
    onInputKeyDown2(value, fromEvent) {
        digitInput(value, fromEvent);
    }
    // 最小值，最大值 的 onKeyDown
    onInputKeyDown(from, event) {
        let value = event.target.value;
        digitInput(value, event, 16);
    }
    // 最小值，最大值 的 onChange
    onInputChange(from, e) {
        let value = e.target.value;
        if (from === 'minInput') {
            this.setState({
                minInputValue: value
            });
        } else if (from === 'maxInput') {
            // this.refs.maxInput.value = value;
            this.setState({
                maxInputValue: value
            });
        }
    }
    // int数值类型，选择 等于、不等于时，value的变化
    onNumInputChange(value) {
        this.setState({
            condValue: value
        });
    }
    // 获取当前条件的值
    getValue() {
        let cond = null;
        // 如果当前组件不可用或者第一个筛选条件为空，则此组件没有值
        if (!this.state.active || !this.state.colName) {
            cond = {
                active: false
            };
        } else {
            let colName = this.state.colName;
            let colType = this.state.colType;
            let colDesc = this.state.colDesc;
            let condId = this.state.condId;
            if (colName === 'industry_id') {
                let industryEdit = this.refs.industryItem.getValue();
                if (industryEdit.id === '') {
                    cond = {
                        active: false
                    };
                } else {
                    cond = {
                        active: true,
                        condition: {
                            col_name: colName,
                            col_type: colType,
                            col_desc: colDesc,
                            cond: condId,
                            value: industryEdit
                        }
                    };
                }
            } else if (colName === 'area_ids') {
                let areaEdit = this.refs.areaItem.getValue();
                if (areaEdit.length === 0) {
                    cond = {
                        active: false
                    };
                } else {
                    cond = {
                        active: true,
                        condition: {
                            col_name: colName,
                            col_type: colType,
                            col_desc: colDesc,
                            cond: condId,
                            value: areaEdit
                        }
                    };
                }
            } else {
                let value = null;
                // 日期类型
                if (colType === 'datetime' || colType === 'date') {
                    if (condId === 'relative') {
                        let relativeTime = this.refs.module3.getSelectedId();
                        if (!relativeTime) {
                            cond = {
                                active: false
                            };
                        } else {
                            cond = {
                                active: true,
                                condition: {
                                    col_name: colName,
                                    col_type: colType,
                                    col_desc: colDesc,
                                    cond: condId,
                                    value: relativeTime
                                }
                            };
                        }
                    } else {
                        let bt = this.refs.startDateTime.getDateTime();
                        let et = this.refs.endDateTime.getDateTime();
                        if (!bt && !et) {
                            cond = {
                                active: false
                            };
                        } else {
                            let dateArr = [];
                            dateArr.push(bt);
                            dateArr.push(et);
                            cond = {
                                active: true,
                                condition: {
                                    col_name: colName,
                                    col_type: colType,
                                    col_desc: colDesc,
                                    cond: condId,
                                    value: dateArr.join(',')
                                }
                            };
                        }
                    }
                } else if (colType.indexOf('int') !== -1) {
                    condId = this.refs.module2.getSelectedId();
                    if (Config.dataPermission.isEqual.indexOf(condId) > -1) {
                        let numValue = this.refs.module3.getRawValue();
                        if (!numValue) {
                            cond = {
                                active: false
                            };
                        } else {
                            cond = {
                                active: true,
                                condition: {
                                    col_name: colName,
                                    col_type: colType,
                                    col_desc: colDesc,
                                    cond: condId,
                                    value: numValue
                                }
                            };
                        }
                    } else {
                        let minValue = this.refs.minInput.value;
                        let maxValue = this.refs.maxInput.value;
                        if (!minValue && !maxValue) {
                            cond = {
                                active: false
                            };
                        } else {
                            let inputArr = [];
                            inputArr.push(minValue);
                            inputArr.push(maxValue);
                            cond = {
                                active: true,
                                condition: {
                                    col_name: colName,
                                    col_type: colType,
                                    col_desc: colDesc,
                                    cond: condId,
                                    value: inputArr
                                    // value: inputArr.join(',')
                                }
                            };
                        }
                    }
                } else {
                    condId = this.refs.module2.getSelectedId();
                    if (Config.dataPermission.isEqual.indexOf(condId) > -1) {
                        let multiselectList = this.refs.module3.getSelectedData();
                        if (multiselectList.length === 0) {
                            cond = {
                                active: false
                            };
                        } else {
                            // value = multiselectList.join('>>');
                            value = multiselectList;
                            cond = {
                                active: true,
                                condition: {
                                    col_name: colName,
                                    col_type: colType,
                                    col_desc: colDesc,
                                    cond: condId,
                                    value: value
                                }
                            };
                        }
                    } else {
                        value = this.refs.module3.getRawValue();
                        if (value) {
                            cond = {
                                active: true,
                                condition: {
                                    col_name: colName,
                                    col_type: colType,
                                    col_desc: colDesc,
                                    cond: condId,
                                    value: value
                                }
                            };
                        } else {
                            cond = {
                                active: false
                            };
                        }
                    }
                }
            }
        }
        return cond;
    }
    // 删除按钮
    renderDelBtn(colName) {
        if (colName === '') {
            return null;
        }
        return (
            <span className='glyphicon glyphicon-trash del'
                onClick={this.delCond}
                title={Language.title.del}
            ></span>
        );
    }
    // 第一个小模块
    renderModule1(colName) {
        if (colName !== '') {
            return (
                <div className='colSelect-module1 rct-form-control' title={this.state.colDesc}>
                    {this.state.colDesc}
                </div>
            );
        }
        return (
            <SelectWithHint
                ref='module1'
                name='module1'
                data={this.state.cols}
                className='colSelect-module1'
                dataIsObject={true}
                onChange={this.onChangeModule1}
            />
        );
    }
    // 当字段类型为'datetime'时
    renderDateTimeWrap(arr) {
        return (
            <div className='dateTimeWrap condValue-module3'>
                <DateTimeWrap ref='startDateTime'
                    themeName='selfDateTimeWrap' // 自定义样式
                    defaultValue={arr[0] || ''}
                    style={{ zIndex: this.props.zindex }}
                />
                <div
                    style={{
                        verticalAlign: 'top',
                        height: 35,
                        lineHeight: '35px',
                    }}// 写死折现垂直居中对齐 
                >—</div>
                <DateTimeWrap ref='endDateTime'
                    themeName='selfDateTimeWrap' // 自定义样式
                    defaultValue={arr[1] || ''}
                    style={{ zIndex: this.props.zindex }}
                />
            </div>
        );
    }
    // module1, module2, module3
    renderContent(colName) {
        let condValue = this.state.condValue;
        if (colName === 'area_ids') {
            let areaIds = [];
            let areaNames = [];
            if (condValue !== '') {
                areaIds = condValue.areaIds;
                areaNames = condValue.areaNames;
            }
            return (
                <FilterAreaItem
                    ref='areaItem'
                    colDesc={this.state.colDesc}
                    condName={this.state.condName}
                    areaIds={areaIds}
                    areaNames={areaNames}
                />
            );
        }
        if (colName === 'industry_id') {
            let industryId = '';
            let industryName = '';
            let sgValues = {};
            let sgPageName = {};
            if (condValue !== '') {
                industryId = condValue.id;
                industryName = condValue.name;
                sgValues = condValue.sgValues;
                sgPageName = condValue.sgPageName;
            }
            return (
                <FilterIndustryItem
                    ref='industryItem'
                    colDesc={this.state.colDesc}
                    condName={this.state.condName}
                    industryId={industryId}
                    industryName={industryName}
                    sgValues={sgValues}
                    sgPageName={sgPageName}
                />
            );
        }
        let module1 = this.renderModule1(colName);
        let module2 = null;
        let module3 = null;
        let wrapClass = '';
        if (colName !== '') {
            wrapClass = 'module-wrap';
            let arr = condValue;
            let colType = this.state.colType;
            if (colType) {
                // 包含'int'即int类型
                if (colType.indexOf('int') !== -1) {
                    module2 = (
                        <SelectWithHint
                            ref='module2'
                            name='module2'
                            data={Config.saleClues.isBetween}
                            defaultId={this.state.condId}
                            defaultValue={this.state.condName}
                            className='cond-module2'
                            dataIsObject={true}
                            onChange={this.onChangeModule2.bind(this, 'int')}
                        />
                    );
                    if (Config.dataPermission.isEqual.indexOf(this.state.condId) > -1) {
                        module3 = (
                            <InputWithErrMsg
                                ref='module3'
                                className='condValue-module3'
                                defaultValue={condValue}
                                onKeyDown={this.onInputKeyDown2}
                                textLengthLimit={16}
                                placeholder='请输入数值'
                                validation={this.onNumInputChange}
                            />
                        );
                    } else {
                        let minInput = null;
                        let maxInput = null;
                        // 如果存在，转换成数字类型
                        if (arr[0] === '0' || arr[0]) {
                            minInput = (
                                <input ref='minInput'
                                    type='text'
                                    placeholder='最小值'
                                    value={this.state.minInputValue}
                                    onKeyDown={this.onInputKeyDown.bind(this, 'minInput')}
                                    onChange={this.onInputChange.bind(this, 'minInput')} />
                            );
                        } else {
                            minInput = (
                                <input ref='minInput'
                                    type='text'
                                    placeholder='最小值'
                                    onKeyDown={this.onInputKeyDown.bind(this, 'minInput')}
                                    onChange={this.onInputChange.bind(this, 'minInput')} />
                            );
                        }
                        if (arr[1] === '0' || arr[1]) {
                            maxInput = (
                                <input ref='maxInput'
                                    type='text'
                                    placeholder='最大值'
                                    value={this.state.maxInputValue}
                                    onKeyDown={this.onInputKeyDown.bind(this, 'maxInput')}
                                    onChange={this.onInputChange.bind(this, 'maxInput')} />
                            );
                        } else {
                            maxInput = (
                                <input ref='maxInput'
                                    type='text'
                                    placeholder='最大值'
                                    onKeyDown={this.onInputKeyDown.bind(this, 'maxInput')}
                                    onChange={this.onInputChange.bind(this, 'maxInput')} />
                            );
                        }
                        module3 = (
                            <div className='numberInput condValue-module3'>
                                {minInput}
                                <span>—</span>
                                {maxInput}
                            </div>
                        );
                    }
                } else if (colType === 'datetime' || colType === 'date') {
                    module2 = (
                        <SelectWithHint
                            ref='module2'
                            name='module2'
                            data={Config.saleClues.dateScope}
                            defaultId={this.state.condId}
                            defaultValue={this.state.condName}
                            className='cond-module2'
                            dataIsObject={true}
                            onChange={this.onChangeModule2.bind(this, 'datetime')}
                        />
                    );
                    if (this.state.condId === 'relative') {
                        module3 = (
                            <SelectWithHint
                                name='module3'
                                ref='module3'
                                className='condValue-module3'
                                data={Config.saleClues.relativeTime}
                                defaultId={condValue[0]}
                                defaultValue={getNameById(condValue[0],
                                    Config.saleClues.relativeTime)}
                                dataIsObject={true}
                            />
                        );
                    } else {
                        module3 = this.renderDateTimeWrap(arr);
                    }
                } else {
                    module2 = (
                        <SelectWithHint
                            ref='module2'
                            name='module2'
                            data={Config.saleClues.isInclude}
                            defaultId={this.state.condId}
                            defaultValue={this.state.condName}
                            className='cond-module2'
                            dataIsObject={true}
                            onChange={this.onChangeModule2.bind(this, 'string')}
                        />
                    );
                    if (Config.dataPermission.isEqual.indexOf(this.state.condId) > -1) {
                        let selectedData = [];
                        if (condValue !== '') {
                            selectedData = condValue;
                        }
                        module3 = (
                            <Multiselect
                                ref='module3'
                                supportDelInInputgroup={this.props.supportDelInInputgroup} // 支持在inputgroup中直接删除选中下拉框中的选项
                                hasPopInfo={this.props.hasPopInfo}
                                className='str-input condValue-module3'
                                hascheckAllShow={this.props.hascheckAllShow ? true : false}
                                dataIsObject={-1}
                                data={this.state.multiSelectData}
                                selectedData={selectedData}
                                hasSearch={1}
                                handleSearch={this.handleSearch}
                                onToggle={this.onToggle}
                                style={{ zIndex: this.props.zindex }}
                                zIndex={this.props.zindex}
                            />
                        );
                    } else {
                        module3 = (
                            <NewInput
                                ref='module3'
                                className='str-input condValue-module3'
                                placeholder={Language.text_hint.splitHint}
                                defaultValue={condValue}
                            />
                        );
                    }
                }
            }
        }
        return (
            <div className={wrapClass}>
                {module1}
                {module2}
                {module3}
            </div>
        );
    }
    render() {
        if (!this.state.active) {
            return null;
        }
        let colName = this.state.colName;
        let content = this.renderContent(colName);
        let delBtn = this.renderDelBtn(colName);
        return (
            <div className='correlate-select'
                style={{
                    display: this.state.active ? '' : 'none',
                    zIndex: this.props.zindex
                }}>
                {content}
                {delBtn}
            </div>
        );
    }
}
FilterItem.propTypes = {
    cols: React.PropTypes.array.isRequired, // 配置页面配置的字段
    data: React.PropTypes.object,
    zindex: React.PropTypes.number,
    hasPopInfo: React.PropTypes.bool, // 当Multiselect 下拉框超过500条数据是否有Pop提示信息
    supportDelInInputgroup: React.PropTypes.bool, // 支持在inputgroup中直接删除选中下拉框中的选项
};

module.exports = FilterItem;
