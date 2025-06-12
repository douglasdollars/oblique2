export class PWAService {
  constructor() {
    this.registration = null;
    this.updateAvailable = false;
    this.updateHandlers = new Set();
  }

  async register() {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });

      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.updateAvailable = true;
            this.notifyUpdateAvailable();
          }
        });
      });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (this.updateAvailable) {
          window.location.reload();
        }
      });

      return true;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      return false;
    }
  }

  async unregister() {
    if (!this.registration) return false;

    try {
      await this.registration.unregister();
      this.registration = null;
      return true;
    } catch (error) {
      console.error('Service worker unregistration failed:', error);
      return false;
    }
  }

  onUpdateAvailable(handler) {
    this.updateHandlers.add(handler);
  }

  offUpdateAvailable(handler) {
    this.updateHandlers.delete(handler);
  }

  notifyUpdateAvailable() {
    this.updateHandlers.forEach(handler => handler());
  }

  async update() {
    if (!this.registration) return false;

    try {
      await this.registration.update();
      return true;
    } catch (error) {
      console.error('Service worker update failed:', error);
      return false;
    }
  }

  async skipWaiting() {
    if (!this.registration || !this.registration.waiting) return false;

    try {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      return true;
    } catch (error) {
      console.error('Skip waiting failed:', error);
      return false;
    }
  }

  async getRegistration() {
    return this.registration;
  }

  isUpdateAvailable() {
    return this.updateAvailable;
  }

  async requestSync() {
    if (!this.registration) return false;

    try {
      await this.registration.sync.register('sync-cards');
      return true;
    } catch (error) {
      console.error('Sync registration failed:', error);
      return false;
    }
  }
} 