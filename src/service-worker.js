const CACHE_NAME = 'oblique-strategies-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/styles/card.css',
  '/styles/navigation.css',
  '/scripts/app.js',
  '/scripts/Card.js',
  '/scripts/CardService.js',
  '/scripts/StorageService.js',
  '/scripts/OfflineQueue.js',
  '/scripts/ConnectionStatus.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
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

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) return response;

        // Clone the request - it's a one-time use stream
        const fetchRequest = event.request.clone();

        // Make network request and cache the response
        return fetch(fetchRequest).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response - it's a one-time use stream
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Return a fallback response for failed requests
        return new Response('Offline - Content not available', {
          status: 503,
          statusText: 'Service Unavailable'
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

// Function to sync cards with the server
async function syncCards() {
  try {
    const clients = await self.clients.matchAll();
    const client = clients[0];

    // Send message to client to initiate sync
    if (client) {
      client.postMessage({
        type: 'sync-started'
      });
    }

    // Get pending operations from IndexedDB or other storage
    const pendingOps = await getPendingOperations();

    // Process each operation
    for (const op of pendingOps) {
      try {
        await processOperation(op);
      } catch (error) {
        console.error('Sync operation failed:', error);
      }
    }

    // Notify client of sync completion
    if (client) {
      client.postMessage({
        type: 'sync-completed'
      });
    }
  } catch (error) {
    console.error('Sync failed:', error);
    throw error;
  }
}

// Helper function to get pending operations
async function getPendingOperations() {
  // Implementation will depend on how operations are stored
  // This is a placeholder
  return [];
}

// Helper function to process an operation
async function processOperation(operation) {
  // Implementation will depend on the operation type
  // This is a placeholder
  return Promise.resolve();
} 