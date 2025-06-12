export class DeleteConfirmation {
  constructor(options = {}) {
    this.options = {
      onConfirm: () => {},
      onCancel: () => {},
      cardText: '',
      ...options
    };
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const modal = document.createElement('div');
    modal.className = 'modal delete-confirmation';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'deleteModalTitle');
    modal.setAttribute('aria-modal', 'true');

    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h2 id="deleteModalTitle" class="modal-title">Confirm Delete</h2>
          <button type="button" class="modal-close" aria-label="Close dialog">×</button>
        </div>
        <div class="modal-content">
          <p class="delete-message">
            Are you sure you want to delete the following card?
          </p>
          <blockquote class="card-preview">
            ${this.options.cardText}
          </blockquote>
          <p class="delete-warning">
            This action cannot be undone.
          </p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" data-action="cancel">
            Cancel
          </button>
          <button type="button" class="btn btn-danger" data-action="confirm">
            Delete Card
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.element = modal;

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Focus the cancel button by default for safety
    setTimeout(() => {
      this.element.querySelector('[data-action="cancel"]').focus();
    }, 0);
  }

  attachEventListeners() {
    if (!this.element) return;

    // Close button handler
    const closeButton = this.element.querySelector('.modal-close');
    closeButton.addEventListener('click', () => this.handleCancel());

    // Action button handlers
    const cancelButton = this.element.querySelector('[data-action="cancel"]');
    const confirmButton = this.element.querySelector('[data-action="confirm"]');

    cancelButton.addEventListener('click', () => this.handleCancel());
    confirmButton.addEventListener('click', () => this.handleConfirm());

    // Overlay click handler
    const overlay = this.element.querySelector('.modal-overlay');
    overlay.addEventListener('click', () => this.handleCancel());

    // Keyboard handlers
    document.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Trap focus within modal
    this.element.addEventListener('keydown', this.handleTabKey.bind(this));
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      this.handleCancel();
    }
  }

  handleTabKey(event) {
    if (event.key !== 'Tab') return;

    const focusableElements = this.element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  handleConfirm() {
    this.options.onConfirm();
    this.cleanup();
  }

  handleCancel() {
    this.options.onCancel();
    this.cleanup();
  }

  cleanup() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.body.style.overflow = '';
    if (this.element) {
      this.element.remove();
    }
  }
} 