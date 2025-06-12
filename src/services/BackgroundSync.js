export class BackgroundSync {
  constructor(options = {}) {
    this.options = {
      minSyncInterval: 5 * 60 * 1000, // 5 minutes
      maxSyncInterval: 30 * 60 * 1000, // 30 minutes
      maxRetries: 5,
      minRetryDelay: 1000, // 1 second
      maxRetryDelay: 60 * 1000, // 1 minute
      batteryThreshold: 0.2, // 20% battery threshold
      maxBandwidthUsage: 1024 * 1024, // 1MB per sync
      bandwidthThrottleDelay: 1000, // 1 second delay when throttling
      onSyncStart: () => {},
      onSyncComplete: () => {},
      onSyncError: () => {},
      onHealthCheck: () => {},
      ...options
    };

    this.metrics = {
      syncAttempts: 0,
      syncSuccesses: 0,
      syncFailures: 0,
      lastSyncTime: null,
      lastError: null,
      averageSyncDuration: 0
    };

    this.retryCount = 0;
    this.nextSyncTimeout = null;
    this.isRunning = false;

    // Initialize performance monitoring
    this.syncDurations = [];
    this.errorLog = [];

    // Add bandwidth tracking
    this.bandwidthMetrics = {
      bytesTransferred: 0,
      lastTransferTime: null,
      transferRate: 0,
      throttled: false
    };

    this.init();
  }

  async init() {
    // Register service worker if supported
    if ('serviceWorker' in navigator && 'sync' in window.registration) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('background-sync');
      } catch (error) {
        console.warn('Background sync registration failed:', error);
        // Fall back to interval-based sync
        this.startIntervalSync();
      }
    } else {
      // Fall back to interval-based sync
      this.startIntervalSync();
    }

    // Start health monitoring
    this.startHealthCheck();
  }

  startIntervalSync() {
    const scheduleNextSync = () => {
      const interval = this.calculateNextSyncInterval();
      this.nextSyncTimeout = setTimeout(() => this.sync(), interval);
    };

    scheduleNextSync();
  }

  calculateNextSyncInterval() {
    // Adaptive interval based on sync success rate
    const successRate = this.metrics.syncSuccesses / 
      (this.metrics.syncAttempts || 1);
    
    const interval = successRate > 0.8 
      ? this.options.maxSyncInterval 
      : this.options.minSyncInterval;

    return interval;
  }

  async sync() {
    if (this.isRunning || !await this.canSync()) return;

    try {
      this.isRunning = true;
      this.metrics.syncAttempts++;
      this.options.onSyncStart();

      const startTime = performance.now();
      
      // Perform sync operation
      await this.performSync();

      // Update metrics
      const duration = performance.now() - startTime;
      this.updateMetrics(duration, true);

      this.retryCount = 0;
      this.options.onSyncComplete();
    } catch (error) {
      this.handleSyncError(error);
    } finally {
      this.isRunning = false;
      this.scheduleNextSync();
    }
  }

  async performSync() {
    // Check network conditions
    if (!navigator.onLine) {
      throw new Error('No network connection');
    }

    // Reset bandwidth metrics for new sync
    this.resetBandwidthMetrics();

    // Check storage quota
    const quota = await this.checkStorageQuota();
    if (quota.remaining < 1024 * 1024) { // 1MB minimum
      throw new Error('Insufficient storage space');
    }

    // Compress data if needed
    if (quota.remaining < quota.total * 0.1) { // Less than 10% remaining
      await this.compressData();
    }

    // Get data to sync with size estimation
    const syncData = await this.prepareSyncData();
    
    // Check if sync would exceed bandwidth limit
    if (this.wouldExceedBandwidthLimit(syncData.size)) {
      await this.handleBandwidthThrottling(syncData.size);
    }

    // Perform sync in chunks if needed
    await this.syncWithBandwidthControl(syncData);

    return Promise.resolve();
  }

  async canSync() {
    // Check battery status if API is available
    if ('getBattery' in navigator) {
      const battery = await navigator.getBattery();
      if (!battery.charging && battery.level < this.options.batteryThreshold) {
        return false;
      }
    }

    // Check network conditions
    if ('connection' in navigator) {
      const connection = navigator.connection;
      if (connection.saveData || connection.type === 'cellular') {
        // Respect data saver settings and avoid expensive cellular sync
        return false;
      }
    }

    return true;
  }

  async checkStorageQuota() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        total: estimate.quota,
        used: estimate.usage,
        remaining: estimate.quota - estimate.usage
      };
    }
    return { total: Infinity, used: 0, remaining: Infinity };
  }

  async compressData() {
    // Data compression implementation will be added when needed
    return Promise.resolve();
  }

  handleSyncError(error) {
    this.metrics.syncFailures++;
    this.metrics.lastError = error;
    this.errorLog.push({
      timestamp: Date.now(),
      error: error.message,
      retryCount: this.retryCount
    });

    console.error('Sync failed:', error);
    this.options.onSyncError(error);

    if (this.retryCount < this.options.maxRetries) {
      this.scheduleRetry();
    } else {
      this.retryCount = 0;
      // Log critical failure
      console.error('Max retries exceeded');
    }
  }

  scheduleRetry() {
    this.retryCount++;
    const delay = Math.min(
      this.options.minRetryDelay * Math.pow(2, this.retryCount),
      this.options.maxRetryDelay
    );

    setTimeout(() => this.sync(), delay);
  }

  scheduleNextSync() {
    if (this.nextSyncTimeout) {
      clearTimeout(this.nextSyncTimeout);
    }
    this.startIntervalSync();
  }

  updateMetrics(duration, success) {
    this.syncDurations.push(duration);
    if (this.syncDurations.length > 10) {
      this.syncDurations.shift();
    }

    this.metrics.averageSyncDuration = 
      this.syncDurations.reduce((a, b) => a + b, 0) / this.syncDurations.length;
    
    if (success) {
      this.metrics.syncSuccesses++;
      this.metrics.lastSyncTime = Date.now();
    }
  }

  startHealthCheck() {
    setInterval(() => {
      const health = {
        syncSuccessRate: this.metrics.syncSuccesses / (this.metrics.syncAttempts || 1),
        averageSyncDuration: this.metrics.averageSyncDuration,
        lastSyncTime: this.metrics.lastSyncTime,
        errorRate: this.metrics.syncFailures / (this.metrics.syncAttempts || 1),
        lastError: this.metrics.lastError,
        isHealthy: true
      };

      // Define health thresholds
      if (health.syncSuccessRate < 0.7 || 
          health.errorRate > 0.3 ||
          (Date.now() - (health.lastSyncTime || 0)) > this.options.maxSyncInterval * 2) {
        health.isHealthy = false;
      }

      this.options.onHealthCheck(health);
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  destroy() {
    if (this.nextSyncTimeout) {
      clearTimeout(this.nextSyncTimeout);
    }
    this.isRunning = false;
  }

  resetBandwidthMetrics() {
    this.bandwidthMetrics = {
      bytesTransferred: 0,
      lastTransferTime: Date.now(),
      transferRate: 0,
      throttled: false
    };
  }

  wouldExceedBandwidthLimit(additionalBytes) {
    const timeSinceLastTransfer = Date.now() - (this.bandwidthMetrics.lastTransferTime || 0);
    const effectiveRate = (this.bandwidthMetrics.bytesTransferred + additionalBytes) / 
      (timeSinceLastTransfer / 1000);
    
    return effectiveRate > this.options.maxBandwidthUsage;
  }

  async handleBandwidthThrottling(dataSize) {
    this.bandwidthMetrics.throttled = true;
    
    // Calculate required delay based on current usage
    const requiredDelay = Math.ceil(
      (dataSize / this.options.maxBandwidthUsage) * 1000
    );

    // Apply throttling delay
    await new Promise(resolve => 
      setTimeout(resolve, Math.min(requiredDelay, this.options.bandwidthThrottleDelay))
    );
  }

  async syncWithBandwidthControl(syncData) {
    const chunkSize = this.options.maxBandwidthUsage;
    const chunks = this.splitDataIntoChunks(syncData.data, chunkSize);

    for (const chunk of chunks) {
      // Check bandwidth before processing chunk
      if (this.wouldExceedBandwidthLimit(chunk.length)) {
        await this.handleBandwidthThrottling(chunk.length);
      }

      // Process chunk
      await this.processSyncChunk(chunk);

      // Update bandwidth metrics
      this.updateBandwidthMetrics(chunk.length);
    }
  }

  splitDataIntoChunks(data, chunkSize) {
    // Implementation will vary based on data structure
    // This is a placeholder that assumes data is an array
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
  }

  async processSyncChunk(chunk) {
    // Implementation will be added when server integration is ready
    // This is where actual data transfer would happen
    return Promise.resolve();
  }

  updateBandwidthMetrics(bytesTransferred) {
    const now = Date.now();
    const timeDiff = (now - this.bandwidthMetrics.lastTransferTime) / 1000;
    
    this.bandwidthMetrics.bytesTransferred += bytesTransferred;
    this.bandwidthMetrics.transferRate = this.bandwidthMetrics.bytesTransferred / timeDiff;
    this.bandwidthMetrics.lastTransferTime = now;

    // Update health metrics
    if (this.bandwidthMetrics.transferRate > this.options.maxBandwidthUsage) {
      this.metrics.lastError = new Error('Bandwidth threshold exceeded');
    }
  }

  async prepareSyncData() {
    // Implementation will be added when server integration is ready
    // This should return { data: [], size: 0 }
    return Promise.resolve({ data: [], size: 0 });
  }
} 