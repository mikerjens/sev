(() => {
  'use strict';

  const VERSION = '2026-08-10-1442';
  const LOCAL_PDF = '/storyboard.pdf';
  const DRIVE_VIEW = 'https://drive.google.com/file/d/1tb161Lvzr8Y5R7OdyTiWflT76jwbmgEN/view?usp=drive_link';

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

  const targetScene = sceneId => {
    const id = String(sceneId || '').toUpperCase();
    return SUBSCENE_TARGET[id] || id;
  };

  const pageLabel = scene => scene.pages ? `PDF-side ${scene.pages}` : `PDF-side ${scene.page}`;

  function openStoryboardTab() {
    if (typeof window.openPortalTab === 'function') {
      window.openPortalTab('storyboard');
      return;
    }
    document.querySelector('nav.tabs button[data-tab="storyboard"]')?.click();
  }

  function updateLabels() {
    const panel = document.getElementById('panel-storyboard');
    if (!panel) return;

    const head = panel.querySelector('.section-head');
    if (head) {
      const h2 = head.querySelector('h2');
      const p = head.querySelector('p');
      if (h2) h2.textContent = 'Storyboard og sceneoversigt';
      if (p) p.textContent = 'Klik på en scene. Previewet skifter direkte til den tilhørende storyboard-side.';
    }

    panel.querySelectorAll('.storyboard-scene-card[data-storyboard-scene]').forEach(card => {
      const scene = SCENES[card.dataset.storyboardScene];
      if (!scene) return;
      const title = card.querySelector('.storyboard-scene-title');
      const page = card.querySelector('.storyboard-page-number');
      if (title) title.textContent = scene.title;
      if (page) page.textContent = scene.pages ? `side ${scene.pages}` : `side ${scene.page}`;

      card.classList.remove('filmed');
      card.querySelectorAll('.storyboard-filmed-tag').forEach(tag => tag.remove());
      if (!FILMED.has(card.dataset.storyboardScene)) {
        card.classList.remove('filmed-authoritative');
        card.querySelectorAll('.storyboard-authoritative-filmed-tag').forEach(tag => tag.remove());
      }
    });
  }

  function replacePreview(sceneId, page) {
    const wrap = document.querySelector('#panel-storyboard .storyboard-frame-wrap');
    if (!wrap) return;

    const current = wrap.querySelector('#storyboard-frame');
    if (current?.dataset.stablePage === String(page)) return;

    const frame = document.createElement('iframe');
    frame.className = 'storyboard-frame';
    frame.id = 'storyboard-frame';
    frame.title = `Storyboard · scene ${sceneId} · PDF-side ${page}`;
    frame.loading = 'eager';
    frame.dataset.stablePage = String(page);
    frame.dataset.scene = sceneId;
    frame.src = `${LOCAL_PDF}#page=${page}&zoom=page-width`;

    if (current) current.replaceWith(frame);
    else wrap.appendChild(frame);
  }

  function openScene(sceneId, options = {}) {
    const requested = String(sceneId || '').toUpperCase();
    const target = targetScene(requested);
    const scene = SCENES[target];
    const panel = document.getElementById('panel-storyboard');
    if (!scene || !panel) return;

    openStoryboardTab();

    panel.querySelectorAll('.storyboard-scene-card[data-storyboard-scene]').forEach(card => {
      card.classList.toggle('active', card.dataset.storyboardScene === target);
    });

    const selectedTitle = panel.querySelector('#storyboard-selected-title');
    const selectedPage = panel.querySelector('#storyboard-selected-page');
    const pageLink = panel.querySelector('#storyboard-page-link');
    const fullLink = panel.querySelector('.storyboard-action.primary');

    if (selectedTitle) selectedTitle.textContent = `Scene ${requested} · ${scene.title}`;
    if (selectedPage) {
      selectedPage.textContent = requested === target
        ? pageLabel(scene)
        : `${pageLabel(scene)} · produktionsdel ${requested} vises i scenegruppe ${target}`;
    }
    if (pageLink) {
      pageLink.href = `${LOCAL_PDF}#page=${scene.page}&zoom=page-width`;
      pageLink.textContent = 'Åbn den valgte side';
    }
    if (fullLink) {
      fullLink.href = DRIVE_VIEW;
      fullLink.textContent = 'Åbn hele PDF-filen';
    }

    // A fresh iframe is used for every different page. This avoids Chrome/Drive
    // keeping the first PDF page alive when only the URL hash changes.
    replacePreview(target, scene.page);

    if (options.scroll !== false) {
      panel.querySelector('#storyboard-viewer-shell')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function activeSceneId() {
    return document.querySelector('#panel-storyboard .storyboard-scene-card.active[data-storyboard-scene]')?.dataset.storyboardScene || '1A';
  }

  function installClicks() {
    if (document.documentElement.dataset.storyboardStableClicksV3 === VERSION) return;
    document.documentElement.dataset.storyboardStableClicksV3 = VERSION;

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const sceneButton = target.closest('#panel-storyboard [data-storyboard-scene]');
      if (sceneButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openScene(sceneButton.dataset.storyboardScene);
        return;
      }

      const storyboardTab = target.closest('nav.tabs button[data-tab="storyboard"]');
      if (storyboardTab) {
        const frame = document.getElementById('storyboard-frame');
        if (!frame || frame.src === 'about:blank' || !frame.dataset.stablePage) {
          window.setTimeout(() => openScene(activeSceneId(), { scroll: false }), 0);
        }
      }
    }, true);
  }

  function install() {
    const panel = document.getElementById('panel-storyboard');
    const frame = document.getElementById('storyboard-frame');
    if (!panel || !frame) return false;

    updateLabels();
    installClicks();
    window.openStoryboardScene = openScene;

    // Keep the portal light: PDF loads only when Storyboard is actually used.
    if (!frame.dataset.stablePage) frame.src = 'about:blank';

    panel.dataset.storyboardStableV3 = VERSION;
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
