(() => {
  'use strict';

  const VERSION = '2026-08-06-1148';

  const plannedShoots = [
    {
      dateLabel: 'mandag 10. august',
      time: '21:30',
      scenes: ['4A'],
      title: 'Børn under gadelyset',
      location: 'Elduvík · præcis placering ved gadelyset afklares'
    },
    {
      dateLabel: 'mandag 17. august',
      time: '13:00',
      scenes: ['1A', '2A', '2B', '2C', '15A', '16A'],
      title: 'Indendørs optagelser i Skálabúðin',
      location: 'Skálabúðin, Tórshavn · dreng og mor styles i 1970’er-tøj'
    }
  ];

  const waitingScenes = [
    {
      scenes: ['9A', '9B', '9C'],
      title: 'Mor og dreng, elbil, ladeboks og varmepumpe',
      location: 'Samme location · Thomas scouter'
    },
    {
      scenes: ['10A'],
      title: 'Tøj på tørresnoren',
      location: 'Historisk location · Thomas scouter'
    },
    {
      scenes: ['11A'],
      title: 'Aktiv jordvarmeboring',
      location: 'Indtil boreholdet kommer hjem igen fra Suðuroy',
      status: 'PÅ HOLD'
    },
    {
      scenes: ['12A'],
      title: 'Grøn energi fra et vandløb',
      location: 'Location afventer · Thomas scouter'
    },
    {
      scenes: ['13A', '13B'],
      title: 'Solenergi og sollys',
      location: 'Samme location · Thomas scouter'
    },
    {
      scenes: ['14A'],
      title: 'Dreng blæser udenfor',
      location: 'Kreativ og praktisk afklaring afventer'
    }
  ];

  const filmedScenes = ['3A', '5A', '6A', '7A', '8A'];

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[character]);
  }

  function sceneLinks(scenes, extraClass = '') {
    return scenes.map(scene => `
      <a class="scene-portal-link v2-scene-chip ${extraClass}"
         href="#storyboard-${scene.toLowerCase()}"
         data-scene-link="${escapeHtml(scene)}"
         aria-label="Åbn scene ${escapeHtml(scene)} i storyboardet">${escapeHtml(scene)}</a>`).join('');
  }

  function plannedCard(shoot) {
    return `<article class="v2-upcoming-card" data-authoritative-planned-shoot="${escapeHtml(shoot.scenes.join('-'))}">
      <div class="v2-upcoming-date">
        <span>${escapeHtml(shoot.dateLabel)}</span>
        <b>KL. ${escapeHtml(shoot.time)}</b>
      </div>
      <div class="v2-upcoming-scenes">${sceneLinks(shoot.scenes)}</div>
      <h3>${escapeHtml(shoot.title)}</h3>
      <p>${escapeHtml(shoot.location)}</p>
    </article>`;
  }

  function waitingRow(item) {
    const status = item.status || 'AFVENTER';
    const holdClass = status === 'PÅ HOLD' ? ' v2-on-hold' : '';
    return `<article class="v2-pending-row${holdClass}" data-authoritative-waiting-scenes="${escapeHtml(item.scenes.join('-'))}">
      <div>${sceneLinks(item.scenes)}</div>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.location)}</span>
      </div>
      <span class="v2-waiting">${escapeHtml(status)}</span>
    </article>`;
  }

  function addStyles() {
    if (document.getElementById('frontpage-production-status-styles')) return;
    const style = document.createElement('style');
    style.id = 'frontpage-production-status-styles';
    style.textContent = `
      .v2-pending-row.v2-on-hold {
        border-color: rgba(246,176,66,.48);
        background: rgba(246,176,66,.07);
      }
      .v2-pending-row.v2-on-hold .v2-waiting {
        color: var(--signal)!important;
        border-color: rgba(246,176,66,.48);
        font-weight: 800;
      }
      .v2-upcoming-card[data-authoritative-planned-shoot] {
        border-left-color: var(--current);
      }
    `;
    document.head.appendChild(style);
  }

  function sectionByHeading(shell, heading) {
    return [...shell.querySelectorAll('.v2-section')]
      .find(section => section.querySelector('.v2-section-title h2')?.textContent.trim() === heading);
  }

  function updatePrimary(shell) {
    const shoot = plannedShoots[0];
    const primary = shell.querySelector('.v2-primary-card');
    if (!primary) return;

    const date = primary.querySelector('.v2-primary-date');
    const scenes = primary.querySelector('.v2-primary-scenes');
    const title = primary.querySelector('h2');
    const location = primary.querySelector('.v2-location');
    const badge = primary.querySelector('.v2-planned-badge');
    const storyboardLink = primary.querySelector('.v2-action.primary');

    if (date) date.textContent = `${shoot.dateLabel.toLocaleUpperCase('da-DK')} · KL. ${shoot.time}`;
    if (scenes) scenes.innerHTML = sceneLinks(shoot.scenes, 'large');
    if (title) title.textContent = shoot.title;
    if (location) location.textContent = shoot.location;
    if (badge) badge.textContent = 'PLANLAGT';

    if (storyboardLink) {
      storyboardLink.href = '#storyboard-4a';
      storyboardLink.dataset.sceneLink = '4A';
      storyboardLink.textContent = 'Åbn scene 4A';
    }

    primary.dataset.authoritativePrimaryShoot = VERSION;
  }

  function updatePlannedSection(shell) {
    const section = sectionByHeading(shell, 'Kommende planlagte optagelser');
    if (!section) return;

    const counter = section.querySelector('.v2-section-title > span');
    const grid = section.querySelector('.v2-upcoming-grid');
    const upcoming = plannedShoots.slice(1);

    if (counter) counter.textContent = `${upcoming.length} MED FAST DATO`;
    if (grid) grid.innerHTML = upcoming.map(plannedCard).join('');
  }

  function updateWaitingSection(shell) {
    const section = sectionByHeading(shell, 'Scener der afventer dato');
    if (!section) return;

    const counter = section.querySelector('.v2-section-title > span');
    const list = section.querySelector('.v2-pending-list');

    if (counter) counter.textContent = `${waitingScenes.length} STATUSGRUPPER`;
    if (list) list.innerHTML = waitingScenes.map(waitingRow).join('');
  }

  function updateFilmedSection(shell) {
    const container = shell.querySelector('.v2-filmed-scenes');
    if (container) container.innerHTML = sceneLinks(filmedScenes);
  }

  function install() {
    const panel = document.getElementById('panel-schedule');
    const shell = panel?.querySelector('.v2-shell');
    if (!shell) return false;

    addStyles();
    updatePrimary(shell);
    updatePlannedSection(shell);
    updateWaitingSection(shell);
    updateFilmedSection(shell);

    panel.dataset.frontpageProductionStatus = VERSION;
    document.dispatchEvent(new CustomEvent('sev:frontpage-production-status-ready', {
      detail: { version: VERSION }
    }));
    return true;
  }

  document.addEventListener('sev:v2-ready', install, { once: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.setTimeout(install, 2800), { once: true });
  } else {
    window.setTimeout(install, 2800);
  }
})();
