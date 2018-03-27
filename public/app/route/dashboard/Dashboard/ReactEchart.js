var React = require('react');
const ReactDOM = require('react-dom');
const Reflux = require('reflux');
var Echarts = require('echarts');
const UtilStore = require('../../../stores/UtilStore');


var EChartsObj = React.createClass({
    /**
     * option: 图表的配置项和数据
     * notMerge: 可选，是否不跟之前设置的option进行合并，默认为false，即合并
     * notRefreshImmediately: 可选，在设置完option后是否不立即刷新画布，默认为false，即立即刷新
     * style: 图表容器的样式,默认高宽100%
     * config: 设置
     *    theme: 主题
     *    event: 事件
     *    showLoading: 是否呈现加载效果
     *    loadingOption: 加载效果设置
     * id: 图表id,可选
     * map: 是否是地图，默认为false，只有开启此项，地图才会正常渲染
     * mapName: 地图名称
     * mapLoad: 地图数据加载方法,需要执行回调方法，将地图json传进来，并需实现结果的缓存
     */
    propTypes: {
        option: React.PropTypes.object.isRequired,
        notMerge: React.PropTypes.bool,
        notRefreshImmediately: React.PropTypes.bool,
        style: React.PropTypes.object,
        config: React.PropTypes.object,
        id: React.PropTypes.string,
        map: React.PropTypes.bool,
        mapName: React.PropTypes.string,
        mapLoad: React.PropTypes.func,
    },
    mixins: [
        Reflux.listenTo(UtilStore, 'pubsub')
    ],
    getDefaultProps: function () {
        return {
            option: {},
            config: {},
            notMerge: false,
            notRefreshImmediately: false,
            style: {
                width: '100%',
                height: '100%'
            },
            id: 'chart',
            map: false
        };
    },
    getInitialState: function () {
        return {
            needInit: false, // 是否需要初始化,第一次创建或者主题发生变化需要init
        };
    },
    componentDidMount: function () {
        window.addEventListener('resize', this.handleResize);
        if (this.props.map) {
            this.registMap();
        } else {
            this.renderChart();
        }
    },
    componentDidUpdate: function () {
        if (this.props.map) {
            this.registMap();
        } else {
            this.renderChart();
        }
    },
    componentWillReceiveProps: function (nextProps) {
        // 如果主题切换,需要重新创建实例,因为ECharts的主题设置api在init中,
        if (this.props.config.theme !== nextProps.config.theme) {
            this.setState({ needInit: true });
        }
    },
    componentWillUnmount: function () {
        Echarts.dispose(this.refs[this.props.id]);
        window.removeEventListener('resize', this.handleResize);
    },
    getbaseUrl: function () {
        var chartDom = this.refs[this.props.id];
        var chart = Echarts.getInstanceByDom(chartDom);
        return chart.getDataURL({
            pixelRatio: 2,
            backgroundColor: '#fff'
        });
    },
    // 处理echarts的action
    handleAction: function (action) {
        var chartDom = this.refs[this.props.id];
        var chart = Echarts.getInstanceByDom(chartDom);
        chart.dispatchAction(action);
    },
    // resize:改变图表尺寸，在容器大小发生改变时需要手动调用。
    handleResize: function (e) {
        var chartDom = this.refs[this.props.id];
        var chart = Echarts.getInstanceByDom(chartDom) || Echarts.init(chartDom);
        chart.resize();
    },
    registMap: function () {
        var self = this;
        var mapName = this.props.mapName;
        this.props.mapLoad(mapName, function (mapJson) {
            Echarts.registerMap(mapName, mapJson);
            self.renderChart(true);
        });
    },
    getInstance: function () {
        var chartDom = this.refs[this.props.id];
        var chart = Echarts.getInstanceByDom(chartDom) || Echarts.init(chartDom);
        return chart;
    },
    renderChart: function (map) {
        var props = this.props;
        var chartDom = this.refs[props.id];
        var theme = (props.config && props.config.theme) || 'default';

        var chart = Echarts.getInstanceByDom(chartDom);
        if (!chart || this.state.needInit || map) {
            chart = Echarts.init(chartDom, theme);
            if (props.config && props.config.hasOwnProperty('event')) {
                props.config.event.forEach(function (item) {
                    chart.on(item.type, item.handler);
                });
            }
            let timer = null;
            // 单击
            chart.on('click', function (params) {
                if(timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function () {
                    if (props.handleClick) {
                        props.handleClick(params);
                    }
                }, 250);
            });
            // 双击
            chart.on('dblclick', function (params) {
                clearTimeout(timer);
                if (props.handleDblClick) {
                    props.handleDblClick(params);
                }
            });
        }

        if (props.config && props.config.showLoading) {
            chart.showLoading('default', (props.config && props.config.loadingOption) || {
                text: '加载中...',
                color: '#c23531',
                textColor: '#000',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0
            });
        } else {
            chart.hideLoading();
            chart.setOption(props.option, props.notMerge, props.notRefreshImmediately);
        }
    },
    handleClick: function (params) {

    },
    pubsub: function (type) {
        switch (type) {
            case 'resizeCanvas':
                this.handleResize();
                break;
            default:
                break;
        }
    },
    render: function () {
        return (<div ref={this.props.id} style={this.props.style} />);
    }
});

module.exports = EChartsObj;
