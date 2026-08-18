(() => {
  'use strict';
  const VERSION = '2026-08-18-1125';

  function sceneIds(row) {
    return [...(row?.querySelectorAll('[data-scene-link]') || [])]
      .map(link => String(link.dataset.sceneLink || '').toUpperCase())
      .filter(Boolean);
  }

  function makeRow() {
    const row = document.createElement('article');
    row.className = 'ap3-pending-row';
    row.dataset.pendingScene8a = VERSION;
    row.innerHTML = `
      <div class="ap3-scenes">
        <a class="scene-portal-link" href="#storyboard-8a" data-scene-link="8A">
          8A<span class="ap3-scene-label">· Afventer planlægning</span>
        </a>
      </div>
      <div>
        <strong>Scene 8A</strong>
        <span>Ikke planlagt endnu. Dato, location og øvrige optagelsesdetaljer skal fastlægges.</span>
      </div>`;
    return row;
  }

  function sync() {
    const panel = document.getElementById('panel-schedule');
    const pending = panel?.querySelector('.ap3-pending');
    if (!panel || !pending) return;

    const existing = [...pending.querySelectorAll('.ap3-pending-row')].find(row => sceneIds(row).includes('8A'));
    if (!existing) pending.insertBefore(makeRow(), pending.firstElementChild || null);

    const count = pending.querySelectorAll('.ap3-pending-row').length;
    const countEl = panel.querySelector('.ap3-section .ap3-count');
    if (countEl) countEl.textContent = `${count} STATUSGRUPPER`;

    panel.dataset.pendingScene8a = VERSION;
  }

  function start() {
    sync();
    [250, 700, 1400].forEach(delay => window.setTimeout(sync, delay));
    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('nav.tabs button[data-tab="schedule"], .brand, [data-home]')) {
        window.setTimeout(sync, 80);
      }
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
