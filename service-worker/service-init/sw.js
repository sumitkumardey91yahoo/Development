console.log("i am service worker");
var cache_name = "sumit-cache";
var cache_list = ['/', './beach-exotic-holiday-248797.jpg']

self.addEventListener("install", (event) => {
  
     console.log("type", typeof event);
        event.waitUntil(
            caches.open(cache_name).then((cache) => {
                 cache.addAll(cache_list);
            })
        );

        
      
}, (error) => {

})