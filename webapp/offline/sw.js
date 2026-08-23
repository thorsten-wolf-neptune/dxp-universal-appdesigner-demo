/* Generated DXP app service worker. Do not edit — use sw.user.js. */
self.importScripts("./sw.user.js");
const DXP_CACHE = "dxp-http-v1";
const DXP_ROUTES = [];
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(DXP_CACHE));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", (event) => {
  if (typeof self.dxpHandleFetch === "function") {
    const handled = self.dxpHandleFetch(event);
    if (handled) return;
  }
  const req = event.request;
  if (req.method !== "GET") return;
  const match = DXP_ROUTES.find((r) => req.url.includes(r.pattern) && (r.method || "GET").toUpperCase() === "GET");
  if (!match) return;
  event.respondWith((async () => {
    const cache = await caches.open(DXP_CACHE);
    const cached = await cache.match(req);
    if (match.strategy === "network-first") {
      try {
        const fresh = await fetch(req);
        if (fresh.ok) await cache.put(req, fresh.clone());
        return fresh;
      } catch (err) {
        if (cached) return cached;
        throw err;
      }
    }
    if (cached) return cached;
    const fresh = await fetch(req);
    if (fresh.ok) await cache.put(req, fresh.clone());
    return fresh;
  })());
});
