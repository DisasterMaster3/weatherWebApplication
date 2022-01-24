const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();


require("dotenv").config();

const apiKey = `${process.env.API_KEY}`;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("index", { weather: null, error: null });
});

// get which city the user wants weather data for
app.post("/", function (req, res) {

    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {

        // check if had a problem in getting the data
        if (err) {
            res.render('index', { weather: null, error: 'Error, try again' });
        } else {
            let weather = JSON.parse(body);

            console.log(weather);

            // see if the data we're getting is undefined
            if (weather.main == undefined) {
                res.render('index', { weather: null, error: 'Error, its probably the API key' });
            } else {
                let place = `${weather.name}, ${weather.sys.country}`,

                    weatherTimezone = `${new Date(
                        weather.dt * 1000 - weather.timezone * 1000)}`;
                
                // start assigning variables
                let weatherTemp = `${weather.main.temp}`,
                    feelsLike = `${weather.main.feels_like}`
                    weatherPressure = `${weather.main.pressure}`,
                    weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                    weatherDescription = `${weather.weather[0].description}`,
                    humidity = `${weather.main.humidity}`,
                    clouds = `${weather.clouds.all}`,
                    visibility = `${weather.visibility}`,
                    main = `${weather.weather[0].main}`,
                    windSpeed = `${weather.wind.speed}`,
                    windDirection = `${weather.wind.deg}`,
                    sunRise = `${weather.sys.sunrise}`,
                    sunSet = `${weather.sys.sunset}`,
                    low = `${weather.main.temp_min}`,
                    high = `${weather.main.temp_max}`,
                    weatherFahrenheit = (weatherTemp * 9) / 5 + 32;
                    feelsLikeConvert = (feelsLike * 9) / 5 + 32;
                    low = (low * 9) / 5 + 32;
                    high = (high * 9) / 5 + 32;

                function roundIt(num) {
                    return (Math.round(num));
                }

                function conToMiles(num) {
                    return num / 1600;
                }

                function getDir(deg) {
                    if (deg >= 30 && deg <= 60)
                    {
                        return "SW";
                    }
                    if (deg >= 61 && deg <= 120)
                    {
                        return "W";
                    }
                    if (deg >= 121 && deg <= 150)
                    {
                        return "NW";
                    }
                    if (deg >= 151 && deg <= 210)
                    {
                        return "E";
                    }
                    if (deg >= 211 && deg <= 240)
                    {
                        return "NE";
                    }
                    if (deg >= 241 && deg <= 300)
                    {
                        return "E";
                    }
                    if (deg >= 301 && deg <= 330)
                    {
                        return "SE";
                    }
                    else{
                        return "S";
                    }
                }

                function getTime(time)
                {
                    var date = new Date(time * 1000);
                    // Hours part from the timestamp
                    var hours = date.getHours();
                    if (hours > 12)
                    {
                        hours -= 12;
                    }
                    // Minutes part from the timestamp
                    var minutes = "0" + date.getMinutes();

                    return hours +":" + minutes.substr(-2);
                }
                // Converting attributes to understandable units and formats
                weatherFahrenheit = roundIt(weatherFahrenheit);
                low = roundIt(low);
                high = roundIt(high);
                visibility = conToMiles(visibility);
                feelsLikeConvert = roundIt(feelsLikeConvert);
                visibility = roundIt(visibility);
                windDir = getDir(windDirection);
                windSpeed = roundIt(windSpeed * 3.28);
                sunRise = getTime(sunRise);
                sunSet = getTime(sunSet);

                
                // readys to send to front-end
                res.render("index", {
                    weather: weather,
                    place: place,
                    temp: weatherTemp,
                    feelsLike: feelsLikeConvert,
                    pressure: weatherPressure,
                    icon: weatherIcon,
                    description: weatherDescription,
                    timezone: weatherTimezone,
                    humidity: humidity,
                    fahrenheit: weatherFahrenheit,
                    clouds: clouds,
                    visibility: visibility,
                    windSpeed: windSpeed,
                    windDir: windDir,
                    main: main,
                    sunrise: sunRise,
                    sunset: sunSet,
                    lowTemp: low,
                    highTemp: high,
                    error: null,
                });
            }
        }
    });
});

app.listen(5000, function () {
    console.log("Weather app listening on port 5000!");
});