/**
 * Created by Josi on 13/11/2015.
 */
function addTimeLine(container, dayData){

}
//TODO: in object wrapper steken
var xScaleScore = d3.scale.linear()
    .domain([0,5])
    .range([0,70]);

var categoriesScores = ["M", "C", "A", "Sport", "Dutjes", "Fat_food"];
var yScaleScore = d3.scale.ordinal()
    .domain(categoriesScores)
    .rangeRoundBands([0,40]);

var categoriesColors = ['#0000b4','#0082ca','#0094ff','#0d4bcf','#0066AE'];
var colorScale = d3.scale.quantize()
    .domain([0,categoriesScores.length])
    .range(categoriesColors);


var	xAxisScore = d3.svg.axis();
xAxisScore
    .orient('bottom')
    .scale(xScaleScore)
    .tickFormat(d3.format("s"))
    .tickValues(d3.range(6));



var	yAxisScore = d3.svg.axis();
yAxisScore
    .orient('left')
    .scale(yScaleScore);



var xScaleInBedMetrics = d3.scale.linear()
    .domain([0,180])
    .range([0,100]);

var xScaleActivities = d3.scale.linear()
    .domain([0,5])
    .range([0,100]);

var categoriesInBedMetrics = ["SOL","WASO","EMA","TWT","TST"];
var yScaleInBedMetrics = d3.scale.ordinal()
    .domain(categoriesInBedMetrics)
    .rangeRoundBands([0,40]);

var activities = ["nightmare","toilet","light_off"];
var yScaleActivities = d3.scale.ordinal()
    .domain(activities)
    .rangeRoundBands([0,40]);

var	xAxisInBedMetrics = d3.svg.axis();
xAxisInBedMetrics
    .orient('bottom')
    .scale(xScaleInBedMetrics)
    .ticks(5);



var	xAxisActivities= d3.svg.axis();
xAxisActivities
    .orient('bottom')
    .scale(xScaleActivities)
    .ticks(5);

var	yAxisInBedMetrics = d3.svg.axis();
yAxisInBedMetrics
    .orient('left')
    .scale(yScaleInBedMetrics);

var	yAxisActivities = d3.svg.axis();
yAxisActivities
    .orient('left')
    .scale(yScaleActivities);

function addContextBefore(container, dayData){
        container.append("div").text(dayData.date_begin_sleep).attr("class","dayTitle");
        var diary =dayData["subjective_data"]["sleep_diary"];

    function addDiaryEntry(label,content,container){
        var entry = container.append("div").attr("class","diary_entry");
        entry.append("div").attr("class","diary_entry label").text(label);
        entry.append("div").attr("class","diary_entry content").text(content);

    }
        addDiaryEntry("Voormiddag",diary["Voormiddag"],container);
        addDiaryEntry("Middag",diary["Middag"],container);
        addDiaryEntry("Namiddag",diary["Namiddag"],container);

        function addQuantitativeContext(label,content,container){
            var scoreSVG = container.append("div")
                .attr("class","scores subjContext")
                .append("svg")
                .attr("width",100)
                .attr("height",60);

            var y_xis = scoreSVG.append('g')
                .attr("class","axis")
                .attr("transform", "translate(30,0)")
                .call(yAxisScore);

            var x_xis = scoreSVG.append('g')
                .attr("class","axis")
                .attr("transform", "translate(30,40)")
                .attr('id','xaxis')
                .call(xAxisScore);

            var chart = scoreSVG.append('g')
                .attr("transform", "translate(30,0)")
                .attr('id','barsScore')
                .selectAll('rect')
                .data(content)
                .enter()
                .append('rect')
                .attr('height',5)
                .attr({'x':0,'y':function(d,i){ return yScaleScore(d.key); }})
                .style('fill',function(d,i){ return colorScale(d.value); })
                .attr('width',function(d){ return xScaleScore(d.value); });

            scoreSVG.selectAll(".tick").attr("font-size","4pt");

        }
        addQuantitativeContext("day_activities", d3.entries(dayData["subjective_data"]["day_activities"]),container);

    addDiaryEntry("Avond",diary["Voormiddag"],container);
    addDiaryEntry("Laatste uur",diary["Laatste_uur"],container);
    addDiaryEntry("Net voor het slapengaan",diary["Net_voor_het_slapengaan"],container);

    addQuantitativeContext("evening_activities",d3.entries(dayData["subjective_data"]["evening_activities"]),container);


        //container.append("svg").append("rect").attr("width", 10)
        //.attr("height", 10).fill("black");
}



