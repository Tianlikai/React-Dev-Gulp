import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Container from './Container';
import Modal from '../../../../../jComponent/modal/Modal';
import actions from '../../../../../actions/actions';

class SortCanvasModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = this.setDefaultState();
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.handleConfig = this.handleConfig.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);
    }
    static propTypes = {
        className: PropTypes.string, // classname  
        titleName: PropTypes.string, // 模态框标题
        canvasFrom: PropTypes.string, // 画布所属仪表盘名称
        dashboardId: PropTypes.number, // 画布所属仪表盘id
        canvasList: PropTypes.array, // 画布列表 仅包含名称和id
        canvasListAll: PropTypes.array, // 包含所有信息的画布列表
        sortCanvasList: PropTypes.func, // 画布排序回掉函数
    }
    setDefaultState() {
        return {
            canvasId: null, // 画布id
            choosed: false, // 是否有选项选中
            canvasList: [],
            dirction: ''
        };
    }
    open() {
        this.setState({
            canvasList: this.props.canvasList,
        }, function () {
            this.Modal.openModal();
        })
    }
    close() {
        this.Modal.hideModal();
    }
    moveUp() {
        if (!this.state.choosed) return null;
        this.setState({
            dirction: 'up'
        }, function () {
            this.setState({
                dirction: ''
            })
        }
        );
    }
    moveDown() {
        if (!this.state.choosed) return null;
        this.setState({
            dirction: 'down'
        }, function () {
            this.setState({
                dirction: ''
            })
        });
    }
    handleSelect(canvasId, choosed, dirction) {
        this.setState({
            canvasId: canvasId,
            choosed: choosed,
            dirction: dirction
        })
    }
    cards(cards) {
        this.setState({
            canvasList: cards
        })
        if (this.props.sortCanvasList) this.props.sortCanvasList(cards);
    }
    // 提交
    handleConfig() {
        let data = {};
        let list = [];
        let headerData = {
            dashboard_id: this.props.dashboardId
        }
        this.state.canvasList.forEach(function (item, index) {
            let obj = {};
            obj['chart_id'] = parseInt(item.id);
            obj['chart_sort'] = parseInt(index);
            list.push(obj);
        });
        data['list'] = list;
        actions.commitSortCanvas(data, headerData);
    }
    render() {
        let list = this.state.canvasList;
        let canvasListstate = {
            canvasId: this.state.canvasId,
            dirction: this.state.dirction
        };
        return (
            <Modal
                ref={Modal => this.Modal = Modal}
                className={this.props.className}
                titleName={this.props.titleName}
                handleCommit={this.handleConfig}
            >
                <div>
                    <div className='showCanvasListTitle'>画布列表</div>
                    <div className='showCanvasListCenter'>
                        <ul
                            ref={showCanvasListWrapper => this.showCanvasListWrapper = showCanvasListWrapper}
                            className='showCanvasListWrapper'
                        >
                            <Container
                                ref={moveCanvasList => this.moveCanvasList = moveCanvasList}
                                card={list}
                                handleSelect={this.handleSelect.bind(this)}
                                handleConfig={this.cards.bind(this)}
                                canvasListstate={canvasListstate}
                            />
                        </ul>
                        <div className={this.props.className + 'method'} style={{ height: '100%', cursor: 'default' }}>
                            <div onClick={this.moveUp}>
                                <img src={'./dist/images/configurationToUp.svg'} alt="上移" />
                            </div>
                            <div onClick={this.moveDown}>
                                <img src={'./dist/images/configurationToDown.svg'} alt="下移" />
                            </div>
                        </div>
                        <div className='showCanvasListFotter'>
                            <img src="./dist/images/Exclamationmark.svg" alt="" />
                            <span>您可通过选中画布并通过右侧按钮调节或直接拖动画布来对画布进行排序</span>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default SortCanvasModal;