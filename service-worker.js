const CACHE_NAME = "ecoklit-v5";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./style_coklit.css",
  "./style_validasi.css",
  "./api.js",
  "./utils.js",
  "./layout.html",
  "./modal_layout.html",
  "./modal_validasi.html",
  "./logoPilkades.png",
];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }),
  );
});

// FETCH STRATEGY 🔥
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // ❌ API jangan di-cache
  if (url.includes("script.google.com")) {
    return;
  }

  // 🔥 HTML → network dulu (biar update)
  if (event.request.headers.get("accept").includes("text/html")) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, res.clone());
            return res;
          });
        })
        .catch(() => caches.match(event.request)),
    );
    return;
  }

  // 🔥 CSS/JS → cache first
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request)),
  );
});

// CLEAN CACHE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        }),
      ),
    ),
  );
});
