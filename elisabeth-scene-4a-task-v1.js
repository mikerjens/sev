(() => {
  const VERSION = '2026-08-05-1605';
  const TASK_ID = 'task-scene-4a-elisabeth';
  const DATE_ID = 'task-scene-4a-elisabeth-date';

  function taskMarkup() {
    return `
      <div class="plan-date" id="${DATE_ID}" data-version="${VERSION}">Før optagelsen · 10. august</div>
      <article class="task-card high" id="${TASK_ID}" data-version="${VERSION}" data-person-id="elisabeth">
        <div class="task-top">
          <div>
            <div class="task-title">Find børn og forældrekontakter til scene 4A</div>
            <div class="task-time">Senest før optagelsen mandag 10. august kl. 21:30</div>
          </div>
          <span class="task-status">Ikke startet</span>
        </div>
        <div class="task-meta">
          <span class="task-chip">Scene 4A</span>
          <span class="task-chip">Casting</span>
          <span class="task-chip">Høj prioritet</span>
          <span class="task-chip owner">Elisabeth Vitalis Tausen</span>
        </div>
        <div class="task-copy"><b>Opgave:</b> Find navnene på de tre børn, der skal medvirke i scene 4A. Registrér også navnene på hvert barns forældre samt deres telefonnummer og e-mailadresse.</div>
        <div class="task-done"><b>Færdig når:</b> Der foreligger en komplet kontaktliste for alle tre børn og deres forældre, så forældretilladelser og praktisk koordinering kan gennemføres før optagelsen.</div>
      </article>
    `;
  }

  function install() {
    const list = document.getElementById('production-plan-list');
    if (!list) return false;

    const existing = document.getElementById(TASK_ID);
    if (existing?.dataset.version === VERSION) return true;
    document.getElementById(DATE_ID)?.remove();
    existing?.remove();

    list.insertAdjacentHTML('afterbegin', taskMarkup());

    const select = document.getElementById('task-person-filter');
    if (select) {
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    return true;
  }

  install();
  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    install();
    if (attempts >= 100) window.clearInterval(timer);
  }, 100);
  window.addEventListener('load', install, { once: true });
})();
