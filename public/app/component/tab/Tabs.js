'use strict';

import React, { Component, PropTypes, Children, isValidElement } from 'react';

var SystemValue = require('../../data/SystemValue');

class Tabs extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = { selectedIndex: props.initialSelectedIndex };
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.initialSelectedIndex !== nextProps.initialSelectedIndex) {
            this.setState({
                selectedIndex: nextProps.initialSelectedIndex
            });
        }
    }
    // 获得Tabs组件下的子组件
    getTabs(activeIndex) {
        let self = this;
        let content = null;
        let contents = Children.map(this.props.children, (element, index) => {
            if (isValidElement(element)) {
                content = (
                    <div
                        className={self.getContentItemClasses(element.props.name, activeIndex)}>
                        {element}
                    </div>
                );
            } else {
                content = null;
            }
            return content;
        });
        return contents;
    }
    // 设置标题的样式
    getTitleItemClasses(index, currentIndex) {
        return index === currentIndex ? 'tab-title-item active' : 'tab-title-item';
    }
    // 设置内容的样式
    getContentItemClasses(index, currentIndex) {
        return index === currentIndex ? 'tab-content-item active' : 'tab-content-item';
    }
    // Tab标签的name
    getNames(props = this.props) {
        let names = [];
        Children.forEach(props.children, (tab) => {
            if (isValidElement(tab)) {
                names.push(tab.props.name);
            }
        });
        return names;
    }
    // 点击tabsParents的close按钮时，关闭tab
    closeTab(tab, event) {
        event.stopPropagation();
        this.props.onCloseTab(tab);
    }
    // Tab标签
    genLabels(activeIndex) {
        let names = this.getNames();
        let self = this;
        let showName = null;
        let labels = null;
        if (this.props.isTabParent) {
            labels = names.map((name, index) => {
                showName = self.getTitle(name);
                return (
                    <li key={'label' + index}
                        className={self.getTitleItemClasses(name, activeIndex)}
                        onClick={self.handleTabClick.bind(this, name)}>
                        <div>{showName}</div>
                        <span
                            onClick={self.closeTab.bind(this, name)}
                            className='tabClose'
                            style={{ display: names.length > 1 ? 'inline-block' : 'none' }}>
                        </span>
                    </li>
                );
            }, this);
        } else {
            labels = names.map((name, index) => {
                showName = self.getTitle(name);
                return (
                    <li key={'label' + index}
                        className={self.getTitleItemClasses(name, activeIndex)}
                        onClick={self.handleTabClick.bind(this, name)}>
                        <div>{showName}</div>
                    </li>
                );
            }, this);
        }
        return labels;
    }
    // 获得标签页的显示名称
    getTitle(title) {
        return SystemValue.menutip[title];
    }

    handleTabClick(index) {
        if (index === this.state.selectedIndex) {
            return;
        }
        if (this.props.onChange) {
            this.props.onChange(index);
        }
    }

    render() {
        let helpUrl = null;
        if (this.props.helpUrl) {
            helpUrl = (<ul className='help'><li><a target='_blank' href={this.props.helpUrl} >使用帮助</a></li></ul>);
        }
        return (
            <div className={this.props.className} style={this.props.style}>
                <div className='tab_labels'>
                    <ul>
                        {this.genLabels(this.state.selectedIndex)}
                    </ul>
                    {helpUrl}
                </div>
                <div className='tab_content'>
                    {this.getTabs(this.state.selectedIndex)}
                </div>
            </div>
        );
    }
}

Tabs.propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
    className: PropTypes.string,
    defaultClass: PropTypes.string,
    activeClass: PropTypes.string,
    onChange: PropTypes.func,
    initialSelectedIndex: PropTypes.string
};
Tabs.defaultProps = {
    initialSelectedIndex: '',
    onChange: () => { }
};

module.exports = Tabs;
