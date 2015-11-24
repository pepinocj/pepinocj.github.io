var formatDate="DD-MM-YYYY hh:mm:ss";

function getDuration(dateMax,dateMin){
    //var a = moment(dateMax,formatDate);
    //var b = moment(dateMin,formatDate);
    //return a.diff(b,"seconds");

    return (new Date(dateMax)-new Date(dateMin))/(1000*60);
}
