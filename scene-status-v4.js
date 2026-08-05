(() => {
  const filmedScenes = new Map([
    ['3A', 'Filmet i Klaksvík 4. august 2026'],
    ['6A', 'Filmet 4. august 2026'],
    ['7A', 'Filmet 3. august 2026'],
    ['8A', 'Filmet 5. august 2026']
  ]);

  function markScene(sceneId, label) {
    document.querySelectorAll(`[data-storyboard-scene="${sceneId}"]`).forEach(element => {
      element.classList.add('filmed');
      element.setAttribute('aria-label', `Scene ${sceneId}. ${label}.`);

      if (element.classList.contains('storyboard-chip')) {
        element.textContent = `✓ ${sceneId} · FILMET`;
      }

      if (element.classList.contains('storyboard-scene-card')) {
        if (sceneId === '3A') {
          const title = element.querySelector('.storyboard-scene-title');
          if (title) title.textContent = 'Drone over Klaksvík om natten';
          element.title = 'Scene 3A er filmet i Klaksvík. Fuglafjørður og Vestmanna var plan B.';
        }

        let tag = element.querySelector('.storyboard-filmed-tag');
        if (!tag) {
          tag = document.createElement('span');
          tag.className = 'storyboard-filmed-tag';
          element.appendChild(tag);
        }
        tag.textContent = `✓ FILMET · ${label.replace('Filmet ', '')}`;
      }
    });
  }

  function replaceText(root, from, to) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.parentElement?.closest('script,style')) return;
      if (node.nodeValue.includes(from)) {
        node.nodeValue = node.nodeValue.split(from).join(to);
      }
    });
  }

  function updateSchedule() {
    const panel = document.getElementById('panel-schedule');

    replaceText(
      panel,
      'Scener 5A og 8A efter vejr, sigt og lys. Scene 3A, 6A og 7A er filmet.',
      'Scene 5A efter vejr, sigt og lys. Scene 3A, 6A, 7A og 8A er filmet.'
    );
    replaceText(
      panel,
      'De resterende droneoptagelser er scene 5A og 8A.',
      'Den resterende droneoptagelse er scene 5A. Scene 8A er filmet 5. august 2026.'
    );
    replaceText(
      panel,
      'Scener 3A, 6A og 7A er filmet.',
      'Scener 3A, 6A, 7A og 8A er filmet.'
    );
  }

  function updateSelectedScene() {
    const active = document.querySelector('.storyboard-scene-card.active[data-storyboard-scene]');
    const selected = document.querySelector('.storyboard-selected-scene');
    const selectedTitle = document.getElementById('storyboard-selected-title');
    if (!active || !selected) return;

    const sceneId = active.dataset.storyboardScene;
    const label = filmedScenes.get(sceneId);
    selected.querySelector('.storyboard-selected-status')?.remove();
    selected.querySelector('.scene-3a-restriction')?.remove();

    if (sceneId === '3A' && selectedTitle) {
      selectedTitle.textContent = 'Scene 3A · Drone over Klaksvík om natten · FILMET';
    }

    if (!label) return;

    if (selectedTitle && !selectedTitle.textContent.includes('FILMET')) {
      selectedTitle.textContent += ' · FILMET';
    }

    const status = document.createElement('span');
    status.className = 'storyboard-selected-status';
    status.textContent = `✓ ${label.toUpperCase()}`;
    selected.appendChild(status);
  }

  function applyStatus() {
    filmedScenes.forEach((label, sceneId) => markScene(sceneId, label));
    updateSchedule();
    updateSelectedScene();
  }

  document.addEventListener('click', event => {
    if (event.target.closest('[data-storyboard-scene]')) {
      window.setTimeout(updateSelectedScene, 50);
    }
  }, true);

  applyStatus();
  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    applyStatus();
    if (attempts >= 60) window.clearInterval(timer);
  }, 100);
})();
