(() => {
  'use strict';

  const VERSION = '2026-08-12-1359';
  const STORAGE_KEY = 'sev-task-person';
  const RELEVANT = new Set(['michael', 'thomas', 'heidi', 'heini']);

  const CARD_HTML = `<article class="ap3-shoot" data-production-plan-aug11="aug19-14a" data-scene14a-aug19="${VERSION}">
    <div class="ap3-shoot-top"><div><div class="ap3-kicker">ONSDAG 19. AUGUST</div><h3>Dreng blæser udenfor</h3><div class="ap3-location">📍 Location ukendt</div></div><span class="ap3-status">PLANLAGT</span></div>
    <div class="ap3-scenes"><a class="scene-portal-link" href="#storyboard-14a" data-scene-link="14A">14A<span class="ap3-scene-label">· Dreng blæser udenfor</span></a></div>
    <div class="ap3-time-grid"><div class="ap3-time"><span>Optagelse</span><b>18:30–19:30</b></div></div>
    <div class="ap3-details">
      <section class="ap3-detail-box"><h4>Hvem er med?</h4><div class="ap3-people"><span class="ap3-person">Thomas Koba · Instruktør og filmmaker</span><span class="ap3-person">Michael Koba · Filmproducer</span><span class="ap3-person">Heini Dam Lassen · dreng</span><span class="ap3-person">Heidi Mortensen · Styling</span></div></section>
      <section class="ap3-detail-box"><h4>Rekvisitter · styling · udstyr</h4><ul><li>Lille plastikvindmølle</li><li>Heini skal have samme tøj som i scene 9A, 9B og 9C</li></ul></section>
      <section class="ap3-detail-box"><h4>✓ På plads</h4><ul><li>Dato og tidspunkt er fastlagt.</li><li>Heini Dam Lassen medvirker.</li><li>Heidi Mortensen står for styling.</li></ul></section>
      <section class="ap3-detail-box missing"><h4>⚠ Mangler / skal afklares</h4><ul><li>Location skal findes og bekræftes.</li></ul></section>
    </div>
    <div class="ap3-note"><b>Sceneinfo:</b> Scene 14A filmes onsdag 19. august kl. 18:30–19:30. Heini blæser på en lille plastikvindmølle. Location er endnu ikke fastlagt.</div>
    <div class="ap3-actions"><a class="ap3-action primary scene-portal-link" href="#storyboard-14a" data-scene-link="14A">Åbn storyboard</a><button class="ap3-action secondary" type="button" data-open-team>TEAM · telefonnumre</button><button class="ap3-action secondary" type="button" data-open-personal>Mit skema</button></div>
  </article>`;

  function makeCard() {
    const template = document.createElement('template');
    template.innerHTML = CARD_HTML.trim();
    return template.content.firstElementChild;
  }

  function sceneIds(row) {
    return [...(row?.querySelectorAll('[data-scene-link]') || [])]
      .map(link => String(link.dataset.sceneLink || '').toUpperCase())
      .filter(Boolean);
  }

  function removePending(scope) {
    scope?.querySelectorAll('.ap3-pending-row').forEach(row => {
      if (sceneIds(row).includes('14A')) row.remove();
    });
  }

  function patchWednesdayTimes(scope) {
    scope?.querySelectorAll('.ap3-shoot').forEach(card => {
      const ids = sceneIds(card);
      const time = card.querySelector('.ap3-time b');
      if (ids.includes('13A') && time) time.textContent = '15:00–16:30';
      if (ids.includes('12A') && time) time.textContent = '17:00–18:30';

      if (ids.includes('13A')) {
        const note = card.querySelector('.ap3-note');
        if (note) note.innerHTML = '<b>Sceneinfo:</b> Scene 13A og 13B filmes sammen onsdag 19. august kl. 15:00–16:30 i Vestmanna. Præcis location afstemmes med Thomas. Skuespillerne fortsætter i samme tøj som i scene 9A, 9B og 9C.';
      }
      if (ids.includes('12A')) {
        const note = card.querySelector('.ap3-note');
        if (note) note.innerHTML = '<b>Sceneinfo:</b> Scene 12A filmes onsdag 19. august kl. 17:00–18:30. Location er endnu ikke fastlagt. Skuespillerne fortsætter i samme tøj som i scene 9A–9C.';
      }
    });
  }

  function insertHomeCard() {
    const list = document.querySelector('#panel-schedule .ap3-plan-list');
    if (!list) return;

    list.querySelectorAll('[data-production-plan-aug11="aug19-14a"]').forEach((card, index) => {
      if (index > 0) card.remove();
    });
    if (list.querySelector('[data-production-plan-aug11="aug19-14a"]')) return;

    const card = makeCard();
    const stream = [...list.querySelectorAll('.ap3-shoot')].find(item => sceneIds(item).includes('12A'));
    if (stream) stream.insertAdjacentElement('afterend', card);
    else list.appendChild(card);
  }

  function currentPerson() {
    const select = document.getElementById('ap3-person-select');
    if (select?.value) return select.value;
    try { return localStorage.getItem(STORAGE_KEY) || ''; } catch (_) { return ''; }
  }

  function syncPersonal() {
    const panel = document.getElementById('panel-my-schedule');
    const list = panel?.querySelector('.ap3-plan-list');
    if (!panel || !list) return;

    list.querySelectorAll('[data-production-plan-aug11="aug19-14a"]').forEach(card => card.remove());
    const person = currentPerson();
    if (RELEVANT.has(person)) {
      const home = document.querySelector('#panel-schedule [data-production-plan-aug11="aug19-14a"]');
      const card = home?.cloneNode(true) || makeCard();
      const stream = [...list.querySelectorAll('.ap3-shoot')].find(item => sceneIds(item).includes('12A'));
      if (stream) stream.insertAdjacentElement('afterend', card);
      else list.appendChild(card);
    }

    removePending(panel);
    patchWednesdayTimes(panel);
  }

  function refresh() {
    insertHomeCard();
    const home = document.getElementById('panel-schedule');
    removePending(home);
    patchWednesdayTimes(home);
    if (document.getElementById('panel-my-schedule')?.classList.contains('active')) syncPersonal();
    document.documentElement.dataset.scene14aAug19 = VERSION;
  }

  function installEvents() {
    if (document.documentElement.dataset.scene14aAug19Events === VERSION) return;
    document.documentElement.dataset.scene14aAug19Events = VERSION;

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('nav.tabs button[data-tab="schedule"], nav.tabs button[data-tab="my-schedule"], [data-open-personal], .brand, [data-home]')) {
        window.setTimeout(refresh, 80);
      }
    }, true);

    document.addEventListener('change', event => {
      const select = event.target instanceof HTMLSelectElement ? event.target : null;
      if (select && ['ap3-home-person', 'ap3-person-select'].includes(select.id)) window.setTimeout(refresh, 80);
    }, true);
  }

  function start() {
    installEvents();
    refresh();
    [450, 1100, 2100, 3600].forEach(delay => window.setTimeout(refresh, delay));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
