'use strict';

const React = require('react');
const ReactDOM = require('react-dom')
const Reflux = require('reflux');
const actions = require('../../actions/actions');
const deepClone = require('../../common/utils/deepClone');
const Sidebaritem = require('./Sidebaritem');

const AsideDataStore = require('../../stores/asideDataStore');
const UtilStore = require('../../stores/UtilStore');

const Aside = React.createClass({
    mixins: [
        Reflux.listenTo(UtilStore, 'pubsub')
    ],
    getInitialState: function () {
        return {
            apps: this.props.data || [],
            activePage: this.props.activePage
        };
    },
    componentWillReceiveProps: function (nextProps) {
        if (this.props.activePage !== nextProps.activePage) {
            this.setState({
                activePage: nextProps.activePage // 当前页面的 id
            });
        }
        this.setState({
            apps: nextProps.data
        });
    },
    pubsub: function (type, data) {
        if (type === 'updateHeight') {
            let pageContent = ReactDOM.findDOMNode(this.refs.sidebar);
            if (pageContent) {
                pageContent.style.height = this.getSidebarHeight() + 'px';
            }
        }
    },
    getSidebarHeight: function () {
        return window.innerHeight - 60;
    },
    redirectTo: function (item, e) { // 事件冒泡！！！！ --子菜单 事件
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onChange) {
            this.props.onChange(item);
        }
    },
    // 有子菜单的情况
    menuClick: function (curMenu, depth, e) { // 主菜单事件
        e.stopPropagation();
        if (!curMenu.collapsable) { // 没有子菜单
            var to = curMenu.to;
            var menu = to.split('/').slice(2).join('/');
            actions.updateAside(menu);
            this.props.onChangeTab(menu.split('/')[0]);
        } else {
            var deptharr = depth.split('-');
            var newdate = this.state.asidedata;
            var cloneobj = deepClone(newdate[deptharr[0]]);
            newdate = AsideDataStore.toggleData(depth, cloneobj);
            this.setState({
                asidedata: newdate
            });
        }
    },
    renderSidebars: function () {
        let flag = false;
        return this.state.apps.map(function (item, i) {
            if (this.state.activePage === item.id) {
                flag = true;
            } else {
                flag = false;
            }
            return (
                <Sidebaritem key={'sidebaritem_' + i}
                    menutitle={item.name}
                    onSelect={this.menuClick}
                    curmenu={item}
                    depth={i}
                    onRedirect={this.redirectTo}
                    imgsrc={item.imgsrc}
                    activeImg={item.activeImg}
                    active={flag}
                >
                </Sidebaritem>
            );
        }.bind(this));
    },
    render: function () {
        let sidebarHeight = this.getSidebarHeight();
        return (
            <div className='main-sidebar'>
                <div className='main-logo'></div>
                <ul
                    ref='sidebar'
                    className='sidebar-menu'
                    style={{ height: sidebarHeight }}>
                    {this.renderSidebars()}
                </ul>
            </div>
        );
    }
});
module.exports = Aside;
