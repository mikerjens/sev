(() => {
  const replaceBogi = value => String(value || '').replace(/\bBogi\b(?! Henriksen)/g, 'Bogi Henriksen');

  function applyCorrection() {
    document.querySelectorAll('#task-person-filter option').forEach(option => {
      if (option.value === 'bogi') {
        option.textContent = 'Bogi Henriksen · Kreativ direktør / SANSIR.fo';
      }
    });

    document.querySelectorAll('.crew-card').forEach(card => {
      const name = card.querySelector('.crew-card-name');
      const role = card.querySelector('.crew-card-role');
      if (name && (name.textContent.trim() === 'Bogi' || name.textContent.trim() === 'Bogi Henriksen')) {
        name.textContent = 'Bogi Henriksen';
        if (role) role.textContent = 'Kreativ direktør / SANSIR.fo';
      }
    });

    document.querySelectorAll('.bureau-note, .task-chip.owner, #plan-summary').forEach(element => {
      if (element.textContent.includes('Bogi')) {
        element.innerHTML = replaceBogi(element.innerHTML);
      }
    });
  }

  applyCorrection();

  const observer = new MutationObserver(applyCorrection);
  observer.observe(document.body, { childList: true, subtree: true });
})();
