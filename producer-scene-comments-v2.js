(() => {
  const VERSION = '2026-08-05-1638';

  const groups = [
    {
      location: 'Airbnb i Elduvík · samme location',
      status: 'Afventer tilladelse fra ejer',
      scenes: [
        ['1A', 'Drengen tænder lyset.'],
        ['2A', 'Drengen sidder og læser.'],
        ['2B', 'Nærbillede af bogen og det historiske foto.'],
        ['2C', 'Det historiske billede og fiskerdelen optages som del af samme setup.'],
        ['15A', 'Måske begynder det med dig.'],
        ['16A', 'Drengen slukker lyset.']
      ],
      comment: 'Michael skal spørge ejeren af Airbnb-huset i Elduvík, om det er muligt at filme der. Der fastsættes først en optagedato, når ejeren har godkendt optagelsen. Huset skal også vurderes i forhold til vinduerne i scene 9.'
    },
    {
      location: 'Gadelys-location',
      status: 'Planlagt · 10. august kl. 21:30',
      scenes: [['4A', 'Tre børn leger med bold under gadelyset.']],
      comment: 'Bliver filmet mandag 10. august kl. 21:30. Præcis location og bygd aftales, når Thomas har besluttet location.'
    },
    {
      location: 'Lille bygd om natten · Funningur',
      status: 'Planlagt · 5. august kl. 21:30',
      scenes: [['5A', 'Natligt dronebillede af en lille bygd.']],
      comment: 'Bliver filmet onsdag 5. august kl. 21:30 i Funningur.'
    },
    {
      location: 'Hus med elbil, ladeboks og varmepumpe · samme location',
      status: 'Location scouting',
      scenes: [
        ['9A', 'Drengen kommer løbende hen til sin mor.'],
        ['9B', 'Moren viser eller taler om elbilen.'],
        ['9C', 'Moren viser varmepumpen og peger op i luften.']
      ],
      comment: 'Thomas scouter efter location.'
    },
    {
      location: 'Historisk tørresnor',
      status: 'Location scouting',
      scenes: [['10A', 'En mand hænger tøj til tørre.']],
      comment: 'Thomas scouter efter location.'
    },
    {
      location: 'Jarðhiti',
      status: 'Afventer borehold',
      scenes: [['11A', 'Aktiv jordvarmeboring med Ørvur Heinesen og boreholdet.']],
      comment: 'Vi afventer at filme denne scene, indtil boreholdet kommer tilbage til Streymoy fra Suðuroy.'
    },
    {
      location: 'Vandløb',
      status: 'Location scouting',
      scenes: [['12A', 'Dreng og mor ved et vandløb.']],
      comment: 'Thomas scouter efter location.'
    },
    {
      location: 'Solenergi · samme location',
      status: 'Location scouting',
      scenes: [
        ['13A', 'Hus og solpaneler.'],
        ['13B', 'Drengen bliver blændet af solen.']
      ],
      comment: 'Thomas scouter efter location.'
    },
    {
      location: 'Dreng blæser udenfor',
      status: 'Kreativ og praktisk afklaring',
      scenes: [['14A', 'Drengen blæser på en legetøjsvindmølle eller pollen fra en blomst.']]
    }
  ];

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[char]);
  }

  function installStyles() {
    if (document.getElementById('producer-scene-comments-styles')) return;
    const style = document.createElement('style');
    style.id = 'producer-scene-comments-styles';
    style.textContent = `
      #producer-scene-status{margin:0 0 30px;padding:18px;background:var(--bg-elevated);border:1px solid var(--border-strong);border-radius:10px}
      .producer-scene-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:15px}
      .producer-scene-head h3{font-family:'Space Grotesk',sans-serif;font-size:19px;font-weight:650}
      .producer-scene-head p{margin-top:4px;color:var(--text-muted);font-size:12.5px}
      .producer-scene-updated{flex-shrink:0;color:var(--current);font-family:'IBM Plex Mono',monospace;font-size:10px}
      .producer-location-list{display:grid;gap:10px}
      .producer-location-card{padding:14px;background:var(--bg-elevated-2);border:1px solid var(--border);border-radius:8px}
      .producer-location-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
      .producer-location-title{font-weight:650}
      .producer-location-status{flex-shrink:0;max-width:220px;padding:3px 7px;color:var(--signal);background:rgba(246,176,66,.09);border:1px solid rgba(246,176,66,.28);border-radius:99px;font-family:'IBM Plex Mono',monospace;font-size:9px;text-align:center}
      .producer-scenes{display:grid;gap:6px;margin-top:11px}
      .producer-scene-line{display:grid;grid-template-columns:45px 1fr;gap:8px;align-items:start;font-size:13px}
      .producer-scene-code{color:var(--current);font-family:'IBM Plex Mono',monospace;font-weight:800}
      .producer-comment{margin-top:12px;padding:10px 12px;color:var(--text);background:rgba(77,217,192,.07);border-left:3px solid var(--current);border-radius:5px;font-size:12.5px}
      .producer-comment strong{color:var(--current)}
      .producer-filmed{margin-top:14px;padding-top:13px;border-top:1px solid var(--border);color:var(--text-muted);font-size:12px}
      .producer-filmed b{color:#4ade80}
      @media(max-width:600px){
        #producer-scene-status{padding:15px}
        .producer-scene-head,.producer-location-top{flex-direction:column}
        .producer-location-status{max-width:none}
      }
    `;
    document.head.appendChild(style);
  }

  function markup() {
    return `
      <section id="producer-scene-status" data-version="${VERSION}">
        <div class="producer-scene-head">
          <div>
            <h3>Resterende scener · producentstatus</h3>
            <p>Scenerne er grupperet efter location. A, B og C står separat, så det er tydeligt, hvilke billeder der hører til samme setup.</p>
          </div>
          <span class="producer-scene-updated">Opdateret 5. august 2026</span>
        </div>
        <div class="producer-location-list">
          ${groups.map(group => `
            <article class="producer-location-card">
              <div class="producer-location-top">
                <div class="producer-location-title">${esc(group.location)}</div>
                <span class="producer-location-status">${esc(group.status)}</span>
              </div>
              <div class="producer-scenes">
                ${group.scenes.map(([code, description]) => `
                  <div class="producer-scene-line">
                    <span class="producer-scene-code">${esc(code)}</span>
                    <span>${esc(description)}</span>
                  </div>
                `).join('')}
              </div>
              ${group.comment ? `<div class="producer-comment"><strong>Michael · producer:</strong> ${esc(group.comment)}</div>` : ''}
            </article>
          `).join('')}
        </div>
        <div class="producer-filmed"><b>Filmet:</b> 3A · Klaksvík om natten, 6A · vandkraft, 7A · vindmøller og 8A · ø-landskab.</div>
      </section>
    `;
  }

  function install() {
    const panel = document.getElementById('panel-schedule');
    if (!panel) return false;

    installStyles();
    const existing = document.getElementById('producer-scene-status');
    if (existing?.dataset.version === VERSION) return true;
    existing?.remove();

    const toolbar = panel.querySelector('.plan-toolbar');
    const list = panel.querySelector('#production-plan-list');
    const anchor = toolbar || list;
    if (anchor) anchor.insertAdjacentHTML('beforebegin', markup());
    else panel.insertAdjacentHTML('beforeend', markup());
    return true;
  }

  install();
  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    install();
    if (attempts >= 60) window.clearInterval(timer);
  }, 100);
  window.addEventListener('load', install, { once: true });
})();
