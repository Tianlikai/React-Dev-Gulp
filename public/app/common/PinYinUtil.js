/*
http://www.codeceo.com/article/javascript-pinyin.html
只获取拼音首字母
*/
import firstletter from './pinyin_dict_firstletter';

var dict = {}; // 存储所有字典数据
var pinyinUtil = {
    /**
	* 解析各种字典文件，所需的字典文件必须在本JS之前导入
	*/
    parseDict: function () {
        // 如果导入了 pinyin_dict_firstletter.js
        if (firstletter) {
            dict.firstletter = firstletter;
        }
    },
    /**
	 * 获取汉字的拼音首字母
	 * @param str 汉字字符串，如果遇到非汉字则原样返回
	 * @param polyphone 是否支持多音字，默认false，如果为true，会返回所有可能的组合数组
	 */
    getFirstLetter: function (str, polyphone) {
        polyphone = polyphone == undefined ? false : polyphone;
        if (!str || /^ +$/g.test(str)) {
            return '';
        }
        // 使用首字母字典文件
        if (dict.firstletter) {
            let result = [];
            for (let i = 0; i < str.length; i++) {
                var unicode = str.charCodeAt(i);
                var ch = str.charAt(i);
                if (unicode >= 19968 && unicode <= 40869) {
                    ch = dict.firstletter.all.charAt(unicode - 19968);
                    if (polyphone) {
                        ch = dict.firstletter.polyphone[unicode] || ch;
                    }
                }
                result.push(ch);
            }
            // 如果不用管多音字，直接将数组拼接成字符串
            if (!polyphone) {
                return result.join('');
            } else {
                // 处理多音字，此时的result类似于：['D', 'ZC', 'F']
                return this.handlePolyphone(result, '', '');
            }
        }
        return str;
    },
    /**
	 * 处理多音字，将类似['D', 'ZC', 'F']转换成['DZF', 'DCF']
	 * 或者将 ['chang zhang', 'cheng'] 转换成 ['chang cheng', 'zhang cheng']
	 */
    handlePolyphone: function (array, splitter, joinChar) {
        splitter = splitter || '';
        let result = [''];
        let temp = [];
        for (let i = 0; i < array.length; i++) {
            temp = [];
            var t = array[i].split(splitter);
            for (let j = 0; j < t.length; j++) {
                for (let k = 0; k < result.length; k++) {
                    temp.push(result[k] + (result[k] ? joinChar : '') + t[j]);
                }
            }
            result = temp;
        }
        return this.simpleUnique(result);
    },
    // 简单数组去重
    simpleUnique: function (array) {
        var result = [];
        var hash = {};
        for (let i = 0; i < array.length; i++) {
            var key = (typeof array[i]) + array[i];
            if (!hash[key]) {
                result.push(array[i]);
                hash[key] = true;
            }
        }
        return result;
    }
};
pinyinUtil.parseDict();
pinyinUtil.dict = dict;
module.exports = pinyinUtil;
