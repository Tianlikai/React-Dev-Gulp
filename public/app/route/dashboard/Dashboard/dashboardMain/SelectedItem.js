/*
选中的item，带叉号(取消)
*/
import React, { Component } from 'react';

class SelectedItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data || []
        };
        this.handleRemove = this.handleRemove.bind(this);
    }
    handleRemove(item) {
        if (this.props.onRemove) {
            this.props.onRemove(item);
        }
    }
    // 渲染 选中的 item
    renderSelectedItem(data) {
        let self = this;
        let flag = this.props.dataIsObject === 1;
        return data.map(function (item, index) {
            return (
                <div className='rec-modal-item' key={ 'selectedRow' + index }>
                    <div className='selected-wrap'>
                        <div
                            className='col-xs-10 modal-rec-selected-item'
                            title={flag ? item.name : item}
                        >
                            {flag ? item.name : item}
                        </div>
                        <div className='col-xs-2 modal-rec-selected-itemRemove'
                            onClick={self.handleRemove.bind(null, item)}>
                            <span className='close-red'></span>
                        </div>
                    </div>
                </div>
            );
        });
    }
    render() {
        let content = null;
        if (this.props.data.length > 0) {
            content = this.renderSelectedItem(this.props.data);
        }
        return (
            <div className='selected-item-page'>
                {content}
            </div>
        );
    }
}

SelectedItem.propTypes = {
    dataIsObject: React.PropTypes.number, // 是否是对象数组：-1不是，1是
    data: React.PropTypes.array, // 选中的item数组
    onRemove: React.PropTypes.func // 删除选中的item
};

SelectedItem.defaultProps = {
    dataIsObject: 1
};

module.exports = SelectedItem;
