(() => {
  const shortcutSection = document.querySelector('.weather-shortcut');
  const schedulePanel = document.getElementById('panel-schedule');

  if (shortcutSection && schedulePanel) {
    schedulePanel.prepend(shortcutSection);
  }

  const layoutStyle = document.createElement('style');
  layoutStyle.textContent = `
    #panel-schedule .weather-shortcut{
      max-width:none;
      margin:0 0 32px;
      padding:0 0 28px;
      border-bottom:1px solid var(--border);
    }
    @media(max-width:650px){
      #panel-schedule .weather-shortcut{
        margin-bottom:28px;
        padding-left:0;
        padding-right:0;
        padding-bottom:24px;
      }
    }
  `;
  document.head.appendChild(layoutStyle);

  const locations = [
    {name:'Vágar', latitude:62.0636, longitude:-7.2772},
    {name:'Streymoy', latitude:62.0079, longitude:-6.7900},
    {name:'Eysturoy', latitude:62.1080, longitude:-6.7220},
    {name:'Northern Islands', latitude:62.2266, longitude:-6.5890},
    {name:'Sandoy', latitude:61.8420, longitude:-6.8070},
    {name:'Suðuroy', latitude:61.5556, longitude:-6.8111}
  ];

  const refreshMs = 30 * 60 * 1000;

  function apiUrl(location){
    return 'https://api.open-meteo.com/v1/forecast' +
      `?latitude=${location.latitude}&longitude=${location.longitude}` +
      '&hourly=precipitation_probability,precipitation,weather_code,visibility,wind_speed_10m,wind_gusts_10m' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,sunrise,sunset' +
      '&timezone=Atlantic%2FFaroe&forecast_days=7&wind_speed_unit=ms';
  }

  function esc(value){
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
    })[char]);
  }

  function description(code){
    const values = {
      0:['☀️','Clear sky'], 1:['🌤️','Mainly clear'], 2:['⛅','Partly cloudy'],
      3:['☁️','Overcast'], 45:['🌫️','Fog'], 48:['🌫️','Rime fog'],
      51:['🌦️','Light drizzle'], 53:['🌦️','Drizzle'], 55:['🌧️','Heavy drizzle'],
      61:['🌦️','Light rain'], 63:['🌧️','Rain'], 65:['🌧️','Heavy rain'],
      71:['🌨️','Light snow'], 73:['🌨️','Snow'], 75:['❄️','Heavy snow'],
      80:['🌦️','Rain showers'], 81:['🌧️','Rain showers'], 82:['⛈️','Heavy showers'],
      85:['🌨️','Snow showers'], 86:['❄️','Heavy snow showers'],
      95:['⛈️','Thunderstorm'], 96:['⛈️','Thunderstorm with hail'], 99:['⛈️','Severe thunderstorm']
    };
    return values[code] || ['🌦️','Changeable'];
  }

  function minutes(iso){
    const [hour, minute] = String(iso || '').slice(11,16).split(':').map(Number);
    return hour * 60 + minute;
  }

  function classify(hour){
    const rainChance = Number(hour.rainChance || 0);
    const rain = Number(hour.rain || 0);
    const wind = Number(hour.wind || 0);
    const gust = Number(hour.gust || 0);
    const visibility = Number(hour.visibility || 10000);
    const code = Number(hour.code || 0);

    if (rainChance > 65 || rain > 1.5 || wind > 14 || gust > 22 || visibility < 1500 || code >= 95) {
      return 'bad';
    }

    if (rainChance <= 30 && rain <= 0.2 && wind <= 9 && gust <= 14 && visibility >= 5000 && ![45,48,55,65,75,82,86].includes(code)) {
      return 'good';
    }

    return 'caution';
  }

  function longestWindow(hours, allowed){
    let best = [];
    let current = [];

    for (const hour of hours) {
      if (!allowed.includes(hour.rating)) {
        current = [];
        continue;
      }

      if (current.length && minutes(hour.time) !== minutes(current[current.length - 1].time) + 60) {
        current = [];
      }

      current.push(hour);
      if (current.length > best.length) best = [...current];
    }

    return best;
  }

  function formatWindow(hours){
    if (!hours.length) return 'No reliable 3 hour window';
    const start = hours[0].time.slice(11,16);
    const end = minutes(hours[hours.length - 1].time) + 60;
    return `${start} to ${String(Math.floor(end / 60)).padStart(2,'0')}:${String(end % 60).padStart(2,'0')}`;
  }

  function hourlyRows(data){
    return data.hourly.time.map((time, index) => ({
      time,
      rainChance:data.hourly.precipitation_probability[index],
      rain:data.hourly.precipitation[index],
      code:data.hourly.weather_code[index],
      visibility:data.hourly.visibility[index],
      wind:data.hourly.wind_speed_10m[index],
      gust:data.hourly.wind_gusts_10m[index]
    }));
  }

  function assess(date, sunrise, sunset, hours){
    const start = Math.max(minutes(sunrise) + 30, 360);
    const end = Math.min(minutes(sunset) - 30, 1320);
    const daylight = hours
      .filter(hour => hour.time.startsWith(date) && minutes(hour.time) >= start && minutes(hour.time) <= end)
      .map(hour => ({...hour, rating:classify(hour)}));

    const good = longestWindow(daylight, ['good']);
    if (good.length >= 3) return {rating:'good', window:formatWindow(good), length:good.length};

    const usable = longestWindow(daylight, ['good','caution']);
    if (usable.length >= 3) return {rating:'caution', window:formatWindow(usable), length:usable.length};

    return {rating:'bad', window:'No reliable 3 hour window', length:0};
  }

  function currentFaroeDate(){
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone:'Atlantic/Faroe', year:'numeric', month:'2-digit', day:'2-digit'
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function range(values, suffix){
    const rounded = values.map(Number).filter(Number.isFinite).map(Math.round);
    const min = Math.min(...rounded);
    const max = Math.max(...rounded);
    return min === max ? `${min}${suffix}` : `${min} to ${max}${suffix}`;
  }

  function mode(values){
    const counts = new Map();
    values.forEach(value => counts.set(value, (counts.get(value) || 0) + 1));
    return [...counts.entries()].sort((a,b) => b[1] - a[1])[0]?.[0] ?? 3;
  }

  function aggregate(forecasts, date){
    const regions = forecasts.map(forecast => {
      const index = forecast.data.daily.time.indexOf(date);
      if (index < 0) return null;
      return {
        name:forecast.location.name,
        assessment:assess(date, forecast.data.daily.sunrise[index], forecast.data.daily.sunset[index], forecast.hours),
        code:Number(forecast.data.daily.weather_code[index]),
        max:Number(forecast.data.daily.temperature_2m_max[index]),
        min:Number(forecast.data.daily.temperature_2m_min[index]),
        rain:Number(forecast.data.daily.precipitation_probability_max[index]),
        wind:Number(forecast.data.daily.wind_speed_10m_max[index]),
        gust:Number(forecast.data.daily.wind_gusts_10m_max[index])
      };
    }).filter(Boolean);

    const rank = {good:2, caution:1, bad:0};
    const good = regions.filter(region => region.assessment.rating === 'good');
    const usable = regions.filter(region => region.assessment.rating !== 'bad');
    const best = [...regions].sort((a,b) =>
      rank[b.assessment.rating] - rank[a.assessment.rating] || b.assessment.length - a.assessment.length
    )[0];

    let rating = 'bad';
    let label = 'Outdoor not recommended';

    if (good.length >= 2 || (good.length >= 1 && usable.length >= 3)) {
      rating = 'good';
      label = 'Good options across Faroes';
    } else if (usable.length) {
      rating = 'caution';
      label = 'Limited outdoor options';
    }

    const highlighted = (good.length ? good : usable)
      .sort((a,b) => b.assessment.length - a.assessment.length)
      .slice(0,3)
      .map(region => region.name);

    return {
      regions, rating, label, best, highlighted,
      code:mode(regions.map(region => region.code)),
      max:Math.max(...regions.map(region => region.max)),
      min:Math.min(...regions.map(region => region.min)),
      rain:range(regions.map(region => region.rain),'%'),
      wind:range(regions.map(region => region.wind),' m/s'),
      gust:Math.round(Math.max(...regions.map(region => region.gust))),
      usable:usable.length
    };
  }

  function shortcutLabel(rating){
    if (rating === 'good') return 'Good';
    if (rating === 'caution') return 'Limited';
    return 'No outdoor';
  }

  function openWeather(date){
    if (typeof window.openPortalTab === 'function') window.openPortalTab('weather');
    requestAnimationFrame(() => {
      const card = document.getElementById(`weather-${date}`);
      (card || document.getElementById('panel-weather'))?.scrollIntoView({behavior:'smooth', block:card ? 'center' : 'start'});
    });
  }

  function renderShortcut(days){
    const container = document.getElementById('weather-shortcut-days');
    if (!container) return;

    const today = currentFaroeDate();
    const dayFormat = new Intl.DateTimeFormat('en-GB',{weekday:'short',timeZone:'UTC'});
    const dateFormat = new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',timeZone:'UTC'});

    container.innerHTML = days.map(day => {
      const dateObject = new Date(`${day.date}T12:00:00Z`);
      const isToday = day.date === today;
      return `
        <button class="shortcut-day ${day.rating}${isToday ? ' today' : ''}" type="button" data-weather-date="${esc(day.date)}">
          <span class="shortcut-day-name">${esc(dayFormat.format(dateObject))}${isToday ? ' · Today' : ''}</span>
          <span class="shortcut-day-date">${esc(dateFormat.format(dateObject))}</span>
          <span class="shortcut-day-status"><span class="shortcut-dot"></span>${esc(shortcutLabel(day.rating))}</span>
        </button>`;
    }).join('');

    container.querySelectorAll('[data-weather-date]').forEach(button => {
      button.addEventListener('click', () => openWeather(button.dataset.weatherDate));
    });
  }

  function renderDetails(days, forecastCount){
    const grid = document.getElementById('weather-grid');
    if (!grid) return;

    const today = currentFaroeDate();
    const dayFormat = new Intl.DateTimeFormat('en-GB',{weekday:'short',timeZone:'UTC'});
    const dateFormat = new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',timeZone:'UTC'});

    grid.innerHTML = days.map(day => {
      const [icon, condition] = description(day.code);
      const dateObject = new Date(`${day.date}T12:00:00Z`);
      const isToday = day.date === today;
      const areas = day.highlighted.length
        ? `${day.rating === 'good' ? 'Best areas' : 'Possible areas'}: ${day.highlighted.join(', ')}`
        : 'No suitable region found';
      const windowText = day.best && day.best.assessment.rating !== 'bad'
        ? `${day.best.name}, ${day.best.assessment.window}`
        : 'No reliable 3 hour window';

      return `
        <article class="weather-card ${day.rating}${isToday ? ' today' : ''}" id="weather-${esc(day.date)}">
          <div class="weather-day">${esc(dayFormat.format(dateObject))}${isToday ? ' · Today' : ''}</div>
          <div class="weather-date">${esc(dateFormat.format(dateObject))}</div>
          <div class="weather-icon" aria-hidden="true">${icon}</div>
          <div class="weather-temp">${Math.round(day.max)}° / ${Math.round(day.min)}°</div>
          <div class="weather-condition">${esc(condition)} across the islands</div>
          <div class="weather-stats">
            <div>Rain <b>${esc(day.rain)}</b></div>
            <div>Wind <b>${esc(day.wind)}</b></div>
            <div>Gusts up to <b>${day.gust} m/s</b></div>
          </div>
          <span class="film-status ${day.rating}">${esc(day.label)}</span>
          <div class="film-window">Best window: <b>${esc(windowText)}</b></div>
          <div class="weather-areas"><b>${day.usable}/${day.regions.length}</b> regions usable. ${esc(areas)}</div>
        </article>`;
    }).join('');

    const updated = new Intl.DateTimeFormat('en-GB', {
      timeZone:'Atlantic/Faroe', hour:'2-digit', minute:'2-digit', day:'numeric', month:'short'
    }).format(new Date());
    const updatedElement = document.getElementById('weather-updated');
    if (updatedElement) updatedElement.textContent = `Updated ${updated} · ${forecastCount}/6 regions`;
  }

  async function fetchRegion(location){
    const response = await fetch(`${apiUrl(location)}&_=${Date.now()}`, {cache:'no-store'});
    if (!response.ok) throw new Error(`${location.name}: ${response.status}`);
    const data = await response.json();
    if (!data.daily || !data.hourly) throw new Error(`${location.name}: incomplete data`);
    return {location, data, hours:hourlyRows(data)};
  }

  async function loadWeather(){
    const shortcut = document.getElementById('weather-shortcut-days');
    const grid = document.getElementById('weather-grid');

    try {
      const settled = await Promise.allSettled(locations.map(fetchRegion));
      const forecasts = settled.filter(result => result.status === 'fulfilled').map(result => result.value);
      if (forecasts.length < 3) throw new Error('Too few regional forecasts are available');

      const days = forecasts[0].data.daily.time.map(date => ({date, ...aggregate(forecasts,date)}));
      renderShortcut(days);
      renderDetails(days,forecasts.length);
    } catch (error) {
      console.error(error);
      if (shortcut) shortcut.innerHTML = '<div class="shortcut-error">Forecast temporarily unavailable</div>';
      if (grid) grid.innerHTML = '<div class="weather-error">The live Faroe Islands forecast could not be loaded. Refresh the page or check the internet connection.</div>';
      const updatedElement = document.getElementById('weather-updated');
      if (updatedElement) updatedElement.textContent = 'Forecast temporarily unavailable';
    }
  }

  document.getElementById('open-weather-details')?.addEventListener('click', () => {
    if (typeof window.openPortalTab === 'function') window.openPortalTab('weather');
  });

  loadWeather();
  setInterval(loadWeather,refreshMs);
})();