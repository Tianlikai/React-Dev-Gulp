   /**
     * 获取柱形堆叠图单个分组方式 list
     * @param {*} chartData 
     * @param {*} seriesData 
     * @param {*} params 
     * @param {*} count 
     */
  const  getColStackingDigConfigAboutDetailList3=(chartData, seriesData, params, count) =>{
        let list = [];
        for (let i = 0, j = seriesData[0].length; i < j; i++) {
            let item = [];
            item.push(chartData.y[i]); // 名称
            if (seriesData[0][i] === '-') {
                item.push('-');
                item.push('-');
            } else if (seriesData[0][i] === 0) {
                item.push(0);
                item.push('-');
            } else {
                item.push(seriesData[0][i]); // 数值
                item.push(Math.round(seriesData[0][i] / count * Math.pow(10, 2 + 2)) / Math.pow(10, 2).toFixed(2) + '%'); // 百分比
            }
            list.push(item);
        }
        return list;
    }

    export default getColStackingDigConfigAboutDetailList3;