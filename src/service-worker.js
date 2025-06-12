const CACHE_NAME = 'oblique-strategies-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/main.js',
  // Add other static assets here
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return cached response
        }

        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it can only be used once
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return a fallback response for failed requests
            return new Response('Offline content not available');
          });
      })
  );
});

// Background sync event
self.addEventListener('sync', event => {
  if (event.tag === 'sync-cards') {
    event.waitUntil(syncCards());
  }
});

async function syncCards() {
  try {
    // Get queued operations from IndexedDB
    const queue = await getQueuedOperations();
    
    // Process each operation
    for (const operation of queue) {
      await processOperation(operation);
    }
    
    // Clear processed operations
    await clearQueuedOperations();
  } catch (error) {
    console.error('Sync failed:', error);
    throw error; // Retry sync later
  }
}

// Helper functions for sync (to be implemented)
async function getQueuedOperations() {
  // Implementation will be added in sync phase
  return [];
}

async function processOperation(operation) {
  // Implementation will be added in sync phase
}

async function clearQueuedOperations() {
  // Implementation will be added in sync phase
} 