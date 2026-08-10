(() => {
  'use strict';

  const VERSION = '2026-08-10-1352';
  const FILMED = [
    { scene: '3A', title: 'Klaksvík', location: 'Klaksvík' },
    { scene: '5A', title: 'Remote village night', location: 'Funningur' },
    { scene: '6A', title: 'Dæmning, turbine, Eiðisvatn og Eiðisverkið', location: 'Eiði / Eiðisvatn / Eiðisverkið' },
    { scene: '7A', title: 'Vindmøller', location: 'Eystnes' }
  ];

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
    })[char]);
  }

  function addStyles() {
    if (document.getElementById('filmed-scenes-authoritative-styles')) return;
    const style = document.createElement('style');
    style.id = 'filmed-scenes-authoritative-styles';
    style.textContent = `
      #authoritative-filmed-scenes{margin-top:22px;padding:18px;background:rgba(74,222,128,.055);border:1px solid rgba(74,222,128,.28);border-radius:11px}
      #authoritative-filmed-scenes .afs-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:12px}
      #authoritative-filmed-scenes .afs-head h3{font-size:19px}
      #authoritative-filmed-scenes .afs-head p{margin-top:3px;color:var(--text-muted);font-size:11px}
      #authoritative-filmed-scenes .afs-count{color:#4ade80;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:850;letter-spacing:.05em}
      #authoritative-filmed-scenes .afs-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:9px}
      #authoritative-filmed-scenes .afs-card{padding:14px 15px;background:var(--bg-elevated-2);border:1px solid rgba(74,222,128,.24);border-left:4px solid #4ade80;border-radius:8px}
      #authoritative-filmed-scenes .afs-scene{display:flex;align-items:center;justify-content:space-between;gap:8px}
      #authoritative-filmed-scenes .afs-scene a{color:#4ade80!important;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:900;text-decoration:none}
      #authoritative-filmed-scenes .afs-done{padding:3px 6px;color:#071512;background:#4ade80;border-radius:99px;font-family:'IBM Plex Mono',monospace;font-size:8px;font-weight:900}
      #authoritative-filmed-scenes .afs-card h4{margin-top:8px;font-size:14px}
      #authoritative-filmed-scenes .afs-card p{margin-top:3px;color:var(--text-muted);font-size:11px}
      .storyboard-scene-card.filmed-authoritative{border-color:#4ade80!important;background:rgba(74,222,128,.11)!important;box-shadow:inset 4px 0 0 #4ade80}
      .storyboard-scene-card.filmed-authoritative .storyboard-scene-number{color:#4ade80!important}
      .storyboard-authoritative-filmed-tag{display:inline-flex;margin-top:7px;padding:3px 7px;color:#071512;background:#4ade80;border-radius:99px;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:900}
      @media(max-width:650px){#authoritative-filmed-scenes .afs-head{align-items:flex-start;flex-direction:column}#authoritative-filmed-scenes .afs-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function card(item) {
    return `<article class="afs-card">
      <div class="afs-scene"><a class="scene-portal-link" href="#storyboard-${item.scene.toLowerCase()}" data-scene-link="${esc(item.scene)}">SCENE ${esc(item.scene)}</a><span class="afs-done">✓ FILMET</span></div>
      <h4>${esc(item.title)}</h4>
      <p>${esc(item.location)}</p>
    </article>`;
  }

  function renderPlanStatus() {
    const root = document.querySelector('#panel-schedule [data-plan-v3-root]');
    const planList = root?.querySelector('.ap3-plan-list');
    if (!root || !planList) return false;

    let section = root.querySelector('#authoritative-filmed-scenes');
    if (!section) {
      section = document.createElement('section');
      section.id = 'authoritative-filmed-scenes';
      planList.insertAdjacentElement('afterend', section);
    }

    section.dataset.version = VERSION;
    section.innerHTML = `<div class="afs-head"><div><h3>Filmede scener</h3><p>Disse scener er optaget og skal ikke længere planlægges.</p></div><span class="afs-count">${FILMED.length} SCENER FILMET</span></div><div class="afs-grid">${FILMED.map(card).join('')}</div>`;

    [...root.querySelectorAll('*')].forEach(node => {
      if (node.children.length) return;
      const text = (node.textContent || '').trim();
      if (/^1\s+scene\s+(?:er\s+)?(?:filmet|optaget)$/i.test(text)) node.textContent = `${FILMED.length} scener filmet`;
    });

    return true;
  }

  function updateStoryboard() {
    const filmedIds = new Set(FILMED.map(item => item.scene));
    document.querySelectorAll('[data-storyboard-scene]').forEach(element => {
      const scene = element.dataset.storyboardScene;
      const isFilmed = filmedIds.has(scene);
      element.classList.toggle('filmed-authoritative', isFilmed);
      if (!isFilmed) element.querySelector('.storyboard-authoritative-filmed-tag')?.remove();
      if (isFilmed && element.classList.contains('storyboard-scene-card')) {
        let tag = element.querySelector('.storyboard-authoritative-filmed-tag');
        if (!tag) {
          tag = document.createElement('span');
          tag.className = 'storyboard-authoritative-filmed-tag';
          element.appendChild(tag);
        }
        tag.textContent = '✓ FILMET';
      }
    });

    const quick = document.querySelector('.storyboard-quick-copy span');
    if (quick) quick.textContent = 'Filmet: 3A · 5A · 6A · 7A';
  }

  function install() {
    addStyles();
    const ready = renderPlanStatus();
    updateStoryboard();
    return ready;
  }

  install();
  document.addEventListener('DOMContentLoaded', install, { once: true });

  const observer = new MutationObserver(() => {
    if (!document.querySelector('#panel-schedule [data-plan-v3-root]')) return;
    window.requestAnimationFrame(install);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 12000);
})();
