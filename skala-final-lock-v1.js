(() => {
  'use strict';

  const VERSION = '2026-08-05-2010';
  const INDOOR_SCENES = ['1A', '2A', '2B', '2C', '15A', '16A'];

  function sceneIds(element) {
    if (!element) return [];
    const linkedIds = [...element.querySelectorAll('[data-scene-link]')]
      .map(link => link.dataset.sceneLink)
      .filter(Boolean);
    if (linkedIds.length) return [...new Set(linkedIds)];
    return [...new Set((element.textContent || '').match(/\b\d+[A-Z]\b/g) || [])];
  }

  function isIndoorSceneSet(element) {
    const ids = sceneIds(element);
    return INDOOR_SCENES.every(sceneId => ids.includes(sceneId)) && !ids.includes('4A') && !ids.includes('11A');
  }

  function findShootCard(sceneContainer) {
    return sceneContainer.closest('.next-shoot-event, .next-shoot-item, .shoot-event, article')
      || sceneContainer.parentElement?.parentElement
      || null;
  }

  function updateShootCards() {
    let changed = 0;

    document.querySelectorAll('.next-shoot-scenes, .producer-scenes').forEach(sceneContainer => {
      if (!isIndoorSceneSet(sceneContainer)) return;
      const card = findShootCard(sceneContainer);
      if (!card || card.dataset.skalaFinalLock === VERSION) return;

      if (card.classList.contains('producer-location-card')) {
        const title = card.querySelector('.producer-location-title');
        const status = card.querySelector('.producer-location-status');
        const comment = card.querySelector('.producer-location-comment');
        if (title) title.textContent = 'Skálabúðin, Tórshavn';
        if (status) status.textContent = 'Planlagt · 17. august kl. 13:00 · 1970’er styling';
        if (comment) comment.textContent = 'Location er låst. Optagelsen gennemføres mandag den 17. august kl. 13:00 i Skálabúðin, Tórshavn.';
      } else {
        const date = card.querySelector('.next-shoot-date');
        let dateText = date?.querySelector('span');
        let badge = date?.querySelector('b');
        if (date && !dateText) {
          dateText = document.createElement('span');
          date.prepend(dateText);
        }
        if (date && !badge) {
          badge = document.createElement('b');
          date.appendChild(badge);
        }
        if (dateText) dateText.textContent = 'Man. 17. aug.';
        if (badge) badge.textContent = 'PLANLAGT';

        let time = card.querySelector('.next-shoot-time');
        if (!time && date) {
          time = document.createElement('div');
          time.className = 'next-shoot-time';
          date.insertAdjacentElement('afterend', time);
        }
        if (time) time.textContent = '● 13:00';

        const title = card.querySelector('h4');
        const description = card.querySelector('p');
        if (title) title.textContent = 'Skálabúðin, Tórshavn';
        if (description) description.textContent = 'Optagelsen er låst til 17. august kl. 13:00. Dreng og mor styles i 1970’er-tøj. SANSIR-teamet og Elisabeth koordinerer stylist og makeupartist. Drengens hår må ikke klippes.';
        card.classList.remove('next-shoot-pending');
        card.classList.add('next-shoot-scheduled');
      }

      card.dataset.skalaFinalLock = VERSION;
      changed += 1;
    });

    return changed;
  }

  function updateStylingTasks() {
    let changed = 0;

    document.querySelectorAll('.task-card').forEach(card => {
      const title = card.querySelector('.task-title');
      if (!title) return;
      const text = title.textContent.trim();
      const isStylingTask = /stylist|makeupartist/i.test(text) && /Elduvík|Skálabúðin/i.test(text);
      if (!isStylingTask || card.dataset.skalaStylingLock === VERSION) return;

      title.textContent = 'Book stylist og makeupartist til optagelsen i Skálabúðin';
      const time = card.querySelector('.task-time');
      const copy = card.querySelector('.task-copy');
      const done = card.querySelector('.task-done');
      if (time) time.textContent = 'Skal være på plads før 17. august kl. 13:00';
      if (copy) copy.innerHTML = '<b>Opgaven:</b> SANSIR-teamet og Elisabeth koordinerer stylist og makeupartist til et troværdigt 1970’er-look for dreng og mor i Skálabúðin. Drengens hår må ikke klippes før optagelsen.';
      if (done) done.innerHTML = '<b>Færdig når:</b> Stylist og makeupartist er bekræftet, 1970’er-tøjet er valgt, og hår- og makeupplanen er godkendt til optagelsen den 17. august kl. 13:00.';
      card.dataset.skalaStylingLock = VERSION;
      changed += 1;
    });

    return changed;
  }

  function updateCalendarDay() {
    document.querySelectorAll('.mini-cal-day').forEach(day => {
      if (day.querySelector('b')?.textContent.trim() !== '17') return;
      day.classList.add('has-shoot');
      day.setAttribute('aria-label', '17. august. Optagelse i Skálabúðin, Tórshavn kl. 13:00.');
      if (!day.querySelector('i')) day.appendChild(document.createElement('i'));
    });
  }

  function applyFinalLock() {
    const shootChanges = updateShootCards();
    const taskChanges = updateStylingTasks();
    updateCalendarDay();
    return shootChanges > 0 && taskChanges > 0;
  }

  if (applyFinalLock()) return;

  const observer = new MutationObserver(() => {
    if (!applyFinalLock()) return;
    observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => {
    applyFinalLock();
    observer.disconnect();
  }, 8000);
})();
