// Karteikasten service worker — offline-first for a tiny static app.
// Bump CACHE_VERSION whenever you redeploy so clients pick up the new build.
const CACHE_VERSION = "karteikasten-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if(req.method !== "GET") return;

  // Network-first for the document so a redeploy is picked up when online,
  // with the cached copy as the offline fallback.
  if(req.mode === "navigate"){
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
    );
    return;
  }

  // Cache-first for everything else (fonts, icons).
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if(res && res.status === 200 && res.type === "basic"){
        const copy = res.clone();
        caches.open(CACHE_VERSION).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => cached))
  );
});
