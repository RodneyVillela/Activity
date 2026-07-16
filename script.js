const API_KEY = "b59e54bbec0f493198956d9c477f9090";

async function getWeather() {
  const city = document.getElementById("city").value || "New York";
  const weatherDiv = document.getElementById("weather");
  const forecastDiv = document.getElementById("forecast");

  weatherDiv.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`https://api.weatherbit.io/v2.0/current?city=${city}&key=${API_KEY}`);
    const data = await res.json();
    const w = data.data[0];

    weatherDiv.innerHTML = `
      <h2>${w.city_name}</h2>
      <h1>${w.temp}°C</h1>
      <p>${w.weather.description}</p>
    `;

    // You can add forecast later
  } catch(e) {
    weatherDiv.innerHTML = "<p style='color:red'>Error loading weather</p>";
  }
}

window.onload = getWeather;
