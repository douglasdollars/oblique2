import { Card } from '../models/Card.js';
import { StorageService } from './StorageService.js';

/**
 * Service for managing card operations and business logic
 */
export class CardService {
  constructor() {
    this.storageService = new StorageService();
    this.fallbackCard = {
      id: 'fallback',
      text: '[we\'ve created mystery]',
      editions: ['fallback'],
      notes: 'This card appears when there is an error or no cards are available.',
      imageUrl: null
    };
  }

  /**
   * Get all cards from storage
   * @returns {Promise<Array>} Array of card objects
   */
  async getCards() {
    try {
      const cards = await this.storageService.getCards();
      return cards || [];
    } catch (error) {
      console.error('Error getting cards:', error);
      return [];
    }
  }

  /**
   * Get a random card from the available cards
   * @returns {Promise<Object>} Random card object or fallback card
   */
  async getRandomCard() {
    try {
      const cards = await this.getCards();
      
      if (!cards || cards.length === 0) {
        return this.fallbackCard;
      }

      const randomIndex = Math.floor(Math.random() * cards.length);
      return cards[randomIndex];
    } catch (error) {
      console.error('Error getting random card:', error);
      return this.fallbackCard;
    }
  }

  /**
   * Add a new card to storage
   * @param {Object} card Card object to add
   * @returns {Promise<Object>} Added card object
   */
  async addCard(card) {
    try {
      if (!this.validateCard(card)) {
        throw new Error('Invalid card data');
      }

      const cards = await this.getCards();
      const newCard = {
        ...card,
        id: Date.now().toString() // Simple ID generation
      };

      cards.push(newCard);
      await this.storageService.saveCards(cards);
      return newCard;
    } catch (error) {
      console.error('Error adding card:', error);
      throw error;
    }
  }

  /**
   * Update an existing card
   * @param {string} id Card ID to update
   * @param {Object} updates Updated card data
   * @returns {Promise<Object>} Updated card object
   */
  async updateCard(id, updates) {
    try {
      if (!this.validateCard(updates)) {
        throw new Error('Invalid card data');
      }

      const cards = await this.getCards();
      const index = cards.findIndex(card => card.id === id);

      if (index === -1) {
        throw new Error('Card not found');
      }

      cards[index] = { ...cards[index], ...updates };
      await this.storageService.saveCards(cards);
      return cards[index];
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  }

  /**
   * Delete a card
   * @param {string} id Card ID to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteCard(id) {
    try {
      const cards = await this.getCards();
      const filteredCards = cards.filter(card => card.id !== id);

      if (filteredCards.length === cards.length) {
        throw new Error('Card not found');
      }

      await this.storageService.saveCards(filteredCards);
      return true;
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  }

  /**
   * Validate card data
   * @param {Object} card Card object to validate
   * @returns {boolean} Validation result
   */
  validateCard(card) {
    if (!card || typeof card !== 'object') {
      return false;
    }

    // Required fields
    if (!card.text || typeof card.text !== 'string' || card.text.trim() === '') {
      return false;
    }

    // Editions validation
    if (!Array.isArray(card.editions) || card.editions.length === 0) {
      return false;
    }

    // Validate each edition
    for (const edition of card.editions) {
      if (typeof edition !== 'string' || 
          edition.length > 30 || 
          !/^[a-zA-Z0-9\s]+$/.test(edition)) {
        return false;
      }
    }

    // Optional fields validation
    if (card.notes && typeof card.notes !== 'string') {
      return false;
    }

    if (card.imageUrl && typeof card.imageUrl !== 'string') {
      return false;
    }

    return true;
  }

  /**
   * Initialize storage with sample cards if empty
   * @returns {Promise<boolean>} Success status
   */
  async initializeStorage() {
    try {
      const cards = await this.getCards();
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