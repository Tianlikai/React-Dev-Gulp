import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import deepClone from '../common/utils/deepClone';
import isOverFlow from '../common/utils/isOverFlow';
import getOuterHeight from '../common/utils/getOuterHeight';
import withoutTransition from '../common/utils/withoutTransition';
import Events from './utils/Events';
import isNodeInTree from './utils/isNodeInTree';
import Button from '../jComponent/button/Button';
import FontIcon from '../jComponent/font_icon/FontIcon';
import InputGroup from './InputGroup';
import PopInfo from './PopInfo';

const Multiselect = React.createClass({
    propTypes: {
        active: React.PropTypes.bool,
        title: React.PropTypes.string,
        dataIsObject: React.PropTypes.number, // 下拉框选项是否是对象数组：-1不是，1是
        data: React.PropTypes.array, // 下拉框的选项
        hint: React.PropTypes.string, // 提示信息
        selectedData: React.PropTypes.array, // 选中的
        hasSearch: React.PropTypes.number, // 是否有 查询：-1没有，1有
        handleSearch: React.PropTypes.func, // 搜索框 搜索
        onToggle: React.PropTypes.func, // 打开下拉框
        hasPopInfo: React.PropTypes.bool, // 当下拉框选项超过500条是否有提示信息
        supportDelInInputgroup: React.PropTypes.bool // 支持在inputgroup中直接删除选中下拉框中的选项
    },
    setDefaultState: function () {
        return {
            active: false,
            dropup: false,
            data: this.props.data || [],
            selectedData: this.props.selectedData || []
        };
    },
    getDefaultProps: function () {
        return {
            dataIsObject: 1, // 下拉框的data是否是对象
            hasSearch: -1
        };
    },
    getInitialState: function () {
        return this.setDefaultState();
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.data) {
            this.setState({
                data: nextProps.data
            });
        }
        if (nextProps.selectedData) {
            this.setState({
                selectedData: nextProps.selectedData
            });
        }
    },
    componentWillUnmount: function () {
        this.unBindOuterHandlers();
    },
    bindOuterHandlers: function () {
        Events.on(document, 'click', this.handlerOuterClick);
    },
    unBindOuterHandlers: function () {
        Events.off(document, 'click', this.handlerOuterClick);
    },
    // 点击的位置--是否在组件内
    handlerOuterClick: function (e) {
        if (isNodeInTree(e.target, ReactDOM.findDOMNode(this))) {
            return false;
        }
        // 如果点击的地方不在组件内，则卸载document的click事件
        this.setDocumentClick(false);
        this.setState({
            active: false
        });
    },
    setDocumentClick: function (state) {
        if (state) {
            this.bindOuterHandlers();
        } else {
            this.unBindOuterHandlers();
        }
    },
    // 渲染 显示名称
    renderTitle: function () {
        let names = [];
        let selectedData = this.state.selectedData;
        if (this.props.dataIsObject === 1) {
            for (let i = 0, j = selectedData.length; i < j; i++) {
                names.push(selectedData[i].name);
            }
            return names.join('；');
        }
        return selectedData.join('；');
    },
    // 渲染 搜索框
    renderSearch: function () {
        let classes = classNames(
            { ' formEdit ': this.props.supportDelInInputgroup }
        );
        let searchWrap = (
            <div className='wrap-search'>
                <InputGroup
                    ref='searchInput'
                    className={classes}
                    placeholder='输入关键字'
                    handleEnterKeyEvent={this.handleSearch}
                />
            </div>
        );
        return searchWrap;
    },
    // 渲染 下拉框选项
    renderOptions: function (data) {
        let self = this;
        let flag = false;
        if (this.props.dataIsObject === 1) {
            return data.map(function (item, index) {
                flag = self.setCheckboxState(item.id);
                return (
                    <label key={'tbchecklist' + index}>
                        <input type='checkbox'
                            style={{ height: 13, width: 13 }} // 写死input大小 外部有控制input大小样式 此处不变
                            value={item.id}
                            checked={flag}
                            onClick={this.handleCheck.bind(this, item)} />
                        <span title={item.name}>{item.name}</span>
                    </label>
                );
            }.bind(this));
        }
        return data.map(function (item, index) {
            flag = self.setCheckboxState(item);
            return (
                <label key={'tbchecklist' + index}>
                    <input type='checkbox'
                        style={{ height: 13, width: 13 }} // 写死input大小 外部有控制input大小样式 此处不变
                        value={item}
                        checked={flag}
                        onClick={this.handleCheck.bind(this, item)} />
                    <span title={item}>{item}</span>
                </label>
            );
        }.bind(this));
    },
    renderHint: function () {
        let hint = null;
        let hintClass = 'hint err';
        if (this.props.hint) { // 判断props是否有hint
            if (this.props.hint === this.state.hint) {
                hintClass = 'hint';
            }
        } else {
            if (this.state.hint === '') {
                hintClass = 'hint';
            }
        }
        // props没有hint或者this.props.hint !== this.state.hint时，用err样式
        hint = (
            <div className={hintClass}>
                {this.state.hint}
            </div>
        );
        return hint;
    },
    reset: function () {
        this.setDocumentClick(false);
        let initState = {
            active: false,
            dropup: false,
            hint: this.props.hint || '',
            data: [],
            selectedData: []
        };
        this.setState(initState);
        this.handlerClear();
    },
    // 获取选中的数据
    getSelectedData: function () {
        return this.state.selectedData;
    },
    // 设置hint
    setHint: function (value) {
        this.setState({
            hint: value
        });
    },
    open: function () {
        if (!this.state.active) {
            var options = this.refs.options;
            var offset = getOuterHeight(options) + 5;
            var el = this.refs.container;
            var dropUp = isOverFlow(el, offset);

            withoutTransition(el, function () {
                this.setState({
                    dropup: dropUp
                });
            }.bind(this));

            this.setState({
                active: true
            });
            this.setDocumentClick(true);
        }
    },
    close: function () {
        this.setState({
            active: false
        });
        this.setDocumentClick(false);
    },
    toggleOpen: function (event) {
        event.stopPropagation();
        if (this.state.active) {
            this.close();
        } else {
            if (this.props.onToggle) {
                this.props.onToggle();
            }
            this.open();
        }
    },
    // 判断checkbox是否被选中
    setCheckboxState: function (id) {
        let flag = false;
        let checkList = this.state.selectedData;
        let j = checkList.length;
        if (this.props.dataIsObject === 1) {
            for (let i = 0; i < j; i++) {
                if (checkList[i].id === id + '') {
                    flag = true;
                    break;
                }
            }
        } else {
            for (let i = 0; i < j; i++) {
                if (checkList[i] === id + '') {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    },
    // 点击checkbox
    handleCheck: function (item, event) {
        event.stopPropagation();
        let checkList = deepClone(this.state.selectedData);
        if (item === '无') {
            item = '';
        }
        if (item === '所有') {
            checkList = checkList.splice(0, 1);
            checkList[0] = checkList[0] !== '所有' ? '所有' : '';
        } else {
            if (checkList[0] === '所有') {
                checkList.shift();
            }
            let j = checkList.length;
            let removeIndex = ''; // 点击的item与checkList重复的位置
            if (this.props.dataIsObject === 1) {
                for (let i = 0; i < j; i++) {
                    if (checkList[i].id === item.id) {
                        removeIndex = i;
                        break;
                    }
                }
            } else {
                for (let i = 0; i < j; i++) {
                    if (checkList[i] === item + '') {
                        removeIndex = i;
                        break;
                    }
                }
            }
            if (removeIndex !== '') {
                checkList.splice(removeIndex, 1);
            } else {
                if (this.props.dataIsObject === 1) {
                    checkList.push(item);
                } else {
                    checkList.push(item + '');
                }
            }
        }
        if (this.props.hasPopInfo && checkList.length >= 500) {
            PopInfo.showinfo('由于数据量过大，全选只能选择当前页面已拉取出的数据。建议您使用“不等于”进行操作', 'warning', true, null, 10000, '21%', '20%', 'selectInfo');
        }
        this.setState({
            selectedData: checkList
        });
    },
    // 搜索框 搜索
    handleSearch: function (value) {
        let { selectedData } = this.state;
        if (this.props.handleSearch) {
            this.props.handleSearch(value, selectedData);
        }
    },
    // 选中当前显示的所有checkbox的状态
    handlerCheckAll() {
        let oldSelectedData = Object.assign([], this.state.selectedData);
        let insertData = Object.assign([], this.state.data);
        let newSelectedData = insertData.concat(oldSelectedData);
        if (this.props.hasPopInfo && newSelectedData.length >= 500) {
            PopInfo.showinfo('由于数据量过大，全选只能选择当前页面已拉取出的数据。建议您使用“不等于”进行操作', 'warning', true, null, 10000, '21%', '20%', 'selectInfo');
        }
        this.setState({
            selectedData: newSelectedData
        });
    },
    // 清空当前显示的所有checkbox的状态
    handlerClearAll() {
        let oldSelectedData = Object.assign([], this.state.selectedData);
        let removeData = Object.assign([], this.state.data);
        removeData.forEach(function (value, index) {
            let flag = oldSelectedData.indexOf(value);
            if (flag > -1) {
                oldSelectedData.splice(flag, 1);
            }
        });
        this.setState({
            selectedData: oldSelectedData
        });
    },
    // 清空checkbox的状态，包含显示的和未显示的
    handlerClear: function () {
        let dropdown = this.refs.dropdown;
        let checkboxArray = dropdown.getElementsByTagName('input');
        if (this.props.fromSelectGroup) { // 如果来自切片器下拉框
            for (let i = 1, j = checkboxArray.length; i < j; i++) {
                checkboxArray[i].checked = false;
            }
            this.setState({
                selectedData: ['所有']
            });
        } else {
            for (let i = 0, j = checkboxArray.length; i < j; i++) {
                checkboxArray[i].checked = false;
            }
            this.setState({
                selectedData: []
            });
        }
    },
    // 提交
    handleConfirm: function () {
        if (this.props.handleConfirm) {
            let value = this.state.selectedData;
            if (value.length === 1 || value.length === 0) {
                if (value.length === 0) {
                    this.setState({
                        selectedData: ['所有']
                    });
                    value[0] = '所有';
                }
            }
            this.props.handleConfirm(value);
        }
        this.close();
    },
    /**
     * 渲染 可删除选中项列表
     */
    renderSelectItemWithDel: function (item, idx) {
        const defaultValue = '无';
        let value = !item || item === '' ? defaultValue : item;
        return (
            <div
                className={'SelectItemWithDel'}
                key={`SelectItemWithDel${idx}`}
                title={value}>
                <label className='SelectItemWithDel-labelName'>{value}</label>
                <FontIcon
                    onClick={this.handleCheck.bind(this, value)}
                    className='delSelectItem' />
            </div>
        );
    },
    render: function () {
        let options = null; // 选项
        let searchWrap = null;
        if (this.props.hasSearch === 1) {
            searchWrap = this.renderSearch();
        }
        let data = this.state.data;
        if (data.length > 0) {
            options = this.renderOptions(data);
        }
        let classname = classNames(
            this.props.className,
            'rct-form-control',
            'rct-select',
            'single',
            {
                'rct-form-control-top': this.props.supportDelInInputgroup && !this.props.supportDelInInputgroupWidth, // 支持在inputgroup中直接删除选中下拉框中的选项
                'rct-form-control-middle': this.props.supportDelInInputgroupWidth,
                supportDelInInputgroupWidth: this.props.supportDelInInputgroupWidth, // 管理员页面width特定义
                supportDelInInputgroup: this.props.supportDelInInputgroup,
                active: this.state.active, // 当this.state.active为true时会把active属性加到class上
                dropup: this.state.dropup
            }
        );
        let classesContainer = classNames(
            'multiselect',
            this.props.className
        );
        let thdropbox = classNames(
            'thdropbox',
            this.props.className
        );

        let checkAllShow = false;
        if (this.props.hascheckAllShow && this.state.selectedData.length > 0) {
            let flag = this.state.selectedData.findIndex(function (item, index, arr) {
                return this.state.data.indexOf(item) > -1;
            }.bind(this));
            checkAllShow = flag > -1 ? true : false;
        }
        let strs = this.renderTitle();
        let names = strs.charAt(0) === '；' ? strs.substring(1) : strs;
        return (
            <div className={classesContainer} style={this.props.style}>
                <div ref='container'
                    style={{ position: 'relative' }}>
                    {this.props.title ? <span>{this.props.title}</span> : null}
                    {this.props.supportDelInInputgroup ?
                        <div
                            className={classname}>
                            <div className='titleName'>
                                {this.state.selectedData.map(this.renderSelectItemWithDel)}
                            </div>
                            <div className='multiselect-toggle-btn' onClick={this.toggleOpen}>
                                <span className='smallTrangle' ></span>
                            </div>
                        </div>
                        :
                        <div onClick={this.toggleOpen}
                            className={classname}>
                            <div className='titleName' title={names}>
                                {names}
                            </div>
                        </div>
                    }
                    <div className={thdropbox}
                        ref='options'
                        style={this.state.active ? { display: 'block', zIndex: this.props.zIndex } : { display: 'none' }}>

                        {searchWrap}
                        <div ref='dropdown' className='thdropboxContent' >
                            {options}
                        </div>

                        <div className='thdropboxFooter'>
                            {this.props.hascheckAllShow ?
                                checkAllShow ?
                                    <Button float='left' onClick={this.handlerClearAll}>全不选</Button> :
                                    <Button float='left' onClick={this.handlerCheckAll}>全选</Button>
                                : null}
                            <Button
                                className='cancel'
                                onClick={this.handlerClear}>清除</Button>
                            <Button
                                className='confirm'
                                type='primary'
                                onClick={this.handleConfirm}>确定</Button>
                        </div>

                    </div>
                </div>
                {this.renderHint()}
            </div>
        );
    }
});

module.exports = Multiselect;
