(() => {
  const VERSION = '2026-08-05-1525';
  const ROOM_SCENES = ['1A', '2A', '2B', '15A', '16A'];
  const ROOM_COMMENT = 'Thomas scouter efter location. Huset skal helst passe med vinduerne i scene 9. Scenerne filmes ikke 9. august. Ny optagedato fastsættes først, når location er på plads og godkendt.';

  function roomPendingMarkup() {
    return `
      <article id="room-scenes-pending" class="next-shoot-event next-shoot-pending" data-version="${VERSION}">
        <div class="next-shoot-date"><span>Dato afventer</span><b>LOCATION AFVENTER</b></div>
        <div class="next-shoot-scenes">
          ${ROOM_SCENES.map(scene => `<strong>${scene}</strong>`).join('')}
        </div>
        <h4>Drengens værelse</h4>
        <p>Filmes først, når Thomas har fundet en passende location, og huset er godkendt. Vinduerne skal helst passe med huset i scene 9.</p>
      </article>
    `;
  }

  function updateCalendar() {
    const calendar = document.getElementById('next-scenes-calendar');
    if (!calendar) return;

    calendar.querySelectorAll('.next-shoot-event').forEach(event => {
      const sceneCodes = Array.from(event.querySelectorAll('.next-shoot-scenes strong'))
        .map(node => node.textContent.trim());
      if (sceneCodes.includes('1A') && event.id !== 'room-scenes-pending') {
        event.remove();
      }
    });

    calendar.querySelectorAll('.mini-cal-day').forEach(day => {
      const label = day.getAttribute('aria-label') || '';
      if (label.includes('Scene 1A') || /^9\. august/.test(label)) {
        day.classList.remove('has-shoot');
        day.querySelector('i')?.remove();
        day.setAttribute('aria-label', '9. august');
      }
    });

    const list = calendar.querySelector('.next-shoot-list');
    if (list && !list.querySelector('#room-scenes-pending')) {
      const firstPending = list.querySelector('.next-shoot-pending');
      if (firstPending) firstPending.insertAdjacentHTML('beforebegin', roomPendingMarkup());
      else list.insertAdjacentHTML('beforeend', roomPendingMarkup());
    }

    const undated = calendar.querySelector('.calendar-undated b');
    if (undated) {
      undated.textContent = '1A · 2A · 2B · 15A · 16A · 9A–9C · 10A · 12A · 13A–13B · 14A';
    }
  }

  function updateProducerStatus() {
    document.querySelectorAll('.producer-location-card').forEach(card => {
      const title = card.querySelector('.producer-location-title')?.textContent || '';
      if (!title.includes('Drengens værelse')) return;

      const status = card.querySelector('.producer-location-status');
      if (status) status.textContent = 'Afventer location · ingen optagedato';

      let comment = card.querySelector('.producer-comment');
      if (!comment) {
        comment = document.createElement('div');
        comment.className = 'producer-comment';
        card.appendChild(comment);
      }
      comment.innerHTML = `<strong>Michael · producer:</strong> ${ROOM_COMMENT}`;
    });
  }

  function updateLegacyMilestone() {
    document.querySelectorAll('.milestone').forEach(milestone => {
      if (!milestone.textContent.includes('Drengens værelse')) return;

      const title = milestone.querySelector('.milestone-title');
      const text = milestone.querySelector('.milestone-text');
      if (title) title.textContent = 'Drengens værelse · afventer location';
      if (text) text.textContent = 'Scener 1A, 2A, 2B, 15A og 16A filmes først, når location er på plads og godkendt.';

      const date = milestone.previousElementSibling;
      if (date?.classList.contains('plan-date') && date.textContent.includes('9. august')) {
        date.textContent = 'Dato afventer · location';
      }
    });
  }

  function apply() {
    updateCalendar();
    updateProducerStatus();
    updateLegacyMilestone();
  }

  apply();
  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    apply();
    if (attempts >= 120) window.clearInterval(timer);
  }, 100);
  window.addEventListener('load', apply, { once: true });
})();
