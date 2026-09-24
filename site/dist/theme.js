// Apply before styles load to avoid a light flash when dark mode is preferred.
(() => {
  let saved;
  try { saved = localStorage.getItem('firstrung-theme'); } catch {}
  const theme = saved === 'dark' || saved === 'light'
    ? saved
    : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
})();
