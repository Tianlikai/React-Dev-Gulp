// inputWithErrMsg 输入框 检测
const onInputChangeValidate2 = (value, regName, errHint) => {
    let hint = null;
    if (!value || value.length === 0) {
        hint = errHint;
    }
    return hint;
}

export default onInputChangeValidate2;