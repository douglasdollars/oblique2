const CardStack = require('./CardStack');
const Card = require('./Card');
const CardService = require('../services/CardService');

class CardDisplay {
  constructor(container) {
    this.container = container;
    this.cardService = new CardService();
    this.cardStack = new CardStack(container);
    this.currentCard = null;
    this.isLoading = false;
  }

  async init() {
    this.cardStack.init();
    await this.loadInitialCard();
  }

  async loadInitialCard() {
    try {
      this.setLoading(true);
      const card = await this.cardService.getRandomCard();
      this.displayCard(card);
    } catch (error) {
      console.error('Error loading initial card:', error);
      this.displayCard(this.cardService.fallbackCard);
    } finally {
      this.setLoading(false);
    }
  }

  async loadNewCard() {
    if (this.isLoading) return;

    try {
      this.setLoading(true);
      const card = await this.cardService.getRandomCard();
      this.displayCard(card);
    } catch (error) {
      console.error('Error loading new card:', error);
      this.displayCard(this.cardService.fallbackCard);
    } finally {
      this.setLoading(false);
    }
  }

  displayCard(cardData) {
    const card = new Card(cardData);
    this.cardStack.addCard(card);
    this.currentCard = card;
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
    this.container.classList.toggle('is-loading', isLoading);
  }

  cleanup() {
    if (this.cardStack) {
      this.cardStack.cleanup();
    }
  }
}

module.exports = CardDisplay; 