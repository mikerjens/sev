(() => {
  'use strict';

  const CARD_ID = 'runi-friis-kjaer';
  const PERSON = {
    name: 'Rúni Friis Kjær',
    role: 'Lysmand',
    email: 'rfk@friiframe.fo',
    phone: '+298 218218'
  };

  function searchMatches() {
    const query = (document.getElementById('team-search')?.value || '')
      .trim()
      .toLocaleLowerCase('da-DK');
    if (!query) return true;

    const searchable = `${PERSON.name} ${PERSON.role} ${PERSON.email} ${PERSON.phone}`
      .toLocaleLowerCase('da-DK');
    return searchable.includes(query);
  }

  function updateCount(group) {
    const grid = group.querySelector('.team-card-grid');
    const count = group.querySelector('.team-group-count');
    if (!grid || !count) return;
    const total = grid.querySelectorAll('.team-card').length;
    count.textContent = `${total} ${total === 1 ? 'person' : 'personer'}`;
  }

  function installRuni() {
    const groups = document.getElementById('team-groups');
    if (!groups) return false;

    const group = [...groups.querySelectorAll('.team-group')]
      .find(section => /Filmhold og produktion/i.test(
        section.querySelector('.team-group-title')?.textContent || ''
      ));
    if (!group) return false;

    const grid = group.querySelector('.team-card-grid');
    if (!grid) return false;

    const existing = grid.querySelector(`[data-team-member="${CARD_ID}"]`);
    if (!searchMatches()) {
      existing?.remove();
      updateCount(group);
      return true;
    }

    if (!existing) {
      const card = document.createElement('article');
      card.className = 'team-card';
      card.dataset.teamMember = CARD_ID;
      card.innerHTML = `
        <div class="team-card-top">
          <div>
            <div class="team-card-name">${PERSON.name}</div>
            <div class="team-card-type">${PERSON.role}</div>
          </div>
          <span class="team-status">Bekræftet</span>
        </div>
        <div class="team-contact-list">
          <a href="mailto:${PERSON.email}">✉ ${PERSON.email}</a>
          <a href="tel:+298218218">☎ ${PERSON.phone}</a>
        </div>`;
      grid.appendChild(card);
    }

    updateCount(group);
    return true;
  }

  document.addEventListener('sev:portal-ready', installRuni, { once: true });
  document.addEventListener('input', event => {
    if (event.target?.id === 'team-search') window.setTimeout(installRuni, 0);
  }, true);

  installRuni();
})();
