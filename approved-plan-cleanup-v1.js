(() => {
  'use strict';

  function cleanup() {
    document.querySelectorAll('#production-plan-list .task-card[data-approved-completed="true"]').forEach(card => card.remove());
  }

  cleanup();
  document.addEventListener('sev:approved-plan-ready', cleanup, { once: true });
})();
