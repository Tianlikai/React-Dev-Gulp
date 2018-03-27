const React = require('react');
const Reflux = require('reflux');
const ReactDOM = require('react-dom');
const InputGroup = require('../../../../component/InputGroup');
const Table = require('../../../../component/Elements/Table');

const PublishToUser = React.createClass({
    getInitialState: function () {
        return {
            userList: this.props.data || [],
            checkList: this.props.checkList || [],
            totalItems: this.props.data ? this.props.data.length : 0
        };
    },
    componentDidMount: function () {
        window.addEventListener('resize', this.calculateTheadeWidth);
    },
    componentWillUnmount: function () {
        window.removeEventListener('resize', this.calculateTheadeWidth);
    },
    componentDidUpdate: function () {
        this.calculateTheadeWidth();
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.data) {
            this.setState({
                userList: nextProps.data,
                totalItems: nextProps.data.length
            });
        }
        if (nextProps.checkList) {
            this.setState({
                checkList: nextProps.checkList
            }, function () {
                this.setTheadChecked(nextProps.checkList);
            });
        }
    },
    // 计算thead的宽度
    calculateTheadeWidth: function () {
        var trFirst = this.refs.oTbody.childNodes[0];
        if (trFirst) {
            var tdArray = trFirst.childNodes;
            var tdHead = this.refs.oThead.childNodes;
            for (var i = 0; i < tdHead.length; i++) {
                tdHead[i].style.width = tdArray[i].offsetWidth + 'px';
            }
            // table需要设定宽度
            var samptable = ReactDOM.findDOMNode(this.refs.oTable);
            samptable.style.width = trFirst.offsetWidth + 1 + 'px';
        }
    },
    // 获取选中的用户ids
    getValue: function () {
        let ids = [];
        let checkList = this.state.checkList;
        for (let i = 0, j = checkList.length; i < j; i++) {
            ids.push(checkList[i].id);
        }
        return ids;
    },
    // 判断checkbox是否被选中
    setCheckboxState: function (id) {
        let flag = false;
        let checkList = this.state.checkList;
        for (let i = 0, j = checkList.length; i < j; i++) {
            if (checkList[i].id === id) {
                flag = true;
                break;
            }
        }
        return flag;
    },
    // 清除 tr 选中
    clearTrStatus: function () {
        var trArray = this.refs.oTbody.childNodes;
        for (var i = 0; i < trArray.length; i++) {
            if (trArray[i].className === 'trSelected') {
                trArray[i].className = '';
            }
        }
    },
    // 根据姓名和邮箱定位用户
    handleSearchUser: function () {
        // 清除选中
        this.clearTrStatus();
        var errormsg = '';
        var haserror = false;
        var searchValue = this.refs.searchGroup.getRawValue();
        if (searchValue === '') {
            errormsg = '搜索条件不能为空';
            haserror = true;
            return;
        }
        var totalNum = this.state.totalItems;
        if (totalNum === 0) {
            errormsg = '用户为空';
            haserror = true;
            return;
        }
        var userList = this.state.userList;
        var searchIds = [];
        // 先全匹配 姓名
        for (let i = 0; i < totalNum; i++) {
            if (searchValue.toLowerCase() === userList[i].name.toLowerCase()) {
                searchIds.push(i);
            }
        }
        if (searchIds.length === 0) {
            // 全匹配 邮箱
            for (let j = 0; j < totalNum; j++) {
                if (searchValue.toLowerCase() === userList[j].email.toLowerCase()) {
                    searchIds.push(j);
                }
            }
            if (searchIds.length === 0) {
                // 模糊匹配 姓名
                for (let x = 0; x < totalNum; x++) {
                    if (userList[x].name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                        searchIds.push(x);
                    }
                }
                if (searchIds.length === 0) {
                    // 模糊匹配 邮箱
                    for (let y = 0; y < totalNum; y++) {
                        if (userList[y].email.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                            searchIds.push(y);
                        }
                    }
                }
            }
        }

        if (searchIds.length === 0) {
            errormsg = '请输入正确的用户名或邮箱';
            haserror = true;
            return;
        }
        // 找到要定位的地方
        let trs = this.refs.oTbody.childNodes;
        for (let i = 0, j = searchIds.length; i < j; i++) {
            let searchTr = trs[searchIds[i]];
            searchTr.className = 'trSelected';
        }
        this.refs.tbodyScroll.scrollTop = trs[searchIds[0]].offsetTop;
    },
    setTheadChecked: function (checkList) {
        let theadCheckbox = this.refs.oThead.getElementsByTagName('input')[0];
        if (checkList.length === 0) {
            theadCheckbox.checked = false;
        } else if (checkList.length === this.state.totalItems) {
            theadCheckbox.checked = true;
        } else {
            theadCheckbox.checked = false;
        }
    },
    // 点击checkbox或者tr
    handleCheck: function (item, index, from, event) {
        event.stopPropagation();
        let checkList = this.state.checkList.concat([]);
        let removeIndex = ''; // 点击的item与checkList重复的位置
        for (let i = 0, j = checkList.length; i < j; i++) {
            if (item.id === checkList[i].id) {
                removeIndex = i;
                break;
            }
        }
        if (removeIndex !== '') {
            checkList.splice(removeIndex, 1);
        } else {
            checkList.push(item);
        }
        this.setTheadChecked(checkList);
        if (this.props.onChange) {
            this.props.onChange(checkList);
        }
    },
    // 点击thead中的checkbox时
    handleCheckAll: function (e) {
        let checked = e.target.checked;
        if (checked) {
            let checkList = this.state.userList;
            if (this.props.onChange) {
                this.props.onChange(checkList);
            }
        } else {
            if (this.props.onChange) {
                this.props.onChange([]);
            }
        }
    },
    // 渲染用户列表
    renderTbody: function () {
        var trs = null;
        if (this.state.totalItems !== 0) {
            let data = this.state.userList;
            let flag = false;
            let self = this;
            trs = data.map(function (item, index) {
                var tr = null;
                flag = self.setCheckboxState(item.id);
                tr = (
                    <tr key={'tritem' + index}
                        onClick={this.handleCheck.bind(this, item, index, 'tr')}>
                        <td style={{ width: 30 }}>
                            <input key={'tdRadio' + item.id}
                                value={item.id}
                                checked={flag}
                                type='checkbox'
                                onClick={this.handleCheck.bind(this, item, index, 'checkbox')} />
                        </td>
                        <td>
                            <div title={item.name}
                                style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.name}
                            </div>
                        </td>
                        <td>
                            <div title={item.email}
                                style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.email}
                            </div>
                        </td>
                    </tr>
                );
                return tr;
            }.bind(this));
        }
        return trs;
    },
    render: function () {
        let tBody = this.renderTbody();
        return (
            <div className='publishToUser-page' style={this.props.style}>
                <div className='titleDiv'>
                    <div className='title'>
                        <img src='./dist/images/selectPublishUser.png' />
                        选择分享对象
                    </div>
                    <InputGroup ref='searchGroup'
                        placeholder='搜索分享用户名称'
                        handleEnterKeyEvent={this.handleSearchUser} />
                </div>
                <div className='theadWrap'>
                    <Table ref='oTable'>
                        <thead>
                            <tr key='tritenheader' ref='oThead'>
                                <th style={{ width: 30 }}>
                                    <input type='checkbox' onClick={this.handleCheckAll} />
                                </th>
                                <th>姓名</th>
                                <th>邮箱</th>
                            </tr>
                        </thead>
                    </Table>
                </div>
                <div className='tbodyWrap'
                    ref='tbodyScroll'>
                    <Table>
                        <tbody ref='oTbody'>
                            {tBody}
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
});

module.exports = PublishToUser;
