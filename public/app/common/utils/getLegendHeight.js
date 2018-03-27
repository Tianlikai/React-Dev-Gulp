/**
* 获取legened高度，设置grid位置
 */
const getLegendHeight = (legend, width) => {
    let obj = {
        y: 140,
        y2: 160
    };
    if (legend.length <= 0) {
        return obj;
    }

    let maxLen = 0, groupsNumber, lines, y2, L;
    groupsNumber = legend.length;
    legend.forEach(function (item) {
        if (item.length > maxLen) {
            maxLen = item.length;
        }
    });
    L = groupsNumber * 50 + maxLen * 12 * groupsNumber;
    lines = Math.ceil(L / width);
    if (lines <= 1) {
        return obj;
    } else {
        obj.y = obj.y + (lines - 1) * 25;
        return obj;
    }
}

export default getLegendHeight;