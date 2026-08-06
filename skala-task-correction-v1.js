(() => {
  'use strict';

  const VERSION = '2026-08-06-1208';

  function updateTaskCard(card, data) {
    const title = card.querySelector('.task-title');
    const time = card.querySelector('.task-time');
    const status = card.querySelector('.task-status');
    const type = card.querySelector('.task-chip:not(.owner)');
    const copy = card.querySelector('.task-copy');
    const done = card.querySelector('.task-done');

    if (title) title.textContent = data.title;
    if (time) time.textContent = data.time;
    if (status) status.textContent = data.status;
    if (type) type.textContent = data.type;
    if (copy) copy.innerHTML = `<b>Opgaven:</b> ${data.detail}`;
    if (done) done.innerHTML = `<b>Færdig når:</b> ${data.done}`;
    card.dataset.skalaTaskCorrection = VERSION;
  }

  function correctPersonalTasks() {
    document.querySelectorAll('.task-card').forEach(card => {
      const title = card.querySelector('.task-title')?.textContent.trim() || '';

      if (/^Spørg Airbnb-ejeren i Elduvík om filmtilladelse$/i.test(title)) {
        updateTaskCard(card, {
          title: 'Forbered optagelse i Skálabúðin',
          time: 'Mandag 17. august kl. 13:00',
          status: 'Planlagt',
          type: 'Location',
          detail: 'Filmtilladelsen til Skálabúðin er på plads. Bekræft adgang, mødetid, parkering, strøm, udstyr og de praktiske forhold. Sørg samtidig for, at cast, 1970’er-tøj, stylist, makeup og rekvisitter er klar til scenerne 1A, 2A, 2B, 2C, 15A og 16A.',
          done: 'Skálabúðin er produktionsklar, og alle relevante personer har modtaget den endelige information og call sheet til 17. august kl. 13:00.'
        });
      }

      if (/^Book stylist og makeupartist til Elduvík-scenerne$/i.test(title)) {
        updateTaskCard(card, {
          title: 'Book stylist og makeupartist til optagelsen i Skálabúðin',
          time: 'Skal være på plads før 17. august kl. 13:00',
          status: 'Ikke startet',
          type: 'Styling',
          detail: 'SANSIR-teamet og Elisabeth koordinerer stylist og makeupartist til et troværdigt 1970’er-look for dreng og mor i Skálabúðin. Drengens hår må ikke klippes før optagelsen.',
          done: 'Stylist og makeupartist er bekræftet, 1970’er-tøjet er valgt, og hår- og makeupplanen er godkendt til optagelsen den 17. august kl. 13:00.'
        });
      }

      const copy = card.querySelector('.task-copy');
      if (copy && /Elduvík-scenerne kræver et 1970’er-look/i.test(copy.textContent || '')) {
        copy.innerHTML = '<b>Opgaven:</b> Klargør tøj, makeup og rekvisitter pr. scene. Scenerne i Skálabúðin kræver et troværdigt 1970’er-look, og drengens hår må ikke klippes.';
        card.dataset.skalaTaskCorrection = VERSION;
      }
    });
  }

  function correctMilestones() {
    document.querySelectorAll('.milestone').forEach(card => {
      const title = card.querySelector('.milestone-title');
      if (!title || !/Elduvík · Airbnb-location/i.test(title.textContent || '')) return;

      title.textContent = 'Skálabúðin · indendørs optagelser';
      const text = card.querySelector('.milestone-text');
      if (text) text.textContent = 'Scener 1A, 2A, 2B, 2C, 15A og 16A filmes mandag 17. august kl. 13:00 i Skálabúðin, Tórshavn.';
      const date = card.previousElementSibling;
      if (date?.classList.contains('plan-date')) date.textContent = '17. august';
      card.dataset.skalaTaskCorrection = VERSION;
    });
  }

  function install() {
    correctPersonalTasks();
    correctMilestones();
    document.getElementById('panel-schedule')?.setAttribute('data-skala-task-correction', VERSION);
  }

  document.addEventListener('sev:portal-ready', () => window.setTimeout(install, 0));
  document.addEventListener('sev:v2-ready', () => window.setTimeout(install, 0));
  document.addEventListener('sev:frontpage-production-status-ready', () => window.setTimeout(install, 0));

  document.addEventListener('change', event => {
    if (event.target?.id === 'task-person-filter') window.setTimeout(install, 0);
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.setTimeout(install, 3000), { once: true });
  } else {
    window.setTimeout(install, 3000);
  }
})();