$(document).ready(function () {
    var apiKey = "5b275121d3a90f2d7804320448e02e52"; // API key
    var currentCity = $("#currentCity");
    var clickOnhistory = $("#historyCity");
    var cityName = "";
    var uvIndex;
    var celsiusSymbol = "\u00B0"; // degree centigrade symbol
    var counter; // counter for key of localstorage
    var longitude = 0;
    var latitude = 0;
    var row = $("<div>");
    var fiveDaysInfo = $("#fiveDaysInfo"); 
    var currentIcon = "http://openweathermap.org/img/wn/"; // url for getting icon of weather
    var todaysWeather = $("#currentWeather");
    var form = $("<form>");
    var inputCity = $("<input type=\"text\">"); 
    inputCity.attr("placeholder", "enter city name");
    var btnSubmit = $("<Button type=\"button\">");
    btnSubmit.append("<i class=\"fas fa-search\" title=\"click for search\"></i>");
    form.append(inputCity).append(btnSubmit);
    $(".container .row .col-sm").append(form); // appending from to container

    init();
    function init() {
        getDataFromLocalStorage();
        searchCity();
        historyClick();
    }

    function getDataFromLocalStorage(args, city) {
        if (args == "searchClick") {
            $("#historyCity").append($("<div class=\"row\"></div>").text(city));
        } else {
            for (var i = 0; i < localStorage.length; i++) {
                var value = localStorage.getItem(localStorage.key(i)); // gets localStorage value by key
                if (value != "") {
                    var historyRow = $("<div class=\"row\"></div>");
                    historyRow.text(value);
                    clickOnhistory.append(historyRow);
                }
            }
        }
    }
});