/**
 * 移除切片器的警告提示内容
 * @param {*} style 
 */
const removePopinfo = (style) => {
    let eleArr = document.getElementsByClassName('selectInfo popinfo alert alert-warning');
    let L = eleArr.length;
    for (let i = 0; i < L; ++i) {
        eleArr[i].setAttribute('style', style);
    }
}

export default removePopinfo;