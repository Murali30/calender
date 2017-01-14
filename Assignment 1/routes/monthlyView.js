const express = require('express');
const router = express.Router();
const data = require("../data");
const monthData = data.month;
const moment = require("moment");
var curDate = new Date();
var xss = require('xss');

router.get("/:id", (req, res) => {
    if(req.params.id === 'prev')
    {
        curDate.setDate(1);
        curDate.setMonth(curDate.getMonth()-1);
    }
    if(req.params.id === 'next')
    {
        curDate.setDate(1);
        curDate.setMonth(curDate.getMonth()+1);
    }
    //console.log(curDate);
    var date = curDate;
    monthData.getMonthEvents(date.getMonth()+1,date.getFullYear()).then((eventList) => {
        //console.log("Length of the list for current month event");
        //console.log(eventList.length);

        var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
        var dayNames = ["Sun","Mon","Tue","Wed","Thur","Fri","Sat"];
        var monthShortNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
        var month = monthNames[date.getMonth()];
        var monthShortName = monthShortNames[date.getMonth()];
        var year = date.getFullYear();
        //console.log("month and year are " + month + " "+ year);

        var startingDay =  new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        //console.log("Staring day of the month is "+startingDay );

        var noOfDays = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
        var noOfDaysPreviousMonth = null;
        if(date.getMonth() === 0) 
         noOfDaysPreviousMonth = 31;
        else
        noOfDaysPreviousMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

        var noOfDaysNextMonth = 42 - (noOfDays+startingDay);

        //console.log(noOfDays + " is the number of days of the current month" + noOfDaysPreviousMonth + " no of days in the previous month" + noOfDaysNextMonth + " no of days in the next month");
        
        var currentMonth = [];
        var previousMonth = [];
        var nextMonth = [];

        var dayObjPrev = new Array(startingDay); //for the previous month and next month
        var dayObjNext = new Array(noOfDaysNextMonth);
        var currentEventObj = new Array(noOfDays); // for the current month

        
       if(startingDay > 0)
       {
            for(var i=0;i<startingDay;i++)
            {
                dayObjPrev[i] = {day:noOfDaysPreviousMonth - (startingDay-1-i)};
                previousMonth.push(dayObjPrev[i]);
            }
       }
       
       //console.log(previousMonth.length + " previous month length")
       for(var i=1;i<=noOfDays;i++)
       {
           var value = dayNames[new Date(date.getFullYear(), date.getMonth(), i).getDay()];
           currentEventObj[i-1] = {
               day:i,
               month:monthShortName,
               year:year,
               dayVal:value,
               events:eventList.filter((x)=>{
                if(x!= undefined){
               if(x.day === i)
               return x.events;
               }
           }).shift()
           };

           //console.log(currentEventObj[i-1]);
           currentMonth.push(currentEventObj[i-1]);
       }
       
       //console.log("current month length "+ currentMonth.length);
       for(var i=1;i<=noOfDaysNextMonth;i++)
       {
           dayObjNext[i-1] = {day:i};
           nextMonth.push(dayObjNext[i-1]);
       }
       var eventsAvailable = false;
       if(currentMonth.events)
       eventsAvailable = true;
        res.render("calender/monthly", {dateValue:new Date(),currentMonth:month,currentYear:year,prevMonth:previousMonth,currMonth:currentMonth,nextMonth:nextMonth,eventsAvailable:eventsAvailable});
    }).catch((e) => {
        //console.log(e);
        res.status(404).json({ error: "Calender file is not readable. Please contact mbabu@stevens.edu" });
    });
});

router.post("/addevent",(req,res)=>{
    //console.log("The date value passed "+ req.body.dateValue);
    //console.log("The check value passed "+ req.body.checkValue);
    var dateVal = new Date(req.body.dateValue);
    var monthCheck = true;
    if(req.body.checkValue === 'Y')
        monthCheck = true;
    else
        monthCheck = false;

    res.render("calender/addevent", {dateToAdd:req.body.dateValue, day:dateVal.getDate(), month:dateVal.getMonth()+1, year:dateVal.getFullYear(), monthCheck:monthCheck});
});

