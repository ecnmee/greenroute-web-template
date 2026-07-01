/* GreenRoute — Service Worker v2
   Strategy: Network First com fallback para cache quando offline.
   Incrementa CACHE_VERSION a cada deploy para invalidar cache antigo. */

const CACHE_VERSION = 'greenroute-v2';

const STATIC = [
  './',
  './index.html',
  './about.html',
  './news.html',
  './post.html',
  './assets/css/main.css',
  './assets/js/main.js',
  './assets/js/canvas-vertical.js',
  './assets/js/nav-mobile.js',
  './assets/js/i18n.js',
  './assets/js/form.js',
  './assets/js/pwa.js',
  './assets/img/logo.png',
  './assets/img/favicon-32x32.png',
  './assets/img/apple-touch-icon.png',
  './assets/img/android-chrome-192x192.png',
  './assets/img/android-chrome-512x512.png',
  './site.webmanifest'
];

/* ── Install: pre-cache static assets ───────────────────────────────────────── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(c => c.addAll(STATIC))
  );
  self.skipWaiting();
});

/* ── Activate: delete all old caches ────────────────────────────────────────── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => {
          console.log('[SW] Deleting old cache:', k);
          return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});

/* ── Fetch: Network First — always try network, cache only as offline fallback ── */
self.addEventListener('fetch', e => {
  /* Only handle same-origin GET requests */
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        /* Update cache with fresh response */
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => {
        /* Offline fallback */
        return caches.match(e.request).then(cached => {
          if (cached) return cached;
          /* If HTML not cached, return index */
          if (e.request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
