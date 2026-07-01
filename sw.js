/* GreenRoute — Service Worker
   Caches all static assets for offline use.
   Strategy: Cache First for assets, Network First for HTML. */

const CACHE = 'greenroute-v1';

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
  './assets/img/logo.png',
  './assets/img/logo_green.png',
  './assets/img/favicon-32x32.png',
  './assets/img/apple-touch-icon.png',
  './assets/img/android-chrome-192x192.png',
  './assets/img/android-chrome-512x512.png',
  './site.webmanifest'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  /* Network First for HTML — always try to get fresh page */
  if (e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  /* Cache First for everything else */
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      });
    })
  );
});
