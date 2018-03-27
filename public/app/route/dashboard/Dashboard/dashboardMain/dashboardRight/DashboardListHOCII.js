import React from 'react';
import actions from '../../../../../actions/actions';
import DashboardListHeader from './DashboardListHeader';
import AddModal from '../AddModal';
import SortCanvasModal from '../sortCanvasModal/sortCanvasModal';
import IsShowCanvasModal from '../isShowCanvasModal/IsShowCanvasModal';

const NoDashboard = () =>
    <div className='dashboardPage'>
        <div className='noDashBoard-show'>
            还没有创建仪表盘哦~
        </div>
    </div>;

const NoCanvasBySelf = () =>
    <div style={{ height: 620 }}><div className='dbp-nocanvas-createByMe'>
        <img className='navigation_CreateCanvas' src="./dist/images/navigation_CreateCanvas.svg" />
        < div > <span>暂无画布、您可点击右上角 “</span> <img src="./dist/images/Create_Canvas.svg" /> <span>” 创建画布</span></div>
    </div ></div >;

const NoCanvasBySharing = () =>
    <div style={{ height: 620 }}><div className='dbp-nocanvas-fromSharing'>暂无画布</div></div>;

const getDisplayName = (component) => component.displayName || component.name || 'Component';

const DashboardListHOCII = WrappedComponent => class HOCII extends WrappedComponent {
    static displayName = `HOCII(${getDisplayName(WrappedComponent)})`;
    /**
     * 打开
     * ‘新建画布’模态框
     */
    handleOpenAddModal = () => {
        this.addModal.openModal();
    }
    /**
     * 关闭
     * ‘新建画布’模态框
     */
    handleCloseAddModal = () => {
        this.addModal.hideModal();
    }
    /**
     * 打开
     * ’画布排序‘模态框
     */
    handleOpenSortModal = () => {
        let data = {
            dashboard_id: this.state.activeDashboard.id
        }
        actions.getAllCanvasSort(data);
    }
    /**
     * 返回：添加新画布数据超过2000条
     * '新建画布'模态框
     */
    handleBackToAddModal = (isVisible) => {
        this.addModal.setModalIsVisible(isVisible);
    }
    /**
     * 添加画布 刷新界面
     * @param {*} from 
     * @param {*} data 
     */
    handleAddCanvas = (from, data) => {
        // 调用 DashboardList 的函数处理
        this.handleRefreshByAddSucceses(from, data);
    }
    render() {
        let fromPageName = this.props.name; // fromPage标识
        let {
            appId, // 应用id
            activeDashboard, // 选中的仪表盘
            isSearchDispatch, // 是否触发搜索行为
            canvasList, // 画布列表
            loadedCanvasList, // 加载的画布
            canvasListSort, // 排序时的画布列表 调用的不同接口  正常的接口数量有限制
            formShareUserName // 仪表盘创建者名称
        } = this.state;

        let isFromDashBoardManagement = fromPageName === 'DashBoardManagement' ? true : false;
        let viewDom = null; // 初始化页面渲染dom

        if (!activeDashboard) { // 没有创建仪表盘
            return !isSearchDispatch ? <NoDashboard /> : null; // 是否通过搜索触发
        } else { // 有仪表盘
            if (loadedCanvasList && loadedCanvasList.length <= 0) { // 没有创建画布
                if (activeDashboard.beshared) { // 来自分享
                    viewDom = !isSearchDispatch ? <NoCanvasBySharing /> : null; // 是否通过搜索触发
                } else { // 用户创建
                    viewDom = !isSearchDispatch ? <NoCanvasBySelf /> : null; // 是否通过搜索触发
                }
            } else {// 有画布
                viewDom = super.render();
            }
        }
        let {
            beshared, // 仪表盘是否来自分享
            id, // 仪表盘id
            name // 仪表盘名称
        } = activeDashboard;
        return (
            <div ref='dashboard'>
                <DashboardListHeader
                    dashboard={activeDashboard}
                    addCanvas={this.handleOpenAddModal}
                    sortCanvas={this.handleOpenSortModal}
                    isFromSharing={beshared}
                    formShareUserName={formShareUserName}
                    canvasList={canvasList}
                />
                {viewDom}
                <SortCanvasModal
                    ref='sortCanvasModal'
                    titleName='画布排序'
                    className='showSortCanvasModal-chart-modal'
                    canvasFrom={name}
                    dashboardId={id}
                    from={appId}
                    canvasList={canvasListSort}
                    canvasListAll={canvasList}
                    sortCanvasList={this.sortCanvasList} />
                {isFromDashBoardManagement ?
                    <AddModal
                        ref='addModal'
                        ref={addModal => this.addModal = addModal}
                        fromPage={fromPageName}
                        canvasFrom={name}
                        dashboardId={id}
                        from={appId} /> : null
                }
                <IsShowCanvasModal
                    ref={instance => this.IsShowCanvasModalInstance = instance}
                    backToAddModal={this.handleBackToAddModal}
                    handleCloseModal={this.handleCloseAddModal}
                    handleAddCanvas={this.handleAddCanvas}
                    key='IsShowCanvasModalDsbPage1'
                    className='IsShowCanvasModal'
                    isDelCallBack={false}
                    methodFrom={'add'}
                    fromPage={fromPageName}>
                    <h4 className='IsShowCanvasModalHint'>当前画布仅支持显示2000条数据，是否继续显示？</h4>
                </IsShowCanvasModal>
            </div>
        )
    }
}
export default DashboardListHOCII;