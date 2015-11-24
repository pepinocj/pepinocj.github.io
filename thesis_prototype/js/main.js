var parseDate = d3.time.format("%b %Y").parse;

var xScale = d3.scale.linear().range([0, width]).domain([0,300]),
    x2Scale = d3.scale.linear().range([0, width]).domain([0,300]),
    yScale = d3.scale.linear().range([0,cellSize*Object.keys(config_features).length]).domain([0,40]);

var xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(xScale).orient("bottom"),
    yAxis = d3.svg.axis().scale(yScale).orient("left");


var brush = d3.svg.brush()
    .x(x2Scale)
    .on("brush", brushed);

var svgContext;

function brushed() {

    xScale.domain(brush.empty() ? x2Scale.domain() : brush.extent());
    var widthScale = (brush.extent()[1] - brush.extent()[0]) / (x2Scale.domain()[1] - x2Scale.domain()[0]);
    var filteredData;

    for (var k = 0; k < collection_day_data.length; k++) {
        if (collection_day_data[k].active) {

            filteredData = [];
            var dayData = collection_day_data[k].data;
            for (var i = 0; i < dayData.length; i++) {

                if (dayData[i].col < brush.extent()[1] && dayData[i].col > brush.extent()[0]) {
                    filteredData.push(dayData[i]);
                }
            }
            var tempD = collection_day_data[k].date;
            var tempG = collection_day_data[k]["ganttChart"];
            xTimeScale.domain([new Date(tempD.getTime() + brush.extent()[0] * 300000), new Date(tempD.getTime() + brush.extent()[1] * 300000)]);

            update(filteredData, d3.selectAll("#dayViz" + k).select(".viz.patch"), widthScale); //sleect all, call(update(this))


            tempG.timeDomain([new Date(tempD.getTime() + brush.extent()[0] * 300000), new Date(tempD.getTime() + brush.extent()[1] * 300000)]);
            tempG.redraw();
        }
    }

}


function update(data,svg,widthScale) {

    // DATA JOIN
    // Join new data with old elements, if any.
    var text = svg.select(".g3").selectAll(".cell")//JUISTE GROEP SELECTEREN, VANDAAR .g3
        .data(data, function(d){return d.numMapFeature+":"+d.col});

    // UPDATE
    // Update old elements as needed.
    text.attr("x", function(d) { return xScale(d.col); })
        .attr("width", function(d) { return ((cellSize/2) * 1/widthScale); });

    // ENTER
    // Create new elements as needed.


    text.enter()
        .append("rect")
        .attr("x", function(d) {  return xScale(d.col); })
        .attr("y", function(d) { return (d.numMapFeature+1) * cellSize; })
        .attr("class", function(d){return "cell cell-border cr"+(d.numMapFeature)+" cc"+(d.col);})
        .attr("width",((cellSize/2) * 1/widthScale))
        .attr("height", cellSize)
        .style("fill", function(d) { return collection_metrics[d.feature][1](d.value); })
        .on("mouseover", function(d){
            //highlight text
            d3.select(this).classed("cell-hover",true);
            d3.selectAll(".featureName"+ d.feature).classed("text-highlight",true);

            //Update the tooltip position and value
            d3.select("#tooltip")
                //.style("left", (d3.event.pageX+10) + "px")
                //.style("top", (d3.event.pageY-10) + "px")
                .select("#value")
                .text("Feature: "+ d.feature + "\r\n Value: "+ d.value);//Show the tooltip
            d3.select("#tooltip").classed("hidden", false);
            d3.select("#small_parallel_coordinates").remove();
            d3.select("#small_line_chart").remove();
            small_line_chart(horDetail,getFeatureDataForDay(d.feature, d.row), d.feature, d.col);
            small_parallel_coordinates(verDetail,getEpochData(d.row, d.col), d.feature);
        })
        .on("mouseout", function(){
            d3.select(this).classed("cell-hover",false);
            d3.selectAll(".rowLabel").classed("text-highlight",false);
            //d3.select("#tooltip").classed("hidden", true);

        })
    ;

    // EXIT
    // Remove old elements as needed.
    text.exit().remove();

}




