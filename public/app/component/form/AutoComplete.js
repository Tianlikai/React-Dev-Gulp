var React=require("react");
var classNames=require("classnames");
var ClassNameMixin=require("../mixins/ClassNameMixin");
var Dropdown=require("../Dropdown/Dropdown");
var Icon=require("../Icon");
var Input=require("./Input");
var FormGroup=require("./FormGroup");
var isNodeInTree=require("../utils/isNodeInTree");
var Events=require("../utils/Events");
var curlang = require('../../lang');

var AutoComplete=React.createClass({
	mixins:[ClassNameMixin],
	propTypes:{
		classPrefix:React.PropTypes.string,
		data:React.PropTypes.array,  //数据源
		placeholder:React.PropTypes.string,
		svalue:React.PropTypes.string, //已经选择的值
		onSelect:React.PropTypes.func,
		maxHeight:React.PropTypes.number,
		paramname:React.PropTypes.string, //匹配参数名称
	},
	getDefaultProps:function(){
		return {
			classPrefix:'selected',
			paramname:"fullname",
			maxHeight:200,
		}
	},
	getInitialState:function(){
		return {
			dropdownWidth:null,
			filterUsers:[],
			open:false,
		}
	},
	componentDidMount:function(){
		this.setDropdownWidth();
	},
	setDropdownWidth:function(){
		if(this.isMounted){
			var toggleButton=React.findDOMNode(this.refs.selecteddropdown.refs.dropdowntoggle);
			toggleButton && this.setState({dropdownWidth:toggleButton.offsetWidth});
		}
	},
	hasValue:function(value){
		return this.getValueArray().indexOf(value) > -1;
	},
	getValueArray:function(){
		return this.props.svalue ? this.props.svalue.split(",") : [];
	},
	handleCheck:function(obj,checked,e){
		e.stopPropagation();
		if(!checked)
			this.props.onSelect(obj);
	},
	renderFormGroup:function(children){
		return this.props.formgroup ? (
			<FormGroup>
				{children}
			</FormGroup>
			) : children;
	},
	componentWillMount:function(){
		this.unBindOuterHandlers();
	},
	bindOuterHandlers:function(){
		Events.on(document,'click',this.handlerOuterClick);
	},
	unBindOuterHandlers:function(){
		Events.off(document,'click',this.handlerOuterClick);
	},
	handlerOuterClick:function(e){
		if (isNodeInTree(e.target, React.findDOMNode(this))) {
	      return false;
	    }
	    this.setDropdownState(null,false);
	},
	setDropdownState:function(filterusers,state){
		if(state)
			this.bindOuterHandlers();
		else
			this.unBindOuterHandlers();
		if(filterusers)
			this.setState({
				open:state,
				filterUsers:filterusers,
			})
		else
			this.setState({
				open:state,
			})
	},
	inputChange:function(e){
		var value=e.target.value;
		var users=this.props.data,filterUsers=[];
		if(value){
			for(var i=0;i<users.length;i++){
				if(users[i][this.props.paramname].toUpperCase().indexOf(value.toUpperCase()) > -1){
					filterUsers.push(users[i]);
				}
			}
		}
		this.setDropdownState(filterUsers,true);
	},
	render:function(){
		var classSet=this.getClassSet();
		var selectedLabel=[];
		var items=[];
		var self=this;
		this.state.filterUsers.forEach(function(option,i){
			var checked=self.hasValue(option.id+"");
			var checkedClass=checked ? self.prefixClass("checked") : null ;
			var checkedIcon=checked ? <Icon icon="ok" className="icon-check" /> : null;
			items.push(
				<li className={checkedClass} onClick={self.handleCheck.bind(self,option,checked)}
					key={"selecteditem_"+i}>
					<span className={self.prefixClass("text")}>{option[self.props.paramname]}</span>
					{checkedIcon}
				</li>
				);
		});
		if(this.state.filterUsers.length == 0){
			items=(
				<li key={"selecteditem_0"}>
					<span className={self.prefixClass("text")}>{curlang() == "en" ? "has no match":"没有匹配项"}...</span>
				</li>
				);
		}
		var optionStyle={};
		if(this.props.maxHeight){
			optionStyle={
				maxHeight:this.props.maxHeight,
				overflowY:'scroll',
			};
		}
		var autocomplete=(
			<Input placeholder={this.props.placeholder} onChange={this.inputChange} key="autoinput" btnAfter={this.props.btnAfter} />
			);
		var ddown= (
			<Dropdown className={classNames(this.props.className,classSet)} open={this.state.open}
				contentInlineStyle={{minWidth:this.state.dropdownWidth,width:'100%'}}
				toggleClassName={this.prefixClass("btn")} iconclassname={this.prefixClass("icon")}
				contentClass={this.prefixClass("content")} contentTag="div" ref="selecteddropdown"
				navItem={false} autocomplete={autocomplete}>
				<ul style={optionStyle} className={this.prefixClass("list")}>
				{items}
				</ul>
			</Dropdown>
			);
		return this.renderFormGroup(ddown);
	}
});
module.exports=AutoComplete;
