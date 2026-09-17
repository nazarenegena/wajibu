/* Wajibu service worker — offline app shell.
 *
 * Bump VERSION whenever the app shell changes (new dependencies, index.html, etc.)
 * so stale caches are purged in `activate`.
 */
const VERSION = "v1";
const PAGE_CACHE = `wajibu-pages-${VERSION}`;
const ASSET_CACHE = `wajibu-assets-${VERSION}`;

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(PAGE_CACHE)
      .then((cache) => cache.add("/"))
      .catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("wajibu-") && !key.endsWith(VERSION))
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // API calls stay network-only; analysis results are cached in localStorage.
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(navigationResponse(request));
    return;
  }

  // Hashed static assets are immutable; serve cache-first, refresh in background.
  event.respondWith(staleWhileRevalidate(request));
});

async function navigationResponse(request) {
  const cache = await caches.open(PAGE_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request.url, response.clone());
    return response;
  } catch {
    return (await cache.match(request.url)) || (await cache.match("/"));
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || networkFetch;
}