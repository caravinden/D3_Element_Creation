
var data_json_stackedbarIMG = [{"scale":"JAN","count":4,"outcomes":[{"name":"outcome1","id":"124","associatedActivity":"test","obtainedon":"26-dec-2015","time":"20hr"},{"name":"outcome2","id":"125","associatedActivity":"test","obtainedon":"26-dec-2015","time":"20hr"},{"name":"outcome3","id":"126","associatedActivity":"test","obtainedon":"26-dec-2015","time":"20hr"},{"name":"outcome4","id":"127","associatedActivity":"test","obtainedon":"26-dec-2015","time":"20hr"}]},{"scale":"FEB","count":2,"outcomes":[{"name":"outcome1","id":"110","associatedActivity":"test","obtainedon":"26-dec-2015","time":"20hr"},{"name":"outcome2","id":"111","associatedActivity":"test","obtainedon":"26-dec-2015","time":"20hr"}]},{"scale":"MAR","count":5,"outcomes":[{"name":"outcome1","id":"120","associatedActivity":"test","obtainedon":"26-dec-2015","time":"20hr"},{"name":"outcome2","id":"121","associatedActivity":"test","obtainedon":"26-dec-2015","time":"20hr"},{"name":"outcome3","id":"121","associatedActivity":"test","obtainedon":"26-dec-2015","time":"20hr"},{"name":"outcome4","id":"121","associatedActivity":"test","obtainedon":"26-dec-2015","time":"20hr"},{"name":"outcome5","id":"121","associatedActivity":"test","obtainedon":"26-dec-2015","time":"20hr"}]},{"scale":"APL","count":2,"outcomes":[{"name":"outcome1","id":"1104","associatedActivity":"test","obtainedon":"26-dec-2015","time":"20hr"},{"name":"outcome2","id":"1114","associatedActivity":"test","obtainedon":"26-dec-2015","time":"20hr"}]}];

// This function used to generate stackedbar with image 
function generateStackedBarWithImage(chartID, data_json) {
// To find maximum count value
  var maxValue = Math.max.apply(Math, data_json.map(function(d){ return d.count }))
// To create stacked bar json format based on given JSON 
  var new_temp=[]; 
  data_json.map(function(d){
    new_jsn ={},  new_arr = new Array();
    new_jsn["xaxis_name"]=d.scale;
    new_jsn["count"] = d.count;
      for(i=1; i<=maxValue; i++){
        new_data = {};
        if(i<=d.count){
          new_jsn[i] = "1"; 
          new_data["outcomename"] = d.outcomes[i-1].name;
          new_data["id"] = d.outcomes[i-1].id;
          new_data["associatedActivity"] = d.outcomes[i-1].associatedActivity;
          new_data["obtaineddate"] = d.outcomes[i-1].obtainedon;
          new_arr.push(new_data);
          new_jsn["details"] = new_arr;
        }else{
          new_jsn[i] = "0";
          new_data["outcomename"] = 0;
          new_data["id"] = 0;
          new_data["associatedActivity"] = 0;
          new_data["obtaineddate"] = 0;
          new_arr.push(new_data);
          new_jsn["details"] = new_arr;
        }
      } 
    new_temp.push(new_jsn);
  })
  data = new_temp;

  var imageArray =["red.png","blue.png","gray.png"];
  
  var imgPath = "../image/";
  
  var margin = {top: 30, right: 10, bottom: 20, left: 80},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var xScale = d3.scale.ordinal()
    .rangeRoundBands([0, width],.1); 

  var yScale = d3.scale.linear()
    .domain([0 ,maxValue])
    .rangeRound([height, maxValue]);

  var yScale1 = d3.scale.linear()
     .domain([0 ,maxValue])
    .rangeRound([height-30, height - 90]);

  var color = d3.scale.ordinal()
    .range(["#18aadb","#18d676","#fe5a59","#fec418"]); //blue, orange, red

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

  // Define the div for the tooltip
  var tooltipDiv = d3.select("#"+chartID).append("div") 
    .attr("class", "tooltip")      
    .style("opacity", 0);

  var svgContainer = d3.select("#"+chartID).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom+100)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /*Filter moduleName & mmoduleId keys*/
    color.domain(d3.keys(data[0]).filter(function(key) { return (key !== "xaxis_name" && key !== "count" && key !== "outcomename" && key !== "id" && key !== "associatedActivity" && key !== "obtaineddate" && key !== "details" ); }));   

    data.forEach(function(d) {
      var y0 = 0;
      d.values = color.domain().map(function(name,i) {
        return {outcomename:d.details[i].outcomename, id:d.details[i].id, associatedActivity:d.details[i].associatedActivity, obtaineddate:d.details[i].obtaineddate, name: name, y0: y0, y1: y0 += +d[name]};});
        d.total = d.values[d.values.length - 1].y1;
    });
    xScale.domain(data.map(function(d) { return d.xaxis_name; }));
    
  var xAxis_g = svgContainer.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height) + ")")
      .call(xAxis)
      .selectAll("text")
      //.attr("transform","rotate(-45)")
      .attr("x",0);

  var yAxis_g = svgContainer.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -100)
          .attr("y", -50)
          .attr("dy", ".71em")
          .style("text-anchor", "end").text("Total Items");

  var state = svgContainer.selectAll(".state")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + xScale(d.xaxis_name) + ",0)"; });

        state.selectAll("rect")
          .data(function(d) { return d.values; })
          .enter().append("svg:image")
          .attr("width", xScale.rangeBand())
          .attr("class", 'stacked_image')
          .attr("y", function(d) {
            if(d.y0 != d.y1 ){
              return yScale1(d.y1); }
          })
          .attr("height", 28)
          .attr("outcome_name", function(d,i){
            return d.outcomename;
          })
          .attr("id", function(d,i){
            return d.id;
          })
          .attr("associated_activity", function(d,i){
            return d.associatedActivity;
          })
          .attr("obtained_date", function(d,i){
            return d.obtaineddate;
          })                  
          .attr("xlink:href",function(d,i) {
            if(d.y0 != d.y1 ){
              var num = Math.floor( Math.random() * imageArray.length );
              var img = imageArray[ num ];
              return imgPath+img
            } 
          })
           .on("click", function(d) {  
                tooltipDiv.transition()    
                  .duration(200)    
                  .style("opacity", .9);
                $(this).siblings().css('opacity','0.3')
                $(this).css('opacity','1')
                tooltipDiv.html('Outcome Name :'+ d.outcomename+"<br/>"+'Associated Activity: '+d.associatedActivity+"<br>"+'Obtained On: '+d.obtaineddate+"<br>")  
                    .style("left", (d3.event.pageX - 80)  + "px")   
                    .style("top", (d3.event.pageY - 110) + "px");  
                })          
            .on("mouseout", function(d) {   
                tooltipDiv.transition()    
                  .duration(500)    
                  .style("opacity", 0);
                  $('image').css('opacity','1') 
      });          
           
}
generateStackedBarWithImage('chartID',data_json_stackedbarIMG);

     