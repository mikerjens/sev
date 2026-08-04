(() => {
  const VERSION = '2026-08-04-1145';
  const STORAGE_KEY = 'sev-active-portal-tab';

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

  function contactMarkup(member) {
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

  function installStyles() {
    if (document.getElementById('sev-team-v2-styles')) return;
    const style = document.createElement('style');
    style.id = 'sev-team-v2-styles';
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

  function renderGroups(filter = '') {
    const container = document.getElementById('team-groups');
    if (!container) return;
    const query = filter.trim().toLowerCase();

    const html = teamGroups.map(group => {
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
                ${contactMarkup(member)}
              </article>
            `).join('')}
          </div>
        </section>
      `;
    }).join('');

    container.innerHTML = html || '<div class="team-no-match">Ingen personer matcher søgningen.</div>';
  }

  function installTeam() {
    const tab = document.querySelector('nav.tabs button[data-tab="crew"]');
    const panel = document.getElementById('panel-crew');
    if (!tab || !panel) return false;

    tab.textContent = 'TEAM';
    tab.setAttribute('aria-label', 'TEAM · alle kontakter og medvirkende');

    const currentIsAuthoritative =
      panel.dataset.teamPortalVersion === VERSION &&
      panel.querySelector('#team-groups') &&
      panel.querySelector('#team-search');

    if (currentIsAuthoritative) return true;

    installStyles();
    panel.dataset.teamPortalVersion = VERSION;
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
    search.addEventListener('input', event => renderGroups(event.target.value));
    renderGroups();
    return true;
  }

  function installTabMemory() {
    document.addEventListener('click', event => {
      const tab = event.target.closest('nav.tabs button[data-tab]');
      if (tab) {
        try { sessionStorage.setItem(STORAGE_KEY, tab.dataset.tab); } catch (_) {}
      }
      if (event.target.closest('#home-button, .hero h1')) {
        try { sessionStorage.setItem(STORAGE_KEY, 'schedule'); } catch (_) {}
      }
    }, true);

    let saved = null;
    try { saved = sessionStorage.getItem(STORAGE_KEY); } catch (_) {}
    if (!saved) return;

    window.setTimeout(() => {
      const button = document.querySelector(`nav.tabs button[data-tab="${saved}"]`);
      const panel = document.getElementById(`panel-${saved}`);
      if (button && panel && typeof window.openPortalTab === 'function') {
        window.openPortalTab(saved);
      }
    }, 400);
  }

  installTabMemory();
  installTeam();

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    installTeam();
    if (attempts >= 60) window.clearInterval(timer);
  }, 100);

  window.addEventListener('load', installTeam, { once: true });
  window.setTimeout(installTeam, 1000);
  window.setTimeout(installTeam, 3000);
})();
