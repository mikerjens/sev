(() => {
  'use strict';

  const VERSION = '2026-08-05-2318';
  const SCENE_ID = '5A';
  const FILMED_TEXT = 'Filmet i Funningur 5. august 2026';

  function exactSceneIds(element) {
    return (element?.textContent || '').match(/\b\d+[A-Z]\b/g) || [];
  }

  function hasScene5A(element) {
    return exactSceneIds(element).includes(SCENE_ID);
  }

  function addStyles() {
    if (document.getElementById('scene-5a-filmed-styles')) return;
    const style = document.createElement('style');
    style.id = 'scene-5a-filmed-styles';
    style.textContent = `
      .task-card.scene-5a-filmed,
      .producer-location-card.scene-5a-filmed {
        border-color:rgba(74,222,128,.55)!important;
        border-left-color:#4ade80!important;
        background:rgba(74,222,128,.07)!important;
      }
      .scene-5a-filmed .task-status,
      .scene-5a-filmed .producer-location-status {
        color:#4ade80!important;
        border-color:rgba(74,222,128,.45)!important;
        background:rgba(74,222,128,.08)!important;
      }
      .scene-5a-filmed-line {
        color:#4ade80;
        font-weight:700;
      }
    `;
    document.head.appendChild(style);
  }

  function updateTaskCards() {
    document.querySelectorAll('.task-card').forEach(card => {
      const title = card.querySelector('.task-title')?.textContent || '';
      if (!/scene\s+5A/i.test(title)) return;

      card.classList.add('scene-5a-filmed');
      const status = card.querySelector('.task-status');
      if (status) status.textContent = 'Filmet';

      const time = card.querySelector('.task-time');
      if (time) time.textContent = 'Filmet 5. august 2026 · Funningur';

      const copy = card.querySelector('.task-copy');
      if (copy) copy.innerHTML = '<b>Status:</b> Scene 5A er filmet i Funningur den 5. august 2026.';

      const done = card.querySelector('.task-done');
      if (done) done.innerHTML = '<b>Gennemført:</b> Optagelsen er afsluttet. Materialet skal være sikkerhedskopieret og kontrolleret.';
    });
  }

  function updateMilestone() {
    document.querySelectorAll('.milestone').forEach(card => {
      if (!hasScene5A(card)) return;
      const title = card.querySelector('.milestone-title');
      const text = card.querySelector('.milestone-text');
      if (title) title.textContent = 'Scene 5A · filmet';
      if (text) text.textContent = `${FILMED_TEXT}.`;
      card.classList.add('scene-5a-filmed');
    });
  }

  function removeFromUpcoming() {
    document.querySelectorAll('.next-shoot-event').forEach(card => {
      if (hasScene5A(card)) card.remove();
    });
  }

  function updateProducerStatus() {
    document.querySelectorAll('.producer-location-card').forEach(card => {
      if (!hasScene5A(card)) return;
      card.classList.add('scene-5a-filmed');

      const status = card.querySelector('.producer-location-status');
      if (status) status.textContent = 'Filmet · 5. august 2026';

      const comment = card.querySelector('.producer-comment');
      if (comment) comment.textContent = `${FILMED_TEXT}.`;
    });
  }

  function addFilmedSummary() {
    document.querySelectorAll('.producer-filmed, .calendar-filmed').forEach(summary => {
      if (/\b5A\b/.test(summary.textContent || '')) return;
      const separator = summary.textContent?.trim() ? ' · ' : '';
      summary.appendChild(document.createTextNode(`${separator}5A filmet 5. august`));
    });
  }

  function markStoryboard() {
    document.querySelectorAll('.storyboard-scene-card').forEach(card => {
      if (!hasScene5A(card)) return;
      card.classList.add('filmed');
      if (!card.querySelector('.storyboard-filmed-tag')) {
        const tag = document.createElement('span');
        tag.className = 'storyboard-filmed-tag';
        tag.textContent = 'FILMET 5. AUGUST';
        card.appendChild(tag);
      }
    });

    document.querySelectorAll('.storyboard-chip').forEach(chip => {
      if (hasScene5A(chip)) chip.classList.add('filmed');
    });

    const selected = document.querySelector('.storyboard-selected-scene');
    if (selected && hasScene5A(selected) && !selected.querySelector('.storyboard-selected-status')) {
      const status = document.createElement('span');
      status.className = 'storyboard-selected-status';
      status.textContent = 'FILMET 5. AUGUST 2026';
      selected.appendChild(status);
    }
  }

  function install() {
    addStyles();
    updateTaskCards();
    updateMilestone();
    removeFromUpcoming();
    updateProducerStatus();
    addFilmedSummary();
    markStoryboard();
    document.querySelector('main')?.setAttribute('data-scene-5a-filmed', VERSION);
  }

  document.addEventListener('sev:portal-ready', install, { once: true });

  document.addEventListener('change', event => {
    if (event.target?.id === 'task-person-filter') {
      window.setTimeout(install, 0);
    }
  }, true);

  document.addEventListener('click', event => {
    const sceneTarget = event.target.closest?.('[data-scene-link="5A"], [data-storyboard-scene="5A"]');
    if (sceneTarget) window.setTimeout(markStoryboard, 0);
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();