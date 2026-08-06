(() => {
  'use strict';

  const VERSION = '2026-08-06-1116';
  const MONTH_PREFIX = '2026-08-';

  function dateFromCell(cell) {
    const day = Number.parseInt(cell.querySelector('b')?.textContent || '', 10);
    if (!Number.isFinite(day)) return '';
    return `${MONTH_PREFIX}${String(day).padStart(2, '0')}`;
  }

  function sceneFromCell(cell) {
    const label = cell.getAttribute('aria-label') || '';
    const match = label.match(/Scene\s+([0-9]+[A-Z])/i);
    return match ? match[1].toUpperCase() : '';
  }

  function findShootEvent(scene) {
    const cards = [...document.querySelectorAll('#panel-next-scenes .next-scenes-page-events .next-shoot-event')];
    if (!scene) return cards[0] || null;
    return cards.find(card => [...card.querySelectorAll('.next-shoot-scenes strong')]
      .some(chip => chip.textContent.trim().toUpperCase() === scene)) || null;
  }

  function openShoot(dateKey, scene) {
    window.openPortalTab?.('next-scenes');
    window.setTimeout(() => {
      const target = findShootEvent(scene);
      if (!target) return;
      target.id = `optagelse-${dateKey || scene.toLowerCase()}`;
      target.classList.remove('calendar-target-shoot');
      void target.offsetWidth;
      target.classList.add('calendar-target-shoot');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => target.classList.remove('calendar-target-shoot'), 2400);
    }, 80);
  }

  function currentShootCell(card) {
    const cells = [...card.querySelectorAll('.mini-cal-day.has-shoot')]
      .map(cell => ({ cell, date: dateFromCell(cell) }))
      .filter(item => item.date)
      .sort((a, b) => a.date.localeCompare(b.date));
    if (!cells.length) return null;
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return cells.find(item => item.date >= today)?.cell || cells[cells.length - 1].cell;
  }

  function activateCell(cell) {
    openShoot(dateFromCell(cell), sceneFromCell(cell));
  }

  function enhanceCalendar(card) {
    if (card.dataset.shootLinks === VERSION) return;
    card.dataset.shootLinks = VERSION;

    card.querySelectorAll('.mini-cal-day.has-shoot').forEach(cell => {
      cell.setAttribute('role', 'button');
      cell.setAttribute('tabindex', '0');
      cell.setAttribute('title', 'Åbn den aktuelle optagelse');
      cell.addEventListener('click', event => {
        event.stopPropagation();
        activateCell(cell);
      });
      cell.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        activateCell(cell);
      });
    });

    const header = card.querySelector('.shoot-calendar-head');
    if (header) {
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');
      header.setAttribute('title', 'Åbn den aktuelle optagelse');
      const openCurrent = () => {
        const cell = currentShootCell(card);
        if (cell) activateCell(cell);
      };
      header.addEventListener('click', openCurrent);
      header.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openCurrent();
      });
    }
  }

  function installStyles() {
    if (document.getElementById('calendar-shoot-link-styles')) return;
    const style = document.createElement('style');
    style.id = 'calendar-shoot-link-styles';
    style.textContent = `
      .shoot-calendar-head[role="button"],
      .mini-cal-day.has-shoot[role="button"] { cursor: pointer; }
      .shoot-calendar-head[role="button"]:focus-visible,
      .mini-cal-day.has-shoot[role="button"]:focus-visible { outline: 2px solid var(--current); outline-offset: 3px; }
      .mini-cal-day.has-shoot[role="button"]:hover { transform: translateY(-1px); border-color: var(--signal); }
      .calendar-target-shoot { animation: calendarShootTarget 1.2s ease 2; border-color: var(--current) !important; }
      @keyframes calendarShootTarget {
        0%,100% { box-shadow: 0 0 0 0 rgba(77,217,192,0); }
        50% { box-shadow: 0 0 0 5px rgba(77,217,192,.24); }
      }
    `;
    document.head.appendChild(style);
  }

  function install() {
    installStyles();
    document.querySelectorAll('.shoot-calendar-card').forEach(enhanceCalendar);
  }

  document.addEventListener('sev:portal-ready', install);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }

  const observer = new MutationObserver(install);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(install, 1200);
})();
