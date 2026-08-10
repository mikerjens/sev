(() => {
  'use strict';

  const VERSION = '3.0';

  function markVersion() {
    document.documentElement.dataset.sevPortalVersion = VERSION;
    let meta = document.querySelector('meta[name="sev-portal-version"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'sev-portal-version';
      document.head.appendChild(meta);
    }
    meta.content = VERSION;
  }

  function patchScene4A() {
    const root = document.querySelector('#panel-schedule [data-plan-v3-root]');
    if (!root) return false;

    const cards = [...root.querySelectorAll('.ap3-shoot')];
    const scene4A = cards.find(card => /\b4A\b/.test(card.textContent || '') && /Børn under gadelyset/i.test(card.textContent || ''));
    if (!scene4A) return false;

    const walker = document.createTreeWalker(scene4A, NodeFilter.SHOW_TEXT);
    const replacements = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if ((node.nodeValue || '').includes('Nora Vitalis Joensen')) replacements.push(node);
    }
    replacements.forEach(node => {
      node.nodeValue = node.nodeValue.replace(/Nora Vitalis Joensen(?:\s*·\s*6 år)?/g, 'Rókur Thomsen');
    });
    return true;
  }

  function start() {
    markVersion();
    if (!patchScene4A()) window.setTimeout(patchScene4A, 350);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
