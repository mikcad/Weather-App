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