(() => {
  const team = [
    { id: 'michael', name: 'Michael Koba', role: 'Film producer' },
    { id: 'thomas', name: 'Thomas Koba', role: 'Instruktør og filmmaker' },
    { id: 'elisabeth', name: 'Elisabeth', role: 'Bureau' },
    { id: 'tor', name: 'Tór Verland Johannesen', role: 'Bureau' },
    { id: 'bogi', name: 'Bogi', role: 'Bureau' }
  ];

  const bureau = ['elisabeth', 'tor', 'bogi'];

  const tasks = [
    {
      date: '2026-08-03', displayDate: '3. august', time: 'I dag',
      title: 'Planlæg hele produktionsugen',
      assignees: ['michael'], status: 'I gang', priority: 'Høj', type: 'Produktion',
      detail: 'Lav den samlede prioriterede plan for 3.–8. august: casting, locations, droneoptagelser, borefirma, tilladelser, rekvisitter, call sheet og plan B.',
      done: 'Alle opgaver har en ansvarlig, deadline og et klart næste skridt.'
    },
    {
      date: '2026-08-04', displayDate: '4.–6. august', time: 'Efter vejr og lys',
      title: 'Gennemfør de prioriterede droneoptagelser',
      assignees: ['michael', 'thomas'], status: 'I gang', priority: 'Høj', type: 'Optagelse',
      detail: 'Optag Klaksvík, lille bygd, dæmning, vindmøller og ø-landskaber. Prioritér dagslys først og natbilleder, når vind, sigt og lys passer.',
      done: 'De prioriterede billeder er optaget, eller de konkrete mangler er noteret efter hver dag.'
    },
    {
      date: '2026-08-05', displayDate: 'Senest 5. august', time: 'Inden dagens slutning',
      title: 'Indstil castingkandidater til alle roller',
      assignees: bureau, status: 'I gang', priority: 'Høj', type: 'Casting',
      detail: 'Find kandidater til dreng, mor, mand ved tørresnoren og tre børn. Saml billeder, alder, kontaktoplysninger, tilgængelighed og eventuelle castingvideoer.',
      done: 'Der ligger mindst én brugbar kandidat til hver rolle, klar til fælles godkendelse.'
    },
    {
      date: '2026-08-05', displayDate: 'Senest 5. august', time: 'Inden dagens slutning',
      title: 'Tilføj egne castingkandidater',
      assignees: ['michael'], status: 'I gang', priority: 'Normal', type: 'Casting',
      detail: 'KOVBOY FILM / FIXER kan tilføje egne kandidater, som vurderes på lige fod med bureauets kandidater.',
      done: 'Eventuelle egne kandidater er sendt med de samme oplysninger som bureauets kandidater.'
    },
    {
      date: '2026-08-05', displayDate: 'Senest 5. august', time: 'Inden dagens slutning',
      title: 'Udarbejd og dokumentér locationforslag',
      assignees: ['michael', 'thomas'], status: 'I gang', priority: 'Høj', type: 'Locations',
      detail: 'Foreslå locations til værelse, hus med elbil/ladeboks/varmepumpe, vandløb, solpaneler, tørresnor, gadelys, vindmøller og øvrige scener. Dokumentér med billeder eller video.',
      done: 'Hvert forslag viser adgang, parkering, strøm, lyd, lys, vejr/plan B og nødvendige tilladelser.'
    },
    {
      date: '2026-08-06', displayDate: 'Senest 6. august', time: 'Inden dagens slutning',
      title: 'Kontakt borefirmaer om aktiv jordvarmeboring',
      assignees: ['michael'], status: 'I gang', priority: 'Høj', type: 'Tilladelse',
      detail: 'Undersøg om en aktiv boring kan filmes mellem 9. og 23. august, og afklar kontaktperson, tidspunkt, adgang og sikkerhed.',
      done: 'Der er en konkret mulighed eller et dokumenteret alternativ til scene 11A.'
    },
    {
      date: '2026-08-07', displayDate: 'Senest 7. august', time: 'Så snart forslagene er klar',
      title: 'Godkend de endelige locations',
      assignees: bureau, status: 'Ikke startet', priority: 'Høj', type: 'Godkendelse',
      detail: 'Gennemgå Michael og Thomas’ locationforslag og godkend den kreative retning eller skriv præcist, hvad der skal ændres.',
      done: 'Hver location er enten godkendt eller har én tydelig rettelse og en ansvarlig.'
    },
    {
      date: '2026-08-07', displayDate: 'Senest 7. august', time: 'Efter castingforslag',
      title: 'Godkend den endelige casting',
      assignees: [...bureau, 'thomas'], status: 'Ikke startet', priority: 'Høj', type: 'Godkendelse',
      detail: 'SANSIR, Thomas Koba og SEV skal godkende de valgte skuespillere. Bureauet koordinerer SANSIRs samlede svar.',
      done: 'Dreng, mor, mand og tre børn er valgt og godkendt af alle parter.'
    },
    {
      date: '2026-08-08', displayDate: 'Senest 8. august', time: 'Før call sheet udsendes',
      title: 'Få kontrakter og forældretilladelser på plads',
      assignees: bureau, status: 'Ikke startet', priority: 'Høj', type: 'Casting',
      detail: 'Indhent alle aftaler, releases og forældretilladelser til børnene før første hovedoptagedag.',
      done: 'Alle medvirkende må lovligt og praktisk møde til optagelse den 9. august.'
    },
    {
      date: '2026-08-08', displayDate: 'Senest 8. august', time: 'Før første optagedag',
      title: 'Vælg og klargør tøj, sminke og rekvisitter',
      assignees: bureau, status: 'I gang', priority: 'Høj', type: 'Art department',
      detail: 'Vælg tøj, sminke og rekvisitter til alle skuespillerscener og sørg for kontinuitet mellem scenerne.',
      done: 'Alt er pakket, mærket og fordelt pr. scene med godkendte alternativer.'
    },
    {
      date: '2026-08-08', displayDate: 'Senest 8. august', time: 'Inden optagelse',
      title: 'Sikr tilladelser og sikkerhed til jordvarmescenen',
      assignees: ['michael'], status: 'Ikke startet', priority: 'Høj', type: 'Tilladelse',
      detail: 'Afklar adgang, medarbejdermedvirken, grundejer, sikkerhedsregler og eventuelt sikkerhedsudstyr.',
      done: 'Scene 11A kan optages sikkert med alle nødvendige godkendelser.'
    },
    {
      date: '2026-08-08', displayDate: 'Senest 8. august', time: 'Inden efterarbejde planlægges',
      title: 'Find og rettighedsafklar historisk stillbillede',
      assignees: ['michael'], status: 'Ikke startet', priority: 'Normal', type: 'Rettigheder',
      detail: 'Find billedet til scene 2A og afklar, at det senere må AI-animeres. Der skal ikke produceres AI-animation nu.',
      done: 'Billedfil, kilde og skriftlig rettighedsafklaring er samlet.'
    },
    {
      date: '2026-08-08', displayDate: '8. august', time: 'Når cast og location er låst',
      title: 'Udsend call sheet til første optagedag',
      assignees: ['michael'], status: 'Ikke startet', priority: 'Høj', type: 'Produktion',
      detail: 'Call sheet skal indeholde mødetid, location, scener, crew, skuespillere, transport, tøj, rekvisitter og plan B.',
      done: 'Alle relevante personer har modtaget én opdateret og entydig version.'
    },
    {
      date: '2026-08-08', displayDate: '8. august', time: 'Sidste kontrol',
      title: 'Gennemfør endelig produktionskontrol',
      assignees: team.map(person => person.id), status: 'Ikke startet', priority: 'Høj', type: 'Fælles',
      detail: 'Gennemgå casting, locations, tilladelser, tøj, sminke, rekvisitter, udstyr, transport, call sheet og plan B.',
      done: 'Alle fem har set deres ansvar, og første hovedoptagelse kan starte søndag 9. august.'
    }
  ];

  const milestones = [
    { date: '2026-08-03', label: '3. august', title: 'Produktionsugen planlægges', text: 'Alle forberedelser prioriteres og fordeles.' },
    { date: '2026-08-04', label: '4.–6. august', title: 'Dronevinduer', text: 'Scener 3A, 5A, 6A, 7A og 8A efter vejr, sigt og lys.' },
    { date: '2026-08-09', label: '9. august', title: 'Optagedag 1 · Drengens værelse', text: 'Scener 1A, 1B, 1C, 15A og 15B. Dreng og mor.' },
    { date: '2026-08-10', label: '10.–20. august', title: 'Hovedoptagelser', text: 'Scener fordeles efter godkendte locations, cast og vejr. Målet er at være færdig 20. august.' },
    { date: '2026-08-21', label: '21.–22. august', title: 'Reservedage', text: 'Pickups, genoptagelser og vejrafhængige mangler.' },
    { date: '2026-08-23', label: '23. august', title: 'Absolut sidste reserve', text: 'Bruges kun ved nødvendige resterende optagelser.' }
  ];

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[char]);
  }

  function personName(id) {
    return team.find(person => person.id === id)?.name || id;
  }

  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .plan-toolbar{display:grid;grid-template-columns:minmax(220px,320px) 1fr;gap:14px;align-items:end;margin:0 0 22px;padding:16px;background:var(--bg-elevated);border:1px solid var(--border-strong);border-radius:9px}
      .plan-toolbar label{display:block;margin-bottom:6px;color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.05em;text-transform:uppercase}
      .plan-toolbar select{width:100%;padding:11px 12px;color:var(--text);background:var(--bg-elevated-2);border:1px solid var(--border-strong);border-radius:7px;outline:none}
      .plan-toolbar select:focus{border-color:var(--current)}
      .plan-summary{color:var(--text-muted);font-size:13px}.plan-summary strong{display:block;color:var(--text);font-size:15px}
      .bureau-note{margin:0 0 18px;padding:12px 14px;color:var(--text);background:rgba(246,176,66,.09);border:1px solid rgba(246,176,66,.28);border-radius:8px;font-size:13px}
      .plan-date{margin:25px 0 10px;color:var(--current);font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.05em;text-transform:uppercase}
      .task-card{margin-bottom:10px;padding:16px 18px;background:var(--bg-elevated);border:1px solid var(--border);border-left:3px solid var(--current-dim);border-radius:8px}
      .task-card.high{border-left-color:var(--signal)}
      .task-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.task-title{font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:600}.task-time{margin-top:2px;color:var(--text-muted);font-size:12px}
      .task-status{flex-shrink:0;padding:3px 8px;border:1px solid var(--border-strong);border-radius:99px;color:var(--current);font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase}
      .task-meta{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.task-chip{padding:3px 7px;color:var(--text-muted);background:var(--bg-elevated-2);border-radius:5px;font-size:11px}.task-chip.owner{color:var(--text)}
      .task-copy{margin-top:12px;color:var(--text-muted);font-size:13.5px}.task-copy b{color:var(--text);font-weight:500}.task-done{margin-top:8px;padding-top:8px;border-top:1px solid var(--border);color:var(--text-muted);font-size:12.5px}
      .milestone{margin-bottom:10px;padding:14px 16px;background:rgba(20,40,50,.65);border:1px solid var(--border);border-radius:8px}.milestone-title{font-weight:600}.milestone-text{margin-top:3px;color:var(--text-muted);font-size:13px}
      .empty-plan{padding:20px;color:var(--text-muted);border:1px dashed var(--border-strong);border-radius:8px}
      .current-person{color:var(--current)}
      .crew-card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}.crew-card{padding:16px;background:var(--bg-elevated);border:1px solid var(--border);border-radius:8px}.crew-card-name{font-weight:600}.crew-card-role{margin-top:3px;color:var(--current);font-size:12.5px}
      @media(max-width:650px){.plan-toolbar{grid-template-columns:1fr}.task-top{flex-direction:column}.task-status{align-self:flex-start}.task-card{padding:15px}}
    `;
    document.head.appendChild(style);
  }

  function renderSchedule(selectedId = 'all') {
    const list = document.getElementById('production-plan-list');
    const summary = document.getElementById('plan-summary');
    if (!list || !summary) return;

    const selectedPerson = team.find(person => person.id === selectedId);
    const filteredTasks = selectedId === 'all'
      ? tasks
      : tasks.filter(task => task.assignees.includes(selectedId));

    summary.innerHTML = selectedPerson
      ? `<strong><span class="current-person">${esc(selectedPerson.name)}</span> · ${filteredTasks.length} opgaver</strong><span>${esc(selectedPerson.role)}</span>`
      : `<strong>Samlet plan · ${tasks.length} opgaver</strong><span>Forberedelser og optageperiodens vigtigste milepæle i datoorden.</span>`;

    const items = selectedId === 'all'
      ? [...tasks.map(task => ({ kind: 'task', date: task.date, item: task })), ...milestones.map(item => ({ kind: 'milestone', date: item.date, item }))]
      : filteredTasks.map(task => ({ kind: 'task', date: task.date, item: task }));

    items.sort((a, b) => a.date.localeCompare(b.date) || (a.kind === 'milestone' ? -1 : 1));

    let currentDate = '';
    let html = '';
    items.forEach(entry => {
      const label = entry.kind === 'task' ? entry.item.displayDate : entry.item.label;
      if (entry.date !== currentDate) {
        currentDate = entry.date;
        html += `<div class="plan-date">${esc(label)}</div>`;
      }

      if (entry.kind === 'milestone') {
        html += `<div class="milestone"><div class="milestone-title">${esc(entry.item.title)}</div><div class="milestone-text">${esc(entry.item.text)}</div></div>`;
        return;
      }

      const task = entry.item;
      const owners = task.assignees.map(personName).join(' · ');
      html += `
        <article class="task-card ${task.priority === 'Høj' ? 'high' : ''}">
          <div class="task-top">
            <div><div class="task-title">${esc(task.title)}</div><div class="task-time">${esc(task.time)}</div></div>
            <span class="task-status">${esc(task.status)}</span>
          </div>
          <div class="task-meta">
            <span class="task-chip">${esc(task.type)}</span>
            <span class="task-chip owner">Ansvar: ${esc(owners)}</span>
          </div>
          <div class="task-copy"><b>Opgaven:</b> ${esc(task.detail)}</div>
          <div class="task-done"><b>Færdig når:</b> ${esc(task.done)}</div>
        </article>`;
    });

    list.innerHTML = html || '<div class="empty-plan">Der er endnu ingen opgaver registreret på dette navn.</div>';
  }

  function buildSchedulePanel() {
    const panel = document.getElementById('panel-schedule');
    if (!panel) return;

    const options = [
      '<option value="all">Alle · samlet plan</option>',
      ...team.map(person => `<option value="${esc(person.id)}">${esc(person.name)} · ${esc(person.role)}</option>`)
    ].join('');

    panel.innerHTML = `
      <div class="section-head">
        <h2>Produktionsplan og personlige opgaver</h2>
        <p>Vælg dit navn. Så vises kun det, du selv skal gøre, med deadline og en enkel forklaring.</p>
      </div>
      <div class="plan-toolbar">
        <div><label for="task-person-filter">Vælg navn</label><select id="task-person-filter">${options}</select></div>
        <div class="plan-summary" id="plan-summary"></div>
      </div>
      <div class="bureau-note"><b>Fælles bureauansvar:</b> Alt, der står på Elisabeth, gælder også Tór Verland Johannesen og Bogi. De tre ser derfor de samme bureauopgaver.</div>
      <div id="production-plan-list"></div>`;

    const select = document.getElementById('task-person-filter');
    const saved = localStorage.getItem('sev-task-person');
    if (saved && team.some(person => person.id === saved)) select.value = saved;
    select.addEventListener('change', event => {
      localStorage.setItem('sev-task-person', event.target.value);
      renderSchedule(event.target.value);
    });
    renderSchedule(select.value);
  }

  function buildCrewPanel() {
    const crewTab = document.querySelector('nav.tabs button[data-tab="crew"]');
    if (crewTab) crewTab.textContent = 'Crew';

    const scheduleTab = document.querySelector('nav.tabs button[data-tab="schedule"]');
    if (scheduleTab) scheduleTab.textContent = 'Plan & opgaver';

    const panel = document.getElementById('panel-crew');
    if (!panel) return;
    panel.innerHTML = `
      <div class="section-head"><h2>Involverede indtil videre</h2><p>Skuespillere tilføjes, efterhånden som castingen bliver godkendt.</p></div>
      <div class="crew-card-grid">${team.map(person => `
        <div class="crew-card"><div class="crew-card-name">${esc(person.name)}</div><div class="crew-card-role">${esc(person.role)}</div></div>
      `).join('')}</div>`;
  }

  function init() {
    addStyles();
    buildSchedulePanel();
    buildCrewPanel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
