(() => {
  'use strict';

  const VERSION = '2026-08-10-1503';
  const LOCATION_URL = 'https://www.airbnb.dk/rooms/17985150?unique_share_id=d24602e0-e283-4688-8c00-39153d143b81&viralityEntryPoint=1&s=76&source_impression_id=p3_1786370596_P3Bm4DyxDVfA1x9G';

  function addStyles() {
    if (document.getElementById('sev-location-link-styles')) return;
    const style = document.createElement('style');
    style.id = 'sev-location-link-styles';
    style.textContent = `
      .ap3-location .sev-location-link{color:var(--current);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}
      .ap3-location .sev-location-link:hover,.ap3-location .sev-location-link:focus-visible{color:var(--text);outline:none}
    `;
    document.head.appendChild(style);
  }

  function patchLocation() {
    addStyles();
    const root = document.querySelector('#panel-schedule [data-plan-v3-root]');
    if (!root) return false;

    const card = [...root.querySelectorAll('.ap3-shoot')].find(item => {
      const text = item.textContent || '';
      return /MANDAG 17\. AUGUST/.test(text) && /Indendørs optagelser/.test(text) && /Skálabúðin/.test(text);
    });
    if (!card) return false;

    const location = card.querySelector('.ap3-location');
    if (location && !location.querySelector('.sev-location-link')) {
      location.innerHTML = `📍 <a class="sev-location-link" href="${LOCATION_URL}" target="_blank" rel="noopener noreferrer" aria-label="Se Skálabúðin location på Airbnb">Skálabúðin, Tórshavn · se location</a>`;
    }

    const actions = card.querySelector('.ap3-actions');
    if (actions && !actions.querySelector('[data-location-skalabudin]')) {
      const link = document.createElement('a');
      link.className = 'ap3-action secondary';
      link.href = LOCATION_URL;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.dataset.locationSkalabudin = 'true';
      link.textContent = 'Se location';
      actions.appendChild(link);
    }

    card.dataset.locationLinkVersion = VERSION;
    return true;
  }

  function start() {
    if (patchLocation()) return;
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      if (patchLocation() || tries >= 12) window.clearInterval(timer);
    }, 250);

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
