(() => {
  'use strict';

  const VERSION = '2026-08-25-1025';
  const STORAGE_KEY = 'sev-task-person';
  const DATE_LABEL = 'TIRSDAG 25. AUGUST';
  const ACTIVE = new Set(['12A','13A','13B','14A']);
  const makeupPeople = new Set(['helena','heini','bjarni']);

  const schedules = [
    {
      key:'aug25-13ab', scenes:['13A','13B'], title:'Hus og solpaneler', location:'Vestmanna · location afstemmes med Thomas Koba', time:'11:30–12:30',
      people:['Thomas Koba · Instruktør og filmmaker','Rúni Friis Kjær · Grip / lys','Michael Koba · Filmproducer','Helena Heðinsdóttir Guttesen · mor','Heini Dam Lassen · dreng','Heidi Mortensen · Styling'],
      relevant:new Set(['michael','thomas','runi','heidi','helena','heini']),
      equipment:['Samme tøj som i scene 9A, 9B og 9C'],
      missing:['Præcis location i Vestmanna skal afstemmes med Thomas Koba.'],
      notes:'Stillfoto: “Man ser dreng bagfra, mens han beskytter øjnene og kigger på huset med solpaneler”.'
    },
    {
      key:'aug25-12a', scenes:['12A'], title:'Grøn energi fra et vandløb', location:'Ukendt', time:'13:00–14:30',
      people:['Thomas Koba · Instruktør og filmmaker','Rúni Friis Kjær · Grip / lys','Michael Koba · Filmproducer','Helena Heðinsdóttir Guttesen · mor','Heini Dam Lassen · dreng','Heidi Mortensen · Styling'],
      relevant:new Set(['michael','thomas','runi','heidi','helena','heini']),
      equipment:['Samme tøj som i scene 9A, 9B og 9C'],
      missing:['Location er endnu ikke fastlagt.'],
      notes:'Stillfoto: “Man ser dreng og mor pege på kilde/vandløb”.'
    },
    {
      key:'aug25-14a', scenes:['14A'], title:'Dreng blæser udenfor', location:'Ukendt', time:'14:30–15:30',
      people:['Thomas Koba · Instruktør og filmmaker','Rúni Friis Kjær · Grip / lys','Michael Koba · Filmproducer','Heini Dam Lassen · dreng','Heidi Mortensen · Styling'],
      relevant:new Set(['michael','thomas','runi','heidi','heini']),
      equipment:['Lille plastikvindmølle','Samme tøj som i scene 9A, 9B og 9C'],
      missing:['Location er endnu ikke fastlagt.'],
      notes:'Stillfoto: “Dreng med legetøjsvindmølle”.'
    }
  ];

  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[c]);
  const ids = node => [...(node?.querySelectorAll('[data-scene-link]') || [])].map(a => String(a.dataset.sceneLink || '').toUpperCase()).filter(Boolean);
  const makeNode = html => { const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; };
  const list = items => (items||[]).map(x=>`<li>${esc(x)}</li>`).join('');

  function sceneLinks(items){
    const labels={'10A':'Tøj på tørresnoren','12A':'Grøn energi fra et vandløb','13A':'Hus og solpaneler','13B':'Dreng blændes af solen','14A':'Dreng blæser udenfor'};
    return items.map(id=>`<a class="scene-portal-link" href="#storyboard-${id.toLowerCase()}" data-scene-link="${id}">${id}<span class="ap3-scene-label">· ${esc(labels[id]||'')}</span></a>`).join('');
  }

  function cardMarkup(cfg){
    return `<article class="ap3-shoot" data-current-production="${cfg.key}">
      <div class="ap3-shoot-top"><div><div class="ap3-kicker">${DATE_LABEL}</div><h3>${esc(cfg.title)}</h3><div class="ap3-location">📍 ${esc(cfg.location)}</div></div><span class="ap3-status">PLANLAGT</span></div>
      <div class="ap3-scenes">${sceneLinks(cfg.scenes)}</div>
      <div class="ap3-time-grid"><div class="ap3-time"><span>Optagelse</span><b>${cfg.time}</b></div></div>
      <div class="ap3-details">
        <section class="ap3-detail-box"><h4>Hvem er med?</h4><div class="ap3-people">${cfg.people.map(p=>`<span class="ap3-person">${esc(p)}</span>`).join('')}</div></section>
        <section class="ap3-detail-box"><h4>Rekvisitter · styling · udstyr</h4><ul>${list(cfg.equipment)}</ul></section>
        ${(cfg.missing&&cfg.missing.length)?`<section class="ap3-detail-box missing"><h4>⚠ Mangler / skal afklares</h4><ul>${list(cfg.missing)}</ul></section>`:''}
      </div>
      <div class="ap3-note"><b>Stillfoto:</b> ${esc(cfg.notes.replace(/^Stillfoto:\s*/i,''))}</div>
      <div class="ap3-actions"><a class="ap3-action primary scene-portal-link" href="#storyboard-${cfg.scenes[0].toLowerCase()}" data-scene-link="${cfg.scenes[0]}">Åbn storyboard</a><button class="ap3-action secondary" type="button" data-open-team>TEAM · telefonnumre</button><button class="ap3-action secondary" type="button" data-open-personal>Mit skema</button></div>
    </article>`;
  }

  function makeupMarkup(){
    return `<article class="ap3-shoot" data-current-makeup="${VERSION}" style="border-left-color:var(--current)">
      <div class="ap3-shoot-top"><div><div class="ap3-kicker">${DATE_LABEL}</div><h3>Make-up · fælles call</h3><div class="ap3-location">📍 Stjørnuskotið · Niels Finsensgøta 22 / Kongagøta 4</div></div><span class="ap3-status">CALL</span></div>
      <div class="ap3-time-grid"><div class="ap3-time"><span>Mødetid</span><b>08:00</b></div></div>
      <div class="ap3-details"><section class="ap3-detail-box"><h4>Skuespillere</h4><div class="ap3-people"><span class="ap3-person">Helena Heðinsdóttir Guttesen</span><span class="ap3-person">Heini Dam Lassen</span><span class="ap3-person">Bjarni Lamhauge</span></div></section></div>
    </article>`;
  }

  function removeCurrentShootCards(listEl){
    if(!listEl) return;
    listEl.querySelectorAll('.ap3-shoot').forEach(card=>{
      const scenes=ids(card);
      if(scenes.some(id=>ACTIVE.has(id) || ['9A','9B','9C','10A'].includes(id)) || /19\. AUGUST|22\. AUGUST|25\. AUGUST/i.test(card.textContent||'')) card.remove();
    });
  }

  function syncPending(panel){
    const pending=panel?.querySelector('.ap3-pending');
    if(!pending) return;
    pending.querySelectorAll('.ap3-pending-row').forEach(row=>{
      const scenes=ids(row);
      if(scenes.some(id=>ACTIVE.has(id) || ['8A','9A','9B','9C','11A','10A'].includes(id))) row.remove();
    });
    const row=makeNode(`<article class="ap3-pending-row" data-current-pending-10a="${VERSION}"><div class="ap3-scenes">${sceneLinks(['10A'])}</div><div><strong>Tøj på tørresnoren</strong><span>Dato og tidspunkt afventer. Location: Miðalsbrekka, Vestmanna. Bjarni Lamhauge medvirker. Heidi Mortensen står for styling & props.</span></div></article>`);
    pending.appendChild(row);
    const section=pending.closest('.ap3-section');
    const counter=section?.querySelector('.ap3-count');
    if(counter) counter.textContent=`${pending.querySelectorAll('.ap3-pending-row').length} STATUSGRUPPER`;
  }

  function syncBanner(root){
    root?.querySelectorAll('[data-aug22-status-banner],[data-current-status]').forEach(x=>x.remove());
    const head=root?.querySelector('.ap3-head');
    if(!head) return;
    head.insertAdjacentHTML('afterend',`<section data-current-status="${VERSION}" style="margin:0 0 14px;padding:14px 16px;border:1px solid rgba(74,222,128,.55);border-left:5px solid #4ade80;border-radius:10px;background:rgba(74,222,128,.08)"><div style="font-weight:900;font-size:14px">VIGTIG STATUS: Tirsdag den 25. august er planlagt som optagedag.</div><div style="margin-top:4px;color:var(--text-muted);font-size:11px">Scene 9A, 9B og 9C er optaget. Der blev ikke foretaget optagelser lørdag den 22. august på grund af vejret. Opdateret tirsdag 25. august 2026.</div></section>`);
  }

  function syncGlance(root){
    root?.querySelectorAll('[data-aug22-glance],[data-current-glance]').forEach(x=>x.remove());
    const status=root?.querySelector('[data-current-status]');
    if(!status) return;
    const rows=[['08:00','Make-up · Helena, Heini og Bjarni'],['11:30–12:30','13A–13B · Hus og solpaneler'],['13:00–14:30','12A · Grøn energi fra et vandløb'],['14:30–15:30','14A · Dreng blæser udenfor']];
    status.insertAdjacentHTML('afterend',`<section data-current-glance="${VERSION}" style="margin:0 0 18px;padding:15px 16px;background:var(--bg-elevated);border:1px solid var(--border-strong);border-radius:10px"><div style="color:var(--signal);font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:900;letter-spacing:.08em">AKTUEL PLAN · HURTIGT OVERBLIK</div><h3 style="margin-top:3px;font-size:18px">${DATE_LABEL}</h3><div style="display:grid;gap:5px;margin-top:10px">${rows.map(([t,x])=>`<div style="display:grid;grid-template-columns:105px 1fr;gap:10px;font-size:11.5px"><b style="color:var(--signal);font-family:'IBM Plex Mono',monospace">${t}</b><span>${x}</span></div>`).join('')}</div></section>`);
  }

  function currentPerson(){
    const p=document.getElementById('ap3-person-select')?.value || document.getElementById('ap3-home-person')?.value || '';
    if(p) return p;
    try { const s=localStorage.getItem(STORAGE_KEY)||''; return s==='all'?'':s; } catch(_) { return ''; }
  }

  function syncHome(){
    const panel=document.getElementById('panel-schedule');
    const root=panel?.querySelector('[data-plan-v3-root]');
    const listEl=panel?.querySelector('.ap3-plan-list');
    if(!panel||!root||!listEl) return;
    syncBanner(root); syncGlance(root);
    removeCurrentShootCards(listEl);
    listEl.appendChild(makeNode(makeupMarkup()));
    schedules.forEach(cfg=>listEl.appendChild(makeNode(cardMarkup(cfg))));
    syncPending(panel);
    panel.dataset.currentProduction=VERSION;
  }

  function syncPersonal(){
    const panel=document.getElementById('panel-my-schedule');
    if(!panel) return;
    let listEl=panel.querySelector('.ap3-plan-list');
    if(!listEl){listEl=document.createElement('div');listEl.className='ap3-plan-list';panel.appendChild(listEl);}
    removeCurrentShootCards(listEl);
    const person=currentPerson();
    if(!person) return;
    if(makeupPeople.has(person)) listEl.appendChild(makeNode(makeupMarkup()));
    schedules.filter(cfg=>cfg.relevant.has(person)).forEach(cfg=>listEl.appendChild(makeNode(cardMarkup(cfg))));
    syncPending(panel);
    const summary=panel.querySelector('.ap3-person-summary');
    if(summary){const count=listEl.querySelectorAll('.ap3-shoot[data-current-production]').length; summary.innerHTML=summary.innerHTML.replace(/\d+ planlagte optagelser/,`${count} planlagte optagelser`);}
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
