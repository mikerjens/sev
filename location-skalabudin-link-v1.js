(() => {
  'use strict';

  const VERSION = '2026-08-10-1512';
  const LOCATION_URL = 'https://www.airbnb.dk/rooms/17985150?unique_share_id=d24602e0-e283-4688-8c00-39153d143b81&viralityEntryPoint=1&s=76&source_impression_id=p3_1786370596_P3Bm4DyxDVfA1x9G';
  let scheduled = false;

  function addStyles() {
    if (document.getElementById('sev-location-link-styles')) return;
    const style = document.createElement('style');
    style.id = 'sev-location-link-styles';
    style.textContent = `
      .ap3-location .sev-location-link{color:var(--current)!important;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px;font-weight:700}
      .ap3-location .sev-location-link:hover,.ap3-location .sev-location-link:focus-visible{color:var(--text)!important;outline:none}
      .sev-location-open-row{margin-top:10px}
      .sev-location-open-button{display:inline-flex;align-items:center;gap:7px;padding:8px 11px;color:#071512!important;background:var(--current);border:1px solid var(--current);border-radius:7px;text-decoration:none!important;font-size:10.5px;font-weight:800}
      .sev-location-open-button:hover,.sev-location-open-button:focus-visible{filter:brightness(1.08);outline:none}
    `;
    document.head.appendChild(style);
  }

  function findCard() {
    const root = document.querySelector('#panel-schedule [data-plan-v3-root]');
    if (!root) return null;
    return [...root.querySelectorAll('.ap3-shoot')].find(item => {
      const text = (item.textContent || '').replace(/\s+/g, ' ');
      return /17\. AUGUST/i.test(text) && /Indendørs optagelser/i.test(text) && /Skálabúðin/i.test(text);
    }) || null;
  }

  function patchLocation() {
    scheduled = false;
    addStyles();
    const card = findCard();
    if (!card) return false;

    const location = card.querySelector('.ap3-location');
    if (location && !location.querySelector('.sev-location-link')) {
      location.innerHTML = `📍 <a class="sev-location-link" href="${LOCATION_URL}" target="_blank" rel="noopener noreferrer" aria-label="Se Skálabúðin på Airbnb">Skálabúðin, Tórshavn · SE LOCATION</a>`;
    }

    if (location && !card.querySelector('.sev-location-open-row')) {
      const row = document.createElement('div');
      row.className = 'sev-location-open-row';
      row.innerHTML = `<a class="sev-location-open-button" href="${LOCATION_URL}" target="_blank" rel="noopener noreferrer">↗ Se billeder af location</a>`;
      location.insertAdjacentElement('afterend', row);
    }

    const actions = card.querySelector('.ap3-actions');
    if (actions && !actions.querySelector('[data-location-skalabudin]')) {
      const link = document.createElement('a');
      link.className = 'ap3-action secondary';
      link.href = LOCATION_URL;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.dataset.locationSkalabudin = 'true';
      link.textContent = '↗ Se location';
      actions.appendChild(link);
    }

    card.dataset.locationLinkVersion = VERSION;
    return true;
  }

  function schedulePatch() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(patchLocation);
  }

  function start() {
    patchLocation();
    [250, 800, 1600, 3400].forEach(delay => window.setTimeout(patchLocation, delay));

    const panel = document.getElementById('panel-schedule');
    if (panel && !panel.dataset.locationObserverV1) {
      panel.dataset.locationObserverV1 = VERSION;
      const observer = new MutationObserver(() => schedulePatch());
      observer.observe(panel, { childList: true, subtree: true });
    }

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('nav.tabs button[data-tab="schedule"], .brand, [data-home]')) {
        window.setTimeout(patchLocation, 0);
      }
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
