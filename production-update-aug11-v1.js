(() => {
  'use strict';

  const VERSION = '2026-08-11-1305';
  const STORAGE_KEY = 'sev-task-person';
  const HEINI_ID = 'heini';
  const HEINI_LABEL = 'Heini Dam Lassen · Skuespiller · dreng';
  const LOCATION_URL = 'https://www.airbnb.dk/rooms/17985150?unique_share_id=d24602e0-e283-4688-8c00-39153d143b81&viralityEntryPoint=1&s=76&source_impression_id=p3_1786370596_P3Bm4DyxDVfA1x9G';

  const SCENE_TITLES = {
    '1A': 'Lyskontakt og åbningsbillede',
    '2A': 'Drengen læser',
    '2B': 'Nærbillede af bog/foto',
    '9A': 'Dreng løber hen til mor',
    '9B': 'Elbil og ladeboks',
    '9C': 'Varmepumpe',
    '12A': 'Grøn energi fra et vandløb',
    '13A': 'Hus og solpaneler',
    '13B': 'Dreng blændes af solen',
    '15A': 'Måske begynder det med dig',
    '16A': 'Lyset slukkes'
  };

  const AUG19_VESTMANNA = {
    key: 'aug19-9abc',
    dateLabel: 'ONSDAG 19. AUGUST',
    title: 'Vestmanna · elbil, ladeboks og varmepumpe',
    location: 'Fjalsvegur 24, Vestmanna',
    scenes: ['9A', '9B', '9C'],
    times: [
      ['Make-up / skuespillere', '12:00', 'Make-Up store · Niels Finsensgøta 22 / Kongagøta 4'],
      ['Crew møder på location', '12:30'],
      ['Optagelse på location', '14:00–16:00']
    ],
    crew: ['Thomas Koba · Instruktør og filmmaker', 'Michael Koba · Filmproducer', 'Rúni Friis Kjær · Grip / lys'],
    cast: ['Helena Heðinsdóttir Guttesen · mor', 'Heini Dam Lassen · dreng'],
    optional: ['Heidi Mortensen · Styling & props'],
    equipment: ['Elbil', 'Ladestation / ladeboks', 'Varmepumpe', 'Lys og strøm', 'Kontinuitet med skuespillernes tøj'],
    ready: ['Dato og tider er fastlagt.', 'Location-adressen er Fjalsvegur 24, Vestmanna.', 'Helena Heðinsdóttir Guttesen og Heini Dam Lassen er bekræftet.'],
    missing: ['Heidi Mortensens rolle på styling/props skal endeligt bekræftes.', 'Varmepumpen skal leveres til location.', 'Formelt visit og endelig aftale med locationejer skal på plads.'],
    note: '9A: Heini løber hen til Helena. 9B: elbil og ladeboks. 9C: varmepumpe. Locationejer: Eyðbjørn Joensen · tlf. 265883.'
  };

  const AUG19_SOLAR = {
    key: 'aug19-13a',
    dateLabel: 'ONSDAG 19. AUGUST',
    title: 'Hus og solpaneler',
    location: 'Vestmanna · præcis location afstemmes med Thomas',
    scenes: ['13A'],
    times: [['Optagelse', '16:00–17:30']],
    crew: ['Thomas Koba · Instruktør og filmmaker', 'Michael Koba · Filmproducer'],
    cast: ['Helena Heðinsdóttir Guttesen · mor', 'Heini Dam Lassen · dreng'],
    optional: [],
    equipment: ['Solpaneler / husmiljø', 'Samme tøj som i scene 9A, 9B og 9C', 'Lys / reflektorer efter behov'],
    ready: ['Dato og tidspunkt er fastlagt.', 'Helena og Heini er bekræftet.', 'Heidi Mortensen står for styling.'],
    missing: ['Den præcise location i Vestmanna skal afstemmes med Thomas.'],
    note: 'Scene 13A filmes efter Vestmanna-scenerne 9A–9C. Skuespillerne fortsætter i samme tøj.'
  };

  const AUG19_STREAM = {
    key: 'aug19-12a',
    dateLabel: 'ONSDAG 19. AUGUST',
    title: 'Grøn energi fra et vandløb',
    location: 'Location ukendt · afventer',
    scenes: ['12A'],
    times: [['Optagelse', '18:00–20:00']],
    crew: ['Thomas Koba · Instruktør og filmmaker', 'Michael Koba · Filmproducer'],
    cast: ['Helena Heðinsdóttir Guttesen · mor', 'Heini Dam Lassen · dreng'],
    optional: [],
    equipment: ['Samme tøj som i scene 9A, 9B og 9C', 'Lys og sikkerhedsudstyr efter location'],
    ready: ['Dato og tidspunkt er fastlagt.', 'Helena og Heini er bekræftet.', 'Heidi Mortensen står for styling.'],
    missing: ['Location skal findes og bekræftes.'],
    note: 'Scene 12A er planlagt som dagens sidste optagelse. Skuespillerne fortsætter i samme tøj som i 9A–9C.'
  };

  const PERSONAL_RELEVANCE = {
    'aug19-9abc': new Set(['michael', 'thomas', 'runi', 'heidi', 'helena', 'heini']),
    'aug19-13a': new Set(['michael', 'thomas', 'heidi', 'helena', 'heini']),
    'aug19-12a': new Set(['michael', 'thomas', 'heidi', 'helena', 'heini'])
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[char]);

  function addStyles() {
    if (document.getElementById('production-update-aug11-styles')) return;
    const style = document.createElement('style');
    style.id = 'production-update-aug11-styles';
    style.textContent = `.ap3-time small{display:block;margin-top:5px;color:var(--text-muted);font-size:9.5px;line-height:1.35}`;
    document.head.appendChild(style);
  }

  function cardText(card) {
    return (card?.textContent || '').replace(/\s+/g, ' ');
  }

  function sceneIds(card) {
    return [...(card?.querySelectorAll('[data-scene-link]') || [])]
      .map(link => String(link.dataset.sceneLink || '').toUpperCase())
      .filter(Boolean);
  }

  function hasScenes(card, ids) {
    const found = new Set(sceneIds(card));
    return ids.every(id => found.has(id));
  }

  function isAug17Card(card) {
    const text = cardText(card);
    return /17\. AUGUST/i.test(text) && /Indendørs optagelser/i.test(text) && /Skálabúðin/i.test(text);
  }

  function sceneLinks(scenes) {
    return scenes.map(scene => `<a class="scene-portal-link" href="#storyboard-${scene.toLowerCase()}" data-scene-link="${esc(scene)}">${esc(scene)}<span class="ap3-scene-label">· ${esc(SCENE_TITLES[scene] || '')}</span></a>`).join('');
  }

  function peopleMarkup(config) {
    const crew = config.crew.map(person => `<span class="ap3-person">${esc(person)}</span>`).join('');
    const cast = config.cast.map(person => `<span class="ap3-person">${esc(person)}</span>`).join('');
    const optional = config.optional.map(person => `<span class="ap3-person optional">MULIG: ${esc(person)}</span>`).join('');
    return crew + cast + optional;
  }

  function listMarkup(items) {
    return items.map(item => `<li>${esc(item)}</li>`).join('');
  }

  function shootMarkup(config) {
    const firstScene = config.scenes[0];
    return `<article class="ap3-shoot" data-production-plan-aug11="${esc(config.key)}">
      <div class="ap3-shoot-top"><div><div class="ap3-kicker">${esc(config.dateLabel)}</div><h3>${esc(config.title)}</h3><div class="ap3-location">📍 ${esc(config.location)}</div></div><span class="ap3-status">PLANLAGT</span></div>
      <div class="ap3-scenes">${sceneLinks(config.scenes)}</div>
      <div class="ap3-time-grid">${config.times.map(([label, value, detail]) => `<div class="ap3-time"><span>${esc(label)}</span><b>${esc(value)}</b>${detail ? `<small>${esc(detail)}</small>` : ''}</div>`).join('')}</div>
      <div class="ap3-details">
        <section class="ap3-detail-box"><h4>Hvem er med?</h4><div class="ap3-people">${peopleMarkup(config)}</div></section>
        <section class="ap3-detail-box"><h4>Rekvisitter · styling · udstyr</h4><ul>${listMarkup(config.equipment)}</ul></section>
        <section class="ap3-detail-box"><h4>✓ På plads</h4><ul>${listMarkup(config.ready)}</ul></section>
        <section class="ap3-detail-box missing"><h4>⚠ Mangler / skal afklares</h4><ul>${listMarkup(config.missing)}</ul></section>
      </div>
      <div class="ap3-note"><b>Sceneinfo:</b> ${esc(config.note)}</div>
      <div class="ap3-actions"><a class="ap3-action primary scene-portal-link" href="#storyboard-${firstScene.toLowerCase()}" data-scene-link="${esc(firstScene)}">Åbn storyboard</a><button class="ap3-action secondary" type="button" data-open-team>TEAM · telefonnumre</button><button class="ap3-action secondary" type="button" data-open-personal>Mit skema</button></div>
    </article>`;
  }

  function elementFromMarkup(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
  }

  function ensureLocationLink(card) {
    const location = card.querySelector('.ap3-location');
    if (location && !location.querySelector('.sev-location-link')) {
      location.innerHTML = `📍 <a class="sev-location-link" href="${LOCATION_URL}" target="_blank" rel="noopener noreferrer">Skálabúðin, Tórshavn · SE LOCATION</a>`;
    }
    if (location && !card.querySelector('.sev-location-open-row')) {
      const row = document.createElement('div');
      row.className = 'sev-location-open-row';
      row.innerHTML = `<a class="sev-location-open-button" href="${LOCATION_URL}" target="_blank" rel="noopener noreferrer">↗ Se billeder af location</a>`;
      location.insertAdjacentElement('afterend', row);
    }
  }

  function replaceDrengX(card) {
    card.querySelectorAll('.ap3-person').forEach(person => {
      if (/Dreng X/i.test(person.textContent || '')) person.textContent = 'Heini Dam Lassen · skuespiller · dreng';
    });
    const boxes = [...card.querySelectorAll('.ap3-detail-box')];
    const readyBox = boxes.find(box => /På plads/i.test(box.querySelector('h4')?.textContent || ''));
    const missingBox = boxes.find(box => /Mangler/i.test(box.querySelector('h4')?.textContent || ''));
    missingBox?.querySelectorAll('li').forEach(li => {
      if (/Dreng X/i.test(li.textContent || '') || /navn og kontaktoplysninger/i.test(li.textContent || '')) li.remove();
    });
    if (readyBox) {
      const list = readyBox.querySelector('ul');
      if (list && ![...list.querySelectorAll('li')].some(li => /Heini Dam Lassen/i.test(li.textContent || ''))) {
        const li = document.createElement('li');
        li.textContent = 'Heini Dam Lassen er bekræftet som dreng.';
        list.appendChild(li);
      }
    }
  }

  function patchAug17Card(card) {
    if (!card || !isAug17Card(card)) return false;
    replaceDrengX(card);
    const timeGrid = card.querySelector('.ap3-time-grid');
    if (timeGrid) {
      const actorTime = [...timeGrid.querySelectorAll('.ap3-time')].find(item => /Skuespillere møder/i.test(item.querySelector('span')?.textContent || ''));
      if (actorTime?.querySelector('span')) actorTime.querySelector('span').textContent = 'Skuespillere møder i Skálabúðin';
      if (!timeGrid.querySelector('[data-makeup-aug11]')) {
        const makeup = document.createElement('div');
        makeup.className = 'ap3-time';
        makeup.dataset.makeupAug11 = VERSION;
        makeup.innerHTML = '<span>Make-up · Make-Up store</span><b>13:00</b><small>Niels Finsensgøta 22 / Kongagøta 4</small>';
        const first = timeGrid.querySelector('.ap3-time');
        if (first) first.insertAdjacentElement('afterend', makeup);
        else timeGrid.appendChild(makeup);
      }
    }
    const readyBox = [...card.querySelectorAll('.ap3-detail-box')].find(box => /På plads/i.test(box.querySelector('h4')?.textContent || ''));
    readyBox?.querySelectorAll('li').forEach(li => {
      if (/alle tre mødetider/i.test(li.textContent || '')) li.textContent = 'Crew, make-up, skuespillermøde og optagestart er fastlagt.';
    });
    ensureLocationLink(card);
    card.dataset.productionUpdateAug11 = VERSION;
    return true;
  }

  function syncPendingSection(panel) {
    if (!panel) return;
    panel.querySelectorAll('.ap3-pending-row').forEach(row => {
      const ids = sceneIds(row);
      if (ids.includes('12A')) {
        row.remove();
        return;
      }
      if (ids.includes('13A') && ids.includes('13B')) {
        row.querySelectorAll('[data-scene-link="13A"]').forEach(link => link.remove());
        const strong = row.querySelector('strong');
        const text = row.querySelector('span');
        if (strong) strong.textContent = 'Dreng blændes af solen';
        if (text) text.textContent = 'Scene 13B har ikke fået fast dato eller location i den aktuelle produktionsplan.';
      }
    });
    panel.querySelectorAll('.ap3-section').forEach(section => {
      if (!/Scener uden fast dato|Åbne scener/i.test(section.textContent || '')) return;
      const count = section.querySelectorAll('.ap3-pending-row').length;
      const counter = section.querySelector('.ap3-count');
      if (counter) counter.textContent = section.closest('#panel-schedule') ? `${count} STATUSGRUPPER` : String(count);
    });
  }

  function syncHomePlan() {
    const panel = document.getElementById('panel-schedule');
    const list = panel?.querySelector('.ap3-plan-list');
    if (!panel || !list) return false;

    [...list.querySelectorAll('.ap3-shoot')].forEach(patchAug17Card);

    let vestmanna = [...list.querySelectorAll('.ap3-shoot')].find(card => hasScenes(card, ['9A', '9B', '9C']));
    const newVestmanna = elementFromMarkup(shootMarkup(AUG19_VESTMANNA));
    if (vestmanna) vestmanna.replaceWith(newVestmanna);
    else list.appendChild(newVestmanna);

    list.querySelectorAll('[data-production-plan-aug11="aug19-13a"], [data-production-plan-aug11="aug19-12a"]').forEach(card => card.remove());
    const solar = elementFromMarkup(shootMarkup(AUG19_SOLAR));
    const stream = elementFromMarkup(shootMarkup(AUG19_STREAM));
    newVestmanna.insertAdjacentElement('afterend', solar);
    solar.insertAdjacentElement('afterend', stream);

    syncPendingSection(panel);
    panel.dataset.productionPlanAug11 = VERSION;
    return true;
  }

  function ensureHeiniOption(select) {
    if (!select || select.querySelector(`option[value="${HEINI_ID}"]`)) return;
    const option = document.createElement('option');
    option.value = HEINI_ID;
    option.textContent = HEINI_LABEL;
    const helena = select.querySelector('option[value="helena"]');
    if (helena) helena.insertAdjacentElement('afterend', option);
    else select.appendChild(option);
  }

  function ensureSelectors() {
    ensureHeiniOption(document.getElementById('ap3-home-person'));
    ensureHeiniOption(document.getElementById('ap3-person-select'));
  }

  function selectedPerson() {
    const select = document.getElementById('ap3-person-select');
    if (select?.value) return select.value;
    try {
      const value = localStorage.getItem(STORAGE_KEY) || '';
      return value === 'all' ? '' : value;
    } catch (_) {
      return '';
    }
  }

  function buildPersonalSelect(selected) {
    const home = document.getElementById('ap3-home-person');
    if (home) {
      ensureHeiniOption(home);
      const clone = home.cloneNode(true);
      clone.id = 'ap3-person-select';
      clone.value = selected;
      return clone.outerHTML;
    }
    return `<select id="ap3-person-select"><option value="">— Vælg dit navn —</option><option value="${HEINI_ID}" selected>${HEINI_LABEL}</option></select>`;
  }

  function homeCardFor(config) {
    return document.querySelector(`#panel-schedule [data-production-plan-aug11="${config.key}"]`);
  }

  function renderHeiniPersonal() {
    const panel = document.getElementById('panel-my-schedule');
    const homeList = document.querySelector('#panel-schedule .ap3-plan-list');
    if (!panel || !homeList) return false;
    const aug17 = [...homeList.querySelectorAll('.ap3-shoot')].find(isAug17Card);
    const sources = [aug17, homeCardFor(AUG19_VESTMANNA), homeCardFor(AUG19_SOLAR), homeCardFor(AUG19_STREAM)].filter(Boolean);
    const cards = sources.map(source => source.cloneNode(true));
    cards.forEach(patchAug17Card);

    panel.innerHTML = `<div class="ap3-head"><h2>Mit skema</h2><p>Vælg dit navn. Herefter vises kun de optagedage og åbne scener, der vedrører dig.</p></div><div class="ap3-namebox"><label for="ap3-person-select">VÆLG DIT NAVN</label><p>Valget gemmes på denne enhed.</p>${buildPersonalSelect(HEINI_ID)}</div><div class="ap3-person-summary"><strong>Heini Dam Lassen</strong>Skuespiller · dreng · ${cards.length} planlagte optagelser.</div><div class="ap3-plan-list" id="heini-personal-plan"></div>`;
    const plan = panel.querySelector('#heini-personal-plan');
    cards.forEach(card => plan?.appendChild(card));
    panel.dataset.productionPlanAug11 = VERSION;

    panel.querySelector('#ap3-person-select')?.addEventListener('change', event => {
      const value = event.target.value;
      if (value === HEINI_ID) return;
      try { localStorage.setItem(STORAGE_KEY, value || 'all'); } catch (_) {}
      const home = document.getElementById('ap3-home-person');
      if (home) {
        home.value = value;
        home.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    return true;
  }

  function syncRegularPersonal(personId) {
    const panel = document.getElementById('panel-my-schedule');
    const list = panel?.querySelector('.ap3-plan-list');
    if (!panel || !list || !personId) return false;

    [...list.querySelectorAll('.ap3-shoot')].forEach(patchAug17Card);

    const oldVestmanna = [...list.querySelectorAll('.ap3-shoot')].find(card => hasScenes(card, ['9A', '9B', '9C']));
    if (PERSONAL_RELEVANCE[AUG19_VESTMANNA.key].has(personId)) {
      const replacement = homeCardFor(AUG19_VESTMANNA)?.cloneNode(true) || elementFromMarkup(shootMarkup(AUG19_VESTMANNA));
      if (oldVestmanna) oldVestmanna.replaceWith(replacement);
      else list.appendChild(replacement);
    } else if (oldVestmanna) {
      oldVestmanna.remove();
    }

    list.querySelectorAll('[data-production-plan-aug11="aug19-13a"], [data-production-plan-aug11="aug19-12a"]').forEach(card => card.remove());
    [AUG19_SOLAR, AUG19_STREAM].forEach(config => {
      if (!PERSONAL_RELEVANCE[config.key].has(personId)) return;
      const card = homeCardFor(config)?.cloneNode(true) || elementFromMarkup(shootMarkup(config));
      list.appendChild(card);
    });

    syncPendingSection(panel);
    const summary = panel.querySelector('.ap3-person-summary');
    if (summary) {
      const count = list.querySelectorAll('.ap3-shoot').length;
      summary.innerHTML = summary.innerHTML.replace(/\d+ planlagte optagelser/, `${count} planlagte optagelser`);
    }
    panel.dataset.productionPlanAug11 = VERSION;
    return true;
  }

  function syncPersonal() {
    ensureSelectors();
    const personId = selectedPerson();
    if (!personId) return;
    if (personId === HEINI_ID) renderHeiniPersonal();
    else syncRegularPersonal(personId);
  }

  function syncAll() {
    addStyles();
    syncHomePlan();
    ensureSelectors();
    if (document.getElementById('panel-my-schedule')?.classList.contains('active')) syncPersonal();
    document.documentElement.dataset.productionUpdateAug11 = VERSION;
  }

  function installEvents() {
    if (document.documentElement.dataset.productionUpdateAug11Events === VERSION) return;
    document.documentElement.dataset.productionUpdateAug11Events = VERSION;

    document.addEventListener('change', event => {
      const select = event.target instanceof HTMLSelectElement ? event.target : null;
      if (!select || !['ap3-home-person', 'ap3-person-select'].includes(select.id)) return;
      if (select.value === HEINI_ID) {
        event.preventDefault();
        event.stopImmediatePropagation();
        try { localStorage.setItem(STORAGE_KEY, HEINI_ID); } catch (_) {}
        window.setTimeout(() => {
          syncHomePlan();
          renderHeiniPersonal();
          if (typeof window.openPortalTab === 'function') window.openPortalTab('my-schedule');
          else document.querySelector('nav.tabs button[data-tab="my-schedule"]')?.click();
        }, 0);
        return;
      }
      window.setTimeout(() => {
        syncHomePlan();
        syncPersonal();
      }, 0);
    }, true);

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('nav.tabs button[data-tab="schedule"], .brand, [data-home]')) {
        window.setTimeout(syncAll, 0);
      }
      if (target.closest('nav.tabs button[data-tab="my-schedule"], [data-open-personal]')) {
        window.setTimeout(() => {
          syncHomePlan();
          syncPersonal();
        }, 0);
      }
    }, true);
  }

  function start() {
    installEvents();
    syncAll();
    [350, 900, 1800, 3200].forEach(delay => window.setTimeout(syncAll, delay));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
