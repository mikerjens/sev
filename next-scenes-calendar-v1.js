(() => {
  const VERSION = '2026-08-05-1510';

  const datedEvents = [
    {
      date: '2026-08-05',
      time: '21:30',
      scenes: ['5A'],
      title: 'Lille bygd om natten',
      location: 'Funningur',
      status: 'Planlagt'
    },
    {
      date: '2026-08-09',
      time: 'Tidspunkt afventer',
      scenes: ['1A', '2A', '2B', '15A', '16A'],
      title: 'Drengens værelse',
      location: 'Location afventer Thomas',
      status: 'Planlagt'
    },
    {
      date: '2026-08-10',
      time: '21:30',
      scenes: ['4A'],
      title: 'Børn under gadelyset',
      location: 'Bygd og præcis location afventer',
      status: 'Planlagt'
    }
  ];

  const pendingEvent = {
    period: 'Medio august',
    scenes: ['11A'],
    title: 'Aktiv jordvarmeboring',
    location: 'Streymoy · afventer Jarðhitis borehold'
  };

  const filmedScenes = ['3A', '6A', '7A', '8A'];
  const scenesWithoutDate = '9A–9C · 10A · 12A · 13A–13B · 14A';

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[char]);
  }

  function localDateKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDate(dateKey) {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Intl.DateTimeFormat('da-DK', {
      weekday: 'short', day: 'numeric', month: 'short'
    }).format(new Date(year, month - 1, day)).replace('.', '');
  }

  function monthGrid() {
    const year = 2026;
    const monthIndex = 7;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstDayMondayIndex = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
    const eventDates = new Set(datedEvents.map(event => event.date));
    const today = localDateKey();
    const cells = [];

    for (let index = 0; index < 42; index += 1) {
      const day = index - firstDayMondayIndex + 1;
      if (day < 1 || day > daysInMonth) {
        cells.push('<span class="mini-cal-day mini-cal-day-empty" aria-hidden="true"></span>');
        continue;
      }

      const dateKey = `${year}-08-${String(day).padStart(2, '0')}`;
      const classes = ['mini-cal-day'];
      if (eventDates.has(dateKey)) classes.push('has-shoot');
      if (dateKey === today) classes.push('is-today');
      const event = datedEvents.find(item => item.date === dateKey);
      const label = event
        ? `${day}. august. Scene ${event.scenes.join(', ')}. ${event.title}.`
        : `${day}. august`;

      cells.push(`<span class="${classes.join(' ')}" aria-label="${esc(label)}"><b>${day}</b>${event ? '<i></i>' : ''}</span>`);
    }

    return cells.join('');
  }

  function eventMarkup(event) {
    const today = localDateKey();
    const isToday = event.date === today;
    return `
      <article class="next-shoot-event${isToday ? ' is-next-today' : ''}">
        <div class="next-shoot-date">
          <span>${esc(formatDate(event.date))}</span>
          ${isToday ? '<b>I DAG</b>' : ''}
        </div>
        <div class="next-shoot-time">${event.time === 'Tidspunkt afventer' ? '◷' : '●'} ${esc(event.time)}</div>
        <div class="next-shoot-scenes">${event.scenes.map(scene => `<strong>${esc(scene)}</strong>`).join('')}</div>
        <h4>${esc(event.title)}</h4>
        <p>${esc(event.location)}</p>
      </article>
    `;
  }

  function calendarMarkup() {
    return `
      <aside id="next-scenes-calendar" data-version="${VERSION}" aria-label="Kalender for næste sceneoptagelser">
        <div class="next-scenes-calendar-head">
          <div>
            <span>NÆSTE OPTAGELSER</span>
            <h3>August 2026</h3>
          </div>
          <div class="calendar-live-dot" title="Aktuel produktionsplan"></div>
        </div>

        <div class="mini-cal-weekdays" aria-hidden="true">
          <span>M</span><span>T</span><span>O</span><span>T</span><span>F</span><span>L</span><span>S</span>
        </div>
        <div class="mini-cal-grid">${monthGrid()}</div>

        <div class="next-shoot-list">
          ${datedEvents.map(eventMarkup).join('')}
          <article class="next-shoot-event next-shoot-pending">
            <div class="next-shoot-date"><span>${esc(pendingEvent.period)}</span><b>DATO AFVENTER</b></div>
            <div class="next-shoot-scenes">${pendingEvent.scenes.map(scene => `<strong>${esc(scene)}</strong>`).join('')}</div>
            <h4>${esc(pendingEvent.title)}</h4>
            <p>${esc(pendingEvent.location)}</p>
          </article>
        </div>

        <div class="calendar-undated">
          <span>Dato mangler</span>
          <b>${esc(scenesWithoutDate)}</b>
        </div>
        <div class="calendar-filmed">✓ Filmet: ${filmedScenes.join(' · ')}</div>
      </aside>
    `;
  }

  function addStyles() {
    if (document.getElementById('next-scenes-calendar-styles')) return;
    const style = document.createElement('style');
    style.id = 'next-scenes-calendar-styles';
    style.textContent = `
      #schedule-calendar-layout{display:grid;grid-template-columns:minmax(0,1fr) 310px;gap:18px;align-items:start;margin-top:2px}
      #schedule-main-column{min-width:0}
      #next-scenes-calendar{position:sticky;top:16px;padding:16px;background:var(--bg-elevated);border:1px solid var(--border-strong);border-radius:11px;box-shadow:0 12px 34px rgba(0,0,0,.12)}
      .next-scenes-calendar-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}
      .next-scenes-calendar-head span{color:var(--current);font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:800;letter-spacing:.09em}
      .next-scenes-calendar-head h3{margin-top:3px;font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:650}
      .calendar-live-dot{width:9px;height:9px;margin-top:5px;background:var(--current);border-radius:50%;box-shadow:0 0 0 5px rgba(77,217,192,.12)}
      .mini-cal-weekdays,.mini-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
      .mini-cal-weekdays{margin-bottom:5px;color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:8px;text-align:center}
      .mini-cal-day{position:relative;display:grid;place-items:center;aspect-ratio:1;color:var(--text-muted);background:var(--bg-elevated-2);border:1px solid transparent;border-radius:6px;font-family:'IBM Plex Mono',monospace;font-size:10px}
      .mini-cal-day-empty{background:transparent}
      .mini-cal-day.has-shoot{color:var(--text);border-color:rgba(246,176,66,.42);background:rgba(246,176,66,.09)}
      .mini-cal-day.is-today{border-color:var(--current);box-shadow:inset 0 0 0 1px var(--current)}
      .mini-cal-day i{position:absolute;right:4px;bottom:3px;width:4px;height:4px;background:var(--signal);border-radius:50%}
      .next-shoot-list{display:grid;gap:8px;margin-top:15px}
      .next-shoot-event{padding:11px 12px;background:var(--bg-elevated-2);border:1px solid var(--border);border-left:3px solid var(--signal);border-radius:8px}
      .next-shoot-event.is-next-today{border-color:rgba(77,217,192,.55);border-left-color:var(--current);background:rgba(77,217,192,.06)}
      .next-shoot-event.next-shoot-pending{border-left-color:var(--text-muted)}
      .next-shoot-date{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase}
      .next-shoot-date b{padding:2px 5px;color:var(--current);background:rgba(77,217,192,.1);border-radius:4px;font-size:8px}
      .next-shoot-time{margin-top:5px;color:var(--signal);font-family:'IBM Plex Mono',monospace;font-size:10px}
      .next-shoot-scenes{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}
      .next-shoot-scenes strong{padding:2px 5px;color:var(--current);background:rgba(77,217,192,.09);border:1px solid rgba(77,217,192,.18);border-radius:4px;font-family:'IBM Plex Mono',monospace;font-size:9px}
      .next-shoot-event h4{margin-top:7px;font-size:12.5px;font-weight:650}
      .next-shoot-event p{margin-top:3px;color:var(--text-muted);font-size:10.5px;line-height:1.4}
      .calendar-undated{margin-top:12px;padding:9px 10px;color:var(--text-muted);background:rgba(255,255,255,.025);border:1px dashed var(--border-strong);border-radius:7px;font-size:9.5px}
      .calendar-undated span{display:block;margin-bottom:4px;font-family:'IBM Plex Mono',monospace;text-transform:uppercase}
      .calendar-undated b{color:var(--text);font-weight:550;line-height:1.45}
      .calendar-filmed{margin-top:9px;color:#4ade80;font-family:'IBM Plex Mono',monospace;font-size:9px}
      @media(max-width:980px){
        #schedule-calendar-layout{grid-template-columns:1fr}
        #next-scenes-calendar{position:relative;top:auto;order:2}
        #schedule-main-column{order:1}
      }
      @media(max-width:520px){
        #next-scenes-calendar{padding:14px}
        .next-shoot-event{padding:10px}
      }
    `;
    document.head.appendChild(style);
  }

  function ensureLayout(panel) {
    let layout = document.getElementById('schedule-calendar-layout');
    let main = document.getElementById('schedule-main-column');
    let calendar = document.getElementById('next-scenes-calendar');
    const selector = document.getElementById('person-task-selector') || document.querySelector('.plan-toolbar');

    if (!layout) {
      layout = document.createElement('div');
      layout.id = 'schedule-calendar-layout';
      main = document.createElement('div');
      main.id = 'schedule-main-column';
      layout.appendChild(main);
      layout.insertAdjacentHTML('beforeend', calendarMarkup());
      calendar = layout.querySelector('#next-scenes-calendar');

      if (selector) selector.insertAdjacentElement('afterend', layout);
      else {
        const head = panel.querySelector('.section-head');
        if (head) head.insertAdjacentElement('afterend', layout);
        else panel.prepend(layout);
      }
    }

    if (!main) {
      main = document.createElement('div');
      main.id = 'schedule-main-column';
      layout.prepend(main);
    }

    if (!calendar || calendar.dataset.version !== VERSION) {
      calendar?.remove();
      layout.insertAdjacentHTML('beforeend', calendarMarkup());
    }

    const movable = [
      document.getElementById('producer-scene-status'),
      panel.querySelector('.bureau-note'),
      document.getElementById('production-plan-list')
    ].filter(Boolean);

    movable.forEach(node => {
      if (node.parentElement !== main) main.appendChild(node);
    });

    if (selector && selector.nextElementSibling !== layout) {
      selector.insertAdjacentElement('afterend', layout);
    }

    return true;
  }

  function install() {
    const panel = document.getElementById('panel-schedule');
    if (!panel) return false;
    addStyles();
    return ensureLayout(panel);
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
