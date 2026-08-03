(() => {
  const originalScript = document.createElement('script');
  originalScript.src = 'https://cdn.jsdelivr.net/gh/mikerjens/sev@32faab2f57232769277e359dbf4dafb41edf4031/sun-times.js';
  originalScript.defer = true;
  document.head.appendChild(originalScript);

  const style = document.createElement('style');
  style.textContent = `
    .scene-reference-link{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-width:34px;
      margin:1px 2px;
      padding:2px 7px;
      color:var(--current);
      background:rgba(77,217,192,.10);
      border:1px solid rgba(77,217,192,.35);
      border-radius:6px;
      font-family:'IBM Plex Mono',monospace;
      font-size:.9em;
      font-weight:700;
      line-height:1.4;
      text-decoration:none;
      cursor:pointer;
    }
    .scene-reference-link:hover,
    .scene-reference-link:focus-visible{
      color:#071512;
      background:var(--current);
      border-color:var(--current);
      outline:none;
    }
    .scene-reference-link.filmed{
      color:#071512;
      background:#4ade80;
      border-color:#4ade80;
    }
  `;
  document.head.appendChild(style);

  const scenePattern = /\b(1[0-8]|[1-9])A\b/g;

  function linkSceneReferences(root = document.getElementById('panel-schedule')) {
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!scenePattern.test(node.nodeValue || '')) return NodeFilter.FILTER_REJECT;
        scenePattern.lastIndex = 0;
        if (node.parentElement?.closest('a,button,script,style,.scene-reference-link')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => {
      const text = node.nodeValue;
      scenePattern.lastIndex = 0;
      let match;
      let lastIndex = 0;
      const fragment = document.createDocumentFragment();

      while ((match = scenePattern.exec(text))) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        const sceneId = `${match[1]}A`;
        const link = document.createElement('a');
        link.href = `#scene-${sceneId}`;
        link.className = `scene-reference-link${sceneId === '7A' ? ' filmed' : ''}`;
        link.dataset.storyboardScene = sceneId;
        link.textContent = sceneId === '7A' ? '✓ 7A' : sceneId;
        link.setAttribute('aria-label', `Åbn scene ${sceneId} i storyboardet${sceneId === '7A' ? '. Scenen er filmet.' : ''}`);
        link.title = `Åbn scene ${sceneId} i storyboardet`;
        fragment.appendChild(link);
        lastIndex = match.index + match[0].length;
      }

      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      node.replaceWith(fragment);
    });
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('.scene-reference-link');
    if (!link) return;
    event.preventDefault();
    const sceneId = link.dataset.storyboardScene;
    if (typeof window.openStoryboardScene === 'function') {
      window.openStoryboardScene(sceneId);
    } else {
      window.openPortalTab?.('storyboard');
      window.setTimeout(() => window.openStoryboardScene?.(sceneId), 300);
    }
  });

  const observer = new MutationObserver(() => linkSceneReferences());
  observer.observe(document.body, {childList:true, subtree:true});

  linkSceneReferences();
  window.setTimeout(linkSceneReferences, 300);
  window.setTimeout(linkSceneReferences, 1000);
})();