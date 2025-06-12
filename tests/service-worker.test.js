import { jest } from '@jest/globals';

describe('Service Worker', () => {
  let sw;
  let mockCaches;
  let mockClients;

  beforeEach(() => {
    // Mock service worker environment
    mockCaches = {
      open: jest.fn().mockResolvedValue({
        addAll: jest.fn().mockResolvedValue(undefined),
        put: jest.fn().mockResolvedValue(undefined)
      }),
      keys: jest.fn().mockResolvedValue(['old-cache']),
      delete: jest.fn().mockResolvedValue(undefined),
      match: jest.fn()
    };

    mockClients = {
      claim: jest.fn().mockResolvedValue(undefined)
    };

    global.caches = mockCaches;
    global.self = {
      addEventListener: jest.fn(),
      skipWaiting: jest.fn().mockResolvedValue(undefined),
      clients: mockClients
    };

    // Import service worker script
    jest.isolateModules(() => {
      require('../../src/service-worker.js');
    });
  });

  describe('Install Event', () => {
    it('should cache static assets on install', async () => {
      const installHandler = self.addEventListener.mock.calls.find(call => call[0] === 'install')[1];
      const event = {
        waitUntil: jest.fn()
      };

      installHandler(event);
      
      expect(event.waitUntil).toHaveBeenCalled();
      expect(mockCaches.open).toHaveBeenCalledWith('oblique-strategies-v1');
      
      const cache = await mockCaches.open();
      expect(cache.addAll).toHaveBeenCalledWith(expect.arrayContaining([
        '/',
        '/index.html',
        '/styles/main.css',
        '/scripts/main.js'
      ]));
    });
  });

  describe('Activate Event', () => {
    it('should clean up old caches on activate', async () => {
      const activateHandler = self.addEventListener.mock.calls.find(call => call[0] === 'activate')[1];
      const event = {
        waitUntil: jest.fn()
      };

      activateHandler(event);
      
      expect(event.waitUntil).toHaveBeenCalled();
      expect(mockCaches.keys).toHaveBeenCalled();
      expect(mockCaches.delete).toHaveBeenCalledWith('old-cache');
    });
  });

  describe('Fetch Event', () => {
    it('should return cached response if available', async () => {
      const fetchHandler = self.addEventListener.mock.calls.find(call => call[0] === 'fetch')[1];
      const cachedResponse = new Response('cached data');
      mockCaches.match.mockResolvedValue(cachedResponse);

      const event = {
        respondWith: jest.fn(),
        request: new Request('/')
      };

      fetchHandler(event);
      
      expect(event.respondWith).toHaveBeenCalled();
      expect(mockCaches.match).toHaveBeenCalledWith(event.request);
    });

    it('should fetch from network and cache if no cached response', async () => {
      const fetchHandler = self.addEventListener.mock.calls.find(call => call[0] === 'fetch')[1];
      mockCaches.match.mockResolvedValue(undefined);

      global.fetch = jest.fn().mockResolvedValue(new Response('network data', {
        status: 200,
        type: 'basic'
      }));

      const event = {
        respondWith: jest.fn(),
        request: new Request('/')
      };

      fetchHandler(event);
      
      expect(event.respondWith).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('Sync Event', () => {
    it('should handle sync event for cards', async () => {
      const syncHandler = self.addEventListener.mock.calls.find(call => call[0] === 'sync')[1];
      const event = {
        tag: 'sync-cards',
        waitUntil: jest.fn()
      };

      syncHandler(event);
      
      expect(event.waitUntil).toHaveBeenCalled();
    });
  });
}); 