(() => {
  function addStyles() {
    if (document.getElementById('personal-task-entry-styles')) return;

    const style = document.createElement('style');
    style.id = 'personal-task-entry-styles';
    style.textContent = `
      .start-here-box{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:14px;align-items:center;margin:0 0 14px;padding:16px 18px;background:rgba(246,176,66,.13);border:2px solid rgba(246,176,66,.82);border-radius:9px;box-shadow:0 0 0 4px rgba(246,176,66,.05)}
      .start-here-badge{padding:5px 8px;border-radius:5px;background:var(--signal);color:#10191d;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:800;letter-spacing:.08em;white-space:nowrap}
      .start-here-title{font-family:'Space Grotesk',sans-serif;font-size:17px;font-weight:700;color:var(--text)}
      .start-here-copy{margin-top:3px;color:var(--text-muted);font-size:13px;line-height:1.45}
      .start-here-button{padding:10px 13px;border:1px solid rgba(246,176,66,.9);border-radius:7px;background:rgba(246,176,66,.17);color:var(--text);font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.035em;cursor:pointer;white-space:nowrap}
      .start-here-button:hover,.start-here-button:focus-visible{background:rgba(246,176,66,.28);outline:none}
      #person-task-selector{border:2px solid rgba(246,176,66,.74);box-shadow:0 0 0 4px rgba(246,176,66,.06)}
      #task-person-filter{border:2px solid rgba(246,176,66,.88)!important;font-size:15px;font-weight:700;cursor:pointer}
      #task-person-filter:focus{outline:none;box-shadow:0 0 0 4px rgba(246,176,66,.22)}
      .person-filter-highlight{animation:personFilterPulse .8s ease-in-out 3}
      @keyframes personFilterPulse{0%,100%{box-shadow:0 0 0 4px rgba(246,176,66,.12)}50%{box-shadow:0 0 0 10px rgba(246,176,66,.28)}}
      @media(max-width:720px){.start-here-box{grid-template-columns:1fr}.start-here-badge{justify-self:start}.start-here-button{width:100%;text-align:left}.start-here-title{font-size:16px}}
    `;
    document.head.appendChild(style);
  }

  function focusPersonTaskSelector() {
    if (typeof window.openPortalTab === 'function') {
      window.openPortalTab('schedule');
    } else {
      document.querySelector('nav.tabs button[data-tab="schedule"]')?.click();
    }

    const select = document.getElementById('task-person-filter');
    if (!select) return;

    select.scrollIntoView({ behavior: 'smooth', block: 'center' });
    select.focus({ preventScroll: true });
    select.classList.add('person-filter-highlight');
    window.setTimeout(() => select.classList.remove('person-filter-highlight'), 3200);
  }

  window.focusPersonTaskSelector = focusPersonTaskSelector;

  function installStartHere() {
    const panel = document.getElementById('panel-schedule');
    const toolbar = panel?.querySelector('.plan-toolbar');
    if (!panel || !toolbar) return;

    toolbar.id = 'person-task-selector';
    toolbar.setAttribute('aria-label', 'Choose your name to see your personal tasks');

    const select = document.getElementById('task-person-filter');
    if (select) {
      select.setAttribute('aria-label', 'Vælg dit navn og se dine egne opgaver');
    }

    if (panel.querySelector('.start-here-box')) return;

    const box = document.createElement('div');
    box.className = 'start-here-box';
    box.innerHTML = `
      <div class="start-here-badge">START HER</div>
      <div>
        <div class="start-here-title">Vælg dit navn og se præcis, hvad du skal gøre</div>
        <div class="start-here-copy">Brug navnefeltet nedenfor. Derefter vises kun dine egne opgaver, deadlines og næste skridt.</div>
      </div>
      <button class="start-here-button" type="button">VÆLG MIT NAVN ↓</button>
    `;
    toolbar.parentNode.insertBefore(box, toolbar);
    box.querySelector('.start-here-button')?.addEventListener('click', focusPersonTaskSelector);
  }

  function applyCorrectionOnce() {
    addStyles();

    const bogiOption = document.querySelector('#task-person-filter option[value="bogi"]');
    if (bogiOption && bogiOption.textContent !== 'Bogi Henriksen · Kreativ direktør / SANSIR.fo') {
      bogiOption.textContent = 'Bogi Henriksen · Kreativ direktør / SANSIR.fo';
    }

    document.querySelectorAll('.crew-card').forEach(card => {
      const name = card.querySelector('.crew-card-name');
      const role = card.querySelector('.crew-card-role');
      if (!name || !['Bogi', 'Bogi Henriksen'].includes(name.textContent.trim())) return;

      if (name.textContent.trim() !== 'Bogi Henriksen') name.textContent = 'Bogi Henriksen';
      if (role && role.textContent.trim() !== 'Kreativ direktør / SANSIR.fo') {
        role.textContent = 'Kreativ direktør / SANSIR.fo';
      }
    });

    document.querySelectorAll('.bureau-note, .task-chip.owner, #plan-summary').forEach(element => {
      if (!element.textContent.includes('Bogi') || element.textContent.includes('Bogi Henriksen')) return;
      element.innerHTML = element.innerHTML.replace(/\bBogi\b/g, 'Bogi Henriksen');
    });

    installStartHere();
  }

  applyCorrectionOnce();
  window.setTimeout(applyCorrectionOnce, 250);
})();
