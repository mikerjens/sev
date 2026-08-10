(() => {
  'use strict';

  const VERSION = '2026-08-10-1310';
  const STORAGE_KEY = 'sev-task-person';
  const PANEL_ID = 'panel-my-tasks';
  const NAV_ID = 'my-tasks';
  let installed = false;

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
  }

  function data() {
    return window.SEV_APPROVED_PLAN_V1 || { people: [], datedShoots: [], pendingShoots: [] };
  }

  function localDateKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  function formatDate(dateKey) {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Intl.DateTimeFormat('da-DK', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(year, month - 1, day));
  }

  function readSelection() {
    try {
      const value = localStorage.getItem(STORAGE_KEY) || '';
      return value === 'all' ? '' : value;
    } catch (_) {
      return '';
    }
  }

  function saveSelection(value) {
    try { localStorage.setItem(STORAGE_KEY, value || 'all'); } catch (_) {}
  }

  function addStyles() {
    if (document.getElementById('my-schedule-styles')) return;
    const style = document.createElement('style');
    style.id = 'my-schedule-styles';
    style.textContent = `
      .my-schedule-picker{margin:0 0 20px;padding:18px;background:rgba(246,176,66,.09);border:2px solid rgba(246,176,66,.60);border-radius:11px}.my-schedule-picker label{display:block;margin-bottom:7px;color:var(--signal);font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:900;letter-spacing:.07em;text-transform:uppercase}.my-schedule-picker p{margin:0 0 12px;color:var(--text-muted);font-size:12px}.my-schedule-picker select{width:100%;min-height:48px;padding:0 13px;color:var(--text);background:var(--bg-elevated-2);border:2px solid var(--signal);border-radius:8px;font:inherit;font-weight:750}
      #quick-person-schedule{margin:0 0 20px}.quick-person-result{margin-top:12px}.my-schedule-summary{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}.my-schedule-summary strong{font-size:17px}.my-schedule-summary span{color:var(--text-muted);font-size:11px}.my-schedule-grid{display:grid;gap:10px}.my-schedule-card{padding:15px;background:var(--bg-elevated);border:1px solid var(--border-strong);border-left:4px solid var(--signal);border-radius:9px}.my-schedule-card.today{border-left-color:var(--current);box-shadow:0 0 0 2px rgba(77,217,192,.11)}.my-schedule-date{display:flex;align-items:center;justify-content:space-between;gap:10px;color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase}.my-schedule-date b{color:var(--signal);font-size:10px}.my-schedule-scenes{display:flex;flex-wrap:wrap;gap:5px;margin-top:9px}.my-schedule-scenes a{display:inline-flex;padding:4px 7px;color:var(--current)!important;background:rgba(77,217,192,.08);border:1px solid rgba(77,217,192,.24);border-radius:5px;text-decoration:none!important;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:850}.my-schedule-card h3{margin-top:9px;font-size:15px}.my-schedule-card p{margin-top:4px;color:var(--text-muted);font-size:11.5px}.my-schedule-role{margin-top:8px!important;color:var(--text)!important;font-size:10.5px!important}.my-schedule-role.optional{color:var(--signal)!important}.my-schedule-pending{margin-top:18px;padding-top:15px;border-top:1px solid var(--border)}.my-schedule-pending h3{font-size:15px}.my-schedule-pending-list{display:grid;gap:7px;margin-top:9px}.my-schedule-pending-row{display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;padding:10px 11px;background:var(--bg-elevated-2);border:1px solid var(--border);border-radius:7px}.my-schedule-pending-row strong{font-size:11.5px}.my-schedule-pending-row span{display:block;margin-top:2px;color:var(--text-muted);font-size:10px}.my-schedule-empty{padding:16px;color:var(--text-muted);border:1px dashed var(--border-strong);border-radius:8px;font-size:12px}.my-schedule-help{margin-top:12px;color:var(--text-muted);font-size:10.5px}
      @media(max-width:650px){.my-schedule-picker{padding:14px}.my-schedule-summary{flex-direction:column}.my-schedule-date{align-items:flex-start;flex-direction:column}.my-schedule-pending-row{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function optionsMarkup(selected) {
    return ['<option value="">— Vælg dit navn —</option>', ...data().people.map(person => `<option value="${esc(person.id)}"${person.id === selected ? ' selected' : ''}>${esc(person.name)} · ${esc(person.role)}</option>`)].join('');
  }

  function sceneLinks(scenes) {
    return scenes.map(scene => `<a class="scene-portal-link" href="#storyboard-${scene.toLowerCase()}" data-scene-link="${esc(scene)}" aria-label="Åbn scene ${esc(scene)} i storyboardet">${esc(scene)}</a>`).join('');
  }

  function personById(personId) {
    return data().people.find(person => person.id === personId);
  }

  function scheduledFor(personId) {
    return data().datedShoots.filter(shoot => shoot.crew?.includes(personId) || shoot.optionalCrew?.includes(personId));
  }

  function pendingFor(personId) {
    return data().pendingShoots.filter(shoot => shoot.crew?.includes(personId));
  }

  function scheduledCard(shoot, personId) {
    const optional = shoot.optionalCrew?.includes(personId) && !shoot.crew?.includes(personId);
    const today = shoot.date === localDateKey();
    return `<article class="my-schedule-card${today ? ' today' : ''}">
      <div class="my-schedule-date"><span>${esc(formatDate(shoot.date))}${today ? ' · I DAG' : ''}</span><b>${esc(shoot.time)}</b></div>
      <div class="my-schedule-scenes">${sceneLinks(shoot.scenes)}</div>
      <h3>${esc(shoot.title)}</h3>
      <p>${esc(shoot.location)}</p>
      <p class="my-schedule-role${optional ? ' optional' : ''}">${optional ? 'MULIG OPGAVE: ' : 'PLANLAGT: '}${optional ? 'Styling/props afklares.' : 'Du er registreret på denne optagelse.'}</p>
    </article>`;
  }

  function pendingRow(shoot) {
    return `<div class="my-schedule-pending-row"><div class="my-schedule-scenes">${sceneLinks(shoot.scenes)}</div><div><strong>${esc(shoot.title)}</strong><span>${esc(shoot.location)}</span></div></div>`;
  }

  function resultMarkup(personId, compact = false) {
    if (!personId) return '<div class="my-schedule-empty">Vælg dit navn ovenfor. Så vises kun dit eget optageskema.</div>';
    const person = personById(personId);
    if (!person) return '<div class="my-schedule-empty">Navnet findes ikke i den aktuelle produktionsplan.</div>';
    const scheduled = scheduledFor(personId);
    const pending = pendingFor(personId);
    return `<div class="my-schedule-summary"><div><strong>${esc(person.name)}</strong><span>${esc(person.role)}</span></div><span>${scheduled.length} planlagte · ${pending.length} uden fast dato</span></div>
      ${scheduled.length ? `<div class="my-schedule-grid">${scheduled.map(shoot => scheduledCard(shoot, personId)).join('')}</div>` : '<div class="my-schedule-empty">Du har ingen optagelse med fast dato i den aktuelle plan.</div>'}
      ${pending.length ? `<div class="my-schedule-pending"><h3>Scener uden fast dato, som vedrører dig</h3><div class="my-schedule-pending-list">${pending.map(pendingRow).join('')}</div></div>` : ''}
      ${compact ? '<div class="my-schedule-help">Det fulde personlige skema findes også under fanen “Mit skema”.</div>' : ''}`;
  }

  function ensurePanel() {
    const nav = document.querySelector('nav.tabs');
    const main = document.querySelector('main');
    if (!nav || !main) return false;

    let button = nav.querySelector(`button[data-tab="${NAV_ID}"]`);
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.dataset.tab = NAV_ID;
      const scheduleButton = nav.querySelector('button[data-tab="schedule"]');
      if (scheduleButton?.nextSibling) nav.insertBefore(button, scheduleButton.nextSibling);
      else nav.appendChild(button);
    }
    button.textContent = 'Mit skema';
    button.setAttribute('aria-label', 'Vælg dit navn og se dit eget optageskema');
    button.onclick = () => {
      window.openPortalTab?.(NAV_ID);
      window.setTimeout(renderAll, 20);
    };

    let panel = document.getElementById(PANEL_ID);
    if (!panel) {
      panel = document.createElement('section');
      panel.className = 'panel';
      panel.id = PANEL_ID;
      const schedulePanel = document.getElementById('panel-schedule');
      if (schedulePanel?.nextSibling) main.insertBefore(panel, schedulePanel.nextSibling);
      else main.appendChild(panel);
    }

    const selected = readSelection();
    panel.innerHTML = `<div class="section-head"><h2>Mit skema</h2><p>Vælg dit navn og se dine planlagte optagedage samt de scener uden dato, som vedrører dig.</p></div>
      <div class="my-schedule-picker"><label for="my-schedule-person">Vælg dit navn – se dit eget skema</label><p>Datoer og mødetider kommer direkte fra den godkendte produktionsplan.</p><select id="my-schedule-person">${optionsMarkup(selected)}</select></div>
      <div id="my-schedule-result">${resultMarkup(selected)}</div>`;
    panel.querySelector('#my-schedule-person')?.addEventListener('change', event => setSelection(event.target.value));
    return true;
  }

  function ensureQuickPicker() {
    const panel = document.getElementById('panel-schedule');
    if (!panel) return false;
    let mount = document.getElementById('quick-person-schedule');
    if (!mount) {
      mount = document.createElement('section');
      mount.id = 'quick-person-schedule';
      const sectionHead = panel.querySelector('.section-head');
      if (sectionHead?.nextSibling) panel.insertBefore(mount, sectionHead.nextSibling);
      else panel.prepend(mount);
    }
    const selected = readSelection();
    mount.innerHTML = `<div class="my-schedule-picker"><label for="quick-person-filter">Vælg dit navn – se dit skema med det samme</label><p>Kun de optagelser og afventende scener, som vedrører dig, vises her.</p><select id="quick-person-filter">${optionsMarkup(selected)}</select><div class="quick-person-result">${resultMarkup(selected, true)}</div></div>`;
    mount.querySelector('#quick-person-filter')?.addEventListener('change', event => setSelection(event.target.value));
    return true;
  }

  function syncLegacySelect(personId) {
    const select = document.getElementById('task-person-filter');
    if (!select) return;
    data().people.forEach(person => {
      let option = select.querySelector(`option[value="${person.id}"]`);
      if (!option) {
        option = document.createElement('option');
        option.value = person.id;
        option.textContent = `${person.name} · ${person.role}`;
        select.appendChild(option);
      }
    });
    if (personId && [...select.options].some(option => option.value === personId)) {
      select.value = personId;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function setSelection(personId) {
    saveSelection(personId);
    syncLegacySelect(personId);
    renderAll();
  }

  function renderAll() {
    const selected = readSelection();
    const fullSelect = document.getElementById('my-schedule-person');
    const quickSelect = document.getElementById('quick-person-filter');
    if (fullSelect) fullSelect.value = selected;
    if (quickSelect) quickSelect.value = selected;
    const fullResult = document.getElementById('my-schedule-result');
    const quickResult = document.querySelector('#quick-person-schedule .quick-person-result');
    if (fullResult) fullResult.innerHTML = resultMarkup(selected);
    if (quickResult) quickResult.innerHTML = resultMarkup(selected, true);
  }

  function install() {
    if (!window.SEV_APPROVED_PLAN_V1) return false;
    addStyles();
    const panelReady = ensurePanel();
    const quickReady = ensureQuickPicker();
    if (!panelReady || !quickReady) return false;
    if (!installed) {
      installed = true;
      document.addEventListener('sev:approved-plan-ready', renderAll);
    }
    renderAll();
    return true;
  }

  document.addEventListener('sev:v2-ready', () => window.setTimeout(install, 0), { once: true });
  document.addEventListener('sev:approved-plan-ready', () => window.setTimeout(install, 0), { once: true });
  if (install()) return;
  const observer = new MutationObserver(() => {
    if (!install()) return;
    observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 7000);
})();
