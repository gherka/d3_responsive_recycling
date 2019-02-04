/*globals d3, viz */

(function barWrapper() {

var svgContainer = d3.select("#bar_chart").append("svg")
.attr("preserveAspectRatio", "xMinYMin meet")
.attr("viewBox", "0 0 800 400")
.attr("id", "bar_chart_svg")
.classed("svg-content", true);

//INNER MARGINS FOR THE SVG
var margin = {top: 40, right: 20, bottom: 170, left: 50};

//INNER DIMENSIONS OF THE CHART
var width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

//COLOURS
var color_palette = ['#8c510a', '#d8b365', '#f6e8c3', '#f5f5f5',
'#c7eae5', '#5ab4ac', '#01665e'];

var color = d3.scaleQuantize()
  .range(color_palette);

//SCALES AND AXES (domains are set after the data is loaded)
var xScale = d3.scaleBand()
  .rangeRound([0, width])  //round to prevent antialising issues round
  .padding(0.1);

var xAxis = d3.axisBottom()
  .scale(xScale);

var yScale = d3.scaleLinear()
  .range([height, 0]);

var yAxis = d3.axisLeft()
  .ticks(7)
  .scale(yScale);
  
//FUNCTION TO CREATE INITIAL BAR CHART
viz.createBarChart = function() {

  var data = viz.data;
  var measure = viz.selectedMeasure;

  var t = d3.transition()
    .duration(1000);

  data.forEach(function(d) {
    d[`${measure}`] = parseFloat(d[`${measure}`], 10);
  });

  data.sort(function(a,b) {return d3.descending(a[`${measure}`], b[`${measure}`]);});

  xScale 
    .domain(data.map(function(d) { return d.LA; }));
  
  yScale
    .domain([0, d3.max(data, function(d) { return d[`${measure}`]; })]);

  color
    .domain(d3.extent(data, function(d) { return d[`${measure}`]; }));

  //SELECT ALL BARS THAT EXIST AND BIND DATA
  var bars = svgContainer.selectAll('rect')
    .data(data, function(d) {return d.LA;});

  bars.enter().append('rect')
  //everything after transition(t) is state B - transition to!
    .attr('class', function(d) { return "mycharts_bars_" + d.LA; })
    .attr('x', function(d) { return xScale(d.LA); })
    .attr('width', xScale.bandwidth())
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('fill', 'white')
    .attr('y', `${height}`) //State A
    .transition(t)
    .attr('fill', function(d) { return color(d[`${measure}`]) ;})
    .attr('stroke', 'dimgray')
    .attr('stroke-width', '0.3')
    .attr('y', function(d) { return yScale(d[`${measure}`]); }) //State B
    .attr('height', function(d) { return height - yScale(d[`${measure}`]); });

  //Draw the axes
  svgContainer.append("g")
    .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
    .attr("class", "x_axis")
    .attr('shape-rendering','crispEdges')
    .call(xAxis)
  .selectAll("text")
  .attr("y", -5)
  .attr("x", 10)
  .attr("dy", ".5em")
  .attr("transform", "rotate(90)")
  .style("text-anchor", "start");
  
  svgContainer.append("g")
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr("class", "y_axis")
    .attr('shape-rendering','crispEdges')
    .call(yAxis);
};

//FUNCTION TO UPDATE BARS USING DATA FROM THE viz GLOBAL OBJECT
viz.updateBarChart = function () {

  var data = viz.data;
  var measure = viz.selectedMeasure;

  var t = d3.transition()
    .duration(1000);

  data.forEach(function(d) {
    d[`${measure}`] = parseFloat(d[`${measure}`], 10);
  });

  data.sort(function(a,b) {return d3.descending(a[`${measure}`], b[`${measure}`]);});

  xScale 
    .domain(data.map(function(d) { return d.LA; }));
  
  yScale
    .domain([0, d3.max(data, function(d) { return d[`${measure}`]; })]);

  color
    .domain(d3.extent(data, function(d) { return d[`${measure}`]; }));

  //SELECT ALL BARS THAT EXIST AND RE-BIND DATA
  var bars = svgContainer.selectAll('rect')
    .data(data, function(d) {return d.LA;});

  //UPDATE THE ALREADY BOUND DATA
  bars
    .transition(t)
    .attr('class', function(d) { return "mycharts_bars_" + d.LA; })
    .attr('x', function(d) { return xScale(d.LA); })
    .attr('y', function(d) { return yScale(d[`${measure}`]); })
    .attr('width', xScale.bandwidth())
    .attr('height', function(d) { return height - yScale(d[`${measure}`]); })
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('fill', function(d) { return color(d[`${measure}`]) ;});

  //RE-DRAW THE AXES
  svgContainer.selectAll("g.x_axis")
    .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
    .transition(t)
    .call(xAxis)
    .selectAll("text")
    .attr("y", -5)
    .attr("x", 10);

  svgContainer.selectAll("g.y_axis")
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .transition(t)
    .call(yAxis);
      
    };

}());