'use strict'

function createChainedFunction(one,two){
	var hasone= typeof one === 'function';
	var hastwo= typeof two === 'function';

	if(!hasone && !hastwo)
		return null;
	if(!hasone)
		return two;
	if(!hastwo)
		return one;
	return function chainedFunction(){
		one.apply(this,arguments);
		two.apply(this,arguments);
	}
}
module.exports=createChainedFunction;
