// input输入框只能输入数字、小数点、减号
const digitInput = (value, fromEvent, len) => {
    var e = fromEvent || window.event; // FF、Chrome IE下获取事件对象
    var c = e.charCode || e.keyCode; // FF、Chrome IE下获取键盘码
    if (typeof (len) === 'number' && value.length >= len) {
        if ((c !== 8 && c !== 46 && // 8 - Backspace, 46 - Delete
            (c < 37 || c > 40)) // 37 (38) (39) (40) - Left (Up) (Right) (Down) Arrow
            || e.shiftKey) { // Shift键，对应的code为16
            e.preventDefault(); // 阻止事件传播到keypress
        }
    } else {
        if (c === 110 || c === 190) { // 110 (190) - 小(主)键盘上的点
            // 已有小数点或者文本框为空，不允许输入点
            if (value.indexOf('.') >= 0 || !value.length) {
                // 事件处理程序返回 false 不再停止事件传播，取而代之，应该根据需要手动触发
                e.preventDefault();
            }
        } else if (c === 109 || c === 189) { // 109 (189) - 小(主)键盘上的减号
            // 已有减号或者value的长度大于0(减号不在第一位),不允许输入
            if (value.indexOf('-') >= 0 || value.length > 0) {
                e.preventDefault();
            }
        } else {
            if ((c !== 8 && c !== 46 && // 8 - Backspace, 46 - Delete
                (c < 37 || c > 40) && // 37 (38) (39) (40) - Left (Up) (Right) (Down) Arrow
                (c < 48 || c > 57) && // 48~57 - 主键盘上的0~9
                (c < 96 || c > 105)) // 96~105 - 小键盘的0~9
                || e.shiftKey) { // Shift键，对应的code为16
                e.preventDefault(); // 阻止事件传播到keypress
            }
        }
    }
}

export default digitInput;