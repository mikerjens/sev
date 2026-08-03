(() => {
  const locations = [
    {name:'Vágar', latitude:62.0636, longitude:-7.2772},
    {name:'Streymoy', latitude:62.0079, longitude:-6.7900},
    {name:'Eysturoy', latitude:62.1080, longitude:-6.7220},
    {name:'Northern Islands', latitude:62.2266, longitude:-6.5890},
    {name:'Sandoy', latitude:61.8420, longitude:-6.8070},
    {name:'Suðuroy', latitude:61.5556, longitude:-6.8111}
  ];

  const style = document.createElement('style');
  style.textContent = `
    .weather-sun{
      display:flex;
      flex-wrap:wrap;
      gap:5px 10px;
      margin-top:7px;
      padding-top:7px;
      border-top:1px solid var(--border);
      color:var(--text-muted);
      font-family:'IBM Plex Mono',monospace;
      font-size:10px;
      line-height:1.35;
    }
    .weather-sun span{
      display:inline-flex;
      align-items:center;
      gap:4px;
      white-space:nowrap;
    }
    .weather-sun b{
      color:var(--text);
      font-weight:500;
    }
  `;
  document.head.appendChild(style);

  function apiUrl(location){
    return 'https://api.open-meteo.com/v1/forecast' +
      `?latitude=${location.latitude}&longitude=${location.longitude}` +
      '&daily=sunrise,sunset' +
      '&timezone=Atlantic%2FFaroe&forecast_days=7';
  }

  function toMinutes(iso){
    const [hour, minute] = String(iso || '').slice(11,16).split(':').map(Number);
    return hour * 60 + minute;
  }

  function formatMinutes(value){
    const hour = String(Math.floor(value / 60)).padStart(2,'0');
    const minute = String(value % 60).padStart(2,'0');
    return `${hour}:${minute}`;
  }

  function timeRange(values){
    const minutes = values.map(toMinutes).filter(Number.isFinite);
    if (!minutes.length) return 'Unavailable';

    const earliest = Math.min(...minutes);
    const latest = Math.max(...minutes);
    return earliest === latest
      ? formatMinutes(earliest)
      : `${formatMinutes(earliest)}–${formatMinutes(latest)}`;
  }

  async function fetchLocation(location){
    const response = await fetch(`${apiUrl(location)}&_=${Date.now()}`, {cache:'no-store'});
    if (!response.ok) throw new Error(`${location.name}: ${response.status}`);

    const data = await response.json();
    if (!data.daily?.time || !data.daily?.sunrise || !data.daily?.sunset) {
      throw new Error(`${location.name}: incomplete sun data`);
    }

    return {location, data};
  }

  function aggregate(forecasts){
    const dates = forecasts[0].data.daily.time;
    return Object.fromEntries(dates.map(date => {
      const sunrises = [];
      const sunsets = [];

      forecasts.forEach(forecast => {
        const index = forecast.data.daily.time.indexOf(date);
        if (index < 0) return;
        sunrises.push(forecast.data.daily.sunrise[index]);
        sunsets.push(forecast.data.daily.sunset[index]);
      });

      return [date, {
        sunrise:timeRange(sunrises),
        sunset:timeRange(sunsets),
        regions:forecasts.length
      }];
    }));
  }

  function renderSunTimes(days){
    Object.entries(days).forEach(([date, sun]) => {
      const card = document.getElementById(`weather-${date}`);
      if (!card || card.querySelector('.weather-sun')) return;

      const dateElement = card.querySelector('.weather-date');
      if (!dateElement) return;

      const row = document.createElement('div');
      row.className = 'weather-sun';
      row.title = `Range across ${sun.regions} forecast regions in the Faroe Islands`;
      row.innerHTML = `
        <span>☀↑ Sunrise <b>${sun.sunrise}</b></span>
        <span>☀↓ Sunset <b>${sun.sunset}</b></span>
      `;
      dateElement.insertAdjacentElement('afterend', row);
    });
  }

  async function initialise(){
    try {
      const settled = await Promise.allSettled(locations.map(fetchLocation));
      const forecasts = settled
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

      if (forecasts.length < 3) throw new Error('Too few sunrise forecasts available');

      const days = aggregate(forecasts);
      const grid = document.getElementById('weather-grid');
      if (!grid) return;

      renderSunTimes(days);

      const observer = new MutationObserver(() => renderSunTimes(days));
      observer.observe(grid, {childList:true, subtree:true});
    } catch (error) {
      console.error('Sunrise and sunset times could not be loaded', error);
    }
  }

  initialise();
})();
