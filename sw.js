// Service Worker za ZSVA Abholzeiten PWA
// Version: 1.0
const CACHE_NAME = 'zsva-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
  // Napomena: Eksterni resursi (Tailwind CDN, Google Fonts) se NE keširaju
  // jer service worker ne može pouzdano keširati eksterne resurse
];

// INSTALACIJA - Keširanje osnovnih resursa
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Keširam osnovne resurse');
        return cache.addAll(ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Instalacija završena');
        // Preskoči čekanje - aktiviraj odmah
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Greška pri instalaciji:', error);
      })
  );
});

// AKTIVACIJA - Čišćenje starog keša
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('[Service Worker] Brišem stari keš:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Aktivacija završena');
        // Preuzmi kontrolu nad svim tabovima odmah
        return self.clients.claim();
      })
  );
});

// FETCH - Serviranje zahteva (offline podrška)
self.addEventListener('fetch', (event) => {
  // Preskoči zahteve koji nisu HTTP(S)
  if (!event.request.url.startsWith('http')) return;
  
  // Za Google Fonts i Tailwind CDN, uvek koristi mrežu
  if (event.request.url.includes('fonts.googleapis.com') || 
      event.request.url.includes('cdn.tailwindcss.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Ako ima u kešu, vrati keširanu verziju
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Inače, uzmi sa mreže i keširaj za buduću upotrebu
        return fetch(event.request)
          .then((networkResponse) => {
            // Ne keširaj ne-validne odgovore
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Kloniraj odgovor jer stream može da se iskoristi samo jednom
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch(() => {
            // Ako nema mreže i nema u kešu, možeš vratiti fallback stranicu
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
            // Za ostale tipove, vrati null
            return null;
          });
      })
  );
});

// BACKGROUND SYNC (dodatna funkcionalnost)
// self.addEventListener('sync', (event) => {
//   if (event.tag === 'sync-data') {
//     event.waitUntil(syncData());
//   }
// });

// PUSH NOTIFICATIONS (dodatna funkcionalnost)
// self.addEventListener('push', (event) => {
//   const options = {
//     body: event.data.text(),
//     icon: './icons/icon-192.png',
//     badge: './icons/icon-72x72.png',
//     vibrate: [100, 50, 100],
//     data: {
//       dateOfArrival: Date.now(),
//       primaryKey: 1
//     }
//   };
//   
//   event.waitUntil(
//     self.registration.showNotification('ZSVA Notifikacija', options)
//   );
// });
