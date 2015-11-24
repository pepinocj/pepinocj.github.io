/**
 * Created by Josi on 11/11/2015.
 */
var colors_body_positions = ['black','purple','purple','yellow','yellow','red','red','black'];
var colors_green_to_red = colors = ['#005824','#1A693B','#347B53','#4F8D6B','#699F83','#83B09B','#9EC2B3','#B8D4CB','#D2E6E3','#EDF8FB','#FFFFFF','#F1EEF6','#E6D3E1','#DBB9CD','#D19EB9','#C684A4','#BB6990','#B14F7C','#A63467','#9B1A53','#91003F'];
var config_features = {N:{color:colors_green_to_red, min:0 , max: 1000,type:'heart'},
    meanNN:{color:colors_green_to_red, min:0 , max: 1000,type:'heart'}
    ,SDNN:{color:colors_green_to_red, min:0 , max: 1000,type:'heart'}
    ,RMSSD:{color:colors_green_to_red,min:0 , max: 1000,type:'heart'} //wrong
    ,NN50count1:{color:colors_green_to_red, min:0 , max: 1000,type:'heart'}
    ,NN50count2:{color:colors_green_to_red, min:0 , max: 1000,type:'heart'}
    ,NN50count:{color:colors_green_to_red, min:0 , max: 1000,type:'heart'}
    ,pNN50:{color:colors_green_to_red, min:0 , max: 1000,type:'heart'}
    ,SD1:{color:colors_green_to_red, min:0 , max: 1500,type:'heart'}
    ,SD2:{color:colors_green_to_red, min:0 , max: 1500,type:'heart'}
    ,r_RR:{color:colors_green_to_red,min: -0.5, max: 0.5,type:'heart'}
    ,HRVindex128:{color:colors_green_to_red, min:0, max:50,type:'heart'}
    ,VLF:{color:colors_green_to_red, min:0, max:50000,type:'heart'}
    ,LF:{color:colors_green_to_red, min:0, max:50000,type:'heart'}
    ,HF:{color:colors_green_to_red, min:0, max:50000,type:'heart'}
    ,TotalPower:{color:colors_green_to_red, min:0, max:100000,type:'heart'}
    ,LFHFratio:{color:colors_green_to_red,min:0, max:1,type:'heart'}
    ,LFnu:{color:colors_green_to_red,min:0, max:1,type:'heart'}
    ,HFnu:{color:colors_green_to_red,min:0, max:1,type:'heart'}
    ,FFT_VLF:{color:colors_green_to_red, min:0, max:50000,type:'heart'}
    ,FFT_LF:{color:colors_green_to_red, min:0, max:50000,type:'heart'}
    ,FFT_HF:{color:colors_green_to_red, min:0, max:50000,type:'heart'}
    ,FFT_TotalPower:{color:colors_green_to_red, min:0, max:100000,type:'heart'}
    ,FFT_LFHFratio:{color:colors_green_to_red,min:0, max:1,type:'heart'}
    ,FFT_LFnu:{color:colors_green_to_red,min:0, max:1,type:'heart'}
    ,FFT_HFnu:{color:colors_green_to_red,min:0, max:1,type:'heart'}
    ,failed:{color:colors_green_to_red,min:0, max:1,type:'heart'}
    ,mean_position:{color:colors_body_positions,min:-3.14,max:3.14,type:'mov'}};

function calculateDefaultNumeralMapping(){
    var i = 0;
    for(var key in config_features){
        config_features[key]['numMap'] = i;
        i = i + 1;
    }
}
calculateDefaultNumeralMapping();


var cellSize=5;


var verDetail;
var horDetail;

var margin = {top: 0, right: 10, bottom: 10, left: 50},
    width = document.body.clientWidth*0.7 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;


