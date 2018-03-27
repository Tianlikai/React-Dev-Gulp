import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class DrilledNavigation extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        drillValues: PropTypes.string, // 请求下钻数据参数
        navs: PropTypes.array, // 画布钻取路径
        navDeep: PropTypes.number, // 当前画布深度
        onChartClick: PropTypes.func,// 钻取画布、请求API
    }
    static defaultProps = {
        className: ''
    }
    constructor(props) {
        super(props);
    }
    onDrillingData = (e) => {
        let { drillValues, onChartClick } = this.props;
        let posStart = e.target.innerText.indexOf('（');
        let posEnd = e.target.innerText.indexOf('） >');
        let targetValue = e.target.innerText.slice(posStart + 1, posEnd);
        let drill_values = [];
        let pos = drillValues.indexOf(targetValue)
        if (pos > -1) {
            for (let i = 0; i < pos; ++i) {
                drill_values.push(drillValues[i]);
            }
        }
        if (onChartClick) onChartClick(drill_values);
    }
    /**
     * 渲染画布钻取导航路径
     * @param {str} Nav 钻取路径
     * @param {num} i 
     */
    renderDrilledNavigation = (Nav, i) => {
        let { navDeep, navs } = this.props;
        if (navDeep < i) return null;
        let lastNav = navs[navDeep].col_name;
        const defaultName = 'JTDrilledNavigation';
        let { col_desc, col_name } = Nav;
        let classes = classnames(
            'JTDrillNav-nav',
            {
                'active': col_name === lastNav
            }
        );
        return (
            <span
                key={`DrillNav${col_name}`}
                className={classes}
                onClick={this.onDrillingData}>
                {`${col_desc} `}
                {col_name === lastNav ? null : <label className={`${defaultName}NavPoint`}>{` > `}</label>}
            </span>
        )
    }
    render() {
        const defaultName = 'JTDrilledNavigation';
        let classes = classnames(
            defaultName,
            this.props.className
        );
        let { navs } = this.props;
        return (
            <div
                className={classes}>
                <span className={`${defaultName}Title`}>下钻路径</span>
                {navs.map(this.renderDrilledNavigation)}
            </div>
        )
    }
}