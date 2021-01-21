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

    init();// programs starts from here
    function init() {
        getInitialDisplayFromStorage();
        getDataFromLocalStorage();
        searchCity();
        historyClick();
    }

    /**
     * persist the information of weather of key zero on page on reload.
     */
    function getInitialDisplayFromStorage(){
        var intialvalue = localStorage.getItem(localStorage.key(0));
        currentCity.text(intialvalue);
        var urlIntial = "https://api.openweathermap.org/data/2.5/forecast?q=" + intialvalue + "&units=metric&appid=" + apiKey;
        forecastAndTodayWeather(urlIntial);
    }

    /**
     * gets the data from localstorage 
     */
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

    /**
     * search weather by city name
     */
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
                    if (value.toUpperCase() == cityName.toUpperCase()) {  // prevents storing duplicates
                        alert("Already present in history just click it to get info");
                        console.log("Already present");
                        checkContain = true;
                    }
                }
                if (!checkContain || localStorage.length === 0) {
                    inputCity.val("");
                    currentCity.text(cityName);
                    if (Object.keys(localStorage).length === 0) { //gets the length of localstorage
                        counter = 0;
                        localStorage.setItem(counter, cityName);
                    } else {
                        counter = Object.keys(localStorage).reduce(function (x, y) {
                            return Math.max(x, y); // gets the high value from array
                        });
                        counter++;
                        localStorage.setItem(counter, cityName); //sets the key and value
                    }
                    getDataFromLocalStorage("searchClick", cityName);
                    forecastAndTodayWeather(forcastWeatherQueryURL);
                }
            } else
                alert("please enter city name to make search");
        });
    }

    /**
     * responses the click event of history 
     */
    function historyClick() {
        clickOnhistory.on("click", "div.row", function (event) {
            var getVal = $(event.target).text();
            currentCity.text(getVal);
            var historyQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + getVal + "&units=metric&appid=" + apiKey;
            forecastAndTodayWeather(historyQueryURL);
        });
    }

    /**
     * 
     * calling api to get uv index by latitude and longitude by name of city 
     */
    function forecastAndTodayWeather(QueryURL) {
        $.ajax(
            {
                url: QueryURL, method: "GET"
            }).then(function (response) {
                longitude = response.city.coord.lon;
                latitude = response.city.coord.lat;
                var weatherArray = response.list.filter(function (args) {
                    return args.dt_txt.split(" ")[1] == "12:00:00"; //filtering the 12 pm weather data
                });
                $.ajax(
                    {
                        url: "http://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey, method: "GET"
                    }).then(function (res) {
                        uvIndex = res.value;
                        todaysWeather.html(""); //clearing today's weather page for next information to be displayed
                        displayWeather(weatherArray[0], "today");
                    });
                row.html(""); //clearing 5 days row page for next information to be displayed
                for (var key in weatherArray) {
                    displayWeather(weatherArray[key], "fiveDays");
                }
            });
    }

    /**
     * displays Weather in row column containing date, temp, humidity, wind, uv index and weather icon 
     */
    function displayWeather(response, option) {
        var iconDiv = $("<div>");
        var colDiv = $("<div>");
        colDiv.addClass("col-xs-2");
        var imga = $("<img id=\"weIcon\">");
        var dat = new Date(response.dt * 1000); // convert the date into readable format
        var fullDate = $("<div>");
        fullDate.append($("<strong>").append("(" + dat.getUTCDate() + "/" + (dat.getMonth() + 1) + "/" + dat.getFullYear() + ")"));
        var iconURL = currentIcon + response.weather[0].icon + ".png";
        imga.attr("src", iconURL);
        iconDiv.append(imga);
        colDiv.append(fullDate)
            .append(iconDiv)
            .append("<div>" + "<strong>Temperature: </strong>" + response.main.temp + celsiusSymbol + "C </div>")
            .append("<div>" + "<strong> Humidity: </strong>" + response.main.humidity + "% </div>")
            .append("<div>" + "<strong> Wind Speed: </strong>" + response.wind.speed + "MPH </div>");
        if (option == "fiveDays") {
            row.attr("id", "fiveDays");
            row.addClass("row");
            row.append(colDiv);
            fiveDaysInfo.append(row);
        } else {
            var todayRow = $("<div class=\"row\" id=\"todayWeather\"><strong>Today's Weather: <strong></div>"); //creating new row for today weather id tag
            colDiv.append("<div id=\"uvIndex\">" + "<strong>UV index: </strong>" + "<p id=\"uv\">" + uvIndex + "</p>" + "</div>");
            todayRow.append(colDiv);
            todaysWeather.append(todayRow);
        }
    }

});