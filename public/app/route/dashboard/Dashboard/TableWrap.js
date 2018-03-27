import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DashboardChartNull from './DashboardChartNull';
import Table from '../../../component/Elements/Table';
import NPagination from '../../../component/NPagination';

class TableWrap extends PureComponent {
    static propTypes = {
        data: PropTypes.object, // 图表数据
        page: PropTypes.number, // 当前页码
        pageHandler: PropTypes.func // 翻页
    }
    constructor(props) {
        super(props);
        let {
            data,
            page
         } = this.props;
        this.state = {
            data: data,
            page: page,
            total: data ? data.total : 0,
            pageLimit: data ? data.size : 10,
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data,
            page: nextProps.page,
            total: nextProps.data ? nextProps.data.total : 0,
            pageLimit: nextProps.data ? nextProps.data.size : 10,
        })
    }
    renderTd(data) {
        return data.map(function (item, index) {
            return (
                <td key={'tdItem' + index} title={data[index]}>{data[index]}</td>
            );
        });
    }
    renderTr(data) {
        let self = this;
        return data.map(function (item, index) {
            return (
                <tr key={'trItem' + index}>{self.renderTd(item)}</tr>
            );
        });
    }
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
    refresh(data) {
        this.setState({
            data: data,
            total: data.total
        });
    }
    setPage(page) {
        if (this.refs[`pagination${this.props.useFrom}`]) this.refs[`pagination${this.props.useFrom}`].setIndex(page);
    }
    render() {
        let {
            data,
            page,
            total,
            pageLimit
         } = this.state;
        let {
            useFrom
         } = this.props;
        if (!data || data.hasData === 1 || data.hasData === 2) {
            let pageType = 1;
            if (data && data.hasData) {
                pageType = data.hasData;
            }
            return (
                <DashboardChartNull type={pageType} />
            );
        }
        let {
            title,
            list
        } = data;
        return (
            <div className='tableWrap'>
                <div className='oTable'>
                    <Table bordered ref='oTable'
                    >
                        <thead>
                            <tr key='tritenheader' ref='oThead'>
                                {this.renderThead(title)}
                            </tr>
                        </thead>
                        <tbody ref='oTbody'>
                            {this.renderTr(list)}
                        </tbody>
                    </Table>
                </div>
                <NPagination
                    ref={`pagination${useFrom}`}
                    onChange={this.props.pageHandler.bind(null)}
                    index={page}
                    total={total}
                    size={pageLimit}
                    isshow={true} />
            </div>
        );
    }
}
export default TableWrap;