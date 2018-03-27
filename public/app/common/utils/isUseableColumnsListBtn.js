/**
 * 返回ColumnsList的button是否可用
 * 返回值：bool类型
 * @param {*} selectedLength 
 */
const isUseableColumnsListBtn = (selectedLength) => {
    return selectedLength <= 1 ? true : false;
}

export default isUseableColumnsListBtn;