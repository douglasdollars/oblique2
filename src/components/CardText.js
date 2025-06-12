export class CardText {
  constructor(text = '', options = {}) {
    this.text = text;
    this.options = {
      maxLines: 3,
      minFontSize: 1,
      maxFontSize: 2,
      lineHeight: 1.4,
      ...options
    };
    this.init();
  }

  init() {
    this.render();
    this.adjustTextSize();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'card-text-container';
    container.setAttribute('role', 'text');
    container.setAttribute('aria-label', 'Card text content');

    const textElement = document.createElement('p');
    textElement.className = 'card-text';
    textElement.textContent = this.text;

    container.appendChild(textElement);
    this.element = container;
    this.textElement = textElement;
  }

  adjustTextSize() {
    const container = this.element;
    const text = this.textElement;
    const maxHeight = container.clientHeight;
    const maxWidth = container.clientWidth;
    
    let fontSize = this.options.maxFontSize;
    text.style.fontSize = `${fontSize}rem`;
    
    while (
      (text.scrollHeight > maxHeight || text.scrollWidth > maxWidth) &&
      fontSize > this.options.minFontSize
    ) {
      fontSize -= 0.1;
      text.style.fontSize = `${fontSize}rem`;
    }
  }

  update(text) {
    this.text = text;
    this.textElement.textContent = text;
    this.adjustTextSize();
  }

  cleanup() {
    if (this.element) {
      this.element.remove();
    }
  }
} 