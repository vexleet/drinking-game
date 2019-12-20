'use strict'

const CACHE_NAME = 'static-cache-v2';

const FILES_TO_CACHE = [
    '/drinking-game/',
    '/drinking-game/index.html',
    '/drinking-game/styles/style.css',
    '/drinking-game/styles/bubbles-animation.css',
    '/drinking-game/scripts/app.js',
    '/drinking-game/scripts/rules-modal.js',
    '/drinking-game/challenges.json',
];

self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');

    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');

    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );

    self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    console.log('[ServiceWorker] Fetch', evt.request.url);

    evt.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(evt.request)
                .then((response) => {
                    return response || fetch(evt.request);
                });
        })
    );
});