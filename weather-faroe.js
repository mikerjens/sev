(() => {
  function goHome() {
    const scheduleButton = document.querySelector('nav.tabs button[data-tab="schedule"]');

    if (scheduleButton) {
      scheduleButton.click();
    } else {
      document.querySelectorAll('nav.tabs button').forEach(button => button.classList.remove('active'));
      document.querySelectorAll('section.panel').forEach(panel => panel.classList.remove('active'));
      document.getElementById('panel-schedule')?.classList.add('active');
    }

    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const homeLink = document.querySelector('.brand');

  if (homeLink) {
    homeLink.setAttribute('role', 'button');
    homeLink.setAttribute('tabindex', '0');
    homeLink.setAttribute('aria-label', 'Home. Open Schedule');
    homeLink.style.cursor = 'pointer';
    homeLink.style.userSelect = 'none';
    homeLink.addEventListener('click', goHome);
    homeLink.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        goHome();
      }
    });
  }

  document.write('<script src="weather-faroe-core.js"></scr' + 'ipt>');
})();
