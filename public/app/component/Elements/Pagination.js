var React=require('react');
var classNames=require("classnames");
var ClassNameMixin=require("../mixins/ClassNameMixin");
var Pagination=React.createClass({
	mixins:[ClassNameMixin],
	propTypes:{
		onSelect:React.PropTypes.func,
		bsSize:React.PropTypes.oneOf(['sm','lg']),
		pagesize:React.PropTypes.number, //每页显示多少条
		count:React.PropTypes.number, //总条数
		page:React.PropTypes.number,// 当前页数
		data:React.PropTypes.object,
		right:React.PropTypes.bool,
		left:React.PropTypes.bool,
	},
	getDefaultProps:function(){
		return {
			classPrefix:"pagination",
			componentTag:'ul',
			pagesize:10,
		}
	},
	getInitialState:function(){
		return {
			page:0,
		}
	},
	handleClick:function(link,disabled,e){
		this.props.onSelect && this.props.onSelect(link,disabled,e);
	},
	renderItem:function(type){
		var data=this.props.data;

		return data && data[type+"Title"] && data[type+"Link"] && !data[type+"Disabled"] ? (
				<Pagination.item  key={'pageitem'+type}
					onClick={this.handleClick.bind(this,data[type+"Link"],data[type+"Disabled"])}
					href={data[type+"Link"]} disabled={data[type+"Disabled"]}>
					{data[type+"Title"]}
				</Pagination.item>
			) : null;
	},
	renderPages:function(){
		var data=this.props.data;

		if(data){
		    return data.pages.map(function(page,index){
				return (
					<Pagination.item
						key={'pageitem-'+index} active={page.active} disabled={page.disabled}
						onClick={this.handleClick.bind(this,page.link,page.disabled)}
						href={page.link}>
						{page.title}
					</Pagination.item>
					);
			}.bind(this));
		}
	},
	render:function(){
		var Component=this.props.componentTag;
		var classes=this.getClassSet();
		classes[this.prefixClass('right')]=this.props.right;
		classes[this.prefixClass('left')]=this.props.left;
		return (
				<Component {...this.props} className={classNames(classes,this.props.className)}>
					{this.renderItem('first')}
					{this.renderItem('prev')}
					{this.renderPages()}
					{this.renderItem('next')}
					{this.renderItem('last')}
				</Component>
			);
	}
});
Pagination.item=React.createClass({
	mixins:[ClassNameMixin],
	propTypes:{
		active:React.PropTypes.bool,
		disabled:React.PropTypes.bool,
		prev:React.PropTypes.bool,
		next:React.PropTypes.bool,
		href:React.PropTypes.string,
		componentTag:React.PropTypes.node,
	},
	getDefaultProps:function(){
		return {
			classPrefix:"pagination",
			href:"#",
			componentTag:"li",
		}
	},
	render:function(){
		var classset=this.getClassSet(true);
		var props=this.props;
		var Component=this.props.componentTag;
		var content=this.props.children;
		if(this.props.prev){
			content="&laquo;";
		}
		if(this.props.next)
			content="&raquo;";
		return (
				<Component {...this.props}
					 className={classNames(classset,this.props.className)}>
					 <a href={this.props.href}>
					 	<span>{content}</span>
					 </a>
				</Component>
			)
	}
});
module.exports=Pagination;