
var dataset3 = {"DATA":{"OBJSTATUS":[{"OBJID":"100","VALUE":10,"STATUS":"PASSED"},{"OBJID":"101","VALUE":20,"STATUS":"FAILED"},{"OBJID":"102","VALUE":15,"STATUS":"PASSED"}],"OBJDATA":[{"OBJID":"100","OBJNAME":"Module name1","VALUE":10,"UNIT":"HOURS","STATUS":"RANDOM"},{"OBJID":"101","OBJNAME":"Module name2","VALUE":20,"UNIT":"HOURS","STATUS":"RANDOM"},{"OBJID":"102","OBJNAME":"Module name3","VALUE":15,"UNIT":"HOURS","STATUS":"RANDOM"}],"INSTRUCTORDATA":[{"OBJID":"100","VALUE":50},{"OBJID":"101","VALUE":10},{"OBJID":"102","VALUE":60}],"GROUPDATA":[{"OBJID":"100","VALUE":150},{"OBJID":"101","VALUE":100},{"OBJID":"102","VALUE":150}]},"TOTALTIMESPENT":"1000"};

var dataset4 = {"DATA":{"OBJSTATUS":[{"OBJID":"100","VALUE":100,"STATUS":"PASSED"},{"OBJID":"101","VALUE":800,"STATUS":"FAILED"},{"OBJID":"102","VALUE":200,"STATUS":"PASSED"}],"OBJDATA":[{"OBJID":"100","OBJNAME":"Goal name1","VALUE":100,"STATUS":"RANDOM"},{"OBJID":"101","OBJNAME":"Goal name2","VALUE":800,"STATUS":"RANDOM"},{"OBJID":"102","OBJNAME":"Goal name3","VALUE":200,"STATUS":"RANDOM"}],"INSTRUCTORDATA":[{"OBJID":"100","VALUE":150},{"OBJID":"101","VALUE":10},{"OBJID":"102","VALUE":50}],"GROUPDATA":[{"OBJID":"100","VALUE":500},{"OBJID":"101","VALUE":85},{"OBJID":"102","VALUE":258}]},"TOTALTIMESPENT":"1000","UNIT":"HOUR"};

var clicked_arc_color, clicked_arc;
/*The functin that helps to generate multi layered donet chart, onclick of any of the arc will pop up with sub sections */
function generateMultilayerDonet(data, chartID, timesepent, label){
  var dataset = data.DATA;
  var arcSection;
  var width = 500,
  height = 500,
  outerRadius = height / 2,
  innerRadius = height/6;

var maxValue = getMaxValue(dataset);
var status_color = {'PASSED':'#83c446','FAILED':'#ff5722','skipped':'#ffc107','incomplete':'#f26261','complete':'#009900'};
var colors = d3.scale.category20();
var pie = d3.layout.pie()
    .padAngle(.02)
    .value(function(d) { return d.VALUE; })
    .sort(null);

var arc = d3.svg.arc();

var endAngleScale = d3.scale.linear()
          .domain([0, maxValue+230])
          .range([0, 2 * Math.PI]);

var svg = d3.select('#'+chartID).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" +  width / 2 + "," + height / 2 + ")")
        .attr("class", "labels");

var gs = svg.selectAll("g")
        .data(d3.values(dataset))
        .enter()
        .append("g")
        .attr("class", function(d,i,j){
          var arcGrpType;
          if(i==0){
            arcGrpType= chartID+'_arc_inner';
          } else if(i == 1){
            arcGrpType= chartID+'_arc_outer';
          } 
          return arcGrpType;
        });


var path = gs.selectAll("path")
    .data(function(d) {return pie(d); })
    .enter().append("path")
    .attr("fill", function(d, i) { 
      if(d.data.STATUS=='RANDOM'){
        return colors(i);
      } else {
        return status_color[d.data.STATUS];
      }
     })
    .attr("section", function(d,i,j){
      if(j==0){
        return "inner_"+d.data.OBJID;
      } else if(j==1) {
        return "outer_"+d.data.OBJID;
      } 
    })
    .attr("arcsection", function(d,i){
      return d.data.OBJID;
    })
    .attr("name", function(d,i,j){
      if(j==1){
        return d.data.OBJNAME;
      }
    })
    .attr("value", function(d,i,j){
      if(j==1){
        return d.data.VALUE;
      }
    })     
    .attr("class", function(d,i,j){
      if(j==0){
        return chartID+"_arc_section_"+d.data.OBJID+"_inner";
      }else if(j==1){
        return chartID+"_arc_section_"+d.data.OBJID;
      }
    })
    .attr("d", function(d, i, j) {
      var angle
      if(j==0){
        angle = arc.innerRadius(innerRadius+(10*j)).outerRadius(innerRadius+5+(5*j))(d); 
      }else if(j==1) {
        angle = arc.innerRadius(innerRadius+(7*j)).outerRadius(innerRadius+22+(22*j))(d); 
      }
      return angle;
    });

