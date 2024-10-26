import API_KEY from './config.js';

const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const toggleTempButton = document.querySelector('.toggle-temp');
let isCelsius = true;
let currentTempCelsius;

function fetchWeather(url) {
    fetch(url)
        .then(response => response.json())
        .then(json => {
            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            if (json.weather && json.weather[0]) {
                switch (json.weather[0].main) {
                    case 'Clear':
                        image.src = 'images/clear.png';
                        break;
                    case 'Rain':
                        image.src = 'images/rain.png';
                        break;
                    case 'Snow':
                        image.src = 'images/snow.png';
                        break;
                    case 'Clouds':
                        image.src = 'images/cloud.png';
                        break;
                    case 'Haze':
                        image.src = 'images/mist.png';
                        break;
                    default:
                        image.src = '';
                }

                currentTempCelsius = json.main.temp;
                temperature.innerHTML = `${parseInt(currentTempCelsius)}<span>°C</span>`;
                description.innerHTML = `${json.weather[0].description}`;
                humidity.innerHTML = `${json.main.humidity}%`;
                wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

                weatherBox.style.display = '';
                weatherDetails.style.display = '';
                weatherBox.classList.add('fadeIn');
                weatherDetails.classList.add('fadeIn');
                container.style.height = '650px';
            } else {
                console.error('Error: Weather data is unavailable.');
                error404.style.display = 'block';
                error404.innerHTML = `<p>Weather data unavailable.</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching weather:', error);
            error404.style.display = 'block';
            error404.innerHTML = `<p>Could not retrieve data. Please check your connection.</p>`;
        });
}

search.addEventListener('click', () => {
    const city = document.querySelector('.search-box input').value || 'London';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    fetchWeather(url);
});

function toggleTemperature() {
    const temperatureElement = document.querySelector('.weather-box .temperature');
    const currentTemp = parseFloat(temperatureElement.textContent);

    if (isCelsius) {
        const fahrenheit = (currentTempCelsius * 9 / 5) + 32;
        temperatureElement.innerHTML = `${Math.round(fahrenheit)}<span>°F</span>`;
    } else {
        temperatureElement.innerHTML = `${Math.round(currentTempCelsius)}<span>°C</span>`;
    }

    isCelsius = !isCelsius;
}

toggleTempButton.addEventListener('click', toggleTemperature);
