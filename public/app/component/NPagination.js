'use strict';

const React = require('react');
const Reflux = require('reflux');
const classNames = require('classnames');
const ClassNameMixin = require('./mixins/ClassNameMixin');

const NPagination = React.createClass({
    mixins: [
        ClassNameMixin
    ],
    PropTypes: {
        className: React.PropTypes.string,
        index: React.PropTypes.number,
        jumper: React.PropTypes.bool,
        mini: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        pages: React.PropTypes.number,
        size: React.PropTypes.number,
        style: React.PropTypes.object,
        total: React.PropTypes.number,
        isshow: React.PropTypes.bool,
    },
    getDefaultProps: function () {
        return {
            index: 1,
            pages: 8,
            size: 20,
            total: 0
        };
    },
    getInitialState: function () {
        return {
            index: this.props.index || 1
        };
    },
    getIndex: function () {
        return this.state.index;
    },
    setIndex: function (index) {
        var i = parseInt(index, 10);
        this.setState({
            index: i
        });
    },
    setInput: function (event) {
        event.preventDefault();
        var value = this.refs.input.value;
        value = parseInt(value, 10);
        if (isNaN(value)) {
            return;
        }
        if (value < 1) {
            this.handleChange(1);
            return;
        }
        this.setIndex(value);
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    },
    handleChange: function (index) {
        this.setIndex(index);
        if (this.refs.input) {
            this.refs.input.value = index;
        }
        if (this.props.onChange) {
            let isActive = index === this.state.index ? false : true; // 点击当前页码 不请求后台接口
            this.props.onChange(index, isActive);
        }
    },
    getPages: function () {
        var total = this.props.total;
        var size = this.props.size;
        var index = this.state.index;
        var span = this.props.pages;
        var max = Math.ceil(total / size);
        var pages = [];
        var left;
        var right;

        if (index > max) {
            index = max;
        }
        left = index - Math.floor(span / 2) + 1;
        if (left < 1) {
            left = 1;
        }
        right = left + span - 2;
        if (right >= max) {
            right = max;
            left = right - span + 2;
            if (left < 1) {
                left = 1;
            }
        } else {
            right -= left > 1 ? 1 : 0;
        }

        // add first
        if (left > 1) {
            pages.push(1);
            if (index >= 5) {
                pages.push('...');
            }
        }
        for (var i = left; i < right + 1; i++) {
            pages.push(i);
        }
        // add last
        if (right < max) {
            if (index <= max - 3) {
                pages.push('....');
            }
            pages.push(max);
        }
        if (pages.length === 0) {
            pages.push(1);
            max = 1;
        }
        return [pages, max];
    },
    render: function () {
        if (!this.props.isshow) {
            return null;
        }
        var index = this.state.index;
        var mini = this.props.mini ? true : false;
        var ipages = this.getPages();
        var items = [];

        var pages = ipages[0];
        var max = ipages[1];

        // Previous
        items.push(
            <li key='previous'
                onClick={
                    index <= 1 ? null : this.handleChange.bind(this, index - 1)
                }
                className={
                    classNames({
                        disabled: index <= 1
                    })
                } >
                <a> &laquo; </a>
            </li>
        );

        if (mini) {
            items.push(
                <form key="i" onSubmit={this.setInput.bind(this)} >
                    <input ref="input"
                        defaultValue={this.state.index}
                        type="text"
                        className="rct-form-control" />
                </form>
            );
            items.push(<span key="s"> / {max}</span>);
        } else {
            pages.map(function (page) {
                if (page === '...') {
                    items.push(
                        <li className={classNames({ active: page === index }, 'nohover')}
                            title='中间省略页数'>
                            <a> {page} </a>
                        </li>
                    );
                } else if (page === '....') {
                    items.push(
                        <li className={classNames({ active: page === index }, 'nohover')}
                            title='中间省略页数' >
                            <a> {page.substr(0, 3)} </a>
                        </li>
                    );
                } else {
                    items.push(
                        <li onClick={this.handleChange.bind(this, page)}
                            className={classNames({ active: page === index })}
                            key={'npage' + page} >
                            <a> {page} </a>
                        </li>
                    );
                }
            }.bind(this));
        }

        // Next
        items.push(
            <li key="next"
                onClick={
                    index >= max ? null : this.handleChange.bind(this, index + 1)
                }
                className={
                    classNames({
                        disabled: index >= max
                    })
                } >
                <a> &raquo; </a>
            </li>
        );

        var className = classNames(
            this.props.className,
            'rct-pagination-wrap', {
                'rct-pagination-mini': mini
            }
        );
        return (
            <div style={this.props.style}
                className={className} >
                <ul className='rct-pagination'
                    style={{ margin: '0 auto' }} >
                    {items}
                </ul>
                {this.props.jumper && !mini &&
                    <form onSubmit={this.setInput.bind(this)} >
                        <div className='rct-input-group' >
                            <input ref='input'
                                defaultValue={this.state.index}
                                type='text'
                                className='rct-form-control' />
                            <span onClick={this.setInput.bind(this)}
                                className='addon'> go </span>
                        </div>
                    </form>
                }
            </div>
        );
    }
});

module.exports = NPagination;
