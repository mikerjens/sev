(() => {
  'use strict';

  const VERSION = '2026-08-05-1957';
  const INDOOR_SCENES = ['1A', '2A', '2B', '2C', '15A', '16A'];

  function sceneIds(card) {
    const source = card.querySelector('.next-shoot-scenes, .producer-scenes')?.textContent || card.textContent || '';
    return source.match(/\b\d+[A-Z]\b/g) || [];
  }

  function hasScene(card, sceneId) {
    return sceneIds(card).includes(sceneId);
  }

  function containsIndoorScenes(card) {
    const ids = sceneIds(card);
    return ids.some(sceneId => INDOOR_SCENES.includes(sceneId)) && !ids.includes('4A') && !ids.includes('11A');
  }

  function replaceText(root, from, to) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.parentElement?.closest('script,style,a,button')) return;
      if (node.nodeValue.includes(from)) node.nodeValue = node.nodeValue.split(from).join(to);
    });
  }

  function updateScene4A() {
    document.querySelectorAll('.next-shoot-event').forEach(card => {
      if (!hasScene(card, '4A')) return;
      const location = card.querySelector('p');
      if (location) location.textContent = 'Elduvík · præcis placering ved gadelyset afklares';
      card.dataset.locationVersion = VERSION;
    });

    document.querySelectorAll('.producer-location-card').forEach(card => {
      if (!hasScene(card, '4A')) return;
      const title = card.querySelector('.producer-location-title');
      const comment = card.querySelector('.producer-location-comment');
      if (title) title.textContent = 'Elduvík · gadelys-location';
      if (comment) comment.textContent = 'Scene 4A filmes i Elduvík. Den præcise placering ved gadelyset afklares. Elisabeth samler børnenes og forældrenes navne, telefonnumre og e-mailadresser.';
      card.dataset.locationVersion = VERSION;
    });
  }

  function updateIndoorShoot() {
    document.querySelectorAll('.next-shoot-event').forEach(card => {
      if (!containsIndoorScenes(card)) return;

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
      if (!time) {
        time = document.createElement('div');
        time.className = 'next-shoot-time';
        date?.insertAdjacentElement('afterend', time);
      }
      time.textContent = '● 13:00';

      const title = card.querySelector('h4');
      const location = card.querySelector('p');
      if (title) title.textContent = 'Skálabúðin, Tórshavn';
      if (location) location.textContent = 'Scener 1A, 2A, 2B, 2C, 15A og 16A filmes 17. august kl. 13:00. Dreng og mor styles i 1970’er-tøj. Stylist og makeup koordineres af SANSIR-teamet og Elisabeth. Drengens hår må ikke klippes.';
      card.classList.remove('next-shoot-pending');
      card.dataset.locationVersion = VERSION;
    });

    document.querySelectorAll('.mini-cal-day').forEach(day => {
      if (day.querySelector('b')?.textContent.trim() !== '17') return;
      day.classList.add('has-shoot');
      day.setAttribute('aria-label', '17. august. Scener 1A, 2A, 2B, 2C, 15A og 16A. Skálabúðin, Tórshavn kl. 13:00.');
      if (!day.querySelector('i')) day.appendChild(document.createElement('i'));
    });

    document.querySelectorAll('.producer-location-card').forEach(card => {
      if (!containsIndoorScenes(card)) return;
      const title = card.querySelector('.producer-location-title');
      const status = card.querySelector('.producer-location-status');
      const comment = card.querySelector('.producer-location-comment');
      if (title) title.textContent = 'Skálabúðin, Tórshavn';
      if (status) status.textContent = 'Planlagt · 17. august kl. 13:00 · 1970’er styling';
      if (comment) comment.textContent = 'Location er låst til Skálabúðin, Tórshavn. Scener 1A, 2A, 2B, 2C, 15A og 16A filmes mandag 17. august kl. 13:00.';
      card.dataset.locationVersion = VERSION;
    });

    document.querySelectorAll('.task-card').forEach(card => {
      const title = card.querySelector('.task-title');
      if (!title) return;
      const text = title.textContent;
      if (!text.includes('Airbnb-ejeren') && !text.includes('indendørs location') && !text.includes('Skálabúðin')) return;
      title.textContent = 'Forbered optagelse i Skálabúðin';
      const time = card.querySelector('.task-time');
      const status = card.querySelector('.task-status');
      const copy = card.querySelector('.task-copy');
      const done = card.querySelector('.task-done');
      if (time) time.textContent = '17. august kl. 13:00';
      if (status) status.textContent = 'Planlagt';
      if (copy) copy.innerHTML = '<b>Opgaven:</b> Bekræft adgang, mødetid, parkering, strøm, udstyr og praktiske vilkår med ejeren af Skálabúðin. Sørg for, at cast, 1970’er-tøj, stylist, makeup og rekvisitter er klar.';
      if (done) done.innerHTML = '<b>Færdig når:</b> Skálabúðin er produktionsklar, og alle relevante personer har modtaget call sheet til 17. august kl. 13:00.';
      card.dataset.locationVersion = VERSION;
    });

    document.querySelectorAll('.milestone').forEach(card => {
      const title = card.querySelector('.milestone-title');
      if (!title) return;
      if (!/Elduvík|Skálabúðin|Airbnb/.test(title.textContent)) return;
      title.textContent = 'Skálabúðin · indendørs optagelser';
      const text = card.querySelector('.milestone-text');
      if (text) text.textContent = 'Scener 1A, 2A, 2B, 2C, 15A og 16A filmes 17. august kl. 13:00 i Skálabúðin, Tórshavn.';
      const date = card.previousElementSibling;
      if (date?.classList.contains('plan-date')) date.textContent = '17. august';
      card.dataset.locationVersion = VERSION;
    });

    document.querySelectorAll('#panel-schedule, #panel-next-scenes').forEach(root => {
      replaceText(root, 'Elduvík eller Skálabúðin í Tórshavn', 'Skálabúðin, Tórshavn');
      replaceText(root, 'Elduvík / Skálabúðin · indendørs location', 'Skálabúðin · indendørs location');
      replaceText(root, 'Afventer svar fra location-ejere', 'Planlagt · 17. august kl. 13:00');
      replaceText(root, 'SVAR AFVENTER', 'PLANLAGT');
    });
  }

  function restoreScene11A() {
    document.querySelectorAll('.next-shoot-event').forEach(card => {
      if (!hasScene(card, '11A')) return;
      const title = card.querySelector('h4');
      const location = card.querySelector('p');
      const badge = card.querySelector('.next-shoot-date b');
      const time = card.querySelector('.next-shoot-time');
      if (title) title.textContent = 'Aktiv jordvarmeboring';
      if (location) location.textContent = 'Streymoy · afventer Jarðhitis borehold';
      if (badge) badge.textContent = 'DATO AFVENTER';
      if (time) time.remove();
      card.classList.add('next-shoot-pending');
      card.dataset.locationVersion = VERSION;
    });

    document.querySelectorAll('.producer-location-card').forEach(card => {
      if (!hasScene(card, '11A')) return;
      const title = card.querySelector('.producer-location-title');
      const status = card.querySelector('.producer-location-status');
      const comment = card.querySelector('.producer-location-comment');
      if (title) title.textContent = 'Jarðhiti';
      if (status) status.textContent = 'Afventer borehold';
      if (comment) comment.textContent = 'Scene 11A er en aktiv jordvarmeboring. Den filmes, når boreholdet kommer tilbage til Streymoy fra Suðuroy.';
      card.dataset.locationVersion = VERSION;
    });
  }

  function updatePortal() {
    const schedule = document.getElementById('panel-schedule');
    const nextScenes = document.getElementById('panel-next-scenes');
    if (!schedule || !nextScenes) return false;
    updateScene4A();
    updateIndoorShoot();
    restoreScene11A();
    return true;
  }

  if (updatePortal()) return;

  const observer = new MutationObserver(() => {
    if (!updatePortal()) return;
    observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 6000);
})();
