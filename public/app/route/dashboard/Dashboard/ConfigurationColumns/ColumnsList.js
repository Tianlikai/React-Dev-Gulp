import React, { Component } from 'react';
import isContainTheList from '../../../../common/utils/isContainTheList';
import getColumnsListBtnStyle from '../../../../common/utils/getColumnsListBtnStyle';
import isUseableColumnsListBtn from '../../../../common/utils/isUseableColumnsListBtn';
import Button from '../../../../component/form/Button';

// const factory = (Button) => {
class ColumnsList extends Component {
    constructor(props) {
        super(props);
        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);
    }
    ColListItemOnClick(index, item, e) {
        let selectedColList = Object.assign([], this.props.selectedColList);
        let isContain = isContainTheList(selectedColList, item);
        if (!isContain) {
            selectedColList.push(item);
        } else {
            selectedColList.splice(selectedColList.indexOf(item), 1);
        }
        if (this.props.selectedCols) {
            this.props.selectedCols(selectedColList, this.props.type);
        }
    }
    renderColList(colList) {
        if (!colList.length) {
            return null;
        }
        let self = this;
        return (
            colList.map(function (item, index) {
                let flag = self.props.selectedColList.indexOf(item) < 0 ? false : true;
                return (
                    <div
                        key={'ColListItem' + index}
                        onClick={self.ColListItemOnClick.bind(self, index, item)}>
                        <input
                            ref={'ColListIteminput' + item}
                            key={'ColListIteminput' + item}
                            checked={flag}
                            type="checkbox"
                            value={item} />
                        <span>{item}</span>
                    </div>
                );
            })
        );
    }
    moveUp() {
        let listLen = this.props.selectedColList.length;
        let isUseable = isUseableColumnsListBtn(listLen);
        if (isUseable && listLen > 0) { // 当列表长度等于1时才可以上下移动
            let arr = Object.assign([], this.props.ColList);
            let i = arr.indexOf(this.props.selectedColList[0]);
            if (i > 0) {
                arr[i] = arr.splice(i - 1, 1, arr[i])[0];
            }
            if (this.props.sortedCols) {
                this.props.sortedCols(arr);
            }
        }
    }
    moveDown() {
        let listLen = this.props.selectedColList.length;
        let isUseable = isUseableColumnsListBtn(listLen);
        if (isUseable && listLen > 0) { // 当列表长度等于1时才可以上下移动
            let arr = Object.assign([], this.props.ColList);
            let i = arr.indexOf(this.props.selectedColList[0]);
            if (i < arr.length - 1) {
                arr[i] = arr.splice(i + 1, 1, arr[i])[0];
            }
            if (this.props.sortedCols) {
                this.props.sortedCols(arr);
            }
        }
    }
    render() {
        let {
            imgStyle,
            unUseableImgStyle,
            btnStyleup,
            unUseableBtnStyleup,
            btnStyledown,
            unUseableBtnStyledown,
            isUseable,
            imgSrcUp,
            imgSrcDown,
            theme,
        } = getColumnsListBtnStyle(this.props.selectedColList.length);

        return (
            <div className={this.props.className} style={{ width: this.props.hasMoveUpandDown ? 260 : 235 }}>
                <div className={this.props.className + 'Title'}>{this.props.title}</div>
                <div className={this.props.className + 'item'} style={{ height: '100%' }}>
                    {this.renderColList(this.props.ColList)}
                </div>

                {this.props.hasMoveUpandDown ? <div className={this.props.className + 'method'} style={{ height: '100%', cursor: 'default' }}>
                    <Button
                        className={theme}
                        onClick={this.moveUp}
                        style={isUseable ? btnStyleup : unUseableBtnStyleup}>
                        <img title='上移' style={isUseable ? imgStyle : unUseableImgStyle} src={imgSrcUp} alt="上移" />
                    </Button>

                    <Button
                        className={theme}
                        onClick={this.moveDown}
                        style={isUseable ? btnStyledown : unUseableBtnStyledown}>
                        <img title='下移' style={isUseable ? imgStyle : unUseableImgStyle} src={imgSrcDown} alt="下移" />
                    </Button>
                </div> : null}
            </div>
        );
    }
}
//     return ColumnsList;
// }

// const ColumnsList = factory(Button);

ColumnsList.propTypes = {
    className: React.PropTypes.string,
    title: React.PropTypes.string,
    hasMoveUpandDown: React.PropTypes.bool,
    ColList: React.PropTypes.array,
    selectedColList: React.PropTypes.array,
    selectedCols: React.PropTypes.func,
    sortedColsL: React.PropTypes.func,
    type: React.PropTypes.string,
    len: React.PropTypes.number,
};
export default ColumnsList;
// export {factory as ColumnsListFactory};

