console.log("test")
self.addEventListener('install', (event) => {
    event.waitUntil(
    caches.open('cache-02').then((cache) => {
        cache.addAll(['/index.html', './home.js'])
    })
);
self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
    caches.open('cache-02').then((cache) => {
        return cache.match(e.request).then((ma)=> {
          
            console.log("ma", ma);
            var fetchPromise = fetch(e.request).then(function(networkResponse) {
                console.log("networkResponse",networkResponse);
                  if (networkResponse.status == 200 || networkResponse.status == 201) {
                    console.log("networkResponse.clone()", networkResponse.clone())
                    cache.put("sumiy", networkResponse.clone());
                    cache.add(e.request.url);
                    cache.addAll(['/index.html', './home.js'])
                  }
                  return networkResponse;
                }).catch((error) => {
                  console.log('[sw | fetch | error ]', error);
                })

            return ma || cache.add(e.request.url);
        })
    })
    );
});



// self.addEventListener('fetch', (e) => {
//           e.respondWith(
//             caches.open('cache-02').then(function(cache) {
//               return cache.match(e.request).then(function(response) {
//                 var fetchPromise = fetch(e.request).then(function(networkResponse) {

//                   if (networkResponse.status == 200 || networkResponse.status == 201) {
//                     cache.put(e.request, networkResponse.clone());
//                   }
//                   return networkResponse;
//                 }).catch((error) => {
//                   console.log('[sw | fetch | error ]', error);
//                 })
//                 return response || fetchPromise;
//               });
//             })
//           );

//   });
  