export class OfflineService {
  constructor(options = {}) {
    this.options = {
      onOfflineChange: () => {},
      storageQuotaThreshold: 0.9, // 90% of available space
      ...options
    };

    this.isOnline = navigator.onLine;
    this.init();
  }

  init() {
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    this.checkStorageQuota();
  }

  handleOnline() {
    this.isOnline = true;
    this.options.onOfflineChange(true);
  }

  handleOffline() {
    this.isOnline = false;
    this.options.onOfflineChange(false);
  }

  async checkStorageQuota() {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const { usage, quota } = await navigator.storage.estimate();
        const usageRatio = usage / quota;
        
        if (usageRatio > this.options.storageQuotaThreshold) {
          console.warn(`Storage usage (${Math.round(usageRatio * 100)}%) exceeds threshold`);
          this.cleanupOldData();
        }
      }
    } catch (error) {
      console.error('Error checking storage quota:', error);
    }
  }

  async cleanupOldData() {
    try {
      // Get all keys in localStorage
      const keys = Object.keys(localStorage);
      
      // Sort by timestamp if available
      const sortedKeys = keys.sort((a, b) => {
        const aTime = localStorage.getItem(a)?.timestamp || 0;
        const bTime = localStorage.getItem(b)?.timestamp || 0;
        return aTime - bTime;
      });

      // Remove oldest 20% of items
      const removeCount = Math.ceil(sortedKeys.length * 0.2);
      sortedKeys.slice(0, removeCount).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error cleaning up old data:', error);
    }
  }

  destroy() {
    window.removeEventListener('online', this.handleOnline.bind(this));
    window.removeEventListener('offline', this.handleOffline.bind(this));
  }
} 