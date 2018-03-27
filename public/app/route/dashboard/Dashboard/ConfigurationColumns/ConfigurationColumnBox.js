import React, { Component } from 'react';

import ColumnsList from './ColumnsList';
import InputGroup from '../../../../component/InputGroup';
import Button from '../../../../component/form/Button';

// const factory = (ColumnsList, InputGroup, Button) => {
class ConfigurationColumnBox extends Component {
    constructor(props) {
        super(props);
        this.moveToLeft = this.moveToLeft.bind(this);
        this.moveTORight = this.moveTORight.bind(this);
        this.selectedCols = this.selectedCols.bind(this);
        this.sortedCols = this.sortedCols.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }
    moveTORight() {
        if (this.props.selectedhideColList.length) {
            let selectedhideColList = this.props.selectedhideColList;
            let showColList = this.props.showColumns.concat(selectedhideColList);
            let showAll = this.props.showAll.concat(selectedhideColList);

            let hideColList = Object.assign([], this.props.hiddenColumns);
            let hideAll = Object.assign([], this.props.hideAll);

            selectedhideColList.forEach(function (item, index) {
                hideColList.splice(hideColList.indexOf(item), 1);
                hideAll.splice(hideAll.indexOf(item), 1);
            });
            if (this.props.handleStateChange) {
                this.props.handleStateChange(showColList, hideColList, null, [], 1, hideAll, showAll);
            }
        }
    }
    moveToLeft() {
        if (this.props.selectedshowColList.length) {
            let selectedshowColList = this.props.selectedshowColList;
            let hideColList = this.props.hiddenColumns.concat(selectedshowColList);
            let hideAll = this.props.hideAll.concat(selectedshowColList);

            let showColList = Object.assign([], this.props.showColumns);
            let showAll = Object.assign([], this.props.showAll);

            selectedshowColList.forEach(function (item, index) {
                showColList.splice(showColList.indexOf(item), 1);
                showAll.splice(showAll.indexOf(item), 1);
            });
            if (this.props.handleStateChange) {
                this.props.handleStateChange(showColList, hideColList, [], null, 2, hideAll, showAll);
            }
        }
    }
    selectedCols(cols, type) {
        switch (type) {
            case 'hidebox':
                if (this.props.handleStateChange) {
                    this.props.handleStateChange(null, null, null, cols, 3);
                }
                break;
            case 'showbox':
                if (this.props.handleStateChange) {
                    this.props.handleStateChange(null, null, cols, null, 4);
                }
                break;
            default:
                break;
        }
    }
    sortedCols(showColList) {
        if (this.props.handleStateChange) {
            this.props.handleStateChange(showColList, [], [], [], 5);
        }
    }
    /**
    * 字段搜索
    * @param {*} value 
    */
    handleSearch(value) {
        let showColList = [];
        let hideColList = [];
        let flag = 7;
        if (value) {
            flag = 6;
            this.props.showAll.forEach(function (item) {
                if (item.indexOf(value) >= 0) {
                    showColList.push(item);
                }
            }, this);
            this.props.hideAll.forEach(function (item) {
                if (item.indexOf(value) >= 0) {
                    hideColList.push(item);
                }
            }, this);
        }
        if (this.props.handleStateChange) {
            this.props.handleStateChange(showColList, hideColList, [], [], flag, this.props.hideAll, this.props.showAll);
        }
    }
    render() {
        if (this.props.showAll.length <= 0 && this.props.hideAll.length <= 0) {
            return null;
        }
        return (
            <div className='ConfigurationColumnBox'>
                <InputGroup
                    style={{ minWidth: 240, width: 240, marginBottom: 8 }}
                    inputWidth={{ width: '72%' }}
                    ref='nameFilter'
                    placeholder='搜索字段名称...'
                    handleEnterKeyEvent={this.handleSearch}
                />
                <ColumnsList
                    className='ConfigurationColumnBoxLeft'
                    title='隐藏字段'
                    hasMoveUpandDown={false}
                    ColList={this.props.hiddenColumns}
                    selectedColList={this.props.selectedhideColList}
                    selectedCols={this.selectedCols}
                    type='hidebox'
                />
                <div className='ConfigurationColumnBoxCenter'>
                    <Button
                        style={{ width: 42, height: 24, padding: 0, border: 'none', outline: 'none' }}
                        onClick={this.moveTORight}
                    >
                        <img
                            title='右移'
                            style={{ width: 42, height: 24 }} src="./dist/images/configurationToRight.svg" alt="右移" />
                    </Button>

                    <Button
                        style={{ width: 42, height: 24, padding: 0, border: 'none', outline: 'none', marginTop: 10 }}
                        onClick={this.moveToLeft}
                    >
                        <img
                            title='左移'
                            style={{ width: 42, height: 24 }} src="./dist/images/configurationToLeft.svg" alt="左移" />
                    </Button>
                </div>
                <ColumnsList
                    className='ConfigurationColumnBoxRight'
                    title='显示字段'
                    hasMoveUpandDown={true}
                    ColList={this.props.showColumns}
                    selectedColList={this.props.selectedshowColList}
                    selectedCols={this.selectedCols}
                    type='showbox'
                    sortedCols={this.sortedCols}
                    len={this.props.showAll.length}
                />
            </div>
        );
    }
}
//     return ConfigurationColumnBox;
// }

// const ConfigurationColumnBox = factory(ColumnsList, InputGroup, Button);
ConfigurationColumnBox.propTypes = {
    showColumns: React.PropTypes.array,
    hiddenColumns: React.PropTypes.array,
    selectedshowColList: React.PropTypes.array,
    selectedhideColList: React.PropTypes.array,
    handleStateChange: React.PropTypes.func,
    from: React.PropTypes.string,
};
export default ConfigurationColumnBox;
// export { factory as ConfigurationColumnBoxFactory };

