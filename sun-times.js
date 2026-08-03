(() => {
  document.querySelector('.hero-sub')?.remove();

  const translations = new Map([
    ['Production Portal', 'Produktionsportal'],
    ['Agency: SANSIR · Client: SEV', 'Bureau: SANSIR · Kunde: SEV'],
    ['Commercial production for Elfelagið SEV, produced by Kovboy Film with FIXER sp/f as local production partner.', 'Reklamefilm for Elfelagið SEV, produceret af KOVBOY FILM med FIXER sp/f som lokal produktionspartner.'],
    ['PRODUCTION STATUS:', 'PRODUKTIONSSTATUS:'],
    ['Tasks have been assigned. Everyone can begin their work.', 'Opgaverne er fordelt. Alle kan gå i gang med deres arbejde.'],
    ['Schedule', 'Produktionsplan'],
    ['Weather', 'Vejr'],
    ['Crew & Contributors', 'Hold'],
    ['Contacts', 'Kontakter'],
    ['7 day filming outlook', 'Vejrudsigt for 7 optagedage'],
    ['Faroe Islands', 'Færøerne'],
    ['View details', 'Se detaljer'],
    ['Loading filming outlook…', 'Indlæser vejrudsigten…'],
    ["What's being filmed", 'Hvad skal optages'],
    ['Day by day. Locations, scenes and call times. Updated as the shoot progresses.', 'Dag for dag. Locations, scener og mødetider. Opdateres løbende under produktionen.'],
    ['Detailed filming weather', 'Detaljeret optagevejr'],
    ['Seven day forecast across Vágar, Streymoy, Eysturoy, the Northern Islands, Sandoy and Suðuroy.', 'Syvdagesudsigt for Vágar, Streymoy, Eysturoy, Norðoyggjar, Sandoy og Suðuroy.'],
    ['Loading live forecast…', 'Indlæser den aktuelle vejrudsigt…'],
    ['Good filming conditions', 'Gode optageforhold'],
    ['Limited outdoor options', 'Begrænsede muligheder udendørs'],
    ['Outdoor filming not recommended', 'Udendørsoptagelser frarådes'],
    ['Loading the detailed Faroe Islands forecast…', 'Indlæser den detaljerede vejrudsigt for Færøerne…'],
    ['Production guide based on forecast rain, wind, gusts and visibility. Conditions can change quickly between islands and valleys.', 'Produktionsvejledning baseret på forventet regn, vind, vindstød og sigtbarhed. Forholdene kan ændre sig hurtigt mellem øer og dale.'],
    ['Forecast data from', 'Vejrdata fra'],
    ['Everyone on this production', 'Alle på produktionen'],
    ['Agency, crew and on camera contributors. Search by name to jump straight to someone.', 'Bureau, filmhold og medvirkende. Søg på navn for hurtigt at finde en person.'],
    ['Search by name…', 'Søg på navn…'],
    ['No one matches that search.', 'Ingen matcher din søgning.'],
    ['Key contacts', 'Vigtige kontakter'],
    ['Who to call for what.', 'Hvem kontaktes om hvad.'],
    ['Shoot begins today', 'Optagelserne begynder i dag'],
    ['Portal will update day by day as scenes are filmed.', 'Portalen opdateres dag for dag, efterhånden som scenerne bliver optaget.'],
    ['Storyboard and scene index', 'Storyboard og sceneoversigt'],
    ['Select a scene to open the corresponding storyboard page. Drone scenes are clearly marked for weather, visibility and light planning.', 'Vælg en scene for at åbne den tilhørende side i storyboardet. Dronescener er tydeligt markeret med henblik på planlægning af vejr, sigtbarhed og lys.'],
    ['Open selected page', 'Åbn den valgte side'],
    ['Open full PDF', 'Åbn hele PDF-filen'],
    ['All scenes', 'Alle scener'],
    ['Storyboard quick access', 'Hurtig adgang til storyboard'],
    ['Drone windows: scenes 3A, 5A, 6A, 7A and 8A', 'Dronevinduer: scene 3A, 5A, 6A, 7A og 8A'],
    ['The page number remains visible above the viewer. If Google Drive opens at the beginning, enter the displayed PDF page number in the viewer.', 'Sidetallet vises over fremviseren. Hvis Google Drive åbner fra begyndelsen, skal du indtaste det viste PDF-sidetal i fremviseren.'],
    ['DRONE · WEATHER WINDOW', 'DRONE · VEJRVINDUE'],
    ['Home. Open Schedule', 'Forside. Åbn produktionsplanen'],
    ['Today', 'I dag'],
    ['Location:', 'Location:'],
    ['Call time:', 'Mødetid:'],
    ['Client', 'Kunde'],
    ['Agency', 'Bureau'],
    ['Production', 'Produktion'],
    ['Local partner', 'Lokal partner'],
    ['Creative agency', 'Kreativt bureau'],
    ['Local production and fixer services', 'Lokal produktion og produktionsservice'],
    ['Producer', 'Producer'],
    ['Director', 'Instruktør'],
    ['Agency lead', 'Kontaktperson hos bureau'],
    ['On camera contributors', 'Medvirkende foran kameraet'],
    ['Add contributors', 'Tilføj medvirkende'],
    ['Add SANSIR contact', 'Tilføj SANSIR-kontakt'],
    ['Good options across Faroes', 'Gode muligheder flere steder på Færøerne'],
    ['Outdoor not recommended', 'Udendørsoptagelser frarådes'],
    ['Good', 'Godt'],
    ['Limited', 'Begrænset'],
    ['No outdoor', 'Ingen udendørsoptagelse'],
    ['Rain', 'Regn'],
    ['Wind', 'Vind'],
    ['Gusts up to', 'Vindstød op til'],
    ['Best window:', 'Bedste tidsrum:'],
    ['Best areas', 'Bedste områder'],
    ['Possible areas', 'Mulige områder'],
    ['No suitable region found', 'Intet egnet område fundet'],
    ['No reliable 3 hour window', 'Intet sikkert tidsrum på tre timer'],
    ['regions usable.', 'områder kan bruges.'],
    ['Updated', 'Opdateret'],
    ['Forecast temporarily unavailable', 'Vejrudsigten er midlertidigt utilgængelig'],
    ['The live Faroe Islands forecast could not be loaded. Refresh the page or check the internet connection.', 'Den aktuelle vejrudsigt for Færøerne kunne ikke indlæses. Genindlæs siden eller kontrollér internetforbindelsen.'],
    ['Clear sky', 'Klar himmel'],
    ['Mainly clear', 'Mest klart'],
    ['Partly cloudy', 'Delvist skyet'],
    ['Overcast', 'Overskyet'],
    ['Fog', 'Tåge'],
    ['Rime fog', 'Rimtåge'],
    ['Light drizzle', 'Let støvregn'],
    ['Drizzle', 'Støvregn'],
    ['Heavy drizzle', 'Kraftig støvregn'],
    ['Light rain', 'Let regn'],
    ['Heavy rain', 'Kraftig regn'],
    ['Light snow', 'Let sne'],
    ['Snow', 'Sne'],
    ['Heavy snow', 'Kraftig sne'],
    ['Rain showers', 'Regnbyger'],
    ['Heavy showers', 'Kraftige byger'],
    ['Snow showers', 'Snebyger'],
    ['Heavy snow showers', 'Kraftige snebyger'],
    ['Thunderstorm', 'Tordenvejr'],
    ['Thunderstorm with hail', 'Tordenvejr med hagl'],
    ['Severe thunderstorm', 'Kraftigt tordenvejr'],
    ['Changeable', 'Omskifteligt'],
    ['Sunrise', 'Solopgang'],
    ['Sunset', 'Solnedgang'],
    ['Unavailable', 'Ikke tilgængelig'],
    ['Northern Islands', 'Norðoyggjar'],
    ['Film producer', 'Filmproducer'],
    ['Art department', 'Scenografi'],
    ['PDF page', 'PDF-side'],
    ['PDF pages', 'PDF-sider'],
    ['SCENE', 'SCENE']
  ]);

  const phraseReplacements = [
    [/\bacross the islands\b/g, 'på tværs af øerne'],
    [/\bto\b/g, 'til'],
    [/\bregions\b/g, 'områder'],
    [/\bscenes\b/g, 'scener'],
    [/\bScene\b/g, 'Scene'],
    [/\bpage\b/g, 'side'],
    [/\bpages\b/g, 'sider'],
    [/\bMon\b/g, 'man.'], [/\bTue\b/g, 'tirs.'], [/\bWed\b/g, 'ons.'],
    [/\bThu\b/g, 'tors.'], [/\bFri\b/g, 'fre.'], [/\bSat\b/g, 'lør.'], [/\bSun\b/g, 'søn.'],
    [/\bJan\b/g, 'jan.'], [/\bFeb\b/g, 'feb.'], [/\bMar\b/g, 'mar.'], [/\bApr\b/g, 'apr.'],
    [/\bMay\b/g, 'maj'], [/\bJun\b/g, 'jun.'], [/\bJul\b/g, 'jul.'], [/\bAug\b/g, 'aug.'],
    [/\bSep\b/g, 'sep.'], [/\bOct\b/g, 'okt.'], [/\bNov\b/g, 'nov.'], [/\bDec\b/g, 'dec.']
  ];

  function translateText(value) {
    let text = String(value || '');
    for (const [english, danish] of translations) text = text.split(english).join(danish);
    for (const [pattern, replacement] of phraseReplacements) text = text.replace(pattern, replacement);
    return text;
  }

  function removeCountdown() {
    document.querySelectorAll('[role="timer"]').forEach(element => element.remove());
    document.querySelectorAll('*').forEach(element => {
      if (/FINAL FILMING DAY|FILMING PERIOD COMPLETED|\d+d\s+\d{2}h\s+\d{2}m\s+\d{2}s/.test(element.textContent || '')) {
        const timer = element.closest('[role="timer"]');
        if (timer) timer.remove();
      }
    });
  }

  function translateNode(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.parentElement?.closest('script,style')) return;
      const translated = translateText(node.nodeValue);
      if (translated !== node.nodeValue) node.nodeValue = translated;
    });

    root.querySelectorAll?.('[aria-label], [placeholder], [title]').forEach(element => {
      for (const attribute of ['aria-label', 'placeholder', 'title']) {
        if (!element.hasAttribute(attribute)) continue;
        element.setAttribute(attribute, translateText(element.getAttribute(attribute)));
      }
    });

    document.documentElement.lang = 'da';
    document.title = 'SEV × SANSIR · Produktionsportal';
    removeCountdown();
  }

  translateNode();
  const translationObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) translateNode(node);
        if (node.nodeType === Node.TEXT_NODE && node.parentElement) translateNode(node.parentElement);
      });
    }
    removeCountdown();
  });
  translationObserver.observe(document.body, { childList: true, subtree: true });

  const locations = [
    {name:'Vágar', latitude:62.0636, longitude:-7.2772},
    {name:'Streymoy', latitude:62.0079, longitude:-6.7900},
    {name:'Eysturoy', latitude:62.1080, longitude:-6.7220},
    {name:'Norðoyggjar', latitude:62.2266, longitude:-6.5890},
    {name:'Sandoy', latitude:61.8420, longitude:-6.8070},
    {name:'Suðuroy', latitude:61.5556, longitude:-6.8111}
  ];

  const style = document.createElement('style');
  style.textContent = `
    .weather-sun{display:flex;flex-wrap:wrap;gap:5px 10px;margin-top:7px;padding-top:7px;border-top:1px solid var(--border);color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:10px;line-height:1.35}
    .weather-sun span{display:inline-flex;align-items:center;gap:4px;white-space:nowrap}
    .weather-sun b{color:var(--text);font-weight:500}
  `;
  document.head.appendChild(style);

  function apiUrl(location){
    return 'https://api.open-meteo.com/v1/forecast' +
      `?latitude=${location.latitude}&longitude=${location.longitude}` +
      '&daily=sunrise,sunset&timezone=Atlantic%2FFaroe&forecast_days=7';
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
    if (!minutes.length) return 'Ikke tilgængelig';
    const earliest = Math.min(...minutes);
    const latest = Math.max(...minutes);
    return earliest === latest ? formatMinutes(earliest) : `${formatMinutes(earliest)}–${formatMinutes(latest)}`;
  }

  async function fetchLocation(location){
    const response = await fetch(`${apiUrl(location)}&_=${Date.now()}`, {cache:'no-store'});
    if (!response.ok) throw new Error(`${location.name}: ${response.status}`);
    const data = await response.json();
    if (!data.daily?.time || !data.daily?.sunrise || !data.daily?.sunset) throw new Error(`${location.name}: ufuldstændige soldata`);
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
      return [date, {sunrise:timeRange(sunrises), sunset:timeRange(sunsets), regions:forecasts.length}];
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
      row.title = `Tidsinterval på tværs af ${sun.regions} vejrområder på Færøerne`;
      row.innerHTML = `<span>☀↑ Solopgang <b>${sun.sunrise}</b></span><span>☀↓ Solnedgang <b>${sun.sunset}</b></span>`;
      dateElement.insertAdjacentElement('afterend', row);
    });
  }

  async function initialise(){
    try {
      const settled = await Promise.allSettled(locations.map(fetchLocation));
      const forecasts = settled.filter(result => result.status === 'fulfilled').map(result => result.value);
      if (forecasts.length < 3) throw new Error('For få vejrudsigter for solopgang er tilgængelige');
      const days = aggregate(forecasts);
      const grid = document.getElementById('weather-grid');
      if (!grid) return;
      renderSunTimes(days);
      const observer = new MutationObserver(() => { renderSunTimes(days); translateNode(grid); });
      observer.observe(grid, {childList:true, subtree:true});
    } catch (error) {
      console.error('Tider for solopgang og solnedgang kunne ikke indlæses', error);
    }
  }

  initialise();
})();