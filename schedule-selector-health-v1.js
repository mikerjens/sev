(() => {
  'use strict';

  const VERSION = '2026-08-05-2032';
  const PEOPLE = {
    michael: { name: 'Michael Koba', role: 'Producer' },
    thomas: { name: 'Thomas Koba', role: 'Instruktør og filmmaker' },
    elisabeth: { name: 'Elisabeth Vitalis Tausen', role: 'Rådgiver · SANSIR' },
    tor: { name: 'Tór Verland Johansen', role: 'Direktør · SANSIR' },
    bogi: { name: 'Bogi Henriksen', role: 'Kreativ direktør · SANSIR' },
    runi: { name: 'Rúni Friis Kjær', role: 'Lysmand' }
  };

  function visibleTaskCount(list) {
    return [...list.querySelectorAll('.task-card')]
      .filter(card => card.offsetParent !== null || getComputedStyle(card).display !== 'none')
      .length;
  }

  function updateSummary() {
    const select = document.getElementById('task-person-filter');
    const list = document.getElementById('production-plan-list');
    const summary = document.getElementById('plan-summary');
    if (!select || !list || !summary) return false;

    const selectedId = select.value;
    const count = visibleTaskCount(list);

    if (selectedId === 'all') {
      summary.innerHTML = `<strong>Samlet plan · ${count} opgaver</strong><span>Alle personer, opgaver og milepæle.</span>`;
    } else {
      const person = PEOPLE[selectedId];
      if (!person) return false;
      summary.innerHTML = `<strong><span class="current-person">${person.name}</span> · ${count} ${count === 1 ? 'opgave' : 'opgaver'}</strong><span>${person.role} · kun egne opgaver og deadlines.</span>`;
    }

    summary.dataset.selectorHealth = VERSION;
    list.dataset.selectedSchedule = selectedId;
    list.dataset.visibleTaskCount = String(count);
    return true;
  }

  function verifySelection() {
    const select = document.getElementById('task-person-filter');
    const list = document.getElementById('production-plan-list');
    if (!select || !list) return false;

    updateSummary();

    const selectedId = select.value;
    const count = visibleTaskCount(list);
    if (selectedId !== 'all' && PEOPLE[selectedId] && count === 0) {
      console.error(`SEV schedule selector: intet personligt skema blev vist for ${selectedId}`);
      list.dataset.scheduleError = selectedId;
    } else {
      delete list.dataset.scheduleError;
    }
    return true;
  }

  function bindSelector() {
    const select = document.getElementById('task-person-filter');
    if (!select) return false;
    if (select.dataset.healthListener !== VERSION) {
      select.dataset.healthListener = VERSION;
      select.addEventListener('change', () => {
        window.setTimeout(verifySelection, 0);
        window.setTimeout(verifySelection, 120);
        window.setTimeout(verifySelection, 300);
      });
    }
    window.setTimeout(verifySelection, 120);
    return true;
  }

  function install() {
    return bindSelector() && verifySelection();
  }

  if (install()) return;

  const observer = new MutationObserver(() => {
    if (!install()) return;
    observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => {
    install();
    observer.disconnect();
  }, 10000);
})();