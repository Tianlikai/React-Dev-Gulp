/*
  侧边--仪表盘列表管理
  1.管理员平台-->用户权限
  2.管理员平台-->应用-->数据权限
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Language from '../../../../../data/lang';
import Config from '../../../../../common/Config';

class DashboardGroupSide extends PureComponent {
    static propTypes = {
        isAdmin: PropTypes.bool, // 是否是管理员
        isFirstIn: PropTypes.bool, // 是否首次进入
        isSearchDispatch: PropTypes.bool, // 是否由搜索触发
        activeDashboard: PropTypes.object, // 选中的仪表盘
        dashboardList: PropTypes.array, // 仪表盘列表
        onEdit: PropTypes.func, // 编辑回调
        onDel: PropTypes.func, // 删除回调
        onShare: PropTypes.func, // 分享回调
    }
    constructor(props) {
        super(props);
        this.letters = Config.letters;
        this.state = {
            dashboardList: this.props.dashboardList,                 // 仪表盘列表
            activeDashboard: this.props.activeDashboard,    // 当前选中的仪表盘
            groups: this.props.groups,     // 仪表盘按照拼音首字母分组
            isAdmin: this.props.isAdmin,                    // 是否是管理员
        };
        this.onAdd = this.onAdd.bind(this);
        this.changeActiveDashboard = this.changeActiveDashboard.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.scrollToLetter = this.scrollToLetter.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            dashboardList: nextProps.dashboardList,
            activeDashboard: nextProps.activeDashboard,
            groups: nextProps.groups
        })
    }
    // 字母列表
    renderLetters(list, groups) {
        let self = this;
        let letters = list.map(function (item, index) {
            let ownProps = {
                className: 'letter'
            };
            if (groups[item.id].length > 0) {
                ownProps = {
                    className: 'letter active',
                    onClick: self.scrollToLetter.bind(null, item.id)
                };
            }
            return (
                <span {...ownProps}>
                    {item.name}
                </span>
            );
        });
        return (
            <div className='dashboard-letters-wrap'>{letters}</div>
        );
    }
    // 切换仪表盘
    changeActiveDashboard(item) {
        if (this.state.activeDashboard.id !== item.id) this.handleSelect(item);
    }
    // 选中仪表盘列表的某个角色,获取画布列表
    handleSelect(item) {
        let activeDashboard = this.state.activeDashboard;
        let shouldGet = true; // 是否要获取新成员列表
        if (activeDashboard) {
            if (item.id === activeDashboard.id) {
                shouldGet = false;
            }
        }
        if (shouldGet) {
            if (this.props.onChange) {
                this.props.onChange(item);
            }
        }
    }
    // 编辑
    onEdit = (item) => (e) => {
        e.stopPropagation();
        if (this.props.onEdit) this.props.onEdit(false, item);
    }
    // 添加
    onAdd() {
        if (this.props.onEdit) this.props.onEdit(true, null);
    }
    // 删除
    onDel = (item) => (e) => {
        e.stopPropagation();
        if (this.props.onDel) this.props.onDel(item);
    }
    // 分享
    onShare = (item) => (e) => {
        e.stopPropagation();
        if (this.props.onShare) this.props.onShare(item.id);
    }
    // 点击 26个英文字母时，移动滚动条到相应位置
    scrollToLetter(type) {
        let groupsWrap = this.refs.groupsWrap;
        if (groupsWrap) {
            let letter = 'group' + type;
            groupsWrap.scrollTop = this.refs[letter].offsetTop - groupsWrap.offsetTop;
        }
    }
    // 渲染列表
    renderGroup(activeId, letters, groups) {
        let self = this;
        let itemClass = 'roleList-item';
        let lettersWrap = letters.map(function (items, indexs) {
            if (groups[items.id].length > 0) {
                let data = groups[items.id];
                let letterWrap = data.map(function (item, index) {
                    if (activeId === item.id) {
                        itemClass = 'roleList-item selected';
                    } else {
                        itemClass = 'roleList-item';
                    }
                    // if (self.state.isAdmin)
                    // 暂时取消权限 对用户分享功能的限制
                    itemClass = itemClass + " roleList-item-isAdmin"
                    let ShareBtn = (
                        <span className="glyphicon glyphicon-share"
                            title={Language.title.share}
                            onClick={self.onShare(item)}>
                        </span>)
                    let toolMethod = (
                        <div className='btn-wrap'>
                            {/* {self.state.isAdmin ? ShareBtn : null} */}
                            {/*  暂时取消权限 对用户分享功能的限制 */}
                            {ShareBtn}
                            <span className="glyphicon glyphicon-pencil"
                                title={Language.title.edit}
                                onClick={self.onEdit(item)}></span>
                            <span className="glyphicon glyphicon-trash"
                                title={Language.title.del}
                                onClick={self.onDel(item)}></span>
                        </div>
                    )

                    return (
                        <div
                            className={itemClass} key={'group' + item.id}
                            onClick={self.changeActiveDashboard.bind(null, item)}
                            title={item.name}>
                            {item.beshared ? <img style={{ height: 12, width: 12 }} className='fromSharingDashboard' src="./dist/images/fromSharingDashboard.svg" /> : null}
                            {item.name}
                            {!item.beshared ? toolMethod : null}
                        </div>
                    );

                });
                return (
                    <div ref={'group' + items.id} className='group-wrap'>
                        <div className='group-by-name'>{items.name}</div>
                        {letterWrap}
                    </div>
                );
            }
            return null;
        });
        return (
            <div ref='groupsWrap' className='groups-wrap'>
                {lettersWrap}
            </div>
        );
    }
    render() {
        let groups = null;
        let letters = null;
        let noContent = null;

        if (!this.props.isFirstIn) {
            noContent = !this.props.isSearchDispatch ? (
                <div className='DashboardGroupSide-nocontent'>
                    <div className='DashboardGroupSide-nocontent-lead'><img src="./dist/images/navigation_CreateCanvas.svg" /></div>
                    <div className='DashboardGroupSide-nocontent-hint'>{"暂无仪表盘，您可点击列表右上角" + '\n' + "“+”创建仪表盘"}</div>
                </div>
            ) : <div className='DashboardGroupSide-nocontent'></div>;
        }

        if (this.state.dashboardList.length > 0) {
            groups = this.renderGroup(this.state.activeDashboard.id, this.letters, this.state.groups);
        }

        letters = this.renderLetters(this.letters, this.state.groups);
        return (
            <div ref='roleGroupSide' className={this.props.className}>
                <div ref='headerWrap' className='header-wrap'>
                    <div className='dashboard-title-wrap text-overflow'>
                        <span>仪表盘列表</span>
                        <span className='DashboardGroupSide-addDashboard'
                            title='添加仪表盘'
                            onClick={this.onAdd}
                        >
                        </span>
                    </div>
                    {letters}
                </div>
                {groups ? groups : noContent}
            </div>
        )
    }
}
export default DashboardGroupSide;