router.post("/insertEvent",(req,res)=>{

    var insertData = req.body;
    return monthData.insertEvent(insertData).then((newlyAddedEvent)=>{
            //console.log(newlyAddedEvent);
            res.json({success:true,message:"Event Created successfully!!",addedEvent:newlyAddedEvent});
           //var dateVal = new Date(insertData.date);
           //var dateDisplay = (dateVal.getMonth()+1) +"/"+ dateVal.getDate()+"/"+ dateVal.getFullYear();
           //res.render("calender/viewevent", {title:insertData.title, location:insertData.title, description:insertData.description, dateDisplay:dateDisplay,dateValue:insertData.date});
    }).catch((e) => {
            res.json({error:true,message:e});
    });
});

router.get("/getEvent/:id",(req,res)=>{
    //console.log("Inside get event")
    var id = req.params.id;
    //console.log(id + " is the event id");
    monthData.getEvent(id).then((eventObj)=>{

        eventObj.forEach((obj)=>{
            if(obj)
            {
                var dateVal = new Date(obj.date);
                var dateDisplay = (dateVal.getMonth()+1)+"/"+dateVal.getDate()+"/"+dateVal.getFullYear();
                var event = {
                    "location":xss(obj.location),
                    "dateDisplay":xss(dateDisplay),
                    "description":xss(obj.description),
                    "title":xss(obj.title),
                    "date":xss(obj.date)
                }
                //console.log(event);

                res.render("calender/viewevent", {event:event});
            }
        });
        
        
        
    })
    
    
});

router.get("/", (req, res) => {
    var date = new Date();
    curDate = date;
    monthData.getMonthEvents(date.getMonth()+1,date.getFullYear()).then((eventList) => {
        //console.log("Length of the list for current month event");
        //console.log(eventList.length);

        var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
        var dayNames = ["Sun","Mon","Tue","Wed","Thur","Fri","Sat"];
        var monthShortNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
        var month = monthNames[date.getMonth()];
        var monthShortName = monthShortNames[date.getMonth()];
        var year = date.getFullYear();
        //console.log("month and year are " + month + " "+ year);

        var startingDay =  new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        //console.log("Staring day of the month is "+startingDay );

        var noOfDays = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
        var noOfDaysPreviousMonth = null;
        if(date.getMonth() === 0) 
         noOfDaysPreviousMonth = 31;
        else
        noOfDaysPreviousMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

        var noOfDaysNextMonth = 42 - (noOfDays+startingDay);

        //console.log(noOfDays + " is the number of days of the current month" + noOfDaysPreviousMonth + " no of days in the previous month" + noOfDaysNextMonth + " no of days in the next month");
        
        var currentMonth = [];
        var previousMonth = [];
        var nextMonth = [];

        var dayObjPrev = new Array(startingDay); //for the previous month and next month
        var dayObjNext = new Array(noOfDaysNextMonth);
        var currentEventObj = new Array(noOfDays); // for the current month

        
       if(startingDay > 0)
       {
            for(var i=0;i<startingDay;i++)
            {
                dayObjPrev[i] = {day:noOfDaysPreviousMonth - (startingDay-1-i)};
                previousMonth.push(dayObjPrev[i]);
            }
       }
       
       for(var i=1;i<=noOfDays;i++)
       {
           var value = dayNames[new Date(date.getFullYear(), date.getMonth(), i).getDay()];
           currentEventObj[i-1] = {
               day:i,
               month:monthShortName,
               year:year,
               dayVal:value,
               events:eventList.filter((x)=>{
               if(x != undefined){
               if(x.day === i)
               return x.events;
               }
           }).shift()
           };

           //console.log(currentEventObj[i-1]);
           currentMonth.push(currentEventObj[i-1]);
       }
       
       for(var i=1;i<=noOfDaysNextMonth;i++)
       {
           dayObjNext[i-1] = {day:i};
           nextMonth.push(dayObjNext[i-1]);
       }
       var eventsAvailable = false;
       if(currentMonth.events)
       eventsAvailable = true;

        res.render("calender/monthly", {dateValue:date,currentMonth:month,currentYear:year,prevMonth:previousMonth,currMonth:currentMonth,nextMonth:nextMonth,eventsAvailable:eventsAvailable});
    }).catch((e) => {
        //console.log(e);
        res.status(404).json({ error: "Calender file is not readable. Please contact mbabu@stevens.edu" });
    });
});

module.exports = router;