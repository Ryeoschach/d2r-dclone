/* D2R Sanctuary Live Service Worker — Cache-First static icons/assets, Network-First read-only catalogs, zero auth caching */
const CACHE_STATIC = "d2r-static-v2";
const CACHE_API = "d2r-api-v1";
const CACHE_PAGES = "d2r-pages-v1";
const ALL_CACHES = [CACHE_STATIC, CACHE_API, CACHE_PAGES];

const CACHEABLE_READONLY_APIS = new Set([
  "/api/terror-zones",
  "/api/runewords",
  "/api/affixes",
  "/api/items",
  "/api/skills",
  "/api/drops",
  "/api/paperdoll",
  "/api/presets",
  "/api/status",
  "/api/system-config"
]);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) =>
      cache.addAll(["/manifest.webmanifest", "/images/ui/pwa-icon.svg"]).catch(() => {})
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !ALL_CACHES.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (!req || req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const p = url.pathname;

  // Never cache authenticated, user-private, or admin routes
  if (
    p.startsWith("/api/auth/") ||
    p.startsWith("/api/user/") ||
    p.startsWith("/api/admin/") ||
    p.startsWith("/admin")
  ) {
    return;
  }

  // 1. Static images & content-hashed JS/CSS assets (?v=...) -> Cache-First; unversioned /assets/* -> Network-First
  if (p.startsWith("/images/") || (p.startsWith("/assets/") && url.searchParams.has("v"))) {
    event.respondWith(
      caches.open(CACHE_STATIC).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        const fresh = await fetch(req);
        if (fresh && fresh.ok) {
          cache.put(req, fresh.clone()).catch(() => {});
        }
        return fresh;
      })
    );
    return;
  }
  if (p.startsWith("/assets/")) {
    event.respondWith(
      caches.open(CACHE_STATIC).then(async (cache) => {
        try {
          const fresh = await fetch(req);
          if (fresh && fresh.ok) cache.put(req, fresh.clone()).catch(() => {});
          return fresh;
        } catch {
          const hit = await cache.match(req);
          if (hit) return hit;
          throw new Error("Offline asset miss");
        }
      })
    );
    return;
  }

  // 2. Public read-only catalog APIs -> Network-First with offline cache fallback
  if (CACHEABLE_READONLY_APIS.has(p) || p.startsWith("/api/builds/share/")) {
    event.respondWith(
      caches.open(CACHE_API).then(async (cache) => {
        try {
          const fresh = await fetch(req);
          if (fresh && fresh.ok) {
            cache.put(req, fresh.clone()).catch(() => {});
          }
          return fresh;
        } catch {
          const hit = await cache.match(req);
          if (hit) return hit;
          return new Response(JSON.stringify({ ok: false, offline: true, error: "当前处于离线状态且暂无本地缓存" }), {
            status: 503,
            headers: { "content-type": "application/json; charset=utf-8" }
          });
        }
      })
    );
    return;
  }

  // 3. Main page & public /build/:id navigations -> Network-First with offline fallback
  if (req.mode === "navigate" && (p === "/" || p.startsWith("/build/"))) {
    event.respondWith(
      caches.open(CACHE_PAGES).then(async (cache) => {
        try {
          const fresh = await fetch(req);
          if (fresh && fresh.ok) {
            cache.put(req, fresh.clone()).catch(() => {});
          }
          return fresh;
        } catch {
          const hit = await cache.match(req) || await cache.match("/");
          if (hit) return hit;
          return new Response("Offline", { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } });
        }
      })
    );
  }
});
