/**
 * 提交可显示列配置，处理配置好的列表
 * 返回值: object对象{array类型、number类型}
 * @param {*} showColumns 
 * @param {*} cols_display 
 * @param {*} cols_hidden 
 */
const handleConfigColumns = (showColumns, cols_display, cols_hidden) => {
    let list = [];
    for (let j = 0; j < showColumns.length; j++) {
        let a = showColumns[j];
        for (let i of cols_display) {
            if (a === i.col_desc) {
                let obj = {};
                obj.col_name = i.col_name;
                obj.col_sort = j;
                list.push(obj);
                break;
            }
        }
        for (let k of cols_hidden) {
            if (a === k.col_desc) {
                let obj = {};
                obj.col_name = k.col_name;
                obj.col_sort = j;
                list.push(obj);
                break;
            }
        }
    }
    let len = list.length;
    return { list, len };
}

export default handleConfigColumns;