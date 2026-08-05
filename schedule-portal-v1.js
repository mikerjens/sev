(() => {
  const VERSION = '2026-08-05-1620';
  const STORAGE_KEY = 'sev-task-person';
  const ELISABETH_TASK_ID = 'task-scene-4a-elisabeth';
  const ELISABETH_DATE_ID = 'task-scene-4a-elisabeth-date';
  const ROOM_PENDING_ID = 'room-scenes-pending';
  const ROOM_SCENES = ['1A', '2A', '2B', '15A', '16A'];
  const ROOM_COMMENT = 'Thomas scouter efter location. Huset skal helst passe med vinduerne i scene 9. Scenerne filmes ikke 9. august. Ny optagedato fastsættes først, når location er på plads og godkendt.';

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

  let selectedId = readSelection();
  let panelObserver = null;
  let syncQueued = false;

  function readSelection() {
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
    if (element.hidden === visible) element.hidden = !visible;

    if (visible) {
      if (element.style.display === 'none') element.style.removeProperty('display');
      if (element.hasAttribute('aria-hidden')) element.removeAttribute('aria-hidden');
    } else {
      if (element.style.display !== 'none') element.style.setProperty('display', 'none', 'important');
      if (element.getAttribute('aria-hidden') !== 'true') element.setAttribute('aria-hidden', 'true');
    }
  }

  function ownerText(card) {
    if (card.dataset.personId && people[card.dataset.personId]) {
      return people[card.dataset.personId].label;
    }
    const chips = Array.from(card.querySelectorAll('.task-chip.owner'));
    const text = chips.length
      ? chips.map(node => node.textContent.trim()).join(' · ')
      : card.textContent;
    return text.replace(/\s+/g, ' ').trim();
  }

  function cardMatches(card, personId) {
    if (personId === 'all') return true;
    if (card.dataset.personId === personId) return true;
    const text = ownerText(card).toLocaleLowerCase('da-DK');
    return people[personId].aliases.some(alias => text.includes(alias.toLocaleLowerCase('da-DK')));
  }

  function elisabethTaskMarkup() {
    return `
      <div class="plan-date" id="${ELISABETH_DATE_ID}" data-version="${VERSION}">Før optagelsen · 10. august</div>
      <article class="task-card high" id="${ELISABETH_TASK_ID}" data-version="${VERSION}" data-person-id="elisabeth">
        <div class="task-top">
          <div>
            <div class="task-title">Find børn og forældrekontakter til scene 4A</div>
            <div class="task-time">Senest før optagelsen mandag 10. august kl. 21:30</div>
          </div>
          <span class="task-status">Ikke startet</span>
        </div>
        <div class="task-meta">
          <span class="task-chip">Scene 4A</span>
          <span class="task-chip">Casting</span>
          <span class="task-chip">Høj prioritet</span>
          <span class="task-chip owner">Elisabeth Vitalis Tausen</span>
        </div>
        <div class="task-copy"><b>Opgave:</b> Find navnene på de tre børn, der skal medvirke i scene 4A. Registrér også navnene på hvert barns forældre samt deres telefonnummer og e-mailadresse.</div>
        <div class="task-done"><b>Færdig når:</b> Der foreligger en komplet kontaktliste for alle tre børn og deres forældre, så forældretilladelser og praktisk koordinering kan gennemføres før optagelsen.</div>
      </article>
    `;
  }

  function ensureElisabethTask(list) {
    const existing = document.getElementById(ELISABETH_TASK_ID);
    if (existing?.dataset.version === VERSION && document.getElementById(ELISABETH_DATE_ID)) return;

    document.getElementById(ELISABETH_DATE_ID)?.remove();
    existing?.remove();
    list.insertAdjacentHTML('afterbegin', elisabethTaskMarkup());
  }

  function roomPendingMarkup() {
    return `
      <article id="${ROOM_PENDING_ID}" class="next-shoot-event next-shoot-pending" data-version="${VERSION}">
        <div class="next-shoot-date"><span>Dato afventer</span><b>LOCATION AFVENTER</b></div>
        <div class="next-shoot-scenes">
          ${ROOM_SCENES.map(scene => `<strong>${scene}</strong>`).join('')}
        </div>
        <h4>Drengens værelse</h4>
        <p>Filmes først, når Thomas har fundet en passende location, og huset er godkendt. Vinduerne skal helst passe med huset i scene 9.</p>
      </article>
    `;
  }

  function ensureRoomCalendarStatus() {
    const calendar = document.getElementById('next-scenes-calendar');
    if (!calendar) return;

    calendar.querySelectorAll('.next-shoot-event').forEach(event => {
      const sceneCodes = Array.from(event.querySelectorAll('.next-shoot-scenes strong'))
        .map(node => node.textContent.trim());
      if (sceneCodes.includes('1A') && event.id !== ROOM_PENDING_ID) event.remove();
    });

    calendar.querySelectorAll('.mini-cal-day').forEach(day => {
      const label = day.getAttribute('aria-label') || '';
      if (!label.includes('Scene 1A')) return;
      day.classList.remove('has-shoot');
      day.querySelector('i')?.remove();
      day.setAttribute('aria-label', '9. august');
    });

    const list = calendar.querySelector('.next-shoot-list');
    const existing = document.getElementById(ROOM_PENDING_ID);
    if (list && (!existing || existing.dataset.version !== VERSION)) {
      existing?.remove();
      const firstPending = list.querySelector('.next-shoot-pending');
      if (firstPending) firstPending.insertAdjacentHTML('beforebegin', roomPendingMarkup());
      else list.insertAdjacentHTML('beforeend', roomPendingMarkup());
    }

    const undated = calendar.querySelector('.calendar-undated b');
    const undatedText = '1A · 2A · 2B · 15A · 16A · 9A–9C · 10A · 12A · 13A–13B · 14A';
    if (undated && undated.textContent !== undatedText) undated.textContent = undatedText;
  }

  function ensureRoomProducerStatus() {
    document.querySelectorAll('.producer-location-card').forEach(card => {
      const title = card.querySelector('.producer-location-title')?.textContent || '';
      if (!title.includes('Drengens værelse')) return;

      const status = card.querySelector('.producer-location-status');
      const statusText = 'Afventer location · ingen optagedato';
      if (status && status.textContent !== statusText) status.textContent = statusText;

      let comment = card.querySelector('.producer-comment');
      if (!comment) {
        comment = document.createElement('div');
        comment.className = 'producer-comment';
        card.appendChild(comment);
      }
      const desired = `<strong>Michael · producer:</strong> ${ROOM_COMMENT}`;
      if (comment.innerHTML !== desired) comment.innerHTML = desired;
    });
  }

  function ensureRoomLegacyMilestone() {
    document.querySelectorAll('.milestone').forEach(milestone => {
      if (!milestone.textContent.includes('Drengens værelse')) return;

      const title = milestone.querySelector('.milestone-title');
      const text = milestone.querySelector('.milestone-text');
      const titleText = 'Drengens værelse · afventer location';
      const bodyText = 'Scener 1A, 2A, 2B, 15A og 16A filmes først, når location er på plads og godkendt.';
      if (title && title.textContent !== titleText) title.textContent = titleText;
      if (text && text.textContent !== bodyText) text.textContent = bodyText;

      const date = milestone.previousElementSibling;
      if (date?.classList.contains('plan-date') && date.textContent.includes('9. august')) {
        date.textContent = 'Dato afventer · location';
      }
    });
  }

  function bindSelector() {
    const current = document.getElementById('task-person-filter');
    if (!current) return null;

    if (current.dataset.schedulePortalVersion === VERSION) return current;

    const select = current.cloneNode(true);
    select.dataset.schedulePortalVersion = VERSION;
    current.replaceWith(select);

    if (!people[selectedId] || !Array.from(select.options).some(option => option.value === selectedId)) {
      selectedId = 'all';
    }
    select.value = selectedId;

    select.addEventListener('change', event => {
      const value = people[event.target.value] ? event.target.value : 'all';
      selectedId = value;
      saveSelection(value);
      applyFilter();
    });
    return select;
  }

  function ensurePersonalHeading(main) {
    let heading = document.getElementById('personal-schedule-heading');
    if (!heading) {
      heading = document.createElement('div');
      heading.id = 'personal-schedule-heading';
      heading.style.cssText = 'margin:0 0 10px;padding:10px 12px;color:var(--current);background:rgba(77,217,192,.06);border:1px solid rgba(77,217,192,.18);border-radius:7px;font-family:IBM Plex Mono,monospace;font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase';
    }
    return heading;
  }

  function placeAfter(parent, node, previous) {
    if (!node) return previous;
    if (!previous) {
      if (parent.firstElementChild !== node) parent.prepend(node);
    } else if (previous.nextElementSibling !== node) {
      previous.insertAdjacentElement('afterend', node);
    }
    return node;
  }

  function ensureScheduleOrder() {
    const main = document.getElementById('schedule-main-column');
    const list = document.getElementById('production-plan-list');
    if (!main || !list) return;

    const heading = ensurePersonalHeading(main);
    const bureauNote = document.querySelector('#panel-schedule .bureau-note');
    const producerStatus = document.getElementById('producer-scene-status');

    let previous = null;
    previous = placeAfter(main, heading, previous);
    previous = placeAfter(main, bureauNote, previous);
    previous = placeAfter(main, list, previous);
    placeAfter(main, producerStatus, previous);
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

  function updateSummary(visibleCount, totalCount) {
    const summary = document.getElementById('plan-summary');
    const heading = document.getElementById('personal-schedule-heading');
    const person = people[selectedId] || people.all;
    const key = `${selectedId}:${visibleCount}:${totalCount}`;

    if (summary && summary.dataset.summaryKey !== key) {
      summary.dataset.summaryKey = key;
      summary.innerHTML = selectedId === 'all'
        ? `<strong>Samlet plan · ${totalCount} opgaver</strong><span>Alle personer, opgaver og milepæle.</span>`
        : `<strong><span class="current-person">${person.label}</span> · ${visibleCount} opgaver</strong><span>${person.role} · kun egne opgaver og deadlines.</span>`;
    }

    const headingText = selectedId === 'all'
      ? 'Samlet opgaveplan'
      : `${person.label} · personligt skema`;
    if (heading && heading.textContent !== headingText) heading.textContent = headingText;
  }

  function applyFilter() {
    const list = document.getElementById('production-plan-list');
    if (!list) return false;

    ensureScheduleOrder();
    const select = bindSelector();
    if (select && select.value !== selectedId) select.value = selectedId;

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
      const emptyText = `Der er endnu ingen opgaver registreret på ${people[selectedId].label}.`;
      if (empty.textContent !== emptyText) empty.textContent = emptyText;
      setVisible(empty, true);
    } else if (empty) {
      setVisible(empty, false);
    }

    const bureauNote = document.querySelector('#panel-schedule .bureau-note');
    setVisible(bureauNote, selectedId === 'all' || ['elisabeth', 'tor', 'bogi'].includes(selectedId));

    updateSummary(visibleCount, cards.length);
    document.documentElement.dataset.selectedSchedulePerson = selectedId;
    document.documentElement.dataset.scheduleReady = 'true';
    return true;
  }

  function sync() {
    const panel = document.getElementById('panel-schedule');
    const list = document.getElementById('production-plan-list');
    if (!panel || !list || !document.getElementById('task-person-filter')) return false;

    ensureElisabethTask(list);
    ensureRoomCalendarStatus();
    ensureRoomProducerStatus();
    ensureRoomLegacyMilestone();
    applyFilter();
    return true;
  }

  function queueSync() {
    if (syncQueued) return;
    syncQueued = true;
    window.requestAnimationFrame(() => {
      syncQueued = false;
      sync();
    });
  }

  function observePanel() {
    const panel = document.getElementById('panel-schedule');
    if (!panel || panelObserver) return;
    panelObserver = new MutationObserver(queueSync);
    panelObserver.observe(panel, { childList: true, subtree: true });
  }

  function boot(attempt = 0) {
    if (sync()) {
      observePanel();
      window.setTimeout(queueSync, 250);
      window.setTimeout(queueSync, 900);
      return;
    }
    if (attempt < 180) window.requestAnimationFrame(() => boot(attempt + 1));
  }

  boot();
})();