d3.json("data/myfile_flattened.json", function(error, json) {
    if (error) return console.warn(error);
    data = json;



    svgContext = d3.select("#slider").append("svg").attr("class", "context").attr("height",20).attr("width",width);//d3.select("#chart").append("svg").attr("class", "context").attr("height",30).attr("width",width);

    svgContext.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -2)
        .attr("height", 20);
    verDetail = d3.select(".detailsCell.vertical");
    horDetail = d3.select(".detailsCell.horizontal");



    add_features();
    visualizeDay(0);
    visualizeDay(1);
    visualizeDay(2);
//        visualizeDay(1);
//        visualizeDay(2);
//        visualizeDay(1);
//        visualizeDay(2);




});

function add_features(){

    var feat_keys = Object.keys(config_features);

    var days;
    for (var key in config_features){


        var temp = getVisualDataForFeature(config_features[key]['type'],key,false);
        var processedData = temp[0];
        days = temp[1];
        add_metric(key,[processedData,d3.scale.quantile()
            .domain([ config_features[key]['min'] ,  config_features[key]['max']])
            .range(config_features[key]['color'])] ) ;
    }

    var nrDays = days.length;
    for (var j = 0 ; j < nrDays;j++){
        var dataForDay = [];

        for (var key in collection_metrics){
            for (var i = 0 ; i < collection_metrics[key][0].length;i++){
                if(collection_metrics[key][0][i].row == j){
                    dataForDay.push(collection_metrics[key][0][i]);
                }
            }
        }


        collection_day_data.push({data:dataForDay,date: days[j],nrDay:j,ganttChart:"none",active:false});

    }

    console.log(collection_day_data);
    console.log(days);




}

function getFeatureDataForDay(feature,day){
    var result = [];
    var dayData =collection_day_data[day].data;
    for (var i = 0 ; i<dayData.length;i++){

        if(dayData[i].feature == feature){
            result.push( dayData[i]);
        }
    }
    return result;


}

function getEpochData(day,epoch){
    var result = {};
    var dayData =collection_day_data[day].data;
    for (var i = 0 ; i<dayData.length;i++){
        if(dayData[i].col == epoch){
            result[dayData[i].feature] = dayData[i].value;
        }
    }
    return result;
}



