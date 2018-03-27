'use strict';

var lang = require('../lang');

if (lang() === 'en') {
    module.exports = {
        successcode: 0,
        errorcode: 1,
        pageSize: 10, // 每页显示条数
        pageCount: 5, // 默认显示 几个页数
        menutip: {
            Dashboard: '仪表盘',
            Dashboard2: '仪表盘2',
            DashBoardManagement: '仪表盘',
            CreatedByMe: '我创建的',
            FromSharing: '来自分享',

            AppCenter: '应用中心',

            DataFetch: '数据源管理', // 1级tab
            DataSourceManager: '数据源管理',

            DataClean: '数据整理',
            DataCleanChild: '数据整理',
            DataCleanLog: '日志记录',

            Recommend: '智能推荐',

            RecommendationEngine: '推荐引擎',
            RecommendationEngineChild: '推荐引擎',
            RecommendationEngineLog: '日志记录',
            RecommendationEngineModelDrilling: '模型演练',

            CustomerRetrieval: '客户检索',

            SystemSettingsCenter: '数据仓库设置',
            DataWarehouse: '数据仓库',
            MobileAccess: '移动访问',

            StockPrediction: '供货预测',
            SpChild: '供货预测',
            SpLog: '日志记录',

            SaleClues: '销售线索',
            SaleCluesChild: '销售线索',
            SellingPoint: '销售热点',
            GraphSetup: '图表设置',
            DataFilter: '统计数据过滤',

            SaleForecast: '业绩预测',
            SaleForecastLog: '日志记录',
            SaleForecastChild: '业绩预测',

            RoleManagement: '用户权限',
            RoleManageChild: '角色管理',
            RolePermission: '角色权限',
            RoleTable: '用户组',

            DataPermission: '数据权限',
            AppPermission: '应用权限'
        },
        tableHint: {
            Nodetails: '暂无详情',
            NoSupplyForecast: '暂无供货预测',
            NoLogRecords: '暂无日志记录',
            NoSalesLeads: '暂无销售线索',
            NoPerformanceForecast: '暂无业绩预测',
            NoImportSituation: '暂无导入情况',
            NoProjectInformation: '暂无项目信息',
            NoUserYet: '暂无用户',
            NoDataSource: '暂无数据源',
            NoTask: '暂无任务',
            NoPermissionToApply: '暂无应用权限',
        }
    };
} else {
    module.exports = {
        successcode: 0,
        errorcode: 1,
        pageSize: 10, // 每页显示条数
        pageCount: 5, // 默认显示 几个页数
        menutip: {
            Dashboard: '仪表盘',
            Dashboard2: '仪表盘2',
            DashBoardManagement: '仪表盘',
            CreatedByMe: '我创建的',
            FromSharing: '来自分享',

            AppCenter: '应用中心',

            DataFetch: '数据源管理', // 1级tab
            DataSourceManager: '数据源管理',

            DataClean: '数据整理',
            DataCleanChild: '数据整理',
            DataCleanLog: '日志记录',

            Recommend: '智能推荐',

            RecommendationEngine: '推荐引擎',
            RecommendationEngineChild: '推荐引擎',
            RecommendationEngineLog: '日志记录',
            RecommendationEngineModelDrilling: '模型演练',

            CustomerRetrieval: '客户检索',

            SystemSettingsCenter: '数据仓库设置',
            DataWarehouse: '数据仓库',
            MobileAccess: '移动访问',

            StockPrediction: '供货预测',
            SpChild: '供货预测',
            SpLog: '日志记录',

            SaleClues: '销售线索',
            SaleCluesChild: '销售线索',
            SellingPoint: '销售热点',
            GraphSetup: '图表设置',
            DataFilter: '统计数据过滤',

            SaleForecast: '业绩预测',
            SaleForecastLog: '日志记录',
            SaleForecastChild: '业绩预测',

            RoleManagement: '用户权限',
            RoleManageChild: '角色管理',
            RolePermission: '角色权限',
            RoleTable: '用户组',

            DataPermission: '数据权限',
            AppPermission: '应用权限'
        },
        tableHint: {
            Nodetails: '暂无详情',
            NoSupplyForecast: '暂无供货预测',
            NoLogRecords: '暂无日志记录',
            NoSalesLeads: '暂无销售线索',
            NoPerformanceForecast: '暂无业绩预测',
            NoImportSituation: '暂无导入情况',
            NoProjectInformation: '暂无项目信息',
            NoUserYet: '暂无用户',
            NoDataSource: '暂无数据源',
            NoTask: '暂无任务',
            NoPermissionToApply: '暂无应用权限',
        }
    };
}
