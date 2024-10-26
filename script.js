const apiKey = '0cd8e403b97bca94df2846b312b8e4e4';

function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (city === "") {
    alert("Please enter a city name");
    return;
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      if (data.cod === 200) {
        displayWeather(data);
        storeRecentCity(city);
        fetchForecast(forecastUrl); // Fetch 5-day forecast data
      } else {
        alert(data.message);
      }
    })
    .catch(error => handleError(error));
}

function displayWeather(data) {
  const { main, description } = data.weather[0];
  let weatherIcon = "";

  // Choose icon based on weather condition
  if (main === "Clear") weatherIcon = `<i class="fas fa-sun text-yellow-500 text-6xl mb-4"></i>`;
  else if (main === "Clouds") weatherIcon = `<i class="fas fa-cloud text-gray-500 text-6xl mb-4"></i>`;
  else if (main === "Rain") weatherIcon = `<i class="fas fa-cloud-showers-heavy text-blue-400 text-6xl mb-4"></i>`;
  else if (main === "Snow") weatherIcon = `<i class="fas fa-snowflake text-blue-300 text-6xl mb-4"></i>`;
  else if (main === "Thunderstorm") weatherIcon = `<i class="fas fa-bolt text-yellow-500 text-6xl mb-4"></i>`;
  else weatherIcon = `<i class="fas fa-cloud text-gray-400 text-6xl mb-4"></i>`;  // Default icon

  const weatherInfo = `
    ${weatherIcon}
    <h2 class="text-2xl font-bold text-center mb-2">${data.name}, ${data.sys.country}</h2>
    <p class="text-center text-lg mt-2">Temperature: ${data.main.temp}°C</p>
    <p class="text-center text-lg">Humidity: ${data.main.humidity}%</p>
    <p class="text-center text-lg">Wind Speed: ${data.wind.speed} m/s</p>
    <p class="text-center text-lg font-medium text-gray-600 mt-4">${description.charAt(0).toUpperCase() + description.slice(1)}</p>
  `;
  
  document.getElementById("weatherInfo").innerHTML = weatherInfo;
}

// Fetch and display 5-day forecast data
function fetchForecast(forecastUrl) {
  fetch(forecastUrl)
    .then(response => {
      if (!response.ok) throw new Error('Error fetching forecast data');
      return response.json();
    })
    .then(data => displayForecast(data))
    .catch(error => handleError(error));
}
function getWeatherByLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
        fetch(apiUrl)
          .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
          })
          .then(data => {
            displayWeather(data);
            fetchForecast(forecastUrl); // Fetch 5-day forecast data
          })
          .catch(error => handleError(error));
      }, error => {
        alert("Unable to retrieve your location.");
        console.error("Geolocation error:", error);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  
function displayForecast(data) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = ""; // Clear previous forecasts

  // Display forecast data for each day
  data.list.filter((_, index) => index % 8 === 0).forEach(dayData => {
    const date = new Date(dayData.dt * 1000).toDateString();
    const temp = dayData.main.temp;
    const wind = dayData.wind.speed;
    const humidity = dayData.main.humidity;
    const weather = dayData.weather[0].main;
    const description = dayData.weather[0].description;

    let weatherIcon = "";
    if (weather === "Clear") weatherIcon = `<i class="fas fa-sun text-yellow-500 text-3xl"></i>`;
    else if (weather === "Clouds") weatherIcon = `<i class="fas fa-cloud text-gray-500 text-3xl"></i>`;
    else if (weather === "Rain") weatherIcon = `<i class="fas fa-cloud-showers-heavy text-blue-400 text-3xl"></i>`;
    else if (weather === "Snow") weatherIcon = `<i class="fas fa-snowflake text-blue-300 text-3xl"></i>`;
    else if (weather === "Thunderstorm") weatherIcon = `<i class="fas fa-bolt text-yellow-500 text-3xl"></i>`;
    else weatherIcon = `<i class="fas fa-cloud text-gray-400 text-3xl"></i>`;

    const dayForecast = `
      <div class="flex items-center justify-between bg-white shadow rounded-lg p-4 mb-4">
        <div class="text-gray-600">
          <p class="font-bold">${date}</p>
          <p class="capitalize">${description}</p>
        </div>
        <div>${weatherIcon}</div>
        <div class="text-right">
          <p>${temp}°C</p>
          <p>Wind: ${wind} m/s</p>
          <p>Humidity: ${humidity}%</p>
        </div>
      </div>
    `;

    forecastContainer.insertAdjacentHTML("beforeend", dayForecast);
  });
}

// Handle errors gracefully
function handleError(error) {
  console.error("Error:", error);
  alert("An error occurred. Please try again.");
}

// Store the recently searched city in localStorage
function storeRecentCity(city) {
  let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
  if (!recentCities.includes(city)) {
    recentCities.push(city);
    localStorage.setItem("recentCities", JSON.stringify(recentCities));
  }
  updateRecentCitiesDropdown();
}

// Update dropdown with recently searched cities
function updateRecentCitiesDropdown() {
  let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
  const dropdown = document.getElementById("recentCities");

  if (recentCities.length > 0) {
    dropdown.classList.remove("hidden");
    dropdown.innerHTML = `<option value="">Recently Searched Cities</option>`;
    recentCities.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      dropdown.appendChild(option);
    });
  }
}

// Get weather from dropdown selection
function getWeatherFromDropdown() {
  const selectedCity = document.getElementById("recentCities").value;
  if (selectedCity) {
    document.getElementById("cityInput").value = selectedCity;
    getWeather();
  }
}

// Load recent cities from localStorage on page load
window.onload = function () {
  updateRecentCitiesDropdown();
};
