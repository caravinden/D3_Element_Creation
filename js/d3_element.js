/**
 * Java script library on top of d3. 
 */
var d3Elements = (function(){
	var lib = function(){
		
	},
	data = function(){
		
	},
	element = function(){
		
	}
	return {
		version : '0.1',
		lib : lib,
		element : element,
		data : data
	}
})();

/**
 * To stringify data
 * @param data
 * @returns
 */
d3Elements.data.stringify = function(data){
	return JSON.stringify(data);
}

/**
 * Java script function to create circle using d3
 * @param divId
 * @param data
 * @param cirRadius
 */
d3Elements.element.circle = function(divId,cirRadius){

	  d3.select("#"+divId).append("svg")
	    .append("circle")
	    .attr("cx",100)
	    .attr("cy",100)
	    .attr("r",cirRadius)
	    .style("fill", "green")
.transition()
    .delay(100)
    .duration(1000)    
    .attr("r", 10)
    .attr("cx", 30)
    .style("fill", "red");
}

/**
 * Javascript function to create rectangle using d3
 * @param divId
 */
d3Elements.element.rectangle = function(divId){

	 d3.select("#"+divId).append("svg")
	    .append("rect")
	    .attr("x",100)
	    .attr("y",100)
	    .attr("width", 50)
	    .attr("height", 100)
	    .style("fill", "green");
}

/**
 * Javascript function to create line using d3
 * @param divId
 */
d3Elements.element.line = function(divId){
	
	d3.select("#"+divId).append("svg")
	   .append("line")
	   .attr("x1",10)
	   .attr("y1",20)
	   .attr("x2",100)
	   .attr("y2",200)
	   .style("stroke", "green");	
}
