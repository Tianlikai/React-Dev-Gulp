'use strict'

module.exports={
	offset:function(element){
		if(element){
			var rect=element.getBoundingClientRect();
			var body=document.body;
			var clientTop = element.clientTop || body.clientTop || 0;
	      	var clientLeft = element.clientLeft || body.clientLeft || 0;
	      	var scrollTop = window.pageYOffset || element.scrollTop;
	      	var scrollLeft = window.pageXOffset || element.scrollLeft;

	      	return {
	        	top: rect.top + scrollTop - clientTop,
	        	left: rect.left + scrollLeft - clientLeft
	      	};
		}
		return null;
	},
	position:function(element){
		return {
			left:element.offsetLeft,
			top:element.offsetTop,
		}
	}
}