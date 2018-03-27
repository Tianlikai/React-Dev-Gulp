// 配置项目 菜单目录
const SystemValue = require('./SystemValue');

const AdminData = [
    {
        id: -1,
        name: SystemValue.menutip.Dashboard,
        to: '/main/Dashboard',
        imgsrc: '/dist/images/apps/-1.svg',
        activeImg: '/dist/images/activeApps/-1.svg',
        subtitle: 'Dashboard',
        subMenus: []
    }
];
const Data = {
    adminData: AdminData,
};

module.exports = Data;
