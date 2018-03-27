var React=require("react");
var classNames=require("classnames");
var ClassNameMixin=require("../mixins/ClassNameMixin");

var Switch=React.createClass({
	mixins:[ClassNameMixin],
	getInitialState:function(){
		return {
			active:this.props.active,
		}
	},
	componentWillReceiveProps:function(nextprops){
		if(nextprops.active != this.props.active){
			this.setState({
				active:nextprops.active
			})
		}
	},
	getDefaultProps:function(){
		return {
			classPrefix:'switch',
		}
	},
	handleClick:function(){
		this.setState({
			active:!this.state.active
		})
		this.props.toggle(!this.state.active);
	},
	render:function(){
		var classes={};
		classes[this.prefixClass('animate')]=true;
		if(this.state.active)
			classes[this.prefixClass("on")]=true;
		else
			classes[this.prefixClass("off")]=true;
		var lang=this.props.lang || "en",langobj={};
		if(lang== "en"){
			langobj.on="ON";
			langobj.off="OFF";
		}else{
			langobj.on="开";
			langobj.off="关";
		}
		return (
			<div className="switch has-switch" style={this.props.style} onClick={this.handleClick}>
                <div className={classNames(this.props.className,classes)}>
                	<input type="checkbox" checked="" />
                	<span className="switch-left switch-success">{langobj.on}</span>
                	<label>&nbsp;</label>
                	<span className="switch-right">{langobj.off}</span>
                </div>
            </div>
			)
	}
});
module.exports=Switch;