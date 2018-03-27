/**
 * 首次进入页面选中第一个仪表盘，加载第一个仪表盘对应的画布
 * @param {*} letters 
 * @param {*} groups 
 */
const getFiristDashboard = (letters, groups) => {
    for (let i of letters) {
        let data = groups[i.id];
        if (data.length > 0) {
            for (let j of data) {
                return j;
            }
        }
    }
}

export default getFiristDashboard;