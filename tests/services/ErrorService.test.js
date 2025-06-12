import { JSDOM } from 'jsdom';
import { ErrorService } from '../../src/services/ErrorService.js';
import { jest } from '@jest/globals';

describe('ErrorService', () => {
  let dom;
  let errorService;
  let consoleErrorSpy;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { 
      url: 'http://localhost/' 
    });

    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;

    // Mock console.error to avoid noise in tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock navigator.sendBeacon
    Object.defineProperty(dom.window.navigator, 'sendBeacon', {
      value: jest.fn(() => true),
      writable: true
    });
  });

  afterEach(() => {
    if (errorService) {
      errorService.destroy();
    }
    consoleErrorSpy.mockRestore();
    dom.window.close();
  });

  it('should initialize with default options', () => {
    errorService = new ErrorService();
    
    expect(errorService.options.enableLogging).toBe(true);
    expect(errorService.options.enableReporting).toBe(false);
    expect(errorService.options.maxRetries).toBe(3);
    expect(errorService.options.retryDelay).toBe(1000);
    expect(errorService.options.fallbackCard).toBeDefined();
    expect(errorService.options.fallbackCard.text).toBe('[we\'ve created mystery]');
  });

  it('should handle custom options', () => {
    const customOptions = {
      enableLogging: false,
      enableReporting: true,
      maxRetries: 5,
      retryDelay: 2000
    };

    errorService = new ErrorService(customOptions);
    
    expect(errorService.options.enableLogging).toBe(false);
    expect(errorService.options.enableReporting).toBe(true);
    expect(errorService.options.maxRetries).toBe(5);
    expect(errorService.options.retryDelay).toBe(2000);
  });

  it('should set up global error handlers', () => {
    const addEventListenerSpy = jest.spyOn(dom.window, 'addEventListener');
    
    errorService = new ErrorService();
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
  });

  it('should handle JavaScript errors', () => {
    errorService = new ErrorService();
    const handleErrorSpy = jest.spyOn(errorService, 'handleError');
    
    const errorEvent = new dom.window.ErrorEvent('error', {
      message: 'Test error',
      filename: 'test.js',
      lineno: 10,
      colno: 5,
      error: new Error('Test error')
    });
    
    dom.window.dispatchEvent(errorEvent);
    
    expect(handleErrorSpy).toHaveBeenCalledWith(expect.objectContaining({
      type: 'javascript',
      message: 'Test error',
      filename: 'test.js',
      lineno: 10,
      colno: 5
    }));
  });

  it('should handle unhandled promise rejections', () => {
    errorService = new ErrorService();
    const handleErrorSpy = jest.spyOn(errorService, 'handleError');
    
    const rejectionEvent = new dom.window.Event('unhandledrejection');
    rejectionEvent.reason = new Error('Promise rejection');
    
    dom.window.dispatchEvent(rejectionEvent);
    
    expect(handleErrorSpy).toHaveBeenCalledWith(expect.objectContaining({
      type: 'promise',
      message: 'Promise rejection'
    }));
  });

  it('should log errors when logging is enabled', () => {
    errorService = new ErrorService({ enableLogging: true });
    
    const errorInfo = {
      type: 'test',
      message: 'Test error',
      timestamp: new Date().toISOString()
    };
    
    errorService.handleError(errorInfo);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error captured by ErrorService:', errorInfo);
    expect(errorService.errorLog.length).toBe(1);
  });

  it('should not log errors when logging is disabled', () => {
    errorService = new ErrorService({ enableLogging: false });
    
    const errorInfo = {
      type: 'test',
      message: 'Test error',
      timestamp: new Date().toISOString()
    };
    
    errorService.handleError(errorInfo);
    
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(errorService.errorLog.length).toBe(0);
  });

  it('should generate user-friendly messages', () => {
    errorService = new ErrorService();
    
    const testCases = [
      { type: 'network', expected: 'Unable to connect to the server. Please check your internet connection.' },
      { type: 'storage', expected: 'Unable to save your data. Your browser storage may be full.' },
      { type: 'javascript', expected: 'Something went wrong. Please refresh the page and try again.' },
      { type: 'unknown', expected: 'An unexpected error occurred. Please try again.' }
    ];
    
    testCases.forEach(({ type, expected }) => {
      const message = errorService.generateUserFriendlyMessage({ type });
      expect(message).toBe(expected);
    });
  });

  it('should maintain error log with size limit', () => {
    errorService = new ErrorService({ enableLogging: true });
    
    // Add 105 errors to test size limit
    for (let i = 0; i < 105; i++) {
      errorService.logError({
        type: 'test',
        message: `Error ${i}`,
        timestamp: new Date().toISOString()
      });
    }
    
    expect(errorService.errorLog.length).toBe(100);
    expect(errorService.errorLog[0].message).toBe('Error 5'); // First 5 should be removed
  });

  it('should retry operations with exponential backoff', async () => {
    errorService = new ErrorService({ maxRetries: 3, retryDelay: 10 });
    
    let attempts = 0;
    const operation = jest.fn(() => {
      attempts++;
      if (attempts < 3) {
        throw new Error('Operation failed');
      }
      return 'success';
    });
    
    const result = await errorService.withRetry(operation, 'test-operation');
    
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('should throw error after max retries exceeded', async () => {
    errorService = new ErrorService({ maxRetries: 2, retryDelay: 10 });
    
    const operation = jest.fn(() => {
      throw new Error('Always fails');
    });
    
    await expect(errorService.withRetry(operation, 'test-operation')).rejects.toThrow('Always fails');
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('should provide graceful degradation', async () => {
    errorService = new ErrorService();
    
    const failingOperation = () => {
      throw new Error('Operation failed');
    };
    
    const fallback = 'fallback result';
    
    const result = await errorService.gracefulDegradation(failingOperation, fallback);
    
    expect(result).toBe('fallback result');
  });

  it('should provide graceful degradation with function fallback', async () => {
    errorService = new ErrorService();
    
    const failingOperation = () => {
      throw new Error('Operation failed');
    };
    
    const fallbackFunction = () => 'dynamic fallback';
    
    const result = await errorService.gracefulDegradation(failingOperation, fallbackFunction);
    
    expect(result).toBe('dynamic fallback');
  });

  it('should sanitize input correctly', () => {
    errorService = new ErrorService();
    
    // Test text sanitization
    const maliciousText = '<script>alert("xss")</script>Hello World';
    const sanitizedText = errorService.sanitizeInput(maliciousText, 'text');
    expect(sanitizedText).toBe('Hello World');
    
    // Test URL sanitization
    const validUrl = 'https://example.com';
    const sanitizedUrl = errorService.sanitizeInput(validUrl, 'url');
    expect(sanitizedUrl).toBe('https://example.com');
    
    const invalidUrl = 'javascript:alert("xss")';
    const sanitizedInvalidUrl = errorService.sanitizeInput(invalidUrl, 'url');
    expect(sanitizedInvalidUrl).toBe('');
    
    // Test edition sanitization
    const editionText = 'Edition Name!@# 123';
    const sanitizedEdition = errorService.sanitizeInput(editionText, 'edition');
    expect(sanitizedEdition).toBe('Edition Name 123');
  });

  it('should validate data against schema', () => {
    errorService = new ErrorService();
    
    const schema = {
      text: { required: true, type: 'string', maxLength: 100 },
      editions: { required: true, type: 'object' },
      notes: { type: 'string' },
      imageUrl: { pattern: /^https?:\/\/.+/ }
    };
    
    // Valid data
    const validData = {
      text: 'Valid text',
      editions: ['Edition 1'],
      notes: 'Some notes',
      imageUrl: 'https://example.com/image.jpg'
    };
    
    const validResult = errorService.validateData(validData, schema);
    expect(validResult.isValid).toBe(true);
    expect(validResult.errors).toHaveLength(0);
    
    // Invalid data
    const invalidData = {
      text: '', // Required but empty
      editions: [], // Required but empty
      imageUrl: 'invalid-url' // Invalid pattern
    };
    
    const invalidResult = errorService.validateData(invalidData, schema);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors.length).toBeGreaterThan(0);
  });

  it('should return fallback card', () => {
    errorService = new ErrorService();
    
    const fallbackCard = errorService.getFallbackCard();
    
    expect(fallbackCard.id).toBe('fallback');
    expect(fallbackCard.text).toBe('[we\'ve created mystery]');
    expect(fallbackCard.editions).toEqual(['System']);
    expect(fallbackCard.notes).toBe('Fallback card for error conditions');
  });

  it('should provide health status', () => {
    errorService = new ErrorService({ enableLogging: true });
    
    // Add some errors
    errorService.logError({
      type: 'test',
      message: 'Error 1',
      timestamp: new Date().toISOString()
    });
    
    const healthStatus = errorService.getHealthStatus();
    
    expect(healthStatus.healthy).toBe(true); // Less than 5 recent errors
    expect(healthStatus.errorCount).toBe(1);
    expect(healthStatus.recentErrorCount).toBe(1);
    expect(healthStatus.lastError).toBeDefined();
  });

  it('should create error boundary', () => {
    errorService = new ErrorService();
    
    const workingComponent = {
      render: () => '<div>Working component</div>'
    };
    
    const failingComponent = {
      render: () => {
        throw new Error('Component failed');
      }
    };
    
    const fallbackComponent = {
      render: () => '<div>Fallback component</div>'
    };
    
    // Test working component
    const workingBoundary = errorService.createErrorBoundary(workingComponent, fallbackComponent);
    expect(workingBoundary.render()).toBe('<div>Working component</div>');
    
    // Test failing component
    const failingBoundary = errorService.createErrorBoundary(failingComponent, fallbackComponent);
    expect(failingBoundary.render()).toBe('<div>Fallback component</div>');
    
    // Test failing component without fallback
    const noFallbackBoundary = errorService.createErrorBoundary(failingComponent);
    expect(noFallbackBoundary.render()).toBe('<div>Something went wrong</div>');
  });

  it('should clear error log', () => {
    errorService = new ErrorService({ enableLogging: true });
    
    // Add some errors
    errorService.logError({
      type: 'test',
      message: 'Error 1',
      timestamp: new Date().toISOString()
    });
    
    expect(errorService.errorLog.length).toBe(1);
    
    errorService.clearErrorLog();
    
    expect(errorService.errorLog.length).toBe(0);
  });

  it('should get error log copy', () => {
    errorService = new ErrorService({ enableLogging: true });
    
    const errorInfo = {
      type: 'test',
      message: 'Error 1',
      timestamp: new Date().toISOString()
    };
    
    errorService.logError(errorInfo);
    
    const logCopy = errorService.getErrorLog();
    
    expect(logCopy.length).toBe(1);
    expect(logCopy[0].message).toBe('Error 1');
    
    // Verify it's a copy, not the original
    logCopy.push({ type: 'fake', message: 'Fake error' });
    expect(errorService.errorLog.length).toBe(1);
  });

  it('should clean up on destroy', () => {
    errorService = new ErrorService({ enableLogging: true });
    
    // Add some data
    errorService.logError({
      type: 'test',
      message: 'Error 1',
      timestamp: new Date().toISOString()
    });
    
    errorService.retryCount.set('test', 1);
    
    expect(errorService.errorLog.length).toBe(1);
    expect(errorService.retryCount.size).toBe(1);
    
    errorService.destroy();
    
    expect(errorService.errorLog.length).toBe(0);
    expect(errorService.retryCount.size).toBe(0);
  });

  it('should handle non-string input in sanitizeInput', () => {
    errorService = new ErrorService();
    
    expect(errorService.sanitizeInput(null)).toBe('');
    expect(errorService.sanitizeInput(undefined)).toBe('');
    expect(errorService.sanitizeInput(123)).toBe('');
    expect(errorService.sanitizeInput({})).toBe('');
  });

  it('should generate unique error IDs', () => {
    errorService = new ErrorService();
    
    const id1 = errorService.generateErrorId();
    const id2 = errorService.generateErrorId();
    
    expect(id1).toMatch(/^err_\d+_[a-z0-9]+$/);
    expect(id2).toMatch(/^err_\d+_[a-z0-9]+$/);
    expect(id1).not.toBe(id2);
  });
}); 