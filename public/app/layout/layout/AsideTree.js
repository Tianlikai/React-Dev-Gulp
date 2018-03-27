/**
 * 左侧导航栏-组织树
 * changeLog： 状态维护交由AsideMiddleware处理
 * @author will
 */
'use strict';

import React, { Component } from 'react';
import AsideMiddleware from './AsideMiddleware';


class AsideTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        };
        this.handleSelect = this.handleSelect.bind(this);
    }
    /**
     * 只有组织结构发生变化才更新数据
     */
    componentWillReceiveProps(newProps) {
        if (newProps.data.length === 0 && this.props.data.length === 0) {
            return;
        }
        if (!AsideMiddleware.isEqual(this.props.data, newProps.data)) {
            this.setState({
                data: newProps.data
            });
        }
    }

    handleSelect(id, name, openStatus) {
        AsideMiddleware.setOpenStatus(id, openStatus);
        let data = AsideMiddleware.get();
        this.setState({
            data: data
        }, function () {
            if (id !== this.props.activeId) {
                this.props.handleSelect(id, name);
            }
        });
    }

    genItem(data, deepIndex = 1, open = false) {
        let tree = data.map(function (item, index) {
            let children = null;
            if (item.sub_dep && item.sub_dep.length > 0) {
                children = this.genItem(item.sub_dep, deepIndex + 1, item.open);
            }
            return (
                <Leaf item={item} key={index} left={deepIndex}
                    onSelect={this.handleSelect}>
                    {children}
                </Leaf>
            );
        }, this);
        return tree;
    }

    render() {
        let items = null;
        if (this.state.data.length > 0) {
            items = this.genItem(this.state.data);
        }
        return (
            <div className='main-sidebar'>
                <div className='main-logo'>
                    <img src='./dist/images/51DESK.png' />
                </div>
                <div className='sidebar-menu'>{items}</div>
            </div>
        );
    }
}

AsideTree.propTypes = {
    data: React.PropTypes.array.isRequired, // 组织树数据
    handleSelect: React.PropTypes.func.isRequired
};

AsideTree.defaultProps = {
    data: []
};

/**
 * 叶子节点
 */
class Leaf extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.item.open ? this.props.item.open : false,
            isActive: this.props.item.isActive ? this.props.item.isActive : false
        };
        this.handleOpen = this.handleOpen.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.item.isActive !== this.state.isActive ||
                newProps.item.open !== this.state.open) {
            this.setState({
                open: this.props.item.open,
                isActive: newProps.item.isActive
            });
        }
    }

    handleOpen() {
        if (this.props.onSelect) {
            this.props.onSelect(this.props.item.department_id,
                this.props.item.department_name,
                !this.state.open
            );
        }
    }
    render() {
        let className = this.props.item.isActive ? 'active item' : 'item';
        className = this.state.open ? className + ' open' : className;
        let style = { paddingLeft: this.props.left * 10 + 'px' };
        let display = this.state.open ? 'block' : 'none';
        var name = this.props.item.department_name === 'none' ?
            '未分配成员' : this.props.item.department_name;
        return (
            <div>
                <div className={className} style={style} onClick={this.handleOpen}>
                    <span className='arrow icon'></span>
                    <span className='frame icon'></span>
                    <span className='depName' title={name}>
                        {name}
                    </span>
                    <div style={{ clear: 'both' }}></div>
                </div>
                <div style={{ display: display }}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

Leaf.propTypes = {
    item: React.PropTypes.array, // 节点数据
    left: React.PropTypes.number, // 节点层级
    onSelect: React.PropTypes.func.isRequired
};

module.exports = AsideTree;
