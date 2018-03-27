const Reflux = require('reflux');
const actions = require('../actions/actions');
const AsideData = require('../data/AsideData');
const transitionToRoot = require('../common/utils/transitionToRoot');
const logOut = require('../common/utils/logOut');

const asideDataStore = Reflux.createStore({
    listenables: actions,
    onGetAppsSuccess: function (data) {
        this.trigger('getAppsSuccess', data.list);
    },
    onGetAdminAppsSuccess: function (data) {
        this.trigger('getAdminAppsSuccess', data.list);
    },
    updateAside: function (menu, submenu) {
        let tdata = this.setDate(menu);
        this.trigger(tdata);
    },
    getData: function (menu) {
        return this.setDate(menu);
    },
    // 循环遍历和回调，设置active为false
    emptydata: function (data) {
        data.forEach(function (item, i) {
            item.active = false;
            if (item.subMenus) {
                this.emptydata(item.subMenus);
            }
        }.bind(this));
        return data;
    },
    // 根据menu与AsideData中的subtitle或title比较，相等则设置active为true
    setDate: function (menu) {
        let userType = localStorage.getItem('usertype');
        if (userType === '1') {
            this.data = AsideData.adminData;
        } else {
            this.data = AsideData.adminData;
        }
        if (menu) {
            let menuarr = menu.split('/');
            let nordata = this.emptydata(this.data);
            let adata = nordata;
            for (let i = 0; i < menuarr.length; i++) {
                let curmenu = menuarr[i];
                if (curmenu && adata && adata.length > 0) {
                    for (let j = 0; j < adata.length; j++) {
                        let dtitle = adata[j].subtitle || adata[j].title;
                        if (dtitle === curmenu) {
                            // if(i == (menuarr.length-1)){
                            adata[j].active = true;
                            // }
                            adata = adata[j].subMenus;
                            break;
                        }
                    }
                }
            }
            return nordata;
        }
        return null;
    },
    toggleData: function (depth, curobj) { // 替换
        let deptharr = depth.split('-');
        let adata = this.emptydata(this.data);
        adata.splice(deptharr[0], 1, curobj);
        if (deptharr.length === 1) {
            adata[deptharr[0]].active = !adata[deptharr[0]].active;
        } else {
            let ac = adata[deptharr[0]].subMenus[deptharr[1]].active;
            adata[deptharr[0]].subMenus[deptharr[1]].active = !ac;
        }
        return adata;
    },
    onLogoutSuccess: function () {
        logOut();
        transitionToRoot();
    },
});
module.exports = asideDataStore;
