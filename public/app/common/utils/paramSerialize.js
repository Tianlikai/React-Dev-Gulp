/**
 * 把 ajax 要传递的数据对象 加上 & 
 * @param {Object} data 
 */
const paramSerialize = (data) => {
    var sendString = [];
    if (typeof data === 'object' && !(data instanceof String)) {
        for (var k in data) {
            if (data.hasOwnProperty(k)) {
                sendString.push(encodeURIComponent(k) + '=' + encodeURIComponent(data[k]));
            }
        }
    }
    sendString = sendString.join('&');
    return sendString;
}

export default paramSerialize;