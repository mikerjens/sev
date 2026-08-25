(() => {
  'use strict';

  const VERSION = '2026-08-25-1449';
  const STORAGE_KEY = 'sev-task-person';
  const DATE_LABEL = 'TIRSDAG 25. AUGUST';
  const ACTIVE = new Set();
  const schedules = [];

  const ids = node => [...(node?.querySelectorAll('[data-scene-link]') || [])].map(a => String(a.dataset.sceneLink || '').toUpperCase()).filter(Boolean);

  function removeAllCurrentShootCards(listEl){
    if(!listEl) return;
    listEl.querySelectorAll('.ap3-shoot').forEach(card=>{
      const scenes=ids(card);
      if(card.hasAttribute('data-current-makeup') || scenes.length || /19\. AUGUST|22\. AUGUST|25\. AUGUST/i.test(card.textContent||'')) card.remove();
    });
  }

  function clearPending(panel){
    if(!panel) return;
    panel.querySelectorAll('.ap3-pending-row').forEach(row=>row.remove());
    panel.querySelectorAll('.ap3-section').forEach(section=>{
      const pending=section.querySelector('.ap3-pending');
      if(!pending) return;
      const counter=section.querySelector('.ap3-count');
      if(counter) counter.textContent='0 STATUSGRUPPER';
      section.style.display='none';
    });
  }

  function syncBanner(root){
    root?.querySelectorAll('[data-aug22-status-banner],[data-current-status]').forEach(x=>x.remove());
    const head=root?.querySelector('.ap3-head');
    if(!head) return;
    head.insertAdjacentHTML('afterend',`<section data-current-status="${VERSION}" style="margin:0 0 14px;padding:14px 16px;border:1px solid rgba(74,222,128,.55);border-left:5px solid #4ade80;border-radius:10px;background:rgba(74,222,128,.08)"><div style="font-weight:900;font-size:14px">STATUS: Alle scener i storyboardet er nu filmet.</div><div style="margin-top:4px;color:var(--text-muted);font-size:11px">Scene 10A, 12A, 13A og 13B er optaget. Der er ingen resterende scener på dagens skema eller under scener uden fast dato. Opdateret tirsdag 25. august 2026 kl. 14:49.</div></section>`);
  }

  function syncGlance(root){
    root?.querySelectorAll('[data-aug22-glance],[data-current-glance]').forEach(x=>x.remove());
  }

  function syncHome(){
    const panel=document.getElementById('panel-schedule');
    const root=panel?.querySelector('[data-plan-v3-root]');
    const listEl=panel?.querySelector('.ap3-plan-list');
    if(!panel||!root||!listEl) return;
    syncBanner(root); syncGlance(root);
    removeAllCurrentShootCards(listEl);
    clearPending(panel);
    panel.dataset.currentProduction=VERSION;
  }

  function syncPersonal(){
    const panel=document.getElementById('panel-my-schedule');
    if(!panel) return;
    let listEl=panel.querySelector('.ap3-plan-list');
    if(!listEl){listEl=document.createElement('div');listEl.className='ap3-plan-list';panel.appendChild(listEl);}
    removeAllCurrentShootCards(listEl);
    clearPending(panel);
    const summary=panel.querySelector('.ap3-person-summary');
    if(summary) summary.innerHTML=summary.innerHTML.replace(/\d+ planlagte optagelser/,'0 planlagte optagelser');
    panel.dataset.currentProduction=VERSION;
  }

  function apply(){
    syncHome();
    if(document.getElementById('panel-my-schedule')?.classList.contains('active')) syncPersonal();
    document.documentElement.classList.add('sev-current-plan-ready');
    document.documentElement.dataset.currentProductionAuthority=VERSION;
  }

  function scheduleApply(){ [20,80,180,400].forEach(d=>setTimeout(apply,d)); }
  document.addEventListener('change',e=>{const s=e.target instanceof HTMLSelectElement?e.target:null;if(s&&['ap3-home-person','ap3-person-select'].includes(s.id))scheduleApply();},true);
  document.addEventListener('click',e=>{const t=e.target instanceof Element?e.target:null;if(t?.closest('nav.tabs button[data-tab="schedule"], nav.tabs button[data-tab="my-schedule"], [data-open-personal], .brand, [data-home]'))scheduleApply();},true);
  function start(){apply();[300,800,1600].forEach(d=>setTimeout(apply,d));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
