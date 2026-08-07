(() => {
  'use strict';

  const VERSION = '2026-08-07-1042';
  const PRODUCER = 'Producer';
  const SANSIR_STATUS = 'Afventer Sansir';

  function updateTaskCards() {
    document.querySelectorAll('.task-card').forEach(card => {
      const title = card.querySelector('.task-title')?.textContent.trim() || '';
      const time = card.querySelector('.task-time');
      const status = card.querySelector('.task-status');
      const owner = card.querySelector('.task-chip.owner');
      const copy = card.querySelector('.task-copy');
      const done = card.querySelector('.task-done');

      if (/^(Find børn og forældrekontakter til scene 4A|Find tre børn til scene 4A|Modtag navne og kontaktinfo på 3 børn til scene 4A)$/i.test(title)) {
        const titleEl = card.querySelector('.task-title');
        if (titleEl) titleEl.textContent = 'Modtag navne og kontaktinfo på 3 børn til scene 4A';
        if (time) time.textContent = 'Sansir har fundet 3 børn · afventer navn og kontaktinfo';
        if (status) status.textContent = SANSIR_STATUS;
        if (owner) owner.textContent = `Ansvar: ${PRODUCER}`;
        if (copy) copy.innerHTML = '<b>Opgaven:</b> Sansir har fundet tre børn til scene 4A. Navne på børnene samt navn, telefonnummer og e-mail på deres forældre skal sendes til producer.';
        if (done) done.innerHTML = '<b>Færdig når:</b> Producer har modtaget navne og komplette kontaktoplysninger på alle tre børn og deres forældre.';
        card.dataset.scene4aCastingStatus = VERSION;
      }

      if (/^(Få kontrakter og forældretilladelser på plads|Få aftaler med forældrene til scene 4A på plads)$/i.test(title)) {
        if (time) time.textContent = 'Afventer kontaktinfo fra Sansir · senest før optagelsen';
        if (status) status.textContent = SANSIR_STATUS;
        if (copy) copy.innerHTML = '<b>Opgaven:</b> Når producer har modtaget kontaktoplysningerne fra Sansir, skal aftaler, releases og forældretilladelser på plads før optagelsen.';
        card.dataset.scene4aCastingStatus = VERSION;
      }

      if (/^Film scene 4A under gadelyset$/i.test(title)) {
        if (copy) copy.innerHTML = '<b>Opgaven:</b> Film de tre børn under gadelyset i Elduvík. Sansir har fundet de tre børn. Producer afventer navne og kontaktoplysninger på børnene og deres forældre. Heidi Mortensen afstemmer derefter børnenes tøj med familierne og skaffer en fodbold. Rúni Friis Kjær planlægger, medbringer, opsætter og betjener lyset.';
        card.dataset.scene4aCastingStatus = VERSION;
      }
    });
  }

  function updatePriorityRows() {
    document.querySelectorAll('.v2-task-row').forEach(row => {
      const title = row.querySelector('strong')?.textContent.trim() || '';
      const titleEl = row.querySelector('strong');
      const time = row.querySelector('.v2-task-main span');
      const owner = row.querySelector('.v2-owner');
      const status = row.querySelector('.v2-task-status');

      if (/^(Find børn og forældrekontakter til scene 4A|Find tre børn til scene 4A|Modtag navne og kontaktinfo på 3 børn til scene 4A)$/i.test(title)) {
        if (titleEl) titleEl.textContent = 'Modtag navne og kontaktinfo på 3 børn til scene 4A';
        if (time) time.textContent = 'Sansir har fundet 3 børn · afventer navn og kontaktinfo';
        if (owner) owner.textContent = PRODUCER;
        if (status) status.textContent = SANSIR_STATUS;
        row.dataset.scene4aCastingStatus = VERSION;
      }

      if (/^Afstem børnenes tøj og skaf en fodbold til scene 4A$/i.test(title)) {
        if (time) time.textContent = 'Afventer navne og kontaktinfo fra Sansir';
        if (status) status.textContent = SANSIR_STATUS;
        row.dataset.scene4aCastingStatus = VERSION;
      }
    });
  }

  function updateSceneStatus() {
    document.querySelectorAll('.producer-location-card').forEach(card => {
      const scenes = card.querySelector('.producer-scenes')?.textContent || card.textContent || '';
      if (!/\b4A\b/.test(scenes)) return;
      const comment = card.querySelector('.producer-location-comment, .producer-comment');
      if (comment) comment.textContent = 'Sansir har fundet 3 børn til scene 4A. Producer afventer navne og kontaktoplysninger på børnene og deres forældre. Heidi Mortensen afstemmer derefter børnenes tøj med familierne og skaffer en fodbold. Rúni Friis Kjær ordner lyset til scene 4A.';
      card.dataset.scene4aCastingStatus = VERSION;
    });
  }

  function install() {
    updateTaskCards();
    updatePriorityRows();
    updateSceneStatus();
  }

  ['sev:portal-ready', 'sev:v2-ready', 'sev:frontpage-production-status-ready'].forEach(name => {
    document.addEventListener(name, () => window.setTimeout(install, 60));
  });

  document.addEventListener('change', event => {
    if (event.target?.id === 'task-person-filter') window.setTimeout(install, 80);
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.setTimeout(install, 3300);
      window.setTimeout(install, 4300);
    }, { once: true });
  } else {
    window.setTimeout(install, 3300);
    window.setTimeout(install, 4300);
  }
})();