function addContextAfter(container, nightData){
    var containerTimeInBedMetrics =  container.append("div").attr("class","TimeInBedMetricsViz");
    var containerActivities =  container.append("div").attr("class","ActivitiesViz");

    var timeInBedMetrics = calculateTimeInBedMetrics(nightData["subjective_data"]["bed_times_after_sleep"]);
    timeInBedMetrics =d3.entries(timeInBedMetrics);
    timeInBedMetrics = timeInBedMetrics.filter(function(d){return  categoriesInBedMetrics.indexOf(d.key) > -1;});
    addTimeInBedMetrics(containerTimeInBedMetrics,timeInBedMetrics);
    var activities = calculateNightActivities(nightData["subjective_data"]["night_activities"]);
    addNightActivities(containerActivities,d3.entries(activities));
}

function calculateTimeInBedMetrics( nightData){
    var result = {SOL:0,FNA: 0,EMA:0,TWT:0,TIB:0,TST:0,SE:0, WASO:0 };
    var type;
    var duration;
    for (var i = 0; i< nightData.length;i++){
        type = nightData[i].label;

        duration = getDuration(nightData[i]["end"],nightData[i]["start"]);

        if(type == "sleep"){

            result.FNA = result.FNA + 1;

        }else if(type == "wake_before_sleep"){
            result.SOL = result.SOL + duration;
        }else if(type == "wake_after_sleep"){
            result.WASO = result.WASO + duration;
        }else if(type == "wake_in_bed"){
            result.EMA = result.EMA + duration;
        }
        result.TIB = result.TIB+duration;
    }
    result.TWT = result.SOL+result.WASO+result.EMA;

    result["TST"] =result["TIB"] - result["TWT"];
    result.SE =result.TST/result.TIB;

    return result;
}

function calculateNightActivities( nightData){//eerder bollen dan bar chart --> tooltip per bol
    var result = {};
    var type;
    var duration;
    for (var i = 0; i< nightData.length;i++){
        type = nightData[i].label;
        if(type in result){
            result[type] = result[type] + 1;
        }else{
            result[type] = 1;
        }


    }


    return result;
}

function addTimeInBedMetrics(container, nightData){

        var scoreSVG = container.append("div")
            .attr("class","scores subjContext")
            .append("svg")
            .attr("width",100)
            .attr("height",60);

        var y_xis = scoreSVG.append('g')
            .attr("transform", "translate(30,0)")
            .attr("class","axis")
            .call(yAxisInBedMetrics);

        var x_xis = scoreSVG.append('g')
            .attr("transform", "translate(30,40)")
            .attr("class","axis")
            .attr('id','xaxis')
            .call(xAxisInBedMetrics);

        var chart = scoreSVG.append('g')
            .attr("transform", "translate(30,0)")
            .attr('id','barsScore')
            .selectAll('rect')
            .data(nightData)
            .enter()
            .append('rect')
            .attr("class", function(d){ if(d.key == "TST"){return "sleep"}else{return d.key;}})
            .attr('height',5)
            .attr({'x':0,'y':function(d,i){ return yScaleInBedMetrics(d.key); }})
            .attr('width',function(d){ return xScaleInBedMetrics(d.value); });

    scoreSVG.selectAll(".tick").attr("font-size","4pt");
//more to come

}

function addNightActivities(container, content){


        var inBedMetricsSVG = container.append("div")
            .attr("class","inBedMetrics subjContext")
            .append("svg")
            .attr("width",100)
            .attr("height",50);

        var y_xis = inBedMetricsSVG.append('g')
            .attr("transform", "translate(30,0)")
            .attr("class","axis")
            .call(yAxisActivities);

        var x_xis = inBedMetricsSVG.append('g')
            .attr("transform", "translate(30,40)")
            .attr("class","axis")
            .attr('id','xaxis')
            .call(xAxisActivities);

        var chart = inBedMetricsSVG.append('g')
            .attr("transform", "translate(30,0)")
            .attr('id','barsScore')
            .selectAll('rect')
            .data(content)
            .enter()
            .append('rect')
            .attr('height',5)
            .attr({'x':0,'y':function(d,i){ return yScaleActivities(d.key); }})
            .attr('width',function(d){ return xScaleActivities(d.value); });

    inBedMetricsSVG.selectAll(".tick").attr("font-size","4pt");


}


function addTimeLineSubjContext(timeLineSubjContext,dayData){
    return ganttWrapperFunction(dayData["subjective_data"]["night_activities"],dayData["subjective_data"]["bed_times_after_sleep"],timeLineSubjContext,new Date('July 01, 2015 16:24:00'),new Date('July 02, 2015 16:24:00'));
}

function  addTimeLineObjExternContext(timeLineObjExternContext,dayData){

}