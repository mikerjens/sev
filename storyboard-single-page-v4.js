(() => {
  'use strict';

  const VERSION = '2026-08-11-1236';
  const LOCAL_PDF = '/storyboard.pdf';
  const DRIVE_VIEW = 'https://drive.google.com/file/d/1tb161Lvzr8Y5R7OdyTiWflT76jwbmgEN/view?usp=drive_link';
  const PDFJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const SCENES = {
    '1A':  { page: 4,  title: 'Lyskontakt og åbningsbillede', card: '1A' },
    '2A':  { page: 5,  title: 'Drengen læser', card: '2A' },
    '2B':  { page: 6,  title: 'Nærbillede af bog/foto', card: '2A' },
    '2C':  { page: 7,  title: 'Arkivfoto / historisk materiale', card: '2A' },
    '3A':  { page: 8,  title: 'Drone over Klaksvík om natten', card: '3A' },
    '4A':  { page: 9,  title: 'Børn under gadelyset', card: '4A' },
    '5A':  { page: 10, title: 'Funningur / Remote village night', card: '5A' },
    '6A':  { page: 11, title: 'Dæmning, turbine, Eiðisvatn og Eiðisverkið', card: '6A' },
    '7A':  { page: 12, title: 'Vindmøller · Eystnes', card: '7A' },
    '8A':  { page: 13, title: 'Drone stiger over øerne', card: '8A' },
    '9A':  { page: 14, title: 'Dreng løber hen til mor', card: '9A' },
    '9B':  { page: 15, title: 'Elbil og ladeboks', card: '9A' },
    '9C':  { page: 16, title: 'Varmepumpe', card: '9A' },
    '10A': { page: 17, title: 'Tøj på tørresnoren', card: '10A' },
    '11A': { page: 18, title: 'Aktiv jordvarmeboring', card: '11A' },
    '12A': { page: 19, title: 'Grøn energi fra et vandløb', card: '12A' },
    '13A': { page: 20, title: 'Hus og solpaneler', card: '13A' },
    '13B': { page: 21, title: 'Dreng blændes af solen', card: '13A' },
    '14A': { page: 22, title: 'Dreng blæser udenfor', card: '14A' },
    '15A': { page: 23, title: 'Måske begynder det med dig', card: '15A' },
    '16A': { page: 24, title: 'Lyset slukkes', card: '16A' },
    '17A': { page: 25, title: 'Voice-over slutkort', card: '17A' },
    '18A': { page: 26, title: 'Animeret SEV-logo', card: '18A' }
  };

  // B/C-delene hører til samme synlige scenegruppe. Kun A-kortet vises i shortcut-listen.
  const GROUPS = {
    '2A': ['2A', '2B', '2C'], '2B': ['2A', '2B', '2C'], '2C': ['2A', '2B', '2C'],
    '9A': ['9A', '9B', '9C'], '9B': ['9A', '9B', '9C'], '9C': ['9A', '9B', '9C'],
    '13A': ['13A', '13B'], '13B': ['13A', '13B']
  };

  const CARD_LABELS = {
    '1A':  { pages: '4', title: 'Lyskontakt og åbningsbillede' },
    '2A':  { pages: '5–7', title: 'Drengen læser, bog/foto og arkiv' },
    '3A':  { pages: '8', title: 'Drone over Klaksvík om natten' },
    '4A':  { pages: '9', title: 'Børn under gadelyset' },
    '5A':  { pages: '10', title: 'Funningur / Remote village night' },
    '6A':  { pages: '11', title: 'Dæmning, turbine, Eiðisvatn og Eiðisverkið' },
    '7A':  { pages: '12', title: 'Vindmøller · Eystnes' },
    '8A':  { pages: '13', title: 'Drone stiger over øerne' },
    '9A':  { pages: '14–16', title: 'Mor og dreng, elbil og varmepumpe' },
    '10A': { pages: '17', title: 'Tøj på tørresnoren' },
    '11A': { pages: '18', title: 'Aktiv jordvarmeboring' },
    '12A': { pages: '19', title: 'Grøn energi fra et vandløb' },
    '13A': { pages: '20–21', title: 'Solenergi og sollys' },
    '14A': { pages: '22', title: 'Dreng blæser udenfor' },
    '15A': { pages: '23', title: 'Måske begynder det med dig' },
    '16A': { pages: '24', title: 'Lyset slukkes' },
    '17A': { pages: '25', title: 'Voice-over slutkort' },
    '18A': { pages: '26', title: 'Animeret SEV-logo' }
  };

  const FILMED = new Set(['3A', '4A', '5A', '6A', '7A']);
  let pdfDocumentPromise = null;
  let pdfJsPromise = null;
  let renderGeneration = 0;
  let currentSceneId = null;
  let resizeTimer = null;

  function loadPdfJs() {
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
      return Promise.resolve(window.pdfjsLib);
    }
    if (pdfJsPromise) return pdfJsPromise;
    pdfJsPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-sev-pdfjs]');
      if (existing) {
        existing.addEventListener('load', () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
          resolve(window.pdfjsLib);
        }, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = PDFJS_URL;
      script.async = true;
      script.dataset.sevPdfjs = VERSION;
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        resolve(window.pdfjsLib);
      };
      script.onerror = () => reject(new Error('PDF.js kunne ikke indlæses'));
      document.head.appendChild(script);
    });
    return pdfJsPromise;
  }

  async function getPdfDocument() {
    if (pdfDocumentPromise) return pdfDocumentPromise;
    const pdfjsLib = await loadPdfJs();
    pdfDocumentPromise = pdfjsLib.getDocument({ url: LOCAL_PDF }).promise;
    return pdfDocumentPromise;
  }

  function previewWrap() {
    return document.querySelector('#panel-storyboard .storyboard-frame-wrap');
  }

  function groupFor(sceneId) {
    return GROUPS[sceneId] || [sceneId];
  }

  function preparePreview(groupSize = 1) {
    const wrap = previewWrap();
    if (!wrap) return null;
    wrap.style.aspectRatio = 'auto';
    wrap.style.minHeight = '0';
    wrap.style.position = 'relative';
    wrap.style.background = '#090d10';
    wrap.style.overflowX = 'hidden';
    wrap.style.overflowY = groupSize > 1 ? 'auto' : 'hidden';
    wrap.style.maxHeight = groupSize > 1 ? '78vh' : 'none';
    wrap.style.scrollBehavior = 'smooth';
    return wrap;
  }

  function showLoading(sceneId, groupIds) {
    const wrap = preparePreview(groupIds.length);
    if (!wrap) return;
    const pages = groupIds.map(id => SCENES[id].page).join(', ');
    wrap.innerHTML = `<div class="storyboard-single-page-loading" style="min-height:360px;display:grid;place-items:center;color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:11px">Indlæser scene ${sceneId} · side ${pages}…</div>`;
  }

  function showError(sceneId) {
    const wrap = preparePreview(1);
    if (!wrap) return;
    wrap.innerHTML = `<div style="min-height:320px;display:grid;place-items:center;padding:24px;text-align:center;color:var(--text-muted)"><div><strong style="display:block;color:var(--text);margin-bottom:7px">Preview kunne ikke indlæses</strong><span>Scene ${sceneId}</span></div></div>`;
  }

  async function renderSceneGroup(sceneId) {
    const scene = SCENES[sceneId];
    if (!scene) return;
    const groupIds = groupFor(sceneId);
    currentSceneId = sceneId;
    const generation = ++renderGeneration;
    showLoading(sceneId, groupIds);

    try {
      const pdf = await getPdfDocument();
      if (generation !== renderGeneration) return;
      const wrap = preparePreview(groupIds.length);
      if (!wrap) return;

      const container = document.createElement('div');
      container.className = 'storyboard-scene-group-preview';
      container.style.display = 'grid';
      container.style.gap = groupIds.length > 1 ? '12px' : '0';
      container.style.padding = groupIds.length > 1 ? '10px' : '0';
      wrap.replaceChildren(container);

      for (const id of groupIds) {
        if (generation !== renderGeneration) return;
        const info = SCENES[id];
        const page = await pdf.getPage(info.page);
        if (generation !== renderGeneration) return;

        const section = document.createElement('section');
        section.className = 'storyboard-group-page';
        section.dataset.scene = id;
        section.dataset.page = String(info.page);
        section.style.background = '#090d10';

        if (groupIds.length > 1) {
          const label = document.createElement('div');
          label.className = 'storyboard-group-page-label';
          label.textContent = `SCENE ${id} · PDF-SIDE ${info.page} · ${info.title}`;
          label.style.padding = '8px 10px';
          label.style.color = 'var(--current)';
          label.style.fontFamily = "'IBM Plex Mono', monospace";
          label.style.fontSize = '10px';
          label.style.fontWeight = '850';
          label.style.border = '1px solid var(--border)';
          label.style.borderBottom = '0';
          label.style.borderRadius = '7px 7px 0 0';
          section.appendChild(label);
        }

        const baseViewport = page.getViewport({ scale: 1 });
        const availableWidth = Math.max(320, (wrap.clientWidth || 760) - (groupIds.length > 1 ? 20 : 0));
        const cssScale = availableWidth / baseViewport.width;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const cssViewport = page.getViewport({ scale: cssScale });
        const renderViewport = page.getViewport({ scale: cssScale * pixelRatio });

        const canvas = document.createElement('canvas');
        canvas.className = 'storyboard-single-page-canvas';
        canvas.dataset.scene = id;
        canvas.dataset.page = String(info.page);
        canvas.width = Math.floor(renderViewport.width);
        canvas.height = Math.floor(renderViewport.height);
        canvas.style.display = 'block';
        canvas.style.width = `${Math.floor(cssViewport.width)}px`;
        canvas.style.height = `${Math.floor(cssViewport.height)}px`;
        canvas.style.maxWidth = '100%';
        canvas.style.margin = '0 auto';
        canvas.style.background = '#fff';
        if (groupIds.length > 1) {
          canvas.style.borderRadius = '0 0 7px 7px';
          canvas.style.border = '1px solid var(--border)';
        }
        section.appendChild(canvas);
        container.appendChild(section);

        await page.render({ canvasContext: canvas.getContext('2d'), viewport: renderViewport }).promise;
      }

      if (generation !== renderGeneration) return;
      wrap.dataset.singleStoryboardPage = String(scene.page);
      wrap.dataset.storyboardGroup = groupIds.join(',');

      const requestedIndex = groupIds.indexOf(sceneId);
      if (requestedIndex > 0) {
        const target = container.querySelector(`[data-scene="${sceneId}"]`);
        if (target) wrap.scrollTop = Math.max(0, target.offsetTop - 8);
      } else {
        wrap.scrollTop = 0;
      }
    } catch (error) {
      if (generation === renderGeneration) showError(sceneId);
      console.error('[SEV storyboard] grouped render failed', error);
    }
  }

  function openStoryboardTab() {
    if (typeof window.openPortalTab === 'function') window.openPortalTab('storyboard');
    else document.querySelector('nav.tabs button[data-tab="storyboard"]')?.click();
  }

  function updateLabels() {
    const panel = document.getElementById('panel-storyboard');
    if (!panel) return;
    const head = panel.querySelector('.section-head');
    if (head) {
      if (head.querySelector('h2')) head.querySelector('h2').textContent = 'Storyboard og sceneoversigt';
      if (head.querySelector('p')) head.querySelector('p').textContent = 'Klik på en scene. Hvis den har B/C-dele, vises hele scenegruppen i previewet — rul ned for at se dem.';
    }
    panel.querySelectorAll('.storyboard-scene-card[data-storyboard-scene]').forEach(card => {
      const label = CARD_LABELS[card.dataset.storyboardScene];
      if (!label) return;
      const title = card.querySelector('.storyboard-scene-title');
      const page = card.querySelector('.storyboard-page-number');
      if (title) title.textContent = label.title;
      if (page) page.textContent = `side ${label.pages}`;
      card.classList.remove('filmed');
      card.querySelectorAll('.storyboard-filmed-tag').forEach(tag => tag.remove());
      if (!FILMED.has(card.dataset.storyboardScene)) {
        card.classList.remove('filmed-authoritative');
        card.querySelectorAll('.storyboard-authoritative-filmed-tag').forEach(tag => tag.remove());
      }
    });
  }

  function openScene(sceneId, options = {}) {
    const requested = String(sceneId || '').toUpperCase();
    const resolvedId = SCENES[requested] ? requested : '1A';
    const scene = SCENES[resolvedId];
    const groupIds = groupFor(resolvedId);
    const panel = document.getElementById('panel-storyboard');
    if (!panel) return;

    openStoryboardTab();
    panel.querySelectorAll('.storyboard-scene-card[data-storyboard-scene]').forEach(card => {
      card.classList.toggle('active', card.dataset.storyboardScene === scene.card);
    });

    const selectedTitle = panel.querySelector('#storyboard-selected-title');
    const selectedPage = panel.querySelector('#storyboard-selected-page');
    const pageLink = panel.querySelector('#storyboard-page-link');
    const fullLink = panel.querySelector('.storyboard-action.primary');

    if (selectedTitle) selectedTitle.textContent = `Scene ${resolvedId} · ${scene.title}`;
    if (selectedPage) {
      if (groupIds.length > 1 && resolvedId === groupIds[0]) {
        selectedPage.textContent = `PDF-sider ${SCENES[groupIds[0]].page}–${SCENES[groupIds[groupIds.length - 1]].page} · rul ned for ${groupIds.slice(1).join(' og ')}`;
      } else if (groupIds.length > 1) {
        selectedPage.textContent = `PDF-side ${scene.page} · del af scenegruppe ${groupIds.join(' / ')}`;
      } else {
        selectedPage.textContent = `PDF-side ${scene.page}`;
      }
    }
    if (pageLink) {
      pageLink.href = `${LOCAL_PDF}#page=${scene.page}`;
      pageLink.textContent = 'Åbn den valgte side';
    }
    if (fullLink) {
      fullLink.href = DRIVE_VIEW;
      fullLink.textContent = 'Åbn hele PDF-filen';
    }

    renderSceneGroup(resolvedId);
    if (options.scroll !== false) panel.querySelector('#storyboard-viewer-shell')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function activeSceneId() {
    return document.querySelector('#panel-storyboard .storyboard-scene-card.active[data-storyboard-scene]')?.dataset.storyboardScene || '1A';
  }

  function installClicks() {
    if (document.documentElement.dataset.storyboardSinglePageClicks === VERSION) return;
    document.documentElement.dataset.storyboardSinglePageClicks = VERSION;
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
      if (storyboardTab && !currentSceneId) window.setTimeout(() => openScene(activeSceneId(), { scroll: false }), 0);
    }, true);
  }

  function install() {
    const panel = document.getElementById('panel-storyboard');
    const wrap = previewWrap();
    if (!panel || !wrap) return false;
    updateLabels();
    installClicks();
    window.openStoryboardScene = openScene;
    wrap.replaceChildren();
    wrap.style.minHeight = '0';
    wrap.style.aspectRatio = 'auto';
    panel.dataset.storyboardSinglePageV4 = VERSION;
    return true;
  }

  function start() {
    if (!install()) {
      let tries = 0;
      const timer = window.setInterval(() => {
        tries += 1;
        if (install() || tries >= 12) window.clearInterval(timer);
      }, 250);
    }
  }

  window.addEventListener('resize', () => {
    if (!currentSceneId) return;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => renderSceneGroup(currentSceneId), 180);
  }, { passive: true });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
