(() => {
  function openPersonalTasks() {
    if (typeof window.focusPersonTaskSelector === 'function') {
      window.focusPersonTaskSelector();
      return;
    }

    if (typeof window.openPortalTab === 'function') {
      window.openPortalTab('schedule');
    } else {
      document.querySelector('nav.tabs button[data-tab="schedule"]')?.click();
    }

    let attempts = 0;
    const findSelector = setInterval(() => {
      const select = document.getElementById('task-person-filter');
      attempts += 1;
      if (select) {
        clearInterval(findSelector);
        select.scrollIntoView({ behavior: 'smooth', block: 'center' });
        select.focus({ preventScroll: true });
        select.classList.add('person-filter-highlight');
        setTimeout(() => select.classList.remove('person-filter-highlight'), 3200);
      } else if (attempts >= 20) {
        clearInterval(findSelector);
      }
    }, 100);
  }

  const statusBanner = document.querySelector('.status-banner');
  if (statusBanner) {
    statusBanner.setAttribute('role', 'region');
    statusBanner.setAttribute('aria-label', 'Production status and personal task access');
    statusBanner.style.background = 'rgba(74, 222, 128, 0.12)';
    statusBanner.style.borderColor = 'rgba(74, 222, 128, 0.48)';
    statusBanner.style.color = 'var(--text)';
    statusBanner.style.display = 'grid';
    statusBanner.style.gridTemplateColumns = 'auto minmax(0, 1fr)';
    statusBanner.style.alignItems = 'start';
    statusBanner.style.gap = '12px 14px';
    statusBanner.innerHTML = `
      <span class="pulse" aria-hidden="true" style="margin-top:7px"></span>
      <div class="production-status-main">
        <div><b>PRODUCTION STATUS:</b> Tasks have been assigned. Everyone can begin their work.</div>
        <button id="open-person-tasks" type="button">CHOOSE YOUR NAME &amp; VIEW YOUR TASKS <span aria-hidden="true">→</span></button>
      </div>
    `;

    if (!document.getElementById('production-status-action-styles')) {
      const actionStyles = document.createElement('style');
      actionStyles.id = 'production-status-action-styles';
      actionStyles.textContent = `
        .production-status-main{min-width:0}
        #open-person-tasks{margin-top:14px;padding:11px 15px;border:1px solid rgba(246,176,66,.82);border-radius:7px;background:rgba(246,176,66,.14);color:var(--text);font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.035em;cursor:pointer;box-shadow:0 0 0 0 rgba(246,176,66,.34);transition:background .18s ease,border-color .18s ease,transform .18s ease}
        #open-person-tasks:hover,#open-person-tasks:focus-visible{background:rgba(246,176,66,.25);border-color:rgba(246,176,66,1);transform:translateY(-1px);outline:none}
        @media(max-width:650px){#open-person-tasks{width:100%;text-align:left;line-height:1.35}}
      `;
      document.head.appendChild(actionStyles);
    }

    document.getElementById('open-person-tasks')?.addEventListener('click', openPersonalTasks);

    const countdown = document.createElement('div');
    countdown.setAttribute('role', 'timer');
    countdown.setAttribute('aria-label', 'Countdown to the end of the final filming day');
    countdown.style.gridColumn = '2';
    countdown.style.marginTop = '2px';
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
