/*
Dashboard 仪表盘 下钻
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import actions from '../../actions/actions'
import Modal from './Modal';
import Filter from '../../route/dashboard/Dashboard/graphic/Filter';
import DashboardStore from '../../stores/DashboardStore';
import PageMethod from '../../common/PageMethod';
import SelectListAdd from '../select/SelectListAdd';

class DrillModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            drill: [],
            id: null,
            copyDrillFirst: null,
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
        titleName: '下钻',
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
            case 'getDashChartColsSuccess':
                if (from === 'drillDashChart') {
                    let cols = PageMethod.convertSelectData(data.cols);
                    this.setState({
                        data: cols
                    });
                };
                break;
            case 'getDashChartColsFail':
                if (from.fromPage === this.props.fromPage) {
                    if (data.errcode === 162001) {
                        this.refs.editWrap.refs.chartName.setHint(data.errmsg);
                        if (this.state.activePage === 2) {
                            this.setState({
                                activePage: 1
                            });
                        }
                    } else {
                        this.hideModal();
                        PopInfo.showinfo(data.errmsg, 'danger');
                    }
                }
            case 'drillDashChartSuccess':
                if (this.props.id === data.chart_id && data.fromPage !== 'nocallBack') {
                    let newDirll = this.SelectList.getValue();
                    if (this.props.onRefresh) this.props.onRefresh(newDirll);
                    this.close();
                }
                break;
            default:
                break;
        }
    }
    open(appID, dsID, ID, drill, copyDrillFirst) {
        this.setState({
            data: this.state.data,
            id: ID,
            drill: drill,
            copyDrillFirst: copyDrillFirst
        }, function () {
            actions.getDashChartCols({ app_id: appID, ds_id: dsID }, 'drillDashChart');
            this.refs.Modal.openModal();
        });
    }
    close() {
        this.setState({
            data: [],
            id: null,
            drill: []
        }, function () {
            this.refs.Modal.hideModal();
        });
    }
    handleCommit = () => {
        let data = this.SelectList.getValue();
        let id = this.state.id;
        let copyDrillFirst = this.state.copyDrillFirst;
        let headerData = {
            chart_id: id
        };
        let postData = {
            drill_condition: [copyDrillFirst]
        };
        if (data.length > 0) data.forEach((item) => { postData.drill_condition.push(item) });
        actions.drillDashChart(headerData, postData, 'callBack');
    }
    onSelectListChange = (group) => {
        let origindrill = [this.state.props] ? [this.state.props] : []
        this.setState({
            drill: {
                drill_condition: origindrill.concat(group)
            }
        })
    }
    render() {
        let data = this.state.data;
        let { numberOfNewGroup, origindrill: selectdrill, origindrillArr } = this.props;
        if (data && origindrillArr) {
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < origindrillArr.length; ++j) {
                    if (data[i].name == origindrillArr[j].col_desc) {
                        data.splice(i, 1);
                        break;
                    }
                }
            }
        }
        return (
            <div>
                <Modal
                    ref='Modal'
                    className={this.props.className}
                    titleName={this.props.titleName}
                    handleCommit={this.handleCommit}>
                    <SelectListAdd
                        btntit='设置下钻字段'
                        modalstring='添加下层钻取字段'
                        key='AddSliceUpModal'
                        ref={(node) => { this.SelectList = node; }}
                        isLimit={true}
                        hasItemName={false}
                        max={4}
                        origindrill={(selectdrill && selectdrill.col_desc) ? selectdrill.col_desc : ''}
                        cols={data}
                        groups={this.state.drill}
                        numberOfNewGroup={numberOfNewGroup}
                        onSelectListChange={this.onSelectListChange}
                    />
                </Modal>
            </div>
        );
    }
}
export default DrillModal;
