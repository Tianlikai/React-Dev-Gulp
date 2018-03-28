import React, { Component } from 'react';
const RModal = require('react-modal-bootstrap');
import handleConfigColumns from '../../../../common/utils/handleConfigColumns';
import {removeModalOpenClass} from '../../../../common/utils/removeModalOpenClass';
import actions from '../../../../actions/actions';
// import SaleCluesStore from '../../../../stores/SaleCluesStore';

import Close from '../../../../component/form/Close';
import Button from '../../../../component/form/Button';
import ConfigurationColumnBox from './ConfigurationColumnBox';

// const factory = (RModal, ConfigurationColumnBox, Close, Button) => {
class ConfigurationColumnsModal extends Component {
    constructor(props) {
        super(props);
        this.from = null;
        this.state = this.setDefaultState();
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleConfig = this.handleConfig.bind(this);
    }
    setDefaultState() {
        return {
            isModalOpen: false,
            showAll: [],
            showColumns: [],
            hiddenColumns: [],
            hideAll: [],
            selectedshowColList: [],
            selectedhideColList: [],
            isEmptyAllShowListitem: false,
        };
    }
    componentDidMount() {
        // this.unsubscribe = SaleCluesStore.listen(this.pubsub, this);
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    // pubsub(type, data, from) {
    //     switch (type) {
    //         case 'getUserColsResultSuccess':
    //             this.from = from;
    //             let { showColumns, hiddenColumns } = Util.getHideAndShowListFromServer(data, 0);
    //             Util.localSaveHideAndShowList(from, data);
    //             this.setState({
    //                 showColumns: Util.deepClone(showColumns),
    //                 hiddenColumns: Util.deepClone(hiddenColumns),
    //                 showAll: Util.deepClone(showColumns),
    //                 hideAll: Util.deepClone(hiddenColumns),
    //             });
    //             break;
    //         case 'getCanvasColsResultSuccess':
    //             this.from = from;
    //             let { showColumns2, hiddenColumns2 } = Util.getHideAndShowListFromServer(data, 1);
    //             Util.localSaveHideAndShowList(from, data);
    //             this.setState({
    //                 showColumns: Util.deepClone(showColumns2),
    //                 hiddenColumns: Util.deepClone(hiddenColumns2),
    //                 showAll: Util.deepClone(showColumns2),
    //                 hideAll: Util.deepClone(hiddenColumns2),
    //             });
    //             break;
    //         default:
    //             break;
    //     }
    // }
    open() {
        this.setState({
            isModalOpen: true,
        });
    }
    close() {
        this.setState({
            isModalOpen: false,
            isEmptyAllShowListitem: false,
        });
        removeModalOpenClass(); // 移除body的‘modal-open’
    }
    handleStateChange(showColumns, hiddenColumns, selectedshowColList, selectedhideColList, type, hideAll, showAll) {
        /**
         * 1 右移
         * 2 左移
         * 3 选择隐藏字段
         * 4 选择显示字段
         * 5 上下移动
         * 6 字段搜索
         * 7 字段搜索
         */
        switch (type) {
            case 1:
                let isEmptyAllShowListitem = showAll.length <= 0 ? true : false;
                this.setState({
                    showColumns: showColumns,
                    hiddenColumns: hiddenColumns,
                    selectedhideColList: selectedhideColList,
                    hideAll: hideAll,
                    showAll: showAll,
                    isEmptyAllShowListitem: isEmptyAllShowListitem,
                });
                break;
            case 2:
                this.setState({
                    showColumns: showColumns,
                    hiddenColumns: hiddenColumns,
                    selectedshowColList: selectedshowColList,
                    hideAll: hideAll,
                    showAll: showAll,
                });
                break;
            case 3:
                this.setState({
                    selectedhideColList: selectedhideColList,
                });
                break;
            case 4:
                this.setState({
                    selectedshowColList: selectedshowColList,
                });
                break;
            case 5:
                this.setState({
                    showColumns: showColumns,
                    showAll: showColumns
                });
                break;
            case 6:
                this.setState({
                    showColumns: showColumns,
                    hiddenColumns: hiddenColumns,
                });
                break;
            case 7:
                this.setState({
                    showColumns: showAll,
                    hiddenColumns: hideAll,
                });
                break;
            default:
                break;
        }
    }
    handleConfig() {
        let bodyData = {};
        let headerData = {
            app_id: this.props.app_id,
            ds_id: this.props.ds_id,
        };
        let cols_display = JSON.parse(localStorage.getItem('cols_display' + this.from));
        let cols_hidden = JSON.parse(localStorage.getItem('cols_hidden' + this.from));
        let showColumns = this.state.showAll;
        let { list, len } = handleConfigColumns(showColumns, cols_display, cols_hidden);
        bodyData.list = list;
        if (len > 0) {
            actions.onCommitConfigurationCols(headerData, bodyData, this.from);
        } else {
            this.setState({
                isEmptyAllShowListitem: true
            });
        }

    }
    render() {
        if (!this.state.isModalOpen) {
            return null;
        }
        let normalInfo =
            (<div className='ConfigurationColumnBoxHint'>
                <img src="./dist/images/Exclamationmark.svg" alt="" />
                <span>项目信息列表中显示的列按照“显示字段”中字段的顺序展示。</span>
            </div>);
        let showListAtLeastOneitem =
            (<div className='ConfigurationColumnBoxHint'>
                <span style={{ color: 'red' }}>显示字段至少保留一项！</span>
            </div>);
        return (
            <RModal.Modal
                className='configurationColumns-chart-modal'
                isOpen={this.state.isModalOpen}
                onRequestHide={this.close}>
                <Close icon onClick={this.close} />

                <div className="modal-header">
                    <div className='title'>{this.props.titleName}</div>
                </div>

                <div className='modal-body' style={{ padding: '18px 30px' }}>
                    <ConfigurationColumnBox
                        showColumns={this.state.showColumns}
                        hiddenColumns={this.state.hiddenColumns}
                        showAll={this.state.showAll}
                        hideAll={this.state.hideAll}
                        selectedshowColList={this.state.selectedshowColList}
                        selectedhideColList={this.state.selectedhideColList}
                        handleStateChange={this.handleStateChange}
                        from={this.from}
                    />
                    {this.state.isEmptyAllShowListitem ? showListAtLeastOneitem : normalInfo}
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
//     return ConfigurationColumnsModal;
// }

// const ConfigurationColumnsModal = factory(RModal, ConfigurationColumnBox, Close, Button);
ConfigurationColumnsModal.propTypes = {
    titleName: React.PropTypes.string,
    app_id: React.PropTypes.number,
    ds_id: React.PropTypes.number,
};
export default ConfigurationColumnsModal;
// export { factory as ConfigurationColumnsModalFactory };

