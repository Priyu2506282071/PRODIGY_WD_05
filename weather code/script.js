const apiKey = 'd2a2979413a271581df7c50a46b5f6da'; 
const apiBaseUrl = 'https://api.openweathermap.org/data/2.5/';

const locationInput = document.getElementById('location-input');
const searchButton = document.getElementById('search-button');
const locationName = document.getElementById('location-name');
const currentTime = document.getElementById('current-time');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const realFeel = document.getElementById('real-feel');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const rainChance = document.getElementById('rain-chance');
const uvIndex = document.getElementById('uv-index');
const forecastDaysContainer = document.querySelector('.forecast-days');

searchButton.addEventListener('click', getWeatherData);

function getWeatherData() {
    const location = locationInput.value;
    if (location) {
        const url = `${apiBaseUrl}weather?q=${location}&appid=${apiKey}&units=imperial`;
        fetch(url)
           .then(response => response.json())
           .then(data => {
                displayCurrentWeather(data);
            })
           .catch(error => console.error('Error fetching weather data:', error));
    }
}

function displayCurrentWeather(data) {
    
    locationName.textContent = data.name;
    currentTime.textContent = new Date().toLocaleString(); 
    weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">`;
    temperature.textContent = Math.round(data.main.temp);
    realFeel.textContent = `RealFeel: ${Math.round(data.main.feels_like)}`;
    humidity.textContent = data.main.humidity;
    windSpeed.textContent = data.wind.speed;
    rainChance.textContent = 'Undefined'; 
    uvIndex.textContent = 'Undefined'; 

    
    getForecastData(data.coord.lat, data.coord.lon);
}

function getForecastData(lat, lon) {
    const url = `${apiBaseUrl}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    fetch(url)
       .then(response => response.json())
       .then(data => {
            displayForecast(data);
        })
       .catch(error => console.error('Error fetching forecast data:', error));
}

function displayForecast(data) {
    forecastDaysContainer.innerHTML = ''; 

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const forecastList = data.list; 

   
    let dailyForecasts = {};
    for (let i = 0; i < forecastList.length; i++) {
        const dayIndex = new Date(forecastList[i].dt * 1000).getDay(); 
        const day = days[dayIndex];

        if (!dailyForecasts[day]) {
            dailyForecasts[day] = forecastList[i]; 
        }
    }


    for (const day in dailyForecasts) {
        const forecast = dailyForecasts[day];
        const dayElement = document.createElement('div');
        dayElement.classList.add('forecast-day');
        dayElement.innerHTML = `
            <h3>${day}</h3>
            <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="Weather Icon">
            <p>Temp: ${Math.round(forecast.main.temp)}°</p>
            <p>RealFeel: ${Math.round(forecast.main.feels_like)}°</p>
        `;
        forecastDaysContainer.appendChild(dayElement);
    }
}
 



