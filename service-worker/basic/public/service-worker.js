var cacheName = 'test-001';
var filesToCache = [
  '/'
];

// install


// activate


// fetch


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
     return cache.addAll(filesToCache);
    }, (error) => {

    })
  );
  self.skipWaiting();
})
