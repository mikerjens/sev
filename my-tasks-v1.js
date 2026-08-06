(() => {
  'use strict';

  const VERSION = '2026-08-06-1241';
  const SOURCE_SELECT_ID = 'task-person-filter';
  const MY_SELECT_ID = 'my-tasks-person-filter';

  function addStyles() {
    if (document.getElementById('my-tasks-styles')) return;
    const style = document.createElement('style');
    style.id = 'my-tasks-styles';
    style.textContent = `
      #panel-my-tasks .my-tasks-picker {
        margin: 0 0 24px;
        padding: 22px;
        border: 1px solid rgba(78, 213, 199, .28);
        border-left: 4px solid #4ed5c7;
        border-radius: 14px;
        background: rgba(15, 42, 51, .72);
      }
      #panel-my-tasks .my-tasks-label {
        display: block;
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 800;
        letter-spacing: .09em;
        text-transform: uppercase;
        color: #4ed5c7;
      }
      #panel-my-tasks .my-tasks-help {
        margin: 0 0 14px;
        color: #a9bbc0;
        line-height: 1.45;
      }
      #${MY_SELECT_ID} {
        width: 100%;
        min-height: 50px;
        padding: 0 14px;
        border: 2px solid #f4ad35;
        border-radius: 10px;
        background: #102d36;
        color: #edf7f7;
        font: inherit;
        font-weight: 700;
      }
      #panel-my-tasks .my-tasks-empty {
        padding: 28px;
        border: 1px dashed rgba(169, 187, 192, .35);
        border-radius: 14px;
        color: #a9bbc0;
        text-align: center;
      }
      #panel-my-tasks #my-tasks-summary {
        margin-bottom: 18px;
      }
      @media (max-width: 700px) {
        #panel-my-tasks .my-tasks-picker { padding: 18px; }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureTabAndPanel() {
    const nav = document.querySelector('nav.tabs');
    const main = document.querySelector('main');
    if (!nav || !main) return false;

    let button = nav.querySelector('button[data-tab="my-tasks"]');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.dataset.tab = 'my-tasks';
      const scheduleButton = nav.querySelector('button[data-tab="schedule"]');
      if (scheduleButton?.nextSibling) nav.insertBefore(button, scheduleButton.nextSibling);
      else nav.appendChild(button);
    }
    button.textContent = 'My tasks';
    button.setAttribute('aria-label', 'Vælg dit navn og se dine egne opgaver');
    button.onclick = () => {
      window.openPortalTab?.('my-tasks');
      window.setTimeout(() => refreshMyTasks(false), 60);
    };

    let panel = document.getElementById('panel-my-tasks');
    if (!panel) {
      panel = document.createElement('section');
      panel.className = 'panel';
      panel.id = 'panel-my-tasks';
      const schedulePanel = document.getElementById('panel-schedule');
      if (schedulePanel?.nextSibling) main.insertBefore(panel, schedulePanel.nextSibling);
      else main.appendChild(panel);
    }

    if (!panel.dataset.myTasksBuilt) {
      panel.dataset.myTasksBuilt = VERSION;
      panel.innerHTML = `
        <div class="section-head">
          <h2>My tasks</h2>
          <p>Vælg dit navn og se straks kun dine egne opgaver og deadlines.</p>
        </div>
        <div class="my-tasks-picker">
          <label class="my-tasks-label" for="${MY_SELECT_ID}">Vælg dit navn</label>
          <p class="my-tasks-help">Når du vælger dit navn, vises dit personlige skema nedenfor. Det samme valg bruges også på Plan og optagelser.</p>
          <select id="${MY_SELECT_ID}">
            <option value="">— Vælg dit navn —</option>
          </select>
        </div>
        <div id="my-tasks-summary"></div>
        <div id="my-tasks-list" class="my-tasks-empty">Vælg dit navn for at se dine opgaver.</div>
      `;

      panel.querySelector(`#${MY_SELECT_ID}`)?.addEventListener('change', event => {
        const value = event.target.value;
        if (!value) {
          showEmpty();
          return;
        }
        applyNameToMainSchedule(value);
      });
    }

    return true;
  }

  function syncNameOptions() {
    const source = document.getElementById(SOURCE_SELECT_ID);
    const target = document.getElementById(MY_SELECT_ID);
    if (!source || !target) return false;

    const current = target.value || (source.value !== 'all' ? source.value : '');
    const options = [...source.options]
      .filter(option => option.value && option.value !== 'all');

    target.innerHTML = '<option value="">— Vælg dit navn —</option>';
    options.forEach(sourceOption => {
      const option = document.createElement('option');
      option.value = sourceOption.value;
      option.textContent = sourceOption.textContent;
      target.appendChild(option);
    });

    if ([...target.options].some(option => option.value === current)) {
      target.value = current;
    }
    return true;
  }

  function showEmpty() {
    const summary = document.getElementById('my-tasks-summary');
    const list = document.getElementById('my-tasks-list');
    if (summary) summary.innerHTML = '';
    if (list) {
      list.className = 'my-tasks-empty';
      list.textContent = 'Vælg dit navn for at se dine opgaver.';
    }
  }

  function copyPersonalSchedule() {
    const sourceSummary = document.getElementById('plan-summary');
    const sourceList = document.getElementById('production-plan-list');
    const targetSummary = document.getElementById('my-tasks-summary');
    const targetList = document.getElementById('my-tasks-list');
    if (!sourceList || !targetList) return;

    if (targetSummary) targetSummary.innerHTML = sourceSummary?.innerHTML || '';
    targetList.className = '';
    targetList.innerHTML = sourceList.innerHTML || '<div class="my-tasks-empty">Der er ingen opgaver registreret på dette navn.</div>';
    targetList.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
  }

  function applyNameToMainSchedule(value) {
    const source = document.getElementById(SOURCE_SELECT_ID);
    if (!source || ![...source.options].some(option => option.value === value)) return;

    source.value = value;
    try { localStorage.setItem('sev-task-person', value); } catch (_) {}
    source.dispatchEvent(new Event('change', { bubbles: true }));

    window.setTimeout(copyPersonalSchedule, 180);
    window.setTimeout(copyPersonalSchedule, 420);
  }

  function refreshMyTasks(forceRender) {
    if (!ensureTabAndPanel()) return;
    addStyles();
    if (!syncNameOptions()) return;

    const source = document.getElementById(SOURCE_SELECT_ID);
    const target = document.getElementById(MY_SELECT_ID);
    if (!source || !target) return;

    if (!target.value && source.value && source.value !== 'all') target.value = source.value;
    if (!target.value) {
      showEmpty();
      return;
    }

    if (forceRender || source.value !== target.value) applyNameToMainSchedule(target.value);
    else window.setTimeout(copyPersonalSchedule, 80);
  }

  function install() {
    refreshMyTasks(false);

    const source = document.getElementById(SOURCE_SELECT_ID);
    if (source && !source.dataset.myTasksSync) {
      source.dataset.myTasksSync = VERSION;
      source.addEventListener('change', () => {
        window.setTimeout(() => {
          syncNameOptions();
          const target = document.getElementById(MY_SELECT_ID);
          if (target && source.value !== 'all') target.value = source.value;
          if (document.getElementById('panel-my-tasks')?.classList.contains('active')) copyPersonalSchedule();
        }, 460);
      });
    }
  }

  document.addEventListener('sev:portal-ready', () => window.setTimeout(install, 0));
  document.addEventListener('sev:v2-ready', () => window.setTimeout(install, 0));
  document.addEventListener('DOMContentLoaded', () => window.setTimeout(install, 700), { once: true });

  install();
  window.setTimeout(install, 900);
  window.setTimeout(install, 2200);
})();
