export class AnotherButton {
  constructor(options = {}) {
    this.options = {
      onClick: () => {},
      disabled: false,
      ...options
    };
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const button = document.createElement('button');
    button.className = 'another-button';
    button.textContent = 'Another';
    button.setAttribute('type', 'button');
    button.setAttribute('aria-label', 'Get another Oblique Strategy card');
    
    if (this.options.disabled) {
      button.setAttribute('disabled', '');
    }

    // Replace existing button if it exists
    const existingButton = document.querySelector('.another-button');
    if (existingButton) {
      existingButton.replaceWith(button);
    } else {
      document.querySelector('main').appendChild(button);
    }

    this.element = button;
  }

  attachEventListeners() {
    this.element.addEventListener('click', this.handleClick.bind(this));
    this.element.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleClick(event) {
    if (this.options.disabled) return;
    this.options.onClick(event);
  }

  handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleClick(event);
    }
  }

  setDisabled(disabled) {
    this.options.disabled = disabled;
    if (disabled) {
      this.element.setAttribute('disabled', '');
    } else {
      this.element.removeAttribute('disabled');
    }
  }

  cleanup() {
    if (this.element) {
      this.element.remove();
    }
  }
} 