// Time spent inner text append     
svg.append("text")
      .attr("dy", "-0.95em")
      .style("text-anchor", "middle")
      .attr("class", "arcInnerTitle")
      .text(function(d) { return 'Total Time Spent'; });      

// Time inner text append 
svg.append("text")
      .attr("dy", ".35em")
      .attr("id", chartID+"TimeSpentText")
      .style("text-anchor", "middle")
      .attr("class", "timeSpent")
      .text(timesepent);
// Day/Hour title append      
svg.append("text")
      .attr("dy", "2.0em")
      .style("text-anchor", "middle")
      .attr("class", "timeSpentUnit")
      .text(function(d) { return 'DAYS HOUR'; });               
// Course name/Module name arc inner text
svg.append("text")
      .attr("dy", "3em")
      .attr('id',chartID+'InnerText')
      .style("text-anchor", "middle")
      .attr("class", "arcLabel")
      .text(label);     
    
// On click of any portion of the arc to append arc with two layer outer arc   
    path.on('click',function(d){
      var sAngle = d.startAngle, eAngle = d.endAngle, outer_arc2, outer_arc3;
      outer_arc2 = getOuterArcValue(dataset.INSTRUCTORDATA, $(this).attr('arcsection'));
      outer_arc3 = getOuterArcValue(dataset.GROUPDATA, $(this).attr('arcsection'));
      clicked_arc_color = $(this).attr('fill');
      clicked_arc = $(this).attr('class');
      var timeSpentValue = $(this).attr('value');
      var arcName= $(this).attr('name');
      var classType = $(this).attr('class');      
      $(this).attr('fill','#f26261');
      if(chartID == 'moduleLevel_Donet'){
        $('.moduleLevel_Donet_arc_inner').children().not('.'+classType+"_inner").css('opacity','0.2');
        $('.moduleLevel_Donet_arc_outer').children().not('.'+classType).css('opacity','0.2');
        gs.append("path")
          .attr("fill", function(d) { return "#fed006";})
          .attr("class",chartID+"_arcPath_outer1")
          .attr("d", function(d) {
          var arcHover = d3.svg.arc()
            .innerRadius(innerRadius+(23*2))
            .outerRadius(innerRadius+25+(25*2))
            .startAngle(sAngle)
            .endAngle(sAngle+endAngleScale(outer_arc2))
            return arcHover();
          });

        gs.append("path")
          .attr("fill", function(d) { return "#41bdc0";})
          .attr("class",chartID+"_arcPath_outer1")
          .attr("d", function(d) {
          var arcHover = d3.svg.arc()
            .innerRadius(innerRadius+(37*2))
            .outerRadius(innerRadius+35+(35*2))
            .startAngle(sAngle)
            .endAngle(sAngle+endAngleScale(outer_arc3))
            return arcHover();
        });
        $('#goalLevel_Donet').empty();
        $('#moduleLevel_DonetInnerText').html(arcName);
        $('#moduleLevel_DonetTimeSpentText').html(timeSpentValue);
      } 
      })
  }
generateMultilayerDonet(dataset4,'moduleLevel_Donet','00 00','Welcome Text');

// To get outer arc value based on section
function getOuterArcValue(dataItem, itemForCheck){
  var arcVal = 0;
  dataItem.forEach(function(d){if(d.OBJID == itemForCheck){ arcVal = d.VALUE;}}); 
  return arcVal;
}
// To get higest value from the given data
function getMaxValue(dataset){
  var maxValueArray = new Array();
  maxValueArray.push(Math.max.apply(Math, dataset.OBJSTATUS.map(function(o){return o.VALUE;})));
  maxValueArray.push(Math.max.apply(Math, dataset.OBJDATA.map(function(o){return o.VALUE;})));
  maxValueArray.push(Math.max.apply(Math, dataset.INSTRUCTORDATA.map(function(o){return o.VALUE;})));
  maxValueArray.push(Math.max.apply(Math, dataset.GROUPDATA.map(function(o){return o.VALUE;})));
  maxValue=Math.max.apply(Math, maxValueArray.map(function(o){return o;}))
  return maxValue;
}
// to deselect the item on outside of the chart using mouse up event
$('body').mouseup(function(e) {
  $('.'+clicked_arc).attr('fill', clicked_arc_color);
  $('path').css('opacity','1') 
  $('.moduleLevel_Donet_arcPath_outer1').css('visibility','hidden');
  $('.goalLevel_Donet_arcPath_outer1').css('visibility','hidden');
})
