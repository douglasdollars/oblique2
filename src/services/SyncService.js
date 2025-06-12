import { OfflineQueue } from './OfflineQueue.js';

const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
const MAX_BATCH_SIZE = 50;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // Start with 1 second

class ConflictResolution {
  constructor() {
    this.backupData = new Map();
    this.conflictLog = [];
    this.maxLogSize = 1000; // Keep last 1000 conflicts
  }

  backupBeforeSync(data) {
    const timestamp = Date.now();
    this.backupData.set(timestamp, JSON.parse(JSON.stringify(data)));
    return timestamp;
  }

  async detectConflicts(localData, serverData) {
    const conflicts = [];
    
    // Check for updates
    for (const [id, serverItem] of Object.entries(serverData)) {
      const localItem = localData[id];
      if (localItem) {
        // Detect timestamp conflicts
        if (localItem.lastModified > serverItem.lastModified) {
          conflicts.push({
            id,
            local: localItem,
            server: serverItem,
            type: 'update_conflict',
            reason: 'timestamp_mismatch'
          });
          continue;
        }

        // Detect content conflicts even if timestamps match
        if (JSON.stringify(localItem) !== JSON.stringify(serverItem)) {
          conflicts.push({
            id,
            local: localItem,
            server: serverItem,
            type: 'update_conflict',
            reason: 'content_mismatch'
          });
        }
      }
    }

    // Check for deletions
    for (const [id, localItem] of Object.entries(localData)) {
      if (!serverData[id]) {
        conflicts.push({
          id,
          local: localItem,
          server: null,
          type: 'delete_conflict',
          reason: 'server_deleted'
        });
      }
    }

    // Log conflicts
    this.logConflicts(conflicts);
    
    return conflicts;
  }

  resolveConflicts(conflicts) {
    return conflicts.map(conflict => {
      const resolution = {
        id: conflict.id,
        resolution: 'server_wins',
        data: conflict.server,
        timestamp: Date.now(),
        type: conflict.type,
        reason: conflict.reason
      };

      // Log resolution
      this.logResolution(resolution);

      return resolution;
    });
  }

  async rollback(timestamp) {
    const backup = this.backupData.get(timestamp);
    if (!backup) {
      throw new Error('Backup not found for rollback');
    }
    return backup;
  }

  cleanupBackups(maxAgeMs = 24 * 60 * 60 * 1000) { // 24 hours
    const now = Date.now();
    for (const [timestamp] of this.backupData.entries()) {
      if (now - timestamp > maxAgeMs) {
        this.backupData.delete(timestamp);
      }
    }
  }

  logConflicts(conflicts) {
    const logEntry = {
      timestamp: Date.now(),
      conflicts: conflicts.map(c => ({
        id: c.id,
        type: c.type,
        reason: c.reason
      }))
    };

    this.conflictLog.push(logEntry);
    
    // Maintain max log size
    if (this.conflictLog.length > this.maxLogSize) {
      this.conflictLog = this.conflictLog.slice(-this.maxLogSize);
    }
  }

  logResolution(resolution) {
    const logEntry = {
      timestamp: resolution.timestamp,
      id: resolution.id,
      type: resolution.type,
      reason: resolution.reason,
      resolution: resolution.resolution
    };

    this.conflictLog.push(logEntry);
    
    // Maintain max log size
    if (this.conflictLog.length > this.maxLogSize) {
      this.conflictLog = this.conflictLog.slice(-this.maxLogSize);
    }
  }

  getConflictStats() {
    const now = Date.now();
    const last24Hours = this.conflictLog.filter(
      log => now - log.timestamp < 24 * 60 * 60 * 1000
    );

    return {
      total: this.conflictLog.length,
      last24Hours: last24Hours.length,
      byType: this.conflictLog.reduce((acc, log) => {
        acc[log.type] = (acc[log.type] || 0) + 1;
        return acc;
      }, {}),
      byReason: this.conflictLog.reduce((acc, log) => {
        acc[log.reason] = (acc[log.reason] || 0) + 1;
        return acc;
      }, {})
    };
  }
}

export class SyncService {
  constructor(options = {}) {
    this.options = {
      syncInterval: SYNC_INTERVAL,
      maxBatchSize: MAX_BATCH_SIZE,
      maxRetries: MAX_RETRIES,
      retryDelay: RETRY_DELAY,
      ...options
    };

    this.offlineQueue = new OfflineQueue();
    this.syncTimer = null;
    this.isSyncing = false;
    this.lastSyncTime = 0;
    this.syncListeners = new Set();
    this.conflictResolver = new ConflictResolution();
  }

  async start() {
    // Start periodic sync
    this.scheduleSyncTimer();

    // Listen for online/offline events
    window.addEventListener('online', () => this.onOnline());
    window.addEventListener('offline', () => this.onOffline());

    // Initial sync if online
    if (navigator.onLine) {
      await this.sync();
    }
  }

