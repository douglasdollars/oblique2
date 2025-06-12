import { Card } from '../models/Card.js';
import { StorageService } from './StorageService.js';

/**
 * Service for managing card operations and business logic
 */
export class CardService {
  constructor() {
    this.storageService = new StorageService();
    this.fallbackCard = new Card({
      id: 'fallback',
      text: '[we\'ve created mystery]',
      editions: ['fallback']
    });
  }

  /**
   * Get all cards
   * @returns {Promise<Card[]>} Array of Card instances
   */
  async getAllCards() {
    return this.storageService.getCards();
  }

  /**
   * Get a random card
   * @returns {Promise<Card>} Random Card instance
   */
  async getRandomCard() {
    try {
      const cards = await this.getAllCards();
      if (!cards.length) return this.fallbackCard;

      const randomIndex = Math.floor(Math.random() * cards.length);
      return cards[randomIndex];
    } catch (error) {
      console.error('Error getting random card:', error);
      return this.fallbackCard;
    }
  }

  /**
   * Add a new card
   * @param {Object} cardData - Card data
   * @returns {Promise<Card|null>} New Card instance or null if failed
   */
  async addCard(cardData) {
    try {
      const card = new Card({
        ...cardData,
        id: this.generateId()
      });

      if (!card.validate()) {
        throw new Error('Invalid card data');
      }

      const success = await this.storageService.addCard(card);
      return success ? card : null;
    } catch (error) {
      console.error('Error adding card:', error);
      return null;
    }
  }

  /**
   * Update an existing card
   * @param {string} id - Card ID to update
   * @param {Object} cardData - Updated card data
   * @returns {Promise<Card|null>} Updated Card instance or null if failed
   */
  async updateCard(id, cardData) {
    try {
      const cards = await this.getAllCards();
      const existingCard = cards.find(card => card.id === id);
      if (!existingCard) return null;

      const updatedCard = new Card({
        ...existingCard.toJSON(),
        ...cardData,
        id // Preserve original ID
      });

      if (!updatedCard.validate()) {
        throw new Error('Invalid card data');
      }

      const success = await this.storageService.updateCard(id, updatedCard);
      return success ? updatedCard : null;
    } catch (error) {
      console.error('Error updating card:', error);
      return null;
    }
  }

  /**
   * Delete a card
   * @param {string} id - Card ID to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteCard(id) {
    try {
      return await this.storageService.deleteCard(id);
    } catch (error) {
      console.error('Error deleting card:', error);
      return false;
    }
  }

  /**
   * Generate a unique ID for new cards
   * @returns {string} Unique ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Initialize storage with sample cards if empty
   * @returns {Promise<boolean>} Success status
   */
  async initializeStorage() {
    try {
      const cards = await this.getAllCards();
      if (cards.length > 0) return true;

      const sampleCards = [
        {
          text: 'Abandon normal instruments',
          editions: ['First Edition']
        },
        {
          text: 'Accept advice',
          editions: ['First Edition']
        },
        {
          text: 'Accretion',
          editions: ['First Edition']
        },
        {
          text: 'A line has two sides',
          editions: ['First Edition']
        },
        {
          text: 'Allow an easement (an easement is the abandonment of a stricture)',
          editions: ['First Edition']
        },
        {
          text: 'Are there sections? Consider transitions',
          editions: ['First Edition']
        },
        {
          text: 'Ask people to work against their better judgement',
          editions: ['First Edition']
        },
        {
          text: 'Ask your body',
          editions: ['First Edition']
        },
        {
          text: 'Assemble some of the instruments in a group and treat the group',
          editions: ['First Edition']
        },
        {
          text: 'Balance the consistency principle with the inconsistency principle',
          editions: ['First Edition']
        }
      ];

      for (const cardData of sampleCards) {
        await this.addCard(cardData);
      }

      return true;
    } catch (error) {
      console.error('Error initializing storage:', error);
      return false;
    }
  }
} 