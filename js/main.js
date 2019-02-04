/*global viz, d3 */

//DEFAULT VALUES
viz.selectedYear = 2017;
viz.selectedMeasure = 'Recycled_pp';
viz.apiPath = function() {return `http://gherka.pythonanywhere.com/api/d3?Year=${viz.selectedYear}`;};

//FUNCTION TO ASYNCHRONOUSLY LOAD DATA; RETURNS JS PROMISE
viz.newDataPromise = function() {return d3.json(viz.apiPath());};

//FUNCTION TO USE THE ASYNC. LOADED DATA TO THEN CREATE EACH CHART
viz.createAll = function() {

    viz.newDataPromise()
    .then(function(data) { viz.data = data; })
    .then(function() { viz.createBarChart(); })
    .then(function() { viz.createMap(); })
    .then(function() { viz.createScatter(); });
};

viz.createAll();

//FUNCTION TO USE A NEW ASYNC. DATA TO THEN UPDATE EACH CHART
viz.updateAll = function() {

    viz.newDataPromise()
    .then(function(data) { viz.data = data; })
    .then(function() { viz.updateBarChart(); })
    .then(function() { viz.updateMap(); })
    .then(function() { viz.updateScatter(); });
};

//ADD VARIABLES TO TRACK INTERACTIVE ELEMENTS
var button_2017 = document.getElementById("btn_2017");
var button_2016 = document.getElementById("btn_2016");
var button_2015 = document.getElementById("btn_2015");
var button_recycled = document.getElementById("btn_recycled");
var button_generated = document.getElementById("btn_generated");

//ADD EVENT LISTENERS TO EACH INTERACTIVE ELEMENT
button_2017.addEventListener('click', function() {

    viz.selectedYear = '2017';
    viz.updateAll();

});  

button_2016.addEventListener('click', function() {
    
    viz.selectedYear = '2016';
    viz.updateAll();

});  

button_2015.addEventListener('click', function() {
    
    viz.selectedYear = '2015';
    viz.updateAll();

});

button_recycled.addEventListener('click', function() {
    
    d3.select("#btn_recycled").classed('active', true);
    d3.select("#btn_generated").classed('active', false);

    viz.selectedMeasure = 'Recycled_pp';
    viz.updateAll();

});

button_generated.addEventListener('click', function() {

    d3.select("#btn_generated").classed('active', true);
    d3.select("#btn_recycled").classed('active', false);
    
    viz.selectedMeasure = 'Generated_pp';
    viz.updateAll();

});