(() => {
  const previousScript = document.createElement('script');
  previousScript.src = 'https://cdn.jsdelivr.net/gh/mikerjens/sev@5ae0ec2257c5b42c7b428355e9a51769f6aa0fc6/sun-times.js';
  previousScript.defer = true;
  document.head.appendChild(previousScript);

  const graphicSceneIds = new Set(['17A', '18A']);

  function simplifyStoryboardOverview() {
    const sceneList = document.getElementById('storyboard-scene-list');
    if (!sceneList) return;

    sceneList.querySelectorAll('.storyboard-scene-card[data-storyboard-scene]').forEach(card => {
      if (graphicSceneIds.has(card.dataset.storyboardScene)) card.remove();
    });

    const sideHeading = document.querySelector('#panel-storyboard .storyboard-side-head');
    const title = sideHeading?.querySelector('strong');
    const count = sideHeading?.querySelector('span');
    const visibleScenes = sceneList.querySelectorAll('.storyboard-scene-card').length;

    if (title) title.textContent = 'Optagescener';
    if (count && visibleScenes) count.textContent = `${visibleScenes} scener`;
  }

  const observer = new MutationObserver(simplifyStoryboardOverview);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  simplifyStoryboardOverview();
  window.setTimeout(simplifyStoryboardOverview, 250);
  window.setTimeout(simplifyStoryboardOverview, 1000);
  window.setTimeout(() => {
    simplifyStoryboardOverview();
    observer.disconnect();
  }, 5000);
})();