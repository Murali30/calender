const express = require('express');
const router = express.Router();
const data = require("../data");
const dailyData = data.daily;
var curDate = new Date();

router.get("/:id", (req, res) => {

    var yesterday;
    var tomorrow;
    if(req.params.id === 'prev')
    {
        curDate.setDate(curDate.getDate()-1);
        yesterday = new Date(curDate);
        tomorrow = new Date(curDate);
    }
    else if(req.params.id === 'next')
    {
        curDate.setDate(curDate.getDate()+1);
        yesterday = new Date(curDate);
        tomorrow = new Date(curDate);
    }
    else
    {
        console.log("Inside spec view");
        console.log(req.params.id);
        console.log(req.params.dateVal);
        console.log(req.body.dateVal);
        var test = req.params.id;
        console.log(test);
        //console.log(test.getDate());
        var specDate = new Date(test);
        curDate.setDate(specDate.getDate());
        yesterday = new Date(curDate);
        tomorrow = new Date(curDate);
    }

    dailyData.getDailyEvents(curDate.getDate(),curDate.getMonth()+1,curDate.getFullYear()).then((eventObj)=>{

        console.log("Event object length "+eventObj.length);
        var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
        var namedMonth = monthNames[curDate.getMonth()];
        var dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        var namedDay = dayNames[curDate.getDay()];
        var start = new Date(curDate.getFullYear(), 0, 1);
        var diff = curDate - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var nthDay = Math.floor(diff / oneDay);
        var start1 = new Date(curDate.getFullYear(), 11, 31);
        var diff1 = start1 - curDate;
        var nthDayRemaining = Math.floor(diff1 / oneDay);

        console.log(nthDay + " is the nth day" + "nthDayRemaining is "+nthDayRemaining);
        var currentDay = {day:curDate.getDate(),
                    month:curDate.getMonth()+1,
                    namedDay:namedDay,
                    namedMonth:namedMonth,
                    year:curDate.getFullYear(),
                    nthDay:nthDay+1,
                    nthDayRemaining:nthDayRemaining+1,
                    events:eventObj.filter((x)=>{
                        if(x != undefined){
                            if(x.day === curDate.getDate())
                            return x.events;
                        }
                    }).shift()};

        var previousDay = new Array(2);
        previousDay = findYesterDays(previousDay,yesterday);

        var nextDay = new Array(2);
        nextDay = findNextDays(nextDay,tomorrow);    

        res.render("calender/daily",{today:currentDay,previousDays:previousDay,nextDays:nextDay,dateValue:curDate});
    });
    
});

router.get("/", (req, res) => {
    var todayDate = new Date();
    var yesterDate = new Date();
    var tomorroDate = new Date();
    curDate = todayDate;

    dailyData.getDailyEvents(todayDate.getDate(),todayDate.getMonth()+1,todayDate.getFullYear()).then((eventObj)=>{

        console.log("Event object length "+eventObj.length);
        var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
        var namedMonth = monthNames[todayDate.getMonth()];
        var dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        var namedDay = dayNames[todayDate.getDay()];
        var start = new Date(todayDate.getFullYear(), 0, 1);
        var diff = todayDate - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var nthDay = Math.floor(diff / oneDay);
        var start1 = new Date(todayDate.getFullYear(), 11, 31);
        var diff1 = start1 - todayDate;
        var nthDayRemaining = Math.floor(diff1 / oneDay);

        console.log(nthDay + " is the nth day" + "nthDayRemaining is "+nthDayRemaining);
        var currentDay = {day:todayDate.getDate(),
                    month:todayDate.getMonth()+1,
                    namedDay:namedDay,
                    namedMonth:namedMonth,
                    year:todayDate.getFullYear(),
                    nthDay:nthDay+1,
                    nthDayRemaining:nthDayRemaining+1,
                    events:eventObj.filter((x)=>{
                        if(x != undefined){
                            if(x.day === todayDate.getDate())
                            return x.events;
                        }
                    }).shift()};
        var previousDay = new Array(2);
            previousDay = findYesterDays(previousDay,yesterDate);
        var nextDay = new Array(2);
        nextDay = findNextDays(nextDay,tomorroDate);

   
        res.render("calender/daily",{today:currentDay,previousDays:previousDay,nextDays:nextDay,dateValue:todayDate});
    })
    
});

function findYesterDays(previousDay,todayDate){
    var yesterday = todayDate;
    yesterday.setDate(todayDate.getDate()-1);
    previousDay[1] = {
        day:yesterday.getDate(),
        month:yesterday.getMonth()+1
    };
    yesterday.setDate(yesterday.getDate()-1);
    previousDay[0] = {
        day:yesterday.getDate(),
        month:yesterday.getMonth()+1
    };

    return previousDay;
}

function findNextDays(nextDay,todayDate)
{
    var tomorrow = todayDate;
    console.log(todayDate);
    console.log("Tmorrow "+ tomorrow);
    tomorrow.setDate(todayDate.getDate()+1);
    nextDay[0] = {
        day:tomorrow.getDate(),
        month:tomorrow.getMonth()+1
    };
    tomorrow.setDate(tomorrow.getDate()+1);
    nextDay[1] = {
        day:tomorrow.getDate(),
        month:tomorrow.getMonth()+1
    };
    console.log("One more "+ tomorrow);
    return nextDay;
}
module.exports = router;