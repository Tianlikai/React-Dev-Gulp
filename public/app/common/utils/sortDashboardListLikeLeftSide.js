import divideGroups from './divideGroups';
/**
 * 保持画布移动和复制仪表盘列表和左侧仪表盘顺序相同
 * 返回值: array类型
 * @param {*} data 
 * @param {*} letters 
 */
const sortDashboardListLikeLeftSide = (data, letters) => {
    let groups = divideGroups(data, letters);
    let result = [];
    for (let item in groups) {
        if (groups[item].length > 0) {
            result = result.concat(groups[item]);
        }
    }
    return result;
}

export default sortDashboardListLikeLeftSide;