(() => {
  'use strict';

  const VERSION = '2026-08-05-1824';

  function replaceText(root, from, to) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.parentElement?.closest('script,style')) return;
      if (node.nodeValue.includes(from)) node.nodeValue = node.nodeValue.split(from).join(to);
    });
  }

  function updateScene4A() {
    const schedule = document.getElementById('panel-schedule');
    const nextScenes = document.getElementById('panel-next-scenes');
    if (!schedule || !nextScenes) return false;

    [schedule, nextScenes].forEach(root => {
      replaceText(root, 'Bygd og præcis location afventer', 'Elduvík · præcis placering ved gadelyset afklares');
      replaceText(root, 'Thomas fastlægger bygd og præcis location.', 'Scene 4A filmes i Elduvík. Den præcise placering ved gadelyset afklares.');
      replaceText(root, 'Præcis bygd og location fastlægges af Thomas.', 'Elduvík er valgt. Den præcise placering ved gadelyset afklares.');
      replaceText(root, 'Gadelys-location', 'Elduvík · gadelys-location');
    });

    document.querySelectorAll('.next-shoot-event').forEach(card => {
      const scenes = card.querySelector('.next-shoot-scenes')?.textContent || '';
      if (!scenes.includes('4A')) return;
      const location = card.querySelector('p');
      if (location) location.textContent = 'Elduvík · præcis placering ved gadelyset afklares';
      card.dataset.locationVersion = VERSION;
    });

    document.querySelectorAll('.producer-location-card').forEach(card => {
      const scenes = card.querySelector('.producer-scenes')?.textContent || card.textContent;
      if (!scenes.includes('4A')) return;
      const title = card.querySelector('.producer-location-title');
      const comment = card.querySelector('.producer-location-comment');
      if (title) title.textContent = 'Elduvík · gadelys-location';
      if (comment) comment.textContent = 'Scene 4A filmes i Elduvík. Den præcise placering ved gadelyset afklares. Elisabeth samler børnenes og forældrenes navne, telefonnumre og e-mailadresser.';
      card.dataset.locationVersion = VERSION;
    });

    return true;
  }

  if (updateScene4A()) return;

  const observer = new MutationObserver(() => {
    if (!updateScene4A()) return;
    observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 6000);
})();
