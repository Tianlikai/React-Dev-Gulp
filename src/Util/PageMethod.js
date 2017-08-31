import Util from "../common/Util";

const pageMethod = {
    getAllUrls: function (menus) {
        let urls = [];
        for (let i = 0, j = menus.length; i < j; i++) {
            if (menus[i].subMenus.length > 0) {
                let subMenus = this.getAllUrls(menus[i].subMenus);
                for (let x = 0, y = subMenus.length; x < y; x++) {
                    urls.push(subMenus[i].to);
                }
            } else {
                urls.push(menus[i].to);
            }
        }
        return urls;
    },
    // 根据 apps 获取 asideData
    getAsideData: function (apps, localAsideData) {
        let asideData = [];
        for (let i = 0, j = apps.length; i < j; i++) {
            for (let x = 0, y = localAsideData.length; x < y; x++) {
                if (apps[i].id === localAsideData[x].id) {
                    asideData.push(localAsideData[x]);
                    break;
                }
            }
        }
        return asideData;
    },
    // 从一个数组对象中，根据多个id 获取相应的数据
    getDataByIds: function (ids, list, k) {
        let data = [];
        for (let i = 0, j = ids.length; i < j; i++) {
            for (let x = 0, y = list.length; x < y; x++) {
                if (ids[i] === list[x][k]) {
                    data.push(list[x]);
                    break;
                }
            }
        }
        return data;
    },
    // 检测是否有进入页面的权限
    checkPagePermission: function (type, props) {
        if (props.isAsideActive) {
            let flag = true;
            let a = props.asideData;
            let id = props.app.id;
            for (let i = 0, j = a.length; i < j; i++) {
                if (id === a[i].id) {
                    flag = false; // url路由合法
                    break;
                }
            }
            if (flag) {
                Util.transitionToRoot(type);
            }
        }
    },
    // 浏览器高度 - 顶部 - 底部 - 顶部下面的2级菜单 - 标题titleDiv
    getInnerHeight2: function () {
        return Util.getContentMinHeight() - 110;
    },
}

export default pageMethod;
