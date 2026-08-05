(() => {
  'use strict';

  const VERSION = '2026-08-05-1848';
  const SCENE_TO_STORYBOARD = {
    '1A': '1A',
    '2A': '2A', '2B': '2A', '2C': '2A',
    '3A': '3A', '4A': '4A', '5A': '5A', '6A': '6A', '7A': '7A', '8A': '8A',
    '9A': '9A', '9B': '9A', '9C': '9A',
    '10A': '10A', '11A': '11A', '12A': '12A',
    '13A': '13A', '13B': '13A',
    '14A': '14A', '15A': '15A', '16A': '16A', '17A': '17A', '18A': '18A'
  };

  const TOKEN_PATTERN = /\b(\d+)([A-Z])\s*[–-]\s*(?:(\d+))?([A-Z])\b|\b(\d+[A-Z])\b/g;
  const EXCLUDED_SELECTOR = [
    'a', 'button', 'script', 'style', 'select', 'option', 'textarea', 'input', 'iframe',
    '[contenteditable="true"]', '[data-scene-link]', '[data-storyboard-scene]', '#panel-storyboard'
  ].join(',');

  function addStyles() {
    if (document.getElementById('scene-link-styles')) return;
    const style = document.createElement('style');
    style.id = 'scene-link-styles';
    style.textContent = `
      .scene-portal-link {
        color:var(--current);
        font-weight:700;
        text-decoration:underline;
        text-decoration-thickness:1px;
        text-underline-offset:3px;
        text-decoration-color:rgba(77,217,192,.55);
        cursor:pointer;
      }
      .scene-portal-link:hover,
      .scene-portal-link:focus-visible {
        color:var(--text);
        text-decoration-color:var(--signal);
        outline:none;
      }
      .next-shoot-scenes .scene-portal-link,
      .producer-scenes .scene-portal-link,
      .storyboard-chip .scene-portal-link {
        display:inline-block;
        color:inherit;
        text-decoration:none;
      }
      .next-shoot-scenes .scene-portal-link:hover,
      .next-shoot-scenes .scene-portal-link:focus-visible,
      .producer-scenes .scene-portal-link:hover,
      .producer-scenes .scene-portal-link:focus-visible {
        color:var(--text);
        box-shadow:0 0 0 2px rgba(246,176,66,.45);
        border-radius:3px;
      }
      .scene-link-subscene-note {
        display:block;
        margin-top:7px;
        padding:6px 8px;
        color:var(--signal)!important;
        background:rgba(246,176,66,.09);
        border:1px solid rgba(246,176,66,.28);
        border-radius:6px;
        font-family:'IBM Plex Mono',monospace;
        font-size:10px!important;
        line-height:1.4;
      }
    `;
    document.head.appendChild(style);
  }

  function sceneLink(sceneId) {
    const target = SCENE_TO_STORYBOARD[sceneId];
    const link = document.createElement('a');
    link.className = 'scene-portal-link';
    link.href = `#storyboard-${sceneId.toLowerCase()}`;
    link.dataset.sceneLink = sceneId;
    link.dataset.storyboardTarget = target;
    link.textContent = sceneId;
    link.setAttribute('aria-label', target === sceneId
      ? `Åbn scene ${sceneId} i storyboardet`
      : `Åbn produktionsdel ${sceneId} i storyboardets scenegruppe ${target}`);
    link.title = target === sceneId
      ? `Åbn scene ${sceneId} i storyboardet`
      : `Produktionsdel ${sceneId} åbner storyboardets scenegruppe ${target}`;
    return link;
  }

  function rangeSceneIds(startNumber, startLetter, endNumber, endLetter) {
    const number = startNumber;
    if (endNumber && endNumber !== startNumber) return null;
    const start = startLetter.charCodeAt(0);
    const end = endLetter.charCodeAt(0);
    if (end < start || end - start > 8) return null;
    const ids = [];
    for (let code = start; code <= end; code += 1) {
      const id = `${number}${String.fromCharCode(code)}`;
      if (!SCENE_TO_STORYBOARD[id]) return null;
      ids.push(id);
    }
    return ids;
  }

  function fragmentForText(text) {
    TOKEN_PATTERN.lastIndex = 0;
    let match;
    let lastIndex = 0;
    let changed = false;
    const fragment = document.createDocumentFragment();

    while ((match = TOKEN_PATTERN.exec(text))) {
      let ids = null;
      if (match[5]) {
        ids = SCENE_TO_STORYBOARD[match[5]] ? [match[5]] : null;
      } else {
        ids = rangeSceneIds(match[1], match[2], match[3], match[4]);
      }
      if (!ids) continue;

      fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      ids.forEach((sceneId, index) => {
        if (index) fragment.appendChild(document.createTextNode(' · '));
        fragment.appendChild(sceneLink(sceneId));
      });
      lastIndex = match.index + match[0].length;
      changed = true;
    }

    if (!changed) return null;
    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    return fragment;
  }

  function shouldSkip(node) {
    const parent = node.parentElement;
    if (!parent || !node.nodeValue || !node.nodeValue.trim()) return true;
    if (parent.closest(EXCLUDED_SELECTOR)) return true;
    return false;
  }

  function linkify(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!shouldSkip(node)) nodes.push(node);
    }

    nodes.forEach(node => {
      const fragment = fragmentForText(node.nodeValue);
      if (fragment) node.replaceWith(fragment);
    });
  }

  function showSubsceneNote(sceneId, target) {
    const selected = document.querySelector('.storyboard-selected-scene');
    if (!selected) return;
    selected.querySelector('.scene-link-subscene-note')?.remove();
    if (sceneId === target) return;
    const note = document.createElement('span');
    note.className = 'scene-link-subscene-note';
    note.textContent = `Produktionsdel ${sceneId} vises i storyboardets scenegruppe ${target}.`;
    selected.appendChild(note);
  }

  function openScene(sceneId) {
    const target = SCENE_TO_STORYBOARD[sceneId];
    if (!target) return;

    if (typeof window.openStoryboardScene === 'function') {
      window.openStoryboardScene(target);
      window.setTimeout(() => showSubsceneNote(sceneId, target), 60);
      return;
    }

    window.openPortalTab?.('storyboard');
    document.querySelector('nav.tabs button[data-tab="storyboard"]')?.click();
    window.setTimeout(() => {
      window.openStoryboardScene?.(target);
      showSubsceneNote(sceneId, target);
    }, 250);
  }

  function install() {
    addStyles();
    const main = document.querySelector('main');
    if (!main) return false;
    linkify(main);
    main.dataset.sceneLinksVersion = VERSION;
    return true;
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('[data-scene-link]');
    if (!link) return;
    event.preventDefault();
    openScene(link.dataset.sceneLink);
  });

  let queued = false;
  const observer = new MutationObserver(mutations => {
    if (queued) return;
    if (!mutations.some(mutation => [...mutation.addedNodes].some(node => node.nodeType === 1 || node.nodeType === 3))) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      linkify(document.querySelector('main'));
    });
  });

  if (install()) {
    observer.observe(document.querySelector('main'), { childList: true, subtree: true });
  } else {
    const bootObserver = new MutationObserver(() => {
      if (!install()) return;
      bootObserver.disconnect();
      observer.observe(document.querySelector('main'), { childList: true, subtree: true });
    });
    bootObserver.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(() => bootObserver.disconnect(), 7000);
  }
})();
