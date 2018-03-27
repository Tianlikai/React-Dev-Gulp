/**
 * 验证字符串
 * 字符串合法返回null，不合法返回提示信息
 * @param {*} value 输入字符串   
 * @param {*} maxWidth 字符串最大长度
 * objRegExp:正则匹配1-30位的中文、英文、数字或符号
 *           逗号(中文) 句号(英文)小括号（中英文）短横线（-）下划线（_）顿号（、）
 */
const validationIputStrType1 = (value, maxWidth, h1, h2, h3) => {
    let hint = null;
    let objRegExp = /^[a-zA-Z0-9_\u4e00-\u9fa5-、.()（），]+$/;
    let flag = objRegExp.test(value);
    if (!flag) {
        hint = h1;
    }
    if (value.length > maxWidth) {
        hint = h2;
    }
    if (value.length === 0) {
        hint = h3;
    }
    return hint;
}