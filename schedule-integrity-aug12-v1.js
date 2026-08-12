(() => {
  'use strict';

  const VERSION = '2026-08-12-1458';
  const STORAGE_KEY = 'sev-task-person';
  let sessionPerson = '';

  const WEDNESDAY = [
    { key: 'aug19-10a', scenes: ['10A'], relevant: new Set(['michael','thomas','heidi','bjarni']) },
    { key: 'aug19-9abc', scenes: ['9A','9B','9C'], relevant: new Set(['michael','thomas','runi','heidi','helena','heini']) },
    { key: 'aug19-13a', scenes: ['13A','13B'], relevant: new Set(['michael','thomas','heidi','helena','heini']) },
    { key: 'aug19-12a', scenes: ['12A'], relevant: new Set(['michael','thomas','heidi','helena','heini']) },
    { key: 'aug19-14a', scenes: ['14A'], relevant: new Set(['michael','thomas','heidi','heini']) }
  ];

  function cardText(card) {
    return (card?.textContent || '').replace(/\s+/g, ' ');
  }

  function sceneIds(card) {
    return [...(card?.querySelectorAll('[data-scene-link]') || [])]
      .map(link => String(link.dataset.sceneLink || '').toUpperCase())
      .filter(Boolean);
  }

  function isAug17(card) {
    const text = cardText(card);
    return /17\. AUGUST/i.test(text) && /Skálabúðin/i.test(text) && sceneIds(card).includes('1A');
  }

  function setTime(item, value) {
    const target = item?.querySelector('b');
    if (target) target.textContent = value;
  }

  function patchAug17(card) {
    if (!isAug17(card)) return;
    const grid = card.querySelector('.ap3-time-grid');
    if (!grid) return;

    let makeupItem = null;
    let actorItem = null;
    let shootItem = null;
    let crewItem = null;

    [...grid.querySelectorAll('.ap3-time')].forEach(item => {
      const label = item.querySelector('span')?.textContent || '';
      if (/Crew/i.test(label)) crewItem = item;
      else if (/Make-up/i.test(label)) makeupItem = item;
      else if (/Skuespillere/i.test(label)) actorItem = item;
      else if (/Optagelse/i.test(label)) shootItem = item;
    });

    setTime(crewItem, '12:00');
    setTime(makeupItem, '15:00');
    setTime(actorItem, '16:00');
    setTime(shootItem, '16:30');

    if (makeupItem?.querySelector('small')) makeupItem.querySelector('small').textContent = 'Niels Finsensgøta 22 / Kongagøta 4';
    card.dataset.scheduleIntegrityAug12 = VERSION;
  }

  function patchWednesdayCard(card) {
    const ids = sceneIds(card);
    if (ids.includes('10A')) {
      card.querySelectorAll('.ap3-time').forEach(item => setTime(item, '11:00–12:00'));
    }
    if (ids.includes('9A') && ids.includes('9B') && ids.includes('9C')) {
      card.querySelectorAll('.ap3-time').forEach(item => {
        const label = item.querySelector('span')?.textContent || '';
        if (/Make-up|skuespillere/i.test(label)) setTime(item, '12:00');
        else if (/Crew/i.test(label)) setTime(item, '12:30');
        else if (/Optagelse/i.test(label)) setTime(item, '13:30–15:00');
      });
    }
    if (ids.includes('13A')) {
      card.querySelectorAll('.ap3-time').forEach(item => setTime(item, '15:00–16:30'));
    }
    if (ids.includes('12A')) {
      card.querySelectorAll('.ap3-time').forEach(item => setTime(item, '17:00–18:30'));
    }
    if (ids.includes('14A')) {
      card.querySelectorAll('.ap3-time').forEach(item => setTime(item, '18:30–19:30'));
    }
    card.dataset.scheduleIntegrityAug12 = VERSION;
  }

  function patchAllTimes(scope) {
    scope?.querySelectorAll('.ap3-shoot').forEach(card => {
      patchAug17(card);
      patchWednesdayCard(card);
    });
  }

  function ensureBjarniOption(select) {
    if (!select || select.querySelector('option[value="bjarni"]')) return;
    const option = document.createElement('option');
    option.value = 'bjarni';
    option.textContent = 'Bjarni Lamhauge · Skuespiller · scene 10A';
    select.appendChild(option);
  }

  function ensurePersonOptions() {
    ensureBjarniOption(document.getElementById('ap3-home-person'));
    ensureBjarniOption(document.getElementById('ap3-person-select'));
  }

  function storedPerson() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || '';
      return stored === 'all' ? '' : stored;
    } catch (_) {
      return '';
    }
  }

  function currentPerson() {
    if (sessionPerson) return sessionPerson;
    const stored = storedPerson();
    if (stored) return stored;
    const select = document.getElementById('ap3-person-select');
    if (select?.value) return select.value;
    const homeSelect = document.getElementById('ap3-home-person');
    return homeSelect?.value || '';
  }

  function syncSelectedOptions(person) {
    if (!person) return;
    ['ap3-home-person', 'ap3-person-select'].forEach(id => {
      const select = document.getElementById(id);
      if (select?.querySelector(`option[value="${person}"]`)) select.value = person;
    });
  }

  function homeCardFor(config) {
    const list = document.querySelector('#panel-schedule .ap3-plan-list');
    if (!list) return null;
    const keyed = list.querySelector(`[data-production-plan-aug11="${config.key}"]`);
    if (keyed) return keyed;
    return [...list.querySelectorAll('.ap3-shoot')].find(card => {
      const ids = new Set(sceneIds(card));
      return config.scenes.every(id => ids.has(id));
    }) || null;
  }

  function removeWednesdayCards(list) {
    list?.querySelectorAll('.ap3-shoot').forEach(card => {
      const text = cardText(card);
      const ids = sceneIds(card);
      const isWednesday = /19\. AUGUST/i.test(text) || WEDNESDAY.some(config => config.scenes.some(id => ids.includes(id)));
      if (isWednesday) card.remove();
    });
  }

  function syncPersonalWednesday() {
    const panel = document.getElementById('panel-my-schedule');
    const list = panel?.querySelector('.ap3-plan-list');
    if (!panel || !list) return;

    ensurePersonOptions();
    const person = currentPerson();
    syncSelectedOptions(person);
    removeWednesdayCards(list);

    if (!person) return;

    WEDNESDAY.forEach(config => {
      if (!config.relevant.has(person)) return;
      const home = homeCardFor(config);
      if (!home) return;
      const clone = home.cloneNode(true);
      patchWednesdayCard(clone);
      list.appendChild(clone);
    });

    patchAllTimes(panel);
    panel.dataset.personalScheduleVerifiedAug12 = VERSION;
    panel.dataset.personalSchedulePerson = person;
  }

  function refresh() {
    ensurePersonOptions();
    patchAllTimes(document.getElementById('panel-schedule'));
    patchAllTimes(document.getElementById('panel-my-schedule'));
    if (document.getElementById('panel-my-schedule')?.classList.contains('active')) syncPersonalWednesday();
    document.documentElement.dataset.scheduleIntegrityAug12 = VERSION;
  }

  function repeatedSync() {
    [30, 140, 360, 800].forEach(delay => window.setTimeout(() => {
      ensurePersonOptions();
      if (document.getElementById('panel-my-schedule')?.classList.contains('active')) syncPersonalWednesday();
      patchAllTimes(document.getElementById('panel-my-schedule'));
    }, delay));
  }

  function installEvents() {
    if (document.documentElement.dataset.scheduleIntegrityAug12Events === VERSION) return;
    document.documentElement.dataset.scheduleIntegrityAug12Events = VERSION;

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('nav.tabs button[data-tab="schedule"], nav.tabs button[data-tab="my-schedule"], [data-open-personal], .brand, [data-home]')) {
        window.setTimeout(refresh, 120);
        repeatedSync();
      }
    }, true);

    document.addEventListener('change', event => {
      const select = event.target instanceof HTMLSelectElement ? event.target : null;
      if (!select || !['ap3-home-person','ap3-person-select'].includes(select.id)) return;
      sessionPerson = select.value || '';
      try { localStorage.setItem(STORAGE_KEY, sessionPerson); } catch (_) {}
      repeatedSync();
    }, true);
  }

  function start() {
    sessionPerson = storedPerson();
    installEvents();
    refresh();
    [500, 1200, 2300, 3800].forEach(delay => window.setTimeout(refresh, delay));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
