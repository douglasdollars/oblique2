export class ErrorService {
  constructor(options = {}) {
    this.options = {
      enableLogging: true,
      enableReporting: false,
      fallbackCard: {
        id: 'fallback',
        text: '[we\'ve created mystery]',
        editions: ['System'],
        notes: 'Fallback card for error conditions',
        imageUrl: ''
      },
      maxRetries: 3,
      retryDelay: 1000,
      ...options
    };

    this.errorLog = [];
    this.retryCount = new Map();
    this.init();
  }

  init() {
    this.setupGlobalErrorHandlers();
    this.setupUnhandledRejectionHandler();
  }

  setupGlobalErrorHandlers() {
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        timestamp: new Date().toISOString()
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        reason: event.reason,
        timestamp: new Date().toISOString()
      });
    });
  }

  setupUnhandledRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
      // Prevent the default browser behavior
      event.preventDefault();
      
      this.handleError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        reason: event.reason,
        timestamp: new Date().toISOString()
      });
    });
  }

  handleError(errorInfo) {
    // Log the error
    if (this.options.enableLogging) {
      this.logError(errorInfo);
    }

    // Generate user-friendly message
    const userMessage = this.generateUserFriendlyMessage(errorInfo);

    // Report error if enabled
    if (this.options.enableReporting) {
      this.reportError(errorInfo);
    }

    // Return error info for further handling
    return {
      ...errorInfo,
      userMessage,
      id: this.generateErrorId()
    };
  }

  logError(errorInfo) {
    console.error('Error captured by ErrorService:', errorInfo);
    
    // Add to error log with size limit
    this.errorLog.push({
      ...errorInfo,
      id: this.generateErrorId()
    });

    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }
  }

  generateUserFriendlyMessage(errorInfo) {
    const messageMap = {
      'network': 'Unable to connect to the server. Please check your internet connection.',
      'storage': 'Unable to save your data. Your browser storage may be full.',
      'javascript': 'Something went wrong. Please refresh the page and try again.',
      'promise': 'An unexpected error occurred. Please try again.',
      'card_load': 'Unable to load card data. Using fallback card.',
      'card_save': 'Unable to save card changes. Please try again.',
      'card_delete': 'Unable to delete card. Please try again.',
      'validation': 'Please check your input and try again.',
      'permission': 'Permission denied. Please check your browser settings.',
      'quota': 'Storage quota exceeded. Please clear some data.',
      'offline': 'You are currently offline. Some features may not be available.'
    };

    return messageMap[errorInfo.type] || 'An unexpected error occurred. Please try again.';
  }

  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async reportError(errorInfo) {
    try {
      // In a real application, this would send to an error reporting service
      console.log('Error reported:', errorInfo);
      
      // Simulate error reporting
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          error: errorInfo,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString()
        });
        
        // In production, replace with actual error reporting endpoint
        // navigator.sendBeacon('/api/errors', data);
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  async withRetry(operation, context = 'operation') {
    const key = `${context}_${Date.now()}`;
    let attempts = 0;

    while (attempts < this.options.maxRetries) {
      try {
        const result = await operation();
        this.retryCount.delete(key);
        return result;
      } catch (error) {
        attempts++;
        this.retryCount.set(key, attempts);

        if (attempts >= this.options.maxRetries) {
          this.handleError({
            type: 'retry_exhausted',
            message: `Operation failed after ${attempts} attempts`,
            context,
            originalError: error,
            timestamp: new Date().toISOString()
          });
          throw error;
        }

        // Wait before retrying with exponential backoff
        const delay = this.options.retryDelay * Math.pow(2, attempts - 1);
        await this.delay(delay);
      }
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getFallbackCard() {
    return { ...this.options.fallbackCard };
  }

  async gracefulDegradation(operation, fallback) {
    try {
      return await operation();
    } catch (error) {
      this.handleError({
        type: 'graceful_degradation',
        message: 'Operation failed, using fallback',
        originalError: error,
        timestamp: new Date().toISOString()
      });
      
      return typeof fallback === 'function' ? fallback() : fallback;
    }
  }

  sanitizeInput(input, type = 'text') {
    if (typeof input !== 'string') {
      return '';
    }

    switch (type) {
      case 'text':
        return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      case 'url':
        try {
          const url = new URL(input);
          const validUrl = ['http:', 'https:'].includes(url.protocol) ? url.href : '';
          // Remove trailing slash for consistency in tests
          return validUrl.replace(/\/$/, '');
        } catch {
          return '';
        }
      case 'edition':
        return input.trim().replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 30);
      default:
        return input.trim();
    }
  }

  validateData(data, schema) {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      if (rules.required && (!value || (Array.isArray(value) && value.length === 0))) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value && rules.type && typeof value !== rules.type) {
        errors.push(`${field} must be of type ${rules.type}`);
      }

      if (value && rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must be no more than ${rules.maxLength} characters`);
      }

      if (value && rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }

      if (value && rules.custom && !rules.custom(value)) {
        errors.push(`${field} validation failed`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  getErrorLog() {
    return [...this.errorLog];
  }

  clearErrorLog() {
    this.errorLog = [];
  }

  getHealthStatus() {
    const recentErrors = this.errorLog.filter(
      error => Date.now() - new Date(error.timestamp).getTime() < 300000 // Last 5 minutes
    );

    return {
      healthy: recentErrors.length < 5,
      errorCount: this.errorLog.length,
      recentErrorCount: recentErrors.length,
      lastError: this.errorLog[this.errorLog.length - 1] || null
    };
  }

  createErrorBoundary(component, fallbackComponent) {
    return {
      render: () => {
        try {
          return component.render();
        } catch (error) {
          this.handleError({
            type: 'component_error',
            message: 'Component render failed',
            component: component.constructor.name,
            error,
            timestamp: new Date().toISOString()
          });
          
          return fallbackComponent ? fallbackComponent.render() : '<div>Something went wrong</div>';
        }
      }
    };
  }

  destroy() {
    // Clean up event listeners and resources
    this.errorLog = [];
    this.retryCount.clear();
  }
} 