/* Service worker — caches the app shell plus all event images for offline use. */
const VERSION = "v6";
const CORE_CACHE = `core-${VERSION}`;
const RUNTIME_CACHE = `images-${VERSION}`;
const CORE_URLS = ["./timeline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE)
      .then((c) => c.addAll(CORE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CORE_CACHE && k !== RUNTIME_CACHE)
            .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const isSelfOrigin = url.origin === self.location.origin;
  const isWikimedia = /(^|\.)wikimedia\.org$/.test(url.hostname) || /(^|\.)wikipedia\.org$/.test(url.hostname);
  if (!isSelfOrigin && !isWikimedia) return;

  // Page navigations: cache-first with network refresh + offline fallback to the app shell.
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match(req).then((hit) => {
        const net = fetch(req).then((resp) => {
          const copy = resp.clone();
          caches.open(CORE_CACHE).then((c) => c.put(req, copy));
          return resp;
        }).catch(() => hit || caches.match("./timeline.html"));
        return hit ? Promise.resolve(hit).then((r) => r) : net;
      })
    );
    return;
  }

  // Images (and anything else from Wikimedia): cache-first, fill at runtime.
  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((resp) => {
        if (resp.ok || resp.type === "opaque") {
          const copy = resp.clone();
          caches.open(isSelfOrigin ? CORE_CACHE : RUNTIME_CACHE).then((c) => c.put(req, copy));
        }
        return resp;
      });
    })
  );
});
