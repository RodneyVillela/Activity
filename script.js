const API_KEY = "b59e54bbec0f493198956d9c477f9090";

async function getWeather() {
  const cityInput = document.getElementById("city").value.trim() || "New York";
  const weatherDiv = document.getElementById("weather");
  const forecastDiv = document.getElementById("forecast");

  weatherDiv.innerHTML = "<p>Loading weather data...</p>";
  forecastDiv.innerHTML = "";

  try {
    // Current Weather
    const res = await fetch(`https://api.weatherbit.io/v2.0/current?city=${encodeURIComponent(cityInput)}&key=${API_KEY}`);
    const data = await res.json();
    const w = data.data[0];

    weatherDiv.innerHTML = `
      <h2>${w.city_name}, ${w.country_code}</h2>
      <h1>${w.temp}°C</h1>
      <img src="https://cdn.weatherbit.io/static/img/icons/${w.weather.icon}.png" alt="${w.weather.description}">
      <p><strong>${w.weather.description}</strong></p>
      <p>Feels like: ${w.app_temp}°C | Humidity: ${w.rh}% | Wind: ${w.wind_spd} m/s</p>
    `;

  } catch (e) {
    weatherDiv.innerHTML = `<p style="color:#ff6b6b;">Error loading weather. Check API key or city name.</p>`;
  }
}

// Load default weather
window.onload = getWeather;
