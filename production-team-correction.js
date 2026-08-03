(() => {
  function addStyles() {
    if (document.getElementById('personal-task-selector-styles')) return;

    const style = document.createElement('style');
    style.id = 'personal-task-selector-styles';
    style.textContent = `
      #person-task-selector{border:1px solid rgba(246,176,66,.55);box-shadow:0 0 0 3px rgba(246,176,66,.035)}
      #task-person-filter{border:2px solid rgba(246,176,66,.88)!important;font-size:15px;font-weight:700;cursor:pointer}
      #task-person-filter:focus{outline:none;box-shadow:0 0 0 4px rgba(246,176,66,.20)}
      #person-task-selector label{color:var(--signal);font-weight:800}
      .storyboard-page-loading{
        position:absolute;
        z-index:3;
        top:12px;
        left:12px;
        padding:7px 10px;
        color:var(--text);
        background:rgba(8,13,16,.88);
        border:1px solid var(--border-strong);
        border-radius:7px;
        font-family:'IBM Plex Mono',monospace;
        font-size:10px;
        pointer-events:none;
        opacity:0;
        transform:translateY(-4px);
        transition:opacity .15s ease,transform .15s ease;
      }
      .storyboard-page-loading.visible{opacity:1;transform:translateY(0)}
    `;
    document.head.appendChild(style);
  }

  function applyCorrectionOnce() {
    addStyles();

    const panel = document.getElementById('panel-schedule');
    const toolbar = panel?.querySelector('.plan-toolbar');
    const select = document.getElementById('task-person-filter');
    const label = toolbar?.querySelector('label[for="task-person-filter"]');
    const intro = panel?.querySelector('.section-head p');

    if (toolbar) {
      toolbar.id = 'person-task-selector';
      toolbar.setAttribute('aria-label', 'Vælg dit navn og se dine personlige opgaver');
    }

    if (select) {
      select.setAttribute('aria-label', 'Vælg dit navn og se dine egne opgaver');
    }

    if (label) {
      label.textContent = 'VÆLG DIT NAVN – DINE OPGAVER VISES HER';
    }

    if (intro) {
      intro.textContent = 'Vælg dit navn direkte i feltet nedenfor. Derefter vises kun dine egne opgaver, deadlines og næste skridt.';
    }

    panel?.querySelector('.start-here-box')?.remove();

    const bogiOption = document.querySelector('#task-person-filter option[value="bogi"]');
    if (bogiOption && bogiOption.textContent !== 'Bogi Henriksen · Kreativ direktør / SANSIR.fo') {
      bogiOption.textContent = 'Bogi Henriksen · Kreativ direktør / SANSIR.fo';
    }

    document.querySelectorAll('.crew-card').forEach(card => {
      const name = card.querySelector('.crew-card-name');
      const role = card.querySelector('.crew-card-role');
      if (!name || !['Bogi', 'Bogi Henriksen'].includes(name.textContent.trim())) return;

      if (name.textContent.trim() !== 'Bogi Henriksen') name.textContent = 'Bogi Henriksen';
      if (role && role.textContent.trim() !== 'Kreativ direktør / SANSIR.fo') {
        role.textContent = 'Kreativ direktør / SANSIR.fo';
      }
    });

    document.querySelectorAll('.bureau-note, .task-chip.owner, #plan-summary').forEach(element => {
      if (!element.textContent.includes('Bogi') || element.textContent.includes('Bogi Henriksen')) return;
      element.innerHTML = element.innerHTML.replace(/\bBogi\b/g, 'Bogi Henriksen');
    });
  }

  const STORYBOARD_FILE_ID = '1tb161Lvzr8Y5R7OdyTiWflT76jwbmgEN';
  const STORYBOARD_FULL_URL = `https://drive.google.com/file/d/${STORYBOARD_FILE_ID}/view?usp=drive_link`;
  const storyboardScenePages = {
    '1A': { pages: [4], title: 'Light switch and opening cue' },
    '2A': { pages: [5, 6, 7], title: 'Boy reading, archive photo and fishermen' },
    '3A': { pages: [8], title: 'Drone over Klaksvík at night' },
    '4A': { pages: [9], title: 'Children under the street light' },
    '5A': { pages: [10], title: 'Remote village at night' },
    '6A': { pages: [11], title: 'Dam, turbine, Eiðisvatn and Eiðisverkið' },
    '7A': { pages: [12], title: 'Wind turbines' },
    '8A': { pages: [13], title: 'Drone rises above the islands' },
    '9A': { pages: [14, 15, 16], title: 'Mother and boy, electric car and heat pump' },
    '10A': { pages: [17], title: 'Drying clothes' },
    '11A': { pages: [18], title: 'Geothermal drilling' },
    '12A': { pages: [19], title: 'Green energy from a river' },
    '13A': { pages: [20, 21], title: 'Solar energy and sunlight' },
    '14A': { pages: [22], title: 'Start small. Everything makes a difference' },
    '15A': { pages: [23], title: 'Maybe it starts with you' },
    '16A': { pages: [24], title: 'Light switches off' },
    '17A': { pages: [25], title: 'Voice-over end card' },
    '18A': { pages: [26], title: 'Animated SEV logo' }
  };

  function pageLabel(pages) {
    return pages.length === 1
      ? `PDF page ${pages[0]}`
      : `PDF pages ${pages[0]}–${pages[pages.length - 1]}`;
  }

  function directPdfUrl(sceneId, page) {
    const cacheKey = `${encodeURIComponent(sceneId)}-${Date.now()}`;
    return `https://drive.google.com/uc?export=view&id=${STORYBOARD_FILE_ID}&scene=${cacheKey}#page=${page}&zoom=page-width`;
  }

  function installExactStoryboardNavigation() {
    const panel = document.getElementById('panel-storyboard');
    const frame = document.getElementById('storyboard-frame');
    const frameWrap = panel?.querySelector('.storyboard-frame-wrap');
    const selectedTitle = document.getElementById('storyboard-selected-title');
    const selectedPage = document.getElementById('storyboard-selected-page');
    const pageLink = document.getElementById('storyboard-page-link');
    const fullPdfLink = panel?.querySelector('.storyboard-action.primary');
    const note = panel?.querySelector('.storyboard-note');

    if (!panel || !frame || !frameWrap || panel.dataset.exactPageNavigation === 'true') return;
    panel.dataset.exactPageNavigation = 'true';

    frame.loading = 'eager';
    frame.title = 'SEV storyboard. Opens directly on the selected scene page.';

    const loading = document.createElement('div');
    loading.className = 'storyboard-page-loading';
    loading.setAttribute('role', 'status');
    loading.setAttribute('aria-live', 'polite');
    frameWrap.appendChild(loading);

    if (fullPdfLink) fullPdfLink.href = STORYBOARD_FULL_URL;
    if (note) {
      note.textContent = 'Select a scene and the viewer opens directly on its first storyboard page. Use Open selected page for a larger view.';
    }

    let loadTimer = 0;

    function openExactScene(sceneId, options = {}) {
      const scene = storyboardScenePages[sceneId] || storyboardScenePages['1A'];
      const page = scene.pages[0];
      const exactUrl = directPdfUrl(sceneId, page);

      window.openPortalTab?.('storyboard');

      panel.querySelectorAll('.storyboard-scene-card').forEach(card => {
        card.classList.toggle('active', card.dataset.storyboardScene === sceneId);
      });

      if (selectedTitle) selectedTitle.textContent = `Scene ${sceneId} · ${scene.title}`;
      if (selectedPage) selectedPage.textContent = pageLabel(scene.pages);
      if (pageLink) pageLink.href = exactUrl;

      loading.textContent = `Opening scene ${sceneId} · page ${page}…`;
      loading.classList.add('visible');
      window.clearTimeout(loadTimer);

      frame.src = 'about:blank';
      window.requestAnimationFrame(() => {
        frame.src = exactUrl;
      });

      loadTimer = window.setTimeout(() => loading.classList.remove('visible'), 2200);

      if (options.scroll !== false) {
        document.getElementById('storyboard-viewer-shell')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    frame.addEventListener('load', () => {
      window.setTimeout(() => loading.classList.remove('visible'), 300);
    });

    document.addEventListener('click', event => {
      const sceneButton = event.target.closest('[data-storyboard-scene]');
      if (!sceneButton) return;

      const sceneId = sceneButton.dataset.storyboardScene;
      if (!storyboardScenePages[sceneId]) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      openExactScene(sceneId);
    }, true);

    window.openStoryboardScene = openExactScene;
    openExactScene('1A', { scroll: false });
  }

  applyCorrectionOnce();
  installExactStoryboardNavigation();
  window.setTimeout(() => {
    applyCorrectionOnce();
    installExactStoryboardNavigation();
  }, 250);
})();
