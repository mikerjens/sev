(() => {
  'use strict';
  const VERSION = '2026-08-24-0847';

  const sceneIds = node => [...(node?.querySelectorAll('[data-scene-link]') || [])]
    .map(link => String(link.dataset.sceneLink || '').toUpperCase())
    .filter(Boolean);

  function remove10AFromScheduled(scope) {
    scope?.querySelectorAll('.ap3-shoot').forEach(card => {
      if (sceneIds(card).includes('10A')) card.remove();
    });
  }

  function ensurePending10A(panel) {
    const pending = panel?.querySelector('.ap3-pending');
    if (!pending) return;
    pending.querySelectorAll('.ap3-pending-row').forEach(row => {
      if (sceneIds(row).includes('10A')) row.remove();
    });
    const tpl = document.createElement('template');
    tpl.innerHTML = `<article class="ap3-pending-row" data-scene10a-pending="${VERSION}">
      <div class="ap3-scenes"><a class="scene-portal-link" href="#storyboard-10a" data-scene-link="10A">10A<span class="ap3-scene-label">· Tøj på tørresnoren</span></a></div>
      <div><strong>Tøj på tørresnoren</strong><span>Ingen fast dato eller tidspunkt. Location: Miðalsbrekka, Vestmanna. Bjarni Lamhauge medvirker. Heidi Mortensen står for styling & props.</span></div>
    </article>`;
    pending.appendChild(tpl.content.firstElementChild);
    const section = pending.closest('.ap3-section');
    const count = section?.querySelector('.ap3-count');
    if (count) count.textContent = `${pending.querySelectorAll('.ap3-pending-row').length} STATUSGRUPPER`;
  }

  function removeGlance10A() {
    const glance = document.querySelector('[data-aug22-glance]');
    if (!glance) return;
    [...glance.querySelectorAll('div')].forEach(row => {
      const text = row.textContent || '';
      if (/10A/.test(text) && /15:30.?16:30/.test(text)) row.remove();
    });
  }

  function updatePersonalSummary() {
    const panel = document.getElementById('panel-my-schedule');
    const summary = panel?.querySelector('.ap3-person-summary');
    if (!summary || !panel) return;
    const count = panel.querySelectorAll('.ap3-plan-list .ap3-shoot').length;
    summary.innerHTML = summary.innerHTML.replace(/\d+ planlagte optagelser/, `${count} planlagte optagelser`);
  }

  function apply() {
    remove10AFromScheduled(document.getElementById('panel-schedule'));
    remove10AFromScheduled(document.getElementById('panel-my-schedule'));
    ensurePending10A(document.getElementById('panel-schedule'));
    ensurePending10A(document.getElementById('panel-my-schedule'));
    removeGlance10A();
    updatePersonalSummary();
    document.documentElement.dataset.scene10aPending = VERSION;
  }

  function delayed() { [20, 80, 180, 400, 800].forEach(d => setTimeout(apply, d)); }
  document.addEventListener('change', e => {
    const s = e.target instanceof HTMLSelectElement ? e.target : null;
    if (s && ['ap3-home-person','ap3-person-select'].includes(s.id)) delayed();
  }, true);
  document.addEventListener('click', e => {
    const t = e.target instanceof Element ? e.target : null;
    if (t?.closest('nav.tabs button[data-tab="schedule"], nav.tabs button[data-tab="my-schedule"], [data-open-personal], .brand, [data-home]')) delayed();
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', delayed, { once:true });
  else delayed();
})();
