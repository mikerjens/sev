(() => {
  'use strict';

  const VERSION = '2026-08-10-1340';
  const STORAGE_KEY = 'sev-task-person';
  const WATCH_MS = 9000;

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

  const shoots = [
    {
      date: '2026-08-10', dateLabel: 'MANDAG 10. AUGUST', time: '21:30', scenes: ['4A'],
      title: 'Børn under gadelyset', location: 'Elduvík',
      crew: ['michael', 'thomas', 'runi', 'elisabeth'],
      detail: 'Tre børn leger med bold under gadelyset. Alle tilladelser vedrørende børnene er på plads. Den præcise placering ved gadelyset afklares.'
    },
    {
      date: '2026-08-17', dateLabel: 'MANDAG 17. AUGUST', time: 'CREW 12:00 · SKUESPILLERE 14:00 · OPTAGELSE 14:30', scenes: ['1A', '2A', '2B', '15A', '16A'],
      title: 'Indendørs optagelser · mor og dreng', location: 'Skálabúðin, Tórshavn',
      crew: ['michael', 'thomas', 'runi', 'heidi', 'helena'],
      detail: "Mor og dreng styles i 1970'er-look. Drengens hår må ikke klippes før optagelsen. Produktionsdel 2C er postproduktion og filmes ikke denne dag."
    },
    {
      date: '2026-08-18', dateLabel: 'TIRSDAG 18. AUGUST', time: '15:00–18:00', scenes: ['9A', '9B', '9C'],
      title: 'Huset i Vestmanna · elbil, ladeboks og varmepumpe', location: 'Fjalsvegur 24, Vestmanna',
      crew: ['michael', 'thomas', 'runi', 'helena'], optionalCrew: ['heidi'],
      detail: '9A: dreng løber hen til mor. 9B: elbil og ladeboks. 9C: varmepumpe. Heidi Mortensen skal muligvis stå for styling og props.'
    }
  ];

  const pending = [
    { scenes: ['10A'], title: 'Tøj på tørresnoren', text: 'Dato og location afventer.', crew: ['michael', 'thomas', 'elisabeth', 'tor', 'bogi'] },
    { scenes: ['11A'], title: 'Aktiv jordvarmeboring', text: 'Afventer Jarðhitis borehold tilbage på Streymoy fra Suðuroy.', crew: ['michael', 'thomas', 'orvur'] },
    { scenes: ['12A'], title: 'Grøn energi fra et vandløb', text: 'Dato og location afventer.', crew: ['michael', 'thomas', 'helena'] },
    { scenes: ['13A', '13B'], title: 'Hus og solpaneler / dreng blændes af solen', text: 'Dato og fælles location afventer.', crew: ['michael', 'thomas', 'helena'] },
    { scenes: ['14A'], title: 'Dreng blæser udenfor', text: 'Dato og tidspunkt afventer godt vejr.', crew: ['thomas', 'elisabeth', 'tor', 'bogi'] }
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
  const todayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };

  function addStyles() {
    if (document.getElementById('approved-core-v2-styles')) return;
    const style = document.createElement('style');
    style.id = 'approved-core-v2-styles';
    style.textContent = `
      #panel-schedule[data-approved-core-v2],#panel-my-schedule[data-approved-core-v2]{display:none}
      #panel-schedule[data-approved-core-v2].active,#panel-my-schedule[data-approved-core-v2].active{display:block}
      .ap2-head{margin-bottom:20px}.ap2-head h2{font-size:25px}.ap2-head p{margin-top:5px;color:var(--text-muted);font-size:14px}
      .ap2-namebox{margin-bottom:18px;padding:17px 18px;background:rgba(246,176,66,.10);border:2px solid rgba(246,176,66,.62);border-radius:10px}.ap2-namebox label{display:block;margin-bottom:6px;color:var(--signal);font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:900;letter-spacing:.08em}.ap2-namebox p{margin-bottom:10px;color:var(--text-muted);font-size:12px}.ap2-namebox select{width:100%;min-height:48px;padding:0 13px;color:var(--text);background:var(--bg-elevated-2);border:2px solid var(--signal);border-radius:8px;font:inherit;font-weight:700}
      .ap2-today{margin-bottom:17px;padding:22px;background:linear-gradient(145deg,rgba(77,217,192,.14),rgba(20,40,50,.98));border:2px solid rgba(77,217,192,.55);border-radius:13px;box-shadow:0 18px 45px rgba(0,0,0,.16)}.ap2-kicker{color:var(--signal);font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:900;letter-spacing:.09em}.ap2-date{margin-top:5px;color:var(--text);font-family:'IBM Plex Mono',monospace;font-size:16px;font-weight:800}.ap2-today h2{margin-top:13px;font-size:clamp(26px,4vw,38px)}.ap2-location{margin-top:5px;color:var(--text-muted);font-size:15px}.ap2-time{display:inline-flex;margin-top:13px;padding:7px 10px;color:#071512;background:var(--current);border-radius:6px;font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:900}.ap2-scenes{display:flex;flex-wrap:wrap;gap:6px;margin-top:15px}.ap2-scenes a{display:inline-flex;padding:5px 8px;color:var(--current)!important;background:rgba(77,217,192,.08);border:1px solid rgba(77,217,192,.26);border-radius:5px;text-decoration:none!important;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:850}.ap2-detail{margin-top:13px;color:var(--text-muted);font-size:12px;line-height:1.5}
      .ap2-section{margin-top:18px;padding:18px;background:var(--bg-elevated);border:1px solid var(--border-strong);border-radius:11px}.ap2-section-head{display:flex;align-items:end;justify-content:space-between;gap:12px;margin-bottom:12px}.ap2-section-head h3{font-size:19px}.ap2-section-head p{margin-top:3px;color:var(--text-muted);font-size:11px}.ap2-count{color:var(--current);font-family:'IBM Plex Mono',monospace;font-size:9px}.ap2-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:10px}.ap2-card{padding:15px;background:var(--bg-elevated-2);border:1px solid var(--border);border-left:4px solid var(--signal);border-radius:8px}.ap2-card-date{color:var(--current);font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:800}.ap2-card-time{margin-top:5px;color:var(--signal);font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:750}.ap2-card h4{margin-top:8px;font-size:15px}.ap2-card p{margin-top:4px;color:var(--text-muted);font-size:11px}.ap2-pending{display:grid;gap:7px}.ap2-pending-row{display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;padding:10px 11px;background:var(--bg-elevated-2);border:1px solid var(--border);border-radius:7px}.ap2-pending-row strong{font-size:12px}.ap2-pending-row span{display:block;margin-top:2px;color:var(--text-muted);font-size:10.5px}.ap2-post{margin-top:11px;padding-top:10px;color:var(--text-muted);border-top:1px solid var(--border);font-size:10.5px}
      .ap2-person-summary{margin-bottom:12px;color:var(--text-muted);font-size:12px}.ap2-person-summary strong{display:block;color:var(--text);font-size:17px}.ap2-empty{padding:16px;color:var(--text-muted);border:1px dashed var(--border-strong);border-radius:8px;font-size:12px}
      #panel-crew[data-approved-team-v2] .team-search-row{margin-bottom:18px}#panel-crew[data-approved-team-v2] .team-search-row input{width:100%;padding:12px 14px;color:var(--text);background:var(--bg-elevated);border:1px solid var(--border-strong);border-radius:8px}.ap2-team-group{margin-top:24px}.ap2-team-title{margin-bottom:9px;padding-bottom:8px;border-bottom:1px solid var(--border);font-size:16px}.ap2-team-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:9px}.ap2-team-card{padding:14px;background:var(--bg-elevated);border:1px solid var(--border);border-radius:8px}.ap2-team-card b{display:block}.ap2-team-role{margin-top:3px;color:var(--current);font-size:10.5px}.ap2-team-note{margin-top:7px;color:var(--text-muted);font-size:10.5px}.ap2-contact{display:grid;gap:4px;margin-top:9px;padding-top:8px;border-top:1px solid var(--border)}.ap2-contact a{color:var(--text);font-family:'IBM Plex Mono',monospace;font-size:10px;text-decoration:none;overflow-wrap:anywhere}.ap2-contact span{color:var(--text-muted);font-size:10px}
      @media(max-width:650px){.ap2-section-head{align-items:flex-start;flex-direction:column}.ap2-grid{grid-template-columns:1fr}.ap2-today{padding:18px}.ap2-pending-row{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function sceneLinks(scenes) {
    return scenes.map(scene => `<a class="scene-portal-link" href="#storyboard-${scene.toLowerCase()}" data-scene-link="${esc(scene)}">${esc(scene)}</a>`).join('');
  }

  function shootCard(shoot) {
    return `<article class="ap2-card"><div class="ap2-card-date">${esc(shoot.dateLabel)}</div><div class="ap2-card-time">${esc(shoot.time)}</div><div class="ap2-scenes">${sceneLinks(shoot.scenes)}</div><h4>${esc(shoot.title)}</h4><p>${esc(shoot.location)}</p></article>`;
  }

  function pendingRow(item) {
    return `<div class="ap2-pending-row"><div class="ap2-scenes">${sceneLinks(item.scenes)}</div><div><strong>${esc(item.title)}</strong><span>${esc(item.text)}</span></div></div>`;
  }

  function selectMarkup(id, selected) {
    return `<select id="${id}"><option value="">— Vælg dit navn —</option>${people.map(person => `<option value="${person.id}"${person.id===selected?' selected':''}>${esc(person.name)} · ${esc(person.role)}</option>`).join('')}</select>`;
  }

  function selectedPerson() {
    try { return localStorage.getItem(STORAGE_KEY) || ''; } catch (_) { return ''; }
  }

  function renderPersonal(personId) {
    const person = people.find(item => item.id === personId);
    if (!person) return '<div class="ap2-empty">Vælg dit navn. Så vises kun de optagelser og åbne scener, der vedrører dig.</div>';
    const dated = shoots.filter(shoot => shoot.crew.includes(personId) || shoot.optionalCrew?.includes(personId));
    const waiting = pending.filter(item => item.crew.includes(personId));
    const datedHtml = dated.length ? `<div class="ap2-grid">${dated.map(shoot => {
      const optional = shoot.optionalCrew?.includes(personId) && !shoot.crew.includes(personId);
      return `<article class="ap2-card"><div class="ap2-card-date">${esc(shoot.dateLabel)}</div><div class="ap2-card-time">${esc(shoot.time)}</div><div class="ap2-scenes">${sceneLinks(shoot.scenes)}</div><h4>${esc(shoot.title)}</h4><p>${esc(shoot.location)}</p>${optional?'<p style="color:var(--signal)">MULIG OPGAVE · styling/props afklares</p>':'<p>Du er registreret på denne optagelse.</p>'}</article>`;
    }).join('')}</div>` : '<div class="ap2-empty">Ingen fastlagte optagedage er registreret på dette navn endnu.</div>';
    const waitingHtml = waiting.length ? `<div class="ap2-section"><div class="ap2-section-head"><div><h3>Scener uden fast dato</h3><p>Disse kan blive relevante for dit skema.</p></div></div><div class="ap2-pending">${waiting.map(pendingRow).join('')}</div></div>` : '';
    return `<div class="ap2-person-summary"><strong>${esc(person.name)}</strong>${dated.length} planlagte optagedage · ${waiting.length} åbne scenegrupper</div>${datedHtml}${waitingHtml}`;
  }

  function homeMarkup() {
    const current = shoots.find(shoot => shoot.date === todayKey()) || shoots.find(shoot => shoot.date >= todayKey()) || shoots[0];
    const upcoming = shoots.filter(shoot => shoot !== current && shoot.date >= todayKey());
    return `
      <div class="ap2-head"><h2>Plan og optagelser</h2><p>Her står de fastlagte optagedage først. Dato, klokkeslæt, location og scener kan ses med det samme.</p></div>
      <div class="ap2-namebox"><label for="ap2-home-person">VÆLG DIT NAVN · SE DIT EGET SKEMA</label><p>Vælg dit navn og gå direkte til dine egne optagedage.</p>${selectMarkup('ap2-home-person', selectedPerson())}</div>
      <section class="ap2-today"><div class="ap2-kicker">${current.date === todayKey() ? 'I DAG · NÆSTE OPTAGELSE' : 'NÆSTE OPTAGELSE'}</div><div class="ap2-date">${esc(current.dateLabel)}</div><div class="ap2-time">${esc(current.time)}</div><div class="ap2-scenes">${sceneLinks(current.scenes)}</div><h2>${esc(current.title)}</h2><p class="ap2-location">${esc(current.location)}</p><p class="ap2-detail">${esc(current.detail)}</p></section>
      <section class="ap2-section"><div class="ap2-section-head"><div><h3>Kommende planlagte optagelser</h3><p>Kun optagelser med fast dato vises her.</p></div><span class="ap2-count">${upcoming.length} MED FAST DATO</span></div><div class="ap2-grid">${upcoming.map(shootCard).join('') || '<div class="ap2-empty">Ingen yderligere fastlagte optagedage.</div>'}</div></section>
      <section class="ap2-section"><div class="ap2-section-head"><div><h3>Scener uden fast dato</h3><p>Holdes adskilt fra den låste optageplan.</p></div><span class="ap2-count">AFVENTER</span></div><div class="ap2-pending">${pending.map(pendingRow).join('')}</div><div class="ap2-post"><b>Postproduktion:</b> 2C er arkiv/postproduktion. 17A og 18A er grafik/animation og er ikke fysiske optagelser.</div></section>`;
  }

  function ensureNav() {
    const nav = document.querySelector('nav.tabs');
    if (!nav) return false;
    const schedule = nav.querySelector('[data-tab="schedule"]');
    const weather = nav.querySelector('[data-tab="weather"]');
    const crew = nav.querySelector('[data-tab="crew"]');
    const contacts = nav.querySelector('[data-tab="contacts"]');
    if (schedule) schedule.textContent = 'Plan & optagelser';
    if (weather) weather.textContent = 'Vejr';
    if (crew) crew.textContent = 'TEAM';
    contacts?.remove();
    document.getElementById('panel-contacts')?.remove();

    let my = nav.querySelector('[data-tab="my-schedule"]');
    if (!my) {
      my = document.createElement('button');
      my.type = 'button';
      my.dataset.tab = 'my-schedule';
      my.textContent = 'Mit skema';
      schedule?.insertAdjacentElement('afterend', my);
    }
    if (!nav.dataset.ap2Listener) {
      nav.dataset.ap2Listener = VERSION;
      nav.addEventListener('click', event => {
        const button = event.target.closest('button[data-tab]');
        if (!button) return;
        const name = button.dataset.tab;
        document.querySelectorAll('nav.tabs button[data-tab]').forEach(item => item.classList.toggle('active', item === button));
        document.querySelectorAll('main > section.panel').forEach(panel => panel.classList.toggle('active', panel.id === `panel-${name}`));
      }, true);
    }
    return true;
  }

  function renderSchedulePanel() {
    const panel = document.getElementById('panel-schedule');
    if (!panel) return false;
    if (panel.dataset.approvedCoreV2 === VERSION) return true;
    panel.dataset.approvedCoreV2 = VERSION;
    panel.innerHTML = homeMarkup();
    const select = panel.querySelector('#ap2-home-person');
    select?.addEventListener('change', () => {
      try { localStorage.setItem(STORAGE_KEY, select.value); } catch (_) {}
      renderMyPanel(select.value, true);
      document.querySelector('nav.tabs [data-tab="my-schedule"]')?.click();
    });
    return true;
  }

  function renderMyPanel(personId = selectedPerson(), force = false) {
    const main = document.querySelector('main');
    if (!main) return false;
    let panel = document.getElementById('panel-my-schedule');
    if (!panel) {
      panel = document.createElement('section');
      panel.className = 'panel';
      panel.id = 'panel-my-schedule';
      document.getElementById('panel-schedule')?.insertAdjacentElement('afterend', panel);
    }
    if (!force && panel.dataset.approvedCoreV2 === VERSION) return true;
    panel.dataset.approvedCoreV2 = VERSION;
    panel.innerHTML = `<div class="ap2-head"><h2>Mit skema</h2><p>Vælg dit navn. Du ser kun dine egne planlagte optagedage og relevante scener uden dato.</p></div><div class="ap2-namebox"><label for="ap2-my-person">VÆLG DIT NAVN</label>${selectMarkup('ap2-my-person', personId)}</div><div id="ap2-person-result">${renderPersonal(personId)}</div>`;
    const select = panel.querySelector('#ap2-my-person');
    select?.addEventListener('change', () => {
      try { localStorage.setItem(STORAGE_KEY, select.value); } catch (_) {}
      const result = panel.querySelector('#ap2-person-result');
      if (result) result.innerHTML = renderPersonal(select.value);
    });
    return true;
  }

  function renderTeamPanel() {
    const panel = document.getElementById('panel-crew');
    if (!panel) return false;
    if (panel.dataset.approvedTeamV2 === VERSION) return true;
    panel.dataset.approvedTeamV2 = VERSION;
    panel.innerHTML = `<div class="ap2-head"><h2>TEAM</h2><p>Alle kendte telefonnumre og e-mailadresser til crew, bureau, skuespillere, forældre, locations og faglige kontakter.</p></div><div class="team-search-row"><input id="ap2-team-search" type="search" placeholder="Søg efter navn, rolle, telefon eller e-mail…"></div><div id="ap2-team-groups"></div>`;
    const groups = panel.querySelector('#ap2-team-groups');
    const render = query => {
      const q = String(query||'').trim().toLocaleLowerCase('da-DK');
      groups.innerHTML = teams.map(([title, members]) => {
        const filtered = members.filter(member => `${title} ${member.join(' ')}`.toLocaleLowerCase('da-DK').includes(q));
        if (!filtered.length) return '';
        return `<section class="ap2-team-group"><h3 class="ap2-team-title">${esc(title)}</h3><div class="ap2-team-grid">${filtered.map(([name,role,email,phone,note]) => `<article class="ap2-team-card"><b>${esc(name)}</b><div class="ap2-team-role">${esc(role)}</div>${note?`<div class="ap2-team-note">${esc(note)}</div>`:''}<div class="ap2-contact">${email?`<a href="mailto:${esc(email)}">✉ ${esc(email)}</a>`:''}${phone?`<a href="tel:${esc(phone.replace(/\s+/g,''))}">☎ ${esc(phone)}</a>`:''}${!email&&!phone?'<span>Kontaktoplysninger afventer</span>':''}</div></article>`).join('')}</div></section>`;
      }).join('') || '<div class="ap2-empty">Ingen kontakter matcher søgningen.</div>';
    };
    panel.querySelector('#ap2-team-search')?.addEventListener('input', event => render(event.target.value));
    render('');
    return true;
  }

  function translateHeader() {
    const sub = document.querySelector('.hero-sub');
    if (sub) sub.textContent = 'Filmproduktion for Elfelagið SEV · SANSIR · KOVBOY FILM / FIXER.FO.';
  }

  function install(force = false) {
    addStyles();
    translateHeader();
    ensureNav();
    if (force) {
      document.getElementById('panel-schedule')?.removeAttribute('data-approved-core-v2');
      document.getElementById('panel-my-schedule')?.removeAttribute('data-approved-core-v2');
      document.getElementById('panel-crew')?.removeAttribute('data-approved-team-v2');
    }
    const a = renderSchedulePanel();
    const b = renderMyPanel();
    const c = renderTeamPanel();
    document.documentElement.classList.remove('sev-booting');
    document.documentElement.classList.add('sev-ready');
    return a && b && c;
  }

  install(true);
  document.addEventListener('DOMContentLoaded', () => install(true), { once: true });

  let applying = false;
  const observer = new MutationObserver(() => {
    if (applying) return;
    const schedule = document.getElementById('panel-schedule');
    const crew = document.getElementById('panel-crew');
    const my = document.getElementById('panel-my-schedule');
    if (schedule?.dataset.approvedCoreV2 === VERSION && crew?.dataset.approvedTeamV2 === VERSION && my?.dataset.approvedCoreV2 === VERSION) return;
    applying = true;
    window.setTimeout(() => { install(true); applying = false; }, 0);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), WATCH_MS);

  window.setTimeout(() => install(true), 500);
  window.setTimeout(() => install(true), 1800);
  window.setTimeout(() => install(true), 4200);
})();