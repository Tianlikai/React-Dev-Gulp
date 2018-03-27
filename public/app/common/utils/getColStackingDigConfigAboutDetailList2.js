/**
* 获取条形堆叠图两个分组方式 list
* @param {*} chartData 
* @param {*} seriesData 
* @param {*} params 
* @param {*} count 
*/
const getColStackingDigConfigAboutDetailList2 = (chartData, seriesData, params, count) => {
    let list = [];
    for (let i = 0, j = seriesData.length; i < j; i++) {
        let item = [];
        item.push(chartData.legend[i]); // 名称
        if (seriesData[i][params.dataIndex] === '-') {
            item.push('-');
            item.push('-');
        } else if (seriesData[i][params.dataIndex] === 0) {
            item.push(0);
            item.push('-');
        } else {
            item.push(seriesData[i][params.dataIndex]); // 数值
            item.push(Math.round(seriesData[i][params.dataIndex] / count * Math.pow(10, 2 + 2)) / Math.pow(10, 2).toFixed(2) + '%'); // 百分比
        }
        list.push(item);
    }
    return list;
}

export default getColStackingDigConfigAboutDetailList2;