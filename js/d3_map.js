/*globals viz, d3, topojson*/

// Global holding object for all viz-related things; has to be in the first script
window.viz = {};

(function mapWrapper() {

var width = 600,
height = 600;

var svg = d3.select("#map_chart").append("svg")
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", "0 0 630 630")
	.classed("svg-content", true);

var geo_path = "data/scotland_topo_simple.json";

var color_palette = ['#8c510a', '#d8b365', '#f6e8c3', '#f5f5f5',
'#c7eae5', '#5ab4ac', '#01665e'];

var color = d3.scaleQuantize()
  .range(color_palette);

//SHARED FUNCTIONS
function mouseover_func(context, d) { 
	//HIGHLIGHTING
	d3.selectAll("[class*=mycharts_bars").attr("fill", function(e) {				
		return d.properties.NAME === e.LA  ? "#db8390" : "#f4f4f4";
		});

	d3.selectAll("[class*=mycharts_map").attr("fill", function(e) {				
		return d.properties.NAME === e.properties.NAME  ? "#db8390" : "#f4f4f4";
		});

	d3.selectAll("circle").attr("fill", function(e) {				
		return d.properties.NAME === e.LA  ? "#db8390" : "#f4f4f4";
		});


	//TOOLTIP - always in top left corner of the map
	d3.select("#map_tooltip")
		.select("#map_tooltip_value")
		.text(d.properties.Value);

	d3.select("#map_tooltip").classed("hidden", false);

	}

function mouseout_func(d, measure) {
	//HIGHLIGHTING
	d3.selectAll('[class*=mycharts_bars').attr("fill", function(e) {

		return color(+e[`${measure}`]);
		});

	d3.selectAll("[class*=mycharts_map").attr("fill", function(e) {
		return color(e.properties.Value);
		});

	d3.selectAll("circle").attr("fill", 'teal');
	
	//TOOLTIP
	d3.select("#map_tooltip").classed("hidden", true);

}

//FUNCTION TO INITIALISE MAP CHART USING DATA FROM THE viz GLOBAL OBJECT
viz.createMap = function() {

		var data = viz.data;
		var measure = viz.selectedMeasure;

		d3.json(geo_path).then(function(topo) {
			
			var featureCollection = topojson.feature(topo, topo.objects.scotland);

			//append the numbers to the topojson; this part is dynamic so that we keep both parts
			//as small as possible; passing only the cut of the numbers selected in the dropdowns.
			for (let i=0; i < data.length; i++) {
					var caName = data[i].LA;
					var caValue = parseFloat(data[i][`${measure}`], 10);

					for (var j = 0; j < featureCollection.features.length; j++) {

						var topoCA = featureCollection.features[j].properties.NAME;
						//for matching "rows" in topojson, add Value as a Value property
						if (caName === topoCA) {
							featureCollection.features[j].properties.Value = caValue;
							break;
						}
					}
			}

			//the choropleth function that transforms values into one of 7 colours
			color
				.domain(d3.extent(featureCollection.features, function(d) { return +d.properties.Value; }));

			var projection = d3.geoIdentity()
				.reflectY(true)
				.fitSize([width,height], featureCollection);

			var path = d3.geoPath()
				.projection(projection);
				
			svg.append("g")
				.selectAll("path")
				.data(featureCollection.features)
				.enter().append("path")
				.attr('class', function(d) { return "mycharts_map_" + d.properties.NAME; })
				.attr("d", path)
				.attr('fill', function(d) { return color(d.properties.Value); })
				.on("mouseover", function(d) { return mouseover_func(this, d); } )
				.on("mouseout", function(d) { return mouseout_func(d, measure); });

			svg.append("text")
				.text('Source: Scottish Environment Protection Agency')
				.attr('id', 'source_label')
				.attr('x', 0)
				.attr('y', height + 25);

			});
		};

//FUNCTION TO UPDATE MAP USING DATA FROM THE viz GLOBAL OBJECT
viz.updateMap = function() {
		
	var data = viz.data;
	var measure = viz.selectedMeasure;
	
	//overwrite the Values in the data bound to map polygons
	//the loop covers cases when sort order isn't guaranteed
	svg.selectAll('path').each(function(d) {
		
		for (var i = 0; i < data.length; i++) {

			if (data[i].LA === d.properties.NAME) {
				d.properties.Value = data[i][`${measure}`];
				break;
			}
		}
	});

	color
		.domain(d3.extent(data, function(d) { return +d[`${measure}`]; }));

	var t = d3.transition()
		.duration(1000);

	svg
		.selectAll("path")
		.on("mouseover", function(d) { return mouseover_func(this, d); })
		.on("mouseout", function(d) { return mouseout_func(d, measure); })
		.transition(t)
		.attr('fill', function(d) { return color(d.properties.Value); });

	};

}());