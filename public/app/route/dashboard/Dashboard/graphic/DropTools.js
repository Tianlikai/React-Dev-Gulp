// /*
//  * @Author: jason.tian 
//  * @Date: 2017-12-15 09:48:00 
//  * @Last Modified by: jason.tian
//  * @Last Modified time: 2018-03-02 14:49:48
//  */
import React, { PureComponent } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Events from "../../../../component/utils/Events";
import isNodeInTree from "../../../../component/utils/isNodeInTree";
import isOverFlow10000px from "../../../../common/utils/isOverFlow10000px";
import deepClone from '../../../../common/utils/deepClone';
import actions from "../../../../actions/actions";

class Droptools extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        id: PropTypes.number, // 画布id
        source: PropTypes.arrayOf(PropTypes.oneOfType([ // 下拉框可选择的操作
            PropTypes.string,
            PropTypes.object,
        ])),
        theme: PropTypes.shape({ // 自定义样式
            active: PropTypes.string,
            disabled: PropTypes.string,
            dropdown: PropTypes.string,
            error: PropTypes.string,
            errored: PropTypes.string,
            field: PropTypes.string,
            label: PropTypes.string,
            required: PropTypes.string,
            selected: PropTypes.string,
            templateValue: PropTypes.string,
            up: PropTypes.string,
            value: PropTypes.string,
            values: PropTypes.string,
        }),
        labelKey: PropTypes.string, // label标识
        valueKey: PropTypes.string, // value标识
        chartType: PropTypes.number, // 画布类型
        chartData: PropTypes.object, // 画布数据       
        slicer: PropTypes.object, // 画布包含的切片器
        slicersValue: PropTypes.object, // 画布切片器选中的值
        drillValues: PropTypes.string, // 下钻请求API数据
        onHint: PropTypes.func, // 导出画布为图片时 画布数据过大 给出提示
        onEdit: PropTypes.func, // 编辑
        onDel: PropTypes.func, // 删除
        onShare: PropTypes.func, // 分享
        onCopyTo: PropTypes.func, // 复制到
        onMoveTo: PropTypes.func, // 移动到
        onSliceUp: PropTypes.func, // 切片器
        onDrill: PropTypes.func, // 下钻
    }
    static defaultProps = {
        className: '',
        labelKey: 'label',
        valueKey: 'value',
        srcKey: "src",
        typeKey: "type",
    }
    constructor(props) {
        super(props);
        this.state = {
            active: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.renderValue = this.renderValue.bind(this);
    };
    componentWillUpdate(nextProps, nextState) {
        if (!this.state.active && nextState.active) {
            Events.on(document, 'click', this.handleDocumentClick);
        }
    };
    componentDidUpdate(prevProps, prevState) {
        if (prevState.active && !this.state.active) {
            Events.on(document, 'click', this.handleDocumentClick);
        }
    };
    componentWillUnmount() {
        if (this.state.active) {
            Events.off(document, 'click', this.handleDocumentClick);
        }
    };
    handleDocumentClick(e) {
        if (isNodeInTree(e.target, this.refs.toolbox_dropdown)) {
            return false;
        }
        this.setState({ active: false });
    };
    handleSelect(item, event) {
        event.preventDefault();
        event.stopPropagation();
        switch (item) {
            case 1: // 打开编辑
                if (this.props.onEdit) this.props.onEdit();
                break;
            case 2: // 打开分享 该功能被取消
                if (this.props.onShare) this.props.onShare();
                break;
            case 3: // 导出画布
                {
                    let {
                        id,
                        chartData,
                        chartType,
                        drillValues,
                        onHint
                    } = this.props;

                    let isOverflow = isOverFlow10000px(chartData);
                    let conditions = this.getSlicerCond();
                    if (isOverflow && chartType !== 5) { // 画布超过10000px转化为excel导出
                        if (onHint) {
                            let urlData = {
                                id: id,
                                page: 1,
                                title: chartData.name
                            };
                            let postData = {
                                condition: conditions && conditions.length > 0 ? conditions : {},
                                drill_values: drillValues || []
                            }
                            onHint(urlData, postData);
                        }
                    } else { // 导出画布 图片
                        let dataObj = {
                            id: id,
                            conditions: conditions,
                            drillValues: drillValues || []
                        };
                        let dataObjUrl = encodeURIComponent(JSON.stringify(dataObj));
                        let loc = window.location;
                        let port = loc.port ? ':' + loc.port : '';
                        let url = loc.protocol + '//' + loc.hostname + port + '/#/other/DashboardDownload/' + dataObjUrl;
                        window.open(url);
                    }
                    break;
                }
            case 4: // 删除
                if (this.props.onDel) this.props.onDel();
                break;
            case 5: // 复制到
                if (this.props.onCopyTo) this.props.onCopyTo(1, this.props.id); // 1 复制
                break;
            case 6: // 移动到
                if (this.props.onMoveTo) this.props.onMoveTo(2, this.props.id); // 2 移动
                break;
            case 7: // 添加切片器
                if (this.props.onSliceUp) this.props.onSliceUp();
                break;
            case 8: // 导出为excel
                {
                    let urlData = {
                        id: this.props.id,
                        page: 1,
                        title: this.props.chartData.name,
                    };
                    let conditions = this.getSlicerCond();
                    let postData = {
                        condition: conditions && conditions.length > 0 ? conditions : {},
                        drill_values: this.props.drillValues || []
                    }
                    actions.getDashChartData2(urlData, postData, 'canvasOutHint');
                    break;
                }
            case 9: // 下钻
                if (this.props.onDrill) this.props.onDrill();
                break;
            default:
                break;
        }
        this.close();
    };
    handleClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.open(event);
        if (this.props.onClick) this.props.onClick(event);
    };
    getSlicerCond() {
        let data = deepClone(this.props.slicer.condition);
        let conditions = [];
        if (this.props.slicersValue) {
            let slicerValues = this.props.slicersValue;
            data.forEach(function (item, i) {
                item.cond = "equal";
                item.value = slicerValues[item.col_name];
                if (!(item.value.length === 1 && item.value[0] === '所有')) conditions.push(item);
            });
        };
        return conditions;
    }
    close() {
        if (this.state.active) {
            this.setState({ active: false });
        }
    }
    open(event) {
        if (!this.state.active) {
            const client = event.target.getBoundingClientRect();
            const screenHeight = window.innerHeight || document.documentElement.offsetHeight;
            this.setState({ active: true });
        } else {
            this.setState({ active: false });
        }
    };
    renderValue(item, idx) {
        const { labelKey, theme, valueKey, srcKey, typeKey } = this.props;
        const className = classnames({
            [theme.selected]: item[valueKey] === this.props.value,
        });
        return (
            <li
                key={"moreTool" + idx}
                className={className}
                onMouseDown={this.handleSelect.bind(this, item[typeKey])}
                title={item[labelKey]}
            >
                <img src={item[srcKey]} alt="" />
                <label>{item[labelKey]}</label>
                <div className='fgx_dashboard'></div>
            </li>

        );
    };
    render() {
        if (!this.props.source.length) return null;
        const {
            labelKey,
            onChange,
            source,
            theme,
            valueKey, } = this.props;

        const className = classnames(theme.dropdown, {
            [theme.active]: this.state.active,
        }, this.props.className);

        return (
            <div
                ref='toolbox_dropdown'
                className={className}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                tabIndex="-1"
            >
                <span
                    tabIndex="0"
                    className={theme.value}
                    onClick={this.handleClick}
                >
                    <img src="/dist/images/moreToolbox.png" />
                </span>
                <ul className={theme.values}>
                    <div className="triangle_border_up">
                        <span></span>
                    </div>
                    {source.map(this.renderValue)}
                </ul>
            </div>
        );
    };
}
export default Droptools;