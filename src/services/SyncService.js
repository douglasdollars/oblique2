export class SyncService {
  constructor(options = {}) {
    this.options = {
      syncInterval: 5 * 60 * 1000, // 5 minutes
      maxRetries: 3,
      onSyncStart: () => {},
      onSyncComplete: () => {},
      onSyncError: () => {},
      ...options
    };

    this.syncQueue = new Map();
    this.isOnline = navigator.onLine;
    this.isSyncing = false;
    this.retryCount = 0;

    this.init();
  }

  init() {
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // Start periodic sync if online
    if (this.isOnline) {
      this.startPeriodicSync();
    }
  }

  handleOnline() {
    this.isOnline = true;
    this.sync(); // Attempt sync when coming online
  }

  handleOffline() {
    this.isOnline = false;
    this.stopPeriodicSync();
  }

  startPeriodicSync() {
    this.syncInterval = setInterval(() => {
      if (this.isOnline && !this.isSyncing) {
        this.sync();
      }
    }, this.options.syncInterval);
  }

  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async queueOperation(operation) {
    const timestamp = Date.now();
    this.syncQueue.set(timestamp, {
      ...operation,
      timestamp,
      retries: 0
    });

    // Attempt immediate sync if online
    if (this.isOnline && !this.isSyncing) {
      await this.sync();
    }
  }

  async sync() {
    if (this.isSyncing || !this.isOnline) return;

    try {
      this.isSyncing = true;
      this.options.onSyncStart();

      const operations = Array.from(this.syncQueue.values());
      
      // Sort operations by timestamp
      operations.sort((a, b) => a.timestamp - b.timestamp);

      // Process operations in batches
      const batchSize = 10;
      for (let i = 0; i < operations.length; i += batchSize) {
        const batch = operations.slice(i, i + batchSize);
        await this.processBatch(batch);
      }

      this.retryCount = 0;
      this.options.onSyncComplete();
    } catch (error) {
      console.error('Sync failed:', error);
      this.retryCount++;

      if (this.retryCount < this.options.maxRetries) {
        // Exponential backoff for retries
        const delay = Math.pow(2, this.retryCount) * 1000;
        setTimeout(() => this.sync(), delay);
      } else {
        this.options.onSyncError(error);
      }
    } finally {
      this.isSyncing = false;
    }
  }

  async processBatch(operations) {
    const results = await Promise.allSettled(
      operations.map(operation => this.processOperation(operation))
    );

    results.forEach((result, index) => {
      const operation = operations[index];
      if (result.status === 'fulfilled') {
        this.syncQueue.delete(operation.timestamp);
      } else {
        operation.retries++;
        if (operation.retries >= this.options.maxRetries) {
          this.syncQueue.delete(operation.timestamp);
          console.error(`Operation failed after ${this.options.maxRetries} retries:`, operation);
        }
      }
    });
  }

  async processOperation(operation) {
    // Implementation will be added in the next phase
    // This is where we'll handle server communication and conflict resolution
    return Promise.resolve();
  }

  destroy() {
    this.stopPeriodicSync();
    window.removeEventListener('online', this.handleOnline.bind(this));
    window.removeEventListener('offline', this.handleOffline.bind(this));
  }
} 