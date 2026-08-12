(() => {
  'use strict';

  const VERSION = '2026-08-12-1253';
  const STORAGE_KEY = 'sev-task-person';
  const RELEVANT = new Set(['michael', 'thomas', 'heidi']);

  const CARD_HTML = `<article class="ap3-shoot" data-production-plan-aug11="aug19-10a" data-scene10a-aug19="${VERSION}">
    <div class="ap3-shoot-top"><div><div class="ap3-kicker">ONSDAG 19. AUGUST</div><h3>Tøj på tørresnoren</h3><div class="ap3-location">📍 Miðalsbrekka, Vestmanna</div></div><span class="ap3-status">PLANLAGT</span></div>
    <div class="ap3-scenes"><a class="scene-portal-link" href="#storyboard-10a" data-scene-link="10A">10A<span class="ap3-scene-label">· Tøj på tørresnoren</span></a></div>
    <div class="ap3-time-grid"><div class="ap3-time"><span>Optagelse</span><b>11:00–12:00</b></div></div>
    <div class="ap3-details">
      <section class="ap3-detail-box"><h4>Hvem er med?</h4><div class="ap3-people"><span class="ap3-person">Thomas Koba · Instruktør og filmmaker</span><span class="ap3-person">Michael Koba · Filmproducer</span><span class="ap3-person">Bjarni Lamhauge · skuespiller</span><span class="ap3-person">Heidi Mortensen · Styling & props</span></div></section>
      <section class="ap3-detail-box"><h4>Rekvisitter · styling · udstyr</h4><ul><li>Tøj til at hænge på snoren</li><li>Tøj til snor mand · Bjarni Lamhauge</li></ul></section>
      <section class="ap3-detail-box"><h4>✓ På plads</h4><ul><li>Dato og tidspunkt er fastlagt.</li><li>Location: Miðalsbrekka, Vestmanna.</li><li>Bjarni Lamhauge er skuespiller i scenen.</li><li>Heidi Mortensen står for styling & props.</li></ul></section>
    </div>
    <div class="ap3-note"><b>Sceneinfo:</b> Scene 10A filmes onsdag 19. august kl. 11:00–12:00 på Miðalsbrekka i Vestmanna. Bjarni Lamhauge hænger tøj på tørresnoren.</div>
    <div class="ap3-actions"><a class="ap3-action primary scene-portal-link" href="#storyboard-10a" data-scene-link="10A">Åbn storyboard</a><button class="ap3-action secondary" type="button" data-open-team>TEAM · telefonnumre</button><button class="ap3-action secondary" type="button" data-open-personal>Mit skema</button></div>
  </article>`;

  function makeCard() {
    const template = document.createElement('template');
    template.innerHTML = CARD_HTML.trim();
    return template.content.firstElementChild;
  }

  function removePending(scope) {
    scope?.querySelectorAll('.ap3-pending-row').forEach(row => {
      const ids = [...row.querySelectorAll('[data-scene-link]')].map(link => String(link.dataset.sceneLink || '').toUpperCase());
      if (ids.includes('10A')) row.remove();
    });
  }

  function insertHomeCard() {
    const list = document.querySelector('#panel-schedule .ap3-plan-list');
    if (!list) return;
    list.querySelectorAll('[data-production-plan-aug11="aug19-10a"]').forEach(card => card.remove());

    const card = makeCard();
    const firstAug19 = [...list.querySelectorAll('.ap3-shoot')].find(item => /19\. AUGUST/i.test(item.textContent || ''));
    if (firstAug19) firstAug19.insertAdjacentElement('beforebegin', card);
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

    list.querySelectorAll('[data-production-plan-aug11="aug19-10a"]').forEach(card => card.remove());
    const person = currentPerson();
    if (RELEVANT.has(person)) {
      const home = document.querySelector('#panel-schedule [data-production-plan-aug11="aug19-10a"]');
      const card = home?.cloneNode(true) || makeCard();
      const firstAug19 = [...list.querySelectorAll('.ap3-shoot')].find(item => /19\. AUGUST/i.test(item.textContent || ''));
      if (firstAug19) firstAug19.insertAdjacentElement('beforebegin', card);
      else list.appendChild(card);
    }
    removePending(panel);
  }

  function refresh() {
    insertHomeCard();
    removePending(document.getElementById('panel-schedule'));
    if (document.getElementById('panel-my-schedule')?.classList.contains('active')) syncPersonal();
    document.documentElement.dataset.scene10aAug19 = VERSION;
  }

  function installEvents() {
    if (document.documentElement.dataset.scene10aAug19Events === VERSION) return;
    document.documentElement.dataset.scene10aAug19Events = VERSION;

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('nav.tabs button[data-tab="schedule"], nav.tabs button[data-tab="my-schedule"], [data-open-personal], .brand, [data-home]')) {
        window.setTimeout(refresh, 60);
      }
    }, true);

    document.addEventListener('change', event => {
      const select = event.target instanceof HTMLSelectElement ? event.target : null;
      if (select && ['ap3-home-person', 'ap3-person-select'].includes(select.id)) window.setTimeout(refresh, 60);
    }, true);
  }

  function start() {
    installEvents();
    refresh();
    [400, 1000, 1900].forEach(delay => window.setTimeout(refresh, delay));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
