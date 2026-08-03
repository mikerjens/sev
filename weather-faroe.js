(() => {
  const statusBanner = document.querySelector('.status-banner');
  if (statusBanner) {
    statusBanner.setAttribute('role', 'status');
    statusBanner.setAttribute('aria-live', 'polite');
    statusBanner.style.background = 'rgba(74, 222, 128, 0.12)';
    statusBanner.style.borderColor = 'rgba(74, 222, 128, 0.48)';
    statusBanner.style.color = 'var(--text)';
    statusBanner.innerHTML = `
      <span class="pulse"></span>
      <span><b>PRODUCTION STATUS:</b> Storyboard received. Production plan in progress.</span>
    `;

    const countdown = document.createElement('div');
    countdown.setAttribute('role', 'timer');
    countdown.setAttribute('aria-label', 'Countdown to the end of the final filming day');
    countdown.style.marginTop = '12px';
    countdown.style.paddingTop = '12px';
    countdown.style.borderTop = '1px solid rgba(74, 222, 128, 0.30)';
    countdown.style.display = 'flex';
    countdown.style.flexWrap = 'wrap';
    countdown.style.alignItems = 'baseline';
    countdown.style.gap = '8px';
    countdown.style.fontVariantNumeric = 'tabular-nums';

    const countdownLabel = document.createElement('span');
    countdownLabel.textContent = 'FINAL FILMING DAY · 23 AUGUST 2026';
    countdownLabel.style.width = '100%';
    countdownLabel.style.fontSize = '0.78rem';
    countdownLabel.style.fontWeight = '700';
    countdownLabel.style.letterSpacing = '0.08em';
    countdownLabel.style.opacity = '0.78';

    const countdownValue = document.createElement('strong');
    countdownValue.style.fontSize = 'clamp(1.05rem, 4.5vw, 1.55rem)';
    countdownValue.style.lineHeight = '1.2';

    countdown.append(countdownLabel, countdownValue);
    statusBanner.appendChild(countdown);

    const deadline = new Date('2026-08-24T00:00:00+01:00').getTime();

    function updateCountdown() {
      const remaining = Math.max(0, deadline - Date.now());
      const totalSeconds = Math.floor(remaining / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (remaining === 0) {
        countdownValue.textContent = 'FILMING PERIOD COMPLETED';
        return;
      }

      countdownValue.textContent = `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

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

  const tasksScript = document.createElement('script');
  tasksScript.src = 'production-tasks.js';
  tasksScript.addEventListener('load', () => {
    const correctionScript = document.createElement('script');
    correctionScript.src = 'production-team-correction.js';
    document.body.appendChild(correctionScript);
  });
  document.body.appendChild(tasksScript);

  const weatherScript = document.createElement('script');
  weatherScript.src = 'weather-faroe-main.js';
  weatherScript.defer = true;
  weatherScript.addEventListener('load', () => {
    const sunScript = document.createElement('script');
    sunScript.src = 'sun-times.js';
    sunScript.defer = true;
    document.body.appendChild(sunScript);
  });
  document.body.appendChild(weatherScript);
})();
