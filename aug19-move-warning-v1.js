(() => {
  'use strict';

  const VERSION = '2026-08-12-1423';
  const TEXT = 'OBS: Alle optagelser planlagt onsdag 19. august kan blive flyttet til tirsdag 18. august. Endelig beslutning afventer.';

  function cardText(card) {
    return (card?.textContent || '').replace(/\s+/g, ' ');
  }

  function isAug19(card) {
    if (!card) return false;
    if (/19\. AUGUST/i.test(cardText(card))) return true;
    const ids = [...card.querySelectorAll('[data-scene-link]')].map(a => String(a.dataset.sceneLink || '').toUpperCase());
    return ids.some(id => ['10A','9A','9B','9C','13A','13B','12A','14A'].includes(id));
  }

  function addStyles() {
    if (document.getElementById('aug19-move-warning-styles')) return;
    const style = document.createElement('style');
    style.id = 'aug19-move-warning-styles';
    style.textContent = `
      .aug19-move-warning {
        margin: 0 0 14px;
        padding: 12px 14px;
        color: var(--signal);
        background: rgba(246,176,66,.12);
        border: 1px solid rgba(246,176,66,.55);
        border-left: 4px solid var(--signal);
        border-radius: 8px;
        font-size: 13px;
        font-weight: 700;
        line-height: 1.45;
      }
      .aug19-date-note {
        display: block;
        margin-top: 7px;
        color: var(--signal);
        font-family: 'IBM Plex Mono', monospace;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: .03em;
      }
    `;
    document.head.appendChild(style);
  }

  function patchPanel(panel) {
    const list = panel?.querySelector('.ap3-plan-list');
    if (!list) return;

    list.querySelectorAll('.aug19-move-warning').forEach(el => el.remove());
    list.querySelectorAll('.aug19-date-note').forEach(el => el.remove());

    const cards = [...list.querySelectorAll('.ap3-shoot')].filter(isAug19);
    if (!cards.length) return;

    const warning = document.createElement('div');
    warning.className = 'aug19-move-warning';
    warning.dataset.aug19MoveWarning = VERSION;
    warning.textContent = TEXT;
    cards[0].insertAdjacentElement('beforebegin', warning);

    cards.forEach(card => {
      const kicker = card.querySelector('.ap3-kicker');
      if (!kicker) return;
      const note = document.createElement('span');
      note.className = 'aug19-date-note';
      note.textContent = 'KAN EVT. FLYTTES TIL TIRSDAG 18. AUGUST';
      kicker.insertAdjacentElement('afterend', note);
    });
  }

  function refresh() {
    addStyles();
    patchPanel(document.getElementById('panel-schedule'));
    patchPanel(document.getElementById('panel-my-schedule'));
    document.documentElement.dataset.aug19MoveWarning = VERSION;
  }

  function installEvents() {
    if (document.documentElement.dataset.aug19MoveWarningEvents === VERSION) return;
    document.documentElement.dataset.aug19MoveWarningEvents = VERSION;

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('nav.tabs button[data-tab="schedule"], nav.tabs button[data-tab="my-schedule"], [data-open-personal], .brand, [data-home]')) {
        window.setTimeout(refresh, 220);
      }
    }, true);

    document.addEventListener('change', event => {
      const select = event.target instanceof HTMLSelectElement ? event.target : null;
      if (select && ['ap3-home-person','ap3-person-select'].includes(select.id)) {
        window.setTimeout(refresh, 240);
      }
    }, true);
  }

  function start() {
    installEvents();
    refresh();
    [600, 1400, 2800, 4200].forEach(delay => window.setTimeout(refresh, delay));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
