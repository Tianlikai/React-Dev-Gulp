/*
 * @Author: jason.tian 
 * @Date: 2017-12-21 08:44:08 
 * @Last Modified by: jason.tian
 * @Last Modified time: 2017-12-22 13:25:25
 * chekbox组 组件工厂
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Checkbox from './Checkbox';

const factory = (Checkbox) => {
    class CheckboxGroup extends Component {
        constructor(props) {
            super(props);
        }
        static propTypes = {
            className: PropTypes.string,
            children: PropTypes.node,
            groupsName: PropTypes.string,
            groups: PropTypes.array,
            areaSelectedList: PropTypes.array,
            handleSysDefAreaSelected: PropTypes.func,
            handleFirstAreaSelected: PropTypes.func,
            specialId: PropTypes.string, // 特殊id标识
            userDef: PropTypes.array, // 用户自定义
        }
        static defaultProps = {
            className: '',
            groupsName: '组名',
            groups: []
        }
        renderGroup = (item, idx) => {
            let itemInfo = Object.assign(item);
            itemInfo.position = idx;
            let checked = false;
            let tag = 'id';
            let {
                specialId,
                areaSelectedList,
                ...others } = this.props;
            if (specialId) {
                tag = specialId;
                checked = areaSelectedList.indexOf(item[specialId]) > -1 ? true : false;
            } else {
                itemInfo.isUserDef = item.id >= 0 && item.id <= 43 ? false : true;
                checked = areaSelectedList.indexOf(item.id) > -1 ? true : false;
            }

            let isCheckdisabled = item.status === 1 ? false : true;

            const props = {
                key: `Checkbox${item[tag]}`,
                onChange: this.handleChange,
                check: checked,
                disabled: specialId ? isCheckdisabled : false, // 只有在specialId存在的情况下才判断是否禁用 否则默认不禁用
                item: itemInfo,
                ...others
            }
            return (
                <Checkbox {...props}>
                    {item.name}
                </Checkbox>
            )
        }
        handleChange = (item) => {
            let arae = ['全国', '东北', '华北', '华东', '华中', '华南', '西北', '西南', '港澳台'];
            if (arae.indexOf(item.name) > -1 || item.id > 43) {
                if (this.props.handleFirstAreaSelected) this.props.handleFirstAreaSelected(item);
            } else {
                if (this.props.handleSysDefAreaSelected) this.props.handleSysDefAreaSelected(item);
            }
            if (this.props.handleUserDefClick) this.props.handleUserDefClick(item.id, item.name, item[this.props.specialId]);
        }
        render() {
            const {
            className,
                children,
                groupsName,
                groups,
                ...others
            } = this.props;
            const classes = classnames(
                'JTCheckBoxGroup',
                className
            );
            const props = {
                ...others,
                ref: (node) => { this.CheckBoxGruopNode = node; },
                className: classes,
            }
            return (
                <div {...props}>
                    <label className={`JTCheckBoxGroupName`}>{groupsName}</label>
                    {children}
                    {groups && groups.length > 0 ? groups.map(this.renderGroup) : null}
                </div>
            )
        }
    }
    return CheckboxGroup;
}
const CheckboxGroup = factory(Checkbox);

export default CheckboxGroup;
export { factory as checkboxGroupFactory };