//default --> row == date, col == epoch, val = featureVal
//for now: mapping val to [-10,10]
//horSort --> quantity horSortRow/Col
//verSort --> for distribution vertSortRow/Col
function visualizeDay(nrDay){
    var dayViz = d3.select("#chart").append("div").attr("id","dayViz"+nrDay).attr("class","dayViz");

    var contextBefore = dayViz.append("div").attr("class","subjContext before");

    var mainVizContainer =dayViz
        .append("div")
        .attr("class","mainViz");

    var svg = mainVizContainer
        .append("div")
        .attr("class","viz patch")
        .append("svg")
        .attr("class","heatmapViz patch ");

    var timeLineSubjContext  = mainVizContainer
        .append("div")
        .attr("class","viz subjective timeWindow");

    //var timeLineObjExternContext  = mainVizContainer
    //    .append("div")
    //    .attr("class","viz objectiveExtern timeWindow")
    //    .append("svg")
    //    .attr("class","heatmapViz smartphone ");


    var contextAfter =dayViz.append("div").attr("class","subjContext after");

    //    var timeLine = dayViz.append("div").attr("class","timeLine");
    var dayContextData =data["user1"]["smart_phone_data"][0];
    //var temp = addTimeLineSubjContext(timeLineSubjContext,dayContextData);
    //function ganttTemp(a,b){return temp(a,b)};

    collection_day_data[nrDay]["ganttChart"] = addTimeLineSubjContext(timeLineSubjContext,dayContextData);
    collection_day_data[nrDay]["active"]=true;

    //console.log(temp);
    //addTimeLineObjExternContext(timeLineObjExternContext,dayContextData);
    addContextBefore(contextBefore,dayContextData);
    addContextAfter(contextAfter,dayContextData);


    //var dataForDay = [];
    //
    //for (var key in collection_metrics){
    //    for (var i = 0 ; i < collection_metrics[key][0].length;i++){
    //        if(collection_metrics[key][0][i].row == nrDay){
    //            dataForDay.push(collection_metrics[key][0][i]);
    //        }
    //    }
    //}
    //
    //
    //collection_day_data.push(dataForDay);

    var dataForDay = collection_day_data[nrDay].data;




    //var zoom = d3.behavior.zoom()
    //    .x(xScale)
    //    .on("zoom", zoomHandler);

    var brush = d3.svg.brush()
        .x(x2Scale)
        .on("brush", brushed);



    //function zoomHandler() {
    //    var t = zoom.translate(),
    //        tx = t[0],
    //        ty = t[1];
    //
    //    tx = Math.min(tx, 0); // tx < 0
    //    tx = Math.max(tx,  -1000); //
    //    zoom.translate([tx, ty]);
    //
    //    svg.select(".x.axis").call(xAxis);
    //    d3.selectAll(".heatmapViz.patch").selectAll("rect")
    //        .attr("x", function(d) { return xScale(d.col); })
    //        .attr("y", function(d) { return yScale(d.numMapFeature); })
    //        .attr("width", function(d) { return ((cellSize/2) * d3.event.scale); });
    //}



    var heatMap = svg.append("g")
            .attr("transform", "translate("+margin.left+","+margin.top+")")
            .attr("class","g3")
            .selectAll(".cell")
            .data(dataForDay,function(d){return d.numMapFeature+":"+d.col;})
            .enter()
            .append("rect")
            .attr("x", function(d) {  return xScale(d.col); })
            .attr("y", function(d) { return (d.numMapFeature+1) * cellSize; })
            .attr("class", function(d){return "cell cell-border cr"+(d.numMapFeature)+" cc"+(d.col);})
            .attr("width", 0.7*cellSize)
            .attr("height", cellSize)
            .style("fill", function(d) { return collection_metrics[d.feature][1](d.value); })
            .on("mouseover", function(d){
                //highlight text
                d3.select(this).classed("cell-hover",true);
                d3.selectAll(".featureName"+ d.feature).classed("text-highlight",true);
                //d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(d.col);});

                //Update the tooltip position and value
                d3.select("#tooltip")
                    //.style("left", (d3.event.pageX+10) + "px")
                    //.style("top", (d3.event.pageY-10) + "px")
                    .select("#value")
                    .text("Feature: "+ d.feature + "\nValue: "+ d.value);
                //Show the tooltip
                d3.select("#tooltip").classed("hidden", false);
                d3.select("#small_parallel_coordinates").remove();
                d3.select("#small_line_chart").remove();
                var tempD = collection_day_data[nrDay].date; //TODO: temporary solution
                xTimeScale.domain([new Date(tempD.getTime() + xScale.domain()[0] * 300000), new Date(tempD.getTime() + xScale.domain()[1] * 300000)]);

                small_line_chart(horDetail,getFeatureDataForDay(d.feature, d.row), d.feature, d.col);
                small_parallel_coordinates(verDetail,getEpochData(d.row, d.col), d.feature);

            })
            .on("mouseout", function(){
                d3.select(this).classed("cell-hover",false);
                d3.selectAll(".rowLabel").classed("text-highlight",false);
                d3.selectAll(".colLabel").classed("text-highlight",false);
                //d3.select("#tooltip").classed("hidden", true);

            })
        ;

    var rowLabels = svg.append("g").attr("transform", "translate("+margin.left+","+margin.top+")")
        .selectAll(".rowLabel")
        .data(Object.keys(collection_metrics))
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return (i+1) * cellSize; })
        .style("text-anchor", "end")
        .attr("transform", "translate(0," + cellSize / 1.5 + ")")
        .attr("class", function (d,i) { return "rowLabel mono featureName"+ d+" r"+i;} )
        .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
        .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);});


    d3.select("#order").on("change",function(){
        order(this.value);
    });


}







