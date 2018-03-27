const React = require('react');
const deepClone = require('../../../../common/utils/deepClone');
const ReChart = require('../ReactEchart');
const ReChartStore = require('../../../../stores/ReChartStore');

const ChinaMap = React.createClass({
    getInitialState: function () {
        var option = {
            series: [
                {
                    name: '中国',
                    type: 'map',
                    mapType: 'china',
                    selectedMode: false,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            areaColor: '#eee'
                        }
                    }
                }
            ]
        };
        return {
            option: option
        };
    },
    setOption: function (data) {
        var mapOption = Util.deepClone(this.state.option);
        mapOption.series[0].data = data;
        this.setState({
            option: mapOption
        });
        // var echart = this.refs.echart.getInstance();
        // echart.setOption(mapOption, false);
    },
    render: function () {
        return (
            <div className='araeNameMap' key='chinaMap' style={{ minHeight: '300px' }}>
                <ReChart ref='echart' option={this.state.option} map mapName='china'
                    mapLoad={ReChartStore.eChartMapLoadedCallback} />
            </div>
        );
    }
});

module.exports = ChinaMap;
