/* GreenRoute — pwa.js
   Registers the service worker. Include in all pages before closing </body>. */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('[GreenRoute] SW registered:', reg.scope))
      .catch(err => console.warn('[GreenRoute] SW registration failed:', err));
  });
}
