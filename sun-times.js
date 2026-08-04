(() => {
  const previousScript = document.createElement('script');
  previousScript.src = 'https://cdn.jsdelivr.net/gh/mikerjens/sev@5ae0ec2257c5b42c7b428355e9a51769f6aa0fc6/sun-times.js';
  previousScript.defer = true;
  document.head.appendChild(previousScript);

  const graphicSceneIds = new Set(['17A', '18A']);
  let overviewFinished = false;

  function simplifyStoryboardOverview() {
    if (overviewFinished) return true;

    const sceneList = document.getElementById('storyboard-scene-list');
    if (!sceneList) return false;

    sceneList.querySelectorAll('.storyboard-scene-card[data-storyboard-scene]').forEach(card => {
      if (graphicSceneIds.has(card.dataset.storyboardScene)) card.remove();
    });

    const sideHeading = document.querySelector('#panel-storyboard .storyboard-side-head');
    const title = sideHeading?.querySelector('strong');
    const count = sideHeading?.querySelector('span');
    const visibleScenes = sceneList.querySelectorAll('.storyboard-scene-card').length;

    if (title && title.textContent !== 'Optagescener') title.textContent = 'Optagescener';
    if (count && count.textContent !== `${visibleScenes} scener`) count.textContent = `${visibleScenes} scener`;

    overviewFinished = true;
    return true;
  }

  function replaceText(root, from, to) {
    if (!root) return false;
    let changed = false;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];

    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => {
      if (node.parentElement?.closest('script,style')) return;
      if (!node.nodeValue.includes(from)) return;
      node.nodeValue = node.nodeValue.split(from).join(to);
      changed = true;
    });

    return changed;
  }

  function correctScene3AOverview() {
    const card = document.querySelector('.storyboard-scene-card[data-storyboard-scene="3A"]');
    const title = card?.querySelector('.storyboard-scene-title');
    if (!card || !title) return false;

    title.textContent = 'Drone om natten i Fuglafjørður eller Vestmanna';
    card.setAttribute('aria-label', 'Åbn scene 3A. Droneoptagelse i Fuglafjørður eller Vestmanna. Klaksvík er ikke tilladt til droneflyvning.');
    card.title = 'Klaksvík er ikke tilladt til droneflyvning. Brug Fuglafjørður eller Vestmanna.';
    return true;
  }

  function correctScene3ATask() {
    const schedulePanel = document.getElementById('panel-schedule');
    if (!schedulePanel?.querySelector('.task-card')) return false;

    replaceText(
      schedulePanel,
      'Optag Klaksvík, lille bygd, dæmning, vindmøller og ø-landskaber.',
      'Klaksvík må ikke bruges til droneflyvning. Optag i stedet Fuglafjørður eller Vestmanna samt lille bygd, dæmning, vindmøller og ø-landskaber.'
    );
    replaceText(schedulePanel, 'Klaksvík', 'Fuglafjørður eller Vestmanna');
    return true;
  }

  function updateSelectedScene(sceneId) {
    const selected = document.querySelector('.storyboard-selected-scene');
    const selectedTitle = document.getElementById('storyboard-selected-title');
    if (!selected) return;

    selected.querySelector('.scene-3a-restriction')?.remove();

    if (sceneId !== '3A') return;

    if (selectedTitle) selectedTitle.textContent = 'Scene 3A · Drone om natten i Fuglafjørður eller Vestmanna';

    const note = document.createElement('span');
    note.className = 'scene-3a-restriction';
    note.textContent = 'Klaksvík er ikke tilladt til droneflyvning.';
    note.style.display = 'inline-flex';
    note.style.marginTop = '6px';
    note.style.padding = '3px 8px';
    note.style.color = 'var(--signal)';
    note.style.background = 'rgba(246,176,66,.10)';
    note.style.border = '1px solid rgba(246,176,66,.32)';
    note.style.borderRadius = '100px';
    note.style.fontFamily = "'IBM Plex Mono', monospace";
    note.style.fontSize = '10px';
    note.style.fontWeight = '700';
    selected.appendChild(note);
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-storyboard-scene]');
    if (!target) return;
    const sceneId = target.dataset.storyboardScene;
    window.setTimeout(() => updateSelectedScene(sceneId), 0);
  }, true);

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    const overviewReady = simplifyStoryboardOverview();
    const sceneReady = correctScene3AOverview();
    const taskReady = correctScene3ATask();

    if ((overviewReady && sceneReady && taskReady) || attempts >= 100) {
      window.clearInterval(timer);
    }
  }, 100);

  simplifyStoryboardOverview();
  correctScene3AOverview();
  correctScene3ATask();
})();