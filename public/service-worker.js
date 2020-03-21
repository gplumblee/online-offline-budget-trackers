const FILES_TO_CACHE = [
  "/",
  "/styles.css",
  "/db.js",
  "/index.js",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

const STATIC_CACHE = "static-cache-v1";
const RUNTIME_CACHE = "data-cache-v1";

self.addEventListener("install", event => {
  console.log("service worker installed")
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", event => {
  if (event.request.url.includes("/api/")) {
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

  event.respondWith(
    fetch(event.request).catch (()=> {
      return caches.match(event.request).then(res=>{
        if(res){
          return res
        }else{
          return caches.match('/')
        }
      })
    })
  )
});
