/**
 * 画布双击多分组方式获取弹出提示框信息配置数据 条形堆积图
 * @param {*} seriesData 
 * @param {*} params 
 */
const getConfigAboutDetailList = (chartData, seriesData, params) => {
    let list = [];
    for (let i = 0, j = seriesData.length; i < j; i++) {
        let item = [];
        item.push(chartData.legend[i]);
        if (seriesData[i][params.dataIndex] === -1) {
            item.push('-');
        } else {
            item.push(seriesData[i][params.dataIndex]);
        }
        list.push(item);
    }
    return list;
}

export default getConfigAboutDetailList;