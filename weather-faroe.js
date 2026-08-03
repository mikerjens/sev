(() => {
  function goHomeFromTitle() {
    if (typeof window.openPortalTab === 'function') {
      window.openPortalTab('schedule');
    } else {
      const scheduleButton = document.querySelector('nav.tabs button[data-tab="schedule"]');
      scheduleButton?.click();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const title = document.querySelector('.hero h1');
  if (title) {
    title.setAttribute('role', 'button');
    title.setAttribute('tabindex', '0');
    title.setAttribute('aria-label', 'Home. Open Schedule');
    title.style.cursor = 'pointer';
    title.style.userSelect = 'none';
    title.addEventListener('click', goHomeFromTitle);
    title.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        goHomeFromTitle();
      }
    });
  }

  const weatherScript = document.createElement('script');
  weatherScript.src = 'weather-faroe-main.js';
  weatherScript.defer = true;
  document.body.appendChild(weatherScript);
})();
