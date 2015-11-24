
var xTimeScale = d3.time.scale();


function small_parallel_coordinates(container,dataPoint,selectedFeature){
    var margin = {top: 30, right: 10, bottom: 10, left: 10},
        width = 500 - margin.left - margin.right,
        height = 75 - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {},
        dragging = {};

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        foreground;

    var svg = container.append("svg").attr("id","small_parallel_coordinates")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = d3.keys(config_features).filter(function(d) {
        return  (y[d] = d3.scale.linear()
            .domain([config_features[d]["min"],config_features[d]["max"]])
            .range([height, 0]));
    }));

    //// Add grey background lines for context.
    //background = svg.append("g")
    //    .attr("class", "background")
    //    .selectAll("path")
    //    .data(cars)
    //    .enter().append("path")
    //    .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data([dataPoint])
        .enter().append("path")
        .attr("d", path);

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; });


    // Add an axis and title.
    var allAxes = g.append("g")
        .attr("class", "axis")
        .each(function(d) { d3.select(this).call(axis.tickValues([config_features[d]["min"],config_features[d]["max"]]).scale(y[d])); });
    allAxes.selectAll(".tick").attr("font-size","4pt");


    allAxes.append("text")
        .attr("class",function(d){return "rowLabel mono featureName"+d;})
        .classed("text-highlight",function(d){return d==selectedFeature;})
        .style("text-anchor", "middle")
        .attr("y", -9)

        .attr("transform", "rotate(-60)")
        .text(function(d) { return d; });



    function position(d) {
        return x(d);
    }



// Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
    }


}

function small_line_chart(container,dataPoints,feature,epoch){
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 500 - margin.left - margin.right,
        height = 75 - margin.top - margin.bottom;

    //var parseDate = d3.time.format("%d-%b-%y").parse;

    var x = d3.scale.linear()
        .domain(xScale.domain())
        .range([0, width]);

    xTimeScale.range([ 0, width ]).clamp(true);

    var y = d3.scale.linear()
        .domain([config_features[feature]["min"],config_features[feature]["max"]])
        .range([height, 0]);

    var xAxis = d3.svg.axis().tickFormat(d3.time.format("%H:%M"))
        .scale(xTimeScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickValues([config_features[feature]["min"],config_features[feature]["max"]])
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) { return x(d.col); })
        .y(function(d) { return y(d.value); });



    var svg = container.append("svg").attr("id","small_line_chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


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
        .text(feature);

    svg.append("path")
        .datum(dataPoints)
        .attr("class", "line")
        .attr("d", line);

    svg.append("path")
        .datum([{col:epoch,value:config_features[feature]["min"]},{col:epoch,value:config_features[feature]["max"]}])
        .attr("class", "line marker")

        .attr("d", line);

}

