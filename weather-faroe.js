(() => {
  const statusBanner = document.querySelector('.status-banner');
  if (statusBanner) {
    statusBanner.setAttribute('role', 'status');
    statusBanner.setAttribute('aria-live', 'polite');
    statusBanner.style.background = 'rgba(74, 222, 128, 0.12)';
    statusBanner.style.borderColor = 'rgba(74, 222, 128, 0.48)';
    statusBanner.style.color = 'var(--text)';
    statusBanner.style.display = 'grid';
    statusBanner.style.gridTemplateColumns = 'auto minmax(0, 1fr)';
    statusBanner.style.alignItems = 'start';
    statusBanner.style.gap = '12px 14px';
    statusBanner.innerHTML = `
      <span class="pulse" aria-hidden="true" style="margin-top:7px"></span>
      <div><b>PRODUCTION STATUS:</b> Tasks have been assigned. Everyone can begin their work.</div>
    `;

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
      document.querySelector('nav.tabs button[data-tab="schedule"]')?.click();
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

  const STORYBOARD_FILE_ID = '1tb161Lvzr8Y5R7OdyTiWflT76jwbmgEN';
  const STORYBOARD_VIEW_URL = `https://drive.google.com/file/d/${STORYBOARD_FILE_ID}/view?usp=drive_link`;
  const STORYBOARD_PREVIEW_URL = `https://drive.google.com/file/d/${STORYBOARD_FILE_ID}/preview`;

  const storyboardScenes = [
    { id: '1A', pages: [4], title: 'Light switch and opening cue' },
    { id: '2A', pages: [5, 6, 7], title: 'Boy reading, archive photo and fishermen' },
    { id: '3A', pages: [8], title: 'Drone over Klaksvík at night', drone: true },
    { id: '4A', pages: [9], title: 'Children under the street light' },
    { id: '5A', pages: [10], title: 'Remote village at night', drone: true },
    { id: '6A', pages: [11], title: 'Dam, turbine, Eiðisvatn and Eiðisverkið', drone: true },
    { id: '7A', pages: [12], title: 'Wind turbines', drone: true },
    { id: '8A', pages: [13], title: 'Drone rises above the islands', drone: true },
    { id: '9A', pages: [14, 15, 16], title: 'Mother and boy, electric car and heat pump' },
    { id: '10A', pages: [17], title: 'Drying clothes' },
    { id: '11A', pages: [18], title: 'Geothermal drilling' },
    { id: '12A', pages: [19], title: 'Green energy from a river' },
    { id: '13A', pages: [20, 21], title: 'Solar energy and sunlight' },
    { id: '14A', pages: [22], title: 'Start small. Everything makes a difference' },
    { id: '15A', pages: [23], title: 'Maybe it starts with you' },
    { id: '16A', pages: [24], title: 'Light switches off' },
    { id: '17A', pages: [25], title: 'Voice-over end card' },
    { id: '18A', pages: [26], title: 'Animated SEV logo' }
  ];

  function storyboardPageLabel(pages) {
    if (pages.length === 1) return `PDF page ${pages[0]}`;
    return `PDF pages ${pages[0]}-${pages[pages.length - 1]}`;
  }

  function installStoryboard() {
    const nav = document.querySelector('nav.tabs');
    const schedulePanel = document.getElementById('panel-schedule');
    const main = document.querySelector('main');

    if (!nav || !schedulePanel || !main || document.getElementById('panel-storyboard')) return;

    const style = document.createElement('style');
    style.textContent = `
      .storyboard-quick-access {
        display:flex;
        align-items:center;
        justify-content:space-between;
        flex-wrap:wrap;
        gap:12px;
        margin:0 0 20px;
        padding:14px 16px;
        background:rgba(77,217,192,0.08);
        border:1px solid rgba(77,217,192,0.24);
        border-radius:9px;
      }
      .storyboard-quick-copy strong { display:block; font-size:14px; }
      .storyboard-quick-copy span { color:var(--text-muted); font-size:12px; }
      .storyboard-quick-buttons { display:flex; flex-wrap:wrap; gap:7px; }
      .storyboard-chip,
      .storyboard-action,
      .storyboard-scene-card {
        color:var(--text);
        background:var(--bg-elevated-2);
        border:1px solid var(--border-strong);
        cursor:pointer;
      }
      .storyboard-chip {
        padding:7px 9px;
        border-radius:7px;
        font-family:'IBM Plex Mono',monospace;
        font-size:11px;
      }
      .storyboard-chip:hover,
      .storyboard-chip:focus-visible,
      .storyboard-action:hover,
      .storyboard-action:focus-visible,
      .storyboard-scene-card:hover,
      .storyboard-scene-card:focus-visible {
        border-color:var(--current);
        outline:none;
      }
      .storyboard-layout {
        display:grid;
        grid-template-columns:minmax(0,1fr) 300px;
        gap:18px;
        align-items:start;
      }
      .storyboard-viewer-shell {
        min-width:0;
        overflow:hidden;
        background:#080d10;
        border:1px solid var(--border-strong);
        border-radius:10px;
      }
      .storyboard-viewer-head {
        display:flex;
        align-items:center;
        justify-content:space-between;
        flex-wrap:wrap;
        gap:10px;
        padding:12px 14px;
        background:var(--bg-elevated);
        border-bottom:1px solid var(--border);
      }
      .storyboard-selected-scene strong { display:block; font-size:14px; }
      .storyboard-selected-scene span { color:var(--text-muted); font-size:11.5px; }
      .storyboard-viewer-actions { display:flex; flex-wrap:wrap; gap:7px; }
      .storyboard-action {
        display:inline-flex;
        align-items:center;
        justify-content:center;
        padding:8px 10px;
        border-radius:7px;
        font-family:'IBM Plex Mono',monospace;
        font-size:10.5px;
        text-decoration:none;
      }
      .storyboard-action.primary {
        color:#071512;
        background:var(--current);
        border-color:var(--current);
        font-weight:700;
      }
      .storyboard-frame-wrap {
        position:relative;
        width:100%;
        aspect-ratio:16 / 10;
        min-height:420px;
      }
      .storyboard-frame {
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        border:0;
        background:#fff;
      }
      .storyboard-side {
        max-height:720px;
        overflow:auto;
        padding-right:3px;
      }
      .storyboard-side-head {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        margin-bottom:10px;
      }
      .storyboard-side-head strong { font-size:14px; }
      .storyboard-side-head span { color:var(--text-muted); font-size:11px; }
      .storyboard-scene-list { display:grid; gap:8px; }
      .storyboard-scene-card {
        width:100%;
        padding:11px 12px;
        border-radius:8px;
        text-align:left;
      }
      .storyboard-scene-card.active {
        border-color:var(--current);
        box-shadow:inset 3px 0 0 var(--current);
      }
      .storyboard-scene-top {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
      }
      .storyboard-scene-number {
        color:var(--current);
        font-family:'IBM Plex Mono',monospace;
        font-size:12px;
        font-weight:700;
      }
      .storyboard-page-number {
        color:var(--text-muted);
        font-family:'IBM Plex Mono',monospace;
        font-size:10px;
      }
      .storyboard-scene-title {
        display:block;
        margin-top:4px;
        font-size:12.5px;
        line-height:1.35;
      }
      .storyboard-drone-tag {
        display:inline-flex;
        margin-top:7px;
        padding:2px 6px;
        color:var(--signal);
        background:rgba(246,176,66,0.10);
        border:1px solid rgba(246,176,66,0.28);
        border-radius:100px;
        font-family:'IBM Plex Mono',monospace;
        font-size:9px;
        letter-spacing:.04em;
      }
      .storyboard-note {
        margin-top:12px;
        color:var(--text-muted);
        font-size:11.5px;
      }
      @media(max-width:820px) {
        .storyboard-layout { grid-template-columns:1fr; }
        .storyboard-side { max-height:none; overflow:visible; }
        .storyboard-scene-list { grid-template-columns:repeat(2,minmax(0,1fr)); }
        .storyboard-frame-wrap { min-height:360px; }
      }
      @media(max-width:520px) {
        .storyboard-quick-access { align-items:flex-start; flex-direction:column; }
        .storyboard-layout { gap:14px; }
        .storyboard-scene-list { grid-template-columns:1fr; }
        .storyboard-frame-wrap { min-height:300px; aspect-ratio:4 / 5; }
        .storyboard-viewer-head { align-items:flex-start; flex-direction:column; }
        .storyboard-viewer-actions { width:100%; }
        .storyboard-action { flex:1; }
      }
    `;
    document.head.appendChild(style);

    const storyboardButton = document.createElement('button');
    storyboardButton.type = 'button';
    storyboardButton.dataset.tab = 'storyboard';
    storyboardButton.textContent = 'Storyboard';
    storyboardButton.addEventListener('click', () => window.openPortalTab?.('storyboard'));

    const weatherButton = nav.querySelector('button[data-tab="weather"]');
    nav.insertBefore(storyboardButton, weatherButton || null);

    const panel = document.createElement('section');
    panel.className = 'panel';
    panel.id = 'panel-storyboard';
    panel.innerHTML = `
      <div class="section-head">
        <h2>Storyboard and scene index</h2>
        <p>Select a scene to open the corresponding storyboard page. Drone scenes are clearly marked for weather, visibility and light planning.</p>
      </div>
      <div class="storyboard-layout">
        <div class="storyboard-viewer-shell" id="storyboard-viewer-shell">
          <div class="storyboard-viewer-head">
            <div class="storyboard-selected-scene">
              <strong id="storyboard-selected-title">Scene 1A · Light switch and opening cue</strong>
              <span id="storyboard-selected-page">PDF page 4</span>
            </div>
            <div class="storyboard-viewer-actions">
              <a class="storyboard-action" id="storyboard-page-link" href="${STORYBOARD_VIEW_URL}#page=4" target="_blank" rel="noopener">Open selected page</a>
              <a class="storyboard-action primary" href="${STORYBOARD_VIEW_URL}" target="_blank" rel="noopener">Open full PDF</a>
            </div>
          </div>
          <div class="storyboard-frame-wrap">
            <iframe class="storyboard-frame" id="storyboard-frame" title="SEV storyboard PDF" loading="lazy" src="${STORYBOARD_PREVIEW_URL}#page=4"></iframe>
          </div>
        </div>
        <aside class="storyboard-side" aria-label="Storyboard scene index">
          <div class="storyboard-side-head">
            <strong>All scenes</strong>
            <span>${storyboardScenes.length} scenes</span>
          </div>
          <div class="storyboard-scene-list" id="storyboard-scene-list"></div>
          <p class="storyboard-note">The page number remains visible above the viewer. If Google Drive opens at the beginning, enter the displayed PDF page number in the viewer.</p>
        </aside>
      </div>
    `;

    const weatherPanel = document.getElementById('panel-weather');
    main.insertBefore(panel, weatherPanel || schedulePanel.nextSibling);

    const quickAccess = document.createElement('div');
    quickAccess.className = 'storyboard-quick-access';
    quickAccess.innerHTML = `
      <div class="storyboard-quick-copy">
        <strong>Storyboard quick access</strong>
        <span>Drone windows: scenes 3A, 5A, 6A, 7A and 8A</span>
      </div>
      <div class="storyboard-quick-buttons">
        ${storyboardScenes.filter(scene => scene.drone).map(scene => `<button class="storyboard-chip" type="button" data-storyboard-scene="${scene.id}">${scene.id} · p.${scene.pages[0]}</button>`).join('')}
        <button class="storyboard-chip" type="button" data-open-storyboard>All scenes</button>
      </div>
    `;

    const scheduleHeading = schedulePanel.querySelector('.section-head');
    scheduleHeading?.insertAdjacentElement('afterend', quickAccess);

    const sceneList = panel.querySelector('#storyboard-scene-list');
    sceneList.innerHTML = storyboardScenes.map(scene => `
      <button class="storyboard-scene-card${scene.id === '1A' ? ' active' : ''}" type="button" data-storyboard-scene="${scene.id}" aria-label="Open scene ${scene.id}, ${storyboardPageLabel(scene.pages)}">
        <span class="storyboard-scene-top">
          <span class="storyboard-scene-number">SCENE ${scene.id}</span>
          <span class="storyboard-page-number">${storyboardPageLabel(scene.pages).replace('PDF ', '')}</span>
        </span>
        <span class="storyboard-scene-title">${scene.title}</span>
        ${scene.drone ? '<span class="storyboard-drone-tag">DRONE · WEATHER WINDOW</span>' : ''}
      </button>
    `).join('');

    function openStoryboardScene(sceneId, options = {}) {
      const scene = storyboardScenes.find(item => item.id === sceneId) || storyboardScenes[0];
      const page = scene.pages[0];
      const shouldScroll = options.scroll !== false;

      window.openPortalTab?.('storyboard');

      panel.querySelectorAll('.storyboard-scene-card').forEach(card => {
        card.classList.toggle('active', card.dataset.storyboardScene === scene.id);
      });

      panel.querySelector('#storyboard-selected-title').textContent = `Scene ${scene.id} · ${scene.title}`;
      panel.querySelector('#storyboard-selected-page').textContent = storyboardPageLabel(scene.pages);
      panel.querySelector('#storyboard-page-link').href = `${STORYBOARD_VIEW_URL}#page=${page}`;

      const frame = panel.querySelector('#storyboard-frame');
      frame.src = `${STORYBOARD_PREVIEW_URL}?rm=minimal&scene=${encodeURIComponent(scene.id)}#page=${page}`;

      if (shouldScroll) {
        panel.querySelector('#storyboard-viewer-shell').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    window.openStoryboardScene = openStoryboardScene;

    document.querySelectorAll('[data-storyboard-scene]').forEach(button => {
      button.addEventListener('click', () => openStoryboardScene(button.dataset.storyboardScene));
    });

    quickAccess.querySelector('[data-open-storyboard]')?.addEventListener('click', () => {
      window.openPortalTab?.('storyboard');
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  installStoryboard();

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
