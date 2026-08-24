(() => {
  'use strict';

  const VERSION = '2026-08-24-0841';
  const DATE_LABEL = 'TIRSDAG 25. AUGUST';
  const STATUS_TEXT = 'VIGTIG STATUS: Tirsdag den 25. august er planlagt som optagedag. Der blev ikke foretaget optagelser lørdag den 22. august på grund af vejret.';
  const UPDATED_TEXT = 'Opdateret mandag 24. august 2026 kl. 08:41.';

  const TIMES = new Map([
    ['9A,9B,9C', '09:00–11:30'],
    ['13A,13B', '11:30–12:30'],
    ['12A', '13:00–14:30'],
    ['14A', '14:30–15:30'],
    ['10A', '15:30–16:30']
  ]);

  function sceneKey(card) {
    return [...(card?.querySelectorAll('[data-scene-link]') || [])]
      .map(link => String(link.dataset.sceneLink || '').toUpperCase())
      .filter(Boolean)
      .sort()
      .join(',');
  }

  function patchCards(scope = document) {
    scope.querySelectorAll('[data-aug22-authoritative]').forEach(card => {
      const kicker = card.querySelector('.ap3-kicker');
      if (kicker) kicker.textContent = DATE_LABEL;
      const time = TIMES.get(sceneKey(card));
      if (time) card.querySelectorAll('.ap3-time b').forEach(el => { el.textContent = time; });
      card.dataset.aug25Final = VERSION;
    });

    scope.querySelectorAll('[data-aug22-makeup-call]').forEach(card => {
      const kicker = card.querySelector('.ap3-kicker');
      if (kicker) kicker.textContent = DATE_LABEL;
      card.querySelectorAll('.ap3-time b').forEach(el => { el.textContent = '08:00'; });
      card.dataset.aug25Final = VERSION;
    });
  }

  function patchBanner() {
    document.querySelectorAll('[data-aug22-status-banner]').forEach(banner => {
      banner.innerHTML = `<div style="font-weight:900;font-size:14px">${STATUS_TEXT}</div><div style="margin-top:4px;color:var(--text-muted);font-size:11px">${UPDATED_TEXT}</div>`;
      banner.dataset.aug25Final = VERSION;
    });
  }

  function patchGlance() {
    document.querySelectorAll('[data-aug22-glance]').forEach(glance => {
      const h3 = glance.querySelector('h3');
      if (h3) h3.textContent = DATE_LABEL;
      const rows = [...glance.querySelectorAll('div[style*="grid-template-columns:105px"]')];
      const values = [
        ['08:00', 'Make-up · Helena, Heini og Bjarni'],
        ['09:00–11:30', '9A–9C · Huset i Vestmanna'],
        ['11:30–12:30', '13A–13B · Hus og solpaneler'],
        ['13:00–14:30', '12A · Grøn energi fra et vandløb'],
        ['14:30–15:30', '14A · Dreng blæser udenfor'],
        ['15:30–16:30', '10A · Tøj på tørresnoren']
      ];
      rows.forEach((row, index) => {
        if (!values[index]) return;
        const b = row.querySelector('b');
        const span = row.querySelector('span');
        if (b) b.textContent = values[index][0];
        if (span) span.textContent = values[index][1];
      });
      glance.dataset.aug25Final = VERSION;
    });
  }

  function apply() {
    patchCards(document);
    patchBanner();
    patchGlance();
    document.documentElement.dataset.productionAug25Final = VERSION;
  }

  function delayedApply() {
    [20, 80, 180, 400, 900].forEach(delay => window.setTimeout(apply, delay));
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
