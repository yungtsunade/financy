const CACHE = 'financy-v3';
const ASSETS = [
  '/financy/',
  '/financy/index.html',
  '/financy/manifest.json',
  '/financy/icons/icon-192.png',
  '/financy/icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  // Take over immediately without waiting
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  // Take control of all open clients immediately
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    // Network first, fall back to cache
    fetch(e.request)
      .then(response => {
        // Update cache with fresh version
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
