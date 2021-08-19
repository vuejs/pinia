;(() => {
  const saved = localStorage.getItem('pinia-color-scheme')
  if (
    saved === 'auto'
      ? window.matchMedia(`(prefers-color-scheme: light)`).matches
      : saved === 'light'
  ) {
    document.documentElement.classList.add('light')
  }
})()
