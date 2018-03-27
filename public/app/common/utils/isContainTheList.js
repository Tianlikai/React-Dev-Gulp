/**
 * 改list是否包含该item
 * 返回值：bool类型
 * @param {*} lists 
 * @param {*} listitem 
 */
const isContainTheList = (lists, listitem) => {
    return lists.indexOf(listitem) > -1;
}

export default isContainTheList;