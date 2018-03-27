/**
Dashboard中，画布的 约束条件和筛选条件
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import getNameById from '../../../../common/utils/getNameById';
import Config from '../../../../common/Config';
import PageMethod from '../../../../common/PageMethod';

let Sum = (newValue) =>
    <div title={newValue}>
        <span className='titleName'>总计</span>{newValue}
    </div>

let Constraint = (constraint) =>
    <div className='titleSpecial' title={constraint}>
        <span className='titleName'>过滤器</span>{constraint}
    </div>

class ConditionShow extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        impotBy: PropTypes.string, // 被什么组件引用
        constraint: PropTypes.array, // 过滤条件
        sum: PropTypes.oneOfType([ // 总计
            PropTypes.string,
            PropTypes.number
        ])
    }
    static defaultProps = {
        sum: ''
    }
    constructor(props) {
        super(props);
        this.state = {
            constraint: this.transformCondition(this.props.constraintList) || '未设置', // 过滤条件
            sum: this.props.sum
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.constraintList) {
            if (nextProps.constraintList.length === 0) {
                this.setState({
                    constraint: '未设置'
                });
            } else {
                this.setState({
                    constraint: this.transformCondition(nextProps.constraintList)
                });
            }
        }
        if (this.props.sum !== nextProps.sum) {
            this.setState({
                sum: nextProps.sum
            });
        }
    }
    transformCondition(data) {
        if (!data) return null;
        let list = [];
        let item = '';
        for (let i = 0, j = data.length; i < j; i++) {
            item += data[i].col_desc + ' ';
            item += getNameById(data[i].cond, Config.saleClues.condition) + ' ';
            if (data[i].col_type === 'datetime' || data[i].col_type === 'date') {
                if (data[i].cond === 'relative') {
                    item += '近' + data[i].value + '天';
                } else {
                    let arr = data[i].value;
                    let bt = '';
                    let et = '';
                    if (arr[0]) {
                        bt = arr[0].split(' ')[0] + ' 00:00';
                    } else {
                        bt = arr[0];
                    }
                    if (arr[1]) {
                        et = arr[1].split(' ')[0] + ' 23:59';
                    } else {
                        et = arr[1];
                    }
                    item += bt + '、' + et;
                }
            } else {
                if (Object.prototype.toString.call(data[i].value).slice(8, -1) === 'Array') {
                    item += data[i].value.join('、');
                } else {
                    if (data[i].value.indexOf('>>')) {
                        item += data[i].value.replace(/>>/g, '、');
                    }
                }
            }
            list.push(item);
            item = '';
        }
        return list.join('；');
    }
    render() {
        let {
            className,
            impotBy
        } = this.props;
        let {
            sum,
            constraint
        } = this.state;
        let newValue = sum !== '' && sum !== '-' ? PageMethod.convertNumber(sum) : '-';
        let SumComPon = Sum(newValue);
        let ConstraintComPon = null;
        if (impotBy === 'noDsbChart') { // dashboard的图标不显示过滤条件
            ConstraintComPon = Constraint(constraint);
        }
        let classes = className ? `${className} condition-page` : `condition-page`;
        return (
            <div className={classes}>
                {ConstraintComPon}
                {SumComPon}
            </div>
        );
    }
}
export default ConditionShow;
