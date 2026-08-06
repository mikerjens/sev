(() => {
  'use strict';

  const VERSION = '2026-08-06-1234';
  const TOR_ID = 'tor';
  const TOR_NAME = 'Tór Verland Johansen';
  const RUNI_NAME = 'Rúni Friis Kjær';
  const HEIDI_NAME = 'Heidi Mortensen';

  const TASKS = {
    children: {
      match: /^(Find børn og forældrekontakter til scene 4A|Find tre børn til scene 4A)$/i,
      title: 'Find tre børn til scene 4A',
      time: 'Senest 8. august · før optagelsen',
      status: 'Ikke startet',
      type: 'Casting',
      owner: TOR_NAME,
      detail: 'Tór Verland Johansen finder tre børn til scene 4A og bekræfter, at de kan deltage i optagelsen i Elduvík den 10. august kl. 21:30. Navn på hvert barn samt forældrenes navne, telefonnumre og e-mailadresser skal registreres.',
      done: 'Tre børn er bekræftet, og der foreligger komplette kontaktoplysninger på deres forældre.'
    },
    agreements: {
      match: /^(Få kontrakter og forældretilladelser på plads|Få aftaler med forældrene til scene 4A på plads)$/i,
      title: 'Få aftaler med forældrene til scene 4A på plads',
      time: 'Senest 8. august · før optagelsen',
      status: 'Ikke startet',
      type: 'Aftaler',
      owner: TOR_NAME,
      detail: 'Tór Verland Johansen kontakter forældrene til de tre børn og får alle aftaler, releases og forældretilladelser godkendt og underskrevet før optagelsen.',
      done: 'Alle tre børn har en godkendt aftale og underskrevet forældretilladelse, så de kan medvirke i scene 4A.'
    }
  };

  function taskMarkup(data) {
    return `<article class="task-card high" data-scene-4a-responsibility="${VERSION}">
      <div class="task-top">
        <div>
          <div class="task-title">${data.title}</div>
          <div class="task-time">${data.time}</div>
        </div>
        <span class="task-status">${data.status}</span>
      </div>
      <div class="task-meta">
        <span class="task-chip">${data.type}</span>
        <span class="task-chip owner">Ansvar: ${data.owner}</span>
      </div>
      <div class="task-copy"><b>Opgaven:</b> ${data.detail}</div>
      <div class="task-done"><b>Færdig når:</b> ${data.done}</div>
    </article>`;
  }

  function updateTaskCard(card, data) {
    const title = card.querySelector('.task-title');
    const time = card.querySelector('.task-time');
    const status = card.querySelector('.task-status');
    const type = card.querySelector('.task-chip:not(.owner)');
    let owner = card.querySelector('.task-chip.owner');
    const copy = card.querySelector('.task-copy');
    const done = card.querySelector('.task-done');

    if (title) title.textContent = data.title;
    if (time) time.textContent = data.time;
    if (status) status.textContent = data.status;
    if (type) type.textContent = data.type;
    if (!owner) {
      owner = document.createElement('span');
      owner.className = 'task-chip owner';
      card.querySelector('.task-meta')?.appendChild(owner);
    }
    if (owner) owner.textContent = `Ansvar: ${data.owner}`;
    if (copy) copy.innerHTML = `<b>Opgaven:</b> ${data.detail}`;
    if (done) done.innerHTML = `<b>Færdig når:</b> ${data.done}`;
    card.dataset.scene4aResponsibility = VERSION;
  }

  function insertTask(list, data) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = taskMarkup(data);
    const card = wrapper.firstElementChild;
    const boundary = [...list.querySelectorAll('.plan-date')]
      .find(heading => /10\. august|Før hver optagedag/i.test(heading.textContent || ''));

    let heading = [...list.querySelectorAll('.plan-date')]
      .find(item => /Scene 4A · casting og aftaler/i.test(item.textContent || ''));
    if (!heading) {
      heading = document.createElement('div');
      heading.className = 'plan-date';
      heading.dataset.scene4aResponsibilities = VERSION;
      heading.textContent = 'Scene 4A · casting og aftaler';
      list.insertBefore(heading, boundary || null);
    }

    list.insertBefore(card, boundary || null);
    return card;
  }

  function cleanEmptyHeadings(list) {
    [...list.querySelectorAll('.plan-date')].forEach(heading => {
      let node = heading.nextElementSibling;
      let hasContent = false;
      while (node && !node.classList.contains('plan-date')) {
        if (node.matches('.task-card, .milestone')) hasContent = true;
        node = node.nextElementSibling;
      }
      if (!hasContent) heading.remove();
    });
  }

  function updateSummary(list, selected) {
    const summary = document.getElementById('plan-summary');
    const select = document.getElementById('task-person-filter');
    if (!summary || !select) return;
    const count = list.querySelectorAll('.task-card').length;

    if (selected === 'all') {
      summary.innerHTML = `<strong>Samlet plan · ${count} opgaver</strong><span>Alle personer, opgaver og milepæle.</span>`;
      return;
    }

    const label = select.options[select.selectedIndex]?.textContent || '';
    const name = label.split(' · ')[0] || label;
    summary.innerHTML = `<strong><span class="current-person">${name}</span> · ${count} opgaver</strong><span>Kun egne opgaver og deadlines.</span>`;
  }

  function updatePersonalSchedule() {
    const select = document.getElementById('task-person-filter');
    const list = document.getElementById('production-plan-list');
    if (!select || !list) return;
    const selected = select.value || 'all';

    [...list.querySelectorAll('.task-card')].forEach(card => {
      const title = card.querySelector('.task-title')?.textContent.trim() || '';
      const data = Object.values(TASKS).find(task => task.match.test(title));
      if (!data) return;

      if (selected !== 'all' && selected !== TOR_ID) {
        card.remove();
        return;
      }
      updateTaskCard(card, data);
    });

    if (selected === 'all' || selected === TOR_ID) {
      Object.values(TASKS).forEach(data => {
        const existing = [...list.querySelectorAll('.task-card')]
          .find(card => data.match.test(card.querySelector('.task-title')?.textContent.trim() || ''));
        if (existing) updateTaskCard(existing, data);
        else insertTask(list, data);
      });
    }

    [...list.querySelectorAll('.task-card')].forEach(card => {
      const title = card.querySelector('.task-title')?.textContent.trim() || '';
      if (!/^Film scene 4A under gadelyset$/i.test(title)) return;
      const owner = card.querySelector('.task-chip.owner');
      if (owner) owner.textContent = `Ansvar: Michael Koba · Thomas Koba · ${TOR_NAME} · ${RUNI_NAME} · ${HEIDI_NAME}`;
      const copy = card.querySelector('.task-copy');
      if (copy) copy.innerHTML = `<b>Opgaven:</b> Film de tre børn under gadelyset i Elduvík. ${TOR_NAME} sørger for børnene og aftalerne med deres forældre. Når kontaktoplysningerne er modtaget, afstemmer ${HEIDI_NAME} børnenes tøj med familierne og skaffer en fodbold. ${RUNI_NAME} planlægger, medbringer, opsætter og betjener lyset.`;
      card.dataset.scene4aResponsibility = VERSION;
    });

    cleanEmptyHeadings(list);
    updateSummary(list, selected);
  }

  function priorityRowMarkup(data) {
    return `<div class="v2-task-row" data-scene-4a-priority="${VERSION}">
      <span class="v2-task-marker" aria-hidden="true"></span>
      <div class="v2-task-main"><strong>${data.title}</strong><span>${data.time}</span></div>
      <div class="v2-task-side"><span class="v2-owner">${data.owner}</span><span class="v2-task-status">${data.status}</span></div>
    </div>`;
  }

  function ensurePriorityRow(list, data) {
    let row = [...list.querySelectorAll('.v2-task-row')]
      .find(item => item.querySelector('strong')?.textContent.trim() === data.title);
    if (!row) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = priorityRowMarkup(data);
      row = wrapper.firstElementChild;
      list.appendChild(row);
    }

    const title = row.querySelector('strong');
    const time = row.querySelector('.v2-task-main span');
    let owner = row.querySelector('.v2-owner');
    const status = row.querySelector('.v2-task-status');
    if (title) title.textContent = data.title;
    if (time) time.textContent = data.time;
    if (!owner) {
      owner = document.createElement('span');
      owner.className = 'v2-owner';
      row.querySelector('.v2-task-side')?.prepend(owner);
    }
    if (owner) owner.textContent = data.owner;
    if (status) status.textContent = data.status;
    row.dataset.scene4aPriority = VERSION;
  }

  function updateFrontPagePriorities() {
    const primary = document.querySelector('.v2-primary-card');
    const list = primary?.querySelector('.v2-task-list');
    if (!primary || !list || !/\b4A\b/.test(primary.textContent || '')) return;

    Object.values(TASKS).forEach(data => {
      let row = [...list.querySelectorAll('.v2-task-row')]
        .find(item => data.match.test(item.querySelector('strong')?.textContent.trim() || ''));
      if (!row) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = priorityRowMarkup(data);
        row = wrapper.firstElementChild;
        list.appendChild(row);
      }
      const title = row.querySelector('strong');
      const time = row.querySelector('.v2-task-main span');
      let owner = row.querySelector('.v2-owner');
      const status = row.querySelector('.v2-task-status');
      if (title) title.textContent = data.title;
      if (time) time.textContent = data.time;
      if (!owner) {
        owner = document.createElement('span');
        owner.className = 'v2-owner';
        row.querySelector('.v2-task-side')?.prepend(owner);
      }
      if (owner) owner.textContent = data.owner;
      if (status) status.textContent = data.status;
      row.dataset.scene4aPriority = VERSION;
    });

    ensurePriorityRow(list, {
      title: 'Planlæg og gennemfør lys til scene 4A',
      time: 'Før optagelsen 10. august kl. 21:30',
      status: 'Planlagt',
      owner: RUNI_NAME
    });

    ensurePriorityRow(list, {
      title: 'Afstem børnenes tøj og skaf en fodbold til scene 4A',
      time: 'Afventer navne og forældrekontakter fra Tór',
      status: 'Afventer Tór',
      owner: HEIDI_NAME
    });

    const count = primary.querySelector('.v2-section-heading small');
    if (count) count.textContent = `${list.querySelectorAll('.v2-task-row').length} prioriterede punkter`;
  }

  function updateSceneStatus() {
    document.querySelectorAll('.producer-location-card').forEach(card => {
      const scenes = card.querySelector('.producer-scenes')?.textContent || card.textContent || '';
      if (!/\b4A\b/.test(scenes)) return;
      const comment = card.querySelector('.producer-location-comment, .producer-comment');
      if (comment) comment.textContent = `${TOR_NAME} finder de tre børn og får aftaler samt forældretilladelser på plads. ${HEIDI_NAME} afventer kontaktoplysningerne, afstemmer derefter børnenes tøj med familierne og skaffer en fodbold. ${RUNI_NAME} ordner lyset til scene 4A.`;
      card.dataset.scene4aResponsibility = VERSION;
    });
  }

  function install() {
    updatePersonalSchedule();
    updateFrontPagePriorities();
    updateSceneStatus();
    document.getElementById('panel-schedule')?.setAttribute('data-scene-4a-responsibilities', VERSION);
  }

  document.addEventListener('sev:portal-ready', () => window.setTimeout(install, 0));
  document.addEventListener('sev:v2-ready', () => window.setTimeout(install, 0));
  document.addEventListener('sev:frontpage-production-status-ready', () => window.setTimeout(install, 0));

  document.addEventListener('change', event => {
    if (event.target?.id === 'task-person-filter') window.setTimeout(install, 0);
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.setTimeout(install, 3200), { once: true });
  } else {
    window.setTimeout(install, 3200);
  }
})();