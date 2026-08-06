(() => {
  'use strict';

  const VERSION = '2026-08-06-1232';

  const RUNI = {
    id: 'runi-friis-kjaer',
    personId: 'runi',
    name: 'Rúni Friis Kjær',
    role: 'Lysmand',
    email: 'rfk@friiframe.fo',
    phone: '+298 218218',
    telHref: '+298218218',
    note: 'Ansvarlig for lys på scene 4A i Elduvík den 10. august kl. 21:30.'
  };

  const HEIDI = {
    id: 'heidi-mortensen',
    personId: 'heidi',
    name: 'Heidi Mortensen',
    role: 'Stylist',
    email: 'heidi@atlanta.fo',
    phone: '+298 790050',
    telHref: '+298790050',
    note: 'Stylist på scene 4A i Elduvík den 10. august kl. 21:30. Afventer børnenes navne og forældrekontakter fra Tór Verland Johansen.'
  };

  const TEAM_MEMBERS = [RUNI, HEIDI];

  const PERSONAL_TASKS = {
    [RUNI.personId]: {
      member: RUNI,
      title: 'Planlæg og gennemfør lys til scene 4A',
      time: 'Mandag 10. august kl. 21:30 · Elduvík',
      status: 'Planlagt',
      type: 'Lys',
      detail: 'Planlæg lyssætningen til scene 4A sammen med Thomas Koba. Medbring det nødvendige lysudstyr og sørg for sikker opsætning, betjening og nedtagning under optagelsen ved gadelyset i Elduvík.',
      done: 'Lysplanen er godkendt, udstyret er kontrolleret, og scene 4A er gennemført med det aftalte lys.'
    },
    [HEIDI.personId]: {
      member: HEIDI,
      title: 'Afstem børnenes tøj og skaf en fodbold til scene 4A',
      time: 'Før mandag 10. august kl. 21:30 · Elduvík',
      status: 'Afventer Tór',
      type: 'Styling og rekvisit',
      detail: 'Afvent navnene på de tre børn og kontaktoplysningerne til deres forældre fra Tór Verland Johansen. Kontakt derefter familierne og afstem præcist, hvilket tøj hvert barn skal have på. Skaff en fodbold, og medbring den til optagelsen af scene 4A.',
      done: 'Alle tre familiers tøjvalg er aftalt og godkendt, og en egnet fodbold er klar og medbringes til optagelsen.'
    }
  };

  function taskMarkup(personId) {
    const task = PERSONAL_TASKS[personId];
    if (!task) return '';
    return `<article class="task-card high" data-crew-personal-task="${personId}" data-scene-4a-task="${VERSION}">
      <div class="task-top">
        <div>
          <div class="task-title">${task.title}</div>
          <div class="task-time">${task.time}</div>
        </div>
        <span class="task-status">${task.status}</span>
      </div>
      <div class="task-meta">
        <span class="task-chip">${task.type}</span>
        <span class="task-chip owner">Ansvar: ${task.member.name}</span>
      </div>
      <div class="task-copy"><b>Opgaven:</b> ${task.detail}</div>
      <div class="task-done"><b>Færdig når:</b> ${task.done}</div>
    </article>`;
  }

  function searchMatches(member) {
    const query = (document.getElementById('team-search')?.value || '')
      .trim()
      .toLocaleLowerCase('da-DK');
    if (!query) return true;

    const searchable = `${member.name} ${member.role} ${member.email} ${member.phone} ${member.note}`
      .toLocaleLowerCase('da-DK');
    return searchable.includes(query);
  }

  function updateTeamCount(group) {
    const grid = group.querySelector('.team-card-grid');
    const count = group.querySelector('.team-group-count');
    if (!grid || !count) return;
    const total = grid.querySelectorAll('.team-card').length;
    count.textContent = `${total} ${total === 1 ? 'person' : 'personer'}`;
  }

  function memberCard(member) {
    const card = document.createElement('article');
    card.className = 'team-card';
    card.dataset.teamMember = member.id;
    card.innerHTML = `
      <div class="team-card-top">
        <div>
          <div class="team-card-name">${member.name}</div>
          <div class="team-card-type">${member.role}</div>
        </div>
        <span class="team-status">Bekræftet</span>
      </div>
      <p class="team-card-note">${member.note}</p>
      <div class="team-contact-list">
        <a href="mailto:${member.email}">✉ ${member.email}</a>
        <a href="tel:${member.telHref}">☎ ${member.phone}</a>
      </div>`;
    return card;
  }

  function installTeamCards() {
    const groups = document.getElementById('team-groups');
    if (!groups) return false;

    const group = [...groups.querySelectorAll('.team-group')]
      .find(section => /Filmhold og produktion/i.test(
        section.querySelector('.team-group-title')?.textContent || ''
      ));
    if (!group) return false;

    const grid = group.querySelector('.team-card-grid');
    if (!grid) return false;

    TEAM_MEMBERS.forEach(member => {
      const selector = `[data-team-member="${member.id}"]`;
      const existing = grid.querySelector(selector);

      if (!searchMatches(member)) {
        existing?.remove();
        return;
      }

      if (!existing) grid.appendChild(memberCard(member));
      else existing.replaceWith(memberCard(member));
    });

    updateTeamCount(group);
    return true;
  }

  function setPersonalSummary(personId) {
    const task = PERSONAL_TASKS[personId];
    const summary = document.getElementById('plan-summary');
    if (!task || !summary) return;
    summary.innerHTML = `<strong><span class="current-person">${task.member.name}</span> · 1 opgave</strong><span>${task.member.role} · kun egne opgaver og deadlines.</span>`;
  }

  function showPersonalSchedule(personId) {
    const task = PERSONAL_TASKS[personId];
    const list = document.getElementById('production-plan-list');
    if (!task || !list) return false;

    list.innerHTML = `<div class="plan-date">10. august</div>${taskMarkup(personId)}`;
    setPersonalSummary(personId);

    const bureauNote = document.querySelector('#schedule-main-column > .bureau-note');
    if (bureauNote) bureauNote.style.display = 'none';
    return true;
  }

  function addTasksToAll() {
    const list = document.getElementById('production-plan-list');
    const summary = document.getElementById('plan-summary');
    if (!list || !summary) return false;

    const finalControlHeading = [...list.querySelectorAll('.plan-date')]
      .find(node => /Før hver optagedag/i.test(node.textContent));

    Object.keys(PERSONAL_TASKS).forEach(personId => {
      if (list.querySelector(`[data-crew-personal-task="${personId}"]`)) return;

      const wrapper = document.createElement('div');
      wrapper.innerHTML = taskMarkup(personId);
      const card = wrapper.firstElementChild;
      if (!card) return;
      if (finalControlHeading) list.insertBefore(card, finalControlHeading);
      else list.appendChild(card);
    });

    const count = list.querySelectorAll('.task-card').length;
    summary.innerHTML = `<strong>Samlet plan · ${count} opgaver</strong><span>Alle personer, opgaver og milepæle.</span>`;
    return true;
  }

  function ensureOptions(select) {
    TEAM_MEMBERS.forEach(member => {
      let option = select.querySelector(`option[value="${member.personId}"]`);
      if (!option) {
        option = document.createElement('option');
        option.value = member.personId;
        select.appendChild(option);
      }
      option.textContent = `${member.name} · ${member.role}`;
    });
  }

  function applySelectedSchedule(select) {
    const bureauNote = document.querySelector('#schedule-main-column > .bureau-note');
    if (PERSONAL_TASKS[select.value]) {
      showPersonalSchedule(select.value);
      return;
    }
    if (bureauNote) bureauNote.style.display = '';
    if (select.value === 'all') addTasksToAll();
  }

  function syncSchedule() {
    const select = document.getElementById('task-person-filter');
    if (!select) return false;

    ensureOptions(select);

    if (!select.dataset.crewScheduleListener) {
      select.dataset.crewScheduleListener = VERSION;
      select.addEventListener('change', () => {
        window.setTimeout(() => applySelectedSchedule(select), 30);
      });
    }

    let saved = '';
    try { saved = localStorage.getItem('sev-task-person') || ''; } catch (_) {}
    if (PERSONAL_TASKS[saved]) {
      select.value = saved;
      window.setTimeout(() => showPersonalSchedule(saved), 30);
    } else if (select.value === 'all') {
      window.setTimeout(addTasksToAll, 30);
    }

    return true;
  }

  function install() {
    installTeamCards();
    syncSchedule();
  }

  document.addEventListener('sev:portal-ready', install, { once: true });
  document.addEventListener('sev:v2-ready', () => window.setTimeout(install, 0), { once: true });
  document.addEventListener('input', event => {
    if (event.target?.id === 'team-search') window.setTimeout(installTeamCards, 0);
  }, true);

  install();
})();
