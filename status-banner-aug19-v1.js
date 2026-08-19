(() => {
  'use strict';

  const VERSION = '2026-08-19-0925';
  const MESSAGE = 'VIGTIG STATUS: Lørdag den 22. august er nu planlagt som optagedag. Optagelserne kan dog blive flyttet til fredag den 21. august. Endelig beslutning om dette bliver truffet og meldt ud i god tid.';

  function apply() {
    document.querySelectorAll('[data-aug22-status-banner]').forEach(box => {
      box.innerHTML = `<div style="font-weight:900;font-size:14px">${MESSAGE}</div><div style="margin-top:4px;color:var(--text-muted);font-size:11px">Opdateret onsdag 19. august 2026 kl. 09:25.</div>`;
      box.dataset.statusBannerAug19 = VERSION;
    });
  }

  function start() {
    apply();
    [200, 600, 1200, 2400].forEach(delay => window.setTimeout(apply, delay));
    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('nav.tabs button[data-tab="schedule"], .brand, [data-home]')) {
        [30, 150, 400].forEach(delay => window.setTimeout(apply, delay));
      }
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
