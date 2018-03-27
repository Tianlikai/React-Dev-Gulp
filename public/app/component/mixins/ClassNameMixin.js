'use strict';

var React=require("react");
var constants=require("../constants");
var nsPrefix=(constants.NAMESPACE ? constants.NAMESPACE + '-' : ''); // 命名空间前缀

module.exports={
	getClassSet:function(ignorePreFix){ //ignore classPrefix
		var classNames={};
		var prefix=nsPrefix;

		if(this.props.classPrefix){
			var classPrefix=this.setClassNamespace();
			prefix=classPrefix+"-";
			!ignorePreFix && (classNames[classPrefix]=true);
		}
		var bsStyle=this.props.bsStyle;
		var bsSize=this.props.bsSize;
		if(bsStyle)
			classNames[prefix+bsStyle]=true;
		if(bsSize)
			classNames[prefix+bsSize]=true;
		//theme
		if(this.props.theme)
			classNames[prefix+this.props.theme]=true;
		//states
		classNames[constants.CLASSES.active]=this.props.active;
		classNames[constants.CLASSES.disabled]=this.props.disabled;

		if (this.props.classPrefix !== 'divider') {
	      classNames[constants.CLASSES.divider] = this.props.divider;
	    }

		return classNames;
	},
	setClassNamespace:function(classPrefix){
		var prefix=classPrefix || this.props.classPrefix || '';
		return nsPrefix + prefix;
	},
	prefixClass:function(subClass){ //获取 连接 的class ，返回className
		return this.setClassNamespace()+'-'+subClass;
	}
}