  stop() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    window.removeEventListener('online', () => this.onOnline());
    window.removeEventListener('offline', () => this.onOffline());
  }

  scheduleSyncTimer() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    this.syncTimer = setInterval(() => {
      if (navigator.onLine && !this.isSyncing) {
        this.sync();
      }
    }, this.options.syncInterval);
  }

  async onOnline() {
    console.log('Connection restored, starting sync...');
    await this.sync();
  }

  onOffline() {
    console.log('Connection lost, pausing sync...');
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  addSyncListener(listener) {
    this.syncListeners.add(listener);
  }

  removeSyncListener(listener) {
    this.syncListeners.delete(listener);
  }

  notifySyncListeners(status, details = {}) {
    this.syncListeners.forEach(listener => {
      try {
        listener({ status, timestamp: Date.now(), ...details });
      } catch (error) {
        console.error('Error in sync listener:', error);
      }
    });
  }

  async sync() {
    if (this.isSyncing) {
      console.log('Sync already in progress, skipping...');
      return;
    }

    this.isSyncing = true;
    this.notifySyncListeners('started');

    try {
      // Get pending operations
      const operations = this.offlineQueue.getPendingOperations();
      if (operations.length === 0) {
        console.log('No pending operations to sync');
        this.notifySyncListeners('completed', { operationsProcessed: 0 });
        return;
      }

      // Process operations in batches
      const batches = this.createBatches(operations);
      let processedCount = 0;

      for (const batch of batches) {
        try {
          await this.processBatch(batch);
          processedCount += batch.length;
          this.notifySyncListeners('progress', {
            processed: processedCount,
            total: operations.length
          });
        } catch (error) {
          console.error('Batch processing failed:', error);
          this.notifySyncListeners('error', { error: error.message });
        }
      }

      this.lastSyncTime = Date.now();
      this.notifySyncListeners('completed', {
        operationsProcessed: processedCount
      });
    } catch (error) {
      console.error('Sync failed:', error);
      this.notifySyncListeners('error', { error: error.message });
    } finally {
      this.isSyncing = false;
    }
  }

  createBatches(operations) {
    const batches = [];
    for (let i = 0; i < operations.length; i += this.options.maxBatchSize) {
      batches.push(operations.slice(i, i + this.options.maxBatchSize));
    }
    return batches;
  }

  async processBatch(batch) {
    let retries = 0;
    let delay = this.options.retryDelay;

    // Backup data before processing
    const backupTimestamp = this.conflictResolver.backupBeforeSync(batch);

    while (retries < this.options.maxRetries) {
      try {
        // Get server data for conflict detection
        const serverData = await this.getServerData(batch.map(op => op.id));
        
        // Detect conflicts
        const conflicts = await this.conflictResolver.detectConflicts(
          batch.reduce((acc, op) => ({ ...acc, [op.id]: op.data }), {}),
          serverData
        );

        if (conflicts.length > 0) {
          // Notify listeners about conflicts
          this.notifySyncListeners('conflict_detected', {
            conflicts: conflicts.map(c => ({
              id: c.id,
              type: c.type,
              reason: c.reason
            }))
          });

          // Resolve conflicts (server wins)
          const resolutions = this.conflictResolver.resolveConflicts(conflicts);
          
          // Apply resolutions
          for (const resolution of resolutions) {
            const operation = batch.find(op => op.id === resolution.id);
            if (operation) {
              operation.data = resolution.data;
              operation.metadata = {
                ...operation.metadata,
                hadConflict: true,
                conflictType: resolution.type,
                conflictReason: resolution.reason,
                resolvedAt: resolution.timestamp
              };
            }
          }

          // Notify listeners about resolution
          this.notifySyncListeners('conflicts_resolved', {
            resolutions: resolutions.map(r => ({
              id: r.id,
              type: r.type,
              reason: r.reason
            }))
          });
        }

        // Send resolved batch to server
        await this.sendBatchToServer(batch);
        
        // Mark operations as completed
        batch.forEach(operation => {
          this.offlineQueue.updateOperation(operation.id, {
            status: 'completed',
            completedAt: Date.now(),
            metadata: operation.metadata
          });
        });

        // Cleanup old backups periodically
        this.conflictResolver.cleanupBackups();

        // Log sync stats
        const stats = this.conflictResolver.getConflictStats();
        console.log('Sync stats:', stats);

        return;
      } catch (error) {
        retries++;
        if (retries >= this.options.maxRetries) {
          // Attempt rollback on final failure
          try {
            const rollbackData = await this.conflictResolver.rollback(backupTimestamp);
            await this.applyRollback(rollbackData);
            
            this.notifySyncListeners('rollback_completed', {
              timestamp: backupTimestamp,
              operations: batch.length
            });
          } catch (rollbackError) {
            console.error('Rollback failed:', rollbackError);
            this.notifySyncListeners('rollback_failed', {
              error: rollbackError.message
            });
          }
          throw error;
        }

        // Exponential backoff
        await this.delay(delay);
        delay *= 2;
      }
    }
  }

  async getServerData(ids) {
    // This would be implemented to fetch current server data
    // For now, we'll simulate server data
    return new Promise((resolve) => {
      setTimeout(() => {
        const serverData = {};
        ids.forEach(id => {
          serverData[id] = {
            id,
            lastModified: Date.now() - Math.random() * 1000000
          };
        });
        resolve(serverData);
      }, 50);
    });
  }

  async applyRollback(rollbackData) {
    // This would be implemented to restore data to its backup state
    // For now, we'll just log the rollback
    console.log('Applying rollback:', rollbackData);
    return Promise.resolve();
  }

  async sendBatchToServer(batch) {
    // This would be implemented to send data to your server
    // For now, we'll simulate a server call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          resolve();
        } else {
          reject(new Error('Server error'));
        }
      }, 100);
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getLastSyncTime() {
    return this.lastSyncTime;
  }

  isCurrentlySyncing() {
    return this.isSyncing;
  }
} 