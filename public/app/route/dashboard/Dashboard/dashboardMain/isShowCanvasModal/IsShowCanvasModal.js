/**
 * 此提示框只针对柱状图，折线图，堆积图。环形图逻辑不变。
 * 当数据量超过2000条数据时，需给用户相关提示
 * 创建成功后后端返回值 hasData字段值为3时展示提示框
 */
import React, { PureComponent } from 'react';
import RModal from 'react-modal-bootstrap';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import actions from '../../../../../actions/actions';
import ModalHoc from '../../../../../jComponent/modal/ModalHoc';
import Button from '../../../../../jComponent/button/Button';

@ModalHoc
class IsShowCanvasModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            id: this.props.id
        }
    }
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.node,
        id: PropTypes.number,
        name: PropTypes.string,
        data: PropTypes.object,
        chartData: PropTypes.object,
        activeDashboard: PropTypes.object,
        saveData: PropTypes.object,
        backToAddModal: PropTypes.func,
        handleCloseModal: PropTypes.func,
        handleAddCanvas: PropTypes.func,
        getCanvasData: PropTypes.func,
        isDelCallBack: PropTypes.bool,
        fromPage: PropTypes.string,
        methodFrom: PropTypes.string,
        closeModal: PropTypes.func,
        isModalOpen: PropTypes.func
    }
    static defaultProps = {
        className: '',
        name: '',
        id: ''
    }
    /**
     * 添加新画布数据超过2000条
     * 返回添加画布模态框
     */
    handlebackToAddModal = () => {
        let {
            data,
            isDelCallBack,
            // fromPage
        } = this.props;
        let ids = [];
        for (let i = 0, j = data.length; i < j; i++) {
            ids.push(data[i].id);
        }
        if (isDelCallBack) {
            // let canvasData = JSON.parse(localStorage.getItem(`canvasData${data[0].id}`));
            // let { fromData, postData } = canvasData;
            // actions.editDashChart(fromData, postData, 'nocallBackAll');
            // localStorage.removeItem(`canvasData${data[0].id}`);
        } else {
            actions.delDashChart({ ids: ids.join(',') }, data, 'noCallback'); // 没有回调函数
        }
        this.props.closeModal();
        if (this.props.backToAddModal) this.props.backToAddModal(true, this.state.id);
    }
    /**
    * 添加新画布数据超过2000条
    * 取消创建
    */
    handleCloseAll = () => {
        let { data, isDelCallBack, fromPage } = this.props;
        let ids = [];
        for (let i = 0, j = data.length; i < j; i++) {
            ids.push(data[i].id);
        }
        if (isDelCallBack) { // 取消之前的编辑
            let chartData = this.props.chartData;
            let { id: dashboard_id } = this.props.activeDashboard;
            let { app_id, ds_id, id, name, plot_type, condition, dimension } = chartData;
            let fromData = {
                app_id,
                ds_id,
                id,
                name,
                dashboard_id,
                type: plot_type
            };
            let postData = {
                dimension,
                condition
            };
            actions.editDashChart(fromData, postData, 'nocallBack');
            localStorage.removeItem(`canvasData${data[0].id}`);
        } else { // 取消之前的创建
            actions.delDashChart({ ids: ids.join(',') }, data, 'noCallback'); // 没有回调函数
        }
        this.props.closeModal(); // 关闭当前模态框
        if (this.props.handleCloseModal) this.props.handleCloseModal(this.state.id); // 关闭编辑/或模态框
    }
    handleAddCanvasAlawys = () => {
        let { from, data } = this.props.saveData;
        this.props.closeModal();
        if (this.props.handleCloseModal) this.props.handleCloseModal(this.state.id);
        if (this.props.handleAddCanvas && this.props.methodFrom === 'edit') this.props.handleAddCanvas(data.id);
        if (this.props.handleAddCanvas && this.props.methodFrom === 'add') this.props.handleAddCanvas(from, data);
    }
    render() {
        if (!this.props.isModalOpen) return null;
        let classMames = classnames(
            this.props.className,
            'default-modal'
        );
        return (
            <RModal.Modal
                className={classMames}
                isOpen={this.props.isModalOpen}>
                <div className='modal-body'>
                    {this.props.children}
                    <Button
                        className='IsShowCanvasModalBtn'
                        onClick={this.handleAddCanvasAlawys}>
                        继续显示
                    </Button >
                    <Button
                        className='IsShowCanvasModalBtn'
                        onClick={this.handlebackToAddModal} >
                        添加过滤条件
                    </Button >
                    <Button
                        className='IsShowCanvasModalBtn'
                        onClick={this.handleCloseAll}>
                        取消创建
                    </Button >
                </div>
            </RModal.Modal>
        )
    }
}
export default IsShowCanvasModal;
