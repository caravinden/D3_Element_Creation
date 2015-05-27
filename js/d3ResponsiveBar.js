
var data = [{"letter":"A","frequency":0.08167},{"letter":"B","frequency":0.01492},{"letter":"C","frequency":0.02782},{"letter":"D","frequency":0.04253},{"letter":"E","frequency":0.12702},{"letter":"F","frequency":0.02288},{"letter":"G","frequency":0.02015},{"letter":"H","frequency":0.06094},{"letter":"I","frequency":0.06966},{"letter":"J","frequency":0.00153},{"letter":"K","frequency":0.00772},{"letter":"L","frequency":0.04025},{"letter":"M","frequency":0.02406},{"letter":"N","frequency":0.06749},{"letter":"O","frequency":0.07507},{"letter":"P","frequency":0.01929},{"letter":"Q","frequency":0.00095},{"letter":"R","frequency":0.05987},{"letter":"S","frequency":0.06327},{"letter":"T","frequency":0.09056},{"letter":"U","frequency":0.02758},{"letter":"V","frequency":0.00978},{"letter":"W","frequency":0.0236},{"letter":"X","frequency":0.0015},{"letter":"Y","frequency":0.01974},{"letter":"Z","frequency":0.00074}]

var margin = {top:30, right:10, bottom:20, left:80};

var width = 960 - margin.left - margin.right;

var height = 500 - margin.top - margin.bottom;

var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .1)
      //.domain([0,100])
      //.range([0,width]);

var yScale = d3.scale.linear()
      .range([height, 0]);


var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom");

var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");

var svgContainer = d3.select("#chartID").append("svg")
		.attr("width", width+margin.left + margin.right)
		.attr("height",height+margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate("+ margin.left +","+ margin.top +")");

xScale.domain(data.map(function(d) { return d.letter; }));
yScale.domain([0, d3.max(data, function(d) { return d.frequency; })]);


var xAxis_g = svgContainer.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (height) + ")")
			.call(xAxis);

var yAxis_g = svgContainer.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6).attr("dy", ".71em")
			.style("text-anchor", "end").text("Price ($)");




			svgContainer.selectAll(".bar")
      		.data(data)
    	.enter().append("rect")
      		.attr("class", "bar")
      		.attr("x", function(d) { return xScale(d.letter); })
      		.attr("width", xScale.rangeBand())
      		.attr("y", function(d) { return yScale(d.frequency); })
      		.attr("height", function(d) { return height - yScale(d.frequency); });

d3.select(window).on('resize', resize); 

function resize() {
	console.log('----resize function----');
  // update width
  width = parseInt(d3.select('#chartID').style('width'), 10);
  width = width - margin.left - margin.right;

  height = parseInt(d3.select("#chartID").style("height"));
  height = height - margin.top - margin.bottom;
	console.log('----resiz width----'+width);
	console.log('----resiz height----'+height);
    // resize the chart
  if(width<870){
    //xScale.range([0, width]);
    xScale.rangeRoundBands([0, width], .1);
    yScale.range([height, 0]);

    yAxis.ticks(Math.max(height/50, 2));
    xAxis.ticks(Math.max(width/50, 2));

    d3.select(svgContainer.node().parentNode)
        .style('width', (width + margin.left + margin.right) + 'px');

    svgContainer.selectAll('.bar')
    	.attr("x", function(d) { return xScale(d.letter); })
      .attr("width", xScale.rangeBand());

    svgContainer.select('.x.axis').call(xAxis.orient('bottom'));	
  }  
}
