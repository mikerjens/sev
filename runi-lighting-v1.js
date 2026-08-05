(() => {
  'use strict';

  const VERSION = '2026-08-05-2025';
  const PERSON_ID = 'runi';
  const PERSON_NAME = 'Rúni Friis Kjær';

  function sceneIds(element) {
    if (!element) return [];
    const linked = [...element.querySelectorAll('[data-scene-link]')]
      .map(link => link.dataset.sceneLink)
      .filter(Boolean);
    if (linked.length) return [...new Set(linked)];
    return [...new Set((element.textContent || '').match(/\b\d+[A-Z]\b/g) || [])];
  }

  function taskMarkup() {
    return `<article class="task-card high" data-runi-light-task="${VERSION}">
      <div class="task-top"><div><div class="task-title">Planlæg og gennemfør lys til scene 4A</div><div class="task-time">Mandag 10. august kl. 21:30 · Elduvík</div></div><span class="task-status">Planlagt</span></div>
      <div class="task-meta"><span class="task-chip">Lys</span><span class="task-chip owner">Ansvar: ${PERSON_NAME}</span></div>
      <div class="task-copy"><b>Opgaven:</b> Planlæg lyssætningen med Thomas Koba, medbring det nødvendige lysudstyr og sørg for opsætning, betjening og sikkerhed under optagelsen af scene 4A i Elduvík.</div>
      <div class="task-done"><b>Færdig når:</b> Lysplanen er afstemt med Thomas, udstyret er kontrolleret, og scene 4A er gennemført med det aftalte lys.</div>
    </article>`;
  }

  function ensurePersonOption() {
    const select = document.getElementById('task-person-filter');
    if (!select) return false;

    let option = select.querySelector(`option[value="${PERSON_ID}"]`);
    if (!option) {
      option = document.createElement('option');
      option.value = PERSON_ID;
      option.textContent = `${PERSON_NAME} · Lysmand`;
      select.appendChild(option);
    }

    if (!select.dataset.runiListener) {
      select.dataset.runiListener = VERSION;
      select.addEventListener('change', () => {
        window.setTimeout(syncSchedule, 0);
        window.setTimeout(syncSchedule, 80);
      });
    }

    try {
      if (localStorage.getItem('sev-task-person') === PERSON_ID && select.value !== PERSON_ID) {
        select.value = PERSON_ID;
      }
    } catch (_) {}

    return true;
  }

  function updateSummaryForRuni() {
    const summary = document.getElementById('plan-summary');
    if (!summary) return;
    summary.innerHTML = `<strong>${PERSON_NAME}</strong>1 opgave · scene 4A`;
    summary.dataset.runiSummary = VERSION;
  }

  function addTaskToAll(list) {
    if (list.querySelector('[data-runi-light-task]')) return;
    const headings = [...list.querySelectorAll('.plan-date')];
    const heading = headings.find(node => /10\. august/i.test(node.textContent));
    const wrapper = document.createElement('div');
    wrapper.innerHTML = taskMarkup().trim();
    const card = wrapper.firstElementChild;

    if (heading) {
      let cursor = heading.nextElementSibling;
      while (cursor && !cursor.classList.contains('plan-date')) {
        if (cursor.classList.contains('task-card') && /scene 4A/i.test(cursor.textContent)) {
          cursor.insertAdjacentElement('afterend', card);
          return;
        }
        cursor = cursor.nextElementSibling;
      }
      heading.insertAdjacentElement('afterend', card);
      return;
    }

    const customHeading = document.createElement('div');
    customHeading.className = 'plan-date';
    customHeading.dataset.runiDateHeading = VERSION;
    customHeading.textContent = '10. august';
    list.append(customHeading, card);
  }

  function updateAllSummary() {
    const summary = document.getElementById('plan-summary');
    if (!summary || summary.dataset.runiCounted === VERSION) return;
    const match = summary.textContent.match(/(\d+)\s+opgaver?/i);
    if (!match) return;
    const oldNumber = Number(match[1]);
    summary.innerHTML = summary.innerHTML.replace(match[1], String(oldNumber + 1));
    summary.dataset.runiCounted = VERSION;
  }

  function updateScene4ATask() {
    document.querySelectorAll('.task-card').forEach(card => {
      const title = card.querySelector('.task-title')?.textContent || '';
      if (!/Film scene 4A|scene 4A under gadelyset/i.test(title)) return;
      const owner = card.querySelector('.task-chip.owner');
      if (owner && !owner.textContent.includes(PERSON_NAME)) owner.textContent += ` · ${PERSON_NAME}`;
      const copy = card.querySelector('.task-copy');
      if (copy && !copy.textContent.includes('Rúni Friis Kjær')) copy.append(' Rúni Friis Kjær har ansvar for lyssætningen.');
      card.dataset.runiLighting = VERSION;
    });

    document.querySelectorAll('.producer-location-card, .next-shoot-event').forEach(card => {
      if (!sceneIds(card).includes('4A')) return;
      const target = card.querySelector('.producer-location-comment') || card.querySelector('p');
      if (target && !target.textContent.includes('Rúni Friis Kjær')) {
        target.append(' Lys: Rúni Friis Kjær.');
      }
      card.dataset.runiLighting = VERSION;
    });
  }

  function syncSchedule() {
    const select = document.getElementById('task-person-filter');
    const list = document.getElementById('production-plan-list');
    if (!select || !list) return false;

    const bureauNote = document.querySelector('#schedule-main-column > .bureau-note');
    const selected = select.value;

    if (selected === PERSON_ID) {
      if (!list.querySelector('[data-runi-personal-view]')) {
        list.innerHTML = `<div data-runi-personal-view="${VERSION}"><div class="plan-date">10. august</div>${taskMarkup()}</div>`;
      }
      if (bureauNote) bureauNote.style.display = 'none';
      updateSummaryForRuni();
    } else {
      if (bureauNote) bureauNote.style.display = '';
      list.querySelector('[data-runi-personal-view]')?.remove();
      if (selected === 'all') {
        addTaskToAll(list);
        updateAllSummary();
      } else {
        list.querySelectorAll('[data-runi-light-task], [data-runi-date-heading]').forEach(node => node.remove());
      }
    }

    updateScene4ATask();
    return true;
  }

  function ensureTeamCard() {
    const groups = document.getElementById('team-groups');
    if (!groups) return false;

    const query = (document.getElementById('team-search')?.value || '').trim().toLocaleLowerCase('da-DK');
    const searchable = `${PERSON_NAME} lysmand rfk@friiframe.fo +298 218218`.toLocaleLowerCase('da-DK');
    const shouldShow = !query || searchable.includes(query);

    const existing = groups.querySelector('[data-runi-team-card]');
    if (!shouldShow) {
      existing?.remove();
      return true;
    }
    if (existing) return true;

    const group = [...groups.querySelectorAll('.team-group')]
      .find(section => /Filmhold og produktion/i.test(section.querySelector('.team-group-title')?.textContent || ''));
    if (!group) return false;

    const grid = group.querySelector('.team-card-grid');
    if (!grid) return false;

    const card = document.createElement('article');
    card.className = 'team-card';
    card.dataset.runiTeamCard = VERSION;
    card.innerHTML = `<div class="team-card-top"><div><div class="team-card-name">${PERSON_NAME}</div><div class="team-card-type">Lysmand</div></div><span class="team-status">Bekræftet</span></div>
      <p class="team-card-note">Ansvarlig for lys på scene 4A mandag den 10. august kl. 21:30 i Elduvík.</p>
      <div class="team-contact-list"><a href="mailto:rfk@friiframe.fo">✉ rfk@friiframe.fo</a><a href="tel:+298218218">☎ +298 218218</a></div>`;
    grid.appendChild(card);

    const count = group.querySelector('.team-group-count');
    if (count && count.dataset.runiCounted !== VERSION) {
      const match = count.textContent.match(/\d+/);
      if (match) count.textContent = `${Number(match[0]) + 1} personer`;
      count.dataset.runiCounted = VERSION;
    }
    return true;
  }

  function install() {
    const optionReady = ensurePersonOption();
    const scheduleReady = syncSchedule();
    const teamReady = ensureTeamCard();
    return optionReady && scheduleReady && teamReady;
  }

  document.addEventListener('input', event => {
    if (event.target?.id === 'team-search') window.setTimeout(ensureTeamCard, 0);
  }, true);

  if (install()) return;

  const observer = new MutationObserver(() => {
    ensurePersonOption();
    syncSchedule();
    ensureTeamCard();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 10000);
})();
