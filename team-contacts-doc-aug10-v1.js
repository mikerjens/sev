(() => {
  'use strict';

  const VERSION = '3.0-2026-08-12-1253';
  const CORE_VERSION = '2026-08-10-1348';

  const groups = [
    {
      title: 'Filmhold og produktion',
      description: 'Filmcrew og praktiske nøglefunktioner.',
      members: [
        { name: 'Michael Koba', role: 'Filmproducer · KOVBOY FILM / FIXER.FO', phone: '+298 591011', email: 'michael@kovboyfilm.com' },
        { name: 'Thomas Koba', role: 'Instruktør og filmmaker · KOVBOY FILM', phone: '+298 239100', email: 'thomas@kovboyfilm.com' },
        { name: 'Rúni Friis Kjær', role: 'Grip / lys', phone: '+298 218218', email: 'rfk@friisframe.fo', note: 'Crew på de planlagte optagedage.' },
        { name: 'Heidi Mortensen', role: 'Styling & props', phone: '+298 790050', email: 'heidi@atlanta.fo', note: 'Crew 17. august. Styling & props på scene 10A den 19. august; øvrig styling den 19. august som angivet i planen.' }
      ]
    },
    {
      title: 'Bureau og kreativt team',
      description: 'SANSIR · koordinering, kreativ retning og relevante tilladelser.',
      members: [
        { name: 'Elisabeth Vitalis Tausen', role: 'Rådgiver · SANSIR', phone: '+298 299365', email: 'elisabeth@sansir.fo' },
        { name: 'Tór Verland Johansen', role: 'Direktør · SANSIR', phone: '+298 299372', email: 'torverland@sansir.fo' },
        { name: 'Bogi Henriksen', role: 'Kreativ direktør · SANSIR', phone: '+298 299361', email: 'bogi@sansir.fo' }
      ]
    },
    {
      title: 'Skuespillere og medvirkende',
      description: 'Bekræftede skuespillere og kontaktoplysninger.',
      members: [
        { name: 'Helena Heðinsdóttir Guttesen', role: 'Hovedskuespiller · mor', phone: '+298 274450', email: 'helena.h.jorgensen@gmail.com', note: 'Medvirker 17. og 19. august.' },
        { name: 'Heini Dam Lassen', role: 'Skuespiller · dreng', phone: '+298 251290', email: 'birgithlassen@gmail.com', note: 'Forælder: Birgit Lassen · medvirker 17. og 19. august.' },
        { name: 'Bjarni Lamhauge', role: 'Skuespiller · snor mand · scene 10A', phone: '+298 779009', note: 'Hænger tøj på tørresnoren onsdag 19. august.' }
      ]
    },
    {
      title: 'Scene 4A · børn og forældre',
      description: 'Forældrekontakter til de tre børn. Alle børnetilladelser er på plads.',
      members: [
        { name: 'Lias Vitalis Tausen · 5 år', role: 'Barn · scene 4A', phone: '+298 299365', email: 'elisabeth_v_b@hotmail.com', note: 'Forælder: Elisabeth Vitalis Tausen · tilladelse OK.' },
        { name: 'Rókur Thomsen', role: 'Barn · scene 4A', phone: '+298 558075', email: 'annikapo@hotmail.com', note: 'Forælder: Annika Poulsen · tilladelse OK.' },
        { name: 'Vón Thomsen · 7 år', role: 'Barn · scene 4A', phone: '+298 558075', email: 'annikapo@hotmail.com', note: 'Forælder: Annika Poulsen · tilladelse OK.' }
      ]
    },
    {
      title: 'Locations, leverandører og faglige kontakter',
      description: 'Kontakter til locations, varmepumpe og jordvarmeboring.',
      members: [
        { name: 'Laila Friis', role: 'Locationejer · Fjalsvegur 28, 350 Vestmanna', phone: '+298 724068', email: 'laila.friis@gmail.com', note: 'Location til scene 9A, 9B og 9C den 19. august.' },
        { name: 'Tummas Pauli Mohr', role: 'Varmepumpeleverandør · Demich', phone: '+298 290333', email: 'tummaspauli@demich.fo', note: 'Demich leverer varmepumpen fredag før Vestmanna-optagelsen.' },
        { name: 'Ørvur Heinesen', role: 'Jarðhiti · jordvarmeboring', phone: '+298 288433', note: 'Kontakt til scene 11A. Ingen e-mail registreret.' }
      ]
    }
  ];

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[char]);

  function contactMarkup(member) {
    const links = [];
    if (member.phone) links.push(`<a href="tel:${esc(member.phone.replace(/\s+/g, ''))}">☎ ${esc(member.phone)}</a>`);
    if (member.email) links.push(`<a href="mailto:${esc(member.email)}">✉ ${esc(member.email)}</a>`);
    if (!links.length) links.push('<span>Kontaktoplysninger afventer</span>');
    return `<div class="ap3-contact">${links.join('')}</div>`;
  }

  function cardMarkup(member) {
    return `<article class="ap3-team-card">
      <b>${esc(member.name)}</b>
      <div class="ap3-team-role">${esc(member.role)}</div>
      ${member.note ? `<div class="ap3-team-note">${esc(member.note)}</div>` : ''}
      ${contactMarkup(member)}
    </article>`;
  }

  function render(filter = '') {
    const panel = document.getElementById('panel-crew');
    if (!panel) return false;

    const crewTab = document.querySelector('nav.tabs button[data-tab="crew"]');
    if (crewTab) {
      crewTab.textContent = 'TEAM';
      crewTab.setAttribute('aria-label', 'TEAM · alle kontaktoplysninger');
    }

    const query = filter.trim().toLocaleLowerCase('da-DK');
    const html = groups.map(group => {
      const members = group.members.filter(member => [
        group.title, group.description, member.name, member.role, member.phone, member.email, member.note
      ].filter(Boolean).join(' ').toLocaleLowerCase('da-DK').includes(query));
      if (!members.length) return '';
      return `<section class="ap3-team-group">
        <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:9px;padding-bottom:8px;border-bottom:1px solid var(--border)">
          <div><h3 class="ap3-team-title" style="margin:0;padding:0;border:0">${esc(group.title)}</h3><div style="margin-top:3px;color:var(--text-muted);font-size:11px">${esc(group.description)}</div></div>
          <span style="color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:9px">${members.length} ${members.length === 1 ? 'KONTAKT' : 'KONTAKTER'}</span>
        </div>
        <div class="ap3-team-grid">${members.map(cardMarkup).join('')}</div>
      </section>`;
    }).join('');

    panel.innerHTML = `<div data-team-doc-v1-root="${VERSION}">
      <div class="ap3-head"><h2>TEAM</h2><p>Alle nødvendige kontaktoplysninger til filmhold, SANSIR, skuespillere, forældre, locations og leverandører er samlet her. Ajourført fra SEV produktionsplan · portal 3.0.</p></div>
      <div class="team-search-row"><input id="team-doc-search" type="search" value="${esc(filter)}" placeholder="Søg efter navn, rolle, telefon eller e-mail…" aria-label="Søg i TEAM"></div>
      <div>${html || '<div class="ap3-empty">Ingen kontakter matcher søgningen.</div>'}</div>
    </div>`;

    panel.dataset.approvedTeamV3 = CORE_VERSION;
    panel.dataset.teamContactsDocV1 = VERSION;
    panel.querySelector('#team-doc-search')?.addEventListener('input', event => render(event.target.value));
    return true;
  }

  function installTeamTabRepair() {
    if (document.documentElement.dataset.teamTabRepair === VERSION) return;
    document.documentElement.dataset.teamTabRepair = VERSION;
    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target?.closest('nav.tabs button[data-tab="crew"]')) return;
      window.setTimeout(() => render(''), 0);
    }, true);
  }

  function start() {
    installTeamTabRepair();
    if (!render()) window.setTimeout(render, 300);
    window.setTimeout(() => {
      const panel = document.getElementById('panel-crew');
      if (panel && !panel.querySelector(`[data-team-doc-v1-root="${VERSION}"]`)) render();
    }, 900);
    window.setTimeout(() => {
      const panel = document.getElementById('panel-crew');
      if (panel && !panel.querySelector(`[data-team-doc-v1-root="${VERSION}"]`)) render();
    }, 2200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
