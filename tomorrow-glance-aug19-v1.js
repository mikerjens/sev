(() => {
  'use strict';

  const VERSION = '2026-08-18-1041';
  const PANEL_ID = 'sev-tomorrow-glance';

  const rows = [
    ['07:30', 'Make-up', 'Helena · Heini · Bjarni', 'Stjørnuskotið'],
    ['09:00–10:00', '10A · Tøj på tørresnoren', 'Bjarni', 'Miðalsbrekka'],
    ['10:00–12:00', '9A–9C · Huset i Vestmanna', 'Helena · Heini', 'Fjalsvegur 28'],
    ['12:00–13:30', '13A–13B · Hus og solpaneler', 'Helena · Heini', 'Vestmanna'],
    ['14:00–15:00', '12A · Vandløb', 'Helena · Heini', 'Location afventer'],
    ['15:00–17:00', '14A · Dreng blæser udenfor', 'Heini', 'Location afventer']
  ];

  function addStyles() {
    if (document.getElementById(`${PANEL_ID}-styles`)) return;
    const style = document.createElement('style');
    style.id = `${PANEL_ID}-styles`;
    style.textContent = `
      #${PANEL_ID}{margin:0 0 18px;padding:14px 16px;background:rgba(77,217,192,.07);border:1px solid rgba(77,217,192,.32);border-left:5px solid var(--current);border-radius:10px}
      #${PANEL_ID} .stg-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}
      #${PANEL_ID} .stg-label{font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:900;letter-spacing:.08em;color:var(--current)}
      #${PANEL_ID} .stg-date{font-size:17px;font-weight:850;color:var(--text)}
      #${PANEL_ID} .stg-grid{display:grid;gap:5px}
      #${PANEL_ID} .stg-row{display:grid;grid-template-columns:105px minmax(0,1.45fr) minmax(0,.8fr) minmax(0,.8fr);gap:10px;align-items:center;padding:7px 8px;background:rgba(255,255,255,.025);border-radius:6px}
      #${PANEL_ID} .stg-time{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:900;color:var(--signal)}
      #${PANEL_ID} .stg-scene{font-size:11.5px;font-weight:750;color:var(--text)}
      #${PANEL_ID} .stg-who,#${PANEL_ID} .stg-place{font-size:10px;color:var(--text-muted)}
      @media(max-width:700px){
        #${PANEL_ID}{padding:13px 14px}
        #${PANEL_ID} .stg-top{align-items:flex-start;flex-direction:column;gap:2px}
        #${PANEL_ID} .stg-date{font-size:16px}
        #${PANEL_ID} .stg-row{grid-template-columns:92px minmax(0,1fr);gap:3px 8px;padding:8px}
        #${PANEL_ID} .stg-time{grid-row:1 / span 2}
        #${PANEL_ID} .stg-who,#${PANEL_ID} .stg-place{font-size:9.5px}
        #${PANEL_ID} .stg-place::before{content:'📍 '}
      }
    `;
    document.head.appendChild(style);
  }

  function markup() {
    return `<section id="${PANEL_ID}" data-version="${VERSION}">
      <div class="stg-top"><span class="stg-label">I MORGEN · HURTIGT OVERBLIK</span><strong class="stg-date">ONSDAG 19. AUGUST</strong></div>
      <div class="stg-grid">${rows.map(([time, scene, who, place]) => `<div class="stg-row"><div class="stg-time">${time}</div><div class="stg-scene">${scene}</div><div class="stg-who">${who}</div><div class="stg-place">${place}</div></div>`).join('')}</div>
    </section>`;
  }

  function install() {
    addStyles();
    const panel = document.getElementById('panel-schedule');
    const head = panel?.querySelector('.ap3-head');
    const namebox = panel?.querySelector('.ap3-namebox');
    if (!panel || !head) return;

    panel.querySelectorAll(`#${PANEL_ID}`).forEach(node => node.remove());
    const template = document.createElement('template');
    template.innerHTML = markup().trim();
    const node = template.content.firstElementChild;
    if (namebox) namebox.insertAdjacentElement('beforebegin', node);
    else head.insertAdjacentElement('afterend', node);
    document.documentElement.dataset.tomorrowGlanceAug19 = VERSION;
  }

  function start() {
    install();
    [350, 900, 1800, 3200].forEach(delay => window.setTimeout(install, delay));
    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('nav.tabs button[data-tab="schedule"], .brand, [data-home]')) window.setTimeout(install, 120);
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
