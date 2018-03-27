/**
 * Dashboard图表全屏显示
 */
import React, { PureComponent } from 'react';
import propTypes from 'prop-types';
import classnames from 'classnames';

import actions from '../../../../actions/actions';
import Config from '../../../../common/Config';
import DashboardStore from '../../../../stores/DashboardStore';

import ChartDetail from '../ChartDetail';
import { graphPageFactory } from '../graphic/Graphic';
import GraphWrap from '../GraphWrap';
import TableWrap from '../TableWrap';

const GraphicTableWrap = graphPageFactory(TableWrap);
const GraphicWrap = graphPageFactory(GraphWrap);

class FullScreen extends PureComponent {
    static propTypes = {
        className: propTypes.string,
        name: propTypes.string,
        isNumberShow: propTypes.oneOfType([
            propTypes.bool,
            propTypes.string,
        ]),
        data: propTypes.object,
        SwitchingData: propTypes.object,
        onFullScreen: propTypes.func
    }
    static defaultProps = {
        className: ''
    }
    constructor(props) {
        super(props);
        this.state = {
            isFullDetailShow: false
        };
    }
    /**
     * 全屏触发切换界面
     * 调用该中间函数
     * 作用：截获全屏触发详情页面事件
     * 全屏界面详情在本页面显示
     * @param {str} activePage 
     * @type {activePage等于Detail，详情显示在本页面}
     */
    onChangeActivePage = (activePage, data) => {
        if (activePage === 'Detail') { // 打开本界面详情页面
            this.setState({
                isFullDetailShow: true
            }, () => {
                let urlData = {
                    id: data.id,
                    page: 1,
                    size: Config.pageLimit1,
                    filter_key: data.filter_key,
                };
                let postData = {
                    condition: data.slicerCondition,
                    drill_values: data.drill_values,
                    filter_value: data.name,
                };
                actions.getChartDetailData({
                    urlData: urlData,
                    postData: postData,
                    fromPage: this.props.name
                });
            })
        } else {
            if (this.props.onChangeActivePage) this.props.onChangeActivePage(activePage, 'fromfull');
        }
    }
    /**
     * 获取详情成功
     * 滚动到详情的头部 
     */
    handleScrollToDetail = () => {
        let anchor = this.fullAnchor;
        anchor.scrollIntoView();
    }
    render() {
        let {
            SwitchingData,
            SwitchingData: {
                page,
                hasWrongDataSource,
                slicersValue, // 切片器数据
                chartData, // 图表数据 
                chartData: {
                    name,
                    plot_type: type,
                    sum,
                    total,
                    slicer,
                    condition,
                    app_id: app_Id,
                    ds_id: dsId,
                    id
                },
                activeDashboard, // 选中的activeDashboard
                dashboardList,
            },
            targetPage,
        } = this.props;
        let { ...other } = {
            id,
            page,
            app_Id,
            dsId,
            name,
            type,
            sum,
            total,
            slicer,
            condition,
            chartData,
            hasWrongDataSource,
            activeDashboard,
            slicersValue,
            dashboardList,
            targetPage,
        };
        let dashId = 'DashComponent' + chartData.id;
        let pageclass = classnames(
            'col-md-12',
        )
        return (
            <div ref='fullScreenPage' className='full-screen-page'>
                {
                    type !== 4 ?
                        <GraphicWrap
                            ref={`DashComponentFull${chartData.id}`}
                            key={`DashComponentFull${chartData.id}`}
                            dashId={dashId}
                            className={pageclass}
                            fromPage={'DashBoardManagement'}
                            useFrom={'dashboard'}
                            isLoading={1}
                            onChangeActivePage={this.onChangeActivePage}
                            { ...other }
                        />
                        :
                        <GraphicTableWrap
                            ref={`DashComponentFull${chartData.id}`}
                            key={`DashComponentFull${chartData.id}`}
                            dashId={dashId}
                            className={pageclass}
                            fromPage={'DashBoardManagement'}
                            useFrom={'dashboard'}
                            isLoading={1}
                            onChangeActivePage={this.onChangeActivePage}
                            { ...other }
                        />
                }
                <div
                    ref={(fullAnchor) => { this.fullAnchor = fullAnchor }}
                    style={{ clear: 'both' }}></div>
                {
                    this.state.isFullDetailShow ?
                        <ChartDetail
                            ref='ChartDetail'
                            name={this.props.name}
                            pageLimit={Config.pageLimit1}
                            showCondition={false}
                            onScrollToDetail={this.handleScrollToDetail}
                        /> : null
                }
            </div>
        );
    }
}
export default FullScreen;
