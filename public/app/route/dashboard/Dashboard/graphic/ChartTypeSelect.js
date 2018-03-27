/*
图表类型选择
1. Dashboard 新建、编辑画布
2. 销售线索详情页-图表配置模态框
*/
import React, { Component } from 'react';

class ChartTypeSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartType: this.props.chartType || 1 // 图表类型: 1条形图，2柱状图，3折线图, 4二维表, 5环形图
        };
        this.changeChartType = this.changeChartType.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            chartType: nextProps.chartType
        });
    }
    // 获取组件数据
    getValue() {
        return this.state.chartType;
    }
    // 改变图表类型
    changeChartType(type) {
        if (type !== this.state.chartType) {
            if (this.props.onChangeType) {
                this.props.onChangeType(type);
            }
            this.setState({
                chartType: type
            });
        }
    }
    render() {

        // 折线图
        let lineSrc = this.state.chartType === 3
            ? './dist/images/line_chart_selected.png'
            : './dist/images/line_chart.png';
        // 条形图
        let barSrc = this.state.chartType === 1
            ? './dist/images/bar_chart_selected.png'
            : './dist/images/bar_chart.png';
        // 柱状图
        let columnSrc = this.state.chartType === 2
            ? './dist/images/column_diagram_selected.png'
            : './dist/images/column_diagram.png';
        let tableType = null;
        if (this.props.hasTableType) {
            tableType = (
                <div className={this.state.chartType === 4 ?
                    'chart tableType active' : 'chart tableType'}
                onClick={this.changeChartType.bind(this, 4)}
                title='表格'>
                </div>
            );
        }
        //环形图
        let RingDiagramSrc = this.state.chartType === 5
            ? './dist/images/Ringdiagramselected.svg'
            : './dist/images/Ringdiagram.svg';
        let RingDiagramDisableSrc = './dist/images/RingdiagramDisable.svg'; // 禁用环形图
        let RingDiagram = this.props.from === -1 ?
            <div
                className={this.state.chartType === 5 && this.props.groupsLength === 1 ? 'chart active' :
                    this.props.groupsLength <= 1 ? 'chart' : 'chart disable'}
                onClick={this.props.groupsLength > 1 ? null : this.changeChartType.bind(this, 5)}
                title={'环形图'}>
                {/* 环形图只有一个分组方式 超过一个方式时不可用  */}
                <img src={this.props.groupsLength > 1 ? RingDiagramDisableSrc : RingDiagramSrc} />
            </div> : null;

        // 条形堆积图
        let StripStackingGraphSrc = this.state.chartType === 6
            ? './dist/images/StripStackingGraphSelected.svg'
            : './dist/images/StripStackingGraph.svg';

        let StripStackingGraph = this.props.from === -1 ?
            <div
                className={this.state.chartType === 6 ? 'chart active' : 'chart'}
                onClick={this.changeChartType.bind(this, 6)}
                title='条形堆积图'>
                <img src={StripStackingGraphSrc} />
            </div> : null;
        // 柱状堆积图
        let ColumnarStackingDiagramSrc = this.state.chartType === 7
            ? './dist/images/ColumnarStackingDiagramSelected.svg'
            : './dist/images/ColumnarStackingDiagram.svg';

        let ColumnarStackingDiagram = this.props.from === -1 ?
            <div
                className={this.state.chartType === 7 ? 'chart active' : 'chart'}
                onClick={this.changeChartType.bind(this, 7)}
                title='柱状堆积图'>
                <img src={ColumnarStackingDiagramSrc} />
            </div> : null;
        return (
            <div className='line'>
                <div className='itemName'>
                    <span>图表显示</span>
                </div>
                <div className={this.state.chartType === 1 ? 'chart active' : 'chart'}
                    onClick={this.changeChartType.bind(this, 1)}
                    title='条形图'>
                    <img src={barSrc} />
                </div>
                <div className={this.state.chartType === 2 ? 'chart active' : 'chart'}
                    onClick={this.changeChartType.bind(this, 2)}
                    title='柱状图'>
                    <img src={columnSrc} />
                </div>
                <div className={this.state.chartType === 3 ? 'chart active' : 'chart'}
                    onClick={this.changeChartType.bind(this, 3)}
                    title='折线图'>
                    <img src={lineSrc} />
                </div>
                {/* 当前只有来自dashboard页面的操作能够展示环形图 柱状堆积图 条形堆积图 */}
                {RingDiagram}
                {StripStackingGraph}
                {ColumnarStackingDiagram}
                {tableType}
                <div style={{ clear: 'both' }}></div>
            </div>
        );
    }
}

ChartTypeSelect.propTypes = {
    chartType: React.PropTypes.number,
    hasTableType: React.PropTypes.bool, // 是否有 二维表 类型
    onChangeType: React.PropTypes.func,
    groupsLength: React.PropTypes.number,
    from: React.PropTypes.number, //操作来自什么页面
};

module.exports = ChartTypeSelect;
