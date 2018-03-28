import React, { PureComponent } from 'react';
import RModal from 'react-modal-bootstrap';
import {removeModalOpenClass} from '../../../../../common/utils/removeModalOpenClass';
import actions from '../../../../../actions/actions';
import Close from '../../../../../component/form/Close';
import Button from '../../../../../component/form/Button';

class ShowDashboardListModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = this.setDefaultState();
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.renderAllDashboardList = this.renderAllDashboardList.bind(this);
        this.handleConfig = this.handleConfig.bind(this);
    }
    setDefaultState() {
        return {
            isModalOpen: false,
            canvasId: null, // 画布id
            dashboardId: null, // 选中的仪表盘Id
            type: null, //操作累心 1：复制 2：移动
        };
    }
    open(type, canvasId) {
        this.setState({
            isModalOpen: true,
            canvasId: canvasId,
            type: type,
        })
    }
    close() {
        this.setState({
            isModalOpen: false,
            dashboardId: null
        })
        removeModalOpenClass(); // 移除body的‘modal-open’
    }
    handleSelect(list) {
        this.setState({
            dashboardId: list.id
        })
    }
    /**
     * 渲染可选择的仪表盘：移动到和复制到的仪表盘列表
     * 迭代renderAllDashboardList()函数、一次渲染一条
     * @param {*} list 一条仪表盘记录
     * @param {*} idx  下标
     */
    renderAllDashboardList(list, idx) {
        const { name } = list;
        let checked = list.id === this.state.dashboardId ? true : false;
        let checkedSrc = checked ? './dist/images/moveOrCopyChecked.svg' : './dist/images/moveOrCopyUnChecked.svg';
        return (
            <li
                key={"moveOrCopyDashboardList" + idx}
                onMouseDown={this.handleSelect.bind(this, list)}
            >
                <img src={checkedSrc} />
                <span>{name}</span>
            </li>
        )
    }
    /**
     * 提交复制和移动请求
     * 1 复制
     * 2 移动
     */
    handleConfig() {
        let headerData = {
            id: this.state.canvasId,
            dashboard_id: this.state.dashboardId
        };
        switch (this.state.type) {
            case 1:
                if (this.state.dashboardId || this.state.dashboardId == 0) actions.commitCopyCanvnsTo(headerData);
                break;
            case 2:
                if (this.state.dashboardId || this.state.dashboardId == 0) actions.commitMoveCanvnsTo(headerData);
                break;
            default:
                break;
        }
    }
    render() {
        if (!this.state.isModalOpen) return null;
        const list = this.props.data;
        const hint = (
            <li>暂无目标仪表盘</li>
        )
        return (
            <RModal.Modal
                className={this.props.styleName}
                isOpen={this.state.isModalOpen}
                onRequestHide={this.close}>
                <Close icon onClick={this.close} />

                <div className="modal-header">
                    <div className='title'>{this.props.titleName}</div>
                </div>

                <div className='modal-body'>
                    <ul className='showDashboardListWrapper'>
                        {this.props.hasData ? list.map(this.renderAllDashboardList) : hint}
                    </ul>
                </div>
                <div className="modal-footer">
                    <Button className='cancel'
                        onClick={this.close}>取消</Button>
                    <Button className='confirm'
                        onClick={this.handleConfig}>
                        确定</Button>
                </div>
            </RModal.Modal>
        );
    }
}
ShowDashboardListModal.propTypes = {
    titleName: React.PropTypes.string,
    data: React.PropTypes.array,
    styleName: React.PropTypes.string,
    hasData: React.PropTypes.bool,
};
export default ShowDashboardListModal;

