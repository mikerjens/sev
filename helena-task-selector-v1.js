(() => {
  'use strict';

  const VERSION = '2026-08-06-2105';
  const PERSON_ID = 'helena';
  const PERSON_NAME = 'Helena Heðinsdóttir Guttesen';
  const PERSON_ROLE = 'Skuespiller · mor';

  function ensureOption(select) {
    if (!select) return false;
    let option = select.querySelector(`option[value="${PERSON_ID}"]`);
    if (!option) {
      option = document.createElement('option');
      option.value = PERSON_ID;
      select.appendChild(option);
    }
    option.textContent = `${PERSON_NAME} · ${PERSON_ROLE}`;
    return true;
  }

  function showNoTasks() {
    const list = document.getElementById('production-plan-list');
    const summary = document.getElementById('plan-summary');
    if (!list || !summary) return false;

    summary.innerHTML = `<strong><span class="current-person">${PERSON_NAME}</span> · 0 opgaver</strong><span>${PERSON_ROLE} · ingen personlige opgaver registreret endnu.</span>`;
    list.innerHTML = `<article class="task-card" data-helena-no-tasks="${VERSION}">
      <div class="task-top">
        <div>
          <div class="task-title">Ingen personlige opgaver registreret endnu</div>
          <div class="task-time">Bekræftet som mor i SEV26-filmen</div>
        </div>
        <span class="task-status">Bekræftet</span>
      </div>
      <div class="task-meta">
        <span class="task-chip">Skuespiller</span>
        <span class="task-chip owner">${PERSON_NAME}</span>
      </div>
      <div class="task-copy"><b>Status:</b> Helena er registreret som skuespilleren, der spiller mor. Der er endnu ikke tildelt en særskilt personlig opgave.</div>
    </article>`;

    const bureauNote = document.querySelector('#schedule-main-column > .bureau-note');
    if (bureauNote) bureauNote.style.display = 'none';
    return true;
  }

  function syncSelectors() {
    const source = document.getElementById('task-person-filter');
    const myTasks = document.getElementById('my-tasks-person-filter');
    ensureOption(source);
    ensureOption(myTasks);

    if (source && !source.dataset.helenaSelectorListener) {
      source.dataset.helenaSelectorListener = VERSION;
      source.addEventListener('change', () => {
        if (source.value !== PERSON_ID) return;
        try { localStorage.setItem('sev-task-person', PERSON_ID); } catch (_) {}
        window.setTimeout(showNoTasks, 80);
        window.setTimeout(showNoTasks, 480);
      });
    }

    let saved = '';
    try { saved = localStorage.getItem('sev-task-person') || ''; } catch (_) {}
    if (source && (source.value === PERSON_ID || saved === PERSON_ID)) {
      source.value = PERSON_ID;
      if (myTasks) myTasks.value = PERSON_ID;
      window.setTimeout(showNoTasks, 100);
    }
  }

  function install() {
    syncSelectors();
  }

  document.addEventListener('sev:portal-ready', () => window.setTimeout(install, 0));
  document.addEventListener('sev:v2-ready', () => window.setTimeout(install, 0));
  document.addEventListener('change', event => {
    if (event.target?.id === 'my-tasks-person-filter' && event.target.value === PERSON_ID) {
      window.setTimeout(showNoTasks, 240);
      window.setTimeout(showNoTasks, 520);
    }
  }, true);

  install();
  window.setTimeout(install, 900);
  window.setTimeout(install, 2300);
})();