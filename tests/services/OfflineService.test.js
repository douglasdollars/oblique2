import { OfflineService } from '../../src/services/OfflineService.js';
import { jest } from '@jest/globals';

describe('OfflineService', () => {
  let offlineService;
  let mockOnOfflineChange;

  beforeEach(() => {
    // Mock navigator.onLine
    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      writable: true
    });

    // Mock storage API
    global.navigator.storage = {
      estimate: jest.fn().mockResolvedValue({ usage: 800, quota: 1000 })
    };

    mockOnOfflineChange = jest.fn();
    offlineService = new OfflineService({
      onOfflineChange: mockOnOfflineChange
    });
  });

  afterEach(() => {
    offlineService.destroy();
  });

  describe('Online/Offline Detection', () => {
    it('should initialize with correct online status', () => {
      expect(offlineService.isOnline).toBe(true);
    });

    it('should handle going offline', () => {
      window.dispatchEvent(new Event('offline'));
      expect(offlineService.isOnline).toBe(false);
      expect(mockOnOfflineChange).toHaveBeenCalledWith(false);
    });

    it('should handle going online', () => {
      window.dispatchEvent(new Event('online'));
      expect(offlineService.isOnline).toBe(true);
      expect(mockOnOfflineChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Storage Quota Management', () => {
    it('should check storage quota on initialization', async () => {
      expect(navigator.storage.estimate).toHaveBeenCalled();
    });

    it('should trigger cleanup when storage usage exceeds threshold', async () => {
      // Mock storage usage above threshold
      global.navigator.storage.estimate = jest.fn().mockResolvedValue({
        usage: 950,
        quota: 1000
      });

      const cleanupSpy = jest.spyOn(offlineService, 'cleanupOldData');
      await offlineService.checkStorageQuota();
      expect(cleanupSpy).toHaveBeenCalled();
    });

    it('should not trigger cleanup when storage usage is below threshold', async () => {
      // Mock storage usage below threshold
      global.navigator.storage.estimate = jest.fn().mockResolvedValue({
        usage: 500,
        quota: 1000
      });

      const cleanupSpy = jest.spyOn(offlineService, 'cleanupOldData');
      await offlineService.checkStorageQuota();
      expect(cleanupSpy).not.toHaveBeenCalled();
    });
  });

  describe('Data Cleanup', () => {
    beforeEach(() => {
      // Mock localStorage
      const mockLocalStorage = {
        data: {
          'item1': { timestamp: 1000 },
          'item2': { timestamp: 2000 },
          'item3': { timestamp: 3000 }
        },
        getItem: function(key) {
          return JSON.stringify(this.data[key]);
        },
        removeItem: jest.fn(),
        keys: function() {
          return Object.keys(this.data);
        }
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage
      });
    });

    it('should remove oldest items when cleaning up data', async () => {
      await offlineService.cleanupOldData();
      expect(localStorage.removeItem).toHaveBeenCalledWith('item1');
    });
  });
}); 