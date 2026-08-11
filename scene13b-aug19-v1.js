(() => {
  'use strict';

  const VERSION = '2026-08-11-1316';

  function sceneIds(card) {
    return [...(card?.querySelectorAll('[data-scene-link]') || [])]
      .map(link => String(link.dataset.sceneLink || '').toUpperCase())
      .filter(Boolean);
  }

  function isSolarCard(card) {
    if (!card) return false;
    if (card.dataset.productionPlanAug11 === 'aug19-13a') return true;
    const text = (card.textContent || '').replace(/\s+/g, ' ');
    return /19\. AUGUST/i.test(text) && /13A/i.test(text) && /Hus og solpaneler/i.test(text);
  }

  function add13B(card) {
    if (!isSolarCard(card)) return false;

    const scenes = card.querySelector('.ap3-scenes');
    if (scenes && !scenes.querySelector('[data-scene-link="13B"]')) {
      const link = document.createElement('a');
      link.className = 'scene-portal-link';
      link.href = '#storyboard-13b';
      link.dataset.sceneLink = '13B';
      link.innerHTML = '13B<span class="ap3-scene-label">· Dreng blændes af solen</span>';
      scenes.appendChild(link);
    }

    const note = card.querySelector('.ap3-note');
    if (note) {
      note.innerHTML = '<b>Sceneinfo:</b> Scene 13A og 13B filmes sammen onsdag 19. august kl. 16:00–17:30 i Vestmanna. Præcis location afstemmes med Thomas. Skuespillerne fortsætter i samme tøj som i scene 9A, 9B og 9C.';
    }

    const readyBox = [...card.querySelectorAll('.ap3-detail-box')]
      .find(box => /På plads/i.test(box.querySelector('h4')?.textContent || ''));
    const readyList = readyBox?.querySelector('ul');
    if (readyList && ![...readyList.querySelectorAll('li')].some(li => /13A og 13B/i.test(li.textContent || ''))) {
      const li = document.createElement('li');
      li.textContent = 'Scene 13A og 13B er begge planlagt i samme optageblok.';
      readyList.appendChild(li);
    }

    card.dataset.scene13bAug19 = VERSION;
    return true;
  }

  function remove13BPending(scope) {
    scope?.querySelectorAll('.ap3-pending-row').forEach(row => {
      if (sceneIds(row).includes('13B')) row.remove();
    });

    scope?.querySelectorAll('.ap3-section').forEach(section => {
      if (!/Scener uden fast dato|Åbne scener/i.test(section.textContent || '')) return;
      const count = section.querySelectorAll('.ap3-pending-row').length;
      const counter = section.querySelector('.ap3-count');
      if (counter) counter.textContent = section.closest('#panel-schedule') ? `${count} STATUSGRUPPER` : String(count);
    });
  }

  function patch() {
    document.querySelectorAll('#panel-schedule .ap3-shoot, #panel-my-schedule .ap3-shoot').forEach(add13B);
    remove13BPending(document.getElementById('panel-schedule'));
    remove13BPending(document.getElementById('panel-my-schedule'));
    document.documentElement.dataset.scene13bAug19 = VERSION;
  }

  function installEvents() {
    if (document.documentElement.dataset.scene13bAug19Events === VERSION) return;
    document.documentElement.dataset.scene13bAug19Events = VERSION;

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('nav.tabs button[data-tab="schedule"], nav.tabs button[data-tab="my-schedule"], [data-open-personal], .brand, [data-home]')) {
        window.setTimeout(patch, 30);
      }
    }, true);

    document.addEventListener('change', event => {
      const select = event.target instanceof HTMLSelectElement ? event.target : null;
      if (select && ['ap3-home-person', 'ap3-person-select'].includes(select.id)) window.setTimeout(patch, 30);
    }, true);
  }

  function start() {
    installEvents();
    patch();
    [350, 900, 1800].forEach(delay => window.setTimeout(patch, delay));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
