/**
 * 画布双击多分组方式获取弹出提示框信息配置标题
 * @param {*} mainAxisName 
 * @param {*} params 
 * @param {*} minorAxisName 
 */
const getConfigAboutDetailTitle = (mainAxisName, params, minorAxisName) => {
    let title = [];
    let groupsName = mainAxisName.split(',');
    if (groupsName.length > 1) {
        title.push(groupsName[1]); // 第2个分组方式名称
    } else {
        title.push(params.name);
    }
    title.push(minorAxisName);
    return title;
}

export default getConfigAboutDetailTitle;