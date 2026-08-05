(() => {
  try {
    const preferred = sessionStorage.getItem('sev-task-person-preferred') || 'all';
    localStorage.setItem('sev-task-person', preferred);
  } catch (_) {}
})();
