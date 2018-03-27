'use strict';

var React = require('react');
var classNames = require('classnames');
var Icon = require('../../component/form/Icon');
var NewIcon = require('../../component/Icon');

var Sidebaritem = React.createClass({
    propTypes: {
        collapsable: React.PropTypes.bool, // 是否有下级菜单
        icon: React.PropTypes.string,
        menutitle: React.PropTypes.string,
        menuLeftIcon: React.PropTypes.string,
        active: React.PropTypes.bool, // 是否处于默认激活状态
        imgsrc: React.PropTypes.string,
        newIcon: React.PropTypes.bool // 启用新版icon
    },
    handlerToggle: function (e) {
        e.preventDefault();
        if (this.props.children && this.props.children.length) {
            this.props.onSelect(this.props.curmenu, this.props.depth + '', e);
        } else {
            this.props.onRedirect(this.props.curmenu, e);
        }
    },
    render: function () {
        var collapseitems = null;
        var iconright = null;
        var itemClassName = 'treeview';
        var collapseClassName = 'collapse';
        var menuLeftIcon = 'menu-left';
        if (this.props.collapsable && this.props.active) {
            collapseClassName = 'collapse in';
            menuLeftIcon = 'menu-down';
            itemClassName = 'treeview active';
            collapseitems = (
                <ul className={classNames('treeview-menu', collapseClassName)}>
                    {this.props.children}
                </ul>
            );
        }
        if (this.props.collapsable) {
            iconright = (
                <Icon icon={menuLeftIcon} className='pull-right' />
            );
        } else {
            if (this.props.active) {
                itemClassName = 'treeview active current';
            }
        }
        var lefticon = null;
        if (this.props.imgsrc) {
            let imgsrc = this.props.imgsrc;
            if (this.props.active && this.props.activeImg) {
                imgsrc = this.props.activeImg;
            }
            lefticon = (
                <img src={imgsrc}
                    style={{ height: 16, position: 'relative' }} />
            );
        } else {
            if (this.props.newIcon) {
                lefticon = (<NewIcon className={this.props.icon} />);
            } else {
                lefticon = (<Icon icon={this.props.icon} />);
            }
        }
        return (
            <li className={itemClassName} onClick={this.handlerToggle}>
                <a>
                    {lefticon}
                    <div className='menu-title'>{this.props.menutitle}</div>
                    {iconright}
                </a>
                {collapseitems}
            </li>
        );
    }
});

module.exports = Sidebaritem;
