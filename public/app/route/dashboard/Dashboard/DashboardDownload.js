/**
 * dashboard图表(条形图，柱状图，折线图)下载
 */
import React, { PureComponent } from 'react';
import Echarts from 'echarts';
import actions from '../../../actions/actions';
import REchart from '../../../uiComponents/ReactEchart';
import OtherStore from '../../../stores/OtherStore';
import Util from '../../../common/Util'
import Config from '../../../common/Config';
import PageMethod from "../../../common/PageMethod";

class DashboardDownload extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null // 图表数据
        };
        this.handleDownDashboard = this.handleDownDashboard;
    }
    componentDidMount() {
        this.unsubscribe = OtherStore.listen(this.pubsub, this);
        let id = parseInt(this.props.id, 10);
        let {
            conditions,
            drillValues
        } = this.props.chartGetDataParam;
        let urlData = {
            id: id,
            page: 1,
        };
        let postData = {
            condition: conditions.length > 0 ? conditions : {},
            drill_values: drillValues
        };
        actions.getDashChartData(urlData, postData);
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    pubsub(type, data, from) {
        if (type === "getDashChartDataSuccess") {
            this.setState({
                data: data
            })
        }
    }
    handleDownDashboard(name) {
        let myChart = this.refs.reactEchart;
        let src = myChart.getbaseUrl();
        let DATE = new Date();
        var fileName = name + "_" + DATE.toLocaleString() + '.jpg';
        let blob = Util.base64Img2Blob(src);
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName);
        } else {
            var link = document.createElement('a');
            link.addEventListener('click', oDownLoad, false);
            document.body.appendChild(link);
            function oDownLoad() {
                link.download = fileName;
                link.href = window.URL.createObjectURL(blob);
            }
            link.click();
            window.URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
        }
        // var aLink = document.createElement("a");
        // document.body.appendChild(aLink);
        // aLink.addEventListener('click', oDownLoad, false);
        // function oDownLoad() {
        //     if (Util.myBrowser() === "IE") {
        //         aLink.download = fileName;
        //         aLink.href = window.location.href;
        //         Util.downloadDashboardImg(fileName, src);
        //     } else {
        //         // a标签的download属性是html5新特性，用来下载
        //         aLink.download = fileName;
        //         aLink.href = src;
        //     }
        // }
        // aLink.click();
        // document.body.removeChild(aLink);
        // 下载的时候，自动填充文件名
    }
    render() {
        let data1 = this.state.data;
        if (!data1) {
            return null;
        }
        const { legend, condition, groupNum, name, x, y, x_name, y_name, plot_type, sum } = data1;
        let option = PageMethod.getOptionForDashboardDownload(legend, condition, groupNum, name, x, y, x_name, y_name, plot_type, sum);
        return (
            <div className='dashboard-download-page'>
                <REchart
                    ref='reactEchart'
                    option={option.option}
                    notMerge={true}
                    style={{ height: option.height, width: option.width, position: "relative", margin: "0 auto" }}
                />
                <div className="dashboardDownloadBtn">
                    <div>
                        <i onClick={this.handleDownDashboard.bind(this, name)}>导出到本地</i>
                    </div>
                </div>
            </div>
        );
    }
}

DashboardDownload.propTypes = {
    id: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.string
    ])
};


module.exports = DashboardDownload;
