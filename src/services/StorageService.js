import { Card } from '../models/Card.js';

const STORAGE_KEY = 'oblique_strategies_cards';
const STORAGE_VERSION = '1.0';
const CACHE_KEY = 'oblique_strategies_cache';
const CACHE_TIMESTAMP_KEY = 'oblique_strategies_cache_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Service for managing card data in localStorage
 */
export class StorageService {
  constructor() {
    this.storage = window.localStorage;
    this.cache = new Map();
    this.initCache();
  }

  async initCache() {
    try {
      const cachedData = this.storage.getItem(CACHE_KEY);
      const timestamp = parseInt(this.storage.getItem(CACHE_TIMESTAMP_KEY) || '0');
      
      if (cachedData && this.isCacheValid(timestamp)) {
        this.cache = new Map(JSON.parse(cachedData));
      } else {
        await this.refreshCache();
      }
    } catch (error) {
      console.error('Cache initialization failed:', error);
      this.cache.clear();
    }
  }

  isCacheValid(timestamp) {
    return Date.now() - timestamp < CACHE_DURATION;
  }

  async refreshCache() {
    try {
      const cards = await this.getAllCards();
      this.cache.clear();
      
      cards.forEach(card => {
        this.cache.set(card.id, {
          data: card,
          timestamp: Date.now()
        });
      });

      this.persistCache();
    } catch (error) {
      console.error('Cache refresh failed:', error);
    }
  }

  persistCache() {
    try {
      this.storage.setItem(CACHE_KEY, JSON.stringify(Array.from(this.cache.entries())));
      this.storage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Cache persistence failed:', error);
      // If storage is full, clear old data
      if (error.name === 'QuotaExceededError') {
        this.clearOldCacheEntries();
        this.persistCache();
      }
    }
  }

  clearOldCacheEntries() {
    const entries = Array.from(this.cache.entries());
    const sortedEntries = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const removeCount = Math.ceil(entries.length * 0.2); // Remove oldest 20%
    
    sortedEntries.slice(0, removeCount).forEach(([key]) => {
      this.cache.delete(key);
    });
  }

  /**
   * Get all cards from storage
   * @returns {Promise<Card[]>} Array of Card instances
   */
  async getAllCards() {
    try {
      const data = this.storage.getItem(STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);
      if (parsed.version !== STORAGE_VERSION) {
        throw new Error('Storage version mismatch');
      }

      return parsed.cards.map(cardData => Card.fromJSON(cardData));
    } catch (error) {
      console.error('Error retrieving cards:', error);
      return [];
    }
  }

  /**
   * Get a card from storage
   * @param {string} id - Card ID to retrieve
   * @returns {Promise<Card>} Card instance
   */
  async getCard(id) {
    try {
      const cached = this.cache.get(id);
      if (cached && this.isCacheValid(cached.timestamp)) {
        return new Card(cached.data);
      }

      const cards = await this.getAllCards();
      const card = cards.find(c => c.id === id);
      
      if (card) {
        this.cache.set(id, {
          data: card,
          timestamp: Date.now()
        });
        this.persistCache();
      }

      return card || null;
    } catch (error) {
      console.error('Error retrieving card:', error);
      return null;
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
   * Save a card to storage
   * @param {Card} card - Card instance to save
   * @returns {Promise<boolean>} Success status
   */
  async saveCard(card) {
    try {
      const cards = await this.getAllCards();
      const index = cards.findIndex(c => c.id === card.id);
      
      if (index >= 0) {
        cards[index] = card;
      } else {
        cards.push(card);
      }

      this.storage.setItem(STORAGE_KEY, JSON.stringify(cards));
      
      // Update cache
      this.cache.set(card.id, {
        data: card,
        timestamp: Date.now()
      });
      this.persistCache();

      return true;
    } catch (error) {
      console.error('Error saving card:', error);
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
      const cards = await this.getAllCards();
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
      const cards = await this.getAllCards();
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
      const cards = await this.getAllCards();
      const filtered = cards.filter(card => card.id !== id);
      
      this.storage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      
      // Update cache
      this.cache.delete(id);
      this.persistCache();

      return true;
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
      this.storage.removeItem(CACHE_KEY);
      this.storage.removeItem(CACHE_TIMESTAMP_KEY);
      this.cache.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
} 