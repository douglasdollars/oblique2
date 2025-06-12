import { PWAService } from '../../src/services/PWAService.js';
import { jest } from '@jest/globals';

describe('PWAService', () => {
  let pwaService;
  let mockRegistration;

  beforeEach(() => {
    // Mock service worker registration
    mockRegistration = {
      installing: {
        state: 'installed',
        addEventListener: jest.fn()
      },
      addEventListener: jest.fn(),
      unregister: jest.fn().mockResolvedValue(undefined)
    };

    global.navigator.serviceWorker = {
      register: jest.fn().mockResolvedValue(mockRegistration),
      getRegistration: jest.fn().mockResolvedValue(mockRegistration),
      controller: {}
    };

    // Mock caches API
    global.caches = {
      keys: jest.fn().mockResolvedValue(['cache1', 'cache2']),
      delete: jest.fn().mockResolvedValue(undefined)
    };

    pwaService = new PWAService();
  });

  describe('Service Worker Registration', () => {
    it('should register service worker on initialization', async () => {
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/service-worker.js');
    });

    it('should handle registration errors gracefully', async () => {
      const error = new Error('Registration failed');
      global.navigator.serviceWorker.register = jest.fn().mockRejectedValue(error);
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      pwaService = new PWAService();
      
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(consoleSpy).toHaveBeenCalledWith('Service Worker registration failed:', error);
    });

    it('should listen for service worker updates', async () => {
      expect(mockRegistration.addEventListener).toHaveBeenCalledWith('updatefound', expect.any(Function));
    });
  });

  describe('Service Worker Unregistration', () => {
    it('should unregister service worker', async () => {
      await pwaService.unregister();
      expect(navigator.serviceWorker.getRegistration).toHaveBeenCalled();
      expect(mockRegistration.unregister).toHaveBeenCalled();
    });

    it('should handle unregistration errors gracefully', async () => {
      const error = new Error('Unregistration failed');
      mockRegistration.unregister = jest.fn().mockRejectedValue(error);
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      await pwaService.unregister();
      
      expect(consoleSpy).toHaveBeenCalledWith('Service Worker unregistration failed:', error);
    });
  });

  describe('Cache Management', () => {
    it('should clear all caches', async () => {
      await pwaService.clearCache();
      expect(caches.keys).toHaveBeenCalled();
      expect(caches.delete).toHaveBeenCalledTimes(2);
    });

    it('should handle cache clearing errors gracefully', async () => {
      const error = new Error('Cache clearing failed');
      global.caches.delete = jest.fn().mockRejectedValue(error);
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      await pwaService.clearCache();
      
      expect(consoleSpy).toHaveBeenCalledWith('Cache clearing failed:', error);
    });
  });
}); 