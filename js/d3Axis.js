var margin = {top:30, right:10, bottom:20, left:80};

var width = 960 - margin.left - margin.right;

var height = 500 - margin.top - margin.bottom;

var svgContainer = d3.select("#chartID").append("svg").attr("width", width+margin.left + margin.right).attr("height",height+margin.top + margin.bottom).append("g").attr("transform", "translate("+ margin.left +","+ margin.top +")");

var xScale = d3.scale.linear().domain([0,100]).range([0,width]);

var yScale = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

var yAxis = d3.svg.axis().scale(yScale).orient("left");

var xAxis_g = svgContainer.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

var yAxis_g = svgContainer.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Price ($)");

d3.select(window).on('resize', resize); 

// Resize the chart based on window size
function resize() {
    // update width
    width = parseInt(d3.select('#chartID').style('width'), 10);
    width = width - margin.left - margin.right;
    // resize the chart
    if(width<870){
    	xScale.range([0, width]);

    d3.select(svgContainer.node().parentNode)
        .style('width', (width + margin.left + margin.right) + 'px');
    svgContainer.select('.x.axis').call(xAxis.orient('bottom'));	
    }
}
