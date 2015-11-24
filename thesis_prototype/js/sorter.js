function horSortAll(){
    for (var key in collection_metrics){
        var svg = collection_metrics[key]['svg'];
        horSortSVG(svg);

    }
}

function verSortAll(){
    for (var key in collection_metrics){
        var svg = collection_metrics[key]['svg'];
        verSortSVG(svg);
    }
}

function defaultSettingAll(){
    for (var key in collection_metrics){
        var svg = collection_metrics[key]['svg'];
        defaultSettingSVG(svg);
    }
}

function horSortSVG(svg){
    var t = svg.transition().duration(3000);

    t.selectAll(".cell")
        .attr("x", function(d) { return (d.sortedColIndex+1) * cellSize/2; })
    ;
    t.selectAll(".cell")
        .attr("y", function (d) { return (d.row+1) * cellSize/2; })
    ;

}

function verSortSVG(svg){
    var t = svg.transition().duration(3000);

    t.selectAll(".cell")
        .attr("y", function(d) { return (d.sortedRowIndex+1) * cellSize/2; })
    ;
    t.selectAll(".cell")
        .attr("x", function (d) { return (d.col+1) * cellSize/2; })
    ;

}

function defaultSettingSVG(svg){
    var t = svg.transition().duration(3000);

    t.selectAll(".cell")
        .attr("y", function (d) { return (d.row+1) * cellSize/2; })
    ;
    t.selectAll(".cell")
        .attr("x", function (d) { return (d.col+1) * cellSize/2; })
    ;

}

function order(value) {
    if (value == "horsort") {
        horSortAll();

    }
    else if (value == "versort") {

        verSortAll();

    }
    else if (value == "defaultSetting") {

        defaultSettingAll();

    }
}