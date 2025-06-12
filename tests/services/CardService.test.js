import { jest } from '@jest/globals';
import { CardService } from '../../src/services/CardService.js';
import { StorageService } from '../../src/services/StorageService.js';

// Mock StorageService
jest.mock('../../src/services/StorageService.js', () => ({
  StorageService: jest.fn().mockImplementation(() => ({
    getCards: jest.fn().mockResolvedValue([]),
    saveCards: jest.fn().mockResolvedValue(true)
  }))
}));

describe('CardService', () => {
  let cardService;
  let mockCards;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock data
    mockCards = [
      { id: '1', text: 'Test card 1' },
      { id: '2', text: 'Test card 2' }
    ];

    // Setup StorageService mock
    StorageService.mockImplementation(() => ({
      getCards: jest.fn().mockResolvedValue(mockCards),
      saveCards: jest.fn().mockResolvedValue(true)
    }));

    cardService = new CardService();
  });

  describe('getCards', () => {
    it('should return all cards from storage', async () => {
      const cards = await cardService.getCards();
      expect(cards).toEqual(mockCards);
    });

    it('should return empty array if storage fails', async () => {
      StorageService.mockImplementation(() => ({
        getCards: jest.fn().mockRejectedValue(new Error('Storage error'))
      }));
      cardService = new CardService();
      
      const cards = await cardService.getCards();
      expect(cards).toEqual([]);
    });
  });

  describe('getRandomCard', () => {
    it('should return a random card from available cards', async () => {
      const card = await cardService.getRandomCard();
      expect(mockCards).toContainEqual(card);
    });

    it('should return fallback card if no cards available', async () => {
      StorageService.mockImplementation(() => ({
        getCards: jest.fn().mockResolvedValue([])
      }));
      cardService = new CardService();

      const card = await cardService.getRandomCard();
      expect(card).toEqual(cardService.fallbackCard);
    });

    it('should return fallback card if storage fails', async () => {
      StorageService.mockImplementation(() => ({
        getCards: jest.fn().mockRejectedValue(new Error('Storage error'))
      }));
      cardService = new CardService();

      const card = await cardService.getRandomCard();
      expect(card).toEqual(cardService.fallbackCard);
    });
  });

  describe('addCard', () => {
    it('should add a valid card to storage', async () => {
      const newCard = {
        text: 'New Card',
        editions: ['test'],
        notes: 'New notes',
        imageUrl: 'new.jpg'
      };

      const addedCard = await cardService.addCard(newCard);
      expect(addedCard).toMatchObject(newCard);
      expect(addedCard.id).toBeDefined();
    });

    it('should throw error for invalid card data', async () => {
      const invalidCard = {
        text: '', // Invalid empty text
        editions: ['test']
      };

      await expect(cardService.addCard(invalidCard)).rejects.toThrow('Invalid card data');
    });
  });

  describe('updateCard', () => {
    it('should update an existing card', async () => {
      const updates = {
        text: 'Updated Card',
        editions: ['updated']
      };

      const updatedCard = await cardService.updateCard('1', updates);
      expect(updatedCard).toMatchObject({
        id: '1',
        ...updates
      });
    });

    it('should throw error if card not found', async () => {
      const updates = {
        text: 'Updated Card',
        editions: ['updated']
      };

      await expect(cardService.updateCard('999', updates)).rejects.toThrow('Card not found');
    });
  });

  describe('deleteCard', () => {
    it('should delete an existing card', async () => {
      const result = await cardService.deleteCard('1');
      expect(result).toBe(true);
    });

    it('should throw error if card not found', async () => {
      await expect(cardService.deleteCard('999')).rejects.toThrow('Card not found');
    });
  });

  describe('validateCard', () => {
    it('should validate card data correctly', () => {
      const validCard = {
        text: 'Valid Card',
        editions: ['test']
      };
      expect(cardService.validateCard(validCard)).toBe(true);
    });

    it('should reject invalid card data', () => {
      const invalidCards = [
        null,
        undefined,
        {},
        { text: '' },
        { text: 'Test', editions: [] },
        { text: 'Test', editions: [''] },
        { text: 'Test', editions: ['a'.repeat(31)] },
        { text: 'Test', editions: ['test!'] },
        { text: 'Test', editions: ['test'], notes: 123 },
        { text: 'Test', editions: ['test'], imageUrl: 123 }
      ];

      invalidCards.forEach(card => {
        expect(cardService.validateCard(card)).toBe(false);
      });
    });
  });
}); 