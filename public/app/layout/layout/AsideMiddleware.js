'use strict';

/**
 * 左侧导航栏数据处理中间件，不可多组件复用
 * @type {Object}
 * @author will
 */
module.exports = {
    /**
     * 整理好的数据
     * @type {Array}
     */
    formattedData: [],
    /**
     * 展开状态
     * @type {Object}
     */
    openStatus: {
        getValue: function (name) {
            let keys = Object.keys(this);
            for (let i = 0; i < keys.length; i++) {
                if (name.toString() === keys[i]) {
                    return this[name].open;
                }
            }
            return false;
        }
    },
    /**
     * 传入数据
     */
    set: function (deplist, activeDepId) {
        this.formattedData = this.listWrap(deplist, activeDepId);
    },
    get: function () {
        return this.formattedData;
    },
    setOpenStatus: function (id, openStatus) {
        this.formattedData = this.editAttr(this.formattedData, id, openStatus);
    },
    listWrap: function (deplist, activeDepId) {
        let deplistNew = deplist;
        if (deplist.length > 0) {
            if (activeDepId === deplist[0].id) {
                this.openStatus[deplist[0].id] = {
                    open: true
                };
            }
            deplistNew = this.addAttr(deplist, activeDepId);
        }
        return deplistNew;
    },
    addAttr: function (deplist, activeDepId) {
        return deplist.map((item) => {
            item.open = this.openStatus.getValue(item.id);
            item.isActive = activeDepId === item.id;
            if (item.subMenus && item.subMenus.length > 0) {
                this.addAttr(item.subMenus, activeDepId);
                item.open = item.open || this.checkSubHasOpen(item, activeDepId);
            }
            return item;
        });
    },
    editAttr: function (depList, id, openStatus) {
        return depList.map((item) => {
            if (item.id === id) {
                this.openStatus[id] = {
                    open: openStatus
                };
                item.open = openStatus;
                item.isActive = true;
            } else {
                item.isActive = false;
            }
            if (item.sub_dep.length > 0) {
                this.editAttr(item.sub_dep, id, openStatus);
            }
            return item;
        });
    },
    /**
     * 检测子节点是否为open or isActive
     * @param  {[object]} obj 当前节点
     * @return {[bool]}
     */
    checkSubHasOpen: function (obj, activeDepId) {
        let hasOpen = false;

        obj.subMenus.forEach(function (item) {
            if (!hasOpen) {
                hasOpen = item.open === true ||
                    item.id === activeDepId;
            }
        }, this);

        return hasOpen;
    },
    /**
     * 判断是数据是否相等
     */
    isEqual(base, next) {
        if (base.length !== next.length) {
            return false;
        }
        for (let i = 0; i < base.length; i++) {
            if (base[i].id !== next[i].id ||
                    base[i].sub_dep.length !== next[i].sub_dep.length ||
                    base[i].department_name !== next[i].department_name) {
                return false;
            }
            if (base[i].sub_dep.length > 0) {
                var res = this.isEqual(base[i].sub_dep, next[i].sub_dep);
                if (res === false) {
                    return false;
                }
            }
        }
        return true;
    }
};
