(() => {
  'use strict';

  const VERSION = '2026-08-10-1348';
  const STORAGE_KEY = 'sev-task-person';
  const TAB_STORAGE_KEY = 'sev-active-portal-tab';
  let applying = false;
  let scheduledEnsure = false;

  const people = [
    { id: 'michael', name: 'Michael Koba', role: 'Filmproducer' },
    { id: 'thomas', name: 'Thomas Koba', role: 'Instruktør og filmmaker' },
    { id: 'runi', name: 'Rúni Friis Kjær', role: 'Lys' },
    { id: 'heidi', name: 'Heidi Mortensen', role: 'Styling og props' },
    { id: 'elisabeth', name: 'Elisabeth Vitalis Tausen', role: 'SANSIR' },
    { id: 'tor', name: 'Tór Verland Johansen', role: 'SANSIR' },
    { id: 'bogi', name: 'Bogi Henriksen', role: 'SANSIR' },
    { id: 'helena', name: 'Helena Heðinsdóttir Guttesen', role: 'Skuespiller · mor' },
    { id: 'orvur', name: 'Ørvur Heinesen', role: 'Jarðhiti' }
  ];

  const sceneTitles = {
    '1A': 'Lyskontakt og åbningsbillede',
    '2A': 'Drengen læser',
    '2B': 'Nærbillede af bog/foto',
    '4A': 'Børn under gadelyset',
    '9A': 'Dreng løber hen til mor',
    '9B': 'Elbil og ladeboks',
    '9C': 'Varmepumpe',
    '10A': 'Tøj på tørresnoren',
    '11A': 'Aktiv jordvarmeboring',
    '12A': 'Grøn energi fra et vandløb',
    '13A': 'Hus og solpaneler',
    '13B': 'Dreng blændes af solen',
    '14A': 'Dreng blæser udenfor',
    '15A': 'Måske begynder det med dig',
    '16A': 'Lyset slukkes'
  };

  const shoots = [
    {
      date: '2026-08-10',
      dateLabel: 'MANDAG 10. AUGUST',
      status: 'PLANLAGT',
      title: 'Børn under gadelyset',
      location: 'Elduvík · præcis position ved gadelyset afklares',
      scenes: ['4A'],
      times: [['Mødetid / optagelse', '21:30']],
      crew: ['michael', 'thomas', 'runi', 'elisabeth'],
      cast: ['Lias Vitalis Tausen · 5 år', 'Nora Vitalis Joensen · 6 år', 'Vón Thomsen · 7 år'],
      optionalCrew: [],
      equipment: ['Fodbold', 'Gadelys som location-element', 'Lysudstyr', 'Sikkerhedsudstyr'],
      ready: ['Dato og tidspunkt er låst.', 'Elduvík er valgt som bygd.', 'De tre børn er fundet og bekræftet.', 'Alle tilladelser vedrørende børnene er på plads.'],
      missing: ['Den præcise position ved gadelyset skal endeligt fastlægges.', 'Eventuelle øvrige location-/sikkerhedstilladelser håndteres af SANSIR.'],
      note: 'Tre børn leger med bold under et gadelys. Børnenes forældre og kontaktoplysninger findes i TEAM.'
    },
    {
      date: '2026-08-17',
      dateLabel: 'MANDAG 17. AUGUST',
      status: 'PLANLAGT',
      title: 'Indendørs optagelser · mor og dreng',
      location: 'Skálabúðin, Tórshavn',
      scenes: ['1A', '2A', '2B', '15A', '16A'],
      times: [['Crew møder', '12:00'], ['Skuespillere møder', '14:00'], ['Optagelse starter', '14:30']],
      crew: ['michael', 'thomas', 'runi', 'heidi', 'helena'],
      cast: ['Dreng X · navn/kontakt afventer', 'Helena Heðinsdóttir Guttesen · mor'],
      optionalCrew: [],
      equipment: ['Bog/foto til scene 2B', "1970'er-tøj til mor og dreng", 'Styling og makeup', 'Lysudstyr', 'Kontinuitetsfotos'],
      ready: ['Skálabúðin er valgt som location.', 'Dato og alle tre mødetider er låst.', 'Helena Heðinsdóttir Guttesen er bekræftet som mor.', 'Scene 2C er klassificeret som postproduktion og filmes ikke denne dag.'],
      missing: ['Dreng X skal have endeligt navn og kontaktoplysninger registreret.', "Det endelige 1970'er-look, tøj, styling og props skal være klargjort.", 'Drengens hår må ikke klippes før optagelsen.'],
      note: '1A: lyskontakt/åbningsbillede. 2A: drengen læser. 2B: nærbillede af bog/foto. 15A: afsluttende personligt budskab. 16A: lyset slukkes.'
    },
    {
      date: '2026-08-18',
      dateLabel: 'TIRSDAG 18. AUGUST',
      status: 'PLANLAGT',
      title: 'Vestmanna · elbil, ladeboks og varmepumpe',
      location: 'Fjalsvegur 24, Vestmanna',
      scenes: ['9A', '9B', '9C'],
      times: [['Optagevindue', '15:00–18:00'], ['Separat crew-mødetid', 'Ikke angivet i den godkendte plan']],
      crew: ['michael', 'thomas', 'runi', 'helena'],
      cast: ['Dreng X · navn/kontakt afventer', 'Helena Heðinsdóttir Guttesen · mor'],
      optionalCrew: ['heidi'],
      equipment: ['Elbil', 'Ladeboks', 'Varmepumpe', 'Lys og strøm', 'Eventuelt bilrig'],
      ready: ['Dato og optagevindue er låst.', 'Location er låst til Fjalsvegur 24, Vestmanna.', 'Locationejer er Eyðbjørn Joensen.', 'Scenerne 9A, 9B og 9C er opdelt med hver sin funktion.'],
      missing: ['Det skal bekræftes, om Heidi Mortensen står for styling og props.', 'Dreng X skal have endeligt navn og kontaktoplysninger registreret.', 'Separat mødetid for crew/skuespillere er ikke angivet i den godkendte plan.'],
      note: '9A: dreng løber hen til mor. 9B: elbil og ladeboks. 9C: varmepumpe. Kontakt til locationejer findes i TEAM.'
    }
  ];

  const pending = [
    { scenes: ['10A'], title: 'Tøj på tørresnoren', missing: 'Dato, mandlig skuespiller, historisk location, kostume og rekvisitter skal låses.', crew: ['michael', 'thomas', 'elisabeth', 'tor', 'bogi'] },
    { scenes: ['11A'], title: 'Aktiv jordvarmeboring', missing: 'Afventer Jarðhitis borehold tilbage på Streymoy fra Suðuroy. Derefter fastlægges dato, boreplads, adgang og sikkerhed.', crew: ['michael', 'thomas', 'orvur'] },
    { scenes: ['12A'], title: 'Grøn energi fra et vandløb', missing: 'Dato og location afventer. Adgang og sikkerhed skal afklares.', crew: ['michael', 'thomas', 'helena'] },
    { scenes: ['13A', '13B'], title: 'Hus og solpaneler / dreng blændes af solen', missing: 'Dato og fælles location afventer. Solretning og vejr skal passe.', crew: ['michael', 'thomas', 'helena'] },
    { scenes: ['14A'], title: 'Dreng blæser udenfor', missing: 'Dato og tidspunkt afventer godt vejr. Location og endelig billedløsning skal afklares.', crew: ['thomas', 'elisabeth', 'tor', 'bogi'] }
  ];

  const teams = [
    ['Filmhold og produktion', [
      ['Michael Koba', 'Filmproducer · KOVBOY FILM / FIXER.FO', 'michael@kovboyfilm.com', '+298 591011', ''],
      ['Thomas Koba', 'Instruktør og filmmaker · KOVBOY FILM', 'thomas@kovboyfilm.com', '+298 239100', ''],
      ['Rúni Friis Kjær', 'Lys · Friis Frame', 'rfk@friisframe.fo', '+298 218218', 'Crew 10., 17. og 18. august.'],
      ['Heidi Mortensen', 'Styling og props · Atlanta', 'heidi@atlanta.fo', '+298 790050', 'Crew 17. august. Mulig styling/props 18. august.']
    ]],
    ['Bureau og kreativt team', [
      ['Elisabeth Vitalis Tausen', 'Rådgiver · SANSIR', 'elisabeth@sansir.fo', '+298 299365', ''],
      ['Tór Verland Johansen', 'Direktør · SANSIR', 'torverland@sansir.fo', '+298 299372', ''],
      ['Bogi Henriksen', 'Kreativ direktør · SANSIR', 'bogi@sansir.fo', '+298 299361', '']
    ]],
    ['Skuespillere og medvirkende', [
      ['Helena Heðinsdóttir Guttesen', 'Skuespiller · mor', 'helena.h.jorgensen@gmail.com', '+298 274450', 'Medvirker 17. og 18. august.'],
      ['Dreng X', 'Skuespiller · dreng', '', '', 'Navn og kontaktoplysninger afventer.']
    ]],
    ['Scene 4A · børn og forældre', [
      ['Lias Vitalis Tausen · 5 år', 'Barn · scene 4A · forælder: Elisabeth Vitalis Tausen', 'elisabeth_v_b@hotmail.com', '+298 299365', 'Tilladelse OK.'],
      ['Nora Vitalis Joensen · 6 år', 'Barn · scene 4A · forælder: Pál Vitalis Joensen', 'palj90@hotmail.com', '+298 272030', 'Tilladelse OK.'],
      ['Vón Thomsen · 7 år', 'Barn · scene 4A · forælder: Annika Poulsen', 'annikapo@hotmail.com', '+298 558075', 'Tilladelse OK.']
    ]],
    ['Locations og faglige kontakter', [
      ['Eyðbjørn Joensen', 'Locationejer · Fjalsvegur 24, Vestmanna', '', '+298 265883', 'Location til scene 9A, 9B og 9C.'],
      ['Ørvur Heinesen', 'Jarðhiti · jordvarmeboring', '', '+298 288433', 'Scene 11A afventer boreholdets retur til Streymoy.']
    ]]
  ];

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' })[char]);
  const personById = id => people.find(person => person.id === id);
  const personName = id => personById(id)?.name || id;
  const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };

  function addStyles() {
    if (document.getElementById('approved-core-v3-styles')) return;
    const style = document.createElement('style');
    style.id = 'approved-core-v3-styles';
    style.textContent = `
      #panel-schedule[data-approved-core-v3],#panel-my-schedule[data-approved-core-v3]{display:none}#panel-schedule[data-approved-core-v3].active,#panel-my-schedule[data-approved-core-v3].active{display:block}
      .ap3-head{margin-bottom:20px}.ap3-head h2{font-size:28px}.ap3-head p{max-width:760px;margin-top:6px;color:var(--text-muted);font-size:14px}.ap3-home-badge{display:inline-flex;margin-bottom:8px;padding:4px 7px;color:#071512;background:var(--current);border-radius:5px;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:900;letter-spacing:.08em}
      .ap3-namebox{margin-bottom:20px;padding:17px 18px;background:rgba(246,176,66,.10);border:2px solid rgba(246,176,66,.62);border-radius:10px}.ap3-namebox label{display:block;margin-bottom:6px;color:var(--signal);font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:900;letter-spacing:.08em}.ap3-namebox p{margin-bottom:10px;color:var(--text-muted);font-size:12px}.ap3-namebox select{width:100%;min-height:48px;padding:0 13px;color:var(--text);background:var(--bg-elevated-2);border:2px solid var(--signal);border-radius:8px;font:inherit;font-weight:700}
      .ap3-plan-list{display:grid;gap:16px}.ap3-shoot{padding:22px;background:var(--bg-elevated);border:1px solid var(--border-strong);border-left:5px solid var(--signal);border-radius:12px}.ap3-shoot.today{border-color:rgba(77,217,192,.55);border-left-color:var(--current);box-shadow:0 0 0 2px rgba(77,217,192,.11)}.ap3-shoot-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}.ap3-kicker{color:var(--current);font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:900;letter-spacing:.07em}.ap3-status{flex:0 0 auto;padding:5px 8px;color:#071512;background:var(--current);border-radius:99px;font-family:'IBM Plex Mono',monospace;font-size:8.5px;font-weight:900}.ap3-shoot h3{margin-top:8px;font-size:clamp(22px,3vw,29px)}.ap3-location{margin-top:4px;color:var(--text-muted);font-size:14px}
      .ap3-scenes{display:flex;flex-wrap:wrap;gap:6px;margin-top:13px}.ap3-scenes a{display:inline-flex;padding:5px 8px;color:var(--current)!important;background:rgba(77,217,192,.08);border:1px solid rgba(77,217,192,.25);border-radius:5px;text-decoration:none!important;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:850}.ap3-scene-label{margin-left:4px;color:var(--text-muted);font-family:'Inter',sans-serif;font-weight:500}
      .ap3-time-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px;margin-top:16px}.ap3-time{padding:11px 12px;background:rgba(246,176,66,.08);border:1px solid rgba(246,176,66,.28);border-radius:7px}.ap3-time span{display:block;color:var(--text-muted);font-size:9.5px;text-transform:uppercase}.ap3-time b{display:block;margin-top:2px;color:var(--signal);font-family:'IBM Plex Mono',monospace;font-size:12px}
      .ap3-details{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:15px}.ap3-detail-box{padding:13px 14px;background:var(--bg-elevated-2);border:1px solid var(--border);border-radius:8px}.ap3-detail-box h4{font-size:13px}.ap3-detail-box ul{display:grid;gap:5px;margin:8px 0 0 17px;color:var(--text-muted);font-size:11px}.ap3-detail-box li::marker{color:var(--current)}.ap3-detail-box.missing li::marker{color:var(--signal)}.ap3-detail-box.missing{border-color:rgba(246,176,66,.26)}.ap3-people{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.ap3-person{padding:5px 7px;background:rgba(77,217,192,.06);border:1px solid rgba(77,217,192,.16);border-radius:6px;font-size:10.5px}.ap3-person.optional{color:var(--signal);border-color:rgba(246,176,66,.25);background:rgba(246,176,66,.06)}
      .ap3-note{margin-top:13px;padding:11px 12px;color:var(--text-muted);background:rgba(77,217,192,.045);border-left:3px solid var(--current);border-radius:5px;font-size:11.5px;line-height:1.5}.ap3-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.ap3-action{padding:8px 10px;border-radius:6px;font-size:10.5px;font-weight:700;cursor:pointer;text-decoration:none!important}.ap3-action.primary{color:#071512!important;background:var(--current);border:1px solid var(--current)}.ap3-action.secondary{color:var(--text)!important;background:transparent;border:1px solid var(--border-strong)}
      .ap3-section{margin-top:22px;padding:18px;background:var(--bg-elevated);border:1px solid var(--border-strong);border-radius:11px}.ap3-section-head{display:flex;align-items:end;justify-content:space-between;gap:12px;margin-bottom:12px}.ap3-section-head h3{font-size:19px}.ap3-section-head p{margin-top:3px;color:var(--text-muted);font-size:11px}.ap3-count{color:var(--current);font-family:'IBM Plex Mono',monospace;font-size:9px}.ap3-pending{display:grid;gap:8px}.ap3-pending-row{display:grid;grid-template-columns:minmax(120px,auto) minmax(0,1fr);gap:12px;padding:11px 12px;background:var(--bg-elevated-2);border:1px solid var(--border);border-radius:7px}.ap3-pending-row strong{font-size:12px}.ap3-pending-row span{display:block;margin-top:2px;color:var(--text-muted);font-size:10.5px}.ap3-post{margin-top:11px;padding-top:10px;color:var(--text-muted);border-top:1px solid var(--border);font-size:10.5px}.ap3-person-summary{margin-bottom:14px;color:var(--text-muted);font-size:12px}.ap3-person-summary strong{display:block;color:var(--text);font-size:18px}.ap3-empty{padding:16px;color:var(--text-muted);border:1px dashed var(--border-strong);border-radius:8px;font-size:12px}
      #panel-crew[data-approved-team-v3] .team-search-row{margin-bottom:18px}#panel-crew[data-approved-team-v3] .team-search-row input{width:100%;padding:12px 14px;color:var(--text);background:var(--bg-elevated);border:1px solid var(--border-strong);border-radius:8px}.ap3-team-group{margin-top:24px}.ap3-team-title{margin-bottom:9px;padding-bottom:8px;border-bottom:1px solid var(--border);font-size:16px}.ap3-team-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:9px}.ap3-team-card{padding:14px;background:var(--bg-elevated);border:1px solid var(--border);border-radius:8px}.ap3-team-card b{display:block}.ap3-team-role{margin-top:3px;color:var(--current);font-size:10.5px}.ap3-team-note{margin-top:7px;color:var(--text-muted);font-size:10.5px}.ap3-contact{display:grid;gap:4px;margin-top:9px;padding-top:8px;border-top:1px solid var(--border)}.ap3-contact a{color:var(--text);font-family:'IBM Plex Mono',monospace;font-size:10px;text-decoration:none;overflow-wrap:anywhere}.ap3-contact span{color:var(--text-muted);font-size:10px}@media(max-width:720px){.ap3-details{grid-template-columns:1fr}.ap3-shoot-top,.ap3-section-head{align-items:flex-start;flex-direction:column}.ap3-pending-row{grid-template-columns:1fr}.ap3-shoot{padding:18px}}
    `;
    document.head.appendChild(style);
  }

  function sceneLinks(scenes, withLabels = false) { return scenes.map(scene => `<a class="scene-portal-link" href="#storyboard-${scene.toLowerCase()}" data-scene-link="${esc(scene)}" aria-label="Åbn scene ${esc(scene)} i storyboardet">${esc(scene)}${withLabels && sceneTitles[scene] ? `<span class="ap3-scene-label">· ${esc(sceneTitles[scene])}</span>` : ''}</a>`).join(''); }
  function peopleMarkup(ids, cast = [], optionalIds = []) { const crew = ids.map(id => `<span class="ap3-person">${esc(personName(id))}${personById(id)?.role ? ` · ${esc(personById(id).role)}` : ''}</span>`).join(''); const castMarkup = cast.map(name => `<span class="ap3-person">${esc(name)}</span>`).join(''); const optional = optionalIds.map(id => `<span class="ap3-person optional">MULIG: ${esc(personName(id))} · ${esc(personById(id)?.role || '')}</span>`).join(''); return crew + castMarkup + optional; }
  function listMarkup(items) { return items.map(item => `<li>${esc(item)}</li>`).join(''); }
  function shootMarkup(shoot, personalId = '') { const isToday = shoot.date === todayKey(); const isOptional = personalId && shoot.optionalCrew?.includes(personalId) && !shoot.crew.includes(personalId); const firstScene = shoot.scenes[0]; return `<article class="ap3-shoot${isToday ? ' today' : ''}"><div class="ap3-shoot-top"><div><div class="ap3-kicker">${isToday ? 'I DAG · ' : ''}${esc(shoot.dateLabel)}</div><h3>${esc(shoot.title)}</h3><div class="ap3-location">📍 ${esc(shoot.location)}</div></div><span class="ap3-status">${isOptional ? 'MULIG OPGAVE' : esc(shoot.status)}</span></div><div class="ap3-scenes">${sceneLinks(shoot.scenes, true)}</div><div class="ap3-time-grid">${shoot.times.map(([label, value]) => `<div class="ap3-time"><span>${esc(label)}</span><b>${esc(value)}</b></div>`).join('')}</div><div class="ap3-details"><section class="ap3-detail-box"><h4>Hvem er med?</h4><div class="ap3-people">${peopleMarkup(shoot.crew, shoot.cast, shoot.optionalCrew || [])}</div></section><section class="ap3-detail-box"><h4>Rekvisitter · styling · udstyr</h4><ul>${listMarkup(shoot.equipment)}</ul></section><section class="ap3-detail-box"><h4>✓ På plads</h4><ul>${listMarkup(shoot.ready)}</ul></section><section class="ap3-detail-box missing"><h4>⚠ Mangler / skal afklares</h4><ul>${listMarkup(shoot.missing)}</ul></section></div><div class="ap3-note"><b>Sceneinfo:</b> ${esc(shoot.note)}</div><div class="ap3-actions"><a class="ap3-action primary scene-portal-link" href="#storyboard-${firstScene.toLowerCase()}" data-scene-link="${esc(firstScene)}">Åbn storyboard</a><button class="ap3-action secondary" type="button" data-open-team>TEAM · telefonnumre</button><button class="ap3-action secondary" type="button" data-open-personal>Mit skema</button></div></article>`; }
  function pendingMarkup(item) { return `<article class="ap3-pending-row"><div class="ap3-scenes">${sceneLinks(item.scenes, true)}</div><div><strong>${esc(item.title)}</strong><span>${esc(item.missing)}</span></div></article>`; }
  function selectMarkup(id, selected = '') { return `<select id="${id}"><option value="">— Vælg dit navn —</option>${people.map(person => `<option value="${person.id}"${person.id === selected ? ' selected' : ''}>${esc(person.name)} · ${esc(person.role)}</option>`).join('')}</select>`; }
  function savePerson(id) { try { localStorage.setItem(STORAGE_KEY, id || 'all'); } catch (_) {} }
  function selectedPerson() { try { const stored = localStorage.getItem(STORAGE_KEY) || ''; return stored === 'all' ? '' : stored; } catch (_) { return ''; } }

  function renderPlan() {
    const panel = document.getElementById('panel-schedule'); if (!panel) return false; const selected = selectedPerson(); panel.dataset.approvedCoreV3 = VERSION;
    panel.innerHTML = `<div data-plan-v3-root><div class="ap3-head"><span class="ap3-home-badge">HJEM</span><h2>Plan & optagelser</h2><p>Dette er portalens hovedside. For hver planlagt optagelse kan du se dato, mødetider, scener, location, hvem der er med, udstyr, hvad der er på plads, og hvad der stadig mangler.</p></div><div class="ap3-namebox"><label for="ap3-home-person">VÆLG DIT NAVN · SE DIT EGET SKEMA</label><p>Vælg dit navn og gå direkte til de optagelser og åbne punkter, der vedrører dig.</p>${selectMarkup('ap3-home-person', selected)}</div><div class="ap3-plan-list">${shoots.map(shoot => shootMarkup(shoot)).join('')}</div><section class="ap3-section"><div class="ap3-section-head"><div><h3>Scener uden fast dato</h3><p>Disse scener er ikke blandet sammen med de låste optagedage.</p></div><span class="ap3-count">${pending.length} STATUSGRUPPER</span></div><div class="ap3-pending">${pending.map(pendingMarkup).join('')}</div><div class="ap3-post"><b>Postproduktion:</b> Produktionsdel 2C er arkiv-/postproduktionsmateriale. Scene 17A og 18A er grafik/animation og er ikke fysiske optagelser.</div></section></div>`;
    panel.querySelector('#ap3-home-person')?.addEventListener('change', event => { const value = event.target.value; if (!value) return; savePerson(value); renderPersonal(value); openTab('my-schedule'); }); return true;
  }

  function renderPersonal(personId = selectedPerson()) {
    const panel = document.getElementById('panel-my-schedule'); if (!panel) return false; panel.dataset.approvedCoreV3 = VERSION; const person = personById(personId); const planned = personId ? shoots.filter(shoot => shoot.crew.includes(personId) || shoot.optionalCrew?.includes(personId)) : []; const waiting = personId ? pending.filter(item => item.crew.includes(personId)) : [];
    panel.innerHTML = `<div class="ap3-head"><h2>Mit skema</h2><p>Vælg dit navn. Herefter vises kun de optagedage og åbne scener, der vedrører dig.</p></div><div class="ap3-namebox"><label for="ap3-person-select">VÆLG DIT NAVN</label><p>Valget gemmes på denne enhed.</p>${selectMarkup('ap3-person-select', personId)}</div>${person ? `<div class="ap3-person-summary"><strong>${esc(person.name)}</strong>${esc(person.role)} · ${planned.length} planlagte optagelser · ${waiting.length} åbne scenegrupper.</div>` : '<div class="ap3-empty">Vælg dit navn for at se dit skema.</div>'}${person ? `<div class="ap3-plan-list">${planned.length ? planned.map(shoot => shootMarkup(shoot, personId)).join('') : '<div class="ap3-empty">Ingen planlagte optagedage er registreret på dit navn.</div>'}</div>` : ''}${person && waiting.length ? `<section class="ap3-section"><div class="ap3-section-head"><div><h3>Åbne scener som vedrører dig</h3><p>Ingen fast dato endnu.</p></div><span class="ap3-count">${waiting.length}</span></div><div class="ap3-pending">${waiting.map(pendingMarkup).join('')}</div></section>` : ''}`;
    panel.querySelector('#ap3-person-select')?.addEventListener('change', event => { savePerson(event.target.value); renderPersonal(event.target.value); }); return true;
  }

  function teamCard(member) { const [name, role, email, phone, note] = member; const contacts = [email ? `<a href="mailto:${esc(email)}">✉ ${esc(email)}</a>` : '', phone ? `<a href="tel:${esc(phone.replace(/\s+/g, ''))}">☎ ${esc(phone)}</a>` : ''].filter(Boolean).join(''); return `<article class="ap3-team-card"><b>${esc(name)}</b><div class="ap3-team-role">${esc(role)}</div>${note ? `<div class="ap3-team-note">${esc(note)}</div>` : ''}<div class="ap3-contact">${contacts || '<span>Kontaktoplysninger afventer</span>'}</div></article>`; }
  function renderTeam(filter = '') { const panel = document.getElementById('panel-crew'); if (!panel) return false; panel.dataset.approvedTeamV3 = VERSION; const query = filter.trim().toLocaleLowerCase('da-DK'); const groupHtml = teams.map(([title, members]) => { const filtered = members.filter(member => `${title} ${member.join(' ')}`.toLocaleLowerCase('da-DK').includes(query)); if (!filtered.length) return ''; return `<section class="ap3-team-group"><h3 class="ap3-team-title">${esc(title)} · ${filtered.length}</h3><div class="ap3-team-grid">${filtered.map(teamCard).join('')}</div></section>`; }).join(''); panel.innerHTML = `<div class="ap3-head"><h2>TEAM</h2><p>Alle kendte telefonnumre og e-mailadresser til filmhold, SANSIR, skuespillere, forældre, locations og faglige kontakter er samlet her.</p></div><div class="team-search-row"><input id="ap3-team-search" type="search" value="${esc(filter)}" placeholder="Søg efter navn, rolle, telefon eller e-mail…" aria-label="Søg i TEAM"></div><div id="ap3-team-groups">${groupHtml || '<div class="ap3-empty">Ingen kontakter matcher søgningen.</div>'}</div>`; panel.querySelector('#ap3-team-search')?.addEventListener('input', event => renderTeam(event.target.value)); return true; }

  function openTab(name) { if (typeof window.openPortalTab === 'function') { window.openPortalTab(name); return; } document.querySelectorAll('nav.tabs button[data-tab]').forEach(button => button.classList.toggle('active', button.dataset.tab === name)); document.querySelectorAll('section.panel').forEach(panel => panel.classList.toggle('active', panel.id === `panel-${name}`)); }
  function ensureNavigation() { const nav = document.querySelector('nav.tabs'); const main = document.querySelector('main'); const scheduleButton = nav?.querySelector('button[data-tab="schedule"]'); const schedulePanel = document.getElementById('panel-schedule'); if (!nav || !main || !scheduleButton || !schedulePanel) return false; scheduleButton.textContent = 'Plan & optagelser'; scheduleButton.setAttribute('aria-label', 'HJEM · Plan og optagelser'); let personalButton = nav.querySelector('button[data-tab="my-schedule"]'); if (!personalButton) { personalButton = document.createElement('button'); personalButton.type = 'button'; personalButton.dataset.tab = 'my-schedule'; scheduleButton.insertAdjacentElement('afterend', personalButton); } personalButton.textContent = 'Mit skema'; personalButton.setAttribute('aria-label', 'Vælg dit navn og se dit eget skema'); personalButton.onclick = () => { renderPersonal(); openTab('my-schedule'); }; let personalPanel = document.getElementById('panel-my-schedule'); if (!personalPanel) { personalPanel = document.createElement('section'); personalPanel.className = 'panel'; personalPanel.id = 'panel-my-schedule'; schedulePanel.insertAdjacentElement('afterend', personalPanel); } nav.querySelector('button[data-tab="contacts"]')?.remove(); document.getElementById('panel-contacts')?.remove(); const crewButton = nav.querySelector('button[data-tab="crew"]'); if (crewButton) crewButton.textContent = 'TEAM'; const weatherButton = nav.querySelector('button[data-tab="weather"]'); if (weatherButton) weatherButton.textContent = 'Vejr'; const storyboardButton = nav.querySelector('button[data-tab="storyboard"]'); if (storyboardButton) storyboardButton.textContent = 'Storyboard'; return true; }
  function translateTop() { document.documentElement.lang = 'da'; document.title = 'SEV × SANSIR · Produktionsportal'; const heroSub = document.querySelector('.hero-sub'); if (heroSub) heroSub.textContent = 'Reklamefilm for Elfelagið SEV · SANSIR · produceret af KOVBOY FILM / FIXER.FO.'; const meta = document.querySelector('.meta-line'); if (meta) meta.textContent = 'Bureau: SANSIR · Kunde: SEV'; const brand = document.querySelector('.brand'); if (brand) brand.setAttribute('aria-label', 'HJEM · Plan & optagelser'); const weatherTitle = document.querySelector('.shortcut-title strong'); if (weatherTitle) weatherTitle.textContent = '7-dages optagevejr'; const weatherLink = document.getElementById('open-weather-details'); if (weatherLink) weatherLink.textContent = 'Se detaljer'; }
  function openHome() { try { sessionStorage.removeItem(TAB_STORAGE_KEY); } catch (_) {} openTab('schedule'); }
  function installActions() { if (document.documentElement.dataset.ap3Actions === VERSION) return; document.documentElement.dataset.ap3Actions = VERSION; document.addEventListener('click', event => { const target = event.target instanceof Element ? event.target : null; if (!target) return; if (target.closest('[data-open-team]')) { event.preventDefault(); openTab('crew'); return; } if (target.closest('[data-open-personal]')) { event.preventDefault(); renderPersonal(); openTab('my-schedule'); return; } if (target.closest('.brand, #home-button, [data-home]')) { event.preventDefault(); openHome(); } }, true); }
  function apply() { if (applying) return false; applying = true; try { addStyles(); translateTop(); if (!ensureNavigation()) return false; renderPlan(); renderPersonal(); renderTeam(); installActions(); document.documentElement.dataset.approvedCoreV3 = VERSION; return true; } finally { applying = false; } }
  function scheduleApply() { if (scheduledEnsure) return; scheduledEnsure = true; window.requestAnimationFrame(() => { scheduledEnsure = false; apply(); }); }
  function needsRepair() { const plan = document.getElementById('panel-schedule'); const team = document.getElementById('panel-crew'); const scheduleButton = document.querySelector('nav.tabs button[data-tab="schedule"]'); return !plan?.querySelector('[data-plan-v3-root]') || plan.dataset.approvedCoreV3 !== VERSION || team?.dataset.approvedTeamV3 !== VERSION || scheduleButton?.textContent.trim() !== 'Plan & optagelser' || Boolean(document.querySelector('nav.tabs button[data-tab="contacts"]')); }
  const observer = new MutationObserver(() => { if (!applying && needsRepair()) scheduleApply(); });
  function start() { apply(); openHome(); observer.observe(document.documentElement, { childList: true, subtree: true }); window.setTimeout(() => { if (needsRepair()) scheduleApply(); }, 1200); window.setTimeout(() => { if (needsRepair()) scheduleApply(); }, 3200); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
