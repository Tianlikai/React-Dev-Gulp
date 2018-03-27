/*
Dashboard页面：TablePage和GraphPage两种图表类型的titleDiv
*/
import React, { Component } from 'react';
import Language from '../../../../data/lang';
import PageMethod from '../../../../common/PageMethod';
import DropTools from '../../Dashboard/graphic/DropTools';
import { dataPermission } from '../../../../common/Config';

class DashboardChartTitle extends Component {
    constructor(props) {
        super(props);
        this.renderDropTools = this.renderDropTools.bind(this);
        this.state = {
            chartData: this.props.chartData,
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            chartData: nextProps.chartData,
        })
    }
    setHasData = (data) => {
        this.setState(
            {
                chartData: data
            }
        )
    }
    renderDropTools(sourceItem, theme) {
        return (
            <div className="dropdown_wrap_dashboard">
                <DropTools
                    id={this.props.id}
                    name={this.props.name}
                    source={sourceItem}
                    theme={theme}
                    onEdit={this.props.onEdit}
                    onShare={this.props.onShare}
                    onDel={this.props.onDel}
                    onCopyTo={this.props.onCopyTo}
                    onMoveTo={this.props.onMoveTo}
                    onSliceUp={this.props.onSliceUp}
                    onHint={this.props.onHint}
                    onDrill={this.props.onDrill}
                    chartData={this.state.chartData}
                    slicer={this.props.slicer}
                    drillValues={this.props.drillValues}
                    slicersValue={this.props.slicersValue}
                    chartType={this.props.chartType}
                    getCanvasDatasNew={this.props.getCanvasDatasNew}
                />
            </div>
        )
    }
    /**
     * 切换界面
     */
    onChangeActivePage = () => {
        let { onChangeActivePage, targetPage } = this.props;
        let { chartData, activeDashboard, slicersValue, dashboardList, page, hasWrongDataSource } = this.props;
        let SwitchingData = { chartData, activeDashboard, slicersValue, dashboardList, page, hasWrongDataSource };
        if (onChangeActivePage) onChangeActivePage(targetPage, SwitchingData);
    }
    /**
     * 彻底刷新画布
     */
    onRefresh = () => {
        if (this.props.onRefresh) {
            if (this.props.targetPage === 'Main') {
                this.props.onRefresh('CompletelyRefreshAndSync');
            } else {
                this.props.onRefresh('CompletelyRefresh');
            }
        }
    }
    render() {
        let { chartData } = this.state;
        let {
            name, // 画布名称
            targetPage, // 是否全屏 targetPage等于"fullScreen"为全屏
            fromPage, // fromPage标识
            activeDashboard, // 选中的仪表盘
            chartType, // 画布类型
            onEdit, // 触发 编辑画布
            canItBeEditedAndSliceUp, // 能否编辑、切片
            hasWrongDataSource
        } = this.props;
        let { conditionObj: condPermission } = dataPermission;
        let fullScreen = targetPage === 'Main' ? true : false; // 是否全屏
        let condition = chartData ? chartData.condition : [];

        let conditionsHint = `过滤器：未设置`;
        if (condition.length > 0) {
            let hintStr = '';
            condition.forEach((ele) => {
                let eleValue = ele.value;
                if (Object.prototype.toString.call(eleValue).slice(8, -1) === 'Array') eleValue = eleValue.join(',')
                hintStr += `${ele.col_desc} ${condPermission[ele.cond]} ${eleValue}；`
            }, this);
            conditionsHint = `过滤器：${hintStr}`;
        }

        let DropTools = null;
        let fullScreenSrc = fullScreen ?
            './dist/images/full_screen_cancel.svg' : './dist/images/full_screen.svg';
        let fullScreenTitle = fullScreen ?
            Language.title.fullScreenCancel : Language.title.fullScreen;

        let theme = {
            active: "active",
            disabled: "disabled",
            dropdown: "dropdown",
            label: "label",
            selected: "selected",
        }
        let sourceItem = [];
        if (fromPage === 'DashBoardManagement' && !activeDashboard.beshared && !fullScreen) {
            // sourceItem.push({ src: './dist/images/moreTools_edit.svg', label: '编辑画布', type: 1 });
            // if (PageMethod.isAdminUser()) {
            //     sourceItem.push({ src: './dist/images/moreTools_share.svg', label: '分享画布', type: 2 });
            // }
            if (canItBeEditedAndSliceUp) { // 能否切片
                sourceItem.push({ src: './dist/images/moreTools_sliceup.svg', label: '切片器', type: 7 });
            }
            if (chartData && chartType !== 4) { // 始终能下钻
                sourceItem.push({ src: './dist/images/artboard.svg', label: '下钻', type: 9 });
            }
            if (chartData && (chartData.hasData === 0 || chartData.hasData === 3) && chartType !== 4) {
                sourceItem.push({ src: '/dist/images/moreTools_outDashboard.svg', label: '导出为图片', type: 3 });
                sourceItem.push({ src: '/dist/images/exportToExcel.png', label: '导出为Excel', type: 8 });
            }
            sourceItem.push({ src: './dist/images/moreTools_copyto.svg', label: '复制到', type: 5 });
            sourceItem.push({ src: './dist/images/moreTools_moveto.svg', label: '移动到', type: 6 });
            sourceItem.push({ src: './dist/images/moreTools_del.svg', label: '删除画布', type: 4 });
            DropTools = this.renderDropTools(sourceItem, theme);
        }
        // console.log(this.props, 'propsTitle');
        let classes = hasWrongDataSource ? `titleDiv-pointerNone titleDiv` : 'titleDiv';
        return (
            <div
                className={classes}>
                <div title={conditionsHint} className='titleName'>
                    {name}
                </div>
                <div className='btnGroup'>
                    <div title={Language.title.refresh} onClick={this.onRefresh}>
                        <img src='./dist/images/refresh.svg' className='img-responsive' />
                    </div>
                    {
                        !activeDashboard.beshared && canItBeEditedAndSliceUp && !fullScreen ? // 全屏时不允许操作编辑器
                            <div title={Language.title.edit} onClick={onEdit}>
                                <img src='./dist/images/dashboard_title_edit.svg' className='img-responsive' />
                            </div>
                            : null
                    }
                    <div title={fullScreenTitle} onClick={this.onChangeActivePage}>
                        <img src={fullScreenSrc} className='img-responsive' />
                    </div>
                    {DropTools}
                </div>
            </div>
        );
    }
}
DashboardChartTitle.propTypes = {
    onHint: React.PropTypes.func,
    activeDashboard: React.PropTypes.object,
    id: React.PropTypes.number, // 图表id
    type: React.PropTypes.number, // 图表类型
    chartData: React.PropTypes.object, // 是否能够导出   为0时能导出 其他不能
    name: React.PropTypes.string.isRequired, // 图表名称
    onRefresh: React.PropTypes.func, // 刷新
    onFilter: React.PropTypes.func, // 筛选
    onEdit: React.PropTypes.func, // 编辑
    onDel: React.PropTypes.func, // 删除
    onShare: React.PropTypes.func, // 分享
    onCopyTo: React.PropTypes.func, // 复制到
    onMoveTo: React.PropTypes.func, // 移动到
    fullScreen: React.PropTypes.bool, // 是否是全屏 true全屏 false不是全屏
    onChangeActivePage: React.PropTypes.func, // 全屏
    // 祖先页面名称('CreatedByMe', 'FromSharing', 'FromSharing-FullScreen', 'CreatedByMe-FullScreen')
    fromPage: React.PropTypes.string,
    chartType: React.PropTypes.number,
    getCanvasDatasNew: React.PropTypes.func, // 获取画布最新的数据
    canItBeEditedAndSliceUp: React.PropTypes.bool, // 能否编辑和切片
};
DashboardChartTitle.defaultProps = {
    fullScreen: false
};
module.exports = DashboardChartTitle;
