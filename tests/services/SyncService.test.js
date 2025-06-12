import { SyncService } from '../../src/services/SyncService.js';
import { OfflineQueue } from '../../src/services/OfflineQueue.js';
import { jest } from '@jest/globals';

jest.mock('../../src/services/OfflineQueue.js');

describe('SyncService', () => {
  let syncService;
  let mockOfflineQueue;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock navigator.onLine
    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      writable: true
    });

    // Mock OfflineQueue
    mockOfflineQueue = {
      getPendingOperations: jest.fn(),
      updateOperation: jest.fn()
    };
    OfflineQueue.mockImplementation(() => mockOfflineQueue);

    // Create SyncService instance
    syncService = new SyncService({
      syncInterval: 1000, // Short interval for testing
      maxBatchSize: 2,
      maxRetries: 2,
      retryDelay: 100
    });
  });

  afterEach(() => {
    syncService.stop();
  });

  describe('Initialization', () => {
    it('should initialize with default options', () => {
      const defaultService = new SyncService();
      expect(defaultService.options.syncInterval).toBe(5 * 60 * 1000);
      expect(defaultService.options.maxBatchSize).toBe(50);
      expect(defaultService.options.maxRetries).toBe(3);
    });

    it('should initialize with custom options', () => {
      expect(syncService.options.syncInterval).toBe(1000);
      expect(syncService.options.maxBatchSize).toBe(2);
      expect(syncService.options.maxRetries).toBe(2);
    });
  });

  describe('Sync Management', () => {
    it('should start periodic sync when online', async () => {
      const syncSpy = jest.spyOn(syncService, 'sync');
      await syncService.start();
      
      expect(syncSpy).toHaveBeenCalledTimes(1);
      
      // Wait for timer
      await new Promise(resolve => setTimeout(resolve, 1100));
      expect(syncSpy).toHaveBeenCalledTimes(2);
    });

    it('should stop sync when going offline', async () => {
      const syncSpy = jest.spyOn(syncService, 'sync');
      await syncService.start();
      
      // Simulate offline
      window.dispatchEvent(new Event('offline'));
      
      // Wait for timer
      await new Promise(resolve => setTimeout(resolve, 1100));
      expect(syncSpy).toHaveBeenCalledTimes(1);
    });

    it('should resume sync when coming back online', async () => {
      const syncSpy = jest.spyOn(syncService, 'sync');
      await syncService.start();
      
      // Simulate offline then online
      window.dispatchEvent(new Event('offline'));
      window.dispatchEvent(new Event('online'));
      
      expect(syncSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Batch Processing', () => {
    it('should process operations in batches', async () => {
      const operations = [
        { id: '1', type: 'update' },
        { id: '2', type: 'delete' },
        { id: '3', type: 'create' }
      ];
      mockOfflineQueue.getPendingOperations.mockResolvedValue(operations);

      const batches = syncService.createBatches(operations);
      expect(batches).toHaveLength(2);
      expect(batches[0]).toHaveLength(2);
      expect(batches[1]).toHaveLength(1);
    });

    it('should retry failed batches', async () => {
      const operations = [{ id: '1', type: 'update' }];
      mockOfflineQueue.getPendingOperations.mockResolvedValue(operations);

      // Mock sendBatchToServer to fail once then succeed
      let attempts = 0;
      jest.spyOn(syncService, 'sendBatchToServer').mockImplementation(() => {
        attempts++;
        if (attempts === 1) {
          return Promise.reject(new Error('Server error'));
        }
        return Promise.resolve();
      });

      await syncService.sync();
      expect(attempts).toBe(2);
    });

    it('should mark operations as completed after successful sync', async () => {
      const operations = [{ id: '1', type: 'update' }];
      mockOfflineQueue.getPendingOperations.mockResolvedValue(operations);
      
      jest.spyOn(syncService, 'sendBatchToServer').mockResolvedValue();
      
      await syncService.sync();
      expect(mockOfflineQueue.updateOperation).toHaveBeenCalledWith('1', {
        status: 'completed',
        completedAt: expect.any(Number)
      });
    });
  });

  describe('Sync Listeners', () => {
    it('should notify listeners of sync events', async () => {
      const listener = jest.fn();
      syncService.addSyncListener(listener);

      const operations = [{ id: '1', type: 'update' }];
      mockOfflineQueue.getPendingOperations.mockResolvedValue(operations);
      jest.spyOn(syncService, 'sendBatchToServer').mockResolvedValue();

      await syncService.sync();

      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        status: 'started'
      }));
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        status: 'completed',
        operationsProcessed: 1
      }));
    });

    it('should notify listeners of sync errors', async () => {
      const listener = jest.fn();
      syncService.addSyncListener(listener);

      const operations = [{ id: '1', type: 'update' }];
      mockOfflineQueue.getPendingOperations.mockResolvedValue(operations);
      
      const error = new Error('Server error');
      jest.spyOn(syncService, 'sendBatchToServer').mockRejectedValue(error);

      await syncService.sync();

      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        status: 'error',
        error: error.message
      }));
    });

    it('should remove sync listeners', async () => {
      const listener = jest.fn();
      syncService.addSyncListener(listener);
      syncService.removeSyncListener(listener);

      await syncService.sync();
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('Conflict Resolution', () => {
    let mockBatch;

    beforeEach(() => {
      mockBatch = [
        {
          id: '1',
          data: { text: 'Local Change 1', lastModified: Date.now() },
          type: 'update'
        },
        {
          id: '2',
          data: { text: 'Local Change 2', lastModified: Date.now() - 5000 },
          type: 'update'
        }
      ];
    });

    it('should detect timestamp-based conflicts', async () => {
      const localData = {
        '1': { text: 'Local', lastModified: 200 },
        '2': { text: 'Local', lastModified: 100 }
      };
      const serverData = {
        '1': { text: 'Server', lastModified: 150 },
        '2': { text: 'Server', lastModified: 200 }
      };

      const conflicts = await syncService.conflictResolver.detectConflicts(localData, serverData);
      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].id).toBe('1');
      expect(conflicts[0].type).toBe('update_conflict');
      expect(conflicts[0].reason).toBe('timestamp_mismatch');
    });

    it('should detect content conflicts even with matching timestamps', async () => {
      const localData = {
        '1': { text: 'Local', lastModified: 100 }
      };
      const serverData = {
        '1': { text: 'Server', lastModified: 100 }
      };

      const conflicts = await syncService.conflictResolver.detectConflicts(localData, serverData);
      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].type).toBe('update_conflict');
      expect(conflicts[0].reason).toBe('content_mismatch');
    });

    it('should detect deletion conflicts', async () => {
      const localData = {
        '1': { text: 'Local', lastModified: 100 }
      };
      const serverData = {};

      const conflicts = await syncService.conflictResolver.detectConflicts(localData, serverData);
      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].type).toBe('delete_conflict');
      expect(conflicts[0].reason).toBe('server_deleted');
    });

    it('should always resolve conflicts in favor of server data', () => {
      const conflicts = [
        {
          id: '1',
          local: { text: 'Local', lastModified: 200 },
          server: { text: 'Server', lastModified: 150 },
          type: 'update_conflict',
          reason: 'timestamp_mismatch'
        }
      ];

      const resolutions = syncService.conflictResolver.resolveConflicts(conflicts);
      expect(resolutions).toHaveLength(1);
      expect(resolutions[0].resolution).toBe('server_wins');
      expect(resolutions[0].data).toEqual(conflicts[0].server);
      expect(resolutions[0].type).toBe('update_conflict');
      expect(resolutions[0].reason).toBe('timestamp_mismatch');
    });

    it('should maintain conflict logs', async () => {
      const localData = {
        '1': { text: 'Local', lastModified: 200 }
      };
      const serverData = {
        '1': { text: 'Server', lastModified: 150 }
      };

      await syncService.conflictResolver.detectConflicts(localData, serverData);
      const stats = syncService.conflictResolver.getConflictStats();
      
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.byType).toHaveProperty('update_conflict');
      expect(stats.byReason).toHaveProperty('timestamp_mismatch');
    });

    it('should limit conflict log size', async () => {
      const maxSize = syncService.conflictResolver.maxLogSize;
      const localData = { '1': { text: 'Local', lastModified: 200 } };
      const serverData = { '1': { text: 'Server', lastModified: 150 } };

      // Generate more conflicts than maxSize
      for (let i = 0; i < maxSize + 10; i++) {
        await syncService.conflictResolver.detectConflicts(localData, serverData);
      }

      const stats = syncService.conflictResolver.getConflictStats();
      expect(stats.total).toBeLessThanOrEqual(maxSize);
    });

    it('should create and retrieve backups', async () => {
      const data = { id: '1', text: 'Test' };
      const timestamp = syncService.conflictResolver.backupBeforeSync(data);
      
      const backup = await syncService.conflictResolver.rollback(timestamp);
      expect(backup).toEqual(data);
    });

    it('should clean up old backups', () => {
      const data = { id: '1', text: 'Test' };
      const timestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
      
      syncService.conflictResolver.backupData.set(timestamp, data);
      syncService.conflictResolver.cleanupBackups();
      
      expect(syncService.conflictResolver.backupData.has(timestamp)).toBe(false);
    });
  });

  describe('Batch Processing with Conflicts', () => {
    let mockBatch;
    let mockServerData;
    let syncListener;

    beforeEach(() => {
      mockBatch = [
        {
          id: '1',
          data: { text: 'Local Change 1', lastModified: Date.now() },
          type: 'update'
        },
        {
          id: '2',
          data: { text: 'Local Change 2', lastModified: Date.now() - 5000 },
          type: 'update'
        }
      ];

      mockServerData = {
        '1': { text: 'Server Version 1', lastModified: Date.now() + 1000 },
        '2': { text: 'Server Version 2', lastModified: Date.now() + 2000 }
      };

      syncListener = jest.fn();
      syncService.addSyncListener(syncListener);

      // Mock server data retrieval
      jest.spyOn(syncService, 'getServerData').mockResolvedValue(mockServerData);
      jest.spyOn(syncService, 'sendBatchToServer').mockResolvedValue();
    });

    it('should handle conflicts and notify listeners', async () => {
      await syncService.processBatch(mockBatch);

      // Verify conflict detection notification
      expect(syncListener).toHaveBeenCalledWith(expect.objectContaining({
        status: 'conflict_detected',
        conflicts: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            type: expect.any(String),
            reason: expect.any(String)
          })
        ])
      }));

      // Verify conflict resolution notification
      expect(syncListener).toHaveBeenCalledWith(expect.objectContaining({
        status: 'conflicts_resolved',
        resolutions: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            type: expect.any(String),
            reason: expect.any(String)
          })
        ])
      }));
    });

    it('should update operation metadata after conflict resolution', async () => {
      await syncService.processBatch(mockBatch);

      expect(mockOfflineQueue.updateOperation).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          status: 'completed',
          completedAt: expect.any(Number),
          metadata: expect.objectContaining({
            hadConflict: true,
            conflictType: expect.any(String),
            conflictReason: expect.any(String),
            resolvedAt: expect.any(Number)
          })
        })
      );
    });

    it('should handle rollback on sync failure', async () => {
      // Force sync to fail
      jest.spyOn(syncService, 'sendBatchToServer')
        .mockRejectedValue(new Error('Sync failed'));

      // Mock rollback functions
      const rollbackData = { ...mockBatch };
      jest.spyOn(syncService.conflictResolver, 'rollback')
        .mockResolvedValue(rollbackData);
      jest.spyOn(syncService, 'applyRollback')
        .mockResolvedValue();

      await expect(syncService.processBatch(mockBatch))
        .rejects.toThrow('Sync failed');

      // Verify rollback notifications
      expect(syncListener).toHaveBeenCalledWith(expect.objectContaining({
        status: 'rollback_completed',
        timestamp: expect.any(Number),
        operations: mockBatch.length
      }));
    });

    it('should handle rollback failures', async () => {
      // Force sync and rollback to fail
      jest.spyOn(syncService, 'sendBatchToServer')
        .mockRejectedValue(new Error('Sync failed'));
      jest.spyOn(syncService.conflictResolver, 'rollback')
        .mockRejectedValue(new Error('Rollback failed'));

      await expect(syncService.processBatch(mockBatch))
        .rejects.toThrow('Sync failed');

      // Verify rollback failure notification
      expect(syncListener).toHaveBeenCalledWith(expect.objectContaining({
        status: 'rollback_failed',
        error: 'Rollback failed'
      }));
    });

    it('should retry failed batches with exponential backoff', async () => {
      const delaySpy = jest.spyOn(syncService, 'delay').mockResolvedValue();
      let attempts = 0;

      // Fail twice then succeed
      jest.spyOn(syncService, 'sendBatchToServer').mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          return Promise.reject(new Error('Server error'));
        }
        return Promise.resolve();
      });

      await syncService.processBatch(mockBatch);

      expect(attempts).toBe(3);
      expect(delaySpy).toHaveBeenCalledTimes(2);
      expect(delaySpy).toHaveBeenNthCalledWith(1, 100); // Initial delay
      expect(delaySpy).toHaveBeenNthCalledWith(2, 200); // Doubled delay
    });
  });
}); 