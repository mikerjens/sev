(() => {
  'use strict';

  const VERSION = '2026-08-05-2047';
  const PERSON_ID = 'runi';
  const PERSON = {
    name: 'Rúni Friis Kjær',
    role: 'Lysmand',
    email: 'rfk@friiframe.fo',
    phone: '+298 218218'
  };

  function taskMarkup() {
    return `<article class="task-card high" data-runi-scene-2a-task="${VERSION}">
      <div class="task-top">
        <div>
          <div class="task-title">Planlæg og gennemfør lys til scene 2A</div>
          <div class="task-time">Mandag 17. august kl. 13:00 · Skálabúðin, Tórshavn</div>
        </div>
        <span class="task-status">Planlagt</span>
      </div>
      <div class="task-meta">
        <span class="task-chip">Lys</span>
        <span class="task-chip owner">Ansvar: ${PERSON.name}</span>
      </div>
      <div class="task-copy"><b>Opgaven:</b> Planlæg lyssætningen til scene 2A sammen med Thomas Koba. Kontrollér strømforhold, medbring det nødvendige lysudstyr og sørg for sikker opsætning og betjening under optagelsen.</div>
      <div class="task-done"><b>Færdig når:</b> Lysplanen er godkendt, udstyret er kontrolleret, og scene 2A er gennemført med det aftalte lys.</div>
    </article>`;
  }

  function searchMatches() {
    const query = (document.getElementById('team-search')?.value || '')
      .trim()
      .toLocaleLowerCase('da-DK');
    if (!query) return true;

    const searchable = `${PERSON.name} ${PERSON.role} ${PERSON.email} ${PERSON.phone}`
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

  function installTeamCard() {
    const groups = document.getElementById('team-groups');
    if (!groups) return false;

    const group = [...groups.querySelectorAll('.team-group')]
      .find(section => /Filmhold og produktion/i.test(
        section.querySelector('.team-group-title')?.textContent || ''
      ));
    if (!group) return false;

    const grid = group.querySelector('.team-card-grid');
    if (!grid) return false;

    const existing = grid.querySelector('[data-team-member="runi-friis-kjaer"]');
    if (!searchMatches()) {
      existing?.remove();
      updateTeamCount(group);
      return true;
    }

    if (!existing) {
      const card = document.createElement('article');
      card.className = 'team-card';
      card.dataset.teamMember = 'runi-friis-kjaer';
      card.innerHTML = `
        <div class="team-card-top">
          <div>
            <div class="team-card-name">${PERSON.name}</div>
            <div class="team-card-type">${PERSON.role}</div>
          </div>
          <span class="team-status">Bekræftet</span>
        </div>
        <p class="team-card-note">Ansvarlig for lys på scene 2A i Skálabúðin den 17. august kl. 13:00.</p>
        <div class="team-contact-list">
          <a href="mailto:${PERSON.email}">✉ ${PERSON.email}</a>
          <a href="tel:+298218218">☎ ${PERSON.phone}</a>
        </div>`;
      grid.appendChild(card);
    }

    updateTeamCount(group);
    return true;
  }

  function setRuniSummary() {
    const summary = document.getElementById('plan-summary');
    if (!summary) return;
    summary.innerHTML = `<strong><span class="current-person">${PERSON.name}</span> · 1 opgave</strong><span>${PERSON.role} · kun egne opgaver og deadlines.</span>`;
  }

  function showRuniSchedule() {
    const list = document.getElementById('production-plan-list');
    if (!list) return false;
    list.innerHTML = `<div class="plan-date">17. august</div>${taskMarkup()}`;
    setRuniSummary();
    const bureauNote = document.querySelector('#schedule-main-column > .bureau-note');
    if (bureauNote) bureauNote.style.display = 'none';
    return true;
  }

  function addRuniTaskToAll() {
    const list = document.getElementById('production-plan-list');
    const summary = document.getElementById('plan-summary');
    if (!list || !summary) return false;
    if (list.querySelector('[data-runi-scene-2a-task]')) return true;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="plan-date" data-runi-date="${VERSION}">17. august</div>${taskMarkup()}`;
    const nodes = [...wrapper.children];
    const finalControlHeading = [...list.querySelectorAll('.plan-date')]
      .find(node => /Før hver optagedag/i.test(node.textContent));

    nodes.forEach(node => {
      if (finalControlHeading) list.insertBefore(node, finalControlHeading);
      else list.appendChild(node);
    });

    const count = list.querySelectorAll('.task-card').length;
    summary.innerHTML = `<strong>Samlet plan · ${count} opgaver</strong><span>Alle personer, opgaver og milepæle.</span>`;
    return true;
  }

  function syncSchedule() {
    const select = document.getElementById('task-person-filter');
    if (!select) return false;

    let option = select.querySelector(`option[value="${PERSON_ID}"]`);
    if (!option) {
      option = document.createElement('option');
      option.value = PERSON_ID;
      option.textContent = `${PERSON.name} · ${PERSON.role}`;
      select.appendChild(option);
    }

    if (!select.dataset.runiScheduleListener) {
      select.dataset.runiScheduleListener = VERSION;
      select.addEventListener('change', () => {
        window.setTimeout(() => {
          const bureauNote = document.querySelector('#schedule-main-column > .bureau-note');
          if (select.value === PERSON_ID) {
            showRuniSchedule();
          } else {
            if (bureauNote) bureauNote.style.display = '';
            if (select.value === 'all') addRuniTaskToAll();
          }
        }, 0);
      });
    }

    let saved = '';
    try { saved = localStorage.getItem('sev-task-person') || ''; } catch (_) {}
    if (saved === PERSON_ID) {
      select.value = PERSON_ID;
      showRuniSchedule();
    } else if (select.value === 'all') {
      addRuniTaskToAll();
    }

    return true;
  }

  function install() {
    installTeamCard();
    syncSchedule();
  }

  document.addEventListener('sev:portal-ready', install, { once: true });
  document.addEventListener('input', event => {
    if (event.target?.id === 'team-search') window.setTimeout(installTeamCard, 0);
  }, true);

  install();
})();
