const CACHE_STATIC = 'dopzy-static-v1';
const CACHE_PAGES = 'dopzy-pages-v1';
const CACHE_FONTS = 'dopzy-fonts-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_STATIC && key !== CACHE_PAGES && key !== CACHE_FONTS) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Bypass Supabase API calls & PostHog metrics
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('posthog.com') ||
    url.pathname.includes('/api/')
  ) {
    return;
  }

  // 1. Navigation requests (SPA page views) -> Network First, fallback to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_PAGES).then((cache) => {
            cache.put('/index.html', copy);
          });
          return response;
        })
        .catch(() => {
          return caches.match('/index.html').then((cachedResponse) => {
            return cachedResponse || Response.error();
          });
        })
    );
    return;
  }

  // 2. Static Assets (Vite hashes assets in /assets/) -> Cache First
  if (url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const copy = response.clone();
          caches.open(CACHE_STATIC).then((cache) => {
            cache.put(request, copy);
          });
          return response;
        });
      })
    );
    return;
  }

  // 3. Web Fonts (Google Fonts, etc.) -> Stale While Revalidate
  if (
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_FONTS).then((cache) => {
              cache.put(request, copy);
            });
          }
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default: Network with cache fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return cachedResponse || fetch(request);
    })
  );
});
