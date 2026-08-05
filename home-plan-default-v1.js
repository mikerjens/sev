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

  function isHomeControl(target) {
    const control = target.closest('button, a, [role="button"]');
    if (!control) return false;

    if (control.matches('#home-button, .brand, [data-home], .home-link, .portal-logo, .logo-link')) {
      return true;
    }

    if (control.closest('header.top .brand-row') && control === control.closest('header.top .brand-row > button, header.top .brand-row > a, header.top .brand-row > [role="button"]')) {
      return true;
    }

    return /^HJEM$/i.test((control.textContent || '').trim());
  }

  clearRememberedTab();

  document.addEventListener('click', event => {
    if (!isHomeControl(event.target)) return;
    event.preventDefault();
    openPlanAndTasks({ scrollToTop: true });
  }, true);

  document.addEventListener('sev:portal-ready', () => {
    openPlanAndTasks({ scrollToTop: false });
  }, { once: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      openPlanAndTasks({ scrollToTop: false });
    }, { once: true });
  } else {
    openPlanAndTasks({ scrollToTop: false });
  }
})();
