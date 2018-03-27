// 数组去重
const arrayDereplication = (data) => {
    if (Array.isArray(data)) {
        // 依赖polyfill.js
        var set = new Set(data);
        var result = Array.from(set);
        return result;
    }
    throw new Error('not an array!');
}

export default arrayDereplication;