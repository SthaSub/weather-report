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

    function searchCity() {
        btnSubmit.click(function (event) {
            event.stopPropagation();
            var checkContain = false;
            cityName = inputCity.val();
            var forcastWeatherQueryURL;
            if (cityName != "") {
                forcastWeatherQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=metric&appid=" + apiKey;
                for (var i = 0; i < localStorage.length; i++) {
                    var value = localStorage.getItem(localStorage.key(i));
                    if (value.toUpperCase() == cityName.toUpperCase()) {
                        alert("Already present in history just click it to get info");
                        console.log("Already present");
                        checkContain = true;
                    }
                }
                if (!checkContain || localStorage.length === 0) {
                    inputCity.val("");
                    currentCity.text(cityName);
                    if (Object.keys(localStorage).length === 0) {
                        counter = 0;
                        localStorage.setItem(counter, cityName);
                    } else {
                        counter = Object.keys(localStorage).reduce(function (x, y) {
                            return Math.max(x, y);
                        });
                        counter++;
                        localStorage.setItem(counter, cityName);
                    }
                    getDataFromLocalStorage("searchClick", cityName);
                    forecastAndTodayWeather(forcastWeatherQueryURL);
                }
            } else
                alert("please enter city name to make search");
        });
    }

});