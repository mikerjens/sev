(() => {
  'use strict';

  const VERSION = '2026-08-05-1832';
  const INDOOR_SCENES = ['1A', '2A', '2B', '2C', '15A', '16A'];

  function replaceText(root, from, to) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.parentElement?.closest('script,style')) return;
      if (node.nodeValue.includes(from)) node.nodeValue = node.nodeValue.split(from).join(to);
    });
  }

  function containsIndoorScenes(card) {
    const text = card.querySelector('.next-shoot-scenes, .producer-scenes')?.textContent || card.textContent || '';
    return INDOOR_SCENES.some(scene => text.includes(scene)) && !text.includes('4A');
  }

  function updateScene4A(schedule, nextScenes) {
    [schedule, nextScenes].forEach(root => {
      replaceText(root, 'Bygd og præcis location afventer', 'Elduvík · præcis placering ved gadelyset afklares');
      replaceText(root, 'Thomas fastlægger bygd og præcis location.', 'Scene 4A filmes i Elduvík. Den præcise placering ved gadelyset afklares.');
      replaceText(root, 'Præcis bygd og location fastlægges af Thomas.', 'Elduvík er valgt. Den præcise placering ved gadelyset afklares.');
      replaceText(root, 'Gadelys-location', 'Elduvík · gadelys-location');
    });

    document.querySelectorAll('.next-shoot-event').forEach(card => {
      const scenes = card.querySelector('.next-shoot-scenes')?.textContent || '';
      if (!scenes.includes('4A')) return;
      const location = card.querySelector('p');
      if (location) location.textContent = 'Elduvík · præcis placering ved gadelyset afklares';
      card.dataset.locationVersion = VERSION;
    });

    document.querySelectorAll('.producer-location-card').forEach(card => {
      const scenes = card.querySelector('.producer-scenes')?.textContent || card.textContent;
      if (!scenes.includes('4A')) return;
      const title = card.querySelector('.producer-location-title');
      const comment = card.querySelector('.producer-location-comment');
      if (title) title.textContent = 'Elduvík · gadelys-location';
      if (comment) comment.textContent = 'Scene 4A filmes i Elduvík. Den præcise placering ved gadelyset afklares. Elisabeth samler børnenes og forældrenes navne, telefonnumre og e-mailadresser.';
      card.dataset.locationVersion = VERSION;
    });
  }

  function updateIndoorLocation(schedule, nextScenes) {
    [schedule, nextScenes].forEach(root => {
      replaceText(root, 'Elduvík · Airbnb-location', 'Elduvík / Skálabúðin · indendørs location');
      replaceText(
        root,
        'Scener 1A, 2A, 2B, 2C, 15A og 16A afventer ejerens tilladelse.',
        'Scener 1A, 2A, 2B, 2C, 15A og 16A kan filmes i Airbnb i Elduvík eller Skálabúðin í Tórshavn. Forespørgsel til Skálabúðin er sendt.'
      );
      replaceText(root, 'Spørg Airbnb-ejeren i Elduvík om filmtilladelse', 'Følg op på indendørs location: Elduvík eller Skálabúðin');
    });

    document.querySelectorAll('.next-shoot-event').forEach(card => {
      if (!containsIndoorScenes(card)) return;
      const title = card.querySelector('h4');
      const location = card.querySelector('p');
      const badge = card.querySelector('.next-shoot-date b');
      if (title) title.textContent = 'Elduvík eller Skálabúðin í Tórshavn';
      if (location) location.textContent = 'Skálabúðin: forespørgsel sendt til ejeren og svar afventes. Airbnb i Elduvík er fortsat en mulighed. 1970’er-tøj, stylist og makeup koordineres.';
      if (badge) badge.textContent = 'SVAR AFVENTER';
      card.dataset.locationVersion = VERSION;
    });

    document.querySelectorAll('.producer-location-card').forEach(card => {
      if (!containsIndoorScenes(card)) return;
      const title = card.querySelector('.producer-location-title');
      const status = card.querySelector('.producer-location-status');
      const comment = card.querySelector('.producer-location-comment');
      if (title) title.textContent = 'Airbnb i Elduvík eller Skálabúðin í Tórshavn';
      if (status) status.textContent = 'Afventer svar fra location-ejere · 1970’er styling';
      if (comment) comment.textContent = 'Airbnb i Elduvík er én mulighed. Forespørgsel er sendt til ejeren af Skálabúðin í Tórshavn som alternativ location, og svar afventes. Optagedatoen fastsættes, når en location er godkendt.';
      card.dataset.locationVersion = VERSION;
    });

    document.querySelectorAll('.task-card').forEach(card => {
      const title = card.querySelector('.task-title');
      if (!title || !title.textContent.includes('indendørs location: Elduvík eller Skálabúðin')) return;
      const status = card.querySelector('.task-status');
      const copy = card.querySelector('.task-copy');
      const done = card.querySelector('.task-done');
      if (status) status.textContent = 'Afventer svar';
      if (copy) copy.innerHTML = '<b>Opgaven:</b> Følg op på forespørgslen til ejeren af Skálabúðin í Tórshavn, og behold Airbnb i Elduvík som alternativ. Afklar filmtilladelse, adgang, mulige tidspunkter, parkering, strøm, udstyr og eventuelle vilkår.';
      if (done) done.innerHTML = '<b>Færdig når:</b> En af de to locations er godkendt, og de praktiske vilkår er dokumenteret.';
      card.dataset.locationVersion = VERSION;
    });

    document.querySelectorAll('.milestone').forEach(card => {
      const title = card.querySelector('.milestone-title');
      if (!title || !title.textContent.includes('Elduvík / Skálabúðin')) return;
      const text = card.querySelector('.milestone-text');
      if (text) text.textContent = 'Scener 1A, 2A, 2B, 2C, 15A og 16A kan filmes i Airbnb i Elduvík eller Skálabúðin í Tórshavn. Forespørgsel til ejeren af Skálabúðin er sendt.';
      card.dataset.locationVersion = VERSION;
    });
  }

  function updateLocations() {
    const schedule = document.getElementById('panel-schedule');
    const nextScenes = document.getElementById('panel-next-scenes');
    if (!schedule || !nextScenes) return false;

    updateScene4A(schedule, nextScenes);
    updateIndoorLocation(schedule, nextScenes);
    return true;
  }

  if (updateLocations()) return;

  const observer = new MutationObserver(() => {
    if (!updateLocations()) return;
    observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 6000);
})();
