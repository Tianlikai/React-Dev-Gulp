const Reflux = require('reflux');
const actions = require('../actions/actions');

const DashboardStore = Reflux.createStore({
    listenables: actions,
    onGetDashListSuccess: function (data, fromPage, formShareUserName) {
        this.trigger('getDashListSuccess', data.list, fromPage, formShareUserName);
    },
    onGetSharedDashListSuccess: function (data, fromPage) {
        this.trigger('getSharedDashListSuccess', data.list, fromPage);
    },
    onGetDashChartDataSuccess: function (resp, urlData, postData, fromPage) {
        let oData = Object.assign({}, urlData);
        oData.data = postData;
        oData.fromPage = fromPage;
        this.trigger('getDashChartDataSuccess', resp, oData);
    },
    onGetDashChartDataFail: function (resp, urlData, postData, fromPage) {
        let oData = Object.assign({}, urlData);
        oData.data = postData;
        oData.fromPage = fromPage;
        this.trigger('getDashChartDataFail', resp, oData);
    },
    onRefreshDashChartDataSuccess: function (resp, urlData, postData, fromPage, targetPage) {
        let oData = Object.assign({}, urlData);
        oData.data = postData;
        oData.fromPage = fromPage;
        oData.targetPage = targetPage;
        this.trigger('refreshDashChartDataSuccess', resp, oData);
    },
    onGetDashChartData2Success: function (resp, urlData, postData, fromPage) {
        this.trigger('getDashChartData2Success', resp);
    },
    // Dashboard-可选的应用app
    onGetDashboardAppsSuccess: function (data) {
        this.trigger('getDashboardAppsSuccess', data);
    },
    onGetDashChartDetailSuccess: function (data) {
        this.trigger('getDashChartDetailSuccess', data);
    },
    onGetDashChartColsSuccess: function (data, from) {
        this.trigger('getDashChartColsSuccess', data, from);
    },
    onGetDashChartColsFail: function (data) {
        this.trigger('getDashChartColsFail', data);
    },
    onGetPublishUserSuccess: function (data, from) {
        if (from === 'Dashboard') {
            this.trigger('getPublishUserSuccess', data);
        }
    },
    onAddDashChartSuccess: function (data, fromData, fromPage) {
        let oData = Object.assign({}, fromData);
        oData.fromPage = fromPage;
        this.trigger('addDashChartSuccess', data, oData);
    },
    onAddDashChartFail: function (resp, fromData, fromPage) {
        let oData = Object.assign({}, fromData);
        oData.fromPage = fromPage;
        this.trigger('addDashChartFail', resp, oData);
    },
    onEditDashChartSuccess: function (urlData, fromPage) {
        let oData = Object.assign({}, urlData);
        oData.fromPage = fromPage;
        this.trigger('editDashChartSuccess', oData);
    },
    onEditDashChartFail: function (resp, urlData, fromPage) {
        let oData = Object.assign({}, urlData);
        oData.fromPage = fromPage;
        this.trigger('editDashChartFail', resp, oData);
    },
    onDelDashChartSuccess: function (fromData, fromPage) {
        this.trigger('delDashChartSuccess', fromData, fromPage);
    },
    // 发布至app
    onPublishAppSuccess: function (from) {
        if (from === 'Dashboard') {
            this.trigger('publishAppSuccess');
        }
    },
    onPublishAppFail: function (res, from) {
        if (from === 'Dashboard') {
            this.trigger('publishAppFail', res);
        }
    },
    onGetChartShareUserSuccess: function (resp, from) {
        this.trigger('getChartShareUserSuccess', resp, from);
    },
    // 发布至app
    onShareChartSuccess: function (from) {
        this.trigger('shareChartSuccess', from);
    },
    onShareChartFail: function (res, from) {
        this.trigger('shareChartFail', res, from);
    },
    onGetChartDetailDataSuccess: function (data, from) {
        this.trigger('getChartDetailDataSuccess', data, from);
    },
    onGetChartDetailDataFail: function (data, from) {
        this.trigger('getChartDetailDataFail', data, from);
    },
    onCommitMoveCanvnsToSuccess: function (data, canvasId) {
        this.trigger('onCommitMoveCanvnsToSuccess', data, canvasId);
    },
    onCommitCopyCanvnsToSuccess: function (data, canvasId) {
        this.trigger('onCommitCopyCanvnsToSuccess', data, canvasId);
    },
    onCommitSortCanvasSuccess: function (data) {
        this.trigger('onCommitSortCanvasSuccess', data);
    },
    onGetAllCanvasSortSuccess: function (data) {
        this.trigger('onGetAllCanvasSortSuccess', data);
    },
    onAddRecommendationEngineSuccess: function (data, modelName) {
        this.trigger('onAddRecommendationEngineSuccess', data, modelName);
    },
    onAddRecommendationEngineFail: function (data) {
        this.trigger('onAddRecommendationEngineFail', data);
    },
    onEditRecommendationEngineSuccess: function (data) {
        this.trigger('onEditRecommendationEngineSuccess', data);
    },
    onEditRecommendationEngineFail: function (data) {
        this.trigger('onEditRecommendationEngineFail', data);
    },
    onAddSliceUpSuccess: function (data, slicerChanged) {
        this.trigger('addSliceUpSuccess', data, slicerChanged);
    },
    onVerifyDataLengthSuccess: function (resp, urlData, postData, fromPage, isChangeCondtion) {
        let oData = Object.assign({}, urlData);
        oData.data = postData;
        oData.fromPage = 'verifyDataLength';
        this.trigger('verifyDataLengthSuccess', resp, oData, fromPage, isChangeCondtion);
    },
    onDrillDashChartSuccess: function (urlData, fromPage, isChangeCondtion) {
        let oData = Object.assign({}, urlData);
        oData.fromPage = fromPage;
        this.trigger('drillDashChartSuccess', oData, isChangeCondtion);
    },
    onDrillDashChartFail: function (resp, urlData, fromPage) {
        let oData = Object.assign({}, urlData);
        oData.fromPage = fromPage;
        this.trigger('drillDashChartFail', resp, oData);
    },
    onSyncSwitchslicerSuccess: function (data) {
        this.trigger('syncSwitchslicerSuccess', data);
    }
});
module.exports = DashboardStore;
