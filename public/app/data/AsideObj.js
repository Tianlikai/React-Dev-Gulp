'use strict';

var lang = require('../lang');
var langobj = {};

if (lang() === 'en') {
    langobj = {
        AppCenter: '应用中心',

        DataFetch: '数据源管理', // 1级tab
        dataSourceManager: '数据源管理',

        DataClean: '数据整理',
        DataCleanChild: '数据整理',
        DataCleanLog: '日志记录',

        SystemSettingsCenter: '系统设置中心',
        DataWarehouse: '数据仓库',

        StockPrediction: '供货预测',
        SpChild: '供货预测',
        SpLog: '日志记录',

        SaleClues: '销售线索',
        SaleCluesChild: '销售线索',
        GraphSetup: '图表设置',
        DataFilter: '统计数据过滤',

        SaleForecastLog: '日志记录',
        SaleForecastChild: '业绩预测'
    };
} else {
    langobj = {
        AppCenter: '应用中心',

        DataFetch: '数据源管理', // 1级tab
        dataSourceManager: '数据源管理',

        DataClean: '数据整理',
        DataCleanChild: '数据整理',
        DataCleanLog: '日志记录',

        SystemSettingsCenter: '系统设置中心',
        DataWarehouse: '数据仓库',

        StockPrediction: '供货预测',
        SpChild: '供货预测',
        SpLog: '日志记录',

        SaleClues: '销售线索',
        SaleCluesChild: '销售线索',
        GraphSetup: '图表设置',
        DataFilter: '统计数据过滤',

        SaleForecastLog: '日志记录',
        SaleForecastChild: '业绩预测'
    };
}

module.exports = langobj;
