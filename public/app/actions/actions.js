import Reflux from 'reflux';
import req from '../common/reqs';
import systemval from '../data/SystemValue';
import PopInfo from '../component/PopInfo';
import curlang from '../lang';
import transitionToRoot from '../common/utils/transitionToRoot';
import paramSerialize from '../common/utils/paramSerialize'
import logOut from '../common/utils/logOut';
import Config from '../common/Config';

const actions = Reflux.createActions({
    updateHeight: {}, // 刷新浏览器高度
    resizeCanvas: {}, // 当点击收起、打开仪表盘列表时改变画布大小
    transferData: {}, // 组件间传递数据 { from: '', type: '', data: {} }
    updateAside: {},
    resetSelect: {},
    getCertificationHost: { children: ['success'] },
    login: { children: ['success', 'fail'] },
    logout: { children: ['success', 'fail'] },
    getApps: { children: ['success'] }, // 左侧导航栏-应用]
    addDashChart: { children: ['success', 'fail'] },
    editDashChart: { children: ['success', 'fail'] },
    delDashChart: { children: ['success'] },
    getDashboardList: { children: ['success'] },
    getDashList: { children: ['success'] },
    getChartDetailData: { children: ['success', 'fail'] },
    getDashChartData: { children: ['success', 'fail'] },
    getDashChartData2: { children: ['success'] },
    verifyDataLength: { children: ['success'] },
    getDashboardShareUser: { children: ['success'] },
    getDashChartDetail: { children: ['success'] },
    checkDs: { children: ['success', 'fail'] },
    getDashChartCols: { children: ['success', 'fail'] },
    commitSortCanvas: { children: ['success', 'fail'] },
    addSliceUp: { children: ['success', 'fail'] },
    getAppColValues: { children: ['success'] },
    refreshDashChartData: { children: ['success'] },
    drillDashChart: { children: ['success', 'fail'] },
    getAllCanvasSort: { children: ['success', 'fail'] },
    getDataSourceList: { children: ['success'] },
    /**************此处定义的action不与后台交互***************/
    resizeEcharts: { children: ['success'] }, // 刷新所有图表大小
    syncSwitchslicer: { children: ['success'] },
    syncTablesPage: { children: ['success'] }
});
const errorHandle = function (errcode, errmsg) {
    if (errcode === 161001) {
        PopInfo.showinfo(errmsg, 'danger');
        setTimeout(function () {
            logOut();
            transitionToRoot();
        }, 1000);
    } else {
        PopInfo.showinfo(errmsg, 'danger');
    }
};
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
        PopInfo.showloading(true);
    } else {
        PopInfo.showloading(option.showloading);
    }
    if (option.noheader) {
        headers = true;
    }
    req({
        responseType: option.responseType || '',
        fTitle: option.fTitle || '',
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
                    PopInfo.showinfo(resp.errmsg, 'danger');
                    setTimeout(function () {
                        logOut();
                        transitionToRoot();
                    }, 1000);
                } else if (resp.errcode === 171001) {
                    transitionToRoot('user');
                } else {
                    if (option.error) {
                        option.error(resp);
                    } else {
                        errorHandle(resp.errcode, resp.errmsg);
                    }
                }
            }
            PopInfo.hideloading();
        },
        error: function (errinfo) {
            if (option.error) {
                option.error({
                    status: systemval.errorcode,
                    errcode: '',
                    errmsg: '网络错误！'
                });
            } else {
                errorHandle(1, '网络错误！');
            }
            PopInfo.showloading();
        }
    });
};
// 登陆
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
// 退出
actions.logout.listen(function () {
    actionFunc({
        url: '/lae/auth/user/logout/',
        headers: true,
        type: 'POST',
        self: this
    });
});
// 左侧导航栏-应用
actions.getApps.listen(function () {
    let self = this;
    actionFunc({
        url: '/lae/org/apps',
        headers: true,
        type: 'GET',
        self: this
    });
});
// 获取仪表盘列表
actions.getDashboardList.listen(function (fromData = null, data = {}, from) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/server/dashboard/list',
        type: 'GET',
        headers: true,
        data: data,
        success: function (resp) {
            self.success(resp, fromData, from);
        }
    });
});
// Dashboard-进入页面时先获取总共有多少图表
actions.getDashList.listen(function (fromPage = '', data, formShareUserName) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/dashboard/chart/list',
        type: 'GET',
        headers: true,
        data: data,
        success: function (resp) {
            self.success(resp, fromPage, formShareUserName);
        }
    });
});
// Dashboard-获取图表的 详情的数据
actions.getChartDetailData.listen(function (data) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/cal/tasks/dashboardnew3?' + paramSerialize(data.urlData),
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
// Dashboard-获取图表的数据
actions.getDashChartData.listen(function (urlData, postData, fromPage) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/cal/tasks/dashboardnew3?' + paramSerialize(urlData),
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
            PopInfo.showinfo(resp.errmsg, 'danger');
        }
    });
});
// Dashboard-获取图表的数据
actions.getDashChartData2.listen(function (urlData, postData, fromPage) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/dashboard/chart/download?' + paramSerialize(urlData),
        contentType: 'application/json',
        type: 'POST',
        headers: true,
        data: postData,
        showloading: false,
        responseType: 'blob',
        fTitle: urlData.title,
        success: function (resp) {
            self.success(resp, urlData, postData, fromPage);
        }
    });
});
// 验证数据是否超过2000条数据
actions.verifyDataLength.listen(function (urlData, postData, fromPage, isChangeCondtion) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/cal/tasks/dashboardnew3?' + paramSerialize(urlData),
        contentType: 'application/json',
        type: 'POST',
        headers: true,
        data: postData,
        showloading: true,
        success: function (resp) {
            self.success(resp, urlData, postData, fromPage, isChangeCondtion);
        }
    });
});
// Dashboard 获取图表的分享用户列表
actions.getDashboardShareUser.listen(function (data, from = null) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/server/dashboard/share/users',
        type: 'GET',
        headers: true,
        data: data,
        success: function (resp) {
            self.success(resp, from);
        }
    });
});
// Dashboard-图表的详细配置
actions.getDashChartDetail.listen(function (data) {
    actionFunc({
        self: this,
        url: '/lae/dashboard/chart/detailnew2',
        type: 'GET',
        headers: true,
        data: data
    });
});
// 校验数据源是否可用
actions.checkDs.listen(function (data, from) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/org/datasource/check',
        type: 'POST',
        headers: true,
        data: data,
        success: function () {
            self.success(from);
        },
        error: function (err) {
            self.fail(err, from);
        }
    });
});
// Dashboard-获取应用的配置字段
actions.getDashChartCols.listen(function (data, from) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/dashboard/chart/cols',
        type: 'GET',
        headers: true,
        data: data,
        success: function (resp) {
            self.success(resp, from);
        },
        error: function (resp) {
            self.fail(resp);
        }
    });
});
// 对画布进行排序
actions.commitSortCanvas.listen(function (data, headerData) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/server/dashboard/chart/sort?' + paramSerialize(headerData),
        type: 'POST',
        headers: true,
        data: data,
        contentType: 'application/json',
        success: function (resp) {
            self.success(resp);
            PopInfo.showinfo('画布排序成功', 'success');
        },
        error: function (resp) {
            PopInfo.showinfo('画布排序失败', 'danger');
        }
    });
});
// 创建 编辑 画布切片器
actions.addSliceUp.listen(function (headerData, bodyData, slicerChanged) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/dashboard/chart/slicer/edit?' + paramSerialize(headerData),
        type: 'POST',
        headers: true,
        data: bodyData,
        contentType: 'application/json',
        success: function (resp) {
            self.success(resp, slicerChanged);
        },
    });
});
/*
获取行业
1. Dashboard-->画布筛选模态框-->筛选条件-->获取查询字段 值下拉列表
2. 普通平台-->销售线索详情页-->线索统计 配置筛选条件-->获取查询字段 值下拉列表
*/
actions.getAppColValues.listen(function (data, from = '') {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/org/app/col/values2',
        headers: true,
        type: 'GET',
        data: data,
        success: function (resp) {
            self.success(resp, from);
        }
    });
});
// 刷新 dashborad
actions.refreshDashChartData.listen(function (urlData, postData, fromPage, targetPage) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/cal/tasks/dashboardnew3?' + paramSerialize(urlData),
        contentType: 'application/json',
        type: 'POST',
        headers: true,
        data: postData,
        showloading: true,
        success: function (resp) {
            self.success(resp, urlData, postData, fromPage, targetPage);
        }
    });
});
// Dashboard-下钻
actions.drillDashChart.listen(function (fromData, postData, fromPage) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/dashboard/chart/drill/edit?' + paramSerialize(fromData),
        contentType: 'application/json',
        type: 'POST',
        headers: true,
        data: postData,
        success: function (resp) {
            self.success(fromData, fromPage);
        },
        error: function (resp) {
            self.fail(resp, fromData, fromPage);
        }
    });
});
// 从全屏返回后、刷新图标的大小
actions.resizeEcharts.listen(function () {
    this.success();
});
/**
 * 全屏改变切片器值时、同步到main界面
 * @param {obj} data 切片器数据
 */
