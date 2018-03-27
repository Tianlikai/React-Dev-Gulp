/**
 * 所有模态框 属性代理HOC
 * 所有模态框通用方法
 */
import React, { Component } from 'react';
import removeModalOpenClass from '../../common/utils/removeModalOpenClass';

function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
}
const ModalHoc = WrappedComponent => class HOC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            data: null,
            saveData: null
        }
    }
    static displayName = `HOC(${getDisplayName(WrappedComponent)})`;
    openModal(data, saveData, dashboardId) {
        this.setState({
            isModalOpen: true,
            data: data,
            saveData: saveData || null
        });
    }
    closeModal = () => {
        this.setState({
            isModalOpen: false,
            data: null,
            saveData: null
        });
        removeModalOpenClass(); // 移除body的‘modal-open’
    }
    render() {
        const props = {
            ...this.props,
            isModalOpen: this.state.isModalOpen,
            data: this.state.data,
            saveData: this.state.saveData,
            openModal: this.openModal,
            closeModal: this.closeModal
        }
        return (<WrappedComponent
            ref={instanceComponent => this.instanceComponent = instanceComponent}
            {...props}
        />);
    }
}
export default ModalHoc;