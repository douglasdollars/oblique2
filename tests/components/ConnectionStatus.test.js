import { ConnectionStatus } from '../../src/components/ConnectionStatus.js';
import { jest } from '@jest/globals';

describe('ConnectionStatus', () => {
  let connectionStatus;
  let container;

  beforeEach(() => {
    // Create container element
    container = document.createElement('div');
    document.body.appendChild(container);

    // Mock navigator.onLine
    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      writable: true
    });

    // Initialize component
    connectionStatus = new ConnectionStatus({
      container,
      showDuration: 100 // Short duration for testing
    });
  });

  afterEach(() => {
    connectionStatus.destroy();
    container.remove();
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should create status element', () => {
      expect(container.querySelector('.connection-status')).toBeTruthy();
    });

    it('should set initial status based on navigator.onLine', () => {
      const element = container.querySelector('.connection-status');
      expect(element.textContent).toBe('Online');
      expect(element.style.backgroundColor).toBe('rgb(76, 175, 80)'); // #4CAF50
    });

    it('should position element correctly', () => {
      connectionStatus = new ConnectionStatus({
        container,
        position: 'bottom-right'
      });

      const element = container.querySelector('.connection-status');
      expect(element.style.bottom).toBe('16px');
      expect(element.style.right).toBe('16px');
    });
  });

  describe('Status Updates', () => {
    it('should update status when going offline', () => {
      window.dispatchEvent(new Event('offline'));
      const element = container.querySelector('.connection-status');
      
      expect(element.textContent).toBe('Offline');
      expect(element.style.backgroundColor).toBe('rgb(244, 67, 54)'); // #f44336
      expect(element.style.opacity).toBe('1');
    });

    it('should update status when going online', () => {
      // First go offline
      window.dispatchEvent(new Event('offline'));
      // Then go online
      window.dispatchEvent(new Event('online'));
      
      const element = container.querySelector('.connection-status');
      expect(element.textContent).toBe('Online');
      expect(element.style.backgroundColor).toBe('rgb(76, 175, 80)'); // #4CAF50
      expect(element.style.opacity).toBe('1');
    });

    it('should hide status after duration', done => {
      window.dispatchEvent(new Event('online'));
      const element = container.querySelector('.connection-status');
      
      setTimeout(() => {
        expect(element.style.opacity).toBe('0');
        done();
      }, 150); // Wait longer than showDuration
    });
  });

  describe('Manual Control', () => {
    it('should show status manually', () => {
      const element = container.querySelector('.connection-status');
      connectionStatus.show();
      expect(element.style.opacity).toBe('1');
    });

    it('should hide status manually', () => {
      const element = container.querySelector('.connection-status');
      connectionStatus.hide();
      expect(element.style.opacity).toBe('0');
    });
  });

  describe('Cleanup', () => {
    it('should remove event listeners and element on destroy', () => {
      const element = container.querySelector('.connection-status');
      connectionStatus.destroy();
      expect(container.contains(element)).toBe(false);
    });

    it('should clear timeout on destroy', () => {
      jest.spyOn(window, 'clearTimeout');
      connectionStatus.destroy();
      expect(clearTimeout).toHaveBeenCalled();
    });
  });
}); 