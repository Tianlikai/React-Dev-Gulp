/*
Dashboard页面：TablePage和GraphPage两种图表类型 数据为空时提示消息
*/
import React, { Component } from 'react';

class DashboardChartNull extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let content = null;
        let type = this.props.type;
        if (type === 1) {
            content = (
                <h3>暂无图表数据</h3>
            );
        } else if (type === 2) {
            if (this.props.chartType === 5) {
                content = (
                    <div className='large-data-hint'>
                        由于数据量过大，该图表无法绘制为环形图，您可通过添加过滤条件控制数据量或更换图表类型以使图表可被正常绘制
                </div>
                )
            } else {
                content = (
                    <div className='large-data-hint'>
                        由于数据量过大，该图表无法显示，您可通过添加过滤条件控制数据量以使图表可被正常绘制。
                </div>
                );
            }
        }
        return (
            <div className='chart-page-null'>
                {content}
            </div>
        );
    }
}
DashboardChartNull.propTypes = {
    type: React.PropTypes.number
};
DashboardChartNull.defaultProps = {
    type: 1
};
module.exports = DashboardChartNull;
