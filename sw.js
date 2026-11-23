// Budget Bite Club service worker: makes the site installable as an app and shows a friendly page when
// there's no connection. Pages always come fresh from the network (recipes change daily); only the offline
// page and its look are kept on the phone. The Recipe Builder's AI calls go to the Worker and are never cached.
const CACHE = "bbc-v1";
const KEEP = ["/offline.html", "/style.css", "/img/app-192.png", "/img/favicon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(KEEP)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  if (e.request.mode !== "navigate") return;  // everything else: the browser's normal behaviour
  e.respondWith(fetch(e.request).catch(() => caches.match("/offline.html")));
});
