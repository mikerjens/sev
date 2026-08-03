(() => {
  const productionPeople = [
    { name: 'Michael Koba', role: 'Film producer · KOVBOY FILM / FIXER.FO' },
    { name: 'Thomas Koba', role: 'Director and filmmaker · KOVBOY FILM' },
    { name: 'Elisabeth', role: 'Agency · SANSIR' },
    { name: 'Tór Verland Johannesen', role: 'Agency · SANSIR' },
    { name: 'Bogi Henriksen', role: 'Creative director · SANSIR.fo' }
  ];

  function addStyles() {
    if (document.getElementById('personal-task-selector-styles')) return;

    const style = document.createElement('style');
    style.id = 'personal-task-selector-styles';
    style.textContent = `
      #person-task-selector{border:1px solid rgba(246,176,66,.55);box-shadow:0 0 0 3px rgba(246,176,66,.035)}
      #task-person-filter{border:2px solid rgba(246,176,66,.88)!important;font-size:15px;font-weight:700;cursor:pointer}
      #task-person-filter:focus{outline:none;box-shadow:0 0 0 4px rgba(246,176,66,.20)}
      #person-task-selector label{color:var(--signal);font-weight:800}
      .storyboard-page-loading{position:absolute;z-index:3;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;color:var(--text);background:#080d10;font-family:'IBM Plex Mono',monospace;font-size:11px;pointer-events:none;opacity:0;transition:opacity .15s ease}
      .storyboard-page-loading.visible{opacity:1}
      .storyboard-scene-card.filmed{border-color:#4ade80!important;background:rgba(74,222,128,.13)!important;box-shadow:inset 4px 0 0 #4ade80}
      .storyboard-scene-card.filmed .storyboard-scene-number{color:#4ade80}
      .storyboard-filmed-tag{display:inline-flex;margin-top:7px;padding:3px 7px;color:#071512;background:#4ade80;border:1px solid #4ade80;border-radius:100px;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:800;letter-spacing:.05em}
      .storyboard-chip.filmed{color:#071512!important;background:#4ade80!important;border-color:#4ade80!important;font-weight:800}
      .storyboard-selected-status{display:inline-flex;margin-top:6px;padding:3px 8px;color:#071512;background:#4ade80;border-radius:100px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:800;letter-spacing:.05em}
    `;
    document.head.appendChild(style);
  }

  function unifyCrewSection() {
    const contactsTab = document.querySelector('nav.tabs button[data-tab="contacts"]');
    const contactsPanel = document.getElementById('panel-contacts');
    const contactsWasActive = contactsTab?.classList.contains('active') || contactsPanel?.classList.contains('active');

    contactsTab?.remove();
    contactsPanel?.remove();

    const crewTab = document.querySelector('nav.tabs button[data-tab="crew"]');
    if (crewTab) {
      crewTab.textContent = 'Crew';
      crewTab.setAttribute('aria-label', 'Crew');
    }

    const crewPanel = document.getElementById('panel-crew');
    if (crewPanel) {
      crewPanel.innerHTML = `
        <div class="section-head">
          <h2>Crew</h2>
          <p>Everyone currently involved in this production is listed here.</p>
        </div>
        <div class="crew-card-grid">
          ${productionPeople.map(person => `
            <div class="crew-card">
              <div class="crew-card-name">${person.name}</div>
              <div class="crew-card-role">${person.role}</div>
            </div>
          `).join('')}
        </div>`;
    }

    if (contactsWasActive) window.openPortalTab?.('crew');
  }

  function applyCorrectionOnce() {
    addStyles();
    document.querySelector('.meta-line')?.remove();
    unifyCrewSection();
    const panel = document.getElementById('panel-schedule');
    const toolbar = panel?.querySelector('.plan-toolbar');
    const select = document.getElementById('task-person-filter');
    const label = toolbar?.querySelector('label[for="task-person-filter"]');
    const intro = panel?.querySelector('.section-head p');
    if (toolbar) { toolbar.id = 'person-task-selector'; toolbar.setAttribute('aria-label', 'Vælg dit navn og se dine personlige opgaver'); }
    if (select) select.setAttribute('aria-label', 'Vælg dit navn og se dine egne opgaver');
    if (label) label.textContent = 'VÆLG DIT NAVN – DINE OPGAVER VISES HER';
    if (intro) intro.textContent = 'Vælg dit navn direkte i feltet nedenfor. Derefter vises kun dine egne opgaver, deadlines og næste skridt.';
    panel?.querySelector('.start-here-box')?.remove();
    const bogiOption = document.querySelector('#task-person-filter option[value="bogi"]');
    if (bogiOption && bogiOption.textContent !== 'Bogi Henriksen · Kreativ direktør / SANSIR.fo') bogiOption.textContent = 'Bogi Henriksen · Kreativ direktør / SANSIR.fo';
    document.querySelectorAll('.crew-card').forEach(card => {
      const name = card.querySelector('.crew-card-name');
      const role = card.querySelector('.crew-card-role');
      if (!name || !['Bogi', 'Bogi Henriksen'].includes(name.textContent.trim())) return;
      name.textContent = 'Bogi Henriksen';
      if (role) role.textContent = 'Creative director · SANSIR.fo';
    });
    document.querySelectorAll('.bureau-note, .task-chip.owner, #plan-summary').forEach(element => {
      if (!element.textContent.includes('Bogi') || element.textContent.includes('Bogi Henriksen')) return;
      element.innerHTML = element.innerHTML.replace(/\bBogi\b/g, 'Bogi Henriksen');
    });
  }

  const STORYBOARD_FULL_URL = 'https://drive.google.com/file/d/1tb161Lvzr8Y5R7OdyTiWflT76jwbmgEN/view?usp=drive_link';
  const storyboardScenePages = {
    '1A': { pages: [4], title: 'Light switch and opening cue', fileId: '1ovbk0s0ilEDwXgYBLC_xOc9K2ASA5-Tc' },
    '2A': { pages: [5, 6, 7], title: 'Boy reading, archive photo and fishermen', fileId: '1DeEndiPZjuMQssY7wMDPft_aVkcSpecc' },
    '3A': { pages: [8], title: 'Drone over Klaksvík at night', fileId: '1laqvONDUSKKBAJV481vg2WITd5dLfMN5' },
    '4A': { pages: [9], title: 'Children under the street light', fileId: '1Gq1q7SVP2nb9rLbY9vP-G-WJ2PzH8Rc8' },
    '5A': { pages: [10], title: 'Remote village at night', fileId: '1KcbJ5jLG3zexGvQNuolHWFRwaxiddeXD' },
    '6A': { pages: [11], title: 'Dam, turbine, Eiðisvatn and Eiðisverkið', fileId: '1eJ8mbTTA8laSlgsiIFmRyAXEj-f759yF' },
    '7A': { pages: [12], title: 'Vindmøller', fileId: '1zADDC4ukAIhTU-X9Knv74pYKkn9Jdabq', filmed: true },
    '8A': { pages: [13], title: 'Drone rises above the islands', fileId: '1YF5G31PfM3w3sHK8w9zxeRgK1_E-w2Ni' },
    '9A': { pages: [14, 15, 16], title: 'Mother and boy, electric car and heat pump', fileId: '1d7LuyZiWh2tjXYX8SnE0clGwTEmiTMNX' },
    '10A': { pages: [17], title: 'Drying clothes', fileId: '13Ovu02YU1pO4P3RhqEt9sEAPMQb97kwG' },
    '11A': { pages: [18], title: 'Geothermal drilling', fileId: '1hiEutw6MwihjE7p32dz4CHogOn9yiKR4' },
    '12A': { pages: [19], title: 'Green energy from a river', fileId: '17U5q_qyo_t3suKOANDuCGFdL52StTKfO' },
    '13A': { pages: [20, 21], title: 'Solar energy and sunlight', fileId: '1QVzhE9o1DxbbY_r-ykVbmgSAqPi-Daf1' },
    '14A': { pages: [22], title: 'Start small. Everything makes a difference', fileId: '18w-gasRIRrq--pnusoHl8dae0XMDJELN' },
    '15A': { pages: [23], title: 'Maybe it starts with you', fileId: '1Gzxr4N-632AT0zhsKSNElpxLVctnGpqv' },
    '16A': { pages: [24], title: 'Light switches off', fileId: '1yh-WXHSry5rws1r5P9I2jJnrqARvSpSL' },
    '17A': { pages: [25], title: 'Voice-over end card', fileId: '1BW_FjkaqHnOllb6dpks7pZZwZwb0HAth' },
    '18A': { pages: [26], title: 'Animated SEV logo', fileId: '1Zi20Ir9_80UgF4BEpaRPMnuVuFikQPkA' }
  };

  function pageLabel(pages) { return pages.length === 1 ? `PDF page ${pages[0]}` : `PDF pages ${pages[0]}–${pages[pages.length - 1]}`; }
  function scenePreviewUrl(fileId) { return `https://drive.google.com/file/d/${fileId}/preview`; }
  function sceneViewUrl(fileId) { return `https://drive.google.com/file/d/${fileId}/view?usp=drive_link`; }

  function markFilmedScenes() {
    document.querySelectorAll('[data-storyboard-scene="7A"]').forEach(element => {
      element.classList.add('filmed');
      element.setAttribute('aria-label', 'Scene 7A. Filmet.');
      if (element.classList.contains('storyboard-chip')) {
        element.textContent = '✓ 7A · FILMET';
      } else if (element.classList.contains('storyboard-scene-card') && !element.querySelector('.storyboard-filmed-tag')) {
        const tag = document.createElement('span');
        tag.className = 'storyboard-filmed-tag';
        tag.textContent = '✓ FILMET';
        element.appendChild(tag);
      }
    });
  }

  function setSelectedFilmedStatus(scene) {
    const selected = document.querySelector('.storyboard-selected-scene');
    if (!selected) return;
    selected.querySelector('.storyboard-selected-status')?.remove();
    if (!scene.filmed) return;
    const status = document.createElement('span');
    status.className = 'storyboard-selected-status';
    status.textContent = '✓ SCENEN ER FILMET';
    selected.appendChild(status);
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
    if (!panel || !frame || !frameWrap || panel.dataset.exactPageNavigation === 'scene-files') { markFilmedScenes(); return; }
    panel.dataset.exactPageNavigation = 'scene-files';
    frame.loading = 'eager';
    frame.title = 'SEV storyboard scene viewer';
    let loading = frameWrap.querySelector('.storyboard-page-loading');
    if (!loading) {
      loading = document.createElement('div');
      loading.className = 'storyboard-page-loading';
      loading.setAttribute('role', 'status');
      loading.setAttribute('aria-live', 'polite');
      frameWrap.appendChild(loading);
    }
    if (fullPdfLink) fullPdfLink.href = STORYBOARD_FULL_URL;
    if (note) note.textContent = 'Hver scene åbner som sin egen storyboardfil, så den korrekte scene vises med det samme.';
    let currentSceneId = '';
    let hideTimer = 0;
    function openExactScene(sceneId, options = {}) {
      const scene = storyboardScenePages[sceneId] || storyboardScenePages['1A'];
      if (currentSceneId === sceneId && frame.src.includes(scene.fileId)) { setSelectedFilmedStatus(scene); return; }
      currentSceneId = sceneId;
      window.openPortalTab?.('storyboard');
      panel.querySelectorAll('.storyboard-scene-card').forEach(card => card.classList.toggle('active', card.dataset.storyboardScene === sceneId));
      if (selectedTitle) selectedTitle.textContent = `Scene ${sceneId} · ${scene.title}${scene.filmed ? ' · FILMET' : ''}`;
      if (selectedPage) selectedPage.textContent = pageLabel(scene.pages);
      if (pageLink) pageLink.href = sceneViewUrl(scene.fileId);
      setSelectedFilmedStatus(scene);
      loading.textContent = `Åbner scene ${sceneId}…`;
      loading.classList.add('visible');
      window.clearTimeout(hideTimer);
      frame.src = scenePreviewUrl(scene.fileId);
      hideTimer = window.setTimeout(() => loading.classList.remove('visible'), 2500);
      if (options.scroll !== false) document.getElementById('storyboard-viewer-shell')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    frame.addEventListener('load', () => window.setTimeout(() => loading.classList.remove('visible'), 200));
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
    markFilmedScenes();
    openExactScene('1A', { scroll: false });
  }

  applyCorrectionOnce();
  installExactStoryboardNavigation();
  markFilmedScenes();
  window.setTimeout(() => { applyCorrectionOnce(); installExactStoryboardNavigation(); markFilmedScenes(); }, 250);
  window.setTimeout(markFilmedScenes, 1000);
})();