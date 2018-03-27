/**
 * 环形图双击其他区域获取弹出提示框信息配置数据
 * @param {*} params 
 * @param {*} chartData 
 * @param {*} mainAxisName 
 * @param {*} minorAxisName 
 */
const getConfigAboutDetailForRD = (params, chartData, mainAxisName, minorAxisName) => {
    let newParams = this.deepClone(params.value);
    let obj = {};
    let title = [];
    let list = [];
    newParams.shift();
    let len = newParams.length;
    newParams.forEach(function (item, i) {
        let arr = [];
        if (item === '-') {
            arr.push(chartData.x[chartData.x.length - len + i]);
            arr.push('-');
            arr.push('-');
        } else {
            let p = Math.round(item / chartData.sum * Math.pow(10, 2 + 2)) / Math.pow(10, 2).toFixed(2) + '%';
            arr.push(chartData.x[chartData.x.length - len + i]);
            arr.push(item);
            arr.push(p);
        }
        list.push(arr);
    });
    title.push(mainAxisName);
    title.push(minorAxisName);
    title.push('百分比');
    obj.title = title;
    obj.list = list;
    return obj;
}

export default getConfigAboutDetailForRD;