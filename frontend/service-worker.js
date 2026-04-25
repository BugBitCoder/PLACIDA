/* ============================================
   PLACIDA — service-worker.js
   PWA Offline Caching — Cache-first strategy
   Week 3 — Sanchari
   ============================================ */

const CACHE_NAME = 'placida-v1';
const ASSETS = [
  './index.html',
  './dashboard.html',
  './breathe.html',
  './chatbot.html',
  './summary.html',
  './insights.html',
  './mindful.html',
  './style.css',
  './script.js',
  './features.js',
  './manifest.json',
  './service-worker.js'
];

/* ── Install: pre-cache all assets ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Use individual adds so one missing file doesn't crash the whole install
      return Promise.allSettled(
        ASSETS.map(url => cache.add(new Request(url, { cache: 'reload' })))
      );
    }).then(() => self.skipWaiting())
  );
});

/* ── Activate: clean up old caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch: cache-first, fallback to network ── */
self.addEventListener('fetch', event => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // Cache successful non-opaque responses
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
