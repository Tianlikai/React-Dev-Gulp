// input输入框只能输入数字
const digitInput2 = (value, fromEvent) => {
    var e = fromEvent; // FF、Chrome IE下获取事件对象
    var c = e.charCode || e.keyCode; // FF、Chrome IE下获取键盘码
    if ((c !== 8 && c !== 46 && // 8 - Backspace, 46 - Delete
        (c < 37 || c > 40) && // 37 (38) (39) (40) - Left (Up) (Right) (Down) Arrow
        (c < 48 || c > 57) && // 48~57 - 主键盘上的0~9
        (c < 96 || c > 105)) // 96~105 - 小键盘的0~9
        || e.shiftKey) { // Shift键，对应的code为16
        e.preventDefault(); // 阻止事件传播到keypress
    }
}

export default digitInput2;