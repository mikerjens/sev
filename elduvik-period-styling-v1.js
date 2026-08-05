(() => {
  const VERSION = '2026-08-05-1736';
  const TASK_ID = 'task-elduvik-period-styling';
  const DATE_ID = 'task-elduvik-period-styling-date';
  const NOTE_CLASS = 'elduvik-period-styling-note';
  const SCENES = '1A · 2A · 2B · 2C · 15A · 16A';

  function addStyles() {
    if (document.getElementById('elduvik-period-styling-styles')) return;
    const style = document.createElement('style');
    style.id = 'elduvik-period-styling-styles';
    style.textContent = `
      .${NOTE_CLASS}{margin-top:12px;padding:12px 13px;background:rgba(246,176,66,.08);border:1px solid rgba(246,176,66,.35);border-left:4px solid var(--signal);border-radius:7px;font-size:12px;line-height:1.5}
      .${NOTE_CLASS} strong{display:block;margin-bottom:5px;color:var(--signal);font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:.06em;text-transform:uppercase}
      .${NOTE_CLASS} b{color:var(--text)}
    `;
    document.head.appendChild(style);
  }

  function taskMarkup() {
    return `
      <div class="plan-date" id="${DATE_ID}" data-version="${VERSION}">Før Elduvík-optagelsen · dato afventer</div>
      <article class="task-card high" id="${TASK_ID}" data-version="${VERSION}" data-person-id="elisabeth">
        <div class="task-top">
          <div>
            <div class="task-title">Skaff stylist og makeupartist til Elduvík-scenerne</div>
            <div class="task-time">Skal være aftalt, før optagedatoen for ${SCENES} fastsættes</div>
          </div>
          <span class="task-status">Ikke startet</span>
        </div>
        <div class="task-meta">
          <span class="task-chip">${SCENES}</span>
          <span class="task-chip">1970'er-look</span>
          <span class="task-chip">Høj prioritet</span>
          <span class="task-chip owner">Elisabeth Vitalis Tausen</span>
        </div>
        <div class="task-copy"><b>Opgave:</b> SANSIR-teamet og Elisabeth skal finde og booke en stylist samt en makeupartist, som kan skabe et troværdigt 1970'er-look til sønnen og moren. Kostumer, styling og makeup koordineres af SANSIR-teamet og Elisabeth.</div>
        <div class="task-done"><b>Vigtig hårinstruks fra Thomas Koba:</b> Drengens hår må ikke klippes før optagelsen. Stylisten skal arbejde med hans nuværende hårlængde.</div>
        <div class="task-done"><b>Færdig når:</b> Stylist og makeupartist er bekræftet, 1970'er-tøjet til dreng og mor er valgt, og hår- og makeupplanen er godkendt.</div>
      </article>`;
  }

  function ensureTask() {
    const list = document.getElementById('production-plan-list');
    if (!list) return false;
    const existing = document.getElementById(TASK_ID);
    if (existing?.dataset.version === VERSION && document.getElementById(DATE_ID)) return true;
    document.getElementById(DATE_ID)?.remove();
    existing?.remove();
    list.insertAdjacentHTML('afterbegin', taskMarkup());
    return true;
  }

  function noteMarkup() {
    return `
      <div class="${NOTE_CLASS}" data-version="${VERSION}">
        <strong>Kostume · hår · stylist · makeup</strong>
        <b>Dreng og mor skal fremstå som i 1970'erne.</b> Begge skal have tidssvarende tøj, styling og makeup, fordi handlingen foregår for mange år siden.<br>
        <b>Drengens hår må ikke klippes før optagelsen</b> – instruks fra Thomas Koba.<br>
        SANSIR-teamet og Elisabeth koordinerer stylist og makeupartist.
      </div>`;
  }

  function ensureSceneNote() {
    let updated = false;
    document.querySelectorAll('.producer-location-card').forEach(card => {
      const title = card.querySelector('.producer-location-title')?.textContent || '';
      if (!title.includes('Elduvík') && !title.includes('Drengens værelse')) return;

      const status = card.querySelector('.producer-location-status');
      const statusText = 'Afventer ejer · 1970\'er styling';
      if (status && status.textContent !== statusText) status.textContent = statusText;

      let note = card.querySelector(`.${NOTE_CLASS}`);
      if (!note || note.dataset.version !== VERSION) {
        note?.remove();
        card.insertAdjacentHTML('beforeend', noteMarkup());
      }
      updated = true;
    });
    return updated;
  }

  function ensureCalendarNote() {
    const card = document.getElementById('room-scenes-pending');
    if (!card) return false;
    let note = card.querySelector(`.${NOTE_CLASS}`);
    if (!note || note.dataset.version !== VERSION) {
      note?.remove();
      card.insertAdjacentHTML('beforeend', noteMarkup());
    }
    return true;
  }

  function install() {
    addStyles();
    const a = ensureTask();
    const b = ensureSceneNote();
    const c = ensureCalendarNote();
    return a && b && c;
  }

  install();
  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    if (install() || attempts >= 100) window.clearInterval(timer);
  }, 100);
  window.addEventListener('load', install, { once: true });
})();
