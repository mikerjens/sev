(() => {
  const VERSION = '2026-08-05-1535';
  const STORAGE_KEY = 'sev-task-person';

  const people = {
    all: {
      label: 'Alle opgaver',
      role: 'Samlet produktionsplan',
      aliases: []
    },
    michael: {
      label: 'Michael Koba',
      role: 'Producer',
      aliases: ['Michael Koba']
    },
    thomas: {
      label: 'Thomas Koba',
      role: 'Instruktør og filmmaker',
      aliases: ['Thomas Koba']
    },
    elisabeth: {
      label: 'Elisabeth Vitalis Tausen',
      role: 'SANSIR',
      aliases: ['Elisabeth Vitalis Tausen', 'Tór Verland Johannesen', 'Tór Verland Johansen', 'Bogi Henriksen']
    },
    tor: {
      label: 'Tór Verland Johannesen',
      role: 'SANSIR',
      aliases: ['Elisabeth Vitalis Tausen', 'Tór Verland Johannesen', 'Tór Verland Johansen', 'Bogi Henriksen']
    },
    bogi: {
      label: 'Bogi Henriksen',
      role: 'SANSIR',
      aliases: ['Elisabeth Vitalis Tausen', 'Tór Verland Johannesen', 'Tór Verland Johansen', 'Bogi Henriksen']
    }
  };

  let selectedId = 'all';
  let observedList = null;
  let observer = null;

  function selectedFromStorage() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return people[value] ? value : 'all';
    } catch (_) {
      return 'all';
    }
  }

  function saveSelection(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (_) {}
  }

  function setVisible(element, visible) {
    if (!element) return;
    element.hidden = !visible;
    element.style.setProperty('display', visible ? '' : 'none', visible ? '' : 'important');
    if (visible) element.removeAttribute('aria-hidden');
    else element.setAttribute('aria-hidden', 'true');
  }

  function ownerText(card) {
    const chips = Array.from(card.querySelectorAll('.task-chip.owner'));
    const text = chips.length
      ? chips.map(node => node.textContent.trim()).join(' · ')
      : card.textContent;
    return text.replace(/\s+/g, ' ').trim();
  }

  function cardMatches(card, personId) {
    if (personId === 'all') return true;
    const text = ownerText(card).toLocaleLowerCase('da-DK');
    return people[personId].aliases.some(alias => text.includes(alias.toLocaleLowerCase('da-DK')));
  }

  function updateDateHeadings(list) {
    const children = Array.from(list.children);
    children.forEach((node, index) => {
      if (!node.classList.contains('plan-date')) return;
      let hasVisibleItem = false;
      for (let cursor = index + 1; cursor < children.length; cursor += 1) {
        const candidate = children[cursor];
        if (candidate.classList.contains('plan-date')) break;
        if ((candidate.classList.contains('task-card') || candidate.classList.contains('milestone')) && !candidate.hidden && candidate.style.display !== 'none') {
          hasVisibleItem = true;
          break;
        }
      }
      setVisible(node, hasVisibleItem);
    });
  }

  function ensurePersonalHeading(main) {
    let heading = document.getElementById('personal-schedule-heading');
    if (!heading) {
      heading = document.createElement('div');
      heading.id = 'personal-schedule-heading';
      heading.style.cssText = 'margin:0 0 10px;padding:10px 12px;color:var(--current);background:rgba(77,217,192,.06);border:1px solid rgba(77,217,192,.18);border-radius:7px;font-family:IBM Plex Mono,monospace;font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase';
    }
    if (heading.parentElement !== main) main.prepend(heading);
    return heading;
  }

  function reorderScheduleContent() {
    const main = document.getElementById('schedule-main-column');
    const list = document.getElementById('production-plan-list');
    if (!main || !list) return;

    const heading = ensurePersonalHeading(main);
    const bureauNote = document.querySelector('#panel-schedule .bureau-note');
    const producerStatus = document.getElementById('producer-scene-status');

    main.appendChild(heading);
    if (bureauNote) main.appendChild(bureauNote);
    main.appendChild(list);
    if (producerStatus) main.appendChild(producerStatus);
  }

  function updateSummary(visibleCount, totalCount) {
    const summary = document.getElementById('plan-summary');
    const heading = document.getElementById('personal-schedule-heading');
    const person = people[selectedId] || people.all;

    if (summary) {
      if (selectedId === 'all') {
        summary.innerHTML = `<strong>Samlet plan · ${totalCount} opgaver</strong><span>Alle personer, opgaver og milepæle.</span>`;
      } else {
        summary.innerHTML = `<strong><span class="current-person">${person.label}</span> · ${visibleCount} opgaver</strong><span>${person.role} · kun egne opgaver og deadlines.</span>`;
      }
    }

    if (heading) {
      heading.textContent = selectedId === 'all'
        ? 'Samlet opgaveplan'
        : `${person.label} · personligt skema`;
    }
  }

  function applyFilter(personId = selectedId) {
    selectedId = people[personId] ? personId : 'all';

    const select = document.getElementById('task-person-filter');
    if (select && select.value !== selectedId && Array.from(select.options).some(option => option.value === selectedId)) {
      select.value = selectedId;
    }

    reorderScheduleContent();

    const list = document.getElementById('production-plan-list');
    if (!list) return false;

    const cards = Array.from(list.querySelectorAll('.task-card'));
    let visibleCount = 0;
    cards.forEach(card => {
      const visible = cardMatches(card, selectedId);
      setVisible(card, visible);
      if (visible) visibleCount += 1;
    });

    list.querySelectorAll('.milestone').forEach(item => setVisible(item, selectedId === 'all'));
    list.querySelectorAll('.empty-plan').forEach(item => setVisible(item, false));
    updateDateHeadings(list);

    let empty = document.getElementById('personal-schedule-empty');
    if (selectedId !== 'all' && visibleCount === 0) {
      if (!empty) {
        empty = document.createElement('div');
        empty.id = 'personal-schedule-empty';
        empty.className = 'empty-plan';
        list.appendChild(empty);
      }
      empty.textContent = `Der er endnu ingen opgaver registreret på ${people[selectedId].label}.`;
      setVisible(empty, true);
    } else if (empty) {
      setVisible(empty, false);
    }

    const bureauNote = document.querySelector('#panel-schedule .bureau-note');
    setVisible(bureauNote, selectedId === 'all' || ['elisabeth', 'tor', 'bogi'].includes(selectedId));

    updateSummary(visibleCount, cards.length);
    document.documentElement.dataset.selectedSchedulePerson = selectedId;
    return true;
  }

  function observeTaskList() {
    const list = document.getElementById('production-plan-list');
    if (!list || list === observedList) return;
    observer?.disconnect();
    observedList = list;
    observer = new MutationObserver(() => window.setTimeout(() => applyFilter(selectedId), 0));
    observer.observe(list, { childList: true, subtree: true });
  }

  function install() {
    const select = document.getElementById('task-person-filter');
    if (!select) return false;

    if (!people[select.value]) select.value = 'all';
    if (!people[selectedId]) selectedId = selectedFromStorage();

    observeTaskList();
    applyFilter(selectedId);
    return true;
  }

  document.addEventListener('change', event => {
    if (event.target?.id !== 'task-person-filter') return;
    const value = people[event.target.value] ? event.target.value : 'all';
    selectedId = value;
    saveSelection(value);
    window.setTimeout(() => applyFilter(value), 0);
    window.setTimeout(() => applyFilter(value), 80);
    window.setTimeout(() => applyFilter(value), 300);
  }, true);

  selectedId = selectedFromStorage();
  install();
  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    install();
    if (attempts >= 120) window.clearInterval(timer);
  }, 100);
  window.addEventListener('load', () => applyFilter(selectedId), { once: true });
})();