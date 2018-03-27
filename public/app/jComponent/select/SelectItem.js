import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Multiselect from '../../component/Multiselect';
import actions from '../../actions/actions'
import UtilStore from '../../stores/UtilStore';
import Config from '../../common/Config';

class SelectItem extends Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.format = this.props.format; // 只针对时间类型
        this.state = {
            multiSelectData: this.props.data,
            selectedData: this.props.selectedData,
        }
    }
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.element,
        data: PropTypes.array,
        dataIsObject: PropTypes.number,
        hasSearch: PropTypes.number,
        selectedData: PropTypes.array,
        handleDropUp: PropTypes.func,
        id: PropTypes.number,
        col_name: PropTypes.string,
        col_desc: PropTypes.string,
        col_type: PropTypes.string,
        useFrom: PropTypes.string,
        format: PropTypes.string,
    }
    static defaultProps = {
        className: '',
        data: [],
        dataIsObject: -1,
        hasSearch: 1,
        selectedData: ['所有']
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            selectedData: nextProps.selectedData,
        })
    }
    componentDidMount() {
        this.unsubscribe = UtilStore.listen(this.pubsub, this);
    }
    componentWillUnmount() {
        this.timer == null
        this.unsubscribe();
    }
    pubsub(type, data, from) {
        let { id, col_name, useFrom } = this.props;
        switch (type) {
            case 'getAppColValuesSuccess':
                if (from === `slicer${id}${col_name}${useFrom}`) {
                    if (data[0] !== '所有') data.unshift('所有');
                    this.setState({
                        multiSelectData: data,
                    });
                } else if (from === `slicer${id}${col_name}${useFrom}Search`) {
                    this.setState({
                        multiSelectData: data
                    });
                }
                break;
            default:
                break;
        }
    }
    handleToggle = () => {
        let { multiSelectData } = this.state;
        if(this.refs.module1.refs.searchInput) this.refs.module1.refs.searchInput.reset();
        if (this.props.handleDropUp) {
            this.props.handleDropUp(); // 每次点击切片器都请求后台数据
            // this.format = format;
        }
    }
    handleConfirm = (arrValue) => {
        let { id } = this.props;
        if (this.props.handleConfirm) this.props.handleConfirm(id);
    }
    handleSearch = (value, selectedData) => {
        this.setState({
            selectedData: selectedData
        });
        let { col_name, col_type, format } = this.props;
        let item = {
            col_name: col_name,
            query: value
        }
        if (col_type === 'datetime' || col_type === 'date') item.format = format;
        if (this.props.handleSearch) {
            if (this.timer == null) {
                this.timer = setTimeout(() => {
                    this.props.handleSearch(item); // 唯一标识 接收数据
                }, 700);
            } else {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.props.handleSearch(item, value); // 唯一标识 接收数据
                }, 700);
            }
        };
    }
    /**
     * 获取选中项
     */
    getSelectedData = () => {
        return this.refs.module1.getSelectedData();
    }
    /**
     * 获取下拉框中所有选项
     */
    getCouldBeSelectData = () => {
        return this.state.multiSelectData;
    }
    render() {
        let selectedData = this.state.selectedData;
        let { col_desc, format } = this.props;
        let titleName = format ? `${col_desc}（${Config.saleClues.datePeriodType[5][format]}）` : col_desc;
        if (selectedData.length === 0) selectedData[0] = '所有';
        return (
            <Multiselect
                ref='module1'
                className='str-input condValue-module3 specialwid'
                fromSelectGroup
                title={titleName}
                dataIsObject={-1}
                data={this.state.multiSelectData}
                selectedData={selectedData}
                hasSearch={1}
                handleSearch={this.handleSearch}
                onToggle={this.handleToggle}
                style={{ zIndex: this.props.zindex }}
                handleConfirm={this.handleConfirm}
            />
        );
    };
};
export default SelectItem;