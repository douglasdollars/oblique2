export class PWAService {
  constructor(options = {}) {
    this.options = {
      swPath: '/service-worker.js',
      ...options
    };
    
    this.init();
  }

  async init() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(this.options.swPath);
        console.log('Service Worker registered:', registration);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, notify the user if needed
              console.log('New content is available; please refresh.');
            }
          });
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async unregister() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.unregister();
          console.log('Service Worker unregistered');
        }
      } catch (error) {
        console.error('Service Worker unregistration failed:', error);
      }
    }
  }

  async clearCache() {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('Cache cleared');
      } catch (error) {
        console.error('Cache clearing failed:', error);
      }
    }
  }
} 