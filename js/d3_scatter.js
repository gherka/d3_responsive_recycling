/*globals d3, viz */

(function scatterWrapper() {

var svgContainer = d3.select("#scatter_chart").append("svg")
.attr("preserveAspectRatio", "xMinYMin meet")
.attr("viewBox", "0 0 800 400")
.attr("id", "scatter_svg")
.classed("svg-content", true);

//INNER MARGINS FOR THE SVG
var margin = {top: 30, right: 20, bottom: 40, left: 70};

//INNER DIMENSIONS OF THE CHART
var width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

//SCALES AND AXES (domains are set after the data is loaded)
var xScale = d3.scaleLinear()
  .range([0, width - margin.right]);

var xAxis = d3.axisBottom()
  .scale(xScale);

var yScale = d3.scaleLinear()
  .range([height - margin.top - margin.bottom, 0]);

var yAxis = d3.axisLeft()
  .scale(yScale);

//TOOLTIP FUNCTIONS
function mouseover_func(context, d) { 

// TOOLTIP
var xPosition = parseFloat(d3.event.clientX);
var yPosition = parseFloat(d3.event.clientY) - 75;

d3.select("#scatter_tooltip")
    .style("left", xPosition + "px")
    .style("top", yPosition + "px")
    .select("#scatter_tooltip_value")
    .text(d.LA);

d3.select("#scatter_tooltip").classed("hidden", false);

}

function mouseout_func() {

	//TOOLTIP
	d3.select("#scatter_tooltip").classed("hidden", true);

}

//FUNCTION TO INITIALISE THE CHART
viz.createScatter = function() {

    var data = viz.data;
    data.sort(function(a,b) {return d3.descending(a.LA, b.LA);});

    xScale 
    .domain(d3.extent(data, function(d) { return d.Recycled_pp; }));
  
    yScale
    .domain(d3.extent(data, function(d) { return d.Generated_pp; }));

    //ADD GUIDELINES
    var scotland = data.filter(function(d) { return d.LA === 'Scotland';})[0];

    var guideline_vert = svgContainer
        .append('line')
        .attr('class', 'scatter_guide_v')
        .attr('x1', xScale(scotland.Recycled_pp))
        .attr('y1', height)
        .attr('x2', xScale(scotland.Recycled_pp))
        .attr('y2', 0)
        .attr('transform', `translate(${margin.left}, 0)`)
        .attr('stroke', 'silver')
        .attr('stroke-width', 1);

    var guideline_hor = svgContainer
        .append('line')
        .attr('class', 'scatter_guide_h')
        .attr('x1', margin.left)
        .attr('y1', yScale(scotland.Generated_pp))
        .attr('x2', width + margin.left)
        .attr('y2', yScale(scotland.Generated_pp))
        .attr('transform', `translate(0, ${margin.top})`)
        .attr('stroke', 'silver')
        .attr('stroke-width', 1);
        
    //ADD QUARTER RECTANGLES
    var quarter_1 = svgContainer
        .append('rect')
        .attr('class', 'scatter_quarter_1')
        .attr('x', margin.left)
        .attr('y', margin.top)
        .attr('width', xScale(scotland.Recycled_pp))
        .attr('height', yScale(scotland.Generated_pp))
        .attr('fill', 'black')
        .attr('opacity', '0.05');

    var quarter_4 = svgContainer
        .append('rect')
        .attr('class', 'scatter_quarter_4')
        .attr('x', xScale(scotland.Recycled_pp) + margin.left)
        .attr('y', yScale(scotland.Generated_pp) + margin.top)
        .attr('width', width - margin.right - xScale(scotland.Recycled_pp))
        .attr('height', height - margin.bottom - margin.top - yScale(scotland.Generated_pp))
        .attr('fill', 'black')
        .attr('opacity', '0.05');

    //CREATE CIRCLE IN THE SCATTERPLOT
    var circles = svgContainer.selectAll('circle')
        .data(data);
    
    circles.enter().append('circle')
        .attr('cx', function(d, i) { return xScale(data[i].Recycled_pp); })
        .attr('cy', function(d, i) {  return yScale(data[i].Generated_pp); })
        .attr('r', 5)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('fill', 'teal')
        .on("mouseover", function(d) { return mouseover_func(this, d); } )
        .on("mouseout", function(d) { return mouseout_func(); });
    
    //ADD SCOTLAND LABEL
    svgContainer
        .append('text')
        .attr('id', 'scot_label')
        .text('Scotland')
        .attr('x', xScale(scotland.Recycled_pp))    
        .attr('y', yScale(scotland.Generated_pp))
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    //CREATE AXES AND AXES LABELS
    svgContainer.append("g")
    .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
    .attr("class", "x_axis")
    .attr('shape-rendering','crispEdges')
    .call(xAxis)
        .selectAll("text")
        .attr("y", 10)
        .attr("x", 5);

    svgContainer.append("text")             
    .attr("transform", `translate(${(margin.left + (width) / 2)}, ${height + (margin.bottom / 2)})`)
    .style("text-anchor", "middle")
    .text("Recycled Tonnes per Person");
    
    svgContainer.append("g")
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr("class", "y_axis")
    .attr('shape-rendering','crispEdges')
    .call(yAxis);

    svgContainer.append("text")
     //translate first for the correct origin of rotation
    .attr("transform", `translate (${margin.left / 4}, ${height / 2}) rotate(-90)`)
    .style("text-anchor", "middle")
    .text("Generated Tonnes per Person"); 
    
};

//FUNCTION TO UPDATE SCATTER USING DATA FROM THE viz GLOBAL OBJECT
viz.updateScatter = function() {

    var data = viz.data;
    data.sort(function(a,b) {return d3.descending(a.LA, b.LA);});

    var t = d3.transition()
    .duration(1000);

    xScale 
    .domain(d3.extent(data, function(d) { return d.Recycled_pp; }));

    yScale
    .domain(d3.extent(data, function(d) { return d.Generated_pp; }));

    //UPDATE GUIDELINES
    var scotland = data.filter(function(d) { return d.LA === 'Scotland';})[0];

    var guideline_vert = svgContainer
        .selectAll("[class*=scatter_guide_v]")
        .transition(t)
        .attr('x1', xScale(scotland.Recycled_pp))
        .attr('y1', height)
        .attr('x2', xScale(scotland.Recycled_pp))
        .attr('y2', 0)
        .attr('transform', `translate(${margin.left}, 0)`)
        .attr('stroke', 'silver')
        .attr('stroke-width', 1);

    var guideline_hor = svgContainer
        .selectAll("[class*=scatter_guide_h]")
        .transition(t)
        .attr('x1', margin.left)
        .attr('y1', yScale(scotland.Generated_pp))
        .attr('x2', width + margin.left)
        .attr('y2', yScale(scotland.Generated_pp))
        .attr('transform', `translate(0, ${margin.top})`)
        .attr('stroke', 'silver')
        .attr('stroke-width', 1);
        
    //UPDATE QUARTER RECTANGLES
    var quarter_1 = svgContainer
        .selectAll('[class*=scatter_quarter_1]')
        .transition(t)
        .attr('x', margin.left)
        .attr('y', margin.top)
        .attr('width', xScale(scotland.Recycled_pp))
        .attr('height', yScale(scotland.Generated_pp))
        .attr('fill', 'black')
        .attr('opacity', '0.05');

    var quarter_4 = svgContainer
        .selectAll('[class*=scatter_quarter_4]')
        .transition(t)
        .attr('x', xScale(scotland.Recycled_pp) + margin.left)
        .attr('y', yScale(scotland.Generated_pp) + margin.top)
        .attr('width', width - margin.right - xScale(scotland.Recycled_pp))
        .attr('height', height - margin.bottom - margin.top - yScale(scotland.Generated_pp))
        .attr('fill', 'black')
        .attr('opacity', '0.05');

    //UPDATE SCOTLAND LABEL
    svgContainer
        .selectAll('#scot_label')
        .transition(t)
        .text('Scotland')
        .attr('x', xScale(scotland.Recycled_pp))
        .attr('y', yScale(scotland.Generated_pp))
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    //UPDATE CIRCLES IN THE SCATTERPLOT
    var circles = svgContainer.selectAll('circle')
        .data(data);
    
    circles
        .transition(t)
        .attr('cx', function(d, i) { return xScale(data[i].Recycled_pp); })
        .attr('cy', function(d, i) {  return yScale(data[i].Generated_pp); })
        .attr('r', 5)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('fill', 'teal')

    
    //RE-DRAW AXES AND AXES LABELS
    svgContainer
        .selectAll('g.x_axis')
        .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
        .transition(t)
        .call(xAxis)
            .selectAll("text")
            .attr("y", 10)
            .attr("x", 5);
    
    svgContainer
        .selectAll('g.y_axis')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .transition(t)
        .call(yAxis);
  
};

}());