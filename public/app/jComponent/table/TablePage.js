// /*
//  * @Author: jason.tian 
//  * @Date: 2017-12-12 10:19:06 
//  * @Last Modified by: jason.tian
//  * @Last Modified time: 2018-02-26 17:29:10
//  * 简单表格组件
//  */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Table from '../../bsComponents/Elements/Table';
import NPagination from '../../uiComponents/NPagination';
import PageMethod from '../../common/PageMethod';
import DropdownList from '../../components/modules/DropdownList';

class TablePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: this.props.columns, // 表头
            operation: [] // 应用权限： CRUD
        };
    }
    static propTypes = {
        className: PropTypes.string,
        tabName: PropTypes.string, // 当前tab项标签
        columns: PropTypes.array, // 表头
        style: PropTypes.array, // 特定义样式
        totalItems: PropTypes.number, // 内容总数
        pageLimit: PropTypes.number, // 每页显示的总数
        handleChangePage: PropTypes.func, // 翻页
        onChangeActive: PropTypes.func, // 查看详情
        HandleChangeIndustry: PropTypes.func, // 筛选行业
        industryList: PropTypes.array, // 行业列表
    }
    static defaultProps = {
        className: '',
        columns: []
    }
    componentDidMount() {
        window.addEventListener('resize', this.calculateTheadeWidth);
    }
    componentDidUpdate() {
        this.calculateTheadeWidth();
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.calculateTheadeWidth);
    }
    // 计算thead的宽度
    calculateTheadeWidth = () => {
        let minheights = PageMethod.getInnerHeight4();
        let trFirst = this.refs.oTbody.childNodes[0];
        if (trFirst) {
            let tdArray = trFirst.childNodes;
            let tdHead = this.refs.oThead.childNodes;
            for (var i = 0; i < tdHead.length; i++) {
                tdHead[i].style.width = tdArray[i].offsetWidth + 'px';
            }
            // table需要设定宽度
            let samptable = ReactDOM.findDOMNode(this.refs.oTable);
            // 设置table的高度
            let samptableHeight = ReactDOM.findDOMNode(this.refs.tbodyScroll);
            if (trFirst.offsetWidth) samptable.style.width = trFirst.offsetWidth + 1 + 'px';
            samptableHeight.style.height = minheights + 'px';
        }
    }
    onChangeActive = (tabName, recommendRow, e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        let { onChangeActive } = this.props; // 切换tabs回调
        if (onChangeActive) onChangeActive(tabName, recommendRow);
    }
    renderTable() {
        var minheights = PageMethod.getInnerHeight4();
        let tBody = null;
        let tHead = null;
        let { data, handleChangePage, total, pageLimit } = this.props;
        // let isNPaginationShow = false;
        // if (total > 20) isNPaginationShow = true;
        if (data && data.length > 0) {
            tBody = this.rendertbody(data);
            tHead = this.getTableColumn(true, []);
        }
        //  else {
        // tBody = <tr key={'tritem'}><td style={{ textAlign: 'center' }}>暂无详情</td></tr>
        // tHead = this.getTableColumn(true, []);
        // }
        return (
            <div>
                <div className='theadWrap'>
                    <Table bordered ref='oTable'
                    >
                        <thead>
                            <tr key='tritenheader' ref='oThead'>
                                {tHead}
                            </tr>
                        </thead>
                    </Table>
                </div>
                <div className='tbodyWrap'
                    style={{ height: minheights }}
                    ref='tbodyScroll'>
                    <Table striped bordered
                    >
                        <tbody ref='oTbody'>
                            {tBody}
                        </tbody>
                    </Table>
                </div>
                <NPagination
                    ref={pagination => this.pagination = pagination}
                    onChange={handleChangePage}
                    total={total}
                    size={pageLimit}
                    isshow={true} />
            </div>
        );
    }
    rendertbody(data) {
        return data.map(function (item, index) {
            return (
                <tr key={'tritem' + index}
                    {...this.props.check('tr', item.itemID) }>
                    {this.getTableColumn(false, item, index)}
                </tr>
            );
        }.bind(this));
    }
    getTableColumn(isHeader, recommendRow, rowIndex) {
        if (isHeader) {
            return this.state.columns.map(function (col, index) {
                let th = col.name;
                switch (th) {
                    case 'checkbox':
                        th = (<input ref={CheckAll => this.CheckAll = CheckAll} type='checkbox' {...this.props.check('th') } />);
                        break;
                    case '序号':
                        th = null;
                        break;
                    case '行业':
                        th = (
                            <div>
                                <DropdownList
                                    style={{ top: 43 }}
                                    ref={dropdownList => this.dropdownList = dropdownList}
                                    title={th}
                                    data={this.props.industryList}
                                    onCommit={this.props.HandleChangeIndustry}
                                />
                            </div>
                        );
                        break;
                    default:
                        break;
                }
                return (
                    <th key={'theader' + index}
                        style={{ width: col.width }}>
                        {th}
                    </th>
                );
            }.bind(this));
        }
        let { checkList } = this.props;
        return this.state.columns.map(function (col, index) {
            let tdContent = '';
            let _key = col.param;
            switch (_key) {
                case 'sortNumber':
                    let page = this.pagination.getIndex();
                    let indexNum = (page - 1) * 20 + rowIndex + 1;
                    if (recommendRow.name) {
                        tdContent = (
                            <div title={indexNum}
                                style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {indexNum}
                            </div>
                        );
                    }
                    break;
                case 'checkbox':
                    let checked = false;
                    if (checkList.indexOf(recommendRow.itemID) > -1) checked = true;
                    tdContent = (
                        <input
                            key={'tdRadio' + recommendRow.itemID}
                            value={recommendRow.itemID}
                            checked={checked}
                            type='checkbox'
                            {...this.props.check(recommendRow.itemID) } />
                    );
                    if (recommendRow.itemID === '') {
                        tdContent = (
                            <div style={{ width: 13, height: 13 }}></div>
                        );
                    }
                    break;
                case 'method':
                    if (recommendRow.itemID === '') {
                        tdContent = (
                            <div style={{ width: 13, height: 13 }}></div>
                        );
                    } else {
                        let {
                            tabName // 切换时的标识 
                        } = this.props;
                        tdContent = (
                            <div
                                className='click-look'
                                onClick={this.onChangeActive.bind(this, tabName, recommendRow)}>
                                点击查看
                            </div>
                        );
                    }
                    break;
                default:
                    tdContent = (
                        <div
                            title={recommendRow[_key]}
                            style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {recommendRow[_key]}
                        </div>
                    );
                    if (recommendRow.itemID === '') {
                        tdContent = (
                            <div style={{ width: 13, height: 13 }}></div>
                        );
                    }
                    break;
            }
            return (
                <td key={'tdContent' + index}
                    style={{ width: col.width }}>
                    {tdContent}
                </td>
            );
        }.bind(this));
    }
    render() {
        const tableDiv = this.renderTable();
        return (
            <div
                className='tablePage'>
                {tableDiv}
            </div>
        );
    }
}

export default TablePage;