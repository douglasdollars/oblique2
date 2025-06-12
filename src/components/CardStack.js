import { Card } from './Card';

export class CardStack {
  constructor(cards = [], options = {}) {
    this.cards = cards;
    this.options = {
      maxVisibleCards: 3,
      stackOffset: 2,
      ...options
    };
    this.visibleCards = [];
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'card-stack';
    container.setAttribute('role', 'group');
    container.setAttribute('aria-label', 'Stack of Oblique Strategy cards');

    // Create visible card layers
    for (let i = 0; i < this.options.maxVisibleCards; i++) {
      const cardWrapper = document.createElement('div');
      cardWrapper.className = 'card-wrapper';
      cardWrapper.style.zIndex = this.options.maxVisibleCards - i;
      cardWrapper.style.transform = `translateY(${i * this.options.stackOffset}px)`;
      container.appendChild(cardWrapper);
    }

    // Replace existing stack if it exists
    const existingStack = document.querySelector('.card-stack');
    if (existingStack) {
      existingStack.replaceWith(container);
    } else {
      document.querySelector('main').appendChild(container);
    }

    this.element = container;
    this.updateVisibleCards();
  }

  updateVisibleCards() {
    const wrappers = this.element.querySelectorAll('.card-wrapper');
    this.visibleCards = [];

    // Clear existing cards
    wrappers.forEach(wrapper => {
      wrapper.innerHTML = '';
    });

    // Add new cards
    this.cards.slice(0, this.options.maxVisibleCards).forEach((cardData, index) => {
      const card = new Card(cardData);
      const wrapper = wrappers[index];
      wrapper.appendChild(card.element);
      this.visibleCards.push(card);
    });
  }

  attachEventListeners() {
    if (this.element) {
      // Add click handler for the top card
      this.element.addEventListener('click', (event) => {
        const topCard = this.visibleCards[0];
        if (topCard && event.target.closest('.card') === topCard.element) {
          this.handleTopCardClick();
        }
      });
    }
  }

  handleTopCardClick() {
    // This will be enhanced in Step 3.3
    const topCard = this.visibleCards[0];
    if (topCard) {
      topCard.flip();
    }
  }

  addCard(cardData) {
    this.cards.unshift(cardData);
    this.updateVisibleCards();
  }

  removeTopCard() {
    if (this.cards.length > 0) {
      const removedCard = this.visibleCards[0];
      if (removedCard) {
        removedCard.cleanup();
      }
      this.cards.shift();
      this.updateVisibleCards();
    }
  }

  getTopCard() {
    return this.visibleCards[0];
  }

  cleanup() {
    this.visibleCards.forEach(card => card.cleanup());
    if (this.element) {
      this.element.remove();
    }
  }
} 