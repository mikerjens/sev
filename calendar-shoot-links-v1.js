(() => {
  'use strict';

  const VERSION = '2026-08-06-1121';
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

  function dayFromDateKey(dateKey) {
    return Number.parseInt((dateKey || '').slice(-2), 10);
  }

  function cardMatchesDate(card, dateKey) {
    if (!dateKey) return false;
    if (card.dataset.shootDate === dateKey) return true;
    const day = dayFromDateKey(dateKey);
    if (!Number.isFinite(day)) return false;
    const dateText = card.querySelector('.next-shoot-date')?.textContent || '';
    return new RegExp(`(^|\\D)${day}(\\D|$)`).test(dateText);
  }

  function findShootEvent(scene, dateKey) {
    const cards = [...document.querySelectorAll('#panel-next-scenes .next-scenes-page-events .next-shoot-event')];
    if (scene) {
      const sceneMatch = cards.find(card => [...card.querySelectorAll('.next-shoot-scenes strong')]
        .some(chip => chip.textContent.trim().toUpperCase() === scene));
      if (sceneMatch) return sceneMatch;
    }
    return cards.find(card => cardMatchesDate(card, dateKey)) || null;
  }

  function openShoot(dateKey, scene) {
    window.openPortalTab?.('next-scenes');
    window.setTimeout(() => {
      const target = findShootEvent(scene, dateKey);
      if (!target) return;
      target.id = `optagelse-${dateKey || scene.toLowerCase()}`;
      target.classList.remove('calendar-target-shoot');
      void target.offsetWidth;
      target.classList.add('calendar-target-shoot');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => target.classList.remove('calendar-target-shoot'), 2400);
    }, 100);
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

  function enhanceCell(cell) {
    if (cell.dataset.shootLink === VERSION) return;
    cell.dataset.shootLink = VERSION;
    cell.setAttribute('role', 'button');
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('title', 'Åbn optagelsen denne dag');
    cell.addEventListener('click', event => {
      event.stopPropagation();
      activateCell(cell);
    });
    cell.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      activateCell(cell);
    });
  }

  function enhanceHeader(card) {
    const header = card.querySelector('.shoot-calendar-head');
    if (!header || header.dataset.shootLink === VERSION) return;
    header.dataset.shootLink = VERSION;
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.setAttribute('title', 'Åbn den næste aktuelle optagelse');
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

  function enhanceCalendar(card) {
    card.querySelectorAll('.mini-cal-day.has-shoot').forEach(enhanceCell);
    enhanceHeader(card);
  }

  function labelShootCards() {
    document.querySelectorAll('#panel-next-scenes .next-scenes-page-events .next-shoot-event').forEach(card => {
      const text = card.querySelector('.next-shoot-date')?.textContent || '';
      const match = text.match(/(?:^|\D)(5|10|17)(?:\D|$)/);
      if (match) card.dataset.shootDate = `${MONTH_PREFIX}${match[1].padStart(2, '0')}`;
    });
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
    labelShootCards();
    document.querySelectorAll('.shoot-calendar-card').forEach(enhanceCalendar);
  }

  document.addEventListener('sev:portal-ready', install);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }

  const observer = new MutationObserver(install);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-label'] });
  window.setTimeout(install, 1200);
})();
