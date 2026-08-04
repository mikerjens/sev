(() => {
  const ORIGINAL_FEATURES_URL = 'https://cdn.jsdelivr.net/gh/mikerjens/sev@32faab2f57232769277e359dbf4dafb41edf4031/sun-times.js';
  const activeTabStorageKey = 'sev-active-portal-tab';
  const validTabs = new Set(['schedule', 'storyboard', 'weather', 'crew', 'contacts', 'tasks']);
  const graphicSceneIds = new Set(['17A', '18A']);

  function loadOriginalFeatures() {
    if (document.querySelector(`script[src="${ORIGINAL_FEATURES_URL}"]`)) return;
    const script = document.createElement('script');
    script.src = ORIGINAL_FEATURES_URL;
    script.defer = true;
    document.head.appendChild(script);
  }

  function rememberTab(tabName) {
    if (!validTabs.has(tabName)) return;
    try {
      window.sessionStorage.setItem(activeTabStorageKey, tabName);
    } catch (_) {
      // Portalen fungerer stadig, hvis browseren blokerer sessionStorage.
    }
  }

  function rememberedTab() {
    try {
      const tabName = window.sessionStorage.getItem(activeTabStorageKey);
      return validTabs.has(tabName) ? tabName : null;
    } catch (_) {
      return null;
    }
  }

  function installTabMemory() {
    if (window.__sevTabMemoryInstalled) return true;
    if (typeof window.openPortalTab !== 'function') return false;
    window.__sevTabMemoryInstalled = true;

    const originalOpenPortalTab = window.openPortalTab;
    window.openPortalTab = function openRememberedPortalTab(tabName, options) {
      rememberTab(tabName);
      return originalOpenPortalTab(tabName, options);
    };

    document.addEventListener('click', event => {
      const tabButton = event.target.closest('nav.tabs button[data-tab]');
      if (tabButton) {
        rememberTab(tabButton.dataset.tab);
        return;
      }
      if (event.target.closest('#home-button, .hero h1')) {
        rememberTab('schedule');
        return;
      }
      if (event.target.closest('#open-weather-details')) {
        rememberTab('weather');
        return;
      }
      if (event.target.closest('[data-storyboard-scene], [data-open-storyboard]')) {
        rememberTab('storyboard');
      }
    }, true);

    const restore = () => {
      const savedTab = rememberedTab();
      if (!savedTab) return;
      const button = document.querySelector(`nav.tabs button[data-tab="${savedTab}"]`);
      const panel = document.getElementById(`panel-${savedTab}`);
      if (button && panel) originalOpenPortalTab(savedTab);
    };

    restore();
    window.setTimeout(restore, 250);
    window.setTimeout(restore, 1000);
    return true;
  }

  const teamGroups = [
    {
      title: 'Filmhold og produktion',
      description: 'Personer med ansvar for produktion, instruktion og optagelser.',
      members: [
        {
          name: 'Michael Koba',
          type: 'Filmproducer',
          organisation: 'KOVBOY FILM / FIXER.FO',
          email: 'michael@kovboyfilm.com',
          phone: '+298 591011',
          status: 'Bekræftet'
        },
        {
          name: 'Thomas Koba',
          type: 'Instruktør og filmmaker',
          organisation: 'KOVBOY FILM',
          email: 'thomas@kovboyfilm.com',
          phone: '+298 239100',
          status: 'Bekræftet'
        }
      ]
    },
    {
      title: 'Bureau og kreativt team',
      description: 'SANSIRs ansvarlige for kreativ retning, koordinering og godkendelser.',
      members: [
        {
          name: 'Elisabeth Vitalis Tausen',
          type: 'Rådgiver',
          organisation: 'SANSIR',
          email: 'elisabeth@sansir.fo',
          phone: '+298 299365',
          status: 'Bekræftet'
        },
        {
          name: 'Tór Verland Johansen',
          type: 'Direktør',
          organisation: 'SANSIR',
          email: 'torverland@sansir.fo',
          phone: '+298 299372',
          status: 'Bekræftet'
        },
        {
          name: 'Bogi Henriksen',
          type: 'Kreativ direktør',
          organisation: 'SANSIR',
          email: 'bogi@sansir.fo',
          phone: '+298 299361',
          status: 'Bekræftet'
        }
      ]
    },
    {
      title: 'Faglige bidragsydere',
      description: 'Fagpersoner og virksomheder, som bidrager med adgang, viden eller medvirken.',
      members: [
        {
          name: 'Ørvur Heinesen',
          type: 'Bidragsyder · jordvarmeboring',
          organisation: 'Jarðhiti',
          phone: '+298 288433',
          website: 'https://www.jardhiti.fo',
          status: 'I proces · optagelse medio august',
          note: 'Meget positiv over for optagelser. Tilbage i Tórshavn/Streymoy medio august.'
        },
        {
          name: 'Øssur',
          type: 'Bidragsyder · jordvarmeboring',
          organisation: 'Jarðhiti',
          website: 'https://www.jardhiti.fo',
          status: 'Tilknyttet produktionen',
          note: 'Kontakt fra Jarðhiti i forbindelse med scene 11A og optagelser af aktiv jordvarmeboring.'
        }
      ]
    },
    {
      title: 'Talenter og skuespillere',
      description: 'Roller foran kameraet. Navne tilføjes, når casting er godkendt.',
      members: [
        {
          name: 'Dreng · hovedrolle',
          type: 'Talent / skuespiller',
          status: 'Casting i gang',
          note: 'Scener 1A, 2A, 9A, 12A, 13A, 14A, 15A og 16A.'
        },
        {
          name: 'Mor',
          type: 'Skuespiller',
          status: 'Casting i gang',
          note: 'Scener 9A, 12A, 13A og 15A.'
        },
        {
          name: 'Mand ved tørresnoren',
          type: 'Skuespiller',
          status: 'Casting i gang',
          note: 'Historisk rolle i scene 10A.'
        }
      ]
    },
    {
      title: 'Statister og øvrige medvirkende',
      description: 'Statister, børn, borehold og andre personer, der medvirker i de enkelte scener.',
      members: [
        {
          name: 'Barn 1, Barn 2 og Barn 3',
          type: 'Børnetalenter',
          status: 'Casting i gang',
          note: 'Scene 4A. Forældretilladelser er nødvendige.'
        },
        {
          name: 'Jarðhiti borehold',
          type: 'Faglige medvirkende',
          organisation: 'Jarðhiti',
          status: 'I proces',
          note: 'Forventet medvirken i scene 11A medio august.'
        },
        {
          name: 'Øvrige statister',
          type: 'Statister',
          status: 'Ingen bekræftet endnu',
          note: 'Tilføjes her, når behov og navne er godkendt.'
        }
      ]
    }
  ];

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[character]);
  }

  function teamContactMarkup(member) {
    const links = [];
    if (member.email) {
      links.push(`<a href="mailto:${escapeHtml(member.email)}">✉ ${escapeHtml(member.email)}</a>`);
    }
    if (member.phone) {
      links.push(`<a href="tel:${member.phone.replace(/\s+/g, '')}">☎ ${escapeHtml(member.phone)}</a>`);
    }
    if (member.website) {
      links.push(`<a href="${escapeHtml(member.website)}" target="_blank" rel="noopener">↗ ${escapeHtml(member.website.replace(/^https?:\/\//, ''))}</a>`);
    }
    return links.length ? `<div class="team-contact-list">${links.join('')}</div>` : '';
  }

  function installTeamStyles() {
    if (document.getElementById('sev-team-styles')) return;
    const style = document.createElement('style');
    style.id = 'sev-team-styles';
    style.textContent = `
      .team-search-row{margin:0 0 24px}
      #team-search{width:100%;padding:12px 14px;color:var(--text);background:var(--bg-elevated);border:1px solid var(--border-strong);border-radius:8px}
      #team-search:focus{border-color:var(--current);outline:none;box-shadow:0 0 0 3px rgba(77,217,192,.12)}
      .team-group{margin-top:28px}
      .team-group:first-of-type{margin-top:0}
      .team-group-head{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-bottom:11px;padding-bottom:9px;border-bottom:1px solid var(--border)}
      .team-group-title{font-family:'Space Grotesk',sans-serif;font-size:17px;font-weight:600}
      .team-group-description{max-width:620px;margin-top:3px;color:var(--text-muted);font-size:12.5px}
      .team-group-count{flex-shrink:0;color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:10px}
      .team-card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(225px,1fr));gap:11px}
      .team-card{min-width:0;padding:15px;background:var(--bg-elevated);border:1px solid var(--border);border-radius:9px}
      .team-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
      .team-card-name{font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:600}
      .team-card-type{margin-top:3px;color:var(--current);font-family:'IBM Plex Mono',monospace;font-size:10.5px}
      .team-card-organisation{margin-top:3px;color:var(--text-muted);font-size:12px}
      .team-status{display:inline-flex;max-width:145px;padding:3px 7px;color:var(--signal);background:rgba(246,176,66,.09);border:1px solid rgba(246,176,66,.28);border-radius:100px;font-family:'IBM Plex Mono',monospace;font-size:8.5px;font-weight:700;line-height:1.3;text-align:center}
      .team-card-note{margin-top:10px;color:var(--text-muted);font-size:11.5px}
      .team-contact-list{display:grid;gap:6px;margin-top:12px;padding-top:10px;border-top:1px solid var(--border)}
      .team-contact-list a{width:fit-content;max-width:100%;color:var(--text);font-family:'IBM Plex Mono',monospace;font-size:10.5px;text-decoration:none;overflow-wrap:anywhere}
      .team-contact-list a:hover,.team-contact-list a:focus-visible{color:var(--current);text-decoration:underline;outline:none}
      .team-no-match{padding:18px;color:var(--text-muted);border:1px dashed var(--border-strong);border-radius:8px;text-align:center}
      @media(max-width:520px){.team-group-head{align-items:flex-start;flex-direction:column;gap:4px}.team-card-grid{grid-template-columns:1fr}.team-card-top{flex-direction:column}.team-status{max-width:none}}
    `;
    document.head.appendChild(style);
  }

  function renderTeamGroups(filter = '') {
    const container = document.getElementById('team-groups');
    if (!container) return;
    const query = filter.trim().toLowerCase();
    const groupHtml = teamGroups.map(group => {
      const members = group.members.filter(member => {
        const searchable = [group.title, member.name, member.type, member.organisation, member.status, member.note]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return searchable.includes(query);
      });
      if (!members.length) return '';
      return `
        <section class="team-group">
          <div class="team-group-head">
            <div>
              <h3 class="team-group-title">${escapeHtml(group.title)}</h3>
              <p class="team-group-description">${escapeHtml(group.description)}</p>
            </div>
            <span class="team-group-count">${members.length} ${members.length === 1 ? 'person' : 'personer'}</span>
          </div>
          <div class="team-card-grid">
            ${members.map(member => `
              <article class="team-card">
                <div class="team-card-top">
                  <div>
                    <div class="team-card-name">${escapeHtml(member.name)}</div>
                    <div class="team-card-type">${escapeHtml(member.type)}</div>
                    ${member.organisation ? `<div class="team-card-organisation">${escapeHtml(member.organisation)}</div>` : ''}
                  </div>
                  ${member.status ? `<span class="team-status">${escapeHtml(member.status)}</span>` : ''}
                </div>
                ${member.note ? `<p class="team-card-note">${escapeHtml(member.note)}</p>` : ''}
                ${teamContactMarkup(member)}
              </article>
            `).join('')}
          </div>
        </section>
      `;
    }).join('');
    container.innerHTML = groupHtml || '<div class="team-no-match">Ingen personer matcher søgningen.</div>';
  }

  function installTeamView() {
    const panel = document.getElementById('panel-crew');
    const tab = document.querySelector('nav.tabs button[data-tab="crew"]');
    if (!panel || !tab) return false;

    // Vent til den eksisterende kontaktkorrektion er færdig, så TEAM ikke overskrives bagefter.
    if (!panel.querySelector('.crew-card-grid') && panel.dataset.teamView !== 'ready') return false;

    tab.textContent = 'TEAM';
    tab.setAttribute('aria-label', 'TEAM · alle kontakter og medvirkende');

    if (panel.dataset.teamView === 'ready') return true;
    installTeamStyles();
    panel.dataset.teamView = 'ready';
    panel.innerHTML = `
      <div class="section-head">
        <h2>TEAM</h2>
        <p>Alle kontakter og medvirkende på produktionen, opdelt efter funktion. Talenter, skuespillere, statister og bidragsydere tilføjes med navn, så snart de er bekræftet.</p>
      </div>
      <div class="team-search-row">
        <input id="team-search" type="search" placeholder="Søg efter navn, rolle, virksomhed eller kategori…" aria-label="Søg i TEAM">
      </div>
      <div id="team-groups"></div>
    `;
    const search = panel.querySelector('#team-search');
    search?.addEventListener('input', event => renderTeamGroups(event.target.value));
    renderTeamGroups();
    return true;
  }

  function simplifyStoryboardOverview() {
    const sceneList = document.getElementById('storyboard-scene-list');
    if (!sceneList) return false;

    sceneList.querySelectorAll('.storyboard-scene-card[data-storyboard-scene]').forEach(card => {
      if (graphicSceneIds.has(card.dataset.storyboardScene)) card.remove();
    });

    const sideHeading = document.querySelector('#panel-storyboard .storyboard-side-head');
    const title = sideHeading?.querySelector('strong');
    const count = sideHeading?.querySelector('span');
    const visibleScenes = sceneList.querySelectorAll('.storyboard-scene-card').length;
    if (title) title.textContent = 'Optagescener';
    if (count) count.textContent = `${visibleScenes} scener`;
    return true;
  }

  function replaceText(root, from, to) {
    if (!root) return false;
    let changed = false;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => {
      if (node.parentElement?.closest('script,style')) return;
      if (!node.nodeValue.includes(from)) return;
      node.nodeValue = node.nodeValue.split(from).join(to);
      changed = true;
    });
    return changed;
  }

  function correctPortalText() {
    const schedulePanel = document.getElementById('panel-schedule');
    const sceneCard = document.querySelector('.storyboard-scene-card[data-storyboard-scene="3A"]');
    const sceneTitle = sceneCard?.querySelector('.storyboard-scene-title');

    if (sceneCard && sceneTitle) {
      sceneTitle.textContent = 'Drone om natten i Fuglafjørður eller Vestmanna';
      sceneCard.setAttribute('aria-label', 'Åbn scene 3A. Droneoptagelse i Fuglafjørður eller Vestmanna. Klaksvík er ikke tilladt til droneflyvning.');
      sceneCard.title = 'Klaksvík er ikke tilladt til droneflyvning. Brug Fuglafjørður eller Vestmanna.';
    }

    replaceText(
      schedulePanel,
      'Optag Klaksvík, lille bygd, dæmning, vindmøller og ø-landskaber.',
      'Optag scene 3A i Fuglafjørður eller Vestmanna samt de resterende billeder af lille bygd, dæmning og ø-landskaber. Klaksvík må ikke bruges til droneflyvning, og scene 7A er allerede filmet.'
    );
    replaceText(
      schedulePanel,
      'Scener 3A, 5A, 6A, 7A og 8A efter vejr, sigt og lys.',
      'Scener 3A, 5A, 6A og 8A efter vejr, sigt og lys. Scene 7A er filmet.'
    );
    replaceText(
      schedulePanel,
      'Scener 1A, 1B, 1C, 15A og 15B. Dreng og mor.',
      'Scener 1A, 2A (drengens del), 15A og 16A. Dreng og mor.'
    );
    replaceText(
      schedulePanel,
      'Kontakt borefirmaer om aktiv jordvarmeboring',
      'Planlæg optagelse med Jarðhiti medio august'
    );
    replaceText(
      schedulePanel,
      'Undersøg om en aktiv boring kan filmes mellem 9. og 23. august, og afklar kontaktperson, tidspunkt, adgang og sikkerhed.',
      'Opgaven er i proces. Følg op på billeder fra Suðuroy og aftal præcis optagedato, borested, adgang og sikkerhed, når Jarðhiti er tilbage i Tórshavn/Streymoy medio august.'
    );
    replaceText(
      schedulePanel,
      'Der er en konkret mulighed eller et dokumenteret alternativ til scene 11A.',
      'Dato, borested, adgang, grundejer og sikkerhed er bekræftet med Ørvur Heinesen og Jarðhiti.'
    );
    replaceText(document.body, 'Tór Verland Johannesen', 'Tór Verland Johansen');
    return Boolean(schedulePanel && sceneCard);
  }

  function updateSelectedScene(sceneId) {
    const selected = document.querySelector('.storyboard-selected-scene');
    const selectedTitle = document.getElementById('storyboard-selected-title');
    if (!selected) return;

    selected.querySelector('.scene-3a-restriction')?.remove();
    if (sceneId !== '3A') return;

    if (selectedTitle) {
      selectedTitle.textContent = 'Scene 3A · Drone om natten i Fuglafjørður eller Vestmanna';
    }

    const note = document.createElement('span');
    note.className = 'scene-3a-restriction';
    note.textContent = 'Klaksvík er ikke tilladt til droneflyvning.';
    Object.assign(note.style, {
      display: 'inline-flex',
      marginTop: '6px',
      padding: '3px 8px',
      color: 'var(--signal)',
      background: 'rgba(246,176,66,.10)',
      border: '1px solid rgba(246,176,66,.32)',
      borderRadius: '100px',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '10px',
      fontWeight: '700'
    });
    selected.appendChild(note);
  }

  function installSceneReferenceLinks() {
    if (document.getElementById('scene-reference-link-styles')) return true;
    const panel = document.getElementById('panel-schedule');
    if (!panel?.querySelector('.task-card')) return false;

    const style = document.createElement('style');
    style.id = 'scene-reference-link-styles';
    style.textContent = `
      .scene-reference-link{display:inline-flex;align-items:center;justify-content:center;min-width:34px;margin:1px 2px;padding:2px 7px;color:var(--current);background:rgba(77,217,192,.10);border:1px solid rgba(77,217,192,.35);border-radius:6px;font-family:'IBM Plex Mono',monospace;font-size:.9em;font-weight:700;line-height:1.4;text-decoration:none;cursor:pointer}
      .scene-reference-link:hover,.scene-reference-link:focus-visible{color:#071512;background:var(--current);border-color:var(--current);outline:none}
      .scene-reference-link.filmed{color:#071512;background:#4ade80;border-color:#4ade80}
    `;
    document.head.appendChild(style);

    const scenePattern = /\b(1[0-8]|[1-9])A\b/g;
    const walker = document.createTreeWalker(panel, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        scenePattern.lastIndex = 0;
        if (!scenePattern.test(node.nodeValue || '')) return NodeFilter.FILTER_REJECT;
        scenePattern.lastIndex = 0;
        if (node.parentElement?.closest('a,button,script,style,.scene-reference-link')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const text = node.nodeValue;
      scenePattern.lastIndex = 0;
      let match;
      let lastIndex = 0;
      const fragment = document.createDocumentFragment();

      while ((match = scenePattern.exec(text))) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        const sceneId = `${match[1]}A`;
        const link = document.createElement('a');
        link.href = `#scene-${sceneId}`;
        link.className = `scene-reference-link${sceneId === '7A' ? ' filmed' : ''}`;
        link.dataset.storyboardScene = sceneId;
        link.textContent = sceneId === '7A' ? '✓ 7A' : sceneId;
        link.setAttribute('aria-label', `Åbn scene ${sceneId} i storyboardet${sceneId === '7A' ? '. Scenen er filmet.' : ''}`);
        link.title = `Åbn scene ${sceneId} i storyboardet`;
        fragment.appendChild(link);
        lastIndex = match.index + match[0].length;
      }

      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      node.replaceWith(fragment);
    });

    document.addEventListener('click', event => {
      const link = event.target.closest('.scene-reference-link');
      if (!link) return;
      event.preventDefault();
      const sceneId = link.dataset.storyboardScene;
      if (typeof window.openStoryboardScene === 'function') {
        window.openStoryboardScene(sceneId);
      } else {
        window.openPortalTab?.('storyboard');
        window.setTimeout(() => window.openStoryboardScene?.(sceneId), 300);
      }
    });
    return true;
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-storyboard-scene]');
    if (!target) return;
    window.setTimeout(() => updateSelectedScene(target.dataset.storyboardScene), 0);
  }, true);

  loadOriginalFeatures();

  let attempts = 0;
  const setupTimer = window.setInterval(() => {
    attempts += 1;
    const tabsReady = installTabMemory();
    const teamReady = installTeamView();
    const storyboardReady = simplifyStoryboardOverview();
    const textReady = correctPortalText();
    const linksReady = installSceneReferenceLinks();

    if ((tabsReady && teamReady && storyboardReady && textReady && linksReady) || attempts >= 100) {
      window.clearInterval(setupTimer);
    }
  }, 100);

  installTabMemory();
  installTeamView();
  simplifyStoryboardOverview();
  correctPortalText();
  installSceneReferenceLinks();
})();
