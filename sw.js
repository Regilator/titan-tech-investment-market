/* 🔱 TITAN TECH HUB - OMEGA OFFLINE ENGINE v1.0.1
   Logic: Cache-First Strategy for Data Saving
   Author: Lod of Tech
*/

const CACHE_NAME = 'titan-omega-v1';

// 1. ASSETS TO PERSIST (Core System Files)
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/admin.html',
    '/receipt.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto+Mono&display=swap',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js'
];

// 2. INSTALLATION: Establish the Digital Fortress
self.addEventListener('install', (event) => {
    console.log('> TITAN_OS: INITIALIZING_OFFLINE_STORAGE');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// 3. ACTIVATION: Purge Deprecated Protocols
self.addEventListener('activate', (event) => {
    console.log('> TITAN_OS: SYSTEM_READY');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('> TITAN_OS: DELETING_OLD_CACHE_NODE');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 4. FETCH: Intelligent Data Routing
self.addEventListener('fetch', (event) => {
    // Only intercept GET requests (don't interfere with Firebase writes)
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Priority 1: Serve from Offline Cache
            if (cachedResponse) {
                return cachedResponse;
            }

            // Priority 2: Fetch from Network if available
            return fetch(event.request).then((networkResponse) => {
                // Validate response before caching new assets
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                // Clone and cache the new asset (e.g., a new product image)
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch(() => {
                // Priority 3: Fail silently or show an offline indicator
                console.log('> TITAN_OS: NETWORK_UNAVAILABLE_NODE_OFFLINE');
            });
        })
    );
});
