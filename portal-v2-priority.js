(() => {
  'use strict';

  const VERSION = '2.0';
  const BUILD = '2026-08-06-1135';
  const PRIMARY_TAB = 'schedule';
  let installed = false;

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[character]);
  }

  function localDateKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  function dateKeyFromText(text) {
    const match = String(text || '').toLocaleLowerCase('da-DK').match(/\b(\d{1,2})\.\s*(?:aug|august)\b/);
    if (!match) return '';
    return `2026-08-${String(Number(match[1])).padStart(2, '0')}`;
  }

  function dateLabel(dateKey) {
    if (!dateKey) return 'Dato afventer';
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Intl.DateTimeFormat('da-DK', {
      weekday: 'long', day: 'numeric', month: 'long'
    }).format(new Date(year, month - 1, day));
  }

  function sceneIds(element) {
    if (!element) return [];
    const linked = [...element.querySelectorAll('[data-scene-link]')]
      .map(link => link.dataset.sceneLink)
      .filter(Boolean);
    if (linked.length) return [...new Set(linked)];
    return [...new Set((element.textContent || '').match(/\b\d+[A-Z]\b/g) || [])];
  }

  function sceneLinksMarkup(ids, className = '') {
    return ids.map(scene => `<a class="scene-portal-link v2-scene-chip ${className}" href="#storyboard-${scene.toLowerCase()}" data-scene-link="${esc(scene)}" aria-label="Åbn scene ${esc(scene)} i storyboardet">${esc(scene)}</a>`).join('');
  }

  function parseShootCard(card) {
    const dateText = card.querySelector('.next-shoot-date span')?.textContent || card.querySelector('.next-shoot-date')?.textContent || '';
    const timeText = (card.querySelector('.next-shoot-time')?.textContent || '').replace(/^\s*[●•]\s*/, '').trim();
    return {
      card,
      dateKey: dateKeyFromText(dateText),
      dateText: dateText.trim(),
      time: timeText,
      scenes: sceneIds(card.querySelector('.next-shoot-scenes')),
      title: card.querySelector('h4')?.textContent.trim() || 'Optagelse',
      location: card.querySelector('p')?.textContent.trim() || '',
      pending: /afventer|medio|mangler/i.test(dateText) || card.classList.contains('pending')
    };
  }

  function taskData(card) {
    return {
      title: card.querySelector('.task-title')?.textContent.trim() || '',
      time: card.querySelector('.task-time')?.textContent.trim() || '',
      status: card.querySelector('.task-status')?.textContent.trim() || '',
      owner: [...card.querySelectorAll('.task-chip.owner')].map(item => item.textContent.replace(/^Ansvar:\s*/i, '').trim()).join(' · '),
      text: card.textContent.replace(/\s+/g, ' ').trim()
    };
  }

  function relevantTasks(taskCards, primary) {
    if (!primary) return [];
    const scenePattern = primary.scenes.length
      ? new RegExp(`\\b(?:${primary.scenes.map(scene => scene.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'i')
      : null;
    const generalPriority = [
      /godkend de endelige locations/i,
      /godkend den endelige casting/i,
      /forældretilladelser/i,
      /call sheet/i,
      /vælg og klargør tøj/i,
      /produktionskontrol/i
    ];

    return taskCards
      .map(taskData)
      .filter(task => task.title && !/^film scene/i.test(task.title))
      .filter(task => (scenePattern && scenePattern.test(task.text)) || generalPriority.some(pattern => pattern.test(task.title)))
      .filter((task, index, all) => all.findIndex(other => other.title === task.title) === index)
      .slice(0, 6);
  }

  function taskRowsMarkup(tasks) {
    if (!tasks.length) {
      return '<div class="v2-empty">Ingen kritiske mangler er registreret til denne optagelse.</div>';
    }
    return tasks.map(task => `<div class="v2-task-row">
      <span class="v2-task-marker" aria-hidden="true"></span>
      <div class="v2-task-main"><strong>${esc(task.title)}</strong>${task.time ? `<span>${esc(task.time)}</span>` : ''}</div>
      <div class="v2-task-side">${task.owner ? `<span class="v2-owner">${esc(task.owner)}</span>` : ''}<span class="v2-task-status">${esc(task.status || 'Åben')}</span></div>
    </div>`).join('');
  }

  function primaryMarkup(event, tasks) {
    if (!event) {
      return `<section class="v2-primary-card"><div class="v2-eyebrow">NÆSTE OPTAGELSE</div><h2>Ingen ny optagelse er planlagt</h2><p>Tilføj en optagedato, så holdet straks kan se næste prioritet.</p></section>`;
    }
    const firstScene = event.scenes[0] || '';
    return `<section class="v2-primary-card" aria-label="Næste optagelse">
      <div class="v2-primary-top">
        <div><div class="v2-eyebrow">HØJESTE PRIORITET · NÆSTE OPTAGELSE</div><div class="v2-primary-date">${esc(dateLabel(event.dateKey))}${event.time ? ` · KL. ${esc(event.time)}` : ''}</div></div>
        <span class="v2-planned-badge">PLANLAGT</span>
      </div>
      <div class="v2-primary-scenes">${sceneLinksMarkup(event.scenes, 'large')}</div>
      <h2>${esc(event.title)}</h2>
      <p class="v2-location">${esc(event.location)}</p>
      <div class="v2-primary-actions">
        ${firstScene ? `<a class="v2-action primary scene-portal-link" href="#storyboard-${firstScene.toLowerCase()}" data-scene-link="${esc(firstScene)}">Åbn storyboardet</a>` : ''}
        <button class="v2-action secondary" type="button" data-v2-open-tasks>Se mine opgaver</button>
      </div>
      <div class="v2-readiness">
        <div class="v2-section-heading"><div><span>FØR OPTAGELSEN</span><h3>Det skal være på plads</h3></div><small>${tasks.length} prioriterede punkter</small></div>
        <div class="v2-task-list">${taskRowsMarkup(tasks)}</div>
      </div>
    </section>`;
  }

  function upcomingMarkup(events) {
    if (!events.length) return '<div class="v2-empty">Ingen yderligere optagelser med fast dato.</div>';
    return events.map(event => `<article class="v2-upcoming-card">
      <div class="v2-upcoming-date"><span>${esc(dateLabel(event.dateKey))}</span>${event.time ? `<b>KL. ${esc(event.time)}</b>` : ''}</div>
      <div class="v2-upcoming-scenes">${sceneLinksMarkup(event.scenes)}</div>
      <h3>${esc(event.title)}</h3>
      <p>${esc(event.location)}</p>
    </article>`).join('');
  }

  function pendingMarkup(events, undatedText) {
    const cards = events.map(event => `<article class="v2-pending-row">
      <div>${sceneLinksMarkup(event.scenes)}</div>
      <div><strong>${esc(event.title)}</strong><span>${esc(event.location || event.dateText || 'Dato afventer')}</span></div>
      <span class="v2-waiting">AFVENTER</span>
    </article>`).join('');
    const extra = undatedText ? `<div class="v2-undated-note"><strong>Øvrige scener uden dato</strong><span>${esc(undatedText)}</span></div>` : '';
    return cards || extra ? `${cards}${extra}` : '<div class="v2-empty">Ingen scener afventer en dato.</div>';
  }

  function filmedSceneIds() {
    const ids = [...document.querySelectorAll('[data-storyboard-scene].filmed')]
      .map(element => element.dataset.storyboardScene)
      .filter(Boolean);
    if (ids.length) return [...new Set(ids)].sort((a, b) => a.localeCompare(b, 'da', { numeric: true }));
    const text = document.querySelector('.calendar-filmed')?.textContent || '';
    return [...new Set(text.match(/\b\d+[A-Z]\b/g) || [])].sort((a, b) => a.localeCompare(b, 'da', { numeric: true }));
  }

  function installStyles() {
    if (document.getElementById('sev-v2-priority-styles')) return;
    const style = document.createElement('style');
    style.id = 'sev-v2-priority-styles';
    style.textContent = `
      .v2-version-badge{display:inline-flex;align-items:center;gap:6px;margin-left:10px;padding:4px 8px;color:var(--current);background:rgba(77,217,192,.08);border:1px solid rgba(77,217,192,.25);border-radius:99px;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:800;letter-spacing:.05em}
      .v2-shell{display:grid;gap:24px}.v2-primary-card{padding:24px;background:linear-gradient(145deg,rgba(77,217,192,.1),rgba(20,40,50,.98) 42%);border:2px solid rgba(77,217,192,.42);border-radius:14px;box-shadow:0 18px 45px rgba(0,0,0,.18)}
      .v2-primary-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}.v2-eyebrow{color:var(--signal);font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:800;letter-spacing:.08em}.v2-primary-date{margin-top:7px;color:var(--text);font-family:'IBM Plex Mono',monospace;font-size:14px;font-weight:700;text-transform:uppercase}.v2-planned-badge{padding:5px 9px;color:#071512;background:var(--current);border-radius:99px;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:900}
      .v2-primary-scenes,.v2-upcoming-scenes{display:flex;flex-wrap:wrap;gap:7px}.v2-primary-scenes{margin-top:22px}.v2-scene-chip{display:inline-flex;align-items:center;justify-content:center;min-width:40px;padding:5px 8px;color:var(--current)!important;background:rgba(77,217,192,.08);border:1px solid rgba(77,217,192,.25);border-radius:6px;text-decoration:none!important;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:850}.v2-scene-chip.large{min-width:56px;padding:7px 11px;font-size:14px}.v2-scene-chip:hover{color:var(--text)!important;border-color:var(--signal)}
      .v2-primary-card h2{margin-top:12px;font-size:clamp(25px,4vw,38px);line-height:1.05}.v2-location{margin-top:8px;color:var(--text-muted);font-size:15px}.v2-primary-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:20px}.v2-action{display:inline-flex;align-items:center;justify-content:center;padding:10px 13px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;text-decoration:none!important}.v2-action.primary{color:#071512!important;background:var(--current);border:1px solid var(--current)}.v2-action.secondary{color:var(--text);background:transparent;border:1px solid var(--border-strong)}
      .v2-readiness{margin-top:23px;padding-top:20px;border-top:1px solid rgba(234,243,241,.13)}.v2-section-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:12px}.v2-section-heading span{color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:.07em}.v2-section-heading h3{margin-top:3px;font-size:18px}.v2-section-heading small{color:var(--text-muted);font-size:10px}.v2-task-list{display:grid;gap:7px}.v2-task-row{display:grid;grid-template-columns:10px minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 12px;background:rgba(14,26,32,.54);border:1px solid var(--border);border-radius:8px}.v2-task-marker{width:8px;height:8px;border:2px solid var(--signal);border-radius:50%}.v2-task-main{display:grid;gap:2px}.v2-task-main strong{font-size:12.5px}.v2-task-main span{color:var(--text-muted);font-size:10px}.v2-task-side{display:flex;align-items:center;justify-content:flex-end;flex-wrap:wrap;gap:6px}.v2-owner,.v2-task-status{padding:3px 6px;border-radius:5px;font-family:'IBM Plex Mono',monospace;font-size:8.5px}.v2-owner{color:var(--text);background:var(--bg-elevated-2)}.v2-task-status{color:var(--signal);border:1px solid rgba(246,176,66,.3)}
      .v2-section{padding:20px;background:var(--bg-elevated);border:1px solid var(--border-strong);border-radius:11px}.v2-section-title{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:14px}.v2-section-title h2{font-size:20px}.v2-section-title p{margin-top:3px;color:var(--text-muted);font-size:12px}.v2-section-title span{color:var(--current);font-family:'IBM Plex Mono',monospace;font-size:9px}.v2-upcoming-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px}.v2-upcoming-card{padding:16px;background:var(--bg-elevated-2);border:1px solid var(--border);border-left:3px solid var(--signal);border-radius:8px}.v2-upcoming-date{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase}.v2-upcoming-date b{color:var(--signal);font-size:9px}.v2-upcoming-scenes{margin-top:10px}.v2-upcoming-card h3{margin-top:10px;font-size:15px}.v2-upcoming-card p{margin-top:4px;color:var(--text-muted);font-size:11.5px}
      .v2-pending-list{display:grid;gap:7px}.v2-pending-row{display:grid;grid-template-columns:minmax(110px,auto) minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 12px;background:var(--bg-elevated-2);border:1px solid var(--border);border-radius:8px}.v2-pending-row>div:nth-child(2){display:grid;gap:2px}.v2-pending-row strong{font-size:12.5px}.v2-pending-row span{color:var(--text-muted);font-size:10.5px}.v2-waiting{padding:3px 6px;color:var(--text-muted)!important;border:1px solid var(--border-strong);border-radius:5px;font-family:'IBM Plex Mono',monospace;font-size:8px!important}.v2-undated-note{display:grid;gap:3px;padding:11px 12px;color:var(--text-muted);border:1px dashed var(--border-strong);border-radius:8px;font-size:11px}.v2-undated-note strong{color:var(--text)}
      .v2-filmed{display:flex;align-items:center;justify-content:space-between;gap:14px}.v2-filmed-copy h2{font-size:18px}.v2-filmed-copy p{margin-top:3px;color:var(--text-muted);font-size:11.5px}.v2-filmed-scenes{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px}.v2-filmed-scenes .v2-scene-chip{color:#4ade80!important;border-color:rgba(74,222,128,.35);background:rgba(74,222,128,.08)}
      .v2-details{overflow:hidden;background:var(--bg-elevated);border:1px solid var(--border-strong);border-radius:10px}.v2-details>summary{padding:15px 17px;color:var(--text);font-weight:700;cursor:pointer;list-style:none}.v2-details>summary::-webkit-details-marker{display:none}.v2-details>summary::after{content:'+';float:right;color:var(--current);font-family:'IBM Plex Mono',monospace}.v2-details[open]>summary::after{content:'−'}.v2-details-body{padding:0 17px 18px;border-top:1px solid var(--border)}.v2-details-body .plan-toolbar{margin-top:16px}.v2-empty{padding:15px;color:var(--text-muted);border:1px dashed var(--border-strong);border-radius:8px;font-size:12px}
      nav.tabs button[data-tab="next-scenes"]{display:none!important}
      @media(max-width:700px){.v2-primary-card{padding:18px}.v2-primary-top,.v2-section-heading,.v2-section-title,.v2-filmed{align-items:flex-start;flex-direction:column}.v2-task-row{grid-template-columns:10px minmax(0,1fr)}.v2-task-side{grid-column:2;justify-content:flex-start}.v2-pending-row{grid-template-columns:1fr}.v2-filmed-scenes{justify-content:flex-start}}
    `;
    document.head.appendChild(style);
  }

  function tuneNavigation() {
    const nav = document.querySelector('nav.tabs');
    if (!nav) return;
    const labels = { schedule: 'Plan og optagelser', storyboard: 'Storyboard', crew: 'TEAM', weather: 'Vejr' };
    nav.querySelectorAll('button[data-tab]').forEach(button => {
      if (labels[button.dataset.tab]) button.textContent = labels[button.dataset.tab];
      if (button.dataset.tab === 'next-scenes' || button.dataset.tab === 'contacts') button.style.display = 'none';
    });
    const scheduleButton = nav.querySelector(`button[data-tab="${PRIMARY_TAB}"]`);
    if (scheduleButton) scheduleButton.setAttribute('aria-label', 'Plan og optagelser. Se næste optagelse og højeste prioritet.');
  }

  function addVersionBadge() {
    if (document.querySelector('.v2-version-badge')) return;
    const meta = document.querySelector('.meta-line');
    if (!meta) return;
    const badge = document.createElement('span');
    badge.className = 'v2-version-badge';
    badge.textContent = `VERSION ${VERSION} · TEST`;
    meta.appendChild(badge);
  }

  function openTaskDetails() {
    const details = document.getElementById('v2-personal-details');
    if (!details) return;
    details.open = true;
    details.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => document.getElementById('task-person-filter')?.focus(), 450);
  }

  function build() {
    if (installed) return true;
    const panel = document.getElementById('panel-schedule');
    const nextPanel = document.getElementById('panel-next-scenes');
    const toolbar = panel?.querySelector('#person-task-selector');
    const taskList = panel?.querySelector('#production-plan-list');
    if (!panel || !nextPanel || !toolbar || !taskList) return false;

    const shootCards = [...nextPanel.querySelectorAll('.next-scenes-page-events .next-shoot-event')];
    if (!shootCards.length) return false;
    const shoots = shootCards.map(parseShootCard);
    const today = localDateKey();
    const datedFuture = shoots.filter(shoot => shoot.dateKey && shoot.dateKey >= today).sort((a, b) => a.dateKey.localeCompare(b.dateKey));
    const primary = datedFuture[0] || shoots.filter(shoot => shoot.dateKey).sort((a, b) => a.dateKey.localeCompare(b.dateKey))[0] || null;
    const upcoming = datedFuture.filter(shoot => shoot !== primary).slice(0, 3);
    const pending = shoots.filter(shoot => !shoot.dateKey);
    const priorityTasks = relevantTasks([...taskList.querySelectorAll('.task-card')], primary);
    const undatedNote = (nextPanel.querySelector('.next-scenes-page-note')?.textContent || '').replace(/^Scener uden dato:\s*/i, '').trim();
    const filmed = filmedSceneIds();
    const producerStatus = panel.querySelector('#producer-scene-status');

    toolbar.remove();
    taskList.remove();
    producerStatus?.remove();

    panel.innerHTML = `<div class="section-head"><h2>Plan og optagelser</h2><p>Start her. Den næste optagelse og de vigtigste mangler står altid øverst.</p></div>
      <div class="v2-shell">
        ${primaryMarkup(primary, priorityTasks)}
        <section class="v2-section"><div class="v2-section-title"><div><h2>Kommende planlagte optagelser</h2><p>Vises i den rækkefølge, de skal filmes.</p></div><span>${upcoming.length} MED FAST DATO</span></div><div class="v2-upcoming-grid">${upcomingMarkup(upcoming)}</div></section>
        <section class="v2-section"><div class="v2-section-title"><div><h2>Scener der afventer dato</h2><p>De fylder mindre, indtil optagelsen er låst.</p></div><span>AFVENTER</span></div><div class="v2-pending-list">${pendingMarkup(pending, undatedNote)}</div></section>
        <section class="v2-section v2-filmed"><div class="v2-filmed-copy"><h2>Filmede scener</h2><p>Åbn en scene for at se den i storyboardet.</p></div><div class="v2-filmed-scenes">${sceneLinksMarkup(filmed)}</div></section>
        <details class="v2-details" id="v2-personal-details"><summary>Se mine opgaver og deadlines</summary><div class="v2-details-body" id="v2-personal-mount"></div></details>
        ${producerStatus ? '<details class="v2-details" id="v2-scene-status-details"><summary>Se alle scener og locations</summary><div class="v2-details-body" id="v2-scene-status-mount"></div></details>' : ''}
      </div>`;

    panel.querySelector('#v2-personal-mount')?.append(toolbar, taskList);
    if (producerStatus) panel.querySelector('#v2-scene-status-mount')?.append(producerStatus);
    panel.querySelector('[data-v2-open-tasks]')?.addEventListener('click', openTaskDetails);

    installStyles();
    tuneNavigation();
    addVersionBadge();
    window.openPortalTab?.(PRIMARY_TAB);
    installed = true;
    document.documentElement.dataset.sevPortalVersion = VERSION;
    document.dispatchEvent(new CustomEvent('sev:v2-ready', { detail: { version: VERSION, build: BUILD } }));
    return true;
  }

  function tryBuild() {
    if (build()) observer?.disconnect();
  }

  let observer = new MutationObserver(tryBuild);
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  document.addEventListener('sev:portal-ready', () => window.setTimeout(tryBuild, 700));
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.setTimeout(tryBuild, 1200), { once: true });
  } else {
    window.setTimeout(tryBuild, 1200);
  }
  window.setTimeout(tryBuild, 2600);
})();
