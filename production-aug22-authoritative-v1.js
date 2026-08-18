(() => {
  'use strict';

  const VERSION = '2026-08-18-1905';
  const STORAGE_KEY = 'sev-task-person';
  const DATE_LABEL = 'LØRDAG 22. AUGUST';
  const TARGET_SCENES = new Set(['9A','9B','9C','10A','12A','13A','13B','14A']);
  const peopleForMakeup = new Set(['helena','heini','bjarni']);

  const schedules = [
    {
      key:'aug22-9abc', scenes:['9A','9B','9C'], title:'Huset i Vestmanna', location:'Fjalsvegur 28, Vestmanna',
      times:[['Optagelse','10:00–11:30']],
      people:['Thomas Koba · Instruktør og filmmaker','Rúni Friis Kjær · Grip / lys','Michael Koba · Filmproducer','Helena Heðinsdóttir Guttesen · mor','Heini Dam Lassen · dreng','Heidi Mortensen · mulig styling & props'],
      relevant:new Set(['michael','thomas','runi','heidi','helena','heini']),
      equipment:['Elbil','Varmepumpe','Ladestation / ladeboks'],
      ready:['Locationejer: Laila Friis.','Demich har leveret varmepumpe.','SEV har leveret ladestation.','SEV leverer elbil.'],
      notes:['Stillfoto: “Mor og dreng er ved varmepumpe eller ladestation”.']
    },
    {
      key:'aug22-13ab', scenes:['13A','13B'], title:'Hus og solpaneler', location:'Vestmanna · location afstemmes med Thomas Koba',
      times:[['Optagelse','11:30–12:30']],
      people:['Thomas Koba · Instruktør og filmmaker','Rúni Friis Kjær · Grip / lys','Michael Koba · Filmproducer','Helena Heðinsdóttir Guttesen · mor','Heini Dam Lassen · dreng','Heidi Mortensen · Styling'],
      relevant:new Set(['michael','thomas','runi','heidi','helena','heini']),
      equipment:['Samme tøj som i scene 9A, 9B og 9C'],
      missing:['Præcis location i Vestmanna skal afstemmes med Thomas Koba.'],
      notes:['Stillfoto: “Man ser dreng bagfra, mens han beskytter øjnene og kigger på huset med solpaneler”.']
    },
    {
      key:'aug22-12a', scenes:['12A'], title:'Grøn energi fra et vandløb', location:'Ukendt',
      times:[['Optagelse','13:00–14:30']],
      people:['Thomas Koba · Instruktør og filmmaker','Rúni Friis Kjær · Grip / lys','Michael Koba · Filmproducer','Helena Heðinsdóttir Guttesen · mor','Heini Dam Lassen · dreng','Heidi Mortensen · Styling'],
      relevant:new Set(['michael','thomas','runi','heidi','helena','heini']),
      equipment:['Samme tøj som i scene 9A, 9B og 9C'],
      missing:['Location er endnu ikke fastlagt.'],
      notes:['Stillfoto: “Man ser dreng og mor pege på kilde/vandløb”.']
    },
    {
      key:'aug22-14a', scenes:['14A'], title:'Dreng blæser udenfor', location:'Ukendt',
      times:[['Optagelse','14:30–15:30']],
      people:['Thomas Koba · Instruktør og filmmaker','Rúni Friis Kjær · Grip / lys','Michael Koba · Filmproducer','Heini Dam Lassen · dreng','Heidi Mortensen · Styling'],
      relevant:new Set(['michael','thomas','runi','heidi','heini']),
      equipment:['Lille plastikvindmølle','Samme tøj som i scene 9A, 9B og 9C'],
      missing:['Location er endnu ikke fastlagt.'],
      notes:['Stillfoto: “Dreng med legetøjsvindmølle”.']
    },
    {
      key:'aug22-10a', scenes:['10A'], title:'Tøj på tørresnoren', location:'Miðalsbrekka, Vestmanna',
      times:[['Optagelse','15:30–16:30']],
      people:['Thomas Koba · Instruktør og filmmaker','Rúni Friis Kjær · Grip / lys','Michael Koba · Filmproducer','Bjarni Lamhauge · skuespiller','Heidi Mortensen · Styling & props'],
      relevant:new Set(['michael','thomas','runi','heidi','bjarni']),
      equipment:['Tøj til at hænge på snoren','Tøj til Bjarni Lamhauge'],
      ready:['Miðalsbrekka, Vestmanna er location.','Bjarni Lamhauge medvirker.','Heidi Mortensen står for styling & props.'],
      notes:['Stillfoto: “Mand hænger tøj på snor”.']
    }
  ];

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[c]);
  const sceneIds = card => [...(card?.querySelectorAll('[data-scene-link]') || [])].map(a => String(a.dataset.sceneLink || '').toUpperCase()).filter(Boolean);
  const list = items => (items || []).map(x => `<li>${esc(x)}</li>`).join('');

  function sceneLinks(items) {
    const labels={'9A':'Dreng løber hen til mor','9B':'Elbil og ladeboks','9C':'Varmepumpe','10A':'Tøj på tørresnoren','12A':'Grøn energi fra et vandløb','13A':'Hus og solpaneler','13B':'Dreng blændes af solen','14A':'Dreng blæser udenfor'};
    return items.map(id=>`<a class="scene-portal-link" href="#storyboard-${id.toLowerCase()}" data-scene-link="${id}">${id}<span class="ap3-scene-label">· ${esc(labels[id]||'')}</span></a>`).join('');
  }

  function cardMarkup(cfg) {
    return `<article class="ap3-shoot" data-aug22-authoritative="${esc(cfg.key)}">
      <div class="ap3-shoot-top"><div><div class="ap3-kicker">${DATE_LABEL}</div><h3>${esc(cfg.title)}</h3><div class="ap3-location">📍 ${esc(cfg.location)}</div></div><span class="ap3-status">PLANLAGT</span></div>
      <div class="ap3-scenes">${sceneLinks(cfg.scenes)}</div>
      <div class="ap3-time-grid">${cfg.times.map(([l,v])=>`<div class="ap3-time"><span>${esc(l)}</span><b>${esc(v)}</b></div>`).join('')}</div>
      <div class="ap3-details">
        <section class="ap3-detail-box"><h4>Hvem er med?</h4><div class="ap3-people">${cfg.people.map(p=>`<span class="ap3-person">${esc(p)}</span>`).join('')}</div></section>
        <section class="ap3-detail-box"><h4>Rekvisitter · styling · udstyr</h4><ul>${list(cfg.equipment)}</ul></section>
        ${(cfg.ready&&cfg.ready.length)?`<section class="ap3-detail-box"><h4>✓ På plads</h4><ul>${list(cfg.ready)}</ul></section>`:''}
        ${(cfg.missing&&cfg.missing.length)?`<section class="ap3-detail-box missing"><h4>⚠ Mangler / skal afklares</h4><ul>${list(cfg.missing)}</ul></section>`:''}
      </div>
      ${(cfg.notes&&cfg.notes.length)?`<div class="ap3-note"><b>Stillfoto:</b> ${esc(cfg.notes[0].replace(/^Stillfoto:\s*/i,''))}</div>`:''}
      <div class="ap3-actions"><a class="ap3-action primary scene-portal-link" href="#storyboard-${cfg.scenes[0].toLowerCase()}" data-scene-link="${cfg.scenes[0]}">Åbn storyboard</a><button class="ap3-action secondary" type="button" data-open-team>TEAM · telefonnumre</button><button class="ap3-action secondary" type="button" data-open-personal>Mit skema</button></div>
    </article>`;
  }

  function makeNode(html){const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild;}

  function makeupMarkup(){
    return `<article class="ap3-shoot" data-aug22-makeup-call="${VERSION}" style="border-left-color:var(--current)">
      <div class="ap3-shoot-top"><div><div class="ap3-kicker">${DATE_LABEL}</div><h3>Make-up · fælles call</h3><div class="ap3-location">📍 Stjørnuskotið · Niels Finsensgøta 22 / Kongagøta 4</div></div><span class="ap3-status">CALL</span></div>
      <div class="ap3-time-grid"><div class="ap3-time"><span>Mødetid</span><b>09:00</b></div></div>
      <div class="ap3-details"><section class="ap3-detail-box"><h4>Skuespillere</h4><div class="ap3-people"><span class="ap3-person">Helena Heðinsdóttir Guttesen</span><span class="ap3-person">Heini Dam Lassen</span><span class="ap3-person">Bjarni Lamhauge</span></div></section></div>
    </article>`;
  }

  function statusBanner(){
    return `<section data-aug22-status-banner style="margin:0 0 14px;padding:14px 16px;border:1px solid rgba(74,222,128,.55);border-left:5px solid #4ade80;border-radius:10px;background:rgba(74,222,128,.08)">
      <div style="font-weight:900;font-size:14px">OPDATERING: Optagelserne er flyttet til lørdag 22. august.</div>
      <div style="margin-top:4px;color:var(--text-muted);font-size:11px">Onsdag 19. august er aflyst som optagedag. Opdateret tirsdag 18. august 2026 kl. 19:05.</div>
    </section>`;
  }

  function glance(){
    const rows=[['09:00','Make-up · Helena, Heini og Bjarni'],['10:00–11:30','9A–9C · Huset i Vestmanna'],['11:30–12:30','13A–13B · Hus og solpaneler'],['13:00–14:30','12A · Grøn energi fra et vandløb'],['14:30–15:30','14A · Dreng blæser udenfor'],['15:30–16:30','10A · Tøj på tørresnoren']];
    return `<section data-aug22-glance style="margin:0 0 18px;padding:15px 16px;background:var(--bg-elevated);border:1px solid var(--border-strong);border-radius:10px"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><div><div style="color:var(--signal);font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:900;letter-spacing:.08em">NÆSTE OPTAGEDAG · HURTIGT OVERBLIK</div><h3 style="margin-top:3px;font-size:18px">LØRDAG 22. AUGUST</h3></div></div><div style="display:grid;gap:5px;margin-top:10px">${rows.map(([t,x])=>`<div style="display:grid;grid-template-columns:105px 1fr;gap:10px;font-size:11.5px"><b style="color:var(--signal);font-family:'IBM Plex Mono',monospace">${t}</b><span>${x}</span></div>`).join('')}</div></section>`;
  }

  function removeOldSchedule(listEl){
    if(!listEl)return;
    listEl.querySelectorAll('.ap3-shoot').forEach(card=>{
      const ids=sceneIds(card);
      if(ids.some(id=>TARGET_SCENES.has(id)) || /19\. AUGUST|22\. AUGUST/i.test(card.textContent||'')) card.remove();
    });
    listEl.querySelectorAll('[data-aug22-makeup-call]').forEach(x=>x.remove());
  }

  function syncPending(panel){
    const pending=panel?.querySelector('.ap3-pending');
    if(!pending)return;
    pending.querySelectorAll('.ap3-pending-row').forEach(row=>{
      const ids=sceneIds(row);
      if(ids.some(id=>TARGET_SCENES.has(id))) row.remove();
      if(ids.includes('8A')) row.remove();
    });
    if(![...pending.querySelectorAll('.ap3-pending-row')].some(row=>sceneIds(row).includes('8A'))){
      const row=makeNode(`<article class="ap3-pending-row"><div class="ap3-scenes"><a class="scene-portal-link" href="#storyboard-8a" data-scene-link="8A">8A<span class="ap3-scene-label">· Drone view over Færøerne</span></a></div><div><strong>Drone view over Færøerne</strong><span>Dato og optagelsesdetaljer er endnu ikke fastlagt.</span></div></article>`);
      pending.appendChild(row);
    }
    const section=pending.closest('.ap3-section');
    const count=section?.querySelector('.ap3-count');
    if(count)count.textContent=`${pending.querySelectorAll('.ap3-pending-row').length} STATUSGRUPPER`;
  }

  function ensureBjarniOption(select){if(!select||select.querySelector('option[value="bjarni"]'))return;const o=document.createElement('option');o.value='bjarni';o.textContent='Bjarni Lamhauge · Skuespiller · scene 10A';select.appendChild(o);}
  function ensureOptions(){ensureBjarniOption(document.getElementById('ap3-home-person'));ensureBjarniOption(document.getElementById('ap3-person-select'));}
  function currentPerson(){const p=document.getElementById('ap3-person-select')?.value||document.getElementById('ap3-home-person')?.value||'';if(p)return p;try{const s=localStorage.getItem(STORAGE_KEY)||'';return s==='all'?'':s;}catch(_){return'';}}

  function syncHome(){
    const panel=document.getElementById('panel-schedule'); const root=panel?.querySelector('[data-plan-v3-root]'); const listEl=panel?.querySelector('.ap3-plan-list'); if(!panel||!root||!listEl)return;
    root.querySelectorAll('[data-aug22-status-banner],[data-aug22-glance]').forEach(x=>x.remove());
    const head=root.querySelector('.ap3-head'); if(head){head.insertAdjacentElement('afterend',makeNode(statusBanner())); head.nextElementSibling?.insertAdjacentElement('afterend',makeNode(glance()));}
    removeOldSchedule(listEl);
    listEl.appendChild(makeNode(makeupMarkup()));
    schedules.forEach(cfg=>listEl.appendChild(makeNode(cardMarkup(cfg))));
    syncPending(panel);
    panel.dataset.aug22Authoritative=VERSION;
  }

  function syncPersonal(){
    const panel=document.getElementById('panel-my-schedule'); if(!panel)return; ensureOptions(); let listEl=panel.querySelector('.ap3-plan-list'); if(!listEl){listEl=document.createElement('div');listEl.className='ap3-plan-list';panel.appendChild(listEl);} removeOldSchedule(listEl);
    const person=currentPerson(); if(!person)return;
    if(peopleForMakeup.has(person))listEl.appendChild(makeNode(makeupMarkup()));
    schedules.filter(cfg=>cfg.relevant.has(person)).forEach(cfg=>listEl.appendChild(makeNode(cardMarkup(cfg))));
    const summary=panel.querySelector('.ap3-person-summary'); if(summary){const count=listEl.querySelectorAll('.ap3-shoot[data-aug22-authoritative]').length;summary.innerHTML=summary.innerHTML.replace(/\d+ planlagte optagelser/,`${count} planlagte optagelser`);}
    panel.dataset.aug22Authoritative=VERSION;
  }

  function refresh(){syncHome();ensureOptions();if(document.getElementById('panel-my-schedule')?.classList.contains('active'))syncPersonal();document.documentElement.classList.add('sev-current-plan-ready');document.documentElement.dataset.aug22Authoritative=VERSION;}

  function events(){if(document.documentElement.dataset.aug22Events===VERSION)return;document.documentElement.dataset.aug22Events=VERSION;document.addEventListener('change',e=>{const s=e.target instanceof HTMLSelectElement?e.target:null;if(!s||!['ap3-home-person','ap3-person-select'].includes(s.id))return;try{localStorage.setItem(STORAGE_KEY,s.value||'');}catch(_){}[10,60,160,350].forEach(d=>setTimeout(()=>{ensureOptions();syncPersonal();document.documentElement.classList.add('sev-current-plan-ready');},d));},true);document.addEventListener('click',e=>{const t=e.target instanceof Element?e.target:null;if(!t)return;if(t.closest('nav.tabs button[data-tab="schedule"], nav.tabs button[data-tab="my-schedule"], [data-open-personal], .brand, [data-home]'))[20,100,260].forEach(d=>setTimeout(refresh,d));},true);}

  function start(){document.documentElement.classList.remove('sev-current-plan-ready');events();[0,100,300,700,1400].forEach(d=>setTimeout(refresh,d));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
