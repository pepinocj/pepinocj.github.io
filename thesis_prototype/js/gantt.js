/**
 * Created by Josi on 15/11/2015.
 */

var jsonMapper={};
jsonMapper["sleep"] = "sleep";
jsonMapper["SOL"] = "wake_before_sleep";
jsonMapper["WASO"] = "wake_after_sleep";
jsonMapper["EMA"] = "wake_in_bed";


function ganttWrapperFunction(nightActivities, timesInBed,container,minDate,maxDate){


    var tasks = [
        //{"startDate":new Date("Sun Dec 09 01:36:45 EST 2012"),"endDate":new Date("Sun Dec 09 02:36:45 EST 2012"),"taskName":"Bed","status":"Succeeded"},
        //{"startDate":new Date("Sun Dec 09 04:56:32 EST 2012"),"endDate":new Date("Sun Dec 09 06:35:47 EST 2012"),"taskName":"Bed","status":"RUNNING"},
        //{"startDate":new Date("Sun Dec 09 06:29:53 EST 2012"),"endDate":new Date("Sun Dec 09 06:34:04 EST 2012"),"taskName":"Outside bed","status":"RUNNING"},
        //{"startDate":new Date("Sun Dec 09 05:35:21 EST 2012"),"endDate":new Date("Sun Dec 09 06:21:22 EST 2012"),"taskName":"Outside bed","status":"RUNNING"},
        //{"startDate":new Date("Sun Dec 09 05:00:06 EST 2012"),"endDate":new Date("Sun Dec 09 05:05:07 EST 2012"),"taskName":"Bed","status":"Succeeded"},
        //{"startDate":new Date("Sun Dec 09 03:46:59 EST 2012"),"endDate":new Date("Sun Dec 09 04:54:19 EST 2012"),"taskName":"Outside bed","status":"RUNNING"}
    ];

    function convertToGanttTask(record,taskName){
        var result = {};

        result["startDate"] =  new Date(record["start"]);
        if(record["end"] == 'none'){
            result["endDate"] = result["startDate"]+1;
        }else{
            result["endDate"] =new Date(record["end"]);
        }
        result["taskName"] = taskName;
        result["status"] = record["label"];


        return result;
    }

    for(var i = 0 ; i< nightActivities.length;i++){
        tasks.push(convertToGanttTask(nightActivities[i],"Activity"));
    }

    for(var i = 0 ; i< timesInBed.length;i++){
        tasks.push(convertToGanttTask(timesInBed[i],"Bed"));
    }




    var taskStatus = {};
    taskStatus   [jsonMapper[ "SOL"]] = "SOL";
        taskStatus [ jsonMapper[ "WASO"]] = "WASO";
        taskStatus [ jsonMapper["EMA" ]]="EMA";
        taskStatus [  jsonMapper["sleep"]] = "sleep";


    var taskNames = [ "Bed", "Activity" ];

    tasks.sort(function(a, b) {
        return a.endDate - b.endDate;
    });
//var maxDate = tasks[tasks.length - 1].endDate;
    tasks.sort(function(a, b) {
        return a.startDate - b.startDate;
    });
//var minDate = tasks[0].startDate;


    var format = "%H:%M";

    var ganttInContainer = d3.gantt();
     ganttInContainer.timeDomainMode('fixed')
        .taskTypes(taskNames)
        .taskStatus(taskStatus)
        .tasks(tasks)
        .tickFormat(format)
        .width(width)
        .height(60)
        .timeDomain([minDate,maxDate]);
    ganttInContainer(tasks,container);
    return ganttInContainer;

}

