(() => {
  'use strict';

  const HOME_TAB = 'schedule';
  const TAB_STORAGE_KEY = 'sev-active-portal-tab';

  function clearRememberedTab() {
    try {
      sessionStorage.removeItem(TAB_STORAGE_KEY);
    } catch (_) {}
  }

  function clearPortalHash() {
    if (!window.location.hash) return;
    try {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    } catch (_) {}
  }

  function openPlanAndTasks({ scrollToTop = false } = {}) {
    clearRememberedTab();
    clearPortalHash();

    if (typeof window.openPortalTab === 'function') {
      window.openPortalTab(HOME_TAB, { scrollToTop });
    } else {
      document.querySelector('nav.tabs button[data-tab="schedule"]')?.click();
      if (scrollToTop) window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function labelHomeControl() {
    const home = document.getElementById('home-button');
    if (!home) return;
    home.setAttribute('aria-label', 'HJEM · Åbn Plan & opgaver');
    home.setAttribute('title', 'HJEM · Plan & opgaver');
  }

  function isHomeControl(target) {
    if (!(target instanceof Element)) return false;

    const control = target.closest('button, a, [role="button"]');
    if (!control) return false;

    if (control.matches('#home-button, .brand, [data-home], .home-link, .portal-logo, .logo-link')) {
      return true;
    }

    const topLeftControl = control.closest(
      'header.top .brand-row > button, header.top .brand-row > a, header.top .brand-row > [role="button"]'
    );
    if (topLeftControl === control) return true;

    const label = (control.textContent || '').trim();
    return label.length <= 40 && /\bHJEM\b/i.test(label);
  }

  clearRememberedTab();

  document.addEventListener('click', event => {
    if (!isHomeControl(event.target)) return;
    event.preventDefault();
    openPlanAndTasks({ scrollToTop: true });
  }, true);

  document.addEventListener('sev:portal-ready', () => {
    labelHomeControl();
    openPlanAndTasks({ scrollToTop: false });
  }, { once: true });

  window.addEventListener('pageshow', () => {
    openPlanAndTasks({ scrollToTop: false });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      labelHomeControl();
      openPlanAndTasks({ scrollToTop: false });
    }, { once: true });
  } else {
    labelHomeControl();
    openPlanAndTasks({ scrollToTop: false });
  }
})();
