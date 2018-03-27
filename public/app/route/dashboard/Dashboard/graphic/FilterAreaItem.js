/*
新建、编辑销售线索-->筛选条件-->51DESK区域
*/
import React, { Component } from 'react';
const ReactDOM = require('react-dom');
const Reflux = require('reflux');
const RModal = require('react-modal-bootstrap');
const updateHeight = require('../../../../common/utils/updateHeight');
const removeModalOpenClass = require('../../../../common/utils/removeModalOpenClass')
const arrayDereplication = require('../../../../common/utils/arrayDereplication')
const actions = require('../../../../actions/actions');
const Config = require('../../../../common/Config');
const SystemValue = require('../../../../data/SystemValue');
const Lang = require('../../../../data/lang');
const PageMethod = require('../../../../common/PageMethod');

const Close = require('../../../../component/form/Close');
const Button = require('../../../../component/form/Button');
const REchart = require('../ReactEchart');

const ChinaMap = require('./ChinaMap');

const UtilStore = require('../../../../stores/UtilStore');

class FilterAreaItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colDesc: this.props.colDesc, // 51DESK区域
            condName: this.props.condName, // 等于
            areaIds: this.props.areaIds, // 选中的区域的id(省份和大区) 数组
            areaNames: this.props.areaNames // 选中的区域的name(省份) 数组
        };
        this.showAreaModal = this.showAreaModal.bind(this);
        this.onSave = this.onSave.bind(this);
    }
    getValue() {
        return this.state.areaIds;
    }
    showAreaModal() {
        this.refs.areaModal.openModal(this.state.areaIds, this.state.areaNames);
    }
    onSave(data) {
        this.setState({
            areaIds: data.ids,
            areaNames: data.names
        });
    }
    render() {
        let name = this.state.areaNames.join(',');
        return (
            <div className='desk51-edit-page module-wrap'>
                <div className='colSelect-module1 rct-form-control' title={this.state.colDesc}>
                    {this.state.colDesc}
                </div>
                <div className='cond-module2'>{this.state.condName}</div>
                <div
                    className='rct-form-control condValue-module3'
                    onClick={this.showAreaModal}
                    title={name}
                >{name}</div>
                <AreaModal
                    ref='areaModal'
                    onSave={this.onSave}
                />
            </div>
        );
    }
}

FilterAreaItem.propTypes = {
    colDesc: React.PropTypes.string,
    condName: React.PropTypes.string,
    areaIds: React.PropTypes.array,
    areaNames: React.PropTypes.array
};
FilterAreaItem.defaultProps = {
    colDesc: '',
    condName: '',
    areaIds: [],
    areaNames: []
};

