import React, { Component } from 'react';
const RModal = require('react-modal-bootstrap');

const removeModalOpenClass = require('../../../../common/utils/removeModalOpenClass');
const Config = require('../../../../common/Config');

const Table = require('../../../../component/Elements/Table');
const Close = require('../../../../component/form//Close');
const Button = require('../../../../component/form/Button');

class DirllHintModal extends Component {
    constructor(props) {
        super(props);
        this.state = this.setDefaultState();
        this.hideModal = this.hideModal.bind(this);
        this.handleCommit = this.handleCommit.bind(this);
    }
    setDefaultState() {
        return {
            isModalOpen: false,
            filterValue: [],
            title: [], // 表头
            list: [],
            drillValues: '',
        };
    }
    openModal(filterValue, title, list, drillValues) {
        this.setState({
            isModalOpen: true,
            filterValue: filterValue,
            title: title,
            list: list,
            drillValues: drillValues
        });
    }
    hideModal() {
        this.setState(this.setDefaultState());
        removeModalOpenClass(); // 移除body的‘modal-open’
    }
    handleCommit(seriesName) {
        if (this.props.onCommit) {
            let drillValues = Object.assign([], this.state.drillValues);
            let drill_values = drillValues;
            drill_values.push(seriesName);
            this.props.onCommit(drill_values);
        }
        this.hideModal();
    }
    renderThead(title) {
        return title.map(function (item, index) {
            return (
                <th key={'theader' + index}>
                    {item}
                </th>
            );
        });
    }
    renderTbody(list, length) {
        return list.map(function (item, index) {
            // let color = Config.dashboard.colorArray[index];
            return (
                <tr key={'tritem' + index}>
                    {this.renderTd(item)}
                    <td>
                        <div className='link-title-wrap'
                            onClick={this.handleCommit.bind(this, item[0])}>
                            下钻
                        </div>
                    </td>
                </tr>
            );
        }.bind(this));
    }
    renderTd(list) {
        return list.map(function (item, index) {
            return (
                <td key={'tdItem' + index}>{item}</td>
            );
        }.bind(this));
    }
    renderTable(title, list) {
        if (list.length === 0) {
            return null;
        }

        return (
            <Table bordered ref='oTable'>
                <thead>
                    <tr ref='oThead'>
                        {this.renderThead(title)}
                        <th>下钻</th>
                    </tr>
                </thead>
                <tbody ref='oTbody'>
                    {this.renderTbody(list, title.length)}
                </tbody>
            </Table>
        );
    }
    render() {
        if (!this.state.isModalOpen) {
            return null;
        }
        let content = this.renderTable(this.state.title, this.state.list);
        return (
            <RModal.Modal
                className='chartDetail-hint-modal'
                isOpen={this.state.isModalOpen}
                onRequestHide={this.hideModal}>
                <Close icon onClick={this.hideModal}
                    style={{ position: 'relative', top: 8, right: 8 }} />

                <div className="modal-header">
                    <div className='title'>下钻&nbsp;>&nbsp;其他</div>
                </div>

                <div className='modal-body'>
                    <div className='tableWrap auto-col-table'>{content}</div>
                </div>

                <div className="modal-footer">
                    <Button className='confirm'
                        onClick={this.hideModal}>取消</Button>
                </div>
            </RModal.Modal>
        );
    }
}
DirllHintModal.propTypes = {
    onCommit: React.PropTypes.func
};

module.exports = DirllHintModal;
