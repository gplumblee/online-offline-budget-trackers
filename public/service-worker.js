const FILES_TO_CACHE = [
    "/",
    "/style.css",
    "/db.js",
    "/index.js",
    "index.html",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
  ];
  
  const STATIC_CACHE = "static-cache-v1";
  const RUNTIME_CACHE = "data-cache-v1";
  
  self.addEventListener("install", event => {
    event.waitUntil(
      caches
        .open(STATIC_CACHE)
        .then(cache => {return cache.addAll(FILES_TO_CACHE)})
    );
  });
  
  // The activate handler takes care of cleaning up old caches.
//   self.addEventListener("activate", event => {
//     const currentCaches = [STATIC_CACHE, RUNTIME_CACHE];
//     event.waitUntil(
//       caches
//         .keys()
//         .then(cacheNames => {
//           // return array of cache names that are old to delete
//           return cacheNames.filter(
//             cacheName => !currentCaches.includes(cacheName)
//           );
//         })
//         .then(cachesToDelete => {
//           return Promise.all(
//             cachesToDelete.map(cacheToDelete => {
//               return caches.delete(cacheToDelete);
//             })
//           );
//         })
//         .then(() => self.clients.claim())
//     );
//   });
  
  self.addEventListener("fetch", event => {

    // handle runtime GET requests for data from /api routes
    if (event.request.url.includes("/api/")) {
      // make network request and fallback to cache if network request fails (offline)
      event.respondWith(
        caches.open(RUNTIME_CACHE).then(cache => {
          return fetch(event.request)
            .then(response => {
              cache.put(event.request, response.clone());
              return response;
            })
            .catch(() => caches.match(event.request));
        })
      );
      return;
    }
  
    // use cache first for all other requests for performance
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        } else if (event.request.headers.get("accept").includes('text/html')){
            return caches.match('/')
        }
      })
    );
  });