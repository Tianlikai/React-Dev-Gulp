import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import actions from '../../actions/actions';
import DashboardStore from "../../stores/DashboardStore";

import Dropdown from "../../components/Dropdown";

import Config from '../../config/config';
import Util from "../../common/Util";
import PageMethod from "../../common/PageMethod";

class GraphPage extends Component {

    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        chartData: ""
    }

    static defaultProps = {
        className: '',
        chartData: null,
        showNumber: false
    }

    constructor(props) {
        super(props);
        super(props);
        this.shouldUpdate = false; // 是否需要更新组件
        this.state = {
            active: true,
            isLoading: true, // 是否正在加载数据
            chartData: this.props.chartData,
            condition: [], // 筛选条件:数组类型，一行行的筛选条件
            constraintList: [], // 约束条件
            id: this.props.id, // 图表id
            name: '', // 图表名称
            type: 0, // 图表类型
            appId: this.props.appId, // 图表所属的应用id
            dsId: this.props.dsId,
            shared: this.props.shared,
            sum: '-', // 总计(图表类型才有)
            showNumber: this.props.showNumber // 是否在图上显示数值
        };
        this.onRefresh = this.onRefresh.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.onDel = this.onDel.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onShare = this.onShare.bind(this);
        this.onChartDbClick = this.onChartDbClick.bind(this);
        this.showDetailHintModal = this.showDetailHintModal.bind(this);
        this.onShowNumber = this.onShowNumber.bind(this);
        this.onFullScreen = this.onFullScreen.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    onRefresh() { }

    onFilter() { }

    onDel() { }

    onEdit() { }

    onShare() { }

    onChartDbClick() { }

    showDetailHintModal() { }

    onShowNumber() { }

    onFullScreen() { }

    handleResize() { }

    componentDidMount() {
        this.unsubscribe = DashboardStore.listen(this.pubsub, this);
    }
    shouldComponentUpdate() {
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    pubsub(type, data, from) {
        if (type === 'getDashChartDataSuccess') {

        } else if (type === 'getDashChartDataFail') {

        }
    }
    render() {
        let className = classnames(
            this.props.className,
            'dash-graphPage'
        );
        return (
            <div className={className}
                style={{ display: this.state.active ? 'block' : 'none' }}>
                <div className='content-wrap'>
                    {/* <DashboardChartTitle
                        name={this.state.name}
                        onRefresh={this.onRefresh}
                        onFilter={this.onFilter}
                        onEdit={this.onEdit}
                        onDel={this.onDel}
                        onShare={this.onShare}
                        fromPage={this.props.fromPage}
                        shared={this.state.shared}
                        fullScreen={this.props.fullScreen}
                        onFullScreen={this.onFullScreen}
                    />
                    <ConditionShow
                        sum={this.state.sum}
                        constraintList={this.state.constraintList}
                        screeningList={this.state.condition}
                    />
                    <div className='showNumber-wrap'>
                        <SwitchBtn open={this.state.showNumber} onChange={this.onShowNumber} />
                        <div className='titleName'>数据显示</div>
                    </div> */}
                    <div className='chart-wrap'
                        style={{ width: '100%', height: '466px' }}>
                        <GraphWrap
                            ref='scrollWrap'
                            data={this.state.chartData}
                            type={this.state.type}
                            onChartDbClick={this.onChartDbClick}
                            showDetailHintModal={this.showDetailHintModal}
                            showNumber={this.state.showNumber}
                            fromPage={this.props.fromPage}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

const countries = [
    { value: 'EN-gb', label: 'England' },
    { value: 'ES-es', label: 'Spain' },
    { value: 'TH-th', label: 'Thailand' },
    { value: 'EN-en', label: 'USA' }
];

class GraphWrap extends Component {
    constructor(props) {
        super(props);

    }
    state = { value: 'ES-es' };

    handleChange = (value) => {
        this.setState({ value: value });
    };
    render() {
        let theme = {
            active: "active",
            disabled: "disabled",
            dropdown: "dropdown",
            error: "error",
            errored: "errored",
            field: "field",
            label: "label",
            required: "required",
            selected: "selected",
            templateValue: "templateValue",
            up: "up",
            value: "value",
            values: "values",
        }
        return (
            <div className='dropWraper'>
                <Dropdown
                    onChange={this.handleChange}
                    source={countries}
                    value={this.state.value}
                    theme={theme}
                />
            </div>
        )
    }
}

export default GraphPage;