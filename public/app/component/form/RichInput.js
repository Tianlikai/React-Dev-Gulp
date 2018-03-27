/**
 * 输出复杂提示版本
 * Created by Administrator on 2016/5/16.
 */

'use strict';

var React=require('react');
var classNames=require("classnames");
var ClassNameMixin=require("../mixins/ClassNameMixin.js");
var FormGroup=require("./FormGroup.js");
var Button=require("./Button.js");
var Constants=require("../constants.js");
var Icon=require("../Icon");
var Selected=require("./Selected");
var Close=require("../Close");

var Input = React.createClass({
    mixins: [ClassNameMixin],
    propTypes: {
        type:React.PropTypes.string,
        bsSize:React.PropTypes.oneOf(['sm','lg']),
        label:React.PropTypes.node, //文本提示
        labelClassName:React.PropTypes.string,//文本提示的class
        wrapperClassName:React.PropTypes.string,//input wrapper 的class
        id:React.PropTypes.string,
        validation:React.PropTypes.oneOf(['success','wraning','error',""]),
        defdisabled:React.PropTypes.bool,
        defchecked:React.PropTypes.bool,
        defvalue:React.PropTypes.string,
        inline:React.PropTypes.bool,
        standalone:React.PropTypes.bool,// 针对 Button 只渲染input 不渲染其他wrap和label
        addonBefore: React.PropTypes.node,
        addonAfter: React.PropTypes.node,
        btnBefore: React.PropTypes.node,
        btnAfter: React.PropTypes.node,
        labeladd:React.PropTypes.bool
    },
    getDefaultProps: function () {
        return {
            type: 'text'
        }
    },
    getFieldDOMNode: function () {
        return React.findDOMNode(this.refs.field);
    },
    isCheckboxOrRadio: function () {
        return this.props.type === 'radio' || this.props.type === 'checkbox';
    },
    renderLabel: function (children) {
        var classSet={};
        if(this.isCheckboxOrRadio()){
            (this.props.inline) && (classSet[this.setClassNamespace(this.props.type+"-inline")]=true);
        }else
            classSet[this.setClassNamespace('control-label')]=true;
        var labelclass=this.props.labelClassName;
        if( !('placeholder' in document.createElement('input')) && labelclass){
            labelclass=labelclass.replace("sr-only","");
        }
        return (
            <label
                htmlFor={this.props.id}
                key="label"
                className={classNames(labelclass,classSet)}>
                {this.renderCheck()}
                {children}
                {this.props.label}
                {this.props.labeladd ? (<span style={{color:"red",marginLeft:4}}>*</span>): null}
            </label>
        )
    },
    renderInputGroup: function (children) {
        var groupPrefix=this.setClassNamespace("input-group");
        var addOnClassName=groupPrefix+"-addon";
        var btnClassName=groupPrefix+"-btn";
        var addonBefore=this.props.addonBefore ? (
            <span className={classNames(addOnClassName,this.props.addFirstClass) } key="addonBefore">
					{this.props.addonBefore}
				</span>
        ) : null;
        var addonAfter=this.props.addonAfter ? (
            <span className={addOnClassName} key="addonAfter">
					{this.props.addonAfter}
				</span>
        ) :null;
        var btnBefore=this.props.btnBefore ? (
            <span className={btnClassName} key="btnBefore">
					{this.props.btnBefore}
				</span>
        ):null;
        var btnAfter=this.props.btnAfter ? (
            <span className={btnClassName} key="btnAfter">
					{this.props.btnAfter}
				</span>
        ):null;
        var classSet={};
        if(this.props.bsSize){
            classSet[groupPrefix + "-"+this.props.bsSize]=true;
        }
        if(this.props.bsStyle){
            classSet[groupPrefix + "-"+this.props.bsStyle]=true;
        }
        return addonBefore || addonAfter || btnBefore || btnAfter ? (
            <div className={classNames(groupPrefix,classSet)} key="inputGroup">
                {addonBefore}
                {btnBefore}
                {children}
                {btnAfter}
                {addonAfter}
            </div>
        ):children;
    },
    renderCheckboxAndRadioWrapper: function(children) {
        return this.props.inline ? children :
            (
                <div
                    className={this.setClassNamespace(this.props.type)}
                    key="checkboxAndRadioWrapper">
                    {children}
                </div>
            );
    },
    renderError: function () {
        if (this.props.error) {
            return (<span style={{color:"red"}}>{this.props.error}</span>)
        }
        return null;
    },
    //如果 wrapperClassName存在，进行input wrap 渲染
    renderWrapper: function (children) {
        return this.props.wrapperClassName ? (
            <div key="wrapper" className={this.props.wrapperClassName}>
                {children}
                {this.renderError()}
            </div>
        ) : children;
    },
    renderCheck: function () {
        var uncheckicon=null;
        switch(this.props.type) {
            case 'radio':
                if(this.props.checked){
                    uncheckicon=(
                        <Icon icon="ok-circle"  className={this.props.iconclass} />
                    );
                }else{
                    uncheckicon=(
                        <Icon icon="record"  className={this.props.iconclass} style={{color:"#ccc"}} />
                    );
                }
                break;
            case 'checkbox':
                if(this.props.checked){
                    uncheckicon=(
                        <Icon icon="check" className={this.props.iconclass} />
                    );
                }else{
                    uncheckicon=(
                        <Icon icon="unchecked" className={this.props.iconclass} />
                    );
                }
                break;
        }
        return uncheckicon;
    },
    listClose: function (id, e) {
        e.stopPropagation();
        this.props.listClose(id);
    },
    renderInput: function () {
        var input =null;
        var formcontrolclass=this.isCheckboxOrRadio() ? "" :
            this.setClassNamespace("form-control");
        var classSet={};
        if(this.props.bsSize && !this.props.standalone)
            classSet[this.setClassNamespace("input-"+this.props.bsSize)]=true;
        var classes=classNames(formcontrolclass,this.props.className,classSet);
        var listarr=[];
        if(this.props.listvalue){
            var listvalue=this.props.listvalue.slice(0,-1);
            listarr=listvalue.split(",");
        }
        switch(this.props.type){
            case 'textarea':
                input=(
                    <textarea defaultDisabled={this.props.defdisabled} defaultValue={this.props.defvalue}
                        {...this.props}
                              className={classes} ref="field" key="field" />
                );
                break;
            case 'select':
                input=(
                    <select
                        {...this.props}
                        className={classes} ref="field" key="field">
                        {this.props.children}
                    </select>
                );
                break;
            case 'select2':
                input=(
                    <Selected data={this.props.data} ddwidth="100%" value={this.props.value+''}
                              onChange={this.props.selectChange} btnWidth="100%" placeholder={this.props.placeholder2}/>
                );
                break;
            case 'submit':
            case 'button':
            case 'reset':
                input= (
                    <Button {...this.props} componentTag="input" ref='field' key="field" />
                );
                break;
            case 'radio':
            case 'checkbox':
                input=(
                    <input defaultDisabled={this.props.defdisabled} defaultValue={this.props.defvalue}
                           className={classes} ref={this.props.id} key={this.props.id} defaultChecked={this.props.defchecked}
                           data-valtypes={this.props.valtypes} style={{display:"none",fontSize:13}}
                        {...this.props} />
                );
                break;
            case 'list':
                input=(
                    <div className={classes}>
                        {
                            listarr.map(function(item){
                                var itemarr=item.split("#");
                                return (
                                    <div>
                                        <span>{itemarr[0]}</span>
                                        <Close onClick={this.listClose.bind(this,itemarr[1])}/>
                                    </div>
                                )
                            }.bind(this))
                        }
                    </div>
                );
                break;
            default:
                input=(
                    <input defaultDisabled={this.props.defdisabled} defaultValue={this.props.defvalue}
                           className={classes} ref={this.props.id} key={this.props.id} defaultChecked={this.props.defchecked}
                           data-valtypes={this.props.valtypes}
                        {...this.props} />
                );
                break;
        }
        return input;
    },
    render: function () {
        if (this.props.standalone) {
            return this.renderInput();
        }
        if (this.isCheckboxOrRadio()) {
            return this.renderWrapper(this.renderCheckboxAndRadioWrapper(this.renderLabel(this.renderInput())))
        }
        return (
            <FormGroup bsSize={this.props.bsSize} validation={this.props.validation} style={this.props.formgroupstyle}>
                {[
                    this.props.topMsgBox,
                    this.renderLabel(),
                    this.renderWrapper(this.renderInputGroup(this.renderInput())),
                    this.props.after,
                    this.props.bottomMsgBox
                ]}
            </FormGroup>
        )
    }
});
module.exports = Input;