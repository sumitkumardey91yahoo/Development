console.log("i am service worker");
var cache_name = "sumit-cache";
var cache_list = ['/', './beach-exotic-holiday-248797.jpg']

self.addEventListener("install", (event) => {
  
     console.log("type",  event);
     // NOTE  In service workers, waitUntil() tells the browser that work is ongoing until the promise settles, and it shouldn't terminate the service worker if it wants that work to complete.
        event.waitUntil(
            caches.open(cache_name).then((cache) => {
                 cache.addAll(cache_list);
            })
        );
});

self.addEventListener('activate', (event) => {
     console.log("caches", caches);
     event.waitUntil(
         caches.keys().then((cacheNames) => {
             return Promise.all(
                 cacheNames.filter((name) => {
                     return name !== cache_name;
                 }).map((name) => {
                     //return caches.delete(name);
                 })
             )
         })
     )
 });