(() => {
  'use strict';

  const VERSION = '2026-08-10-1433';
  const FILE_ID = '1tb161Lvzr8Y5R7OdyTiWflT76jwbmgEN';
  const DRIVE_VIEW = `https://drive.google.com/file/d/${FILE_ID}/view?usp=drive_link`;
  const INLINE_PDF = `https://drive.google.com/uc?export=view&id=${FILE_ID}`;

  const SCENES = {
    '1A': { page: 4, title: 'Lyskontakt og åbningsbillede' },
    '2A': { page: 5, pages: '5–7', title: 'Drengen læser, arkivfoto og fiskere' },
    '3A': { page: 8, title: 'Drone over Klaksvík om natten' },
    '4A': { page: 9, title: 'Børn under gadelyset' },
    '5A': { page: 10, title: 'Funningur / Remote village night' },
    '6A': { page: 11, title: 'Dæmning, turbine, Eiðisvatn og Eiðisverkið' },
    '7A': { page: 12, title: 'Vindmøller · Eystnes' },
    '8A': { page: 13, title: 'Drone stiger over øerne' },
    '9A': { page: 14, pages: '14–16', title: 'Mor og dreng, elbil og varmepumpe' },
    '10A': { page: 17, title: 'Tøj på tørresnoren' },
    '11A': { page: 18, title: 'Aktiv jordvarmeboring' },
    '12A': { page: 19, title: 'Grøn energi fra et vandløb' },
    '13A': { page: 20, pages: '20–21', title: 'Solenergi og sollys' },
    '14A': { page: 22, title: 'Dreng blæser udenfor' },
    '15A': { page: 23, title: 'Måske begynder det med dig' },
    '16A': { page: 24, title: 'Lyset slukkes' },
    '17A': { page: 25, title: 'Voice-over slutkort' },
    '18A': { page: 26, title: 'Animeret SEV-logo' }
  };

  const SUBSCENE_TARGET = {
    '2B': '2A', '2C': '2A',
    '9B': '9A', '9C': '9A',
    '13B': '13A'
  };

  const FILMED = new Set(['3A', '5A', '6A', '7A']);

  function targetScene(sceneId) {
    const id = String(sceneId || '').toUpperCase();
    return SUBSCENE_TARGET[id] || id;
  }

  function pageLabel(scene) {
    return scene.pages ? `PDF-side ${scene.pages}` : `PDF-side ${scene.page}`;
  }

  function openStoryboardTab() {
    if (typeof window.openPortalTab === 'function') {
      window.openPortalTab('storyboard');
      return;
    }
    const button = document.querySelector('nav.tabs button[data-tab="storyboard"]');
    if (button) button.click();
  }

  function updateSceneCards() {
    const panel = document.getElementById('panel-storyboard');
    if (!panel) return;

    const head = panel.querySelector('.section-head');
    if (head) {
      const h2 = head.querySelector('h2');
      const p = head.querySelector('p');
      if (h2) h2.textContent = 'Storyboard og sceneoversigt';
      if (p) p.textContent = 'Vælg en scene for at åbne den tilhørende side i storyboardet.';
    }

    panel.querySelectorAll('.storyboard-scene-card[data-storyboard-scene]').forEach(card => {
      const sceneId = card.dataset.storyboardScene;
      const scene = SCENES[sceneId];
      if (!scene) return;

      const title = card.querySelector('.storyboard-scene-title');
      if (title) title.textContent = scene.title;
      const page = card.querySelector('.storyboard-page-number');
      if (page) page.textContent = scene.pages ? `side ${scene.pages}` : `side ${scene.page}`;

      card.classList.remove('filmed');
      card.querySelectorAll('.storyboard-filmed-tag').forEach(tag => tag.remove());
      if (!FILMED.has(sceneId)) {
        card.classList.remove('filmed-authoritative');
        card.querySelectorAll('.storyboard-authoritative-filmed-tag').forEach(tag => tag.remove());
      }
    });

    panel.querySelectorAll('.storyboard-chip[data-storyboard-scene]').forEach(chip => {
      chip.classList.remove('filmed');
    });
  }

  function setFramePage(frame, sceneId, page) {
    if (!frame) return;
    const pageKey = String(page);
    if (frame.dataset.stablePage === pageKey && frame.dataset.stableLoaded === 'true') return;

    frame.dataset.stablePage = pageKey;
    frame.dataset.stableLoaded = 'false';
    frame.title = `Storyboard · scene ${sceneId} · PDF-side ${page}`;
    frame.loading = 'eager';
    frame.src = `${INLINE_PDF}#page=${page}&zoom=page-width`;
  }

  function openScene(sceneId, options = {}) {
    const requested = String(sceneId || '').toUpperCase();
    const target = targetScene(requested);
    const scene = SCENES[target];
    const panel = document.getElementById('panel-storyboard');
    if (!scene || !panel) return;

    openStoryboardTab();

    panel.querySelectorAll('.storyboard-scene-card').forEach(card => {
      card.classList.toggle('active', card.dataset.storyboardScene === target);
    });

    const selectedTitle = panel.querySelector('#storyboard-selected-title');
    const selectedPage = panel.querySelector('#storyboard-selected-page');
    const pageLink = panel.querySelector('#storyboard-page-link');
    const frame = panel.querySelector('#storyboard-frame');

    if (selectedTitle) selectedTitle.textContent = `Scene ${requested} · ${scene.title}`;
    if (selectedPage) {
      selectedPage.textContent = requested === target
        ? pageLabel(scene)
        : `${pageLabel(scene)} · produktionsdel ${requested} vises i scenegruppe ${target}`;
    }
    if (pageLink) {
      pageLink.href = `${DRIVE_VIEW}#page=${scene.page}`;
      pageLink.textContent = 'Åbn den valgte side';
    }

    const fullLink = panel.querySelector('.storyboard-action.primary');
    if (fullLink) {
      fullLink.href = DRIVE_VIEW;
      fullLink.textContent = 'Åbn hele PDF-filen';
    }

    setFramePage(frame, target, scene.page);

    if (options.scroll !== false) {
      panel.querySelector('#storyboard-viewer-shell')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function activeSceneId() {
    return document.querySelector('#panel-storyboard .storyboard-scene-card.active[data-storyboard-scene]')?.dataset.storyboardScene || '1A';
  }

  function installFrameHandlers() {
    const frame = document.getElementById('storyboard-frame');
    if (!frame || frame.dataset.stableHandlers === VERSION) return;
    frame.dataset.stableHandlers = VERSION;
    frame.addEventListener('load', () => {
      if (frame.src !== 'about:blank') frame.dataset.stableLoaded = 'true';
    });
  }

  function installClickHandler() {
    if (document.documentElement.dataset.storyboardStableClicks === VERSION) return;
    document.documentElement.dataset.storyboardStableClicks = VERSION;

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      const sceneButton = target?.closest('#panel-storyboard [data-storyboard-scene]');
      if (sceneButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openScene(sceneButton.dataset.storyboardScene);
        return;
      }

      const storyboardTab = target?.closest('nav.tabs button[data-tab="storyboard"]');
      if (storyboardTab) {
        const frame = document.getElementById('storyboard-frame');
        if (frame && !frame.dataset.stablePage) {
          window.setTimeout(() => openScene(activeSceneId(), { scroll: false }), 0);
        }
      }
    }, true);
  }

  function install() {
    const panel = document.getElementById('panel-storyboard');
    const frame = document.getElementById('storyboard-frame');
    if (!panel || !frame) return false;

    updateSceneCards();
    installFrameHandlers();
    installClickHandler();
    window.openStoryboardScene = openScene;

    // Do not load the 3.6 MB storyboard in the background. It loads on demand
    // when Storyboard is opened or a scene link is clicked.
    if (!frame.dataset.stablePage) {
      frame.src = 'about:blank';
      frame.dataset.stableLoaded = 'false';
    }

    panel.dataset.storyboardStableV2 = VERSION;
    return true;
  }

  function start() {
    if (install()) return;
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      if (install() || tries >= 12) window.clearInterval(timer);
    }, 250);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
