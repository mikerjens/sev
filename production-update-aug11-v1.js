(() => {
  'use strict';

  const VERSION = '2026-08-11-1110';
  const STORAGE_KEY = 'sev-task-person';
  const HEINI_ID = 'heini';
  const HEINI_LABEL = 'Heini Dam Lassen · Skuespiller · dreng';
  const LOCATION_URL = 'https://www.airbnb.dk/rooms/17985150?unique_share_id=d24602e0-e283-4688-8c00-39153d143b81&viralityEntryPoint=1&s=76&source_impression_id=p3_1786370596_P3Bm4DyxDVfA1x9G';

  function addStyles() {
    if (document.getElementById('production-update-aug11-styles')) return;
    const style = document.createElement('style');
    style.id = 'production-update-aug11-styles';
    style.textContent = `
      .ap3-time small{display:block;margin-top:5px;color:var(--text-muted);font-size:9.5px;line-height:1.35}
    `;
    document.head.appendChild(style);
  }

  function isAug17Card(card) {
    const text = (card?.textContent || '').replace(/\s+/g, ' ');
    return /17\. AUGUST/i.test(text) && /Indendørs optagelser/i.test(text) && /Skálabúðin/i.test(text);
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

  function patchAug17Card(card) {
    if (!card || !isAug17Card(card)) return false;

    card.querySelectorAll('.ap3-person').forEach(person => {
      if (/Dreng X/i.test(person.textContent || '')) person.textContent = 'Heini Dam Lassen · skuespiller · dreng';
    });

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

    const boxes = [...card.querySelectorAll('.ap3-detail-box')];
    const readyBox = boxes.find(box => /På plads/i.test(box.querySelector('h4')?.textContent || ''));
    const missingBox = boxes.find(box => /Mangler/i.test(box.querySelector('h4')?.textContent || ''));

    if (missingBox) {
      missingBox.querySelectorAll('li').forEach(li => {
        if (/Dreng X/i.test(li.textContent || '')) li.remove();
      });
    }

    if (readyBox) {
      readyBox.querySelectorAll('li').forEach(li => {
        if (/alle tre mødetider/i.test(li.textContent || '')) li.textContent = 'Crew, make-up, skuespillermøde og optagestart er fastlagt.';
      });
      const list = readyBox.querySelector('ul');
      if (list && ![...list.querySelectorAll('li')].some(li => /Heini Dam Lassen/i.test(li.textContent || ''))) {
        const li = document.createElement('li');
        li.textContent = 'Heini Dam Lassen er bekræftet som dreng.';
        list.appendChild(li);
      }
    }

    ensureLocationLink(card);
    card.dataset.productionUpdateAug11 = VERSION;
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

  function currentPerson() {
    try { return localStorage.getItem(STORAGE_KEY) || ''; } catch (_) { return ''; }
  }

  function buildPersonalSelect(selected) {
    const home = document.getElementById('ap3-home-person');
    if (home) {
      const clone = home.cloneNode(true);
      clone.id = 'ap3-person-select';
      clone.value = selected;
      return clone.outerHTML;
    }
    return `<select id="ap3-person-select"><option value="">— Vælg dit navn —</option><option value="${HEINI_ID}" selected>${HEINI_LABEL}</option></select>`;
  }

  function renderHeiniPersonal() {
    const panel = document.getElementById('panel-my-schedule');
    const source = [...document.querySelectorAll('#panel-schedule .ap3-shoot')].find(isAug17Card);
    if (!panel || !source) return false;

    const card = source.cloneNode(true);
    patchAug17Card(card);

    panel.innerHTML = `<div class="ap3-head"><h2>Mit skema</h2><p>Vælg dit navn. Herefter vises kun de optagedage og åbne scener, der vedrører dig.</p></div><div class="ap3-namebox"><label for="ap3-person-select">VÆLG DIT NAVN</label><p>Valget gemmes på denne enhed.</p>${buildPersonalSelect(HEINI_ID)}</div><div class="ap3-person-summary"><strong>Heini Dam Lassen</strong>Skuespiller · dreng · 1 planlagt optagelse.</div><div class="ap3-plan-list" id="heini-personal-plan"></div>`;
    panel.querySelector('#heini-personal-plan')?.appendChild(card);
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

  function patchVisiblePlans() {
    addStyles();
    document.querySelectorAll('#panel-schedule .ap3-shoot, #panel-my-schedule .ap3-shoot').forEach(patchAug17Card);
    ensureSelectors();
    if (currentPerson() === HEINI_ID && document.getElementById('panel-my-schedule')?.classList.contains('active')) renderHeiniPersonal();
    document.documentElement.dataset.productionUpdateAug11 = VERSION;
  }

  function installEvents() {
    if (document.documentElement.dataset.productionUpdateAug11Events === VERSION) return;
    document.documentElement.dataset.productionUpdateAug11Events = VERSION;

    document.addEventListener('change', event => {
      const select = event.target instanceof HTMLSelectElement ? event.target : null;
      if (!select || !['ap3-home-person', 'ap3-person-select'].includes(select.id) || select.value !== HEINI_ID) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      try { localStorage.setItem(STORAGE_KEY, HEINI_ID); } catch (_) {}
      renderHeiniPersonal();
      if (typeof window.openPortalTab === 'function') window.openPortalTab('my-schedule');
      else document.querySelector('nav.tabs button[data-tab="my-schedule"]')?.click();
    }, true);

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('nav.tabs button[data-tab="schedule"], .brand, [data-home]')) {
        window.setTimeout(patchVisiblePlans, 0);
      }
      if (target.closest('nav.tabs button[data-tab="my-schedule"], [data-open-personal]')) {
        window.setTimeout(() => {
          if (currentPerson() === HEINI_ID) renderHeiniPersonal();
          else patchVisiblePlans();
        }, 0);
      }
    }, true);
  }

  function start() {
    installEvents();
    patchVisiblePlans();
    [350, 900, 1800, 3200].forEach(delay => window.setTimeout(patchVisiblePlans, delay));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
