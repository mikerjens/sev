(() => {
  'use strict';

  const VERSION = '2026-08-18-1044';
  const MESSAGE = 'BEKRÆFTET: Vi filmer i morgen, onsdag 19. august.';
  const UPDATED = 'Opdateret tirsdag 18. august 2026 kl. 10:44';

  function addStyles() {
    if (document.getElementById('production-confirmed-aug19-banner-styles')) return;
    const style = document.createElement('style');
    style.id = 'production-confirmed-aug19-banner-styles';
    style.textContent = `
      .sev-confirmed-banner{margin:0 0 16px;padding:14px 16px;background:rgba(74,222,128,.11);border:1px solid rgba(74,222,128,.48);border-left:5px solid #4ade80;border-radius:9px}
      .sev-confirmed-banner strong{display:block;color:#4ade80;font-size:15px;font-weight:900;line-height:1.35}
      .sev-confirmed-banner span{display:block;margin-top:4px;color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:9.5px;line-height:1.4}
      @media(max-width:700px){.sev-confirmed-banner{padding:12px 13px}.sev-confirmed-banner strong{font-size:14px}.sev-confirmed-banner span{font-size:9px}}
    `;
    document.head.appendChild(style);
  }

  function install() {
    addStyles();
    const panel = document.getElementById('panel-schedule');
    if (!panel) return;
    const root = panel.querySelector('[data-plan-v3-root]') || panel.firstElementChild;
    if (!root) return;
    let banner = panel.querySelector('.sev-confirmed-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'sev-confirmed-banner';
      banner.setAttribute('role', 'status');
      root.prepend(banner);
    }
    banner.innerHTML = `<strong>${MESSAGE}</strong><span>${UPDATED}</span>`;
    banner.dataset.version = VERSION;
  }

  function start() {
    install();
    [300, 900, 1800, 3200].forEach(delay => window.setTimeout(install, delay));
    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('nav.tabs button[data-tab="schedule"], .brand, [data-home]')) window.setTimeout(install, 120);
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
