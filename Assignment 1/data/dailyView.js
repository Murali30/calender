"use strict";
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));
const monthData = require("./monthlyView");

let exportedMethods = {
    getDailyEvents(day,month,year){
        return monthData.getCurrentEvents().then((eventFile)=>{
            var eventObj = JSON.parse(eventFile);

            var dailyEventObj = eventObj.map((x)=>{
                if(x.day === day)
                if(x.month === month)
                    if(x.year === year)
                        {
                            //console.log("All check done");
                            return x;
                        }
                            
                });

                //console.log(dailyEventObj);
            return Promise.resolve(dailyEventObj);
        })
    }
}

module.exports = exportedMethods;