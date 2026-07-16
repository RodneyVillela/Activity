const API_KEY = "b59e54bbec0f493198956d9c477f9090";

// Determine weather condition for background theming
function getWeatherCondition(iconCode, weatherCode) {
  if (!iconCode) return 'default-bg';
  
  const code = parseInt(weatherCode) || 0;
  const icon = iconCode.toLowerCase();
  
  // Thunderstorm
  if (icon.includes('t') || (code >= 200 && code < 300)) {
    return 'thunderstorm';
  }
  // Rainy / Drizzle
  if (icon.includes('r') || icon.includes('d') || (code >= 300 && code < 600)) {
    return 'rainy';
  }
  // Snowy
  if (icon.includes('s') || (code >= 600 && code < 700)) {
    return 'snowy';
  }
  // Cloudy
  if (icon.includes('c') || (code >= 800 && code < 900)) {
    // Check if night (icon ends with 'n')
    if (icon.endsWith('n')) {
      return 'night';
    }
    return 'cloudy';
  }
  // Clear / Sunny
  if (icon.includes('a') || code === 800) {
    if (icon.endsWith('n')) {
      return 'night';
    }
    return 'sunny';
  }
  
  return 'default-bg';
}

// Get temperature color class based on temp value
function getTempColorClass(temp) {
  if (temp >= 35) return 'temp-hot';
  if (temp >= 25) return 'temp-warm';
  if (temp >= 15) return 'temp-mild';
  if (temp >= 5) return 'temp-cool';
  return 'temp-cold';
}

// Format day name from timestamp
function getDayName(timestamp) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(timestamp * 1000);
  const today = new Date();
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  
  return days[date.getDay()];
}

// Apply weather theme to body
function applyWeatherTheme(weatherData) {
  const body = document.body;
  const iconCode = weatherData.weather?.icon || '';
  const weatherCode = weatherData.weather?.code || weatherData.weather?.code;
  
  const condition = getWeatherCondition(iconCode, weatherCode || iconCode);
  
  // Remove all weather classes
  body.className = '';
  body.classList.add(condition);
}

// Show loading animation
function showLoading(weatherDiv, forecastDiv) {
  weatherDiv.innerHTML = `
    <div class="loading">
      <div class="loading-dot"></div>
      <div class="loading-dot"></div>
      <div class="loading-dot"></div>
    </div>
  `;
  forecastDiv.innerHTML = '';
}

async function getWeather() {
  const cityInput = document.getElementById("city").value.trim() || "New York";
  const weatherDiv = document.getElementById("weather");
  const forecastDiv = document.getElementById("forecast");

  showLoading(weatherDiv, forecastDiv);

  try {
    // Current Weather
    const res = await fetch(`https://api.weatherbit.io/v2.0/current?city=${encodeURIComponent(cityInput)}&key=${API_KEY}`);
    const data = await res.json();
    
    if (!data.data || data.data.length === 0) {
      weatherDiv.innerHTML = `<div class="error-message">🌧️ City not found. Please check the name and try again.</div>`;
      return;
    }
    
    const w = data.data[0];
    
    // Apply dynamic background theme
    applyWeatherTheme(w);
    
    // Determine temperature color
    const tempColorClass = getTempColorClass(w.temp);
    
    weatherDiv.innerHTML = `
      <h2>${w.city_name}</h2>
      <span class="country-badge">${w.country_code}</span>
      <div class="${tempColorClass} temp-display">${Math.round(w.temp)}°</div>
      <img src="https://cdn.weatherbit.io/static/img/icons/${w.weather.icon}.png" alt="${w.weather.description}">
      <div class="description">${w.weather.description}</div>
      <div class="details">
        <div class="detail-item">
          <div class="label">Feels Like</div>
          <div class="value">${Math.round(w.app_temp)}°C</div>
        </div>
        <div class="detail-item">
          <div class="label">Humidity</div>
          <div class="value">${w.rh}%</div>
        </div>
        <div class="detail-item">
          <div class="label">Wind</div>
          <div class="value">${w.wind_spd} m/s</div>
        </div>
        <div class="detail-item">
          <div class="label">UV Index</div>
          <div class="value">${w.uv || 'N/A'}</div>
        </div>
      </div>
    `;

    // Fetch 7-day forecast
    const forecastRes = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${encodeURIComponent(cityInput)}&key=${API_KEY}&days=7`);
    const forecastData = await forecastRes.json();
    
    if (forecastData.data && forecastData.data.length > 0) {
      forecastDiv.innerHTML = forecastData.data.map(day => {
        const dayName = getDayName(day.ts);
        return `
          <div class="forecast-day">
            <div class="day-name">${dayName}</div>
            <img src="https://cdn.weatherbit.io/static/img/icons/${day.weather.icon}.png" alt="${day.weather.description}">
            <div class="forecast-temp">${Math.round(day.max_temp)}°/${Math.round(day.min_temp)}°</div>
            <div class="forecast-desc">${day.weather.description}</div>
          </div>
        `;
      }).join('');
    }

  } catch (e) {
    console.error('Weather fetch error:', e);
    weatherDiv.innerHTML = `<div class="error-message">⚠️ Could not load weather data. Check your connection and try again.</div>`;
  }
}

// Load default weather on page load
window.onload = getWeather;
