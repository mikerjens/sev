(() => {
  'use strict';

  const VERSION = '2026-08-06-1225';
  const MEMBER = {
    id: 'heidi-mortensen',
    name: 'Heidi Mortensen',
    role: 'Stylist',
    email: 'heidi@atlanta.fo',
    phone: '+298 790050'
  };

  function searchMatches() {
    const query = (document.getElementById('team-search')?.value || '')
      .trim()
      .toLocaleLowerCase('da-DK');
    if (!query) return true;

    return `${MEMBER.name} ${MEMBER.role} ${MEMBER.email} ${MEMBER.phone}`
      .toLocaleLowerCase('da-DK')
      .includes(query);
  }

  function updateTeamCount(group) {
    const grid = group.querySelector('.team-card-grid');
    const count = group.querySelector('.team-group-count');
    if (!grid || !count) return;
    const total = grid.querySelectorAll('.team-card').length;
    count.textContent = `${total} ${total === 1 ? 'person' : 'personer'}`;
  }

  function installTeamCard() {
    const groups = document.getElementById('team-groups');
    if (!groups) return false;

    const group = [...groups.querySelectorAll('.team-group')]
      .find(section => /Filmhold og produktion/i.test(
        section.querySelector('.team-group-title')?.textContent || ''
      ));
    if (!group) return false;

    const grid = group.querySelector('.team-card-grid');
    if (!grid) return false;

    const selector = `[data-team-member="${MEMBER.id}"]`;
    const existing = grid.querySelector(selector);

    if (!searchMatches()) {
      existing?.remove();
      updateTeamCount(group);
      return true;
    }

    if (!existing) {
      const card = document.createElement('article');
      card.className = 'team-card';
      card.dataset.teamMember = MEMBER.id;
      card.innerHTML = `
        <div class="team-card-top">
          <div>
            <div class="team-card-name">${MEMBER.name}</div>
            <div class="team-card-type">${MEMBER.role}</div>
          </div>
          <span class="team-status">Bekræftet</span>
        </div>
        <p class="team-card-note">Stylist på SEV26-produktionen.</p>
        <div class="team-contact-list">
          <a href="mailto:${MEMBER.email}">✉ ${MEMBER.email}</a>
          <a href="tel:+298790050">☎ ${MEMBER.phone}</a>
        </div>`;
      grid.appendChild(card);
    }

    updateTeamCount(group);
    return true;
  }

  document.addEventListener('sev:portal-ready', installTeamCard);
  document.addEventListener('sev:v2-ready', installTeamCard);
  document.addEventListener('input', event => {
    if (event.target?.id === 'team-search') window.setTimeout(installTeamCard, 0);
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.setTimeout(installTeamCard, 2200), { once: true });
  } else {
    window.setTimeout(installTeamCard, 2200);
  }
})();