const apiKey = 'a069171dbe09f0c1ddb466638b35c563';
const lat = 16.7666;
const lon = -3.0026;
const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

async function getWeather(){
  try{
    const [cRes, fRes] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)]);
    if(!cRes.ok || !fRes.ok) throw new Error('Weather fetch failed');
    const current = await cRes.json();
    const forecast = await fRes.json();
    displayCurrent(current);
    displayForecast(forecast);
  }catch(e){
    console.error(e);
    const el = document.getElementById('weather-current');
    if(el) el.innerHTML = '<p>Weather unavailable - check API key</p>';
  }
}
function displayCurrent(d){
  const el = document.getElementById('weather-current');
  if(!el) return;
  el.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png" alt="${d.weather[0].description}" width="64" height="64" loading="lazy">
    <div><div class="weather-temp">${Math.round(d.main.temp)}°C</div><div class="weather-desc">${d.weather[0].description} - feels like ${Math.round(d.main.feels_like)}°C</div><div style="font-size:11px;color:var(--muted)">Humidity: ${d.main.humidity}% | Wind: ${d.wind.speed} m/s</div></div>`;
}
function displayForecast(d){
  const el = document.getElementById('forecast');
  if(!el) return;
  const daily = d.list.filter(x=>x.dt_txt.includes('12:00:00')).slice(0,3);
  el.innerHTML = daily.map(item=>{
    const day = new Date(item.dt*1000).toLocaleDateString('en-US',{weekday:'short'});
    return `<div class="f-day"><b>${day}</b><img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}" width="40" height="40" loading="lazy"><span>${Math.round(item.main.temp)}°C</span></div>`;
  }).join('');
}
getWeather();
