const ReactDOM = require('react-dom');
const Config = require('./Config');
const deepClone = require('./utils/deepClone');
const getLegendHeight = require('./utils/getLegendHeight');
const transitionToRoot = require('./utils/transitionToRoot');
const actions = require('../actions/actions');
const SystemValue = require('../data/SystemValue');

module.exports = {
    // 简单判断用户是否登录
    checkLogin: function () {
        if (localStorage.getItem('token')) {
            return true;
        }
        return false;
    },
    // 将原始数据转换为SelectWithHint组件可用的data
    convertSelectData: function (data) {
        let newData = [];
        if (!data) return newData;
        for (let i = 0, j = data.length; i < j; i++) {
            newData.push({
                id: data[i].col_name,
                name: data[i].col_desc,
                type: data[i].col_type
            });
        }
        return newData;
    },
    // 管理员平台-数据权限-新建、编辑权限-新建、编辑字段
    convertSelectData2: function (data) {
        let newData = [];
        for (let i = 0, j = data.length; i < j; i++) {
            newData.push({
                id: data[i].col_name,
                name: data[i].col_name,
                type: data[i].col_type
            });
        }
        return newData;
    },
    // 将原始数据转换为SelectWithHint组件可用的int类型的data
    convertIntSelectData: function (data) {
        let newData = [];
        for (let i = 0, j = data.length; i < j; i++) {
            let supportType = Config.saleClues.supportType;
            if (supportType.indexOf(data[i].col_type) !== -1) {
                newData.push({
                    id: data[i].col_name,
                    name: data[i].col_desc,
                    type: data[i].col_type
                });
            }
        }
        return newData;
    },
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
    convertNumber: function (value) {
        let newValue = value;
        // 如果value存在
        if (value) {
            newValue = Number.parseFloat(value);
            // >=1万
            if (newValue >= 10000) {
                newValue = Number.parseInt(newValue, 10);
                // >=1亿
                if (newValue >= 100000000) {
                    newValue = (newValue / 100000000).toFixed(2) + '亿';
                } else {
                    newValue = (newValue / 10000).toFixed(2) + '万';
                }
            } else {
                // 不是整数
                if (newValue % 1 !== 0) {
                    newValue = newValue.toFixed(2);
                }
            }
        }
        return newValue;
    },
    // 浏览器高度 - 底部
    getInnerHeight: function () {
        let winHeight = window.innerHeight;
        if (winHeight - 96) {
            return winHeight - 96 + 52;
        } else {
            return 0 + 52;
        }
    },
    // 浏览器高度 - 顶部 - 底部 - 顶部下面的2级菜单
    getInnerHeight1: function () {
        let winHeight = window.innerHeight;
        if (winHeight - 96) {
            return winHeight - 96 - 48;
        } else {
            return 0 - 48;
        }
    },
    // 浏览器高度 - 顶部 - 底部 - 顶部下面的2级菜单 - 标题titleDiv
    getInnerHeight2: function () {
        let winHeight = window.innerHeight;
        if (winHeight - 96) {
            return winHeight - 96 - 110;
        } else {
            return 0 - 110;
        }
    },
    getInnerHeight3: function () {
        let winHeight = window.innerHeight;
        if (winHeight - 96) {
            return winHeight - 96 - 297;
        } else {
            return 0 - 297;
        }
    },
    // 浏览器高度 - 顶部 - 底部 - 顶部下面的2级菜单 - 标题titleDiv - 翻页 -表格thead
    getInnerHeight4: function () {
        let winHeight = window.innerHeight;
        if (winHeight - 96) {
            return winHeight - 96 - 198;
        } else {
            return 0 - 198;
        }
    },
    // 浏览器高度 - 模态框顶部(62) - 模态框底部(53)
    getInnerHeight5: function () {
        // modal-body padding-top(32) padding-bottom(15)
        let pageHeight = window.innerHeight;
        if (pageHeight > 200) {
            return pageHeight - 116;
        }
        return 200 - 116;
    },
    getInnerHeight6: function () {
        let winHeight = window.innerHeight;
        if (winHeight - 96) {
            return winHeight - 96 - 258;
        } else {
            return 0 - 258;
        }
    },
    // 计算thead的宽度
    calculateTheadeWidth: function () {
        let trFirst = this.refs.oTbody.childNodes[0];
        if (trFirst) {
            var tdArray = trFirst.childNodes;
            var tdHead = this.refs.oThead.childNodes;
            for (var i = 0; i < tdHead.length; i++) {
                tdHead[i].style.width = tdArray[i].offsetWidth + 'px';
            }
            // table需要设定宽度
            var samptable = ReactDOM.findDOMNode(this.refs.oTable);
            samptable.style.width = trFirst.offsetWidth + 1 + 'px';
        }
    },
    // 选择数据源-下拉框-获取数据源列表
    getDataSourceList: function () {
        let oData2 = {
            page: 1,
            size: Config.dsSelectSize
        };
        actions.getDataSourceList(oData2, 'dsSelect');
    },
    // 校验数据源是否可用
    checkDataSource: function (appId, dsId, from) {
        let oData = {
            app_id: appId, // 左侧导航栏id
            ds_id: dsId
        };
        actions.checkDs(oData, from);
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
    // 获取当前用户的一些信息
    getCurrentUser: function () {
        let userType = sessionStorage.getItem('userType');
        if (userType) {
            userType = parseInt(userType, 10);
        }
        return {
            name: localStorage.getItem('username'),
            email: localStorage.getItem('savename'),
            type: userType
        };
    },
    // 是否是管理员
    isAdminUser: function () {
        let flag = false;
        let userType = localStorage.getItem('userType');
        if (userType) {
            userType = parseInt(userType, 10);
            if (userType === 1) {
                flag = true;
            }
        }
        return flag;
    },
    // 从一个 对象数组 中删除多个 对象
    delItems: function (delList, list, id) {
        let data = deepClone(list);
        for (let i = 0, j = delList.length; i < j; i++) {
            data = data.filter(function (item) {
                return delList[i][id] !== item[id];
            });
        }
        return data;
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
    // 从一个 对象数组 中获取 对象某个字段 的集合
    getFieldsFromData: function (data, field) {
        let fields = [];
        for (let i = 0, j = data.length; i < j; i++) {
            fields.push(data[i][field]);
        }
        return fields;
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
                transitionToRoot(type);
            }
        }
    },
    // Echarts tooltip的formatter函数
    // type 为下载还是dashboard显示 false为下载 true为dashboard
    formatterTooltip: function (params, hint) {
        if (Object.prototype.toString.call(params) == '[object Object]') {
            let value = params.value === '-' ? '-' : params.value;
            let div = "<div style='padding:6px 10px 10px;'>" + params.name + "<br />";
            div += params.seriesName + "：" + value + "<br />";
            div += "</div>";
            div += `<div style='font-size:10px;padding:3px 10px 0;text-align:center;border-top:1px solid #9E9E9E;'>${hint}</div>`;
            return div;
        } else if (Object.prototype.toString.call(params) == '[object Array]') {
            let div = "<div style='padding:6px 10px 10px;'>" + params[0].name + '<br />';
            for (let i = 0, j = params.length; i < j; i++) {
                let value = params[i].value === '-' ? '-' : params[i].value;
                div += params[i].seriesName + '：' + value + '<br />';
            }
            div += '</div>';
            div += `<div style='font-size:10px;padding:3px 10px 0;text-align:center;border-top:1px solid #9E9E9E;'>${hint}</div>`;
            return div;
        }
    },
    // 提示可双击
    formatterHintWithDbClick: function (params) {
        let div = this.formatterTooltip(params, '双击可查看项目详情');
        return div;
    },
    // 提示可单击、和双击
    formatterHintWithClick: function (params) {
        let div = this.formatterTooltip(params, `单击可下钻. 双击可查看项目详情`);
        return div;
    },
    formatterTooltipDownload: function (params) {
        if (Object.prototype.toString.call(params) == '[object Object]') {
            let value = params.value === '-' ? '-' : params.value;
            let div = "<div style='padding:6px 10px 10px;'>" + params.name + "<br />";
            div += params.seriesName + "：" + value + "<br />";
            div += "</div>";
            return div;
        } else if (Object.prototype.toString.call(params) == '[object Array]') {
            let div = "<div style='padding:6px 10px 10px;'>" + params[0].name + "<br />";
            for (let i = 0, j = params.length; i < j; i++) {
                let value = params[i].value === '-' ? '-' : params[i].value;
                div += params[i].seriesName + "：" + value + "<br />";
            }
            div += "</div>";
            return div;
        }
    },
    formatterLabel(params) {
        let name = null;
        if (Object.prototype.toString.call(params.name) == '[object Number]') {
            name = params.name;
        } else if (Object.prototype.toString.call(params.name) == '[object String]') {
            name = params.name.length <= 9 ? params.name : params.name.substring(0, 9) + '...';
        }
        function dealLength(params) {
            let newValue = params.value;
            if (newValue && newValue === '-') return '-';
            if (newValue) {
                newValue = Number.parseFloat(newValue);
                if (newValue >= 10000) {
                    newValue = Number.parseInt(newValue, 10);
                    if (newValue >= 100000000) {
                        newValue = (newValue / 100000000).toFixed(2) + '亿';
                    } else {
                        newValue = (newValue / 10000).toFixed(2) + '万';
                    }
                } else {
                    if (newValue % 1 !== 0) {
                        newValue = newValue.toFixed(2);
                    }
                }
            }
            return newValue;
        }
        let value = dealLength(params)
        return name + '\n' + value;
    },
    formatterLabel2(params) {
        let name = null;
        if (Object.prototype.toString.call(params.name) == '[object Number]') {
            name = params.name;
        } else if (Object.prototype.toString.call(params.name) == '[object String]') {
            name = params.name.length <= 12 ? params.name : params.name.substring(0, 12) + '...';
        }
        function dealLength(params) {
            let newValue = params.value;
            if (newValue && newValue === '-') return '-';
            if (newValue) {
                newValue = Number.parseFloat(newValue);
                if (newValue >= 10000) {
                    newValue = Number.parseInt(newValue, 10);
                    if (newValue >= 100000000) {
                        newValue = (newValue / 100000000).toFixed(2) + '亿';
                    } else {
                        newValue = (newValue / 10000).toFixed(2) + '万';
                    }
                } else {
                    if (newValue % 1 !== 0) {
                        newValue = newValue.toFixed(2);
                    }
                }
            }
            return newValue;
        }
        let value = dealLength(params);
        if (value === '-') {
            return name + '：' + value;
        } else {
            return name + '：' + value + '(' + params.percent + '%' + ')';
        }
    },
    // 应用是否有权限
    hasPermission: function (path, list) {
        let flag = false;
        for (let i = 0, j = list.length; i < j; i++) {
            if (path === list[i]) {
                flag = true;
                break;
            }
        }
        return flag;
    },
    // 图表上面显示的数值要经过转换
    convertChartNumber: function (params) {
        let newValue = params.value;
        if (newValue && newValue === '-') return '-';
        // 如果value存在
        if (newValue) {
            newValue = Number.parseFloat(newValue);
            // >=1万
            if (newValue >= 10000) {
                newValue = Number.parseInt(newValue, 10);
                // >=1亿
                if (newValue >= 100000000) {
                    newValue = (newValue / 100000000).toFixed(2) + '亿';
                } else {
                    newValue = (newValue / 10000).toFixed(2) + '万';
                }
            } else {
                // 不是整数
                if (newValue % 1 !== 0) {
                    newValue = newValue.toFixed(2);
                }
            }
        }
        return newValue;
    },
    convertChartNumber2(newValue) {
        if (newValue || newValue == 0) {
            newValue = Number.parseFloat(newValue);
            // >=1万
            if (newValue >= 10000) {
                newValue = Number.parseInt(newValue, 10);
                // >=1亿
                if (newValue >= 100000000) {
                    newValue = (newValue / 100000000).toFixed(2) + '亿';
                } else {
                    newValue = (newValue / 10000).toFixed(2) + '万';
                }
            } else {
                // 不是整数
                if (newValue % 1 !== 0) {
                    newValue = newValue.toFixed(2);
                }
            }
        }
        return newValue;
    },
    /**
     * 获取图表配置
     * @param {*} type 图标类型
     * @param {*} chartData 图标数据，从后台获取
     * @param {*} from  
     * @param {*} isShow 是否显示数据
     * @param {*} domWidth  父级dom元素宽度 type为6和7的堆积图类型需要用来计算坐标轴宽高
     * @param {*} WhetherTheTrip 能否下钻
     */
    getChartOption: function (type, chartData, from, isShow, domWidth, WhetherTheTrip) {
        type = parseInt(type);
        if (type === 0 || !chartData || type === 4) {
            return {};
        }
        let barMaxWidth = 50;
        let dataZoomWidth = 25;
        let seriesName; // series 默认的名称
        let seriesData; // series 默认的数据
        let mainAxisLen; // 主轴的 数据长度(有多少条数据)
        // 图表类型： 1条形图，2柱状图，3折线图
        let leg = chartData.legend;
        if (leg) {
            leg.forEach(function (item, i) {
                leg[i] = item + '';
            });
        }
        let option = {};
        if (type === 1) {
            let flag = chartData.y.every((ele) => {
                return ele === '';
            });
            option = {
                tooltip: {
                    trigger: 'axis',
                    confine: true
                },
                legend: {
                    type: 'scroll',
                    orient: 'horizontal',
                    top: 0,
                    left: 0,
                    itemWidth: 13,
                    itemHeight: 13,
                    show: false,
                    data: chartData.legend,
                    pageIconSize: [10, 10],
                    tooltip: {
                        show: true,
                        confine: true
                    }
                },
                grid: {
                    left: '40px',
                    right: '6%',
                    bottom: '10%',
                    top: 60,
                    containLabel: true
                },
                xAxis: {
                    name: chartData.x_name,
                    nameLocation: 'middle',
                    nameGap: 25,
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    name: chartData.y_name,
                    type: 'category',
                    data: chartData.y,
                    axisLabel: {
                        formatter: function (value, index) {
                            if (value.length > 30) return value.substr(0, 30) + '...';
                            return value;
                        }
                    }
                },
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        start: 0,
                        end: 100,
                        yAxisIndex: 0,
                        filterMode: 'filter',
                        right: 0,
                        width: dataZoomWidth,
                        showDetail: false,
                        showDataShadow: false
                    }
                ],
                series: []
            };
            if (flag) option.grid.left = '70px';
            seriesName = chartData.x_name;
            seriesData = chartData.x;
            mainAxisLen = chartData.y.length;
        } else if (type === 2) {
            option = {
                tooltip: {
                    trigger: 'axis',
                    confine: true
                },
                legend: {
                    type: 'scroll',
                    orient: 'horizontal',
                    top: 0,
                    left: 0,
                    itemWidth: 13,
                    itemHeight: 13,
                    show: false,
                    data: chartData.legend,
                    pageIconSize: [10, 10],
                    tooltip: {
                        show: true,
                        confine: true
                    }
                },
                grid: {
                    left: '3%',
                    right: '6%',
                    bottom: '18%',
                    top: 60,
                    containLabel: true
                },
                xAxis: {
                    name: chartData.x_name,
                    nameLocation: 'middle',
                    nameGap: 25,
                    type: 'category',
                    data: chartData.x,
                    axisLabel: {
                        formatter: function (value, index) {
                            if (value.length > 20) return value.substr(0, 20) + '...';
                            return value;
                        }
                    }
                },
                yAxis: {
                    name: chartData.y_name,
                    type: 'value'
                },
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        start: 0,
                        end: 100,
                        filterMode: 'filter',
                        xAxisIndex: 0,
                        showDetail: false,
                        showDataShadow: false,
                        bottom: 20,
                        height: dataZoomWidth
                    }
                ],
                series: []
            };
            seriesName = chartData.y_name;
            seriesData = chartData.y;
            mainAxisLen = chartData.x.length;
        } else if (type === 3) {
            option = {
                tooltip: {
                    trigger: 'axis',
                    confine: true
                },
                legend: {
                    type: 'scroll',
                    orient: 'horizontal',
                    top: 0,
                    left: 0,
                    itemWidth: 13,
                    itemHeight: 13,
                    show: false,
                    data: chartData.legend,
                    pageIconSize: [10, 10],
                    tooltip: {
                        show: true,
                        confine: true
                    }
                },
                grid: {
                    left: '3%',
                    right: '6%',
                    bottom: '18%',
                    top: 60,
                    containLabel: true
                },
                xAxis: {
                    name: chartData.x_name,
                    nameLocation: 'middle',
                    nameGap: 25,
                    type: 'category',
                    data: chartData.x,
                    axisLabel: {
                        formatter: function (value, index) {
                            if (value.length > 20) return value.substr(0, 20) + '...';
                            return value;
                        }
                    }
                },
                yAxis: {
                    name: chartData.y_name,
                    type: 'value'
                },
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        start: 0,
                        end: 100,
                        filterMode: 'filter',
                        xAxisIndex: 0,
                        showDetail: false,
                        showDataShadow: false,
                        bottom: 20,
                        height: dataZoomWidth
                    }
                ],
                series: []
            };
            seriesName = chartData.y_name;
            seriesData = chartData.y;
            mainAxisLen = chartData.x.length;
        } else if (type === 5) {
            let copychartData = deepClone(chartData);
            let { x, y, x_name, y_name, sum } = copychartData;
            return this.getRingDiagramConfig(x, y[0], x_name, y_name, sum, isShow, 1, null, WhetherTheTrip);
        } else if (type === 6) {
            return this.getStripStackingGraphSrcConfig(chartData, isShow, domWidth, WhetherTheTrip);
        } else if (type === 7) {
            let domHeight = 466; // 高度默认给的466px
            return this.getColumnarStackingDiagramConfig(chartData, isShow, domHeight, WhetherTheTrip);
        }
        let seriesItem;
        let seriesItemType;
        let j = seriesData.length;
        let labelPosition = 'top';
        if (type === 1) {
            labelPosition = 'right';
            seriesItemType = 'bar';
        } else if (type === 2) {
            labelPosition = 'top';
            seriesItemType = 'bar';
        } else if (type === 3) {
            labelPosition = 'top';
            seriesItemType = 'line';
        }
        // 1个分组方式
        if (chartData.groupNum === 1) {
            let datas = this.foreachDataSetBackgroundColors(seriesData[0], 0, type)
            seriesItem = {
                name: seriesName,
                type: seriesItemType,
                barMaxWidth: barMaxWidth,
                symbolSize: 7,
                barMinHeight: 5,
                itemStyle: {
                    normal: {
                        color: Config.dashboard.colorArray[0]
                    }
                },
                label: {
                    normal: {
                        show: false,
                        position: labelPosition,
                        formatter: this.convertChartNumber,
                        textStyle: {
                            color: '#4A4A4A'
                        }
                    }
                },
                data: datas
            };
            option.series.push(seriesItem);
        } else { // 多个分组方式
            option.tooltip.trigger = 'item';
            if (type === 3) option.tooltip.trigger = 'axis';
            option.legend.show = true;
            if (j > 15) {
                option.grid.top = 120;
            } else if (j > 10) {
                option.grid.top = 100;
            } else if (j > 5) {
                option.grid.top = 80;
            }
            for (let i = 0; i < j; i++) {
                let datas = this.foreachDataSetBackgroundColors(seriesData[i], i, type);
                seriesItem = {
                    name: chartData.legend[i] + '',
                    type: seriesItemType,
                    barMaxWidth: barMaxWidth,
                    symbolSize: 7,
                    barMinHeight: 5,
                    itemStyle: {
                        normal: {
                            color: Config.dashboard.colorArray[i]
                        }
                    },
                    label: {
                        normal: {
                            show: false,
                            position: labelPosition,
                            formatter: this.convertChartNumber,
                            textStyle: {
                                color: '#4A4A4A'
                            }
                        }
                    },
                    data: datas
                };
                option.series.push(seriesItem);
            }
        }
        if (isShow) {
            for (let x = 0, y = option.series.length; x < y; x++) {
                option.series[x].label.normal.show = true;
            }
            // 时间类型的 要显示最新的
            if (chartData.group_type && (chartData.group_type[0] === 'datetime' || chartData.group_type[0] === 'date')) {
                option.dataZoom[0].start = 100 - this.getDataZoomEnd(mainAxisLen);
            } else {
                option.dataZoom[0].end = this.getDataZoomEnd(mainAxisLen);
            }
        }
        if (from === 'hasDetail') {
            option.tooltip.formatter = WhetherTheTrip ? this.formatterHintWithClick.bind(this) : this.formatterHintWithDbClick.bind(this);
        }
        return option;
    },
    //遍历data   当value为0时背景颜色设为白色
    foreachDataSetBackgroundColors: function (datas, i, type) {
        let result = [];
        datas.forEach(function (item, index) {
            let list = {};
            list.value = item === -1 ? '-' : item;
            list.itemStyle = {
                normal: {
                    color: Config.dashboard.colorArray[i]
                }
            };
            if (item === 0 && type !== 3) {
                list.itemStyle = {
                    normal: {
                        opacity: 0
                    }
                };
            }
            result.push(list);
        })
        return result;
    },
    getDataZoomEnd: function (len) {
        let end = 100;
        if (len <= 15) {
            end = 100;
        } else if (len <= 40) {
            end = 50;
        } else if (len <= 100) {
            end = 20;
        } else if (len <= 200) {
            end = 10;
        } else if (len <= 400) {
            end = 5;
        } else if (len <= 1000) {
            end = 2;
        } else {
            end = 1;
        }
        return end;
    },
    /**
     * EditModal、AddModal、GraphSetup界面
     * 根据选择图表显示方式
     * 获取度量方式和分组方式
     * type数字型，传入当前类型
     */
    getMeasureOrGroupType: function (type) {
        let labelObj = {};
        labelObj.labelForMeasurePattern = "度量方式（X轴）";
        labelObj.labelForGroupPattern = "分组方式（Y轴）";
        switch (type) {
            case 1:
            case 6:
                labelObj.labelForMeasurePattern = '度量方式（X轴）';
                labelObj.labelForGroupPattern = "分组方式（Y轴）";
                break;
            case 2:
            case 3:
            case 7:
                labelObj.labelForMeasurePattern = '度量方式（Y轴）';
                labelObj.labelForGroupPattern = "分组方式（X轴）";
                break;
            case 5:
                labelObj.labelForMeasurePattern = '度量方式';
                labelObj.labelForGroupPattern = "分组方式";
                break;
            default:
                labelObj.labelForMeasurePattern = "度量方式（X轴）";
                labelObj.labelForGroupPattern = "分组方式（Y轴）";
        }
        return labelObj;
    },
    /**
     * 导出dashboard  画图配置项
     */
    getOptionForDashboardDownload: function (legend, condition, groupNum, name, x, y, x_name, y_name, plot_type, sum) {
        let leg = legend;
        if (leg) {
            leg.forEach(function (item, i) {
                leg[i] = item + '';
            });
        }
        let obj = {}
        let option = {
            title: {
                text: name,
                left: "20px",
                top: "28px"
            },
            tooltip: {
                trigger: 'axis',
                show: true,
                axisPointer: {
                    type: 'shadow'
                },
                position: function (point, params, dom) {
                    return [[point[0]], [point[1]]]
                },
            },
            legend: {
                left: "20px",
                top: '68px',
                data: leg,
            },
            grid: {
                x: "40px",
                y: "140px",
                x2: "160px",
                y2: "160px",
            },
            xAxis: {},
            yAxis: {},
            series: []
        }

        let xAxis, yAxis, seriesType, groups, Scale, height, width, barWidth, offset, barg = "30%", gridGap, l;
        let nameGapToAxis = 15 + x_name.length * 12 + 160;
        switch (plot_type) {
            case 1:
                /**
                 * 条形图
                 */
                width = "1280px";
                seriesType = "bar";//柱型
                groups = x.length;//统一纵坐标对应的一组数据
                Scale = y.length;//纵坐标一共有多少刻度
                if (!(legend.length)) {
                    offset = (34 + 25) * Scale
                    height = offset + 300 + "px";
                    barWidth = '34px';
                    option.tooltip.axisPointer.type = 'line';
                } else {
                    gridGap = getLegendHeight(legend, 1280);
                    option.grid.y = gridGap.y + "px";
                    option.grid.y2 = gridGap.y2 + "px";
                    offset = (38 * groups + 50) * Scale
                    height = offset + 300 + (gridGap.y - 140) + "px";
                    barWidth = '34px';
                    barg = "10%";
                    option.tooltip.trigger = 'item';
                    option.tooltip.position = function (point, params, dom) {
                        return [[point[0]], [point[1] - 180]]
                    }
                }
                xAxis = {
                    name: x_name,
                    type: "value",
                    offset: -offset,
                    axisTick: {
                        inside: true,
                    },
                    axisLabel: {
                        inside: true,
                    },
                    nameLocation: 'middle',
                    nameGap: -35
                };
                yAxis = {
                    nameGap: 20,
                    name: y_name,
                    type: 'category',
                    data: y,
                    axisTick: {
                        alignWithLabel: true,
                    },
                    axisLabel: {
                        rotate: 40,
                        fontSize: '12px',
                        color: "#7F7979",
                        interval: 0,
                        minInterval: 1,
                        showMinLabel: true,
                        showMaxLabel: true,
                        formatter: function (params) {
                            if (params.length > 15) return params.substr(0, 15) + '...';
                        }
                    }
                };
                option.grid.x = "155px";
                option.grid.x2 = '130px';
                option.xAxis = xAxis;
                option.yAxis = yAxis;
                option.tooltip.formatter = this.formatterTooltipDownload;
                x.forEach(function (item, index) {
                    item.forEach(function (ele, i) {
                        if (ele === -1) item[i] = '-';
                    });
                    let seriesItem = {
                        name: leg[index] ? leg[index] : x_name,
                        type: seriesType,
                        barWidth: barWidth,
                        barGap: barg,
                        data: item,
                        itemStyle: {
                            normal: {
                                color: Config.dashboard.colorArray[index]
                            }
                        },
                        label: {
                            normal: {
                                formatter: this.convertChartNumber,
                                show: true,
                                position: "right",
                                textStyle: {
                                    color: '#7F7979',
                                    fontSize: "12px",
                                },
                            }
                        }
                    }
                    option.series.push(seriesItem);
                }.bind(this));
                break;
            case 2:
                /**
                 * 柱形图
                 */
                height = "710px";
                seriesType = "bar";
                groups = y.length;
                Scale = x.length;
                if (!(legend.length)) {
                    let l = (34 + 25) * Scale + 200;
                    if (l < 900) l = 900; // 优化
                    width = l + "px";
                    barWidth = '34px';
                    option.tooltip.axisPointer.type = 'line';
                } else {
                    option.tooltip.trigger = 'item';
                    option.tooltip.formatter = this.formatterTooltipDownload;
                    l = (38 * groups + 50) * Scale + 200
                    if (l < 900) l = 900; // 优化
                    width = l + "px";
                    barWidth = '34px';
                    barg = "10%";
                    if (l > 1280) {
                        option.tooltip.axisPointer.type = 'line';
                        option.legend.width = '1280px';
                        gridGap = getLegendHeight(legend, 1280);
                        option.grid.y = gridGap.y + "px";
                        option.grid.y2 = gridGap.y2 + "px";
                    } else {
                        gridGap = getLegendHeight(legend, l);
                        option.tooltip.trigger = 'item';
                        option.tooltip.position = function (point, params, dom) {
                            return [[point[0]], [point[1] - 180]]
                        }
                        option.grid.y = gridGap.y + "px";
                        option.grid.y2 = gridGap.y2 + "px";
                    }
                }
                let self = this;
                xAxis = {
                    name: x_name,
                    type: "category",
                    data: x,
                    axisTick: {
                        alignWithLabel: true,
                    },
                    axisLabel: {
                        rotate: 50,
                        fontSize: '12px',
                        color: "#7F7979",
                        interval: 0,
                        minInterval: 1,
                        showMinLabel: true,
                        showMaxLabel: true,
                        formatter: function (params) {
                            if (params.length > 12) return params.substr(0, 12) + '...';
                        }
                    }
                };
                yAxis = {
                    name: y_name,
                    type: 'value',
                };
                option.grid.x = 100 + 'px';
                option.grid.x2 = nameGapToAxis - 100 + 'px';
                option.xAxis = xAxis;
                option.yAxis = yAxis;
                option.tooltip.formatter = this.formatterTooltipDownload;
                y.forEach(function (item, index) {
                    item.forEach(function (ele, i) {
                        if (ele === -1) item[i] = '-';
                    });
                    let seriesItem = {
                        name: leg[index] ? leg[index] : y_name,
                        type: seriesType,
                        barWidth: barWidth,
                        barGap: barg,
                        data: item,
                        itemStyle: {
                            normal: {
                                color: Config.dashboard.colorArray[index]
                            }
                        },
                        label: {
                            normal: {
                                formatter: this.convertChartNumber,
                                show: true,
                                position: "top",
                                textStyle: {
                                    color: '#7F7979',
                                    fontSize: "12px",
                                },
                            }
                        }
                    }
                    option.series.push(seriesItem);
                }.bind(this));
                break;
            case 3:
                /**
                 * 折线图
                 */
                height = "600px";
                seriesType = "line";
                Scale = x.length;
                l = 100 * Scale + nameGapToAxis;
                if (l < 900) l = 900; // 最小宽度设置为900
                width = l + "px";
                if (l > 1280) {
                    option.legend.width = '1280px';
                    gridGap = getLegendHeight(legend, 1280);
                    option.grid.y = gridGap.y + "px";
                    option.grid.y2 = gridGap.y2 + "px";
                } else {
                    gridGap = getLegendHeight(legend, l);
                    option.grid.y = gridGap.y + "px";
                    option.grid.y2 = gridGap.y2 + "px";
                }
                option.grid.x = 100 + 'px';
                option.grid.x2 = nameGapToAxis - 100 + 'px';
                xAxis = {
                    name: x_name,
                    type: "category",
                    data: x,
                    axisTick: {
                        alignWithLabel: true,
                    },
                    axisLabel: {
                        rotate: 50,
                        fontSize: '12px',
                        color: "#7F7979",
                        interval: 0,
                        minInterval: 1,
                        showMinLabel: true,
                        showMaxLabel: true,
                        formatter: function (params) {
                            if (params.length > 12) return params.substr(0, 12) + '...';
                        }
                    }
                };
                yAxis = {
                    name: y_name,
                    type: 'value',
                };
                option.xAxis = xAxis;
                option.yAxis = yAxis;
                option.tooltip.axisPointer.type = 'line';
                option.tooltip.formatter = this.formatterTooltipDownload;
                y.forEach(function (item, index) {
                    item.forEach(function (ele, i) {
                        if (ele === -1) item[i] = '-';
                    });
                    let seriesItem = {
                        name: leg[index] ? leg[index] : y_name,
                        type: seriesType,
                        data: item,
                        itemStyle: {
                            normal: {
                                color: Config.dashboard.colorArray[index],
                            }
                        },
                        label: {
                            normal: {
                                formatter: this.convertChartNumber,
                                show: true,
                                position: "top",
                                textStyle: {
                                    color: '#7F7979',
                                    fontSize: "12px",
                                },
                            }
                        }
                    }
                    option.series.push(seriesItem);
                }.bind(this))
                break;
            case 5:
                let opt = {};
                opt.height = 700;
                opt.width = 1280;
                opt.option = this.getRingDiagramConfig(x, y[0], x_name, y_name, sum, true, 2, name, sum);
                return opt;
                break;
            case 6:
                let sdata = {
                    legend: leg,
                    x: x,
                    y: y,
                    groupNum: groupNum,
                    x_name: x_name,
                    y_name: y_name
                }
                width = "1280px";
                Scale = y.length;//纵坐标一共有多少刻度
                if (groupNum === 1) {
                    offset = 410;
                    height = offset + 300 + "px";
                    gridGap = null;
                } else if (groupNum === 2) {
                    if (Scale < 5) {
                        offset = 410;
                        gridGap = getLegendHeight(legend, 1280);
                        height = offset + 300 + (gridGap.y - 140) + "px";
                        barg = "10%";
                    } else {
                        offset = (34 + 25) * Scale;
                        gridGap = getLegendHeight(legend, 1280);
                        height = offset + 300 + (gridGap.y - 140) + "px";
                        barg = "10%";
                    }
                }
                barWidth = '34px';
                let StripStackOpt = this.getStripStackingGraphSrcDownload(name, sdata, true, 1280, barWidth, offset, barg, gridGap); // 条形堆积图下载配置
                let StripStackOptObj = {
                    option: StripStackOpt,
                    height: height,
                    width: width,
                }
                return StripStackOptObj;
                break;
            case 7:
                let cdata = {
                    legend: leg,
                    x: x,
                    y: y,
                    groupNum: groupNum,
                    x_name: x_name,
                    y_name: y_name
                }
                Scale = x.length;//纵坐标一共有多少刻度
                if (groupNum === 1) {
                    l = 1280;
                } else if (groupNum === 2) {
                    l = (34 + 25) * Scale + 200;
                }
                width = l + "px";
                barWidth = '34px';
                barg = "10%";
                if (l > 1280) {
                    gridGap = getLegendHeight(legend, 1280);
                } else {
                    gridGap = getLegendHeight(legend, 1280);
                    width = '1280px';
                }
                // 140 为坐标轴默认距离顶部距离
                height = parseInt(gridGap.y) - 140 > 0 ? 710 + parseInt(gridGap.y) - 140 : 710; // 防止图例高度太大，而让坐标轴压缩
                // 柱形堆积图下载配置 首先获取默认配置
                let ColStackOpt = this.getColumnarStackingDiagramDownload(name, l, cdata, true, 710, gridGap, barWidth, barg);
                let ColStackOptObj = {
                    option: ColStackOpt,
                    height: height + 'px',
                    width: width,
                }
                return ColStackOptObj;
                break;

            default:
                return null;
        }
        obj.option = option;
        obj.height = height;
        obj.width = width;
        return obj;
    },
    /**
     * 环形图配置
     * @param {*} chartData 
     * @param {*} from 
     * @param {*} isShow 
     * @param {*} sum 
     * @param {*} type  type为1时为画布展示，为2时为画布导出操作
     */
    getRingDiagramConfig(x, y, x_name, y_name, sum, isshow, type, name, WhetherTheTrip) {
        x.forEach(function (item, index) {
            if (typeof item == 'number') {
                if (item <= 0) x[index] = '' + x[index];
            } else {
                if (!item) x[index] = '' + x[index];
            }
        });
        switch (type) {
            case 1:
                if (x.length > 20) {
                    let data = this.getChartDataByProcessing(x, y, sum);
                    return this.getRDConfigByProcessing(data.x, data.y, data.other, x_name, y_name, isshow, sum, WhetherTheTrip);
                } else {
                    return this.getRDConfigByProcessing(x, y, null, x_name, y_name, isshow, sum, WhetherTheTrip);
                }
                break;
            case 2:
                if (x.length > 20) {
                    let dataDownload = this.getChartDataByProcessing(x, y, sum);
                    return this.getRDConfigDownloadByProcessing(dataDownload.x, dataDownload.y, dataDownload.other, x_name, y_name, isshow, name);
                } else {
                    return this.getRDConfigDownloadByProcessing(x, y, null, x_name, y_name, isshow, name);
                }
                break;
            default:
                break;
        }
    },
    /**
     * 获取环形图配置
     * @param {*} x 
     * @param {*} y 
     * @param {*} other 
     * @param {*} name 
     * @param {*} isshow 
     */
    getRDConfigByProcessing(x, y, other, name, y_name, isshow, sum, WhetherTheTrip) {
        let s = this.convertChartNumber2(sum);
        let hint = WhetherTheTrip ? `单击可下钻. 双击可查看项目详情` : `双击可查看项目详情`;
        let option = {
            title: {
                text: y_name,
                x: 'center',
                bottom: 10,
                textStyle: {
                    color: '#7F7979',
                    fontSize: 14
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    let div = "<div style='padding:6px 10px 10px;'>" + params.seriesName + "<br />";
                    if (params.name === '其他') {
                        other.forEach(function (item, i) {
                            if (params.value[i + 1] === '-') {
                                div += item + "：" + '-' + "<br />";
                            } else {
                                div += item + "：" + params.value[i + 1] + "<br />";
                            }
                        })
                    } else {
                        if (params.value === '-') {
                            div += params.name + "：" + '-' + "<br />";
                        } else {
                            div += params.name + "：" + params.value + " (" + params.percent + "%" + ") " + "<br />";
                        }
                    }
                    div += "</div>";
                    div += `<div style='font-size:10px;padding:3px 10px 0;text-align:center;border-top:1px solid #9E9E9E;'>${hint}</div>`;
                    return div;
                },
                confine: true
            },
            legend: {
                type: 'scroll',
                orient: 'horizontal',
                top: 0,
                left: 0,
                itemWidth: 13,
                itemHeight: 13,
                data: x,
                pageIconSize: [10, 10],
                tooltip: {
                    show: true
                }
            },
            graphic: [
                {
                    type: 'text',
                    left: 'center',
                    top: '48%',
                    z: 0,
                    style: {
                        fill: '#505458',
                        textAlign: 'center',
                        text: '总数' + '\n' + s,
                        font: 'bold 18px "Helvetica Neue",Helvetica,Arial,sans-serif'
                    }
                }
            ],
            series: [
                {
                    name: name,
                    type: 'pie',
                    radius: ['53%', '73%'],
                    center: ['50%', '52%'],
                    label: {},
                    labelLine: {},
                    data: []
                }
            ]
        };
        //填充数据
        y.forEach(function (item, index) {
            let v = null;
            if (Object.prototype.toString.call(item) == '[object Array]') {
                item.forEach(function (ele, i) {
                    if (ele === -1) item[i] = '-';
                });
                v = item;
            } else {
                v = item === -1 ? '-' : item;
            }
            let obj = {};
            obj.value = v;
            obj.name = x[index];
            let i = this.getSubscriptBetween0And19(index);
            obj.itemStyle = {
                normal: {
                    color: Config.dashboard.colorArray[i],
                }
            }
            option.series[0].data.push(obj);
        }, this);
        //将其他分组的颜色改为默认颜色
        if (option.series[0].data[option.series[0].data.length - 1].name === '其他') {
            option.series[0].data[option.series[0].data.length - 1].itemStyle.normal.color = '#406289';
        }
        //是否默认显示数据
        if (isshow) {
            option.series[0].label.normal = {
                show: isshow,
                position: 'outside',
                textStyle: {
                    color: '#505458'
                }
            }
            option.series[0].labelLine.normal = {
                show: isshow,
                lineStyle: {
                    color: '#505458'
                }
            }
            option.series[0].label.normal.formatter = this.formatterLabel2;
        } else {
            option.series[0].avoidLabelOverlap = false;
            option.series[0].label = {
                normal: {
                    show: isshow,
                    position: 'center',
                    textStyle: {
                        fontSize: '18',
                        fontWeight: 'bold',
                        color: '#505458',
                    }
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '18',
                        fontWeight: 'bold',
                        color: '#505458',
                        backgroundColor: 'white',
                        padding: [40, 20, 40, 20]
                    }
                }
            }
            option.series[0].labelLine.normal = {
                show: false,
            }
            option.series[0].label.emphasis.formatter = this.formatterLabel;
        }
        return option;
    },
    /**
     * 获取环形图下载配置
     * @param {*} x 
     * @param {*} y 
     * @param {*} other 
     * @param {*} x_name 
     * @param {*} isshow 
     * @param {*} name 
     */
    getRDConfigDownloadByProcessing(x, y, other, x_name, y_name, isshow, name) {
        let option = {
            title: {
                text: name,
                x: 10,
                y: 10,
                textStyle: {
                    color: '#7F7979',
                    fontSize: 20
                },
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    let div = "<div style='padding:6px 10px 10px;'>" + x_name + "<br />";
                    if (params.name === '其他') {
                        other.forEach(function (item, i) {
                            if (params.value[i + 1] === '-') {
                                div += item + "：" + '-' + "<br />";
                            } else {
                                div += item + "：" + params.value[i + 1] + "<br />";
                            }
                        })
                    } else {
                        if (params.value === '-') {
                            div += params.name + "：" + '-' + "<br />";
                        } else {
                            div += params.name + "：" + params.value + " (" + params.percent + "%" + ") " + "<br />";
                        }
                    }
                    div += "</div>";
                    return div;
                },
                confine: true
            },
            legend: {
                orient: 'horizontal',
                x: 10,
                y: 38,
                itemWidth: 12,
                itemHeight: 12,
                data: x,
                tooltip: {
                    show: true
                },
                formatter: function (name) {
                    if (name.length > 5) {
                        return name.substring(0, 5) + '..';
                    }
                    return name;
                },
            },
            graphic: [
                {
                    type: 'text',
                    left: 'center',
                    top: 'bottom',
                    z: 0,
                    style: {
                        fill: '#505458',
                        textAlign: 'center',
                        text: y_name,
                        font: 'bold 16px "Helvetica Neue",Helvetica,Arial,sans-serif'
                    }
                }
            ],
            series: [
                {
                    name: name,
                    type: 'pie',
                    radius: ['43%', '63%'],
                    center: ['50%', '60%'],
                    label: {
                        normal: {
                            show: true,
                            position: 'outside',
                            textStyle: {
                                color: '#505458'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true,
                            lineStyle: {
                                color: '#505458'
                            }
                        }
                    },
                    data: []
                }
            ]
        };
        //填充数据
        y.forEach(function (item, index) {
            let v = null;
            if (Object.prototype.toString.call(item) == '[object Array]') {
                item.forEach(function (ele, i) {
                    if (ele === -1) item[i] = '-';
                });
                v = item;
            } else {
                v = item === -1 ? '-' : item;
            }
            let obj = {};
            obj.value = v;
            obj.name = x[index];
            let i = this.getSubscriptBetween0And19(index);
            obj.itemStyle = {
                normal: {
                    color: Config.dashboard.colorArray[i],
                }
            }
            option.series[0].data.push(obj);
        }, this);
        //将其他分组的颜色改为默认颜色
        option.series[0].label.normal.formatter = this.formatterLabel2;
        if (option.series[0].data[option.series[0].data.length - 1].name === '其他') {
            option.series[0].data[option.series[0].data.length - 1].itemStyle.normal.color = '#406289';
        }
        return option;
    },
    /**
     *  当环形图数据小于100并且大于20时，将后10%的数据合A并
     * @param {*} chartData 
     */
    getChartDataByProcessing(x, y, sum) {
        let obj = {};
        let count = 0;
        let i = 0;
        let percent100 = [];
        let percnet10 = [];
        let other = [];
        let prev = 0;
        let percnet10Count = 0;

        y.forEach(function (item, index) {
            count += item;
            if (count / sum >= 0.9) {
                ++i;
                percnet10Count += item;
                other.push(x[index]);
                percnet10.push(item);
            } else {
                percent100.push(item);
            }
        }, this);

        percnet10.unshift(percnet10Count);
        percent100.push(percnet10);
        x.splice(x.length - i, i, '其他');
        y = percent100;
        obj.x = x;
        obj.y = y;
        obj.other = other;
        return obj;
    },
    /**
     * 递归取0-19下标
     */
    getSubscriptBetween0And19(i) {
        return i <= 19 ? i : this.getSubscriptBetween0And19(i - 20);
    },
    /**
     * 环形图图例显示长度配置
     * @param {*} length 
     */
    getRDConfigLegendLength(length) {
        if (length > 80 && length <= 100) {
            return 1;
        } else if (length > 70) {
            return 2;
        } else if (length > 0) {
            return 3;
        }
    },
    /**
     * 获取条状堆积图配置
     * @param {*} chartData 
     * @param {*} isShow 
     */
    getStripStackingGraphSrcConfig(chartData, isShow, dw, WhetherTheTrip) {
        let barMaxWidth = 50;
        let dataZoomWidth = 25;
        let seriesName; // series 默认的名称
        let seriesData; // series 默认的数据
        let mainAxisLen; // 主轴的 数据长度(有多少条数据)
        let domWidth = dw - 70 - 2; // 减去外层父元素的padding左右共40px、和border：2px
        let right = 6; // 距离右侧6%
        let left = 3; // 距离左侧3%
        let nameGapY = 15; // 坐标轴名称与轴线之间的距离。 y轴
        let labelSize = 15; // 一个字体所占的距离

        let { legend, x, y, groupNum, x_name, y_name, group_type } = chartData; // 图例
        x.forEach(function (items, i) {
            items.forEach(function (ele, j) {
                if (ele === -1) x[i][j] = '-';
            });
        });
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                confine: true
            },
            legend: {
                type: 'scroll',
                orient: 'horizontal',
                top: 0,
                left: 0,
                itemWidth: 13,
                itemHeight: 13,
                data: legend,
                pageIconSize: [10, 10],
                tooltip: {
                    show: true
                }
            },
            grid: {
                left: '70px',
                right: '6%',
                bottom: '10%',
                top: 60,
                containLabel: true
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                start: 0,
                end: 100,
                yAxisIndex: 0,
                filterMode: 'filter',
                right: 0,
                width: dataZoomWidth,
                showDetail: false,
                showDataShadow: false
            }],
            xAxis: {
                name: x_name,
                nameLocation: 'middle',
                nameGap: 25,
                type: 'value',
                boundaryGap: [0, 0.01],
                axisLabel: {}
            },
            yAxis: {
                type: 'category',
                axisLabel: {
                    formatter: function (value, index) {
                        if (value.length > 30) return value.substr(0, 30) + '...';
                        return value;
                    }
                }
            },
            series: []
        };
        option.xAxis.axisLabel.formatter = this.convertChartNumber2;
        let hint = WhetherTheTrip ? `单击可下钻. 双击可查看项目详情` : `双击可查看项目详情`;
        let flagColor = true;
        switch (groupNum) {
            case 1:
                let singleObj = this.getsingle([`${y_name}`], chartData.x);
                let labelSWidth = labelSize * parseInt(singleObj.maxLab) + nameGapY; // 坐标轴名称所占的总距离
                let singleWidth = parseInt(domWidth / 100 * (100 - left - right) - labelSWidth); // 坐标宽度 = dom宽度 - left - right - 标题宽度
                if (singleWidth <= 0) singleWidth = 100;
                option.xAxis.max = singleObj.max;
                option.tooltip.formatter = function () {
                    let div = "<div style='padding:6px 10px 10px;'>" + y_name + "<br />";
                    y.forEach(function (item, i) {
                        let percent = Math.round(x[0][i] / singleObj.max * Math.pow(10, 2 + 2)) / Math.pow(10, 2).toFixed(2) + "%";
                        if (singleObj.max === 0) percent = '0.00%';
                        if (i < 20) {
                            if (x[0][i] === '-') {
                                div += item + "：" + '- <br />';
                            } else {
                                div += item + "：" + x[0][i] + "{" + percent + "}<br />";
                            };
                        }
                    });
                    div += "</div>";
                    div += `<div style='font-size:10px;padding:3px 10px 0;text-align:center;border-top:1px solid #9E9E9E;'>${hint}</div>`;
                    return div;
                };
                option.dataZoom = null; // 当分组方式为1时取消数据缩放功能
                option.yAxis.data = [`${y_name}`];
                y.forEach(function (item, index) {
                    let i = this.getSubscriptBetween0And19(index);
                    let seriesItem = {
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: barMaxWidth,
                        barMinHeight: 0,
                        itemStyle: {
                            normal: {
                                color: Config.dashboard.colorArray[i]
                            }
                        },
                        label: {
                            normal: {
                                show: isShow,
                                formatter: function (params) {

                                    let newValue = params.value;
                                    // 如果value存在
                                    if (newValue) {
                                        newValue = Number.parseFloat(newValue);
                                        // >=1万
                                        if (newValue >= 10000) {
                                            newValue = Number.parseInt(newValue, 10);
                                            // >=1亿
                                            if (newValue >= 100000000) {
                                                newValue = (newValue / 100000000).toFixed(2) + '亿';
                                            } else {
                                                newValue = (newValue / 10000).toFixed(2) + '万';
                                            }
                                        } else {
                                            // 不是整数
                                            if (newValue % 1 !== 0) {
                                                newValue = newValue.toFixed(2);
                                            }
                                        }
                                    }

                                    // 根据value所占总长度的百分比算出最小显示宽度
                                    let minlen = parseInt(params.value / singleObj.max * singleWidth);
                                    // 每个字默认占12px 
                                    return minlen >= ('' + newValue).length * 12 ? newValue : '';
                                },
                            }
                        }
                    };
                    let data = [];

                    if (flagColor && x[0][index] !== 0 && x[0][index] !== '-') flagColor = false;
                    data.push(x[0][index]); // y[0] 位存放数据的数组F
                    seriesItem.data = data;
                    option.series.push(seriesItem);
                }.bind(this));
                if (flagColor) {
                    option.series.forEach((item, i) => {
                        option.series[i].barMinHeight = 7;
                        option.series[i].itemStyle.normal.opacity = 0;
                    });
                }
                break;
            case 2:
                let doubbleleObj = this.getDoubble(chartData.y, chartData.x);
                let labelDWidth = labelSize * parseInt(doubbleleObj.maxLab) + nameGapY; // 坐标轴名称所占的总距离
                let doubbleWidth = parseInt(domWidth / 100 * (100 - left - right) - labelDWidth);
                if (doubbleWidth <= 0) doubbleWidth = 100; // 最小显示100px宽度
                option.xAxis.max = doubbleleObj.max;
                mainAxisLen = y.length;
                option.tooltip.formatter = function (params) {
                    let name = params[0].axisValue;
                    let div = "<div style='padding:6px 10px 10px;'>" + name + "<br />";
                    params.forEach(function (item, i) {
                        let percent = Math.round(item.value / doubbleleObj.countArr[params[0].dataIndex] * Math.pow(10, 2 + 2)) / Math.pow(10, 2).toFixed(2) + "%"
                        if (doubbleleObj.countArr[params[0].dataIndex] === 0) percent = '0.00%';
                        if (item.value === '-') {
                            div += item.seriesName + "：" + '- <br />';
                        } else {
                            div += item.seriesName + "：" + item.value + "{" + percent + "}<br />";
                        }
                    });
                    div += "</div>";
                    div += `<div style='font-size:10px;padding:3px 10px 0;text-align:center;border-top:1px solid #9E9E9E;'>${hint}</div>`;
                    return div;
                };
                if (isShow) {
                    if (group_type && (group_type[0] === 'datetime' || group_type[0] === 'date')) {
                        option.dataZoom[0].start = 100 - this.getDataZoomEnd(mainAxisLen);
                    } else {
                        option.dataZoom[0].end = this.getDataZoomEnd(mainAxisLen);
                    }
                };
                if (y.length === 1) option.dataZoom = null; // 下钻情况下会发生 所有下钻图的分组方式都是顶层图分组方式 这里需要单独区分

                option.yAxis.data = y;
                option.yAxis.name = y_name;
                x.forEach(function (item, index) {
                    let i = this.getSubscriptBetween0And19(index);
                    let seriesItem = {
                        name: legend[index],
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: barMaxWidth,
                        itemStyle: {
                            normal: {
                                color: Config.dashboard.colorArray[i]
                            }
                        },
                        label: {
                            normal: {
                                show: isShow,
                                formatter: function (params) {
                                    let newValue = params.value;
                                    // 如果value存在
                                    if (newValue) {
                                        newValue = Number.parseFloat(newValue);
                                        // >=1万
                                        if (newValue >= 10000) {
                                            newValue = Number.parseInt(newValue, 10);
                                            // >=1亿
                                            if (newValue >= 100000000) {
                                                newValue = (newValue / 100000000).toFixed(2) + '亿';
                                            } else {
                                                newValue = (newValue / 10000).toFixed(2) + '万';
                                            }
                                        } else {
                                            // 不是整数
                                            if (newValue % 1 !== 0) {
                                                newValue = newValue.toFixed(2);
                                            }
                                        }
                                    }
                                    // 根据value所占总长度的百分比算出最小显示宽度
                                    let minlen = parseInt(params.value / doubbleleObj.max * doubbleWidth);
                                    // 每个字默认占12px 
                                    return minlen >= ('' + newValue).length * 12 ? newValue : '';
                                },
                            }
                        }
                    };
                    if (flagColor) {
                        for (let i = 0; i < item.length; ++i) {
                            if (item[i] !== 0 && item[i] !== '-') {
                                flagColor = false;
                                break;
                            }
                        }
                    }
                    seriesItem.data = item;
                    option.series.push(seriesItem);
                }.bind(this));
                if (flagColor) {
                    option.series.forEach((item, i) => {
                        option.series[i].barMinHeight = 7;
                        option.series[i].itemStyle.normal.opacity = 0;
                    });
                }
                break;
            default:
                break;
        }
        return option;
    },
    /**
     * 获取条状堆积图下载配置
     * @param {*} name 
     * @param {*} chartData 
     * @param {*} isShow 
     * @param {*} dw 
     * @param {*} barWidth 
     * @param {*} offset 
     * @param {*} barg 
     * @param {*} gridGap 
     */
    getStripStackingGraphSrcDownload(name, chartData, isShow, dw, barWidth, offset, barg, gridGap) {
        let barMaxWidth = 50;
        let dataZoomWidth = 25;
        let seriesName; // series 默认的名称
        let seriesData; // series 默认的数据
        let mainAxisLen; // 主轴的 数据长度(有多少条数据)
        let gridGapY = gridGap ? gridGap.y + "px" : '140px';
        let gridGapY2 = gridGap ? gridGap.y2 + "px" : '160px';

        let domWidth = dw; // 容器宽度
        let left = 120; // 距离左侧120px
        let right = 130; // 距离右侧130px
        let gWidth = domWidth - left - right;

        let nameGapY = 15; // 坐标轴名称与轴线之间的距离。 y轴
        let labelSize = 15; // 一个字体所占的距离

        let { legend, x, y, groupNum, x_name, y_name, group_type } = chartData; // 图例
        x.forEach(function (items, i) {
            items.forEach(function (ele, j) {
                if (ele === -1) x[i][j] = '-';
            });
        });
        let option = {
            title: {
                text: name,
                top: "28px",
                left: "20px"
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                confine: true
            },
            legend: {
                top: '68px',
                left: '20px',
                data: legend,
            },
            grid: {
                x: "155px",
                x2: '130px',
                y: gridGapY,
                y2: gridGapY2,
            },
            xAxis: {
                name: x_name,
                type: 'value',
                offset: -offset,
                nameLocation: 'end',
                axisTick: {
                    inside: true,
                },
                axisLabel: {
                    inside: true,
                }
            },
            yAxis: {
                type: 'category',
                nameGap: 20,
                axisTick: {
                    alignWithLabel: true,
                },
                axisLabel: {
                    rotate: 40,
                    fontSize: '12px',
                    color: "#7F7979",
                    interval: 0,
                    minInterval: 1,
                    showMinLabel: true,
                    showMaxLabel: true,
                    formatter: function (params) {
                        if (params.length > 15) return params.substr(0, 15) + '...';
                    }
                }
            },
            series: []
        };
        option.xAxis.axisLabel.formatter = this.convertChartNumber2;
        switch (groupNum) {
            case 1:
                let singleObj = this.getsingle([`${y_name}`], chartData.x);
                option.xAxis.max = singleObj.max;
                option.tooltip.formatter = function () {
                    let div = "<div style='padding:6px 10px 10px;'>" + y_name + "<br />";
                    y.forEach(function (item, i) {
                        let percent = Math.round(x[0][i] / singleObj.max * Math.pow(10, 2 + 2)) / Math.pow(10, 2).toFixed(2) + "%";
                        if (singleObj.max === 0) percent = '0.00%';
                        if (i < 20) {
                            if (x[0][i] === '-') {
                                div += item + "：" + '- <br />';
                            } else {
                                div += item + "：" + x[0][i] + "{" + percent + "}<br />";
                            };
                        }
                    });
                    div += "</div>";
                    return div;
                };
                option.yAxis.data = [`${y_name}`]
                y.forEach(function (item, index) {
                    let i = this.getSubscriptBetween0And19(index);
                    let seriesItem = {
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: barMaxWidth,
                        barWidth: barWidth,
                        barGap: barg,
                        itemStyle: {
                            normal: {
                                color: Config.dashboard.colorArray[i]
                            }
                        },
                        label: {
                            normal: {
                                show: isShow,
                                formatter: function (params) {
                                    let newValue = params.value;
                                    // 如果value存在
                                    if (newValue) {
                                        newValue = Number.parseFloat(newValue);
                                        // >=1万
                                        if (newValue >= 10000) {
                                            newValue = Number.parseInt(newValue, 10);
                                            // >=1亿
                                            if (newValue >= 100000000) {
                                                newValue = (newValue / 100000000).toFixed(2) + '亿';
                                            } else {
                                                newValue = (newValue / 10000).toFixed(2) + '万';
                                            }
                                        } else {
                                            // 不是整数
                                            if (newValue % 1 !== 0) {
                                                newValue = newValue.toFixed(2);
                                            }
                                        }
                                    }

                                    // 根据value所占总长度的百分比算出最小显示宽度
                                    let minlen = parseInt(params.value / singleObj.max * gWidth);
                                    // 每个字默认占12px 
                                    return minlen >= ('' + newValue).length * 12 ? newValue : '';
                                },
                            }
                        }
                    };
                    let data = [];
                    data.push(x[0][index]); // y[0] 位存放数据的数组F
                    seriesItem.data = data;
                    option.series.push(seriesItem);
                }.bind(this));
                break;
            case 2:
                let doubbleleObj = this.getDoubble(chartData.y, chartData.x);
                option.xAxis.max = doubbleleObj.max;
                mainAxisLen = y.length;
                option.tooltip.formatter = function (params) {
                    let name = params[0].axisValue;
                    let div = "<div style='padding:6px 10px 10px;'>" + name + "<br />";
                    params.forEach(function (item, i) {
                        let percent = Math.round(item.value / doubbleleObj.countArr[params[0].dataIndex] * Math.pow(10, 2 + 2)) / Math.pow(10, 2).toFixed(2) + "%";
                        if (doubbleleObj.countArr[params[0].dataIndex] === 0) percent = '0.00%';
                        if (item.value === '-') {
                            div += item.seriesName + "：" + '- <br />';
                        } else {
                            div += item.seriesName + "：" + item.value + "{" + percent + "}<br />";
                        }
                    });
                    div += "</div>";
                    return div;
                };
                option.yAxis.data = y;
                option.yAxis.name = y_name;
                x.forEach(function (item, index) {
                    let i = this.getSubscriptBetween0And19(index);
                    let seriesItem = {
                        name: legend[index],
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: barMaxWidth,
                        barWidth: barWidth,
                        barGap: barg,
                        itemStyle: {
                            normal: {
                                color: Config.dashboard.colorArray[i]
                            }
                        },
                        label: {
                            normal: {
                                show: isShow,
                                formatter: function (params) {
                                    let newValue = params.value;
                                    // 如果value存在
                                    if (newValue) {
                                        newValue = Number.parseFloat(newValue);
                                        // >=1万
                                        if (newValue >= 10000) {
                                            newValue = Number.parseInt(newValue, 10);
                                            // >=1亿
                                            if (newValue >= 100000000) {
                                                newValue = (newValue / 100000000).toFixed(2) + '亿';
                                            } else {
                                                newValue = (newValue / 10000).toFixed(2) + '万';
                                            }
                                        } else {
                                            // 不是整数
                                            if (newValue % 1 !== 0) {
                                                newValue = newValue.toFixed(2);
                                            }
                                        }
                                    }
                                    // 根据value所占总长度的百分比算出最小显示宽度
                                    let minlen = parseInt(params.value / doubbleleObj.max * gWidth);
                                    // 每个字默认占12px 
                                    return minlen >= ('' + newValue).length * 12 ? newValue : '';
                                },
                            }
                        }
                    };
                    seriesItem.data = item;
                    option.series.push(seriesItem);
                }.bind(this));
                break;
            default:
                break;
        }
        return option;
    },
    /**
     * 获取柱状堆积图配置
     * @param {*} chartData 
     * @param {*} isShow 
     */
    getColumnarStackingDiagramConfig(chartData, isShow, domHiehgt, WhetherTheTrip) {
        let barMaxWidth = 50;
        let dataZoomWidth = 25;
        let seriesName; // series 默认的名称
        let seriesData; // series 默认的数据
        let mainAxisLen; // 主轴的 数据长度(有多少条数据)
        let top = 60; // 距离顶部 60px
        let bottom = 10; // 距离底部10%
        let labelSize = 15; // 一个字体所占的高度
        let nameGapX = 15; // 坐标轴名称与轴线之间的距离。 X轴
        let labelHeight = labelSize * 1 + nameGapX; // 坐标轴名称所占的总距离 高度只有一个字
        let gridHeight = parseInt(domHiehgt / 100 * (100 - bottom) - top - labelHeight); // 坐标高度 = dom高度 - 图例 - top - 标题高度  - bottom
        let { legend, x, y, groupNum, x_name, y_name, group_type } = chartData; // 图例
        y.forEach(function (items, i) {
            items.forEach(function (ele, j) {
                if (ele === -1) y[i][j] = '-';
            });
        });
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                confine: true
            },
            legend: {
                type: 'scroll',
                orient: 'horizontal',
                top: 0,
                left: 0,
                itemWidth: 13,
                itemHeight: 13,
                data: legend,
                pageIconSize: [10, 10],
                tooltip: {
                    show: true
                }
            },
            grid: {
                left: '3%',
                right: '6%',
                bottom: '10%',
                top: 60,
                containLabel: true
            },
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    start: 0,
                    end: 100,
                    filterMode: 'filter',
                    xAxisIndex: 0,
                    showDetail: false,
                    showDataShadow: false,
                    bottom: 0,
                    height: dataZoomWidth
                }
            ],
            xAxis: {
                type: 'category',
                nameLocation: 'middle',
                axisLabel: {
                    formatter: function (value, index) {
                        if (value.length > 20) return value.substr(0, 20) + '...';
                        return value;
                    }
                }
            },
            yAxis: {
                name: y_name,
                // nameLocation: 'middle',
                nameGap: 25,
                type: 'value',
                boundaryGap: [0, 0.01],
                axisLabel: {}
            },
            series: []
        };
        option.yAxis.axisLabel.formatter = this.convertChartNumber2;
        let hint = WhetherTheTrip ? `单击可下钻. 双击可查看项目详情` : `双击可查看项目详情`;
        let flagColor = true; // 当全部数据都为0时 给一个最小高度和最小高度颜色 默认全部为0
        switch (groupNum) {
            case 1:
                let singleObj = this.getsingle([`${x_name}`], chartData.y);
                option.yAxis.max = singleObj.max;
                option.tooltip.formatter = function () {
                    let div = "<div style='padding:6px 10px 10px;'>" + y_name + "<br />";
                    x.forEach(function (item, i) {
                        let percent = Math.round(y[0][i] / singleObj.max * Math.pow(10, 2 + 2)) / Math.pow(10, 2).toFixed(2) + "%";
                        if (singleObj.max === 0) percent = '0.00%';
                        if (i < 20) {
                            if (y[0][i] === '-') {
                                div += item + "：" + '- <br />';
                            } else {
                                div += item + "：" + y[0][i] + "{" + percent + "}<br />";
                            };
                        }
                    });
                    div += "</div>";
                    div += `<div style='font-size:10px;padding:3px 10px 0;text-align:center;border-top:1px solid #9E9E9E;'>${hint}</div>`;
                    return div;
                }
                option.dataZoom = null; // 当分组方式为1时取消数据缩放功能
                option.xAxis.data = [`${x_name}`];
                x.forEach(function (item, index) {
                    let i = this.getSubscriptBetween0And19(index);
                    let seriesItem = {
                        type: 'bar',
                        stack: '总量',
                        barMinHeight: 0,
                        barMaxWidth: barMaxWidth,
                        itemStyle: {
                            normal: {
                                color: Config.dashboard.colorArray[i]
                            }
                        },
                        label: {
                            normal: {
                                show: isShow,
                                formatter: function (params) {
                                    let newValue = params.value;
                                    if (newValue) {
                                        newValue = Number.parseFloat(newValue);
                                        if (newValue >= 10000) {
                                            newValue = Number.parseInt(newValue, 10);
                                            if (newValue >= 100000000) {
                                                newValue = (newValue / 100000000).toFixed(2) + '亿';
                                            } else {
                                                newValue = (newValue / 10000).toFixed(2) + '万';
                                            }
                                        } else {
                                            if (newValue % 1 !== 0) {
                                                newValue = newValue.toFixed(2);
                                            }
                                        }
                                    }
                                    // 根据value所占总高度的百分比算出最小显示高度
                                    let minlen = parseInt(params.value / singleObj.max * gridHeight);
                                    // 每个字默认高度占12px 
                                    return minlen >= 12 ? newValue : '';
                                },
                            }
                        }
                    };
                    let data = [];
                    if (flagColor && y[0][index] !== 0 && y[0][index] !== '-') flagColor = false;
                    data.push(y[0][index]); // y[0] 位存放数据的数组
                    seriesItem.data = data;
                    option.series.push(seriesItem);
                }.bind(this));
                if (flagColor) {
                    option.series.forEach((item, i) => {
                        option.series[i].barMinHeight = 7;
                        option.series[i].itemStyle.normal.color = 'white';
                    });
                }
                break;
            case 2:
                let doubbleleObj = this.getDoubble(chartData.x, chartData.y);
                option.yAxis.max = doubbleleObj.max;
                mainAxisLen = x.length;
                option.tooltip.formatter = function (params) {
                    let name = params[0].axisValue;
                    let div = "<div style='padding:6px 10px 10px;'>" + name + "<br />";
                    params.forEach(function (item, i) {
                        let percent = Math.round(item.value / doubbleleObj.countArr[params[0].dataIndex] * Math.pow(10, 2 + 2)) / Math.pow(10, 2).toFixed(2) + "%";
                        if (doubbleleObj.countArr[params[0].dataIndex] === 0) percent = '0.00%';
                        if (item.value === '-') {
                            div += item.seriesName + "：" + "- <br />";
                        } else {
                            div += item.seriesName + "：" + item.value + "{" + percent + "} <br />";
                        }
                    });
                    div += "</div>";
                    div += `<div style='font-size:10px;padding:3px 10px 0;text-align:center;border-top:1px solid #9E9E9E;'>${hint}</div>`;
                    return div;
                };
                if (isShow) {
                    if (group_type && (group_type[0] === 'datetime' || group_type[0] === 'date')) {
                        option.dataZoom[0].start = 100 - this.getDataZoomEnd(mainAxisLen);
                    } else {
                        option.dataZoom[0].end = this.getDataZoomEnd(mainAxisLen);
                    };
                };
                if (x.length === 1) option.dataZoom = null; // 当分组方式为1时取消数据缩放功能
                option.xAxis.data = x;
                option.xAxis.name = x_name;
                option.xAxis.nameTextStyle = {
                    padding: [10, 0, 0, 0]
                }
                y.forEach(function (item, index) {
                    let i = this.getSubscriptBetween0And19(index);
                    let seriesItem = {
                        name: legend[index],
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: barMaxWidth,
                        itemStyle: {
                            normal: {
                                color: Config.dashboard.colorArray[i]
                            }
                        },
                        label: {
                            normal: {
                                show: isShow,
                                formatter: function (params) {
                                    let newValue = params.value;
                                    if (newValue) {
                                        newValue = Number.parseFloat(newValue);
                                        if (newValue >= 10000) {
                                            newValue = Number.parseInt(newValue, 10);
                                            if (newValue >= 100000000) {
                                                newValue = (newValue / 100000000).toFixed(2) + '亿';
                                            } else {
                                                newValue = (newValue / 10000).toFixed(2) + '万';
                                            }
                                        } else {
                                            if (newValue % 1 !== 0) {
                                                newValue = newValue.toFixed(2);
                                            }
                                        }
                                    }
                                    // 根据value所占总高度的百分比算出最小显示高度
                                    let minlen = parseInt(params.value / doubbleleObj.max * gridHeight);
                                    // 每个字默认高度占12px 
                                    return minlen >= 12 ? newValue : '';
                                },
                            }
                        }
                    };
                    if (flagColor) {
                        for (let i = 0; i < item.length; ++i) {
                            if (item[i] !== 0 && item[i] !== '-') {
                                flagColor = false;
                                break;
                            }
                        }
                    }
                    seriesItem.data = item;
                    option.series.push(seriesItem);
                }.bind(this));
                if (flagColor) {
                    option.series.forEach((item, i) => {
                        option.series[i].barMinHeight = 7;
                        option.series[i].itemStyle.normal.color = 'white';
                    });
                }
                break;
            default:
                break;
        }
        return option;
    },
    /**
     * 获取柱状堆积图下载配置
     * @param {*} name 
     * @param {*} l 
     * @param {*} chartData 
     * @param {*} isShow 
     * @param {*} domHiehgt 
     * @param {*} gridGap 
     * @param {*} barWidth 
     * @param {*} barg 
     */
    getColumnarStackingDiagramDownload(name, l, chartData, isShow, domHiehgt, gridGap, barWidth, barg) {
        let barMaxWidth = 50;
        let dataZoomWidth = 25;
        let seriesName; // series 默认的名称
        let seriesData; // series 默认的数据
        let mainAxisLen; // 主轴的 数据长度(有多少条数据)
        let gridGapY = gridGap.y; // 距离top 距离
        let gridGapY2 = gridGap.y2; // 距离 bottom 距离

        let top = gridGapY; // 距离顶部距离
        let bottom = gridGapY2; // 距离底部距离
        let gridHeight = parseInt(domHiehgt - top - bottom);

        let { legend, x, y, groupNum, x_name, y_name, group_type } = chartData; // 图例
        y.forEach(function (items, i) {
            items.forEach(function (ele, j) {
                if (ele === -1) y[i][j] = '-';
            });
        });
        let option = {
            title: {
                text: name,
                top: "28px",
                left: "20px"
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                confine: true
            },
            legend: {
                top: '68px',
                left: '20px',
                data: legend,
            },
            grid: {
                x: '40px',
                x2: '140px',
                y: `${gridGapY}px`,
                y2: `${gridGapY2}px`,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                nameLocation: 'middle',
                nameGap: 50,
                axisTick: {
                    alignWithLabel: true,
                },
                axisLabel: {
                    rotate: 40,
                    fontSize: '12px',
                    color: "#7F7979",
                    interval: 0,
                    minInterval: 1,
                    showMinLabel: true,
                    showMaxLabel: true,
                    formatter: function (params) {
                        if (params.length > 12) return params.substr(0, 12) + '...';
                    }
                }
            },
            yAxis: {
                name: y_name,
                type: 'value',
                axisLabel: {}
            },
            series: []
        };
        option.yAxis.axisLabel.formatter = this.convertChartNumber2;

        if (l > 1280) option.legend.width = '1280px';
        switch (groupNum) {
            case 1:
                let singleObj = this.getsingle([`${x_name}`], chartData.y);
                option.yAxis.max = singleObj.max;
                option.tooltip.formatter = function () {
                    let div = "<div style='padding:6px 10px 10px;'>" + x_name + "<br />";
                    x.forEach(function (item, i) {
                        let percent = Math.round(y[0][i] / singleObj.max * Math.pow(10, 2 + 2)) / Math.pow(10, 2).toFixed(2) + "%";
                        if (singleObj.max === 0) percent = '0.00%';
                        if (i < 20) {
                            if (y[0][i] === '-') {
                                div += item + "：" + '- <br />';
                            } else {
                                div += item + "：" + y[0][i] + "{" + percent + "}<br />";
                            };
                        }
                    });
                    div += "</div>";
                    return div;
                }
                option.xAxis.data = [`${x_name}`];
                x.forEach(function (item, index) {
                    let i = this.getSubscriptBetween0And19(index);
                    let seriesItem = {
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: barMaxWidth,
                        barWidth: barWidth,
                        barGap: barg,
                        itemStyle: {
                            normal: {
                                color: Config.dashboard.colorArray[i]
                            }
                        },
                        label: {
                            normal: {
                                show: isShow,
                                formatter: function (params) {
                                    let newValue = params.value;
                                    if (newValue) {
                                        newValue = Number.parseFloat(newValue);
                                        if (newValue >= 10000) {
                                            newValue = Number.parseInt(newValue, 10);
                                            if (newValue >= 100000000) {
                                                newValue = (newValue / 100000000).toFixed(2) + '亿';
                                            } else {
                                                newValue = (newValue / 10000).toFixed(2) + '万';
                                            }
                                        } else {
                                            if (newValue % 1 !== 0) {
                                                newValue = newValue.toFixed(2);
                                            }
                                        }
                                    }
                                    // 根据value所占总高度的百分比算出最小显示高度
                                    let minlen = parseInt(params.value / singleObj.max * gridHeight);
                                    // 每个字默认高度占12px 
                                    return minlen >= 12 ? newValue : '';
                                }
                            }
                        }
                    };
                    let data = [];
                    data.push(y[0][index]); // y[0] 位存放数据的数组
                    seriesItem.data = data;
                    option.series.push(seriesItem);
                }.bind(this));
                break;
            case 2:
                let doubbleleObj = this.getDoubble(chartData.x, chartData.y);
                option.yAxis.max = doubbleleObj.max;
                mainAxisLen = y.length;
                option.tooltip.formatter = function (params) {
                    let name = params[0].axisValue;
                    let div = "<div style='padding:6px 10px 10px;'>" + name + "<br />";
                    params.forEach(function (item, i) {
                        let percent = Math.round(item.value / doubbleleObj.countArr[params[0].dataIndex] * Math.pow(10, 2 + 2)) / Math.pow(10, 2).toFixed(2) + "%";
                        if (doubbleleObj.countArr[params[0].dataIndex] === 0) percent = '0.00%';
                        if (item.value === '-') {
                            div += item.seriesName + "：" + "- <br />";
                        } else {
                            div += item.seriesName + "：" + item.value + "{" + percent + "} <br />";
                        }
                    });
                    div += "</div>";
                    return div;
                };
                option.xAxis.data = x;
                option.xAxis.name = x_name;
                option.xAxis.nameTextStyle = {
                    padding: [60, 0, 0, 0]
                }
                y.forEach(function (item, index) {
                    let i = this.getSubscriptBetween0And19(index);
                    let seriesItem = {
                        name: legend[index],
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: barMaxWidth,
                        barWidth: barWidth,
                        barGap: barg,
                        itemStyle: {
                            normal: {
                                color: Config.dashboard.colorArray[i]
                            }
                        },
                        label: {
                            normal: {
                                show: isShow,
                                formatter: function (params) {
                                    let newValue = params.value;
                                    if (newValue) {
                                        newValue = Number.parseFloat(newValue);
                                        if (newValue >= 10000) {
                                            newValue = Number.parseInt(newValue, 10);
                                            if (newValue >= 100000000) {
                                                newValue = (newValue / 100000000).toFixed(2) + '亿';
                                            } else {
                                                newValue = (newValue / 10000).toFixed(2) + '万';
                                            }
                                        } else {
                                            if (newValue % 1 !== 0) {
                                                newValue = newValue.toFixed(2);
                                            }
                                        }
                                    }
                                    // 根据value所占总高度的百分比算出最小显示高度
                                    let minlen = parseInt(params.value / doubbleleObj.max * gridHeight);
                                    // 每个字默认高度占12px 
                                    return minlen >= 12 ? newValue : '';
                                }
                            }
                        }
                    };
                    seriesItem.data = item;
                    option.series.push(seriesItem);
                }.bind(this));
                break;
            default:
                break;
        }
        return option;
    },
    /**
     * 求和、用在递归函数中
     * @param {*} preValue 上一个数
     * @param {*} curValue 当前数
     * @param {*} index 
     * @param {*} array 
     */
    getSum(preValue, curValue, index, array) {
        if (curValue === '-') {
            return preValue + 0;
        } else {
            return preValue + curValue;
        }
    },
    /**
     * 堆积图单个分组方式获取最大坐标刻度
     * @param {*} group1 
     * @param {*} group2 
     */
    getsingle(group1, group2) {
        let max = 0;
        let maxLab = 0;
        group1.forEach(function (item) {
            maxLab = item.length > maxLab ? item.length : maxLab;
        });
        let sum = group2[0].reduce(this.getSum, 0);
        max = sum > max ? sum : max;
        return { max, maxLab };
    },
    /**
     * 堆积图多个分组方式获取最大坐标刻度
     * @param {*} group1 
     * @param {*} group2 
     */
    getDoubble(group1, group2) {
        let max = 0;
        let maxLab = 0;
        let maxStr = '';
        let countArr = [];
        group1.forEach(function (item, i) {
            if (item.length > maxLab) {
                maxLab = item.length;
                maxStr = group1[i];
            }
        });
        let arr = [];
        group2[0].forEach(function (item, i) {
            let a = [];
            group2.forEach(function (ele) {
                if (ele[i] === '-') {
                    a.push(0);
                } else {
                    a.push(ele[i]);
                }
            });
            arr.push(a)
        }.bind(this));
        arr.forEach(function (item) {
            let sum = item.reduce(this.getSum, 0);
            countArr.push(sum);
            max = sum > max ? sum : max;
        }.bind(this));
        return { max, maxLab, countArr }
    }
};