(function ($,location,localStorage) {

//alert("First vetri");
var addEvent=$("#addEvent");
var title=$("#title");
var location=$("#location");
var description=$("#description");
var dateValue=$("#dateValue");
var createErrorContainer=$("#sp-error-container-down");
var createResultContainer=$("#sp-success-container-down");
var createErrorText = $("#sp-error-text-down");
var createSuccessText = $("#sp-success-text-down");


addEvent.click(function(event){
    //alert("Test");
	event.preventDefault();
    var titleVal = title.val();
    var locationVal = location.val();
    var descriptionVal = description.val();
    var dateVal = dateValue.val();

    //alert(dateVal);

    createErrorContainer.addClass("hidden");
    createResultContainer.addClass("hidden");
        

    try{
        if( titleVal.length=0 || titleVal=='' || titleVal==undefined){
            throw "Please provide a valid title for the event";
        }
        else if(locationVal.length=0 || locationVal=='' || locationVal==undefined){
            throw "Please provide a valid location for the event";
        }
        else if(descriptionVal.length=0 || descriptionVal=='' || descriptionVal==undefined){
            throw "Please provide a valid description for the event";
        }
        var requestConfig = {
                method: "POST",
                url: "/monthly/insertEvent",
                contentType: 'application/json',
                data: JSON.stringify({
                    title:titleVal,
                    location:locationVal,
                    description:descriptionVal,
                    date:dateVal
                })
            };

            $.ajax(requestConfig).then(function (responseMessage) {
            	if(responseMessage.error){
                    createResultContainer.addClass("hidden");
                  	createErrorText.text(responseMessage.message);
            		createErrorContainer.removeClass("hidden");
                 }else if(responseMessage.success){
                     window.location="http://localhost:3000/monthly/getEvent/"+responseMessage.addedEvent;
                 }
                
            });
    }
    catch(e){
        var message = typeof e === "string" ? e : e.message;
            createResultContainer.addClass("hidden");
            createErrorText.text(e);
            createErrorContainer.removeClass("hidden");
            event.preventDefault();
    }
});

/*var prevMonth = $("#prevMonth");
nextMonth.click(function(event){
    event.preventDefault();
    var requestConfig = {
                method: "GET",
                url: "/monthly/prev",
                contentType: 'application/json'
            };
    $.ajax(requestConfig).then(function (responseMessage) {
            if(responseMessage.error){
                alert("Error loading the previous month");
            }
        });

});

var nextMonth = $("#prevMonth");
nextMonth.click(function(event){

});*/
    
})(jQuery,window.location,window.localStorage);