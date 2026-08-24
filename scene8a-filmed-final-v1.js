(() => {
  'use strict';
  const VERSION = '2026-08-24-0845';
  const SCENE = '8A';

  function sceneIds(node) {
    return [...(node?.querySelectorAll('[data-scene-link]') || [])]
      .map(link => String(link.dataset.sceneLink || '').toUpperCase())
      .filter(Boolean);
  }

  function removePending8A() {
    document.querySelectorAll('#panel-schedule .ap3-pending-row, #panel-my-schedule .ap3-pending-row').forEach(row => {
      if (sceneIds(row).includes(SCENE)) row.remove();
    });
    document.querySelectorAll('.ap3-section').forEach(section => {
      const pending = section.querySelector('.ap3-pending');
      if (!pending) return;
      const count = pending.querySelectorAll('.ap3-pending-row').length;
      const counter = section.querySelector('.ap3-count');
      if (counter) counter.textContent = `${count} STATUSGRUPPER`;
    });
  }

  function ensureFilmedCard() {
    const section = document.getElementById('authoritative-filmed-scenes');
    const grid = section?.querySelector('.afs-grid');
    if (!section || !grid) return;

    const existing = [...grid.querySelectorAll('.afs-card')].find(card => sceneIds(card).includes(SCENE));
    if (!existing) {
      const article = document.createElement('article');
      article.className = 'afs-card';
      article.innerHTML = `<div style="display:flex;justify-content:space-between;gap:8px"><a class="scene-portal-link" href="#storyboard-8a" data-scene-link="8A" style="color:#4ade80;font-family:'IBM Plex Mono',monospace;font-weight:900;text-decoration:none">SCENE 8A</a><span style="padding:3px 6px;color:#071512;background:#4ade80;border-radius:99px;font-family:'IBM Plex Mono',monospace;font-size:8px;font-weight:900">✓ FILMET</span></div><h4 style="margin-top:8px">Drone view over Færøerne</h4><p style="margin-top:3px;color:var(--text-muted);font-size:11px">Færøerne · droneoptagelse</p>`;
      grid.appendChild(article);
    }

    const count = grid.querySelectorAll('.afs-card').length;
    const counter = section.querySelector('.afs-count');
    if (counter) counter.textContent = `${count} SCENER FILMET`;
  }

  function markStoryboard() {
    document.querySelectorAll('.storyboard-scene-card[data-storyboard-scene="8A"], .storyboard-scene-card[data-storyboard-scene="8a"]').forEach(card => {
      card.classList.add('filmed-authoritative');
      if (!card.querySelector('.storyboard-authoritative-filmed-tag')) {
        const tag = document.createElement('span');
        tag.className = 'storyboard-authoritative-filmed-tag';
        tag.textContent = '✓ FILMET';
        card.appendChild(tag);
      }
    });
  }

  function apply() {
    removePending8A();
    ensureFilmedCard();
    markStoryboard();
    document.documentElement.dataset.scene8aFilmedFinal = VERSION;
  }

  function delayedApply() {
    [0, 120, 350, 800, 1600].forEach(delay => window.setTimeout(apply, delay));
  }

  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    if (target.closest('nav.tabs button, .brand, [data-home], [data-open-personal]')) delayedApply();
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', delayedApply, { once:true });
  else delayedApply();
})();
