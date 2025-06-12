export class ConnectionStatus {
  constructor(options = {}) {
    this.options = {
      container: document.body,
      position: 'top-right',
      showDuration: 3000, // How long to show the status change
      ...options
    };

    this.element = null;
    this.hideTimeout = null;
    this.init();
  }

  init() {
    this.createStatusElement();
    this.attachEventListeners();
    this.updateStatus(navigator.onLine);
  }

  createStatusElement() {
    this.element = document.createElement('div');
    this.element.className = 'connection-status';
    this.element.style.cssText = `
      position: fixed;
      z-index: 9999;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
      opacity: 0;
      pointer-events: none;
    `;

    // Position the element based on options
    switch (this.options.position) {
      case 'top-right':
        this.element.style.top = '16px';
        this.element.style.right = '16px';
        break;
      case 'top-left':
        this.element.style.top = '16px';
        this.element.style.left = '16px';
        break;
      case 'bottom-right':
        this.element.style.bottom = '16px';
        this.element.style.right = '16px';
        break;
      case 'bottom-left':
        this.element.style.bottom = '16px';
        this.element.style.left = '16px';
        break;
    }

    this.options.container.appendChild(this.element);
  }

  attachEventListeners() {
    window.addEventListener('online', () => this.updateStatus(true));
    window.addEventListener('offline', () => this.updateStatus(false));
  }

  updateStatus(isOnline) {
    // Clear any existing timeout
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    // Update styles based on status
    if (isOnline) {
      this.element.style.backgroundColor = '#4CAF50';
      this.element.style.color = '#fff';
      this.element.textContent = 'Online';
    } else {
      this.element.style.backgroundColor = '#f44336';
      this.element.style.color = '#fff';
      this.element.textContent = 'Offline';
    }

    // Show the status
    this.element.style.opacity = '1';
    this.element.style.transform = 'translateY(0)';

    // Hide after duration
    this.hideTimeout = setTimeout(() => {
      this.element.style.opacity = '0';
      this.element.style.transform = 'translateY(-10px)';
    }, this.options.showDuration);
  }

  show() {
    this.element.style.opacity = '1';
    this.element.style.transform = 'translateY(0)';
  }

  hide() {
    this.element.style.opacity = '0';
    this.element.style.transform = 'translateY(-10px)';
  }

  destroy() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    window.removeEventListener('online', () => this.updateStatus(true));
    window.removeEventListener('offline', () => this.updateStatus(false));
    this.element.remove();
  }
} 