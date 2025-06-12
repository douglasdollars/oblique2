import { Card } from '../models/Card.js';
import { StorageService } from './StorageService.js';

/**
 * Service for managing card operations and business logic
 */
export class CardService {
  constructor() {
    this.storageKey = 'oblique_strategies_cards';
    this.cards = this.loadCards();
    this.storageService = new StorageService();
    this.fallbackCard = {
      id: 'fallback',
      text: 'Use an old idea',
      editions: ['Original'],
      notes: 'Default card when no others are available',
      imageUrl: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  loadCards() {
    try {
      const storedCards = localStorage.getItem(this.storageKey);
      return storedCards ? JSON.parse(storedCards) : [];
    } catch (error) {
      console.error('Error loading cards:', error);
      return [];
    }
  }

  saveCards() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cards));
      return true;
    } catch (error) {
      console.error('Error saving cards:', error);
      return false;
    }
  }

  getAllCards() {
    return [...this.cards];
  }

  getCardById(id) {
    return this.cards.find(card => card.id === id) || null;
  }

  addCard(cardData) {
    try {
      const newCard = {
        id: this.generateId(),
        text: cardData.text.trim(),
        editions: [...cardData.editions],
        notes: cardData.notes?.trim() || '',
        imageUrl: cardData.imageUrl?.trim() || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.validateCard(newCard);
      this.cards.unshift(newCard);
      
      if (this.saveCards()) {
        return newCard;
      }
      throw new Error('Failed to save card');
    } catch (error) {
      console.error('Error adding card:', error);
      throw error;
    }
  }

  updateCard(id, cardData) {
    try {
      const index = this.cards.findIndex(card => card.id === id);
      if (index === -1) {
        throw new Error('Card not found');
      }

      const updatedCard = {
        ...this.cards[index],
        text: cardData.text.trim(),
        editions: [...cardData.editions],
        notes: cardData.notes?.trim() || '',
        imageUrl: cardData.imageUrl?.trim() || '',
        updatedAt: new Date().toISOString()
      };

      this.validateCard(updatedCard);
      this.cards[index] = updatedCard;

      if (this.saveCards()) {
        return updatedCard;
      }
      throw new Error('Failed to save updated card');
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  }

  deleteCard(id) {
    try {
      const index = this.cards.findIndex(card => card.id === id);
      if (index === -1) {
        throw new Error('Card not found');
      }

      this.cards.splice(index, 1);
      
      if (this.saveCards()) {
        return true;
      }
      throw new Error('Failed to save after deletion');
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  }

  validateCard(card) {
    if (!card.text || typeof card.text !== 'string' || card.text.trim().length === 0) {
      throw new Error('Card text is required');
    }

    if (!Array.isArray(card.editions) || card.editions.length === 0) {
      throw new Error('At least one edition is required');
    }

    if (card.editions.some(edition => typeof edition !== 'string' || edition.trim().length === 0)) {
      throw new Error('Invalid edition format');
    }

    if (card.editions.some(edition => edition.length > 30)) {
      throw new Error('Edition name must be 30 characters or less');
    }

    if (card.editions.some(edition => !/^[a-zA-Z0-9\s]+$/.test(edition))) {
      throw new Error('Edition name can only contain letters, numbers, and spaces');
    }

    if (card.imageUrl && typeof card.imageUrl === 'string') {
      try {
        new URL(card.imageUrl);
      } catch {
        throw new Error('Invalid image URL format');
      }
    }
  }

  generateId() {
    return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  searchCards(query) {
    const searchTerm = query.toLowerCase();
    return this.cards.filter(card => {
      return (
        card.text.toLowerCase().includes(searchTerm) ||
        card.editions.some(edition => edition.toLowerCase().includes(searchTerm)) ||
        card.notes.toLowerCase().includes(searchTerm)
      );
    });
  }

  filterByEdition(edition) {
    return this.cards.filter(card => 
      card.editions.some(e => e.toLowerCase() === edition.toLowerCase())
    );
  }

  getRandomCard() {
    if (this.cards.length === 0) {
      return this.fallbackCard;
    }
    const randomIndex = Math.floor(Math.random() * this.cards.length);
    return this.cards[randomIndex];
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