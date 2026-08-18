(() => {
  'use strict';

  const VERSION = '2026-08-18-2247';
  const FILMED_AUG17 = new Set(['1A','2A','2B','15A','16A']);

  function sceneIds(card) {
    return [...(card?.querySelectorAll('[data-scene-link]') || [])]
      .map(link => String(link.dataset.sceneLink || '').toUpperCase())
      .filter(Boolean);
  }

  function cleanPanel(panel) {
    if (!panel) return;
    panel.querySelectorAll('.ap3-shoot').forEach(card => {
      const ids = sceneIds(card);
      if (ids.length && ids.every(id => FILMED_AUG17.has(id))) card.remove();
    });
  }

  function updatePersonalSummary() {
    const panel = document.getElementById('panel-my-schedule');
    const summary = panel?.querySelector('.ap3-person-summary');
    if (!panel || !summary) return;
    const count = panel.querySelectorAll('.ap3-plan-list .ap3-shoot').length;
    summary.innerHTML = summary.innerHTML.replace(/\d+ planlagte optagelser/, `${count} planlagte optagelser`);
  }

  function apply() {
    cleanPanel(document.getElementById('panel-schedule'));
    cleanPanel(document.getElementById('panel-my-schedule'));
    updatePersonalSummary();
    document.documentElement.dataset.filmedAug17Cleanup = VERSION;
  }

  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    if (target.closest('nav.tabs button, [data-open-personal], .brand, [data-home]')) {
      [30,120,350,800].forEach(delay => setTimeout(apply, delay));
    }
  }, true);

  document.addEventListener('change', event => {
    const target = event.target instanceof HTMLSelectElement ? event.target : null;
    if (!target || !['ap3-home-person','ap3-person-select'].includes(target.id)) return;
    [20,100,300,700].forEach(delay => setTimeout(apply, delay));
  }, true);

  function start() {
    [0,100,400,1000,2500,4000].forEach(delay => setTimeout(apply, delay));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once:true });
  else start();
})();
