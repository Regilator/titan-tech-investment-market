const cacheName = 'titan-v3';
const files = ['./', './index.html', './style.css', './app.js', './catalog.txt', './97093.jpg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(files)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