class AreaModal extends Component {
    constructor(props) {
        super(props);
        this.state = this.setDefaultState();
        this.hideModal = this.hideModal.bind(this);
        this.handleCommit = this.handleCommit.bind(this);
        this.handleFirstAreaSelected = this.handleFirstAreaSelected.bind(this);
        this.handleSysDefAreaSelected = this.handleSysDefAreaSelected.bind(this);
        this.handleResetSelect = this.handleResetSelect.bind(this);
    }
    setDefaultState() {
        return {
            isModalOpen: false,
            areaList: null,
            country: null,
            areaSelectedList: [], // 保存地区id
            areaSelectedNameList: [] // 保存所选地区名称集合
        };
    }
    componentDidMount() {
        this.unsubscribe1 = UtilStore.listen(this.pubsub, this);
    }
    componentWillUnmount() {
        this.unsubscribe();
        this.unsubscribe1();
    }
    pubsub(type, data) {
        if (type === 'updateHeight') {
            updateHeight(this.refs.modalBody, PageMethod.getInnerHeight5());
            updateHeight(this.refs.pageWrap, PageMethod.getInnerHeight5() - 48);
        }
        if (type === 'getAreaListSuccess') {
            // 补充全国选项
            var country = {
                id: 1,
                name: '全国',
                sub_areas: [],
                parent_areas: []
            };
            // data.xt_areas系统区域，data.user_areas用户自定义区域
            data.xt_areas.forEach(function (item) {
                country.parent_areas.push(item);
                item.sub_areas.forEach(function (elem) {
                    country.sub_areas.push(elem);
                });
            });
            this.setState({
                areaList: data,
                country: country
            });
        }
    }
    // 打开模态框时
    openModal(ids, names) {
        this.setState({
            isModalOpen: true,
            areaSelectedList: ids,
            areaSelectedNameList: names
        }, function () {
            actions.getAreaList();
            this.renderMapArea(names);
        });
    }
    // 关闭 模态框
    hideModal() {
        let initState = this.setDefaultState();
        this.setState(initState);
        removeModalOpenClass(); // 移除body的‘modal-open’
    }
    handleCommit() {
        if (this.props.onSave) {
            this.props.onSave({
                ids: this.getSelectedValue(),
                names: arrayDereplication(this.state.areaSelectedNameList)
            });
            this.hideModal();
        }
    }
    // 获取选中的区域ids
    getSelectedValue() {
        var ids = this.mapAreaNameToId(this.state.areaSelectedNameList);
        return ids;
    }
    // 重置 选择的区域
    handleResetSelect() {
        this.setState({
            areaSelectedList: [],
            areaSelectedNameList: []
        }, function () {
            this.renderMapArea([]);
        });
    }
    /**
     * 根据省份名称获取对应id
     * @param array names ['上海', '浙江']
     * @return array ids [1,2]
     */
    mapAreaNameToId(names) {
        var uniqueNames = arrayDereplication(names);
        var ids = [];
        uniqueNames.forEach(function (name) {
            ids.push(nameMap[name]);
        });
        return ids;
    }
    // 选中系统区域
    handleSysDefAreaSelected(id, name) {
        var result = this.state.areaSelectedList.concat();
        var nameList = this.state.areaSelectedNameList.concat();
        var index = result.indexOf(id);
        if (index !== -1) {
            result.splice(index, 1);
            nameList.splice(nameList.indexOf(name), 1);
        } else {
            result.push(id);
            nameList.push(name);
        }
        this.setState({
            areaSelectedList: result,
            areaSelectedNameList: nameList
        }, function () {
            this.renderMapArea(nameList);
        });
        // this.props.onChange(result);
    }
    // 1.选中区域后添加到 areaSelectedList和 areaSelectedNameList
    // 2.删除自定义区域时，从 areaSelectedList和 areaSelectedNameList中去除
    // 并重绘界面(地图)
    handleFirstAreaSelected(id, name, position, isUserDef) {
        var result = this.state.areaSelectedList.concat();
        var nameList = this.state.areaSelectedNameList.concat();
        var provinces = this.fixAreaName(name, position, isUserDef);

        var index = result.indexOf(id);
        if (index !== -1) {
            result.splice(index, 1);
            this.removeItem(nameList, provinces);
        } else {
            result.push(id);
            nameList = nameList.concat(provinces);
        }
        this.setState({
            areaSelectedList: result,
            areaSelectedNameList: nameList
        }, function () {
            this.renderMapArea(nameList);
        });
        // this.props.onChange(result);
    }
    /**
     * 去除省份
     * @param array baseArr 基础省份
     * @param array delArr 需要删除的省份集合
     * @return array
     */
    removeItem(baseArr, delArr) {
        delArr.forEach(function (item) {
            var index = baseArr.indexOf(item);
            if (index !== -1) {
                baseArr.splice(index, 1);
            }
        });
        return baseArr;
    }
    /**
     * 区域或自定义区域名称，转换为省份名称array
     * @param string name
     * @param number position
     * @param bool isUserDef 是否为用户自定义区域
     * @return array
     */
    fixAreaName(name, position, isUserDef) {
        var result = [];
        if (name === '全国') {
            result = this.state.country.sub_areas.concat();
        } else if (isUserDef) {
            result = this.state.areaList.user_areas[position].sub_areas.concat();
        } else {
            result = this.state.areaList.xt_areas[position].sub_areas.concat();
        }
        return result.map(function (item) {
            return item.name;
        });
    }
    /**
     * 渲染地图选中区域
     * @param array data 地区名字array
     */
    renderMapArea(data) {
        var result = [];
        data.forEach(function (item) {
            var dataObjTemp = {
                selected: true,
                itemStyle: {
                    emphasis: {
                        areaColor: '#FFA726'
                    }
                },
                label: {
                    emphasis: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                }
            };
            dataObjTemp.name = item;
            result.push(dataObjTemp);
        });
        this.refs.chinaMap.setOption(result);
    }
    // 渲染所有的区域选择(全国，省，市)
    renderArea(arealist) {
        let self = this;
        var systemDefineAres = null; // 系统地图
        var fixFirstArea = null;

        if (arealist.xt_areas.length) {
            systemDefineAres = arealist.xt_areas.map(function (item, index) {
                var rowButtons = item.sub_areas.map(function (elem, indx) {
                    return (
                        <div key={'sysareasitem' + indx}
                            className={self.state.areaSelectedList.indexOf(elem.id) !== -1 ?
                                'modal-selectItem selected' :
                                'modal-selectItem'}
                            onClick={self.handleSysDefAreaSelected.bind(null, elem.id, elem.name)}>
                            {elem.name}
                        </div>
                    );
                });
                return (
                    <div key={'sysareasrow' + index}>
                        <div className='col-sm-2'
                            style={{ fontWeight: 'bold' }}>{item.name}</div>
                        <div className='col-sm-10'>{rowButtons}</div>
                    </div>
                );
            });
        }

        fixFirstArea = this.state.country.parent_areas.map(function (item, index) {
            return (
                <div key={'firstareasitem' + index}
                    className={self.state.areaSelectedList.indexOf(item.id) !== -1 ?
                        'modal-selectItem selected' :
                        'modal-selectItem'}
                    onClick={self.handleFirstAreaSelected
                        .bind(null, item.id, item.name, index, false)}>
                    {item.name}
                </div>
            );
        });

        var bodySelect = (
            <div style={{ paddingTop: 15, marginBottom: '15px' }}>
                <div>
                    <div className='col-sm-2'
                        style={{ fontWeight: 'bold' }}>{this.state.country.name}</div>
                    <div className='col-sm-10'>
                        <div
                            className={this.state.areaSelectedList.indexOf(1) !== -1 ?
                                'modal-selectItem selected' :
                                'modal-selectItem'}
                            onClick={this.handleFirstAreaSelected.bind(null, 1, '全国')}>
                            {this.state.country.name}
                        </div>
                        {fixFirstArea}
                    </div>
                </div>
                {systemDefineAres}
            </div>
        );
        return bodySelect;
    }
    render() {
        if (!this.state.isModalOpen) {
            return null;
        }
        let minheights = PageMethod.getInnerHeight5();
        let modalClass =
            this.state.isModalOpen ? 'addModal areaModal' : 'addModal close areaModal';
        let area = null;
        if (this.state.areaList) {
            area = this.renderArea(this.state.areaList);
        }
        return (
            <RModal.Modal className={modalClass}
                isOpen={this.state.isModalOpen}
                onRequestHide={this.hideModal} >

                <div className="modal-header">
                    <div className='title'>51DESK区域</div>
                </div>

                <div ref='modalBody' style={{ overflowY: 'auto', height: minheights }}
                    className='modal-body'>
                    <div
                        ref='pageWrap'
                        className='area'
                        style={{ height: minheights - 48 }}>
                        <ChinaMap ref='chinaMap' />
                        <div>
                            <span style={{ fontWeight: 'bold' }}>请选择区域</span>
                            <span className='span-reset' onClick={this.handleResetSelect}>
                                重置</span>
                            {area}
                        </div>
                    </div>
                </div>

                <div className='modal-footer'>
                    <Button className='confirm'
                        onClick={this.handleCommit}>确定</Button>
                    <Button className='cancel'
                        onClick={this.hideModal}>取消</Button>
                </div>
            </RModal.Modal>
        );
    }
}

module.exports = { AreaModal, FilterAreaItem };
