const CACHE_NAME = 'esaad-app-v2'; // Bumped version to v2 to force update
const ASSETS = [
  './',
  './index.html',
  './logo.png',
  './card.jpg',
  // Removed video.mp4 to prevent install timeouts on slow networks
  './manifest.json'
];

// Install Service Worker
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Force new SW to take over immediately
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate Service Worker
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  return self.clients.claim(); // Take control of all clients immediately
});

// Fetch Assets
self.addEventListener('fetch', (e) => {
  // Strategy: Cache First for assets, Network First for video
  if (e.request.destination === 'video') {
    e.respondWith(fetch(e.request));
    return;
  }

  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
