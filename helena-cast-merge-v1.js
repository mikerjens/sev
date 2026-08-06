(() => {
  'use strict';

  const VERSION = '2026-08-06-2056';
  const HELENA = 'Helena Heðinsdóttir Guttesen';
  const MOTHER_SCENES = new Set(['1A','2A','2B','2C','9A','9B','9C','12A','13A','15A','16A']);

  function sceneIds(text) {
    return new Set((String(text || '').match(/\b\d+[A-Z]\b/g) || []));
  }

  function hasMotherScene(element) {
    const ids = sceneIds(element?.textContent || '');
    return [...ids].some(id => MOTHER_SCENES.has(id));
  }

  function replaceMotherLabels(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const original = node.nodeValue || '';
      let next = original
        .replace(/\bDreng\s*,\s*mor\b/gi, `Dreng, ${HELENA} (mor)`)
        .replace(/\bMor\s*\/\s*skuespiller\b/gi, `${HELENA} · skuespiller · mor`)
        .replace(/^\s*Mor\s*$/i, HELENA);
      if (next !== original) node.nodeValue = next;
    });
  }

  function mergeTalentCard() {
    const groups = document.getElementById('team-groups');
    if (!groups) return;

    const group = [...groups.querySelectorAll('.team-group')].find(section =>
      /Talenter og skuespillere|Skuespillere og medvirkende/i.test(
        section.querySelector('.team-group-title')?.textContent || ''
      )
    );
    if (!group) return;

    const grid = group.querySelector('.team-card-grid');
    if (!grid) return;

    let helenaCard = [...grid.querySelectorAll('.team-card')].find(card =>
      /Helena Heðinsdóttir Guttesen/i.test(card.textContent || '')
    );

    const genericCards = [...grid.querySelectorAll('.team-card')].filter(card => {
      const name = card.querySelector('.team-card-name')?.textContent.trim() || '';
      return /^Mor$/i.test(name);
    });

    if (!helenaCard && genericCards[0]) {
      helenaCard = genericCards[0];
      helenaCard.dataset.teamMember = 'helena-hedinsdottir-guttesen';
    }

    genericCards.forEach(card => {
      if (card !== helenaCard) card.remove();
    });

    if (helenaCard) {
      const name = helenaCard.querySelector('.team-card-name');
      const type = helenaCard.querySelector('.team-card-type');
      const status = helenaCard.querySelector('.team-status');
      const note = helenaCard.querySelector('.team-card-note');
      const contacts = helenaCard.querySelector('.team-contact-list');
      if (name) name.textContent = HELENA;
      if (type) type.textContent = 'Skuespiller · mor';
      if (status) status.textContent = 'Bekræftet';
      if (note) note.textContent = 'Spiller mor i scenerne 1A, 2A/2B/2C, 9A/9B/9C, 12A, 13A, 15A og 16A.';
      if (contacts) contacts.innerHTML = '<a href="tel:+298274450">☎ +298 274450</a>';
      helenaCard.dataset.helenaMerged = VERSION;
    }

    const count = group.querySelector('.team-group-count');
    if (count) {
      const total = grid.querySelectorAll('.team-card').length;
      count.textContent = `${total} ${total === 1 ? 'person' : 'personer'}`;
    }
  }

  function updateSceneCasting() {
    document.querySelectorAll('.producer-location-card, .scene-card, .story-card, [data-scene], [data-scene-id]').forEach(card => {
      if (!hasMotherScene(card)) return;
      replaceMotherLabels(card);
      card.dataset.helenaCast = VERSION;
    });
  }

  function install() {
    mergeTalentCard();
    updateSceneCasting();
  }

  document.addEventListener('sev:portal-ready', () => window.setTimeout(install, 0));
  document.addEventListener('sev:v2-ready', () => window.setTimeout(install, 0));
  document.addEventListener('click', event => {
    if (event.target.closest('[data-tab="crew"], [data-scene], [data-scene-id], .scene-link')) {
      window.setTimeout(install, 80);
    }
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.setTimeout(install, 1200), { once: true });
  } else {
    window.setTimeout(install, 1200);
  }
})();