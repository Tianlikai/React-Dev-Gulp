import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';

class DelWithHintModal extends Component {
    constructor(props) {
        super(props);
    }
    static propTypes = {
        titleName: PropTypes.string,
        className: PropTypes.string,
        children: PropTypes.node,
    }
    static defaultProps = {
        titleName: '模态框',
        className: '',
    }
    open() {
        this.refs.Modal.openModal();
    }
    close() {
        this.refs.Modal.hideModal();
    }
    render() {
        if (!this.props.hint) return null;
        return (
            <div>
                <Modal
                    ref='Modal'
                    className={this.props.className}
                    titleName={this.props.titleName}
                    handleCommit={this.props.handleConfirm}>
                    <div>{this.props.hint}</div>
                </Modal>
            </div>
        );
    }
}

export default DelWithHintModal;
export { DelWithHintModal as NormalHintModal }
