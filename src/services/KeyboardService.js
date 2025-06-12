export class KeyboardService {
  constructor(options = {}) {
    this.options = {
      onSpacePress: () => {},
      onTableKeyPress: () => {},
      ...options
    };
    this.isEnabled = true;
    this.boundHandleKeyPress = this.handleKeyPress.bind(this);
    this.init();
  }

  init() {
    document.addEventListener('keydown', this.boundHandleKeyPress);
  }

  handleKeyPress(event) {
    if (!this.isEnabled) return;

    // Check if the event target is an input or textarea
    const isInput = event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA';
    if (isInput) return;

    // Handle spacebar for card flipping
    if (event.code === 'Space' && !this.isFormElement(event.target)) {
      event.preventDefault();
      this.options.onSpacePress();
      return;
    }

    // Table keyboard shortcuts
    if (this.isTableFocused()) {
      this.handleTableShortcuts(event);
    }
  }

  handleTableShortcuts(event) {
    const shortcuts = {
      // Selection shortcuts
      'KeyA': (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.options.onTableKeyPress('selectAll');
        }
      },
      'Escape': () => {
        this.options.onTableKeyPress('clearSelection');
      },
      // Delete shortcuts
      'Delete': (e) => {
        if (e.shiftKey) {
          e.preventDefault();
          this.options.onTableKeyPress('bulkDelete');
        } else {
          this.options.onTableKeyPress('delete');
        }
      },
      // Navigation shortcuts
      'ArrowUp': (e) => {
        if (e.shiftKey) {
          e.preventDefault();
          this.options.onTableKeyPress('selectPrevious');
        }
      },
      'ArrowDown': (e) => {
        if (e.shiftKey) {
          e.preventDefault();
          this.options.onTableKeyPress('selectNext');
        }
      },
      // Edit shortcuts
      'Enter': () => {
        this.options.onTableKeyPress('edit');
      },
      // Export shortcut
      'KeyE': (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.options.onTableKeyPress('export');
        }
      }
    };

    const handler = shortcuts[event.code];
    if (handler) {
      handler(event);
    }
  }

  isTableFocused() {
    const activeElement = document.activeElement;
    return (
      activeElement &&
      (activeElement.closest('.table-container') ||
        activeElement.matches('.table-container *'))
    );
  }

  isFormElement(element) {
    return (
      element.tagName === 'INPUT' ||
      element.tagName === 'TEXTAREA' ||
      element.tagName === 'SELECT' ||
      element.isContentEditable
    );
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  cleanup() {
    document.removeEventListener('keydown', this.boundHandleKeyPress);
  }
} 