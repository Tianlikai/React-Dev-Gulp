/*
Dashboard 仪表盘 切片器
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import actions from '../../actions/actions'
import Modal from './Modal';
import Filter from '../../route/dashboard/Dashboard/graphic/Filter';
import DashboardStore from '../../stores/DashboardStore';
import PageMethod from '../../common/PageMethod';
import SelectList from '../select/SelectList';

class AddSliceUpModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            slicer: [],
            id: null
        };
    }
    static propTypes = {
        titleName: PropTypes.string,
        className: PropTypes.string,
        children: PropTypes.node,
        data: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array,
        ]),
    }
    static defaultProps = {
        titleName: '模态框',
        className: '',
        data: []
    }
    componentDidMount() {
        this.unsubscribe = DashboardStore.listen(this.pubsub, this);
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    pubsub(type, data, from) {
        switch (type) {
            case 'getDashChartColsSuccess': {
                if (from === 'addSliceUp') {
                    let cols = PageMethod.convertSelectData(data.cols);
                    this.setState({
                        data: cols
                    });
                };
                break;
            }
            case 'addSliceUpSuccess': {
                if (this.props.canvasId === this.state.id && this.props.onRefresh) this.props.onRefresh(from);
                this.close();
                break;
            }
            default:
                break;
        }
    }
    open(appID, dsID, ID, slicer) {
        this.setState({
            id: ID,
            slicer: slicer.condition
        }, function () {
            actions.getDashChartCols({ app_id: appID, ds_id: dsID }, 'addSliceUp');
            this.refs.Modal.openModal();
        });
    }
    close() {
        this.setState({
            data: [],
            id: null,
            slicer: []
        }, function () {
            this.refs.Modal.hideModal();
        });
    }
    handleCommit = () => {
        let data = this.SelectList.getValue();
        if (!data) return null;
        let slicerChanged = {
            name: 'slicerChanged',
            changedKey: [],
        }
        let { defaultSlicer } = this.props;
        if (defaultSlicer) {
            for (let i = 0; i < defaultSlicer.length; ++i) {
                let flag = false;
                for (let j = 0; j < data.length; ++j) {
                    if (defaultSlicer[i].col_type === 'date' || defaultSlicer[i].col_type === 'datetime') {
                        if (defaultSlicer[i].col_name === data[j].col_name && defaultSlicer[i].format === data[j].format) {
                            flag = true;
                            break;
                        }
                    } else {
                        if (defaultSlicer[i].col_name === data[j].col_name) {
                            flag = true;
                            break;
                        }
                    }
                }
                // 记录下被删除掉的切片器
                if (!flag) slicerChanged.changedKey.push(defaultSlicer[i].col_name);
            }
        }
        let id = this.state.id;
        let headerData = {
            chart_id: id
        };
        let bodydata = {
            condition: data || []
        };
        actions.addSliceUp(headerData, bodydata, slicerChanged);
    }
    render() {
        return (
            <div>
                <Modal
                    ref='Modal'
                    className={this.props.className}
                    titleName={this.props.titleName}
                    handleCommit={this.handleCommit}>
                    <SelectList
                        key='AddSliceUpModal'
                        ref={(node) => { this.SelectList = node; }}
                        isLimit={true}
                        hasItemName={false}
                        max={5}
                        cols={this.state.data}
                        groups={this.state.slicer}
                    />
                </Modal>
            </div>
        );
    }
}
export default AddSliceUpModal;
