import { SyncService } from '../../src/services/SyncService.js';
import { jest } from '@jest/globals';

describe('SyncService', () => {
  let syncService;
  let mockOptions;

  beforeEach(() => {
    // Mock navigator.onLine
    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      writable: true
    });

    jest.useFakeTimers();

    mockOptions = {
      syncInterval: 1000,
      maxRetries: 2,
      onSyncStart: jest.fn(),
      onSyncComplete: jest.fn(),
      onSyncError: jest.fn()
    };

    syncService = new SyncService(mockOptions);
  });

  afterEach(() => {
    syncService.destroy();
    jest.useRealTimers();
  });

  describe('Initialization', () => {
    it('should initialize with correct default values', () => {
      expect(syncService.isOnline).toBe(true);
      expect(syncService.isSyncing).toBe(false);
      expect(syncService.retryCount).toBe(0);
      expect(syncService.syncQueue.size).toBe(0);
    });

    it('should start periodic sync when online', () => {
      jest.advanceTimersByTime(mockOptions.syncInterval);
      expect(mockOptions.onSyncStart).toHaveBeenCalled();
    });
  });

  describe('Online/Offline Handling', () => {
    it('should handle going offline', () => {
      window.dispatchEvent(new Event('offline'));
      expect(syncService.isOnline).toBe(false);
    });

    it('should handle going online and trigger sync', () => {
      syncService.isOnline = false;
      window.dispatchEvent(new Event('online'));
      expect(syncService.isOnline).toBe(true);
      expect(mockOptions.onSyncStart).toHaveBeenCalled();
    });
  });

  describe('Operation Queueing', () => {
    it('should queue operations', async () => {
      const operation = { type: 'update', data: { id: 1 } };
      await syncService.queueOperation(operation);
      expect(syncService.syncQueue.size).toBe(0); // Should be 0 after successful sync
      expect(mockOptions.onSyncStart).toHaveBeenCalled();
      expect(mockOptions.onSyncComplete).toHaveBeenCalled();
    });

    it('should not sync when offline', async () => {
      syncService.isOnline = false;
      const operation = { type: 'update', data: { id: 1 } };
      await syncService.queueOperation(operation);
      expect(syncService.syncQueue.size).toBe(1);
      expect(mockOptions.onSyncStart).not.toHaveBeenCalled();
    });
  });

  describe('Sync Process', () => {
    it('should process operations in batches', async () => {
      // Queue multiple operations
      for (let i = 0; i < 25; i++) {
        await syncService.queueOperation({ type: 'update', data: { id: i } });
      }

      expect(mockOptions.onSyncStart).toHaveBeenCalled();
      expect(mockOptions.onSyncComplete).toHaveBeenCalled();
      expect(syncService.syncQueue.size).toBe(0);
    });

    it('should handle sync failures with retry', async () => {
      // Mock a failing operation
      jest.spyOn(syncService, 'processOperation').mockRejectedValueOnce(new Error('Sync failed'));

      const operation = { type: 'update', data: { id: 1 } };
      await syncService.queueOperation(operation);

      expect(mockOptions.onSyncStart).toHaveBeenCalled();
      expect(syncService.retryCount).toBe(1);

      // Fast-forward through retry delay
      jest.advanceTimersByTime(2000);
      expect(mockOptions.onSyncStart).toHaveBeenCalledTimes(2);
    });

    it('should give up after max retries', async () => {
      // Mock consistently failing operation
      jest.spyOn(syncService, 'processOperation').mockRejectedValue(new Error('Sync failed'));

      const operation = { type: 'update', data: { id: 1 } };
      await syncService.queueOperation(operation);

      // Fast-forward through all retry attempts
      for (let i = 0; i < mockOptions.maxRetries; i++) {
        jest.advanceTimersByTime(Math.pow(2, i + 1) * 1000);
      }

      expect(mockOptions.onSyncError).toHaveBeenCalled();
      expect(syncService.syncQueue.size).toBe(0);
    });
  });

  describe('Cleanup', () => {
    it('should properly clean up resources on destroy', () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      syncService.destroy();
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });
}); 