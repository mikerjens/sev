(() => {
  const VERSION = '2026-08-05-1455';
  const STORAGE_KEY = 'sev-task-person';
  const people = [
    ['all', 'Alle opgaver'],
    ['michael', 'Michael Koba · Producer'],
    ['thomas', 'Thomas Koba · Instruktør og filmmaker'],
    ['elisabeth', 'Elisabeth Vitalis Tausen · SANSIR'],
    ['tor', 'Tór Verland Johansen · SANSIR'],
    ['bogi', 'Bogi Henriksen · SANSIR']
  ];

  function addStyles() {
    if (document.getElementById('person-schedule-selector-styles')) return;
    const style = document.createElement('style');
    style.id = 'person-schedule-selector-styles';
    style.textContent = `
      #person-task-selector{position:relative;z-index:5;display:grid!important;grid-template-columns:minmax(240px,360px) 1fr!important;gap:14px!important;align-items:end!important;margin:0 0 18px!important;padding:17px!important;background:var(--bg-elevated)!important;border:2px solid rgba(246,176,66,.88)!important;border-radius:10px!important;box-shadow:0 0 0 4px rgba(246,176,66,.06)!important}
      #person-task-selector label{display:block!important;margin-bottom:7px!important;color:var(--signal)!important;font-family:'IBM Plex Mono',monospace!important;font-size:11px!important;font-weight:800!important;letter-spacing:.05em!important;text-transform:uppercase!important}
      #task-person-filter{display:block!important;width:100%!important;min-height:46px!important;padding:11px 13px!important;color:var(--text)!important;background:var(--bg-elevated-2)!important;border:2px solid var(--current)!important;border-radius:8px!important;font-size:15px!important;font-weight:700!important;visibility:visible!important;opacity:1!important}
      #task-person-filter:focus{outline:none!important;box-shadow:0 0 0 4px rgba(77,217,192,.16)!important}
      #person-task-selector .plan-summary{display:block!important;visibility:visible!important;opacity:1!important}
      .person-selector-help{margin-top:6px;color:var(--text-muted);font-size:11.5px}
      @media(max-width:650px){#person-task-selector{grid-template-columns:1fr!important}}
    `;
    document.head.appendChild(style);
  }

  function createFallback(panel) {
    const toolbar = document.createElement('div');
    toolbar.className = 'plan-toolbar';
    toolbar.id = 'person-task-selector';
    toolbar.dataset.selectorVersion = VERSION;
    toolbar.innerHTML = `
      <div>
        <label for="task-person-filter">Vælg dit navn – se dit skema</label>
        <select id="task-person-filter" aria-label="Vælg dit navn og se dine egne opgaver">
          ${people.map(([id, label]) => `<option value="${id}">${label}</option>`).join('')}
        </select>
        <div class="person-selector-help">Når du vælger dit navn, vises kun dine egne opgaver og deadlines.</div>
      </div>
      <div class="plan-summary" id="plan-summary"><strong>Alle opgaver</strong>Vælg et navn for at se det personlige skema.</div>
    `;

    const head = panel.querySelector('.section-head');
    if (head) head.insertAdjacentElement('afterend', toolbar);
    else panel.prepend(toolbar);

    const select = toolbar.querySelector('#task-person-filter');
    select.addEventListener('change', event => fallbackFilter(event.target.value));
    return toolbar;
  }

  function fallbackFilter(selectedId) {
    const selectedLabel = people.find(([id]) => id === selectedId)?.[1] || 'Alle opgaver';
    const selectedName = selectedLabel.split(' · ')[0];
    document.querySelectorAll('#production-plan-list .task-card').forEach(card => {
      if (selectedId === 'all') {
        card.hidden = false;
        return;
      }
      const ownerText = Array.from(card.querySelectorAll('.task-chip.owner'))
        .map(node => node.textContent.trim())
        .join(' ');
      const bureauMatch = ['elisabeth', 'tor', 'bogi'].includes(selectedId) && /Elisabeth|Tór|Bogi/i.test(ownerText);
      card.hidden = !(ownerText.includes(selectedName) || bureauMatch);
    });
    const summary = document.getElementById('plan-summary');
    if (summary) summary.innerHTML = `<strong>${selectedLabel}</strong>Personligt skema og egne opgaver.`;
  }

  function install() {
    const panel = document.getElementById('panel-schedule');
    if (!panel) return false;
    addStyles();

    let select = document.getElementById('task-person-filter');
    let toolbar = select?.closest('.plan-toolbar');
    if (!select || !toolbar) {
      toolbar = createFallback(panel);
      select = toolbar.querySelector('#task-person-filter');
    }

    toolbar.id = 'person-task-selector';
    toolbar.dataset.selectorVersion = VERSION;
    toolbar.hidden = false;
    toolbar.removeAttribute('aria-hidden');

    const label = toolbar.querySelector('label[for="task-person-filter"]');
    if (label) label.textContent = 'VÆLG DIT NAVN – SE DIT SKEMA';
    if (!toolbar.querySelector('.person-selector-help')) {
      const help = document.createElement('div');
      help.className = 'person-selector-help';
      help.textContent = 'Når du vælger dit navn, vises kun dine egne opgaver og deadlines.';
      select.insertAdjacentElement('afterend', help);
    }

    const sectionHead = panel.querySelector('.section-head');
    if (sectionHead && sectionHead.nextElementSibling !== toolbar) {
      sectionHead.insertAdjacentElement('afterend', toolbar);
    } else if (!sectionHead && panel.firstElementChild !== toolbar) {
      panel.prepend(toolbar);
    }

    let saved = 'all';
    try { saved = localStorage.getItem(STORAGE_KEY) || select.value || 'all'; } catch (_) {}
    if (Array.from(select.options).some(option => option.value === saved)) {
      select.value = saved;
    }
    return true;
  }

  install();
  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    install();
    if (attempts >= 100) window.clearInterval(timer);
  }, 100);
  window.addEventListener('load', install, { once: true });
})();
