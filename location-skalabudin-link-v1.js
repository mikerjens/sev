(() => {
  'use strict';

  const VERSION = '2026-08-10-1516';
  const LOCATION_URL = 'https://www.airbnb.dk/rooms/17985150?unique_share_id=d24602e0-e283-4688-8c00-39153d143b81&viralityEntryPoint=1&s=76&source_impression_id=p3_1786370596_P3Bm4DyxDVfA1x9G';

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

  function isSkalabudinCard(card) {
    const text = (card?.textContent || '').replace(/\s+/g, ' ');
    return /17\. AUGUST/i.test(text) && /Indendørs optagelser/i.test(text) && /Skálabúðin/i.test(text);
  }

  function patchCard(card) {
    if (!card || !isSkalabudinCard(card)) return false;

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

  function patchAllLocations() {
    addStyles();
    let patched = 0;
    document.querySelectorAll('#panel-schedule .ap3-shoot, #panel-my-schedule .ap3-shoot').forEach(card => {
      if (patchCard(card)) patched += 1;
    });
    return patched;
  }

  function patchAfterRender() {
    [0, 60, 180, 450].forEach(delay => window.setTimeout(patchAllLocations, delay));
  }

  function start() {
    patchAfterRender();

    // Personal schedules are rendered on demand. Re-apply the location link after
    // a name is selected or the user opens HJEM / Mit skema. No MutationObserver
    // is used here so this helper stays light and cannot make the portal sluggish.
    document.addEventListener('change', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.matches('#ap3-home-person, #panel-my-schedule select')) patchAfterRender();
    }, true);

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('nav.tabs button[data-tab="schedule"], nav.tabs button[data-tab="my-schedule"], [data-open-personal], .brand, [data-home]')) {
        patchAfterRender();
      }
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
