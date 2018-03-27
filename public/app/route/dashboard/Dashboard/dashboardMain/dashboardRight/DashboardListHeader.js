import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class DashboardListHeader extends PureComponent {
    static propTypes = {
        dashboard: PropTypes.object, // 选中的仪表盘
        canvasList: PropTypes.array, // 画布列表
        isFromSharing: PropTypes.bool, // 是否来自分享
        formShareUserName: PropTypes.array, // 分享者名称
        addCanvas: PropTypes.func, // 添加画布
        sortCanvas: PropTypes.func, // 画布排序
    }
    constructor(props) {
        super(props);
        this.openAddModal = this.openAddModal.bind(this);
        this.openSortModal = this.openSortModal.bind(this);
    }
    openAddModal() {
        if (this.props.addCanvas) this.props.addCanvas();
    }
    openSortModal() {
        if (this.props.sortCanvas) this.props.sortCanvas();
    }
    render() {
        let {
            dashboard,
            dashboard: { name },
            canvasList,
            formShareUserName,
            isFromSharing
        } = this.props;
        if (!dashboard) return null;
        let canvasLen = canvasList.length; // 画布长度
        return (
            <div className='dashboardHeader-title-addcanvas'>
                <span className="dashboardHeader-title">
                    <div>{name}</div>
                    {formShareUserName ? <span>{`来自${formShareUserName}分享`}</span> : null}
                </span>

                {/* 当画布长度大于0时，画布排序才可用 */}
                {canvasLen > 0 ? <span className="dashboardHeader-sortcanvas"
                    onClick={this.openSortModal}
                    title='画布排序'
                ></span> : null}

                {!isFromSharing ? <span className="dashboardHeader-addcanvas"
                    onClick={this.openAddModal}
                    title='新建画布'
                ></span> : null}
            </div>
        )
    }
}
