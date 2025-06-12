export class KeyboardService {
  constructor(options = {}) {
    this.options = {
      onSpacebar: () => {},
      onEscape: () => {},
      ...options
    };
    this.isEnabled = true;
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
  }

  init() {
    document.addEventListener('keydown', this.boundHandleKeyDown);
  }

  handleKeyDown(event) {
    if (!this.isEnabled) return;

    // Check if the event target is an input or textarea
    const isInput = event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA';
    if (isInput) return;

    switch (event.code) {
      case 'Space':
        event.preventDefault();
        this.options.onSpacebar();
        break;
      case 'Escape':
        event.preventDefault();
        this.options.onEscape();
        break;
    }
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  cleanup() {
    document.removeEventListener('keydown', this.boundHandleKeyDown);
  }
} 