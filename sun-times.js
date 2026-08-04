(() => {
  const previousScript = document.createElement('script');
  previousScript.src = 'https://cdn.jsdelivr.net/gh/mikerjens/sev@3567588f06c7e26227a3990c3d2d8e3db3dc1464/sun-times.js';
  previousScript.defer = true;
  document.head.appendChild(previousScript);

  const personKey = 'ossur-jardhiti';
  const searchableText = 'faglige bidragsydere øssur jarðhiti bidragsyder jordvarmeboring jordvarme';

  function ossurCardMarkup() {
    return `
      <article class="team-card" data-team-person="${personKey}">
        <div class="team-card-top">
          <div>
            <div class="team-card-name">Øssur</div>
            <div class="team-card-type">Bidragsyder · jordvarmeboring</div>
            <div class="team-card-organisation">Jarðhiti</div>
          </div>
          <span class="team-status">Tilknyttet produktionen</span>
        </div>
        <p class="team-card-note">Kontakt fra Jarðhiti i forbindelse med scene 11A og optagelser af aktiv jordvarmeboring.</p>
        <div class="team-contact-list">
          <a href="https://www.jardhiti.fo" target="_blank" rel="noopener">↗ www.jardhiti.fo</a>
        </div>
      </article>
    `;
  }

  function fagligGroupMarkup() {
    return `
      <section class="team-group" data-team-group="faglige-bidragsydere">
        <div class="team-group-head">
          <div>
            <h3 class="team-group-title">Faglige bidragsydere</h3>
            <p class="team-group-description">Fagpersoner og virksomheder, som bidrager med adgang, viden eller medvirken.</p>
          </div>
          <span class="team-group-count">1 person</span>
        </div>
        <div class="team-card-grid">${ossurCardMarkup()}</div>
      </section>
    `;
  }

  function updateGroupCount(group) {
    const count = group?.querySelector('.team-group-count');
    if (!count) return;
    const people = group.querySelectorAll('.team-card').length;
    count.textContent = `${people} ${people === 1 ? 'person' : 'personer'}`;
  }

  function addOssurToTeam() {
    const container = document.getElementById('team-groups');
    const search = document.getElementById('team-search');
    if (!container || !search) return false;

    const query = search.value.trim().toLowerCase();
    if (query && !searchableText.includes(query)) return true;

    let group = [...container.querySelectorAll('.team-group')].find(section =>
      section.querySelector('.team-group-title')?.textContent.trim() === 'Faglige bidragsydere'
    );

    if (!group) {
      container.insertAdjacentHTML('beforeend', fagligGroupMarkup());
      return true;
    }

    const grid = group.querySelector('.team-card-grid');
    if (!grid) return false;

    if (!grid.querySelector(`[data-team-person="${personKey}"]`)) {
      grid.insertAdjacentHTML('beforeend', ossurCardMarkup());
    }
    updateGroupCount(group);
    return true;
  }

  function connectTeamSearch() {
    const search = document.getElementById('team-search');
    if (!search || search.dataset.ossurConnected === 'true') return false;
    search.dataset.ossurConnected = 'true';
    search.addEventListener('input', () => window.setTimeout(addOssurToTeam, 0));
    return true;
  }

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    const added = addOssurToTeam();
    const connected = connectTeamSearch();
    if ((added && connected) || attempts >= 100) window.clearInterval(timer);
  }, 100);

  addOssurToTeam();
  connectTeamSearch();
})();