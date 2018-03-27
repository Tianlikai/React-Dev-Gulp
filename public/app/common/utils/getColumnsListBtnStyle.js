import isUseableColumnsListBtn from './isUseableColumnsListBtn';

/**
 * 获取ColumnsList按钮样式 分可用和禁用样式
 * 返回值：object类型
 * @param {*} selectedLength 
 */
const getColumnsListBtnStyle = (selectedLength) => {
    let flag = this.isUseableColumnsListBtn(selectedLength);
    let themeObj = {
        imgStyle: { verticalAlign: 'top', width: 17, height: 17 },
        unUseableImgStyle: { verticalAlign: 'top', width: 17, height: 17, borderRadius: '50%', cursor: 'default' },

        btnStyleup: { borderRadius: '50%', width: 17, height: 17, padding: 0, border: 'none', outline: 'none' },
        unUseableBtnStyleup: { borderRadius: '50%', width: 17, height: 17, padding: 0, border: 'none', outline: 'none', cursor: 'default' },

        btnStyledown: { borderRadius: '50%', width: 17, height: 17, padding: 0, border: 'none', outline: 'none', marginTop: 10 },
        unUseableBtnStyledown: { borderRadius: '50%', width: 17, height: 17, padding: 0, border: 'none', outline: 'none', marginTop: 10, cursor: 'default' },

        isUseable: flag,
        imgSrcUp: flag ? './dist/images/configurationToUp.svg' : './dist/images/configurationToUpDisable.svg',
        imgSrcDown: flag ? './dist/images/configurationToDown.svg' : './dist/images/configurationToDownDisable.svg',
        theme: flag ? '' : 'disableButton',
    };
    return themeObj;
}

export default getColumnsListBtnStyle;