actions.syncSwitchslicer.listen(function (data) {
    this.success(data);
});
/**
 * 全屏时同步更新，main界面page
 * @param {num} page 同步的页码
 */
actions.syncTablesPage.listen(function (page) {
    this.success(page);
});
// Dashboard-添加画布
actions.addDashChart.listen(function (fromData, postData, fromPage) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/dashboard/chart/add?' + paramSerialize(fromData),
        contentType: 'application/json',
        type: 'POST',
        headers: true,
        data: postData,
        success: function (resp) {
            self.success(resp, fromData, fromPage);
        },
        error: function (resp) {
            self.fail(resp, fromData, fromPage);
        }
    });
});
// Dashboard-编辑画布
actions.editDashChart.listen(function (fromData, postData, fromPage) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/dashboard/chart/edit?' + paramSerialize(fromData),
        contentType: 'application/json',
        type: 'POST',
        headers: true,
        data: postData,
        success: function (resp) {
            self.success(fromData, fromPage);
        },
        error: function (resp) {
            self.fail(resp, fromData, fromPage);
        }
    });
});
// Dashboard-删除
actions.delDashChart.listen(function (data, fromData, fromPage = '') {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/dashboard/chart/del',
        type: 'POST',
        headers: true,
        data: data,
        success: function (resp) {
            self.success(fromData, fromPage);
        }
    });
});
// 获取某仪表盘下左右画布
actions.getAllCanvasSort.listen(function (data) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/server/dashboard/chart/list?' + paramSerialize(data),
        type: 'GET',
        headers: true,
        success: function (resp) {
            self.success(resp);
        },
    });
});
// 获取数据源列表
actions.getDataSourceList.listen(function (data, from) {
    let self = this;
    actionFunc({
        self: this,
        url: '/lae/org/datasource/list',
        type: 'GET',
        headers: true,
        data: data,
        success: function (resp) {
            self.success(resp, from);
        }
    });
});
module.exports = actions;

