/*
 * @Author: jason.tian 
 * @Date: 2017-12-12 10:19:03 
 * @Last Modified by: jason.tian
 * @Last Modified time: 2018-03-07 14:33:11
 * 表格和详情页面
 * 表格页面 属性代理HOC
 */
import React, { Component } from 'react';
import Config from '../../common/Config';

function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
}
const TablePageHoc = WrappedComponent => class HOC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data, // 列表数据
            columns: [],
            checkList: [],
            totalItems: 0,
            operation: [],
            taskId: this.props.taskId,
        }
    }
    static displayName = `HOC(${getDisplayName(WrappedComponent)})`;
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data != null) {
            this.setState({
                data: nextProps.data,
                totalItems: nextProps.total,
                taskId: nextProps.taskId,
            });
        }
    }
    checkAllToggle = itemId => e => {
        let checked = e.target.checked;
        let newCheckList = [];
        if (checked) {
            let { data } = this.state;
            data.forEach(function (element) {
                newCheckList.push(element.itemID);
            }, this);
        }
        this.setState({
            checkList: newCheckList
        })
    }
    checkToggle = itemId => e => {
        e.stopPropagation();
        let { checkList } = this.state;
        let i = checkList.indexOf(itemId);
        if (i < 0) {
            checkList.push(itemId);
        } else {
            checkList.splice(i, 1);
        }
        this.setState({
            checkList
        });
    }
    check = (itemId, item) => {
        if (itemId === 'th') {
            return {
                onClick: this.checkAllToggle(itemId),
            }
        } else if (itemId === 'tr') {
            if (item || item === '0') {
                return {
                    onClick: this.checkToggle(item),
                }
            } else {
                return null
            }
        } else {
            return {
                onClick: this.checkToggle(itemId),
            }
        }
    }
    // 清空表格中所有选中项
    clearAllCheck = () => {
        if (this.instanceComponent.CheckAll) this.instanceComponent.CheckAll.checked = false;
        this.setState({
            checkList: []
        })

    }
    // 设置页码
    setPaginationPage = page => {
        if (this.instanceComponent.pagination) this.instanceComponent.pagination.setIndex(page);
    }
    // 重置行业筛选
    resetDropdownList = () => {
        if (this.instanceComponent.dropdownList) this.instanceComponent.dropdownList.resetDropdownList();
    }
    render() {
        const props = {
            ...this.props,
            pageLimit: Config.pageLimit,
            data: this.state.data,
            checkList: this.state.checkList,
            totalItems: this.state.totalItems,
            check: this.check,
            taskId: this.state.taskId,
            setPaginationPage: this.setPaginationPage
        }
        return (<WrappedComponent
            ref={instanceComponent => this.instanceComponent = instanceComponent}
            {...props}
        />);
    }
}
export default TablePageHoc;