(() => {
  'use strict';

  const VERSION = '2026-08-10-1328';

  function reveal() {
    const root = document.documentElement;
    root.classList.remove('sev-booting');
    root.classList.add('sev-ready');
    root.dataset.loadingSafety = VERSION;

    document.querySelectorAll('nav.tabs, .weather-shortcut, main').forEach(element => {
      element.style.opacity = '1';
      element.style.pointerEvents = 'auto';
    });
  }

  function simplifyStatusBanner() {
    const banner = document.querySelector('.status-banner');
    if (!banner || banner.dataset.noCountdown === VERSION) return;

    banner.querySelector('[role="timer"]')?.remove();
    banner.dataset.noCountdown = VERSION;
    banner.removeAttribute('aria-live');
    banner.style.display = 'grid';
    banner.style.gridTemplateColumns = 'auto minmax(0, 1fr)';
    banner.style.gap = '10px 14px';

    const pulse = banner.querySelector('.pulse') || document.createElement('span');
    pulse.className = 'pulse';
    pulse.setAttribute('aria-hidden', 'true');
    pulse.style.marginTop = '7px';

    let copy = banner.querySelector('[data-static-production-status]');
    if (!copy) {
      copy = document.createElement('div');
      copy.dataset.staticProductionStatus = VERSION;
    }
    copy.innerHTML = '<b>PRODUKTIONSSTATUS:</b> Den godkendte produktionsplan er lagt ind. Se næste optagelser og vælg dit navn for dit eget skema.<div style="margin-top:9px;padding-top:9px;border-top:1px solid rgba(74,222,128,.30);font-family:\'IBM Plex Mono\',monospace;font-size:11px;letter-spacing:.05em">SIDSTE OPTAGEDAG · 23. AUGUST 2026</div>';

    banner.replaceChildren(pulse, copy);
  }

  function install() {
    reveal();
    simplifyStatusBanner();
  }

  install();
  document.addEventListener('DOMContentLoaded', install, { once: true });
  document.addEventListener('sev:portal-ready', install);
  window.setTimeout(install, 800);
  window.setTimeout(install, 2500);
})();
