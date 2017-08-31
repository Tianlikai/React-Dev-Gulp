import Reflux from 'reflux';
import Util from '../common/Util';
import Config from '../common/Config';
import curlang from '../lang';
import req from "../common/req";
import systemval from "../data/systemValue";

const actions = Reflux.createActions(
    {
        updateHeight: {},
        login: { children: ['success', 'fail'] },
        getApps: { children: ['success'] }, // 左侧导航栏-应用
        getDashList: { children: ['success'] },
        getChartDetailData: { children: ['success', 'fail'] },
        getDashChartData: { children: ['success', 'fail'] },
    }
)

const actionFunc = function (option) {
    // req 默认 post
    var self = option.self;
    var url = option.url;
    var headers = {
        'SESSION-TOKEN': localStorage.getItem('token'),
        LANGUAGE: curlang() === 'en' ? 'en_US' : 'zh_CN',
        'Cache-Control': 'no-cache'
    };
    if (option.type && option.type == 'GET') {
        headers = {
            'SESSION-TOKEN': localStorage.getItem('token'),
            LANGUAGE: curlang() === 'en' ? 'en_US' : 'zh_CN',
            'Cache-Control': 'no-cache',
            'If-Modified-Since': '0'
        };
    }
    if (option.showloading === undefined) {
        // PopInfo.showloading(true);
        console.log(" PopInfo.showloading(true);");
    } else {
        // PopInfo.showloading(option.showloading);
        console.log(" PopInfo.showloading(option.showloading);");
    }

    if (option.noheader) {
        headers = true;
    }
    req({
        url: url,
        contentType: option.contentType || null,
        type: option.type || 'POST',
        data: option.data || null,
        headers: option.headers ? headers : null,
        success: function (resp) {
            if (resp.status == systemval.successcode) {
                if (option.success) {
                    option.success(resp.result || {});
                } else {
                    self.success(resp.result || {});
                }
            } else {
                if (typeof (resp.errmsg) !== 'string' && typeof (resp.errmsg) !== 'number') {
                    resp.errmsg = Config.errmsg;
                }
                // 161001 表示 1. token过期 退出登录
                if (resp.errcode === 161001) {
                    // PopInfo.showinfo(resp.errmsg, 'danger');
                    console.log("PopInfo.showinfo(resp.errmsg, 'danger');");
                    setTimeout(function () {
                        // Util.logout();
                        // Util.transitionToRoot();
                        alert("Root");
                    }, 1000);
                } else if (resp.errcode === 171001) {
                    // Util.transitionToRoot('user');
                    alert('user')
                } else {
                    if (option.error) {
                        option.error(resp);
                    } else {
                        alert('errhandle')
                        // errorHandle(resp.errcode, resp.errmsg);
                    }
                }
            }
            // PopInfo.showloading(false);
            console.log("PopInfo.showloading(false);");
        },
        error: function (errinfo) {
            // errorHandle(1, 'Internal Server Error~~');
            // PopInfo.showloading(false);
            console.log("errhandle showloding");
        }
    });
};

/**
 * 登陆
 */
actions.login.listen(function (data) {
    let self = this;
    actionFunc({
        url: '/lae/auth/login',
        data: data,
        headers: true,
        type: 'POST',
        self: this,
        success: function (resp) {
            self.success(resp);
        },
        error: function (resp) {
            self.fail(resp.errmsg);
        }
    });
});
/**
 *  左侧导航栏-应用
 */
actions.getApps.listen(function () {
    let self = this;
    actionFunc({
        url: '/lae/org/apps',
        headers: true,
        type: 'GET',
        self: this
    });
});
/**
 * Dashboard-进入页面时先获取总共有多少图表
 */
actions.getDashList.listen(function (fromPage = '') {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/dashboard/chart/list',
        type: 'GET',
        headers: true,
        success: function (resp) {
            self.success(resp, fromPage);
        }
    });
});
/**
 * Dashboard-获取图表的 详情的数据
 */
actions.getChartDetailData.listen(function (data) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/cal/tasks/dashboardnew?' + Util.paramSerialize(data.urlData),
        contentType: 'application/json',
        type: 'POST',
        headers: true,
        data: data.postData,
        showloading: false,
        success: function (resp) {
            self.success(resp, data);
        }
    });
});
/**
 * Dashboard-获取图表的数据
 */ 
actions.getDashChartData.listen(function (urlData, postData, fromPage) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/cal/tasks/dashboardnew?' + Util.paramSerialize(urlData),
        contentType: 'application/json',
        type: 'POST',
        headers: true,
        data: postData,
        showloading: false,
        success: function (resp) {
            self.success(resp, urlData, postData, fromPage);
        },
        error: function (resp) {
            self.fail(resp, urlData, postData, fromPage);
        }
    });
});
export default actions;