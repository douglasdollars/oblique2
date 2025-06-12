import { Card } from '../models/Card.js';

const STORAGE_KEY = 'oblique_strategies_cards';
const STORAGE_VERSION = '1.0';

/**
 * Service for managing card data in localStorage
 */
export class StorageService {
  constructor() {
    this.storage = window.localStorage;
  }

  /**
   * Get all cards from storage
   * @returns {Promise<Card[]>} Array of Card instances
   */
  async getCards() {
    try {
      const data = this.storage.getItem(STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);
      if (parsed.version !== STORAGE_VERSION) {
        throw new Error('Storage version mismatch');
      }

      return parsed.cards.map(cardData => Card.fromJSON(cardData));
    } catch (error) {
      console.error('Error getting cards:', error);
      return [];
    }
  }

  /**
   * Save cards to storage
   * @param {Card[]} cards - Array of Card instances to save
   * @returns {Promise<boolean>} Success status
   */
  async saveCards(cards) {
    try {
      const data = {
        version: STORAGE_VERSION,
        cards: cards.map(card => card.toJSON())
      };
      this.storage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving cards:', error);
      return false;
    }
  }

  /**
   * Add a new card
   * @param {Card} card - Card instance to add
   * @returns {Promise<boolean>} Success status
   */
  async addCard(card) {
    try {
      const cards = await this.getCards();
      cards.push(card);
      return this.saveCards(cards);
    } catch (error) {
      console.error('Error adding card:', error);
      return false;
    }
  }

  /**
   * Update an existing card
   * @param {string} id - Card ID to update
   * @param {Card} updatedCard - Updated Card instance
   * @returns {Promise<boolean>} Success status
   */
  async updateCard(id, updatedCard) {
    try {
      const cards = await this.getCards();
      const index = cards.findIndex(card => card.id === id);
      if (index === -1) return false;

      cards[index] = updatedCard;
      return this.saveCards(cards);
    } catch (error) {
      console.error('Error updating card:', error);
      return false;
    }
  }

  /**
   * Delete a card
   * @param {string} id - Card ID to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteCard(id) {
    try {
      const cards = await this.getCards();
      const filtered = cards.filter(card => card.id !== id);
      return this.saveCards(filtered);
    } catch (error) {
      console.error('Error deleting card:', error);
      return false;
    }
  }

  /**
   * Check if storage is available and has sufficient space
   * @returns {Promise<boolean>} Storage availability status
   */
  async checkStorageAvailability() {
    try {
      const testKey = '__storage_test__';
      this.storage.setItem(testKey, testKey);
      this.storage.removeItem(testKey);
      return true;
    } catch (error) {
      console.error('Storage not available:', error);
      return false;
    }
  }

  /**
   * Clear all stored cards
   * @returns {Promise<boolean>} Success status
   */
  async clearStorage() {
    try {
      this.storage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
} 