(() => {
  const previousScript = document.createElement('script');
  previousScript.src = 'https://cdn.jsdelivr.net/gh/mikerjens/sev@5ae0ec2257c5b42c7b428355e9a51769f6aa0fc6/sun-times.js';
  previousScript.defer = true;
  document.head.appendChild(previousScript);

  const graphicSceneIds = new Set(['17A', '18A']);
  let finished = false;

  function simplifyStoryboardOverview() {
    if (finished) return true;

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

    finished = true;
    return true;
  }

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    if (simplifyStoryboardOverview() || attempts >= 100) {
      window.clearInterval(timer);
    }
  }, 100);

  simplifyStoryboardOverview();
})();
