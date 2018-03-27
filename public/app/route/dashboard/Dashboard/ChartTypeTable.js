import React, { PureComponent } from 'react';
import digitInput2 from '../../../common/utils/digitInput2';
import InputWithErrMsg from '../../../component/InputWithErrMsg';
import Multiselect from '../../../component/Multiselect';

class ChartTypeTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: this.props.pageSize || null, // 每页显示行数
            columns: this.props.columns || [], // 显示字段
            selectedColumns: this.props.selectedColumns || [] // 选中的：字段
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.columns) {
            this.setState({
                columns: nextProps.columns
            });
        }
        if (nextProps.selectedColumns) {
            this.setState({
                selectedColumns: nextProps.selectedColumns
            });
        }
        if (typeof (nextProps.pageSize) !== 'undefined') {
            this.setState({
                pageSize: nextProps.pageSize
            });
        }
        if (this.props.chartType !== nextProps.chartType) {
            let selectedColumns = this.refs.showColumns.getSelectedData();
            this.setState({
                selectedColumns: selectedColumns
            });
        }
    }
    onInputKeyDown(value, fromEvent) {
        digitInput2(value, fromEvent);
    }
    render() {
        let hint = '显示的行数（最多为' + this.props.maxSize + '），超过自动翻页显示';
        return (
            <div style={this.props.style}>
                <div className='line'>
                    <div className='itemName'>
                        <span>每页显示行数</span>
                    </div>
                    <InputWithErrMsg
                        className='itemValue'
                        ref='pageSize'
                        hint={hint}
                        defaultValue={this.state.pageSize}
                        onKeyDown={this.onInputKeyDown}
                    />
                </div>
                <div className='line'>
                    <div className='itemName'>
                        <span>显示字段</span>
                    </div>
                    <Multiselect
                        className='itemValue'
                        ref='showColumns'
                        data={this.state.columns}
                        selectedData={this.state.selectedColumns}
                    />
                </div>
            </div>
        );
    }
}

ChartTypeTable.propTypes = {
    pageSize: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]),
    maxSize: React.PropTypes.number, // 每页最大行数
    columns: React.PropTypes.array, // 下拉框：显示字段
    chartType: React.PropTypes.number, // 图表类型
    selectedColumns: React.PropTypes.array, // 选中的：字段
    style: React.PropTypes.object // style样式
};

module.exports = ChartTypeTable;
