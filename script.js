const API_KEY = "b59e54bbec0f493198956d9c477f9090";

async function getWeather() {
  const cityInput = document.getElementById("city").value.trim();
  const weatherDiv = document.getElementById("weather");
  const forecastDiv = document.getElementById("forecast");
  if (!cityInput) return;
  weatherDiv.innerHTML = `
Loading weather for ${cityInput}...
`;
  forecastDiv.innerHTML = "";
  try {
    // Current Weather
    const currentRes = await fetch(`https://api.weatherbit.io/v2.0/current?city=${encodeURIComponent(cityInput)}&key=${API_KEY}`);
    const currentData = await currentRes.json();
    const w = currentData.data[0];
    weatherDiv.innerHTML = `
      
${w.city_name}, ${w.country_code}
      ${Math.round(w.temp)}°C
      
      
${w.weather.description}

      
Feels like: ${Math.round(w.app_temp)}°C | Humidity: ${w.rh}% | Wind: ${w.wind_spd} m/s

    `;
    // Optional: Add 5-day forecast here later
  } catch (error) {
    weatherDiv.innerHTML = `
⚠️ Could not load weather.
Please check city name or API key.
`;
  }
}
// Allow pressing Enter key to search
document.getElementById("city").addEventListener("keypress", function(e) {
  if (e.key === "Enter") getWeather();
});
// Load default weather when page opens
window.onload = getWeather;
