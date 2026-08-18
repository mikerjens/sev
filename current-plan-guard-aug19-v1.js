(() => {
  'use strict';

  const VERSION = '2026-08-18-1051';
  const READY_CLASS = 'sev-current-plan-ready';
  const SELECT_IDS = new Set(['ap3-home-person', 'ap3-person-select']);

  function sceneIds(card) {
    return [...(card?.querySelectorAll('[data-scene-link]') || [])]
      .map(link => String(link.dataset.sceneLink || '').toUpperCase())
      .filter(Boolean);
  }

  function setTime(card, value) {
    card?.querySelectorAll('.ap3-time b').forEach(el => { el.textContent = value; });
  }

  function patchCurrentTimes(scope) {
    scope?.querySelectorAll('.ap3-shoot').forEach(card => {
      const ids = sceneIds(card);
      if (ids.includes('10A')) setTime(card, '09:00–10:00');
      else if (ids.includes('9A') && ids.includes('9B') && ids.includes('9C')) setTime(card, '10:00–12:00');
      else if (ids.includes('13A') && ids.includes('13B')) setTime(card, '12:00–13:30');
      else if (ids.includes('12A')) setTime(card, '14:00–15:00');
      else if (ids.includes('14A')) setTime(card, '15:00–17:00');
    });
  }

  function authoritativeReady() {
    const schedule = document.getElementById('panel-schedule');
    if (!schedule?.dataset.aug19Authoritative) return false;
    const scene10 = [...schedule.querySelectorAll('.ap3-shoot')].find(card => sceneIds(card).includes('10A'));
    return Boolean(scene10 && /09:00–10:00/.test(scene10.textContent || ''));
  }

  function finish() {
    patchCurrentTimes(document.getElementById('panel-schedule'));
    patchCurrentTimes(document.getElementById('panel-my-schedule'));
    if (authoritativeReady()) document.documentElement.classList.add(READY_CLASS);
    document.documentElement.dataset.currentPlanGuardAug19 = VERSION;
  }

  function guardedRefresh() {
    document.documentElement.classList.remove(READY_CLASS);
    [25, 70, 140, 280].forEach(delay => window.setTimeout(finish, delay));
  }

  document.addEventListener('change', event => {
    const select = event.target instanceof HTMLSelectElement ? event.target : null;
    if (!select || !SELECT_IDS.has(select.id)) return;
    guardedRefresh();
  }, true);

  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    if (target.closest('nav.tabs button[data-tab="schedule"], nav.tabs button[data-tab="my-schedule"], [data-open-personal], .brand, [data-home]')) {
      [20, 80, 180].forEach(delay => window.setTimeout(finish, delay));
    }
  }, true);

  function start() {
    document.documentElement.classList.remove(READY_CLASS);
    [0, 40, 100, 220, 500, 1000].forEach(delay => window.setTimeout(finish, delay));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
