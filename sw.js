const CACHE_NAME = 'titan-omega-v1.0.1';
const ASSETS = [
    '/',
    '/index.html',
    '/admin.html',
    '/style.css',
    '/app.js',
    '/manifest.json'
];

// INSTALL: Lock files into the device memory
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('🔱 TITAN_OS: CACHING_SYSTEM_NODES');
            return cache.addAll(ASSETS);
        })
    );
});

// ACTIVATE: Clean up old versions
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if (key !== CACHE_NAME) return caches.delete(key);
            }));
        })
    );
});

// FETCH: Serve files from cache if offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
