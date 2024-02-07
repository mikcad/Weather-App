// personal api key
const APIKey = "e5f32316bcf0946a567922d7f5383e9a";

// Function to create the weather URL
const createWeatherURL = (city) => {
   return `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`;
}

// Function to create the forecast URL
const createForecastURL = (lat, lon) => {
   return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`;
}

// Function to fetch data from a given URL
const fetchData = async (url) => {
   try {
      const response = await fetch(url);
      if (!response.ok) {
         throw new Error('Network response was not ok');
      }
      return await response.json();
   } catch (error) {
      console.error('Error fetching data:', error);
   }
}

// Function to fetch weather data
const fetchWeatherData = (city) => {
   const weatherURL = createWeatherURL(city);
   return fetchData(weatherURL);
}

// Function to fetch forecast data
const fetchForecastData = (lat, lon) => {
   const forecastURL = createForecastURL(lat, lon);
   return fetchData(forecastURL);
}

// on click event for the search button being clicked
$(".search-btn").on("click", (e) =>{
   e.preventDefault();
   const city = $("#search_input").val();
   searchCity(city);
});

// Function to search for the city
const searchCity = (city) => {

   // maintain search history for 7 recent searches

   if (city) {
      history = Array.from(new Set([city, ...history])).slice(0, 7);
   }

   localStorage.setItem('searchHistory', JSON.stringify(history));

   renderHistory();

   fetchWeatherData(city)
   .then(weatherData => {

      const cityName = weatherData.name;
      const temperature = weatherData.main.temp;
      const windSpeed = weatherData.wind.speed;
      const humidity = weatherData.main.humidity;
      const weatherIcon = weatherData.weather[0].icon;
      const weatherIconURL = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
      const weatherDescription = weatherData.weather[0].description;
      const date = new Date(weatherData.dt * 1000);
      const formattedDate = dayjs(date).format('DD/MM/YYYY')

      const cityCodeBlock = 
      `
      <div class="p-3">
      <h3 class="border-bottom border-dark border-2">${cityName} - ${formattedDate}</h3>
      <h4>Temperature: ${temperature}</h4>
      <h4>Wind Speed: ${windSpeed}</h4>
      <h4>Humidity: ${humidity}</h4>
      </div>
      <div class="p-3">
      <h4>${weatherDescription}</h4>
      <img src="${weatherIconURL} " alt="weather-icon" title="${weatherDescription}"></img>
      </div>
      `;

      $(".current-weather").html(cityCodeBlock);

      console.log("Weather Data:", weatherData);
      const lat = weatherData.coord.lat;
      const lon = weatherData.coord.lon;
      return fetchForecastData(lat, lon);
      
   })
   .then(forecastData => {

      $(".weather-forecast").html("");
      $("#five-day").html("5-Day Forecast");
      // loops to display a 5 day forecast
      for (let i = 7; i < 40; i+=8) {

      // initialising variables to the correct data values based on the current index of the loop
      const forecastDate = dayjs(forecastData.list[i].dt_txt);
      const formattedDate = forecastDate.format(`ddd, MMM YY`);
      const temperature = forecastData.list[i].main.temp;
      const windSpeed = forecastData.list[i].wind.speed;
      const humidity = forecastData.list[i].main.humidity;
      const weatherIcon = forecastData.list[i].weather[0].icon;
      const weatherIconURL = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
      const weatherDescription = forecastData.list[i].weather[0].description;

         //constructing a block of code with template literals to make it easier to add it to the HTML elements
         const forecastCodeBlock = 
         `<div class="card-body bg-info-subtle border border-primary p-2" style="min-width: 250px;">
         <h4 class="card-header">${formattedDate}</h4>
         <img src="${weatherIconURL} " alt="weather-icon" title="${weatherDescription}""></img>
         <h4>Temperature: ${temperature}</h4>
         <h4>Wind Speed: ${windSpeed}</h4>
         <h4>Humidity: ${humidity}</h4>
         <h4>${weatherDescription}</h4>
         </div>`;

         $(".weather-forecast").append(forecastCodeBlock);
      }

      console.log("Forecast Data:", forecastData);
   });
}

const renderHistory = () => {
   historyEl.empty();

   history.forEach((term) => {
      const button = $('<button>')
         .text(term)
         .addClass('btn btn-secondary me-2');
      button.on('click', () => searchCity(term));
      historyEl.append(button);
   });
};

// Function to clear search history
const clearBtn = () => {
   localStorage.clear();
   history = [];
   renderHistory();
}

renderHistory();

$("#clear-history").on("click", clearBtn);