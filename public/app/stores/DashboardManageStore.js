const Reflux = require('reflux');
const actions = require('../actions/actions');
const Config = require('../common/Config');

const DashboardManageStore = Reflux.createStore({
    listenables: actions,
    onGetDashboardListSuccess: function (data, fromData, from2) {
        this.trigger('getDashboardListSuccess', data.list, fromData, from2);
    },
    onAddDashboardSuccess: function () {
        this.trigger('addDashboardSuccess');
    },
    onAddDashboardFail: function (resp) {
        this.trigger('addDashboardFail', resp);
    },
    onEditDashboardSuccess: function (id) {
        this.trigger('editDashboardSuccess', id);
    },
    onEditDashboardFail: function (resp) {
        this.trigger('editDashboardFail', resp);
    },
    onDelDashboardSuccess: function () {
        this.trigger('delDashboardSuccess');
    },
    onGetDashboardShareUserSuccess: function (resp, from) {
        this.trigger('getDashboardShareUserSuccess', resp, from);
    }
    // onGetRoleUserListSuccess: function (data, fromData) {
    //     let oData = Util.completionData1(data, 'list', 'id', 10);
    //     this.trigger('getRoleUserListSuccess', oData, fromData);
    // },
    // onDelRoleUserSuccess: function () {
    //     this.trigger('delRoleUserSuccess');
    // },
    // onGetRoleUserDetailSuccess: function (data) {
    //     this.trigger('getRoleUserDetailSuccess', data);
    // },
    // onGetDepListSuccess: function (data) {
    //     this.trigger('getDepListSuccess', data);
    // },
    // onGetDepUserListSuccess: function (data, from) {
    //     let pageLimit = Config.pageLimit1;
    //     let respData = {
    //         total: data.total
    //     };
    //     let resp = data.items;
    //     // 10条数据
    //     if (resp.length < pageLimit) {
    //         let item = {
    //             uuid: ''
    //         };
    //         let emptyList = [];
    //         for (let i = 0, j = pageLimit - resp.length; i < j; i++) {
    //             emptyList.push(item);
    //         }
    //         respData.items = resp.concat(emptyList);
    //     } else {
    //         respData.items = resp;
    //     }
    //     this.trigger('getDepUserListSuccess', respData, from);
    // },
    // onAddRoleUserSuccess: function () {
    //     this.trigger('addRoleUserSuccess');
    // },
    // onGetRolePermissionSuccess: function (data) {
    //     this.trigger('getRolePermissionSuccess', data);
    // },
    // onEditRolePermissionSuccess: function () {
    //     this.trigger('editRolePermissionSuccess');
    // }
});

module.exports = DashboardManageStore;
