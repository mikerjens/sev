(() => {
  'use strict';
  const VERSION = '2026-08-10-1427';
  const MAP = {
    '1A':'1A','2A':'2A','2B':'2A','2C':'2A','3A':'3A','4A':'4A','5A':'5A','6A':'6A','7A':'7A','8A':'8A',
    '9A':'9A','9B':'9A','9C':'9A','10A':'10A','11A':'11A','12A':'12A','13A':'13A','13B':'13A','14A':'14A','15A':'15A','16A':'16A','17A':'17A','18A':'18A'
  };
  const PATTERN = /\b(\d+[A-Z])\b/g;
  const EXCLUDE = 'a,button,script,style,select,option,textarea,input,iframe,[contenteditable="true"],[data-scene-link],[data-storyboard-scene],#panel-storyboard';

  function addStyles() {
    if (document.getElementById('scene-link-styles')) return;
    const style = document.createElement('style');
    style.id = 'scene-link-styles';
    style.textContent = '.scene-portal-link{color:var(--current);font-weight:700;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px;text-decoration-color:rgba(77,217,192,.55);cursor:pointer}.scene-portal-link:hover,.scene-portal-link:focus-visible{color:var(--text);text-decoration-color:var(--signal);outline:none}';
    document.head.appendChild(style);
  }

  function makeLink(sceneId) {
    const link = document.createElement('a');
    link.className = 'scene-portal-link';
    link.href = `#storyboard-${sceneId.toLowerCase()}`;
    link.dataset.sceneLink = sceneId;
    link.textContent = sceneId;
    return link;
  }

  function linkify(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (!parent || !node.nodeValue?.trim() || parent.closest(EXCLUDE)) continue;
      if ([...node.nodeValue.matchAll(PATTERN)].some(match => MAP[match[1]])) nodes.push(node);
      PATTERN.lastIndex = 0;
    }
    nodes.forEach(node => {
      PATTERN.lastIndex = 0;
      const text = node.nodeValue;
      let last = 0;
      let match;
      const fragment = document.createDocumentFragment();
      let changed = false;
      while ((match = PATTERN.exec(text))) {
        const id = match[1];
        if (!MAP[id]) continue;
        fragment.appendChild(document.createTextNode(text.slice(last, match.index)));
        fragment.appendChild(makeLink(id));
        last = match.index + match[0].length;
        changed = true;
      }
      if (!changed) return;
      fragment.appendChild(document.createTextNode(text.slice(last)));
      node.replaceWith(fragment);
    });
  }

  function open(sceneId) {
    const target = MAP[sceneId];
    if (!target) return;
    if (typeof window.openStoryboardScene === 'function') {
      window.openStoryboardScene(sceneId);
      return;
    }
    window.openPortalTab?.('storyboard');
    window.setTimeout(() => window.openStoryboardScene?.(sceneId), 150);
  }

  function start() {
    addStyles();
    const main = document.querySelector('main');
    linkify(main);
    window.setTimeout(() => linkify(main), 700);
    document.documentElement.dataset.sceneLinksLightV2 = VERSION;
  }

  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    const link = target?.closest('[data-scene-link]');
    if (!link || link.closest('#panel-storyboard')) return;
    event.preventDefault();
    open(link.dataset.sceneLink);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once:true }); else start();
})();
