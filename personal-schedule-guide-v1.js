(() => {
  'use strict';

  const VERSION = '2026-08-05-2134';
  const GUIDE_ID = 'personal-schedule-guide';

  function addStyles() {
    if (document.getElementById('personal-schedule-guide-styles')) return;

    const style = document.createElement('style');
    style.id = 'personal-schedule-guide-styles';
    style.textContent = `
      #${GUIDE_ID} {
        display:flex;
        align-items:flex-start;
        gap:12px;
        margin:0 0 12px;
        padding:14px 16px;
        color:var(--text);
        background:rgba(246,176,66,.11);
        border:2px solid rgba(246,176,66,.72);
        border-radius:9px;
      }
      #${GUIDE_ID} .personal-schedule-arrow {
        flex:0 0 auto;
        color:var(--signal);
        font-size:23px;
        font-weight:800;
        line-height:1;
      }
      #${GUIDE_ID} strong {
        display:block;
        color:var(--signal);
        font-family:'Space Grotesk',sans-serif;
        font-size:16px;
        line-height:1.25;
      }
      #${GUIDE_ID} span {
        display:block;
        margin-top:3px;
        color:var(--text);
        font-size:13px;
        line-height:1.45;
      }
      #task-person-filter {
        border-color:var(--signal)!important;
        box-shadow:0 0 0 4px rgba(246,176,66,.12);
      }
      @media(max-width:650px) {
        #${GUIDE_ID} { padding:13px 14px; }
        #${GUIDE_ID} strong { font-size:15px; }
      }
    `;
    document.head.appendChild(style);
  }

  function selectedPersonLabel(select) {
    const text = select.options[select.selectedIndex]?.textContent || '';
    return text.split('·')[0].trim();
  }

  function updateGuide(select, guide) {
    if (select.value === 'all') {
      guide.innerHTML = `
        <div class="personal-schedule-arrow" aria-hidden="true">↓</div>
        <div>
          <strong>VÆLG DIT NAVN HER</strong>
          <span>Så skjules de andre opgaver, og du ser straks kun dit eget skema.</span>
        </div>`;
      return;
    }

    const name = selectedPersonLabel(select);
    guide.innerHTML = `
      <div class="personal-schedule-arrow" aria-hidden="true">✓</div>
      <div>
        <strong>DU SER NU DIT PERSONLIGE SKEMA</strong>
        <span>Planen viser kun opgaver og deadlines for ${name}.</span>
      </div>`;
  }

  function install() {
    const select = document.getElementById('task-person-filter');
    if (!select) return false;

    addStyles();

    const label = select.closest('div')?.querySelector('label');
    if (label) label.textContent = 'Vælg dit navn – se dit eget skema';

    select.setAttribute('aria-describedby', GUIDE_ID);
    select.setAttribute('title', 'Vælg dit navn for at se dit eget skema');

    let guide = document.getElementById(GUIDE_ID);
    if (!guide) {
      guide = document.createElement('div');
      guide.id = GUIDE_ID;
      guide.dataset.version = VERSION;
      guide.setAttribute('role', 'status');
      guide.setAttribute('aria-live', 'polite');

      const toolbar = select.closest('.plan-toolbar');
      if (toolbar) toolbar.insertAdjacentElement('beforebegin', guide);
      else select.parentElement?.insertAdjacentElement('beforebegin', guide);
    }

    updateGuide(select, guide);

    if (!select.dataset.personalGuideListener) {
      select.dataset.personalGuideListener = VERSION;
      select.addEventListener('change', () => {
        window.setTimeout(() => updateGuide(select, guide), 0);
      });
    }

    return true;
  }

  document.addEventListener('sev:portal-ready', install, { once: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();