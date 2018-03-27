/**
 * 列数不固定的表格
 */
import React, { Component } from 'react';

const Table = require('../../../component/Elements/Table');

class AutoColTable extends Component {
    constructor(props) {
        super(props);
    }
    renderTd(data) {
        return data.map(function (item, index) {
            return (
                <td key={'tdItem' + index} title={data[index]}>{data[index]}</td>
            );
        });
    }
    // 表头
    renderThead(title) {
        let th = null;
        let ths = title.map(function (item, index) {
            th = (
                <th title={title[index]}>{title[index]}</th>
            );
            return th;
        });
        return ths;
    }
    // 表格
    render() {
        let title = this.props.title;
        if (title.length === 0) {
            return null;
        }
        let list = this.props.list;
        let self = this;
        let ths = this.renderThead(title);
        let trs = list.map(function (item, index) {
            return (
                <tr key={'trItem' + index}>{self.renderTd(item)}</tr>
            );
        });
        return (
            <div className='tableWrap auto-col-table'>
                <Table bordered ref='oTable'
                >
                    <thead>
                        <tr key='tritenheader' ref='oThead'>
                            {ths}
                        </tr>
                    </thead>
                    <tbody ref='oTbody'>
                        {trs}
                    </tbody>
                </Table>
            </div>
        );
    }
}
AutoColTable.propTypes = {
    title: React.PropTypes.array, // 表头
    list: React.PropTypes.array // 内容
};
AutoColTable.defaultProps = {
    title: [],
    list: []
};

module.exports = AutoColTable;
