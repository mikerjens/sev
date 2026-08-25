(() => {
  'use strict';

  const VERSION = '2026-08-25-1025';
  const FILMED = new Set(['1A', '2A', '2B', '3A', '4A', '5A', '6A', '7A', '8A', '9A', '9B', '9C', '11A', '15A', '16A']);
  let applying = false;
  let queued = false;

  function removeFilmedShoots(panel) {
    if (!panel) return;
    panel.querySelectorAll('.ap3-shoot').forEach(card => {
      const scenes = [...card.querySelectorAll('[data-scene-link]')]
        .map(link => String(link.dataset.sceneLink || '').toUpperCase())
        .filter(Boolean);
      if (scenes.length && scenes.every(scene => FILMED.has(scene))) card.remove();
    });
  }

  function removeFilmedPending(panel) {
    if (!panel) return;
    panel.querySelectorAll('.ap3-pending-row').forEach(row => {
      const scenes = [...row.querySelectorAll('[data-scene-link]')]
        .map(link => String(link.dataset.sceneLink || '').toUpperCase())
        .filter(Boolean);
      if (scenes.length && scenes.every(scene => FILMED.has(scene))) row.remove();
    });
    panel.querySelectorAll('.ap3-section').forEach(section => {
      const pending = section.querySelector('.ap3-pending');
      if (!pending) return;
      const count = pending.querySelectorAll('.ap3-pending-row').length;
      const counter = section.querySelector('.ap3-count');
      if (counter) counter.textContent = `${count} STATUSGRUPPER`;
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
    if (applying) return;
    applying = true;
    try {
      const home = document.getElementById('panel-schedule');
      const personal = document.getElementById('panel-my-schedule');
      removeFilmedShoots(home);
      removeFilmedShoots(personal);
      removeFilmedPending(home);
      removeFilmedPending(personal);
      updatePersonalSummary();
      document.documentElement.dataset.hideFilmedFromSchedule = VERSION;
    } finally {
      applying = false;
    }
  }

  function scheduleApply() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      apply();
    });
  }

  const observer = new MutationObserver(() => {
    if (!applying) scheduleApply();
  });

  function start() {
    apply();
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(apply, 600);
    window.setTimeout(apply, 1600);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
