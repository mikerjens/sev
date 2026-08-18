(() => {
  'use strict';

  const VERSION = '2026-08-18-1036';
  const STORAGE_KEY = 'sev-task-person';
  const DATE_LABEL = 'ONSDAG 19. AUGUST';

  const peopleForMakeup = new Set(['helena', 'heini', 'bjarni']);
  const schedules = [
    {
      key: 'aug19-10a', scenes: ['10A'], title: 'Tøj på tørresnoren', location: 'Miðalsbrekka, Vestmanna',
      times: [['Optagelse', '09:00–10:00']],
      people: ['Thomas Koba · Instruktør og filmmaker', 'Rúni Friis Kjær · Grip / lys', 'Michael Koba · Filmproducer', 'Bjarni Lamhauge · skuespiller', 'Heidi Mortensen · Styling & props'],
      relevant: new Set(['michael','thomas','runi','heidi','bjarni']),
      equipment: ['Tøj til at hænge på snoren', 'Tøj til Bjarni Lamhauge'],
      ready: ['Miðalsbrekka, Vestmanna er location.', 'Bjarni Lamhauge medvirker.', 'Heidi Mortensen står for styling & props.'],
      notes: ['Stillfoto: “Mand hænger tøj på snor”.']
    },
    {
      key: 'aug19-9abc', scenes: ['9A','9B','9C'], title: 'Huset i Vestmanna', location: 'Fjalsvegur 28, Vestmanna',
      times: [['Optagelse', '10:00–12:00']],
      people: ['Thomas Koba · Instruktør og filmmaker', 'Michael Koba · Filmproducer', 'Rúni Friis Kjær · Grip / lys', 'Helena Heðinsdóttir Guttesen · mor', 'Heini Dam Lassen · dreng', 'Heidi Mortensen · mulig styling & props'],
      relevant: new Set(['michael','thomas','runi','heidi','helena','heini']),
      equipment: ['Elbil', 'Varmepumpe', 'Ladestation / ladeboks'],
      ready: ['Locationejer: Laila Friis.', 'Varmepumpens placering er angivet i produktionsplanen.'],
      missing: ['Farven på elbilen er ikke endeligt besluttet og skal afstemmes af Tór Verland, Elisabeth og Bogi.', 'Ladestation skal sættes sammen.', 'Elbil skal findes.'],
      notes: ['Stillfoto: “Mor og dreng er ved varmepumpe eller ladestation”.']
    },
    {
      key: 'aug19-13ab', scenes: ['13A','13B'], title: 'Hus og solpaneler', location: 'Vestmanna · location afstemmes med Thomas Koba',
      times: [['Optagelse', '12:00–13:30']],
      people: ['Thomas Koba · Instruktør og filmmaker', 'Rúni Friis Kjær · Grip / lys', 'Michael Koba · Filmproducer', 'Helena Heðinsdóttir Guttesen · mor', 'Heini Dam Lassen · dreng', 'Heidi Mortensen · Styling'],
      relevant: new Set(['michael','thomas','runi','heidi','helena','heini']),
      equipment: ['Samme tøj som i scene 9A, 9B og 9C'],
      missing: ['Præcis location i Vestmanna skal afstemmes med Thomas Koba.'],
      notes: ['Stillfoto: “Man ser dreng bagfra, mens han beskytter øjnene og kigger på huset med solpaneler”.']
    },
    {
      key: 'aug19-12a', scenes: ['12A'], title: 'Grøn energi fra et vandløb', location: 'Ukendt',
      times: [['Optagelse', '14:00–15:00']],
      people: ['Thomas Koba · Instruktør og filmmaker', 'Rúni Friis Kjær · Grip / lys', 'Michael Koba · Filmproducer', 'Helena Heðinsdóttir Guttesen · mor', 'Heini Dam Lassen · dreng', 'Heidi Mortensen · Styling'],
      relevant: new Set(['michael','thomas','runi','heidi','helena','heini']),
      equipment: ['Samme tøj som i scene 9A, 9B og 9C'],
      missing: ['Location er endnu ikke fastlagt.'],
      notes: ['Stillfoto: “Man ser dreng og mor pege på kilde/vandløb”.']
    },
    {
      key: 'aug19-14a', scenes: ['14A'], title: 'Dreng blæser udenfor', location: 'Ukendt',
      times: [['Optagelse', '15:00–17:00']],
      people: ['Thomas Koba · Instruktør og filmmaker', 'Rúni Friis Kjær · Grip / lys', 'Michael Koba · Filmproducer', 'Heini Dam Lassen · dreng', 'Heidi Mortensen · Styling'],
      relevant: new Set(['michael','thomas','runi','heidi','heini']),
      equipment: ['Lille plastikvindmølle', 'Samme tøj som i scene 9A, 9B og 9C'],
      missing: ['Location er endnu ikke fastlagt.'],
      notes: ['Stillfoto: “Dreng med legetøjsvindmølle”.']
    }
  ];

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[c]);
  const sceneIds = card => [...(card?.querySelectorAll('[data-scene-link]') || [])].map(a => String(a.dataset.sceneLink || '').toUpperCase()).filter(Boolean);

  function sceneLinks(items) {
    const labels = { '9A':'Dreng løber hen til mor','9B':'Elbil og ladeboks','9C':'Varmepumpe','10A':'Tøj på tørresnoren','12A':'Grøn energi fra et vandløb','13A':'Hus og solpaneler','13B':'Dreng blændes af solen','14A':'Dreng blæser udenfor' };
    return items.map(id => `<a class="scene-portal-link" href="#storyboard-${id.toLowerCase()}" data-scene-link="${id}">${id}<span class="ap3-scene-label">· ${esc(labels[id] || '')}</span></a>`).join('');
  }

  function list(items) { return (items || []).map(x => `<li>${esc(x)}</li>`).join(''); }

  function cardMarkup(cfg) {
    return `<article class="ap3-shoot" data-aug19-authoritative="${esc(cfg.key)}">
      <div class="ap3-shoot-top"><div><div class="ap3-kicker">${DATE_LABEL}</div><h3>${esc(cfg.title)}</h3><div class="ap3-location">📍 ${esc(cfg.location)}</div></div><span class="ap3-status">PLANLAGT</span></div>
      <div class="ap3-scenes">${sceneLinks(cfg.scenes)}</div>
      <div class="ap3-time-grid">${cfg.times.map(([l,v]) => `<div class="ap3-time"><span>${esc(l)}</span><b>${esc(v)}</b></div>`).join('')}</div>
      <div class="ap3-details">
        <section class="ap3-detail-box"><h4>Hvem er med?</h4><div class="ap3-people">${cfg.people.map(p => `<span class="ap3-person">${esc(p)}</span>`).join('')}</div></section>
        <section class="ap3-detail-box"><h4>Rekvisitter · styling · udstyr</h4><ul>${list(cfg.equipment)}</ul></section>
        ${(cfg.ready && cfg.ready.length) ? `<section class="ap3-detail-box"><h4>✓ På plads</h4><ul>${list(cfg.ready)}</ul></section>` : ''}
        ${(cfg.missing && cfg.missing.length) ? `<section class="ap3-detail-box missing"><h4>⚠ Mangler / skal afklares</h4><ul>${list(cfg.missing)}</ul></section>` : ''}
      </div>
      ${(cfg.notes && cfg.notes.length) ? `<div class="ap3-note"><b>Stillfoto:</b> ${esc(cfg.notes[0].replace(/^Stillfoto:\s*/i,''))}</div>` : ''}
      <div class="ap3-actions"><a class="ap3-action primary scene-portal-link" href="#storyboard-${cfg.scenes[0].toLowerCase()}" data-scene-link="${cfg.scenes[0]}">Åbn storyboard</a><button class="ap3-action secondary" type="button" data-open-team>TEAM · telefonnumre</button><button class="ap3-action secondary" type="button" data-open-personal>Mit skema</button></div>
    </article>`;
  }

  function makeNode(html) { const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; }

  function makeupMarkup() {
    return `<article class="ap3-shoot" data-aug19-makeup-call="${VERSION}" style="border-left-color:var(--current)">
      <div class="ap3-shoot-top"><div><div class="ap3-kicker">${DATE_LABEL}</div><h3>Make-up · fælles call</h3><div class="ap3-location">📍 Stjørnuskotið · Niels Finsensgøta 22 / Kongagøta 4</div></div><span class="ap3-status">CALL</span></div>
      <div class="ap3-time-grid"><div class="ap3-time"><span>Mødetid</span><b>07:30</b></div></div>
      <div class="ap3-details"><section class="ap3-detail-box"><h4>Skuespillere</h4><div class="ap3-people"><span class="ap3-person">Helena Heðinsdóttir Guttesen</span><span class="ap3-person">Heini Dam Lassen</span><span class="ap3-person">Bjarni Lamhauge</span></div></section></div>
    </article>`;
  }

  function removeOldWednesday(list) {
    if (!list) return;
    list.querySelectorAll('.ap3-shoot').forEach(card => {
      const ids = sceneIds(card);
      if (ids.some(id => ['9A','9B','9C','10A','12A','13A','13B','14A'].includes(id))) card.remove();
      else if (/19\. AUGUST/i.test(card.textContent || '') && card.dataset.aug19MakeupCall !== VERSION) card.remove();
    });
    list.querySelectorAll('[data-aug19-makeup-call]').forEach(x => x.remove());
  }

  function removeScheduledFromPending(scope) {
    scope?.querySelectorAll('.ap3-pending-row').forEach(row => {
      const ids = sceneIds(row);
      if (ids.some(id => ['9A','9B','9C','10A','12A','13A','13B','14A'].includes(id))) row.remove();
    });
  }

  function syncHome() {
    const panel = document.getElementById('panel-schedule');
    const list = panel?.querySelector('.ap3-plan-list');
    if (!panel || !list) return;
    removeOldWednesday(list);
    list.appendChild(makeNode(makeupMarkup()));
    schedules.forEach(cfg => list.appendChild(makeNode(cardMarkup(cfg))));
    removeScheduledFromPending(panel);
    panel.dataset.aug19Authoritative = VERSION;
  }

  function ensureBjarniOption(select) {
    if (!select || select.querySelector('option[value="bjarni"]')) return;
    const o=document.createElement('option'); o.value='bjarni'; o.textContent='Bjarni Lamhauge · Skuespiller · scene 10A'; select.appendChild(o);
  }

  function ensureOptions() {
    ensureBjarniOption(document.getElementById('ap3-home-person'));
    ensureBjarniOption(document.getElementById('ap3-person-select'));
  }

  function currentPerson() {
    const p=document.getElementById('ap3-person-select')?.value || document.getElementById('ap3-home-person')?.value || '';
    if (p) return p;
    try { const s=localStorage.getItem(STORAGE_KEY)||''; return s==='all'?'':s; } catch (_) { return ''; }
  }

  function syncPersonal() {
    const panel=document.getElementById('panel-my-schedule');
    let list=panel?.querySelector('.ap3-plan-list');
    if (!panel) return;
    ensureOptions();
    if (!list) {
      list=document.createElement('div'); list.className='ap3-plan-list'; panel.appendChild(list);
    }
    removeOldWednesday(list);
    const person=currentPerson();
    if (!person) return;
    if (peopleForMakeup.has(person)) list.appendChild(makeNode(makeupMarkup()));
    schedules.filter(cfg => cfg.relevant.has(person)).forEach(cfg => list.appendChild(makeNode(cardMarkup(cfg))));
    removeScheduledFromPending(panel);
    const summary=panel.querySelector('.ap3-person-summary');
    if (summary) {
      const count=list.querySelectorAll('.ap3-shoot[data-aug19-authoritative]').length;
      summary.innerHTML=summary.innerHTML.replace(/\d+ planlagte optagelser/, `${count} planlagte optagelser`);
    }
    panel.dataset.aug19Authoritative = VERSION;
  }

  function patchTeam() {
    document.querySelectorAll('#panel-crew .ap3-team-card').forEach(card => {
      if (!/Bjarni Lamhauge/i.test(card.textContent || '')) return;
      const contact=card.querySelector('.ap3-contact');
      if (contact && !/bl@faer\.fo/i.test(contact.textContent || '')) contact.insertAdjacentHTML('afterbegin','<a href="mailto:bl@faer.fo">✉ bl@faer.fo</a>');
    });
  }

  function refresh() {
    syncHome();
    ensureOptions();
    if (document.getElementById('panel-my-schedule')?.classList.contains('active')) syncPersonal();
    patchTeam();
    document.documentElement.dataset.aug19Authoritative = VERSION;
  }

  function events() {
    if (document.documentElement.dataset.aug19AuthoritativeEvents === VERSION) return;
    document.documentElement.dataset.aug19AuthoritativeEvents = VERSION;
    document.addEventListener('click', e => {
      const t=e.target instanceof Element ? e.target : null; if (!t) return;
      if (t.closest('nav.tabs button[data-tab="schedule"], nav.tabs button[data-tab="my-schedule"], [data-open-personal], .brand, [data-home]')) [40,180,500].forEach(d=>setTimeout(refresh,d));
    }, true);
    document.addEventListener('change', e => {
      const s=e.target instanceof HTMLSelectElement ? e.target : null;
      if (!s || !['ap3-home-person','ap3-person-select'].includes(s.id)) return;
      try { localStorage.setItem(STORAGE_KEY,s.value||''); } catch (_) {}
      [20,120,350,700].forEach(d=>setTimeout(()=>{ ensureOptions(); syncPersonal(); patchTeam(); },d));
    }, true);
  }

  function start() { events(); refresh(); [500,1200,2400,4000].forEach(d=>setTimeout(refresh,d)); }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();
