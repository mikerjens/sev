(() => {
  function addStyles() {
    if (document.getElementById('personal-task-selector-styles')) return;

    const style = document.createElement('style');
    style.id = 'personal-task-selector-styles';
    style.textContent = `
      #person-task-selector{border:1px solid rgba(246,176,66,.55);box-shadow:0 0 0 3px rgba(246,176,66,.035)}
      #task-person-filter{border:2px solid rgba(246,176,66,.88)!important;font-size:15px;font-weight:700;cursor:pointer}
      #task-person-filter:focus{outline:none;box-shadow:0 0 0 4px rgba(246,176,66,.20)}
      #person-task-selector label{color:var(--signal);font-weight:800}
    `;
    document.head.appendChild(style);
  }

  function applyCorrectionOnce() {
    addStyles();

    const panel = document.getElementById('panel-schedule');
    const toolbar = panel?.querySelector('.plan-toolbar');
    const select = document.getElementById('task-person-filter');
    const label = toolbar?.querySelector('label[for="task-person-filter"]');
    const intro = panel?.querySelector('.section-head p');

    if (toolbar) {
      toolbar.id = 'person-task-selector';
      toolbar.setAttribute('aria-label', 'Vælg dit navn og se dine personlige opgaver');
    }

    if (select) {
      select.setAttribute('aria-label', 'Vælg dit navn og se dine egne opgaver');
    }

    if (label) {
      label.textContent = 'VÆLG DIT NAVN – DINE OPGAVER VISES HER';
    }

    if (intro) {
      intro.textContent = 'Vælg dit navn direkte i feltet nedenfor. Derefter vises kun dine egne opgaver, deadlines og næste skridt.';
    }

    panel?.querySelector('.start-here-box')?.remove();

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
  }

  applyCorrectionOnce();
  window.setTimeout(applyCorrectionOnce, 250);
})();
