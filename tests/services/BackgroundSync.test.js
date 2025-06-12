import { BackgroundSync } from '../../src/services/BackgroundSync.js';
import { jest } from '@jest/globals';

describe('BackgroundSync', () => {
  let backgroundSync;
  let mockOptions;

  beforeEach(() => {
    // Mock navigator APIs
    global.navigator.onLine = true;
    global.navigator.storage = {
      estimate: jest.fn().mockResolvedValue({
        quota: 100 * 1024 * 1024, // 100MB
        usage: 10 * 1024 * 1024 // 10MB
      })
    };
    global.navigator.getBattery = jest.fn().mockResolvedValue({
      charging: true,
      level: 0.8
    });
    global.navigator.connection = {
      saveData: false,
      type: 'wifi'
    };

    jest.useFakeTimers();

    mockOptions = {
      minSyncInterval: 1000,
      maxSyncInterval: 5000,
      maxRetries: 3,
      minRetryDelay: 100,
      maxRetryDelay: 1000,
      batteryThreshold: 0.2,
      onSyncStart: jest.fn(),
      onSyncComplete: jest.fn(),
      onSyncError: jest.fn(),
      onHealthCheck: jest.fn()
    };

    backgroundSync = new BackgroundSync(mockOptions);
  });

  afterEach(() => {
    backgroundSync.destroy();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with correct default values', () => {
      expect(backgroundSync.isRunning).toBe(false);
      expect(backgroundSync.retryCount).toBe(0);
      expect(backgroundSync.metrics.syncAttempts).toBe(0);
    });

    it('should start interval sync when service worker is not available', () => {
      const calculateSpy = jest.spyOn(backgroundSync, 'calculateNextSyncInterval');
      jest.advanceTimersByTime(mockOptions.minSyncInterval);
      expect(calculateSpy).toHaveBeenCalled();
    });
  });

  describe('Sync Conditions', () => {
    it('should not sync when battery is low', async () => {
      global.navigator.getBattery = jest.fn().mockResolvedValue({
        charging: false,
        level: 0.1
      });

      const canSync = await backgroundSync.canSync();
      expect(canSync).toBe(false);
    });

    it('should not sync on cellular connection with data saver', async () => {
      global.navigator.connection = {
        saveData: true,
        type: 'cellular'
      };

      const canSync = await backgroundSync.canSync();
      expect(canSync).toBe(false);
    });

    it('should check storage quota before sync', async () => {
      global.navigator.storage.estimate = jest.fn().mockResolvedValue({
        quota: 2 * 1024 * 1024, // 2MB
        usage: 1.5 * 1024 * 1024 // 1.5MB
      });

      await expect(backgroundSync.performSync()).rejects.toThrow('Insufficient storage space');
    });
  });

  describe('Sync Process', () => {
    it('should handle successful sync', async () => {
      await backgroundSync.sync();
      expect(mockOptions.onSyncStart).toHaveBeenCalled();
      expect(mockOptions.onSyncComplete).toHaveBeenCalled();
      expect(backgroundSync.metrics.syncSuccesses).toBe(1);
    });

    it('should handle sync failures with retry', async () => {
      // Mock a failing sync
      jest.spyOn(backgroundSync, 'performSync').mockRejectedValueOnce(new Error('Sync failed'));

      await backgroundSync.sync();
      expect(mockOptions.onSyncError).toHaveBeenCalled();
      expect(backgroundSync.retryCount).toBe(1);

      // Should schedule retry
      expect(setTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        mockOptions.minRetryDelay
      );
    });

    it('should respect max retries', async () => {
      // Mock consistently failing sync
      jest.spyOn(backgroundSync, 'performSync').mockRejectedValue(new Error('Sync failed'));

      await backgroundSync.sync();

      // Fast-forward through all retry attempts
      for (let i = 0; i < mockOptions.maxRetries; i++) {
        jest.advanceTimersByTime(mockOptions.minRetryDelay * Math.pow(2, i));
      }

      expect(backgroundSync.metrics.syncFailures).toBe(mockOptions.maxRetries + 1);
      expect(backgroundSync.retryCount).toBe(0);
    });
  });

  describe('Metrics and Health Monitoring', () => {
    it('should track sync metrics', async () => {
      await backgroundSync.sync();
      expect(backgroundSync.metrics.syncAttempts).toBe(1);
      expect(backgroundSync.metrics.lastSyncTime).toBeTruthy();
      expect(backgroundSync.syncDurations.length).toBe(1);
    });

    it('should maintain rolling average of sync durations', async () => {
      // Perform multiple syncs
      for (let i = 0; i < 5; i++) {
        await backgroundSync.sync();
      }

      expect(backgroundSync.metrics.averageSyncDuration).toBeGreaterThan(0);
      expect(backgroundSync.syncDurations.length).toBeLessThanOrEqual(10);
    });

    it('should report health status', () => {
      jest.advanceTimersByTime(5 * 60 * 1000); // 5 minutes
      expect(mockOptions.onHealthCheck).toHaveBeenCalledWith(
        expect.objectContaining({
          syncSuccessRate: expect.any(Number),
          errorRate: expect.any(Number),
          isHealthy: expect.any(Boolean)
        })
      );
    });

    it('should detect unhealthy state', async () => {
      // Mock multiple failures
      jest.spyOn(backgroundSync, 'performSync').mockRejectedValue(new Error('Sync failed'));

      for (let i = 0; i < 5; i++) {
        await backgroundSync.sync();
      }

      jest.advanceTimersByTime(5 * 60 * 1000);
      expect(mockOptions.onHealthCheck).toHaveBeenCalledWith(
        expect.objectContaining({
          isHealthy: false
        })
      );
    });
  });

  describe('Resource Management', () => {
    it('should clean up resources on destroy', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      backgroundSync.destroy();
      expect(clearTimeoutSpy).toHaveBeenCalled();
      expect(backgroundSync.isRunning).toBe(false);
    });

    it('should handle data compression when storage is low', async () => {
      const compressSpy = jest.spyOn(backgroundSync, 'compressData');
      
      // Mock low storage
      global.navigator.storage.estimate = jest.fn().mockResolvedValue({
        quota: 100 * 1024 * 1024,
        usage: 95 * 1024 * 1024
      });

      await backgroundSync.performSync();
      expect(compressSpy).toHaveBeenCalled();
    });
  });

  describe('Bandwidth Management', () => {
    beforeEach(() => {
      // Mock prepareSyncData to return test data
      backgroundSync.prepareSyncData = jest.fn().mockResolvedValue({
        data: Array(100).fill('test'),
        size: 1024 * 1024 // 1MB
      });

      // Mock processSyncChunk
      backgroundSync.processSyncChunk = jest.fn().mockResolvedValue(true);
    });

    it('should track bandwidth usage', async () => {
      await backgroundSync.sync();
      expect(backgroundSync.bandwidthMetrics.bytesTransferred).toBeGreaterThan(0);
      expect(backgroundSync.bandwidthMetrics.transferRate).toBeGreaterThan(0);
    });

    it('should throttle sync when bandwidth limit is exceeded', async () => {
      // Set a very low bandwidth limit
      backgroundSync.options.maxBandwidthUsage = 1024; // 1KB
      const throttleSpy = jest.spyOn(backgroundSync, 'handleBandwidthThrottling');

      await backgroundSync.sync();
      expect(throttleSpy).toHaveBeenCalled();
      expect(backgroundSync.bandwidthMetrics.throttled).toBe(true);
    });

    it('should split large data into chunks', async () => {
      const testData = Array(1000).fill('test');
      const chunks = backgroundSync.splitDataIntoChunks(testData, 100);
      expect(chunks.length).toBe(10);
      expect(chunks[0].length).toBe(100);
    });

    it('should respect bandwidth throttle delay', async () => {
      backgroundSync.options.maxBandwidthUsage = 1024; // 1KB
      backgroundSync.options.bandwidthThrottleDelay = 1000; // 1 second

      const startTime = Date.now();
      await backgroundSync.sync();
      const duration = Date.now() - startTime;

      expect(duration).toBeGreaterThanOrEqual(backgroundSync.options.bandwidthThrottleDelay);
    });

    it('should update health metrics when bandwidth limit is exceeded', async () => {
      // Set a very low bandwidth limit
      backgroundSync.options.maxBandwidthUsage = 512; // 512 bytes
      
      await backgroundSync.sync();
      expect(backgroundSync.metrics.lastError).toBeTruthy();
      expect(backgroundSync.metrics.lastError.message).toBe('Bandwidth threshold exceeded');
    });

    it('should reset bandwidth metrics before each sync', async () => {
      // Perform initial sync
      await backgroundSync.sync();
      const initialTransferred = backgroundSync.bandwidthMetrics.bytesTransferred;

      // Reset metrics
      backgroundSync.resetBandwidthMetrics();
      expect(backgroundSync.bandwidthMetrics.bytesTransferred).toBe(0);
      expect(backgroundSync.bandwidthMetrics.throttled).toBe(false);

      // Perform another sync
      await backgroundSync.sync();
      expect(backgroundSync.bandwidthMetrics.bytesTransferred).toBeLessThan(initialTransferred * 2);
    });

    it('should calculate effective transfer rate correctly', () => {
      const testBytes = 1024 * 1024; // 1MB
      backgroundSync.bandwidthMetrics.lastTransferTime = Date.now() - 1000; // 1 second ago
      
      const wouldExceed = backgroundSync.wouldExceedBandwidthLimit(testBytes);
      expect(wouldExceed).toBe(true); // Should exceed 1MB/s limit
    });
  });
}); 