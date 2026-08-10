(() => {
  'use strict';

  const VERSION = '2026-08-10-1303';
  const STORAGE_KEY = 'sev-task-person';
  let installed = false;

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

  const datedShoots = [
    {
      date: '2026-08-10', time: '21:30', scenes: ['4A'],
      title: 'Børn under gadelyset',
      location: 'Elduvík · præcis placering ved gadelyset afklares',
      crew: ['michael', 'thomas', 'runi', 'elisabeth'],
      note: 'Alle tilladelser vedrørende børnene er på plads. Øvrige relevante tilladelser er SANSIRs ansvar.'
    },
    {
      date: '2026-08-17', time: 'Optagelse 14:30 · crew 12:00 · skuespillere 14:00',
      scenes: ['1A', '2A', '2B', '15A', '16A'],
      title: 'Indendørs optagelser med mor og dreng',
      location: 'Skálabúðin, Tórshavn',
      crew: ['michael', 'thomas', 'runi', 'heidi', 'helena'],
      note: "Mor og dreng styles i 1970'er-look. Drengens hår må ikke klippes før optagelsen. Produktionsdel 2C er postproduktion og ikke en fysisk optagelse denne dag."
    },
    {
      date: '2026-08-18', time: '15:00–18:00',
      scenes: ['9A', '9B', '9C'],
      title: 'Huset i Vestmanna · elbil, ladeboks og varmepumpe',
      location: 'Fjalsvegur 24, Vestmanna',
      crew: ['michael', 'thomas', 'runi', 'helena'],
      optionalCrew: ['heidi'],
      note: 'Heidi Mortensen skal muligvis stå for styling og props. Ejer af location: Eyðbjørn Joensen, tlf. 265883.'
    }
  ];

  const pendingShoots = [
    { scenes: ['10A'], title: 'Tøj på tørresnoren', location: 'Dato og location afventer.', crew: ['michael', 'thomas', 'elisabeth', 'tor', 'bogi'] },
    { scenes: ['11A'], title: 'Aktiv jordvarmeboring', location: 'Afventer Jarðhitis borehold tilbage på Streymoy fra Suðuroy.', crew: ['michael', 'thomas', 'orvur'] },
    { scenes: ['12A'], title: 'Grøn energi fra et vandløb', location: 'Dato og location afventer.', crew: ['michael', 'thomas', 'helena'] },
    { scenes: ['13A', '13B'], title: 'Hus og solpaneler / dreng blændes af solen', location: 'Dato og fælles location afventer.', crew: ['michael', 'thomas', 'helena'] },
    { scenes: ['14A'], title: 'Dreng blæser udenfor', location: 'Dato og tidspunkt afventer godt vejr. Location og endelig billedløsning afklares.', crew: ['thomas', 'elisabeth', 'tor', 'bogi'] }
  ];

  const filmedScenes = ['3A', '5A', '6A', '7A', '8A'];

  const teamGroups = [
    {
      title: 'Filmhold og produktion',
      description: 'Filmcrew og praktiske nøglefunktioner.',
      members: [
        { name: 'Michael Koba', type: 'Filmproducer', organisation: 'KOVBOY FILM / FIXER.FO', email: 'michael@kovboyfilm.com', phone: '+298 591011', status: 'Bekræftet' },
        { name: 'Thomas Koba', type: 'Instruktør og filmmaker', organisation: 'KOVBOY FILM', email: 'thomas@kovboyfilm.com', phone: '+298 239100', status: 'Bekræftet' },
        { name: 'Rúni Friis Kjær', type: 'Lys', organisation: 'Friis Frame', email: 'rfk@friisframe.fo', phone: '+298 218218', status: 'Bekræftet', note: 'Crew på de planlagte optagedage 10., 17. og 18. august.' },
        { name: 'Heidi Mortensen', type: 'Styling og props', organisation: 'Atlanta', email: 'heidi@atlanta.fo', phone: '+298 790050', status: 'Bekræftet', note: 'Crew 17. august. Mulig styling/props 18. august.' }
      ]
    },
    {
      title: 'Bureau og kreativt team',
      description: 'SANSIR · koordinering, kreativ retning og relevante tilladelser.',
      members: [
        { name: 'Elisabeth Vitalis Tausen', type: 'Rådgiver', organisation: 'SANSIR', email: 'elisabeth@sansir.fo', phone: '+298 299365', status: 'Bekræftet' },
        { name: 'Tór Verland Johansen', type: 'Direktør', organisation: 'SANSIR', email: 'torverland@sansir.fo', phone: '+298 299372', status: 'Bekræftet' },
        { name: 'Bogi Henriksen', type: 'Kreativ direktør', organisation: 'SANSIR', email: 'bogi@sansir.fo', phone: '+298 299361', status: 'Bekræftet' }
      ]
    },
    {
      title: 'Skuespillere og medvirkende',
      description: 'Kontaktoplysninger til bekræftede skuespillere og medvirkende.',
      members: [
        { name: 'Helena Heðinsdóttir Guttesen', type: 'Skuespiller · mor', email: 'helena.h.jorgensen@gmail.com', phone: '+298 274450', status: 'Bekræftet', note: 'Medvirker 17. og 18. august.' },
        { name: 'Dreng X', type: 'Skuespiller · dreng', status: 'Navn/kontakt afventer', note: 'Medvirker blandt andet i Skálabúðin og i flere udendørsscener.' }
      ]
    },
    {
      title: 'Scene 4A · børn og forældre',
      description: 'Alle tilladelser vedrørende børnene er på plads.',
      members: [
        { name: 'Lias Vitalis Tausen · 5 år', type: 'Barn · scene 4A', status: 'Bekræftet', note: 'Forælder: Elisabeth Vitalis Tausen', email: 'elisabeth_v_b@hotmail.com', phone: '+298 299365' },
        { name: 'Nora Vitalis Joensen · 6 år', type: 'Barn · scene 4A', status: 'Bekræftet', note: 'Forælder: Pál Vitalis Joensen', email: 'palj90@hotmail.com', phone: '+298 272030' },
        { name: 'Vón Thomsen · 7 år', type: 'Barn · scene 4A', status: 'Bekræftet', note: 'Forælder: Annika Poulsen', email: 'annikapo@hotmail.com', phone: '+298 558075' }
      ]
    },
    {
      title: 'Locations og faglige kontakter',
      description: 'Kontakter til locations og faglige medvirkende.',
      members: [
        { name: 'Eyðbjørn Joensen', type: 'Ejer af location', organisation: 'Fjalsvegur 24, Vestmanna', phone: '+298 265883', status: 'Bekræftet', note: 'Location til scene 9A, 9B og 9C den 18. august.' },
        { name: 'Ørvur Heinesen', type: 'Jordvarmeboring', organisation: 'Jarðhiti', phone: '+298 288433', status: 'Afventer dato', note: 'Scene 11A filmes, når boreholdet er tilbage på Streymoy.' }
      ]
    }
  ];

  window.SEV_APPROVED_PLAN_V1 = { version: VERSION, people, datedShoots, pendingShoots, filmedScenes, teamGroups };

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
  }

  function localDateKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  function formatDate(dateKey) {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Intl.DateTimeFormat('da-DK', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(year, month - 1, day));
  }

  function addStyles() {
    if (document.getElementById('approved-plan-styles')) return;
    const style = document.createElement('style');
    style.id = 'approved-plan-styles';
    style.textContent = `
      #panel-next-scenes .approved-plan-banner{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px;padding:16px 18px;background:rgba(77,217,192,.08);border:1px solid rgba(77,217,192,.34);border-left:4px solid var(--current);border-radius:10px}
      #panel-next-scenes .approved-plan-banner strong{display:block;font-size:15px}.approved-plan-banner span{display:block;margin-top:4px;color:var(--text-muted);font-size:12px}.approved-plan-version{flex:0 0 auto;color:var(--current)!important;font-family:'IBM Plex Mono',monospace;font-size:9px!important}
      #panel-next-scenes .next-scenes-page-events{display:grid;gap:12px}.approved-date-card{padding:18px!important;border-left-width:5px!important}.approved-date-card.today{box-shadow:0 0 0 2px rgba(77,217,192,.18)}
      .approved-date-card .next-shoot-date span{font-size:11px;font-weight:800;color:var(--text)}.approved-date-card .next-shoot-time{font-size:13px;font-weight:800}.approved-date-card h4{font-size:16px!important}.approved-date-card p{font-size:12px!important}.approved-shoot-note{margin-top:8px!important;color:var(--text)!important;font-size:11.5px!important}
      #approved-pending{margin-top:20px;padding:18px;background:var(--bg-elevated);border:1px solid var(--border-strong);border-radius:10px}#approved-pending h3{font-size:18px}#approved-pending>p{margin-top:4px;color:var(--text-muted);font-size:12px}.approved-pending-grid{display:grid;gap:8px;margin-top:12px}.approved-pending-row{display:grid;grid-template-columns:minmax(100px,auto) minmax(0,1fr);gap:12px;padding:11px 12px;background:var(--bg-elevated-2);border:1px solid var(--border);border-radius:8px}.approved-pending-scenes{display:flex;flex-wrap:wrap;gap:5px;align-content:start}.approved-pending-scenes strong{padding:3px 6px;color:var(--current);background:rgba(77,217,192,.08);border:1px solid rgba(77,217,192,.2);border-radius:5px;font-family:'IBM Plex Mono',monospace;font-size:9px}.approved-pending-row b{font-size:12.5px}.approved-pending-row span{display:block;margin-top:2px;color:var(--text-muted);font-size:10.5px}.approved-post-note{margin-top:12px;padding:10px 12px;color:var(--text-muted);border:1px dashed var(--border-strong);border-radius:7px;font-size:10.5px}
      #panel-crew .team-contact-list .team-contact-missing{color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:10px}.team-card-note b{color:var(--text)}
      .approved-parser-only{display:none!important}.task-card[data-approved-completed="true"]{display:none!important}
      @media(max-width:650px){#panel-next-scenes .approved-plan-banner{flex-direction:column}.approved-pending-row{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function sceneChips(scenes) {
    return scenes.map(scene => `<strong>${esc(scene)}</strong>`).join('');
  }

  function datedEventMarkup(event) {
    const today = event.date === localDateKey();
    return `<article class="next-shoot-event approved-date-card${today ? ' today' : ''}" data-approved-shoot="${esc(event.date)}">
      <div class="next-shoot-date"><span>${esc(formatDate(event.date))}</span>${today ? '<b>I DAG</b>' : '<b>PLANLAGT</b>'}</div>
      <div class="next-shoot-time">● ${esc(event.time)}</div>
      <div class="next-shoot-scenes">${sceneChips(event.scenes)}</div>
      <h4>${esc(event.title)}</h4>
      <p>${esc(event.location)}</p>
      <p class="approved-shoot-note">${esc(event.note)}</p>
    </article>`;
  }

  function pendingMarkup(event) {
    return `<div class="approved-pending-row"><div class="approved-pending-scenes">${sceneChips(event.scenes)}</div><div><b>${esc(event.title)}</b><span>${esc(event.location)}</span></div></div>`;
  }

  function renderNextScenes() {
    const panel = document.getElementById('panel-next-scenes');
    if (!panel) return false;
    panel.innerHTML = `
      <div class="section-head"><h2>Næste optagelser</h2><p>Fastlagte optagedage står øverst i kronologisk rækkefølge. Scener uden dato står separat nedenunder.</p></div>
      <div class="approved-plan-banner"><div><strong>Godkendt produktionsplan</strong><span>Senest ajourført 10. august 2026. Dato og klokkeslæt er fremhævet, så holdet hurtigt kan se, hvad der sker.</span></div><span class="approved-plan-version">${VERSION}</span></div>
      <div class="next-scenes-page-events">${datedShoots.map(datedEventMarkup).join('')}${pendingShoots.map(event => `<article class="next-shoot-event pending approved-parser-only"><div class="next-shoot-date"><span>Dato afventer</span><b>AFVENTER</b></div><div class="next-shoot-scenes">${sceneChips(event.scenes)}</div><h4>${esc(event.title)}</h4><p>${esc(event.location)}</p></article>`).join('')}</div>
      <section id="approved-pending"><h3>Scener uden fast dato</h3><p>Disse scener planlægges, når vejr, location eller medvirkende er afklaret.</p><div class="approved-pending-grid">${pendingShoots.map(pendingMarkup).join('')}</div><div class="approved-post-note"><b>Postproduktion:</b> Produktionsdel 2C er arkiv-/postproduktionsmateriale. Scene 17A og 18A er grafik/animation og er ikke fysiske optagelser.</div></section>
      <div class="calendar-filmed">✓ Filmet: ${filmedScenes.join(' · ')}</div>`;
    panel.dataset.approvedPlan = VERSION;
    return true;
  }

  function contactMarkup(member) {
    const links = [];
    if (member.email) links.push(`<a href="mailto:${esc(member.email)}">✉ ${esc(member.email)}</a>`);
    if (member.phone) links.push(`<a href="tel:${esc(member.phone.replace(/\s+/g, ''))}">☎ ${esc(member.phone)}</a>`);
    if (!links.length) links.push('<span class="team-contact-missing">Kontaktoplysninger afventer</span>');
    return `<div class="team-contact-list">${links.join('')}</div>`;
  }

  function teamCardMarkup(member) {
    return `<article class="team-card">
      <div class="team-card-top"><div><div class="team-card-name">${esc(member.name)}</div><div class="team-card-type">${esc(member.type || '')}</div>${member.organisation ? `<div class="team-card-organisation">${esc(member.organisation)}</div>` : ''}</div><span class="team-status">${esc(member.status || '')}</span></div>
      ${member.note ? `<p class="team-card-note">${esc(member.note)}</p>` : ''}
      ${contactMarkup(member)}
    </article>`;
  }

  function renderTeam(filter = '') {
    const groups = document.getElementById('team-groups');
    if (!groups) return;
    const query = filter.trim().toLocaleLowerCase('da-DK');
    const html = teamGroups.map(group => {
      const members = group.members.filter(member => [group.title, member.name, member.type, member.organisation, member.email, member.phone, member.note].filter(Boolean).join(' ').toLocaleLowerCase('da-DK').includes(query));
      if (!members.length) return '';
      return `<section class="team-group"><div class="team-group-head"><div><div class="team-group-title">${esc(group.title)}</div><div class="team-group-description">${esc(group.description)}</div></div><span class="team-group-count">${members.length} ${members.length === 1 ? 'kontakt' : 'kontakter'}</span></div><div class="team-card-grid">${members.map(teamCardMarkup).join('')}</div></section>`;
    }).join('');
    groups.innerHTML = html || '<div class="team-no-match">Ingen kontakter matcher søgningen.</div>';
  }

  function renderTeamPanel() {
    const tab = document.querySelector('nav.tabs button[data-tab="crew"]');
    if (tab) {
      tab.textContent = 'TEAM';
      tab.setAttribute('aria-label', 'TEAM og alle kontaktoplysninger');
    }
    const panel = document.getElementById('panel-crew');
    if (!panel) return false;
    panel.innerHTML = `<div class="section-head"><h2>TEAM</h2><p>Alle kendte kontaktoplysninger til filmhold, bureau, skuespillere, forældre, locations og faglige kontakter er samlet her.</p></div><div class="team-search-row"><input id="team-search" type="search" placeholder="Søg efter navn, rolle, telefon eller e-mail…" aria-label="Søg i TEAM"></div><div id="team-groups"></div>`;
    const input = panel.querySelector('#team-search');
    input?.addEventListener('input', event => renderTeam(event.target.value));
    renderTeam();
    panel.dataset.approvedPlan = VERSION;
    return true;
  }

  function ensurePersonOptions() {
    const select = document.getElementById('task-person-filter');
    if (!select) return;
    people.forEach(person => {
      let option = select.querySelector(`option[value="${person.id}"]`);
      if (!option) {
        option = document.createElement('option');
        option.value = person.id;
        select.appendChild(option);
      }
      option.textContent = `${person.name} · ${person.role}`;
    });
    const label = select.closest('div')?.querySelector('label');
    if (label) label.textContent = 'Vælg dit navn – se dit eget skema';
  }

  function patchTask(card, title, status, detail) {
    if (!card) return;
    const titleNode = card.querySelector('.task-title');
    const statusNode = card.querySelector('.task-status');
    const copyNode = card.querySelector('.task-copy');
    if (titleNode && title) titleNode.textContent = title;
    if (statusNode && status) statusNode.textContent = status;
    if (copyNode && detail) copyNode.innerHTML = `<b>Opgaven:</b> ${esc(detail)}`;
  }

  function patchTasks() {
    const cards = [...document.querySelectorAll('#production-plan-list .task-card')];
    if (!cards.length) return;
    cards.forEach(card => {
      const title = card.querySelector('.task-title')?.textContent || '';
      if (/Film scene 5A/i.test(title) || /Spørg Airbnb-ejeren/i.test(title) || /Find børn og forældrekontakter til scene 4A/i.test(title) || /Få kontrakter og forældretilladelser på plads/i.test(title)) {
        card.dataset.approvedCompleted = 'true';
        return;
      }
      if (/Book stylist og makeupartist til Elduvík/i.test(title)) {
        patchTask(card, 'Klargør styling til Skálabúðin 17. august', 'I gang', "Sørg for 1970'er-look til mor og dreng. Drengens hår må ikke klippes før optagelsen.");
      }
      if (/Vælg og klargør tøj, makeup og rekvisitter/i.test(title)) {
        patchTask(card, 'Klargør styling og props til de kommende optagelser', 'I gang', "Klargør 1970'er-look til Skálabúðin 17. august og afklar styling/props til Vestmanna 18. august. Scene 4A-børnenes tilladelser er på plads.");
      }
      if (/Film scene 4A under gadelyset/i.test(title)) {
        patchTask(card, 'Film scene 4A under gadelyset', 'Planlagt', 'Film tre bekræftede børn i Elduvík kl. 21:30. Alle børnetilladelser er på plads; øvrige relevante tilladelser er SANSIRs ansvar.');
      }
    });
  }

  function markFilmed() {
    filmedScenes.forEach(scene => {
      document.querySelectorAll(`[data-storyboard-scene="${scene}"]`).forEach(element => {
        element.classList.add('filmed');
        element.setAttribute('aria-label', `Scene ${scene}. Filmet.`);
      });
    });
  }

  function install() {
    if (installed) return true;
    addStyles();
    const nextReady = renderNextScenes();
    const teamReady = renderTeamPanel();
    const ready = nextReady && teamReady;
    ensurePersonOptions();
    patchTasks();
    markFilmed();
    if (!ready) return false;
    installed = true;
    document.documentElement.dataset.approvedPlan = VERSION;
    document.dispatchEvent(new CustomEvent('sev:approved-plan-ready', { detail: window.SEV_APPROVED_PLAN_V1 }));
    return true;
  }

  document.addEventListener('sev:portal-ready', install, { once: true });
  if (install()) return;

  const observer = new MutationObserver(() => {
    if (!install()) return;
    observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 7000);
})();
