const React = require('react');
const classNames = require('classnames');
const ReactDOM = require('react-dom');
const Events = require('./utils/Events');
const isNodeInTree = require('./utils/isNodeInTree');
const isOverFlow = require('../common/utils/isOverFlow');
const isUndefined = require('../common/utils/isUndefined');
const getOuterHeight = require('../common/utils/getOuterHeight');
const withoutTransition = require('../common/utils/withoutTransition');

const SelectWithHint = React.createClass({
    propsTypes: {
        readOnly: React.PropTypes.bool,
        dataIsObject: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        data: React.PropTypes.array,
        classname: React.PropTypes.string,
        hint: React.PropTypes.string, // 提示信息
        defaultId: React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.string
        ]),
        defaultValue: React.PropTypes.string,
        defaultData: React.PropTypes.object,
        onToggle: React.PropTypes.func
    },
    initState: function () {
        return {
            active: false,
            hint: this.props.hint || '',
            dataIsObject: this.props.dataIsObject || false, // 下拉框的data是否是对象
            value: this.props.defaultValue || '',
            selectedId: this.props.defaultId, // 选中的下拉框的id
            selectedData: this.props.defaultData || null, // 当下拉框的数据时对象时，切换下拉框后选中的数据
            dropup: false,
            data: this.props.data || []
        };
    },
    getInitialState: function () {
        return this.initState();
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.data) {
            this.setState({
                data: nextProps.data
            });
        }
        if (this.props.defaultId !== nextProps.defaultId) {
            this.setState({
                selectedId: nextProps.defaultId
            });
        }
        if (this.props.defaultValue !== nextProps.defaultValue) {
            this.setState({
                value: nextProps.defaultValue
            });
        }
        if (!isUndefined(nextProps.defaultData)) {
            this.setState({
                selectedData: nextProps.defaultData
            });
        }
    },
    componentWillUnmount: function () {
        this.unBindOuterHandlers();
    },
    bindOuterHandlers: function () {
        Events.on(document, 'click', this.handlerOuterClick);
    },
    unBindOuterHandlers: function () {
        Events.off(document, 'click', this.handlerOuterClick);
    },
    // 点击的位置--是否在组件内
    handlerOuterClick: function (e) {
        if (isNodeInTree(e.target, ReactDOM.findDOMNode(this))) {
            return false;
        }
        // 如果点击的地方不在组件内，则卸载document的click事件
        this.setDocumentClick(false);
        this.setState({
            active: false
        });
    },
    setDocumentClick: function (state) {
        if (state) {
            this.bindOuterHandlers();
        } else {
            this.unBindOuterHandlers();
        }
    },
    // 新建，编辑 在同一页面时，操作完成后清空
    clearSelect: function () {
        let initState = {
            active: false,
            hint: this.props.hint || '',
            dataIsObject: this.props.dataIsObject || false, // 下拉框的data是否是对象
            value: '',
            selectedId: null, // 选中的下拉框的id
            dropup: false,
            data: []
        };
        this.setState(initState);
        this.setDocumentClick(false);
    },
    resetSelect: function () {
        let initState = this.initState();
        this.setState(initState);
        this.setDocumentClick(false);
    },
    getValue: function () {
        return this.state.value;
    },
    setValue: function (value) {
        this.setState({
            value: value
        });
    },
    // 设置hint
    setHint: function (value) {
        this.setState({
            hint: value
        });
    },
    getHint: function () {
        return this.state.hint;
    },
    getSelectedId: function () {
        return this.state.selectedId;
    },
    setSelectedId: function (id) {
        this.setState({
            selectedId: id
        });
    },
    getSelectedData: function () {
        return this.state.selectedData;
    },
    open: function () {
        if (!this.state.active && !this.props.readOnly) {
            var options = this.refs.options;
            options.style.display = 'block';
            var offset = getOuterHeight(options) + 5;
            var el = this.refs.container;
            var dropUp = isOverFlow(el, offset);

            withoutTransition(el, function () {
                this.setState({
                    dropup: dropUp
                });
            }.bind(this));

            this.setState({
                active: true
            });
            this.setDocumentClick(true);
        }
    },
    close: function () {
        this.setState({
            active: false
        });
        this.setDocumentClick(false);
    },
    toggleList: function (event) {
        event.stopPropagation();
        if (this.state.active) {
            this.close();
        } else {
            if (this.props.onToggle) {
                this.props.onToggle();
            }
            this.open();
        }
    },
    handleChange: function (item, index, event) {
        event.stopPropagation();
        if (this.props.readOnly) {
            return;
        }
        let value = item.name ? item.name : item;
        let id = item.id ? item.id : index;
        if (this.state.dataIsObject) {
            this.setState({
                value: value,
                selectedId: id,
                selectedData: item
            });
        } else {
            this.setState({
                value: item
            });
        }
        this.close();
        if (this.props.onChange) {
            this.props.onChange(item, this.props.name);
        }
    },
    handleInputChange: function (e) {
        let value = e.target.value;
        let regs = this.props.checkREG;
        let flag = regs.test(value);
        if (flag) {
            this.setState({
                value: e.target.value
            }, function () {
                let item = {
                    name: value
                };
                if (this.props.onChange) {
                    this.props.onChange(item, this.props.name);
                }
            });
        }
    },
    renderHint: function () {
        let hint = null;
        let hintClass = 'hint err';
        if (this.props.hint) { // 判断props是否有hint
            if (this.props.hint === this.state.hint) {
                hintClass = 'hint';
            }
        } else {
            if (this.state.hint === '') {
                hintClass = 'hint';
            }
        }
        // props没有hint或者this.props.hint !== this.state.hint时，用err样式
        hint = (
            <div className={hintClass}>
                {this.state.hint}
            </div>
        );
        return hint;
    },
    render: function () {
        let options = null;
        let data = this.state.data;
        if (this.state.dataIsObject) {
            options = data.map(function (item, index) {
                return (
                    <li key={'select' + index}
                        style={{ display: 'block' }}
                        title={item.name}
                        onClick={this.handleChange.bind(this, item, index)}
                    >
                        {item.name}
                    </li>
                );
            }.bind(this));
        } else {
            options = data.map(function (item, index) {
                if (item) {
                    return (
                        <li key={'select' + index}
                            style={{ display: 'block' }}
                            title={item}
                            onClick={this.handleChange.bind(this, item, index)}>
                            {item}
                        </li>
                    );
                }
            }.bind(this));
        }
        var classname = classNames(
            this.props.className,
            'rct-form-control',
            'rct-select',
            'single',
            {
                active: this.state.active,
                dropup: this.state.dropup
            }
        );
        let selectcontent;
        if (this.props.setdefault) {
            if (this.state.value) {
                selectcontent = this.state.value;
            } else {
                selectcontent = this.state.data[0].name ? this.state.data[0].name : this.state.data[0];
            }
        } else {
            selectcontent = this.state.value;
        }
        return (
            <div className='selectWithHint'>
                <div ref="container"
                    onClick={this.toggleList}
                    className={classname}
                    style={{ width: this.props.width }}>
                    {this.props.isChangeByBorad ?
                        <input
                            title={this.state.value}
                            className='titleName'
                            style={{ minHeight: 18, paddingRight: 15, display: 'inline-block', width: 50, border: 'none', outline: 'none' }}
                            value={this.state.value}
                            onChange={this.handleInputChange}>
                        </input> :
                        <div
                            title={this.state.value}
                            className='titleName'
                            style={{ minHeight: 18, paddingRight: 15 }}>
                            {selectcontent}
                        </div>
                    }
                    <div className="rct-select-options-wrap">
                        <hr />
                        <div ref="options" className="rct-select-options"
                            style={{ display: this.state.active ? 'block' : 'none' }}>
                            <ul>{options}</ul>
                        </div>
                    </div>
                </div>
                {this.renderHint()}
            </div>
        );
    }
});

module.exports = SelectWithHint;
