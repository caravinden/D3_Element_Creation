
var groupData = {"UNIT":"Minutes","META":{"SCALE":[{"NAME":"JAN","DESC":"2015Jan15-Jan21"},{"NAME":"FEB","DESC":"2015Jan22-Jan28"},{"NAME":"WEEK3","DESC":"2015Jan29-Jan05"},{"NAME":"WEEK4","DESC":"2015Jan06-Jan12"},{"NAME":"WEEK5","DESC":"2015Jan13-Jan19"},{"NAME":"WEEK6","DESC":"2015Jan20-Jan26"},{"NAME":"WEEK7","DESC":"2015Jan27-Jan02"},{"NAME":"WEEK8","DESC":"2015Jan03-Jan09"},{"NAME":"WEEK9","DESC":"2015Jan10-Jan16"},{"NAME":"WEEK10","DESC":"2015Jan17-Jan23"},{"NAME":"WEEK11","DESC":"2015Jan24-Jan30"}]},"DATA":{"GROUPVALUE":[{"SCALE":"JAN","VALUE":20},{"SCALE":"FEB","VALUE":1.67},{"SCALE":"WEEK2","VALUE":110},{"SCALE":"WEEK3","VALUE":18.33},{"SCALE":"WEEK4","VALUE":3.33},{"SCALE":"WEEK5","VALUE":50},{"SCALE":"WEEK6","VALUE":131.67},{"SCALE":"WEEK7","VALUE":0},{"SCALE":"WEEK8","VALUE":10},{"SCALE":"WEEK9","VALUE":50},{"SCALE":"WEEK10","VALUE":31.67}]}};

var dataT = {"UNIT":"Minutes","META":{"SCALE":[{"NAME":"WEEK1","DESC":"2015Jan15-Jan21"},{"NAME":"WEEK2","DESC":"2015Jan22-Jan28"},{"NAME":"WEEK3","DESC":"2015Jan29-Jan05"},{"NAME":"WEEK4","DESC":"2015Jan06-Jan12"},{"NAME":"WEEK5","DESC":"2015Jan13-Jan19"},{"NAME":"WEEK6","DESC":"2015Jan20-Jan26"},{"NAME":"WEEK7","DESC":"2015Jan27-Jan02"},{"NAME":"WEEK8","DESC":"2015Jan03-Jan09"},{"NAME":"WEEK9","DESC":"2015Jan10-Jan16"},{"NAME":"WEEK10","DESC":"2015Jan17-Jan23"},{"NAME":"WEEK11","DESC":"2015Jan24-Jan30"}]},"DATA":{"GROUPVALUE":[{"SCALE":"WEEK0","VALUE":20},{"SCALE":"WEEK1","VALUE":1.67},{"SCALE":"WEEK2","VALUE":110},{"SCALE":"WEEK3","VALUE":18.33},{"SCALE":"WEEK4","VALUE":3.33},{"SCALE":"WEEK5","VALUE":50},{"SCALE":"WEEK6","VALUE":131.67},{"SCALE":"WEEK7","VALUE":0},{"SCALE":"WEEK8","VALUE":10},{"SCALE":"WEEK9","VALUE":50},{"SCALE":"WEEK10","VALUE":31.67}],"USERVALUE":[{"SCALE":"WEEK0","VALUE":18.33},{"SCALE":"WEEK1","VALUE":0},{"SCALE":"WEEK2","VALUE":0},{"SCALE":"WEEK3","VALUE":5},{"SCALE":"WEEK4","VALUE":30},{"SCALE":"WEEK5","VALUE":81.67},{"SCALE":"WEEK6","VALUE":60},{"SCALE":"WEEK7","VALUE":90},{"SCALE":"WEEK8","VALUE":20},{"SCALE":"WEEK9","VALUE":100},{"SCALE":"WEEK10","VALUE":31.67}]}};

// The function helps to create timeline chart
function generateTimeLineChart(chartID, data){

  d3.select("#"+chartID).html('');

  var margin = {top: 20, right: 80, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var xValues = new Array();

      xValues = data.map(function(d){return d.xaxis_name;});

  var x = d3.scale.ordinal()
      .domain(xValues)
      .rangePoints([0, width]);    

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.category20();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.area()
      .interpolate("")
      .x(function(d) { return x(d.xaxis_name); })
      .y0(y.range()[0])     
      .y1(function(d) { return y(d.temperature); });

  var svg = d3.select("#"+chartID).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "xaxis_name"; }));

    data.forEach(function(d) {
      d.xaxis_name = (d.xaxis_name);
    });

    var cities = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {xaxis_name: d.xaxis_name, temperature: +d[name]};
        })
      };
    });

    
    y.domain([
      d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
      d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
    ]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("y axis text");

    var city = svg.selectAll(".city")
        .data(cities)
      .enter().append("g")
        .attr("class", "city");

    city.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("fill", function(d) { return color(d.name); })
        .style("stroke", "black");

}

// To get selected item  based on the radion button selection and generate chart based on that
$('#selectoptions').change(function(){
  if($('input[name=selectVal]:checked', '#selectoptions').val() == 'group'){
    var dataset_group = getTimeLineJSON(groupData, 'group');
    generateTimeLineChart('stackedAreaChart', dataset_group);
  } else {
    var dataset = getTimeLineJSON(dataT,'student');
    generateTimeLineChart('stackedAreaChart', dataset);
  } 
})


var dataset = getTimeLineJSON(dataT,'student');
generateTimeLineChart('stackedAreaChart', dataset);

// To get timeline json structure
function getTimeLineJSON(data_json, type){
  var axisScale = new Array();
  axisScale = data_json.META.SCALE.map(function(d,i){d.NAME})
  
  var group_avg = new Array();
  group_avg = data_json.DATA.GROUPVALUE;
  if(type == 'student'){
    var student_avg = new Array();
    student_avg = data_json.DATA.USERVALUE;
  } 
  var timelineArr = new Array();
  for(var i=0; i<group_avg.length; i++) {
    var timelineObj = {};
    timelineObj["xaxis_name"] = group_avg[i].SCALE;
    timelineObj["group_avg"] = group_avg[i].VALUE;
    if(type == 'student'){
      timelineObj["student_avg"] = student_avg[i].VALUE;
    }
    timelineArr.push(timelineObj);
  }
  return timelineArr;
}