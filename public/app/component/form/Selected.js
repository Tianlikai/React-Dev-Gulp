var React=require("react");
var classNames=require("classnames");
var ClassNameMixin=require("../mixins/ClassNameMixin");
var Icon=require("./Icon");
var Input=require("./Input");
var FormGroup=require("./FormGroup");
var Dropdown=require("../Dropdown/Dropdown");

var Selected=React.createClass({
	mixins:[ClassNameMixin],
	propTypes:{
		classPrefix:React.PropTypes.string,
		data:React.PropTypes.array,
		placeholder:React.PropTypes.string,
		value:React.PropTypes.string,
		multiple:React.PropTypes.bool,
		name:React.PropTypes.string,
		onChange:React.PropTypes.func,
		optionFilter:React.PropTypes.func,
		btnWidth:React.PropTypes.any,
		maxHeight:React.PropTypes.number,
		searchBox:React.PropTypes.bool,
		drop:React.PropTypes.bool,
	},
	getDefaultProps:function(){
		return {
			classPrefix:'selected',
			drop:true,
			placeholder:'click to select...',
			onChange:function(){},
		}
	},
	getInitialState:function(){
		return {
			value:this.props.value+'',
			dropdownWidth:null,
			filterText:null,
		}
	},
	componentWillReceiveProps:function(nextProps){
		if(nextProps.value != this.props.value){
			this.setState({
				value:nextProps.value+"",
			})
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
		return this.state.value ? this.state.value.split(",") : [];
	},
	setValue:function(value,callback){
		this.setState({
			value:value
		},function(){
			this.props.onChange(value);
			callback && callback();
		})
	},
	handleCheck:function(option,e){
		e.preventDefault();
		e.stopPropagation();
		var clickedValue=option.value;
		if(this.props.multiple){
			var values=this.getValueArray();
			if(this.hasValue(clickedValue)){
				values.splice(values.indexOf(clickedValue),1);
			}else{
				values.push(clickedValue)
			}
			this.setValue(values.join(","));
		}else{
			this.setValue(clickedValue);
			this.refs.selecteddropdown.setDropdownState(false);
		}
	},
	handleUserInput:function(e){
		e.preventDefault();
		e.stopPropagation();
		this.setState({
			filterText:React.findDOMNode(this.refs.selectedinputfilter).value
		})
	},
	clearFilterInput:function(){
		if(this.props.multiple && this.props.searchBox){
			this.setState({
				filterText:null
			})
			React.findDOMNode(this.refs.selectedinputfilter).value=null;
		}
	},
	getValue:function(){  //对外api
		return this.state.value;
	},
	renderFormGroup:function(children){
		return this.props.formgroup ? (
			<FormGroup>
				{children}
			</FormGroup>
			) : children;
	},
	render:function(){
		var classSet=this.getClassSet();
		var selectedLabel=[];
		var items=[];
		var filterText=this.state.filterText;
		this.props.data.forEach(function(option,i){
			var checked=this.hasValue(option.value);
			var checkedClass=checked ? this.prefixClass("checked") : null ;
			var checkedIcon=checked ? <Icon icon="ok" className="icon-check" /> : null;
			checked && selectedLabel.push(option.label);
			if(filterText && !this.props.optionFilter(filterText,option))
				return;
			items.push(
				<li className={checkedClass} onClick={this.handleCheck.bind(this,option)}
					key={"selecteditem_"+i}>
					<span className={this.prefixClass("text")}>{option.label}</span>
					{checkedIcon}
				</li>
				);
		}.bind(this));
		var status=(
				<span className={classNames(this.prefixClass("status"),this.setClassNamespace('fl'))}>
					{
					selectedLabel.length ? selectedLabel.join(", ") : (
							<span className={this.prefixClass("placeholder")}>
								{this.props.placeholder}
							</span>
						)
					}
				</span>
			);
		var optionStyle={};
		if(this.props.maxHeight){
			optionStyle={
				maxHeight:this.props.maxHeight,
				overflowY:'scroll',
			};
		}
		var ddown= (
			<Dropdown className={classNames(this.props.className,classSet)}
				title={status} btnStyle={this.props.btnStyle} btnInlineStyle={{width:this.props.btnWidth}}
				contentInlineStyle={{minWidth:this.state.dropdownWidth,width:this.props.ddwidth}} 
				onClose={this.clearFilterInput}
				toggleClassName={this.prefixClass("btn")} iconclassname={this.prefixClass("icon")}
				contentClass={this.prefixClass("content")} contentTag="div" ref="selecteddropdown"
				drop={this.props.drop} navItem={false}>
				{
					this.props.searchBox ? (
						<div className={this.prefixClass("search")}>
							<Input onChange={this.handleUserInput} autoComplete="off" standalone
							ref="selectedinputfilter" />
						</div>
						) :null
				}
				<ul style={optionStyle} className={this.prefixClass("list")}> 
				{items}
				</ul>
				<input name={this.props.name} type="hidden" ref="selectedField" value={this.state.value} />
			</Dropdown>
			);
		return this.renderFormGroup(ddown);
	}
});
module.exports=Selected;