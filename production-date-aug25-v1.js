(() => {
  'use strict';

  const VERSION = '2026-08-19-1123';
  const DATE_LABEL = 'TIRSDAG 25. AUGUST';
  const DATE_LONG = 'Tirsdag den 25. august';

  function patchDateLabels(scope = document) {
    scope.querySelectorAll('[data-aug22-authoritative] .ap3-kicker, [data-aug22-makeup-call] .ap3-kicker').forEach(el => {
      el.textContent = DATE_LABEL;
    });
  }

  function patchStatus() {
    const banner = document.querySelector('[data-aug22-status-banner]');
    if (!banner) return;
    banner.innerHTML = `
      <div style="font-weight:900;font-size:14px">VIGTIG STATUS: ${DATE_LONG} er nu planlagt som optagedag.</div>
      <div style="margin-top:4px;color:var(--text-muted);font-size:11px">Optagelserne er flyttet til tirsdag 25. august. Opdateret onsdag 19. august 2026 kl. 11:23.</div>
    `;
    banner.dataset.currentProductionDate = VERSION;
  }

  function patchGlance() {
    const glance = document.querySelector('[data-aug22-glance]');
    if (!glance) return;
    const h3 = glance.querySelector('h3');
    if (h3) h3.textContent = DATE_LABEL;
    glance.dataset.currentProductionDate = VERSION;
  }

  function patchCards() {
    patchDateLabels(document);
    document.querySelectorAll('[data-aug22-authoritative]').forEach(card => {
      card.dataset.aug25Authoritative = VERSION;
    });
    document.querySelectorAll('[data-aug22-makeup-call]').forEach(card => {
      card.dataset.aug25MakeupCall = VERSION;
    });
  }

  function apply() {
    patchStatus();
    patchGlance();
    patchCards();
    document.documentElement.dataset.productionDateAug25 = VERSION;
  }

  function delayedApply() {
    [20, 80, 180, 400, 800].forEach(delay => window.setTimeout(apply, delay));
  }

  document.addEventListener('change', event => {
    const select = event.target instanceof HTMLSelectElement ? event.target : null;
    if (!select || !['ap3-home-person','ap3-person-select'].includes(select.id)) return;
    delayedApply();
  }, true);

  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    if (target.closest('nav.tabs button[data-tab="schedule"], nav.tabs button[data-tab="my-schedule"], [data-open-personal], .brand, [data-home]')) delayedApply();
  }, true);

  function start() {
    apply();
    [300, 700, 1400, 2600].forEach(delay => window.setTimeout(apply, delay));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
