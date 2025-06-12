const QUEUE_KEY = 'oblique_strategies_offline_queue';

export class OfflineQueue {
  constructor() {
    this.queue = new Map();
    this.loadQueue();
  }

  loadQueue() {
    try {
      const savedQueue = localStorage.getItem(QUEUE_KEY);
      if (savedQueue) {
        this.queue = new Map(JSON.parse(savedQueue));
      }
    } catch (error) {
      console.error('Error loading offline queue:', error);
      this.queue.clear();
    }
  }

  saveQueue() {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(Array.from(this.queue.entries())));
    } catch (error) {
      console.error('Error saving offline queue:', error);
      if (error.name === 'QuotaExceededError') {
        this.pruneOldOperations();
        this.saveQueue();
      }
    }
  }

  pruneOldOperations() {
    const operations = Array.from(this.queue.entries());
    const sortedOps = operations.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const removeCount = Math.ceil(operations.length * 0.2); // Remove oldest 20%
    
    sortedOps.slice(0, removeCount).forEach(([key]) => {
      this.queue.delete(key);
    });
  }

  addOperation(operation) {
    const timestamp = Date.now();
    const id = `${operation.type}_${operation.data.id}_${timestamp}`;
    
    this.queue.set(id, {
      ...operation,
      timestamp,
      retries: 0,
      status: 'pending'
    });

    this.saveQueue();
    return id;
  }

  getOperation(id) {
    return this.queue.get(id) || null;
  }

  getAllOperations() {
    return Array.from(this.queue.values());
  }

  getPendingOperations() {
    return this.getAllOperations().filter(op => op.status === 'pending');
  }

  updateOperation(id, updates) {
    const operation = this.queue.get(id);
    if (!operation) return false;

    this.queue.set(id, {
      ...operation,
      ...updates,
      timestamp: Date.now()
    });

    this.saveQueue();
    return true;
  }

  removeOperation(id) {
    const result = this.queue.delete(id);
    if (result) {
      this.saveQueue();
    }
    return result;
  }

  clear() {
    this.queue.clear();
    localStorage.removeItem(QUEUE_KEY);
  }

  size() {
    return this.queue.size;
  }

  isEmpty() {
    return this.queue.size === 0;
  }
} 