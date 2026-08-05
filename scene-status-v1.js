(() => {
  const FILMED_SCENES = new Set(['3A', '6A', '7A']);

  function addStyles() {
    if (document.getElementById('sev-filmed-scene-styles')) return;
    const style = document.createElement('style');
    style.id = 'sev-filmed-scene-styles';
    style.textContent = `
      .storyboard-scene-card.filmed{border-color:#4ade80!important;background:rgba(74,222,128,.13)!important;box-shadow:inset 4px 0 0 #4ade80}
      .storyboard-scene-card.filmed .storyboard-scene-number{color:#4ade80}
      .storyboard-filmed-tag{display:inline-flex;margin-top:7px;padding:3px 7px;color:#071512;background:#4ade80;border-radius:100px;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:800;letter-spacing:.05em}
      .storyboard-chip.filmed{color:#071512!important;background:#4ade80!important;border-color:#4ade80!important;font-weight:800}
      .storyboard-selected-status{display:inline-flex;margin-top:6px;padding:3px 8px;color:#071512;background:#4ade80;border-radius:100px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:800;letter-spacing:.05em}
    `;
    document.head.appendChild(style);
  }

  function markScene(sceneId) {
    document.querySelectorAll(`[data-storyboard-scene="${sceneId}"]`).forEach(element => {
      element.classList.add('filmed');
      element.setAttribute('aria-label', `Scene ${sceneId}. Filmet.`);

      if (element.classList.contains('storyboard-chip')) {
        element.textContent = `✓ ${sceneId} · FILMET`;
      }

      if (element.classList.contains('storyboard-scene-card') && !element.querySelector('.storyboard-filmed-tag')) {
        const tag = document.createElement('span');
        tag.className = 'storyboard-filmed-tag';
        tag.textContent = '✓ FILMET';
        element.appendChild(tag);
      }
    });
  }

  function markSelectedScene() {
    const active = document.querySelector('.storyboard-scene-card.active[data-storyboard-scene]');
    const selected = document.querySelector('.storyboard-selected-scene');
    if (!active || !selected || !FILMED_SCENES.has(active.dataset.storyboardScene)) return;

    if (!selected.querySelector('.storyboard-selected-status')) {
      const status = document.createElement('span');
      status.className = 'storyboard-selected-status';
      status.textContent = '✓ SCENEN ER FILMET';
      selected.appendChild(status);
    }
  }

  function correctRemainingSceneText() {
    const root = document.getElementById('panel-schedule');
    if (!root) return;
    const replacements = new Map([
      ['Scener 3A, 5A, 6A og 8A efter vejr, sigt og lys. Scene 7A er filmet.', 'Scener 5A og 8A efter vejr, sigt og lys. Scener 3A, 6A og 7A er filmet.'],
      ['Optag scene 3A i Fuglafjørður eller Vestmanna samt de resterende billeder af lille bygd, dæmning og ø-landskaber. Klaksvík må ikke bruges til droneflyvning, og scene 7A er allerede filmet.', 'Optag de resterende billeder af lille bygd og ø-landskaber. Scener 3A, 6A og 7A er allerede filmet.']
    ]);

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      for (const [from, to] of replacements) {
        if (node.nodeValue.includes(from)) node.nodeValue = node.nodeValue.replace(from, to);
      }
    });
  }

  function apply() {
    addStyles();
    FILMED_SCENES.forEach(markScene);
    markSelectedScene();
    correctRemainingSceneText();
  }

  document.addEventListener('click', event => {
    if (!event.target.closest('[data-storyboard-scene]')) return;
    window.setTimeout(apply, 0);
  }, true);

  apply();
  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    apply();
    if (attempts >= 60) window.clearInterval(timer);
  }, 100);
})();
