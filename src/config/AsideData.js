'use strict';

const SystemValue = require('./SystemValue')

const AdminData = [{
    id: -1,
    name: SystemValue.menutip.Dashboard,
    to: '/main/Dashboard',
    imgsrc: '/dist/images/apps/-1.svg',
    activeImg: '/dist/images/activeApps/-1.svg',
    subtitle: 'Dashboard',
    subMenus: []
}, {
    id: 2,
    name: SystemValue.menutip.StockPrediction,
    to: '/main/StockPrediction',
    subtitle: 'StockPrediction',
    imgsrc: '/dist/images/apps/2.svg',
    activeImg: '/dist/images/activeApps/2.svg',
    subMenus: []
}, {
    id: 3,
    name: SystemValue.menutip.SaleClues,
    to: '/main/SaleClues',
    subtitle: 'SaleClues',
    imgsrc: '/dist/images/apps/3.svg',
    activeImg: '/dist/images/activeApps/3.svg',
    subMenus: []
}, {
    id: 4,
    name: SystemValue.menutip.SaleForecast,
    to: '/main/SaleForecast',
    subtitle: 'SaleForecast',
    imgsrc: '/dist/images/apps/4.svg',
    activeImg: '/dist/images/activeApps/4.svg',
    subMenus: []
}
];
// 管理员平台：左侧导航栏
const AdminPlatform = [{
    id: 'RoleManagement',
    name: SystemValue.menutip.RoleManagement,
    to: '/admin/RoleManagement',
    imgsrc: '/dist/images/apps/RoleManagement.svg',
    activeImg: '/dist/images/activeApps/RoleManagement.svg',
    subtitle: 'RoleManagement',
    subMenus: []
}, {
    id: 0,
    name: SystemValue.menutip.DataFetch,
    to: '/admin/DataFetch',
    subtitle: 'DataFetch',
    imgsrc: '/dist/images/apps/0.svg',
    activeImg: '/dist/images/activeApps/0.svg',
    subMenus: []
}, {
    id: 1,
    name: SystemValue.menutip.DataClean,
    to: '/admin/DataClean',
    subtitle: 'DataClean',
    imgsrc: '/dist/images/apps/1.svg',
    activeImg: '/dist/images/activeApps/1.svg',
    subMenus: []
}, {
    id: 5,
    name: SystemValue.menutip.Recommend,
    to: '/admin/Recommend',
    subtitle: 'Recommend',
    imgsrc: '/dist/images/apps/5.svg',
    activeImg: '/dist/images/activeApps/5.svg',
    subMenus: []
}, {
    id: 2,
    name: SystemValue.menutip.StockPrediction,
    to: '/admin/StockPrediction',
    subtitle: 'StockPrediction',
    imgsrc: '/dist/images/apps/2.svg',
    activeImg: '/dist/images/activeApps/2.svg',
    subMenus: []
}, {
    id: 3,
    name: SystemValue.menutip.SaleClues,
    to: '/admin/SaleClues',
    subtitle: 'SaleClues',
    imgsrc: '/dist/images/apps/3.svg',
    activeImg: '/dist/images/activeApps/3.svg',
    subMenus: []
}, {
    id: 4,
    name: SystemValue.menutip.SaleForecast,
    to: '/admin/SaleForecast',
    subtitle: 'SaleForecast',
    imgsrc: '/dist/images/apps/4.svg',
    activeImg: '/dist/images/activeApps/4.svg',
    subMenus: []
}];

const Data = {
    adminData: AdminData,
    adminPlatform: AdminPlatform
};

module.exports = Data;
