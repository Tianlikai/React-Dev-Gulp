/*
 * @Author: jason.tian 
 * @Date: 2017-12-21 08:39:50 
 * @Last Modified by: jason.tian
 * @Last Modified time: 2017-12-21 15:15:22
 * 为组件添加提示框 功能
 */
import React from 'react';

const CheckboxWithHintHocii = (WrappedComponent, Tooltip, style) => class HOCII extends WrappedComponent {
    /**
     * @param {array} userDef 所有的自定义信息
     * @param {number} position 当前选中项下标
     * @param {object} userDef.sub_areas 提示内容对象
     */
    renderToolTip = (userDef, position) => {
        let content = userDef[position].sub_areas.map(function (item, index) {
            return (
                <span style={{ float: 'left', marginRight: '5px', color: '#999999' }}>
                    {item.name}
                </span>
            );
        });
        return (
            <div style={{ maxWidth: '300px', minWidth: '50px', overflow: 'auto' }}>
                {content}
            </div>
        );
    }
    render() {
        let {
            userDef, // 所有的自定义信息
            item // 当前选中项
        } = this.props;
        let visible = true;
        let { position } = item; // 当前选中项下标
        const tooltip = this.renderToolTip(userDef, position);
        const domTree = super.render();
        return (
            <Tooltip
                className='slideTooptip'
                placement='bottom'
                mouseLeaveDelay={0}
                overlay={tooltip}
                trigger={['hover']}>
                <div
                    style={style}>
                    {domTree}
                </div>
            </Tooltip>
        )
    }
}

export default CheckboxWithHintHocii;