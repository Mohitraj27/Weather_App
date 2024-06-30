var weatherApi = "/weather";
const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const weatherIcon = document.querySelector('.weatherIcon i');
const weatherCondition = document.querySelector('.weatherCondition');
const tempElement = document.querySelector('.temperature span');
const locationElement = document.querySelector(".place");
const dateElement = document.querySelector(".date");
const currentDate = new Date();
const options = { month: "long" , day:"numeric", year: "numeric" };
const fullDate = currentDate.toLocaleDateString("en-US", options);
dateElement.textContent = fullDate;
if("geolocation" in navigator){
    locationElement.textContent = "Loading...";
    navigator.geolocation.getCurrentPosition(
        function (position){
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
            fetch(apiUrl)
            .then((response)=>response.json())
            .then((data)=>{
                    if(data && data.address){
                    const city = data.address.city || data.address.town
                     || data.address.village || data.address.hamlet || data.address.country 
                     || data.address.state                  
                showData(city);
                }else{
                  locationElement.textContent = "Current Location Not Found!"
                }
            }).catch((error)=>{
                locationElement.textContent = "Error fetching location!";
                throw new Error("Error fetching location: " + error.message);
            })
        },
        function (error){
            locationElement.textContent = "Geolocation error!";
            throw new Error("Geolocation error: " + error.message);
        }
    );
} else{
    throw new Error("Geolocation is not available on this browser!");
}

weatherForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    locationElement.textContent  = "Loading...";
    weatherIcon.className = "";
    tempElement.textContent = "";
    weatherCondition.textContent = "";
    showData(search.value);
});

function showData(city){
    getWeatherData(city, (result)=>{
        if(result.cod == 200){
        const weatherDescription = result.weather[0].description.toLowerCase();
        let iconClass = "";
        // Map weather descriptions to Weather Icons classes
            const weatherIconMap = {
                "clear sky": "wi wi-day-sunny",
                "few clouds": "wi wi-day-cloudy",
                "scattered clouds": "wi wi-cloud",
                "broken clouds": "wi wi-cloudy",
                "shower rain": "wi wi-showers",
                "rain": "wi wi-rain",
                "thunderstorm": "wi wi-thunderstorm",
                "snow": "wi wi-snow",
                "mist": "wi wi-fog",
                "smoke": "wi wi-smoke",
                "haze": "wi wi-day-haze",
                "dust": "wi wi-dust",
                "fog": "wi wi-fog",
                "sand": "wi wi-sandstorm",
                "ash": "wi wi-volcano",
                "squall": "wi wi-strong-wind",
                "tornado": "wi wi-tornado",
                "drizzle": "wi wi-sprinkle",
                "light rain": "wi wi-rain",
                "moderate rain": "wi wi-rain",
                "heavy intensity rain": "wi wi-rain",
                "very heavy rain": "wi wi-rain",
                "extreme rain": "wi wi-rain",
                "freezing rain": "wi wi-rain-mix",
                "light snow": "wi wi-snow",
                "heavy snow": "wi wi-snow",
                "sleet": "wi wi-sleet",
                "light shower sleet": "wi wi-sleet",
                "shower sleet": "wi wi-sleet",
                "light rain and snow": "wi wi-rain-mix",
                "rain and snow": "wi wi-rain-mix",
                "light shower snow": "wi wi-snow",
                "shower snow": "wi wi-snow",
                "heavy shower snow": "wi wi-snow"
            };

        // Find the matching icon class or set a default
        iconClass = weatherIconMap[weatherDescription] || "wi wi-day-cloudy";
        weatherIcon.className = iconClass;
        locationElement.textContent = result?.name;
        const tempKelvin = result?.main?.temp;
        const tempCelsius = tempKelvin - 273.15;
        const tempFahrenheit = (tempCelsius * 9/5) + 32;
        tempElement.innerHTML = `${tempCelsius.toFixed(2)}&deg;C / ${tempFahrenheit.toFixed(2)}&deg;F`;
        weatherCondition.textContent = result?.weather[0]?.description?.toUpperCase();
    } else{
        locationElement.textContent = "City Not Found";
       }
    })
}

function getWeatherData(city, callback){
    const  locationApi = weatherApi + "?address=" + city;
    fetch(locationApi).then((response)=>{
        response.json().then((response)=>{
            callback(response);
        })
    })
}