import React, { PureComponent } from 'react';
import RelayoutStore from '../../../stores/RelayoutStore';
import PageMethod from '../../../common/PageMethod';
import DashboardChartNull from './DashboardChartNull';
import REchart from './ReactEchart';
// import { getChartOpt } from '../../../echarts';
import getConfigAboutDetailList from '../../../common/utils/getConfigAboutDetailList';
import getConfigAboutDetailForRD from '../../../common/utils/getConfigAboutDetailForRD';
import getConfigAboutDetailTitle from '../../../common/utils/getConfigAboutDetailTitle';
import getColStackingDigConfigAboutDetailList1 from '../../../common/utils/getColStackingDigConfigAboutDetailList1';
import getColStackingDigConfigAboutDetailList2 from '../../../common/utils/getColStackingDigConfigAboutDetailList2';
import getColStackingDigConfigAboutDetailList3 from '../../../common/utils/getColStackingDigConfigAboutDetailList3';


class GraphWrap extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showNumber: this.props.showNumber,
            data: this.props.data
        };
        this.onChartDbClick = this.onChartDbClick.bind(this);
        this.onChartClick = this.onChartClick.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }
    componentDidMount() {
        this.unsubscribe = RelayoutStore.listen(this.pubsub, this);
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            showNumber: nextProps.showNumber,
            data: nextProps.data
        });
    }
    pubsub(type) {
        switch (type) {
            case 'resizeEchartsSuccess':
                this.handleResize();
                break;
            default:
                break;
        }
    }
    /**
     * 图表在 被隐藏时，如果浏览器窗口发生变化，则ReactEchart的handleResize函数执行时，
     * 会获取不到图表的 大小(width, height)，所以要在图表从隐藏变为显示时，重新绘制
     */
    handleResize() {
        if (this.refs.reactEchart) {
            this.refs.reactEchart.handleResize();
        }
    }
    onChartDbClick(params) {
        let chartData = this.state.data;
        if (!chartData) {
            return;
        }
        if (this.props.onOpenDetailPage) {
            let filterValue = []; // filter_value 改为数组
            filterValue.push(params.name);
            let type = this.props.type;
            let seriesData = []; // series 默认的数据
            let mainAxisName = ''; // 主轴的坐标轴名称
            let minorAxisName = ''; // 辅轴的坐标轴名称
            let dealType = null; // 所有图标类型双击后处理方式
            switch (type) {
                case 1:
                    dealType = chartData.groupNum > 1 ? 2 : 1; // 2 多个分组方式打开详情页 1 为直接打开详情页
                    seriesData = chartData.x;
                    mainAxisName = chartData.y_name;
                    minorAxisName = chartData.x_name;
                    break;
                case 2:
                    dealType = chartData.groupNum > 1 ? 2 : 1; // 2 多个分组方式打开详情页 1 为直接打开详情页
                    seriesData = chartData.y;
                    mainAxisName = chartData.x_name;
                    minorAxisName = chartData.y_name;
                    break;
                case 3:
                    dealType = chartData.groupNum > 1 ? 7 : 1; // 7 折线图多个分组方式 打开弹出框  1 为直接打开详情页
                    seriesData = chartData.y;
                    mainAxisName = chartData.x_name;
                    minorAxisName = chartData.y_name;
                    break;
                case 5:
                    dealType = Object.prototype.toString.call(params.value) == '[object Array]' ? 3 : 1; // 3 为环形图 其他类型 打开弹出框有百分比 1 为直接打开详情页
                    seriesData = chartData;
                    mainAxisName = chartData.x_name;
                    minorAxisName = chartData.y_name;
                    break;
                case 6:
                    dealType = chartData.groupNum > 1 ? 4 : 6; // 4 为条形堆积图和柱形堆积图 两个分组方式 打开弹出框有百分比 6 为条形堆积图 一个分组方式 打开弹出框有百分比
                    seriesData = chartData.x;
                    mainAxisName = chartData.y_name;
                    minorAxisName = chartData.x_name;
                    break;
                case 7:
                    dealType = chartData.groupNum > 1 ? 4 : 5; // 4 为条形堆积图和柱形堆积图 两个分组方式 打开弹出框有百分比 5 为柱形堆积图 一个分组方式 打开弹出框有百分比
                    seriesData = chartData.y;
                    mainAxisName = chartData.x_name;
                    minorAxisName = chartData.y_name;
                    break;
                default:
                    break;
            }
            switch (dealType) {
                case 1: // 为直接打开详情页
                    let postData = {
                        name: [params.name]
                    };
                    let newData = Object.assign({}, this.state.data);
                    postData.condition = newData.condition;
                    postData.filter_key = newData.filter_key;
                    if (this.props.onOpenDetailPage) this.props.onOpenDetailPage(postData);
                    break;
                case 2: // 2 多个分组方式打开详情页
                    let filterName = [params.name, params.seriesName];
                    let postData2 = {
                        name: filterName
                    };
                    if (this.props.onOpenDetailPage) this.props.onOpenDetailPage(postData2);
                    break;
                case 3: // 为环形图 其他类型 打开弹出框有百分比
                    this.refs.reactEchart.handleAction({
                        type: 'hideTip'
                    });
                    let data = getConfigAboutDetailForRD(params, chartData, mainAxisName, minorAxisName);
                    if (this.props.showDetailHintModal) this.props.showDetailHintModal(filterValue, data.title, data.list, dealType);
                    break;
                case 4: // 为条形堆积图和柱形堆积图 两个分组方式 打开弹出框有百分比
                    this.refs.reactEchart.handleAction({
                        type: 'hideTip'
                    });
                    let title1 = getConfigAboutDetailTitle(mainAxisName, params, minorAxisName, dealType);
                    title1.push('百分比'); // 加入百分比项
                    let count = 0;
                    seriesData.forEach(function (element) {
                        if (element[params.dataIndex] === '-') {
                            count += parseInt(0); // 累加总计
                        } else {
                            count += element[params.dataIndex]; // 累加总计
                        }
                    }, this);
                    let list1 = getColStackingDigConfigAboutDetailList2(chartData, seriesData, params, count); // 获取条形堆叠图两个分组方式 list
                    if (this.props.showDetailHintModal) this.props.showDetailHintModal(filterValue, title1, list1, dealType);
                    break;
                case 5: // 为柱型堆积图 一个分组方式 打开弹出框有百分比
                    this.refs.reactEchart.handleAction({
                        type: 'hideTip'
                    });
                    let title2 = getConfigAboutDetailTitle(mainAxisName, params, minorAxisName);
                    title2.push('百分比'); // 加入百分比项
                    let count2 = 0;
                    seriesData[0].forEach(function (element) {
                        if (element === '-') {
                            count2 += parseInt(0); // 累加总计
                        } else {
                            count2 += parseInt(element); // 累加总计
                        }
                    }, this);
                    let list2 = getColStackingDigConfigAboutDetailList1(chartData, seriesData, params, count2); // 获取条形堆叠图单个分组方式 list
                    if (this.props.showDetailHintModal) this.props.showDetailHintModal(filterValue, title2, list2, dealType);
                    break;
                case 6: // 为条形堆积图 一个分组方式 打开弹出框有百分比
                    this.refs.reactEchart.handleAction({
                        type: 'hideTip'
                    });
                    let title3 = getConfigAboutDetailTitle(mainAxisName, params, minorAxisName);
                    title3.push('百分比'); // 加入百分比项
                    let count3 = 0;
                    seriesData[0].forEach(function (element) {
                        if (element === '-') {
                            count3 += parseInt(0); // 累加总计
                        } else {
                            count3 += parseInt(element); // 累加总计
                        }
                    }, this);
                    let list3 = getColStackingDigConfigAboutDetailList3(chartData, seriesData, params, count3); // 获取柱形堆叠图单个分组方式 list
                    if (this.props.showDetailHintModal) this.props.showDetailHintModal(filterValue, title3, list3, dealType);
                    break;
                case 7: // 为打开弹出框无百分比
                    // 取消显示tooltip
                    this.refs.reactEchart.handleAction({
                        type: 'hideTip'
                    });
                    let title = getConfigAboutDetailTitle(mainAxisName, params, minorAxisName);
                    let list = getConfigAboutDetailList(chartData, seriesData, params);
                    if (this.props.showDetailHintModal) this.props.showDetailHintModal(filterValue, title, list, dealType);
                    break;
                default:
                    break;
            }
        }
    }
    onChartClick(params) {
        let { data: chartData } = this.state;
        let { name } = params;
        let { type, drillValues, drillCondDeep, navDeep, onChartClick } = this.props;
        // 数据为空
        // 没有添加下钻(有一层默认值)
        // 下钻到数据底部(最多四层下钻)
        // 此三种情况不能进行下钻 退出执行
        if (!chartData || drillCondDeep <= 1 || navDeep >= drillCondDeep - 1) return null;

        let filterValue = []; // filter_value 改为数组
        filterValue.push(name);
        let seriesData = []; // series 默认的数据
        let mainAxisName = ''; // 主轴的坐标轴名称
        let minorAxisName = ''; // 辅轴的坐标轴名称
        let dealType = null; // 所有图标类型单击后处理方式
        switch (type) {
            case 1:
            case 2:
            case 3:
                dealType = 'directOpen';
                break;
            case 5:
                if (Object.prototype.toString.call(params.value) === '[object Array]') {
                    dealType = 'OpenWithRingChartHint';
                    seriesData = chartData;
                    mainAxisName = chartData.x_name;
                    minorAxisName = chartData.y_name;
                } else {
                    dealType = 'directOpen';
                }
                break;
            case 6:
                if (chartData.groupNum === 1) {
                    dealType = 'OpenWithStripstackingHint';
                    seriesData = chartData.x;
                    mainAxisName = chartData.y_name;
                    minorAxisName = chartData.x_name;
                } else {
                    dealType = 'directOpen'
                };
                break;
            case 7:
                if (chartData.groupNum === 1) {
                    dealType = 'OpenWithColumnarPileHint';
                    seriesData = chartData.y;
                    mainAxisName = chartData.x_name;
                    minorAxisName = chartData.y_name;
                } else {
                    dealType = 'directOpen'
                };
                break;
            default:
                break;
        }
        switch (dealType) {
            case 'directOpen': {
                let drill_values = Object.assign([], drillValues);
                drill_values.push(name);
                if (onChartClick) onChartClick(drill_values);
                break;
            }
            case 'OpenWithRingChartHint': // 环形
                this.refs.reactEchart.handleAction({
                    type: 'hideTip'
                });
                let data = getConfigAboutDetailForRD(params, chartData, mainAxisName, minorAxisName);
                if (this.props.showDirllHintModal) this.props.showDirllHintModal(filterValue, data.title, data.list, drillValues);
                break;
            case 'OpenWithStripstackingHint': // 条形
                this.refs.reactEchart.handleAction({
                    type: 'hideTip'
                });
                let title3 = getConfigAboutDetailTitle(mainAxisName, params, minorAxisName);
                title3.push('百分比'); // 加入百分比项
                let count3 = 0;
                seriesData[0].forEach(function (element) {
                    if (element === '-') {
                        count3 += parseInt(0); // 累加总计
                    } else {
                        count3 += parseInt(element); // 累加总计
                    }
                }, this);
                let list3 = getColStackingDigConfigAboutDetailList3(chartData, seriesData, params, count3); // 获取柱形堆叠图单个分组方式 list
                if (this.props.showDirllHintModal) this.props.showDirllHintModal(filterValue, title3, list3, drillValues);
                break;
            case 'OpenWithColumnarPileHint': // 柱形
                this.refs.reactEchart.handleAction({
                    type: 'hideTip'
                });
                let title2 = getConfigAboutDetailTitle(mainAxisName, params, minorAxisName);
                title2.push('百分比'); // 加入百分比项
                let count2 = 0;
                seriesData[0].forEach(function (element) {
                    if (element === '-') {
                        count2 += parseInt(0); // 累加总计
                    } else {
                        count2 += parseInt(element); // 累加总计
                    }
                }, this);
                let list2 = getColStackingDigConfigAboutDetailList1(chartData, seriesData, params, count2); // 获取条形堆叠图单个分组方式 list
                if (this.props.showDirllHintModal) this.props.showDirllHintModal(filterValue, title2, list2, drillValues);
                break;
            default:
                break;
        }
    }
    formatterStr(value) {
        return value;
    }
    refresh(data) {
        this.setState({
            data: data
        })
    }
    renderContent(chartData, type) {

        // hasData 0 正常 ，1 没有数据，2 数据量过大，需要添加约束条件
        if (!chartData || chartData.hasData === 1 || chartData.hasData === 2) {
            let pageType = 1;
            if (chartData && chartData.hasData) {
                pageType = chartData.hasData;
            }
            return (
                <DashboardChartNull type={pageType} chartType={this.props.type} />
            );
        }
        let {
            domWidth,// 传入父元素的宽度   在后面算堆积图 坐标轴宽度时会用到
            drillCondDeep,
            navDeep
         } = this.props;
        // 能否下钻
        let WhetherTheTrip = drillCondDeep >= 1 && navDeep < drillCondDeep - 1 ? true : false;
        // let option;
        // let config = {
        //     type: type,
        //     options: {
        //         chartData,
        //         from: 'hasDetail',
        //         isShow: this.state.showNumber,
        //         domWidth,
        //         WhetherTheTrip
        //     }
        // }
        // option = getChartOpt(config);
        let option = PageMethod.getChartOption(type, chartData, 'hasDetail', this.state.showNumber, domWidth, WhetherTheTrip);
        if (!option.tooltip) { // 错误处理
            return (
                <DashboardChartNull type={chartData.hasData} chartType={this.props.type} />
            );
        }
        return (
            <REchart
                ref='reactEchart'
                option={option}
                notMerge={true}
                handleClick={this.onChartClick}
                handleDblClick={this.onChartDbClick}
                style={{ height: 466, width: '100%' }}
            />
        );
    }
    setShowNumber = (isShow) => {
        this.setState({
            showNumber: isShow
        })
    }
    getCanvasDatas = () => {
        return this.state.data
    }
    render() {
        return this.renderContent(this.state.data, this.props.type);
    }
}

GraphWrap.propTypes = {
    data: React.PropTypes.object.isRequired, // 图表数据
    type: React.PropTypes.number.isRequired, // 图表类型
    onChartDbClick: React.PropTypes.func, // 双击图表时触发
    showDetailHintModal: React.PropTypes.func, // 双击图表时触发,如果是多个分组方式
    // 祖先页面名称('CreatedByMe', 'FromSharing', 'FromSharing-FullScreen', 'CreatedByMe-FullScreen')
    fromPage: React.PropTypes.string,
    showNumber: React.PropTypes.bool.isRequired,
    domWidth: React.PropTypes.number, // 传入父元素的宽度   在后面算堆积图 坐标轴宽度时会用到
};
export default GraphWrap;