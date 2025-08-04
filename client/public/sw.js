// Service Worker for My IEP Hero PWA
const CACHE_NAME = 'iep-hero-v1.0.0';
const urlsToCache = [
  '/',
  '/dashboard',
  '/documents',
  '/goals',
  '/login',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app resources');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('[SW] Failed to cache resources:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip chrome-extension and non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If online, cache the response and return it
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // If offline, try to serve from cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If not in cache and offline, serve fallback page
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          
          // For other requests, return a basic response
          return new Response(
            JSON.stringify({ 
              error: 'Offline - resource not available',
              offline: true 
            }),
            {
              headers: { 'Content-Type': 'application/json' },
              status: 503
            }
          );
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync-memory-qa') {
    event.waitUntil(syncMemoryQuestions());
  }
  
  if (event.tag === 'background-sync-goals') {
    event.waitUntil(syncGoalUpdates());
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'You have new updates in your IEP dashboard',
    icon: '/pwa-192x192.png',
    badge: '/pwa-64x64.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Dashboard',
        icon: '/pwa-64x64.png'
      },
      {
        action: 'close',
        title: 'Close notification',
        icon: '/pwa-64x64.png'
      }
    ]
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.title = data.title || 'My IEP Hero';
  }

  event.waitUntil(
    self.registration.showNotification('My IEP Hero', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Sync memory questions when back online
async function syncMemoryQuestions() {
  try {
    console.log('[SW] Syncing memory questions...');
    
    const cache = await caches.open('offline-memory-questions');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
          console.log('[SW] Successfully synced memory question');
        }
      } catch (error) {
        console.error('[SW] Failed to sync memory question:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Sync goal updates when back online
async function syncGoalUpdates() {
  try {
    console.log('[SW] Syncing goal updates...');
    
    const cache = await caches.open('offline-goal-updates');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
          console.log('[SW] Successfully synced goal update');
        }
      } catch (error) {
        console.error('[SW] Failed to sync goal update:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Goal sync failed:', error);
  }
}