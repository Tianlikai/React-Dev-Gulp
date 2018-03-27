const Reflux = require('reflux');
const actions = require('../actions/actions');

const UtilStore = Reflux.createStore({
    listenables: actions,
    // 选择数据源下拉框
    onGetDataSourceListSuccess: function (data, from) {
        if (from === 'dsSelect') {
            this.trigger('getDataSourceListSuccess', data.list);
        }
    },
    // 选择算法下拉框
    onGetAlgorithmListSuccess: function (data, from) {
        if (from === 'alg') {
            this.trigger('getAlgorithmListSuccess', data);
        }
    },
    onCheckDsSuccess: function (from) {
        this.trigger('checkDsSuccess', '', from);
    },
    onCheckDsFail: function (res, from) {
        this.trigger('checkDsFail', res, from);
    },
    // 当浏览器window.innerHeight改变时，触发
    updateHeight: function () {
        this.trigger('updateHeight');
    },
    // 当点击收起、打开仪表盘列表时改变画布大小
    resizeCanvas: function () {
        this.trigger('resizeCanvas');
    },
    onGetAppActionSuccess: function (data) {
        this.trigger('getAppActionSuccess', data.list);
    },
    // 获取有权限的行业列表
    onGetIndustriesSuccess: function (data, from) {
        this.trigger('getIndustriesSuccess', data, from);
    },
    // 获取系统地区列表
    onGetAreaSuccess: function (data) {
        this.trigger('getAreaSuccess', data);
    },
    onGetAppColValuesSuccess: function (data, from) {
        this.trigger('getAppColValuesSuccess', data.list, from);
    },
    transferData: function (data) {
        this.trigger('transferData', data);
    }
});
module.exports = UtilStore;
