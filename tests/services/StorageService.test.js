import { jest } from '@jest/globals';
import { StorageService } from '../../src/services/StorageService.js';
import { Card } from '../../src/models/Card.js';

describe('StorageService', () => {
  let storageService;
  let mockLocalStorage;

  beforeEach(() => {
    mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
    global.localStorage = mockLocalStorage;
    storageService = new StorageService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get empty array when no cards exist', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const cards = await storageService.getCards();
    expect(cards).toEqual([]);
  });

  it('should get cards from storage', async () => {
    const mockCards = [
      new Card({
        id: '1',
        text: 'Test card 1',
        editions: ['First Edition']
      }),
      new Card({
        id: '2',
        text: 'Test card 2',
        editions: ['First Edition']
      })
    ];

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      version: '1.0',
      cards: mockCards.map(card => card.toJSON())
    }));

    const cards = await storageService.getCards();
    expect(cards).toHaveLength(2);
    expect(cards[0]).toBeInstanceOf(Card);
    expect(cards[1]).toBeInstanceOf(Card);
  });

  it('should save cards to storage', async () => {
    const cards = [
      new Card({
        id: '1',
        text: 'Test card',
        editions: ['First Edition']
      })
    ];

    const success = await storageService.saveCards(cards);
    expect(success).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('should add a new card', async () => {
    const card = new Card({
      id: '1',
      text: 'Test card',
      editions: ['First Edition']
    });

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      version: '1.0',
      cards: []
    }));

    const success = await storageService.addCard(card);
    expect(success).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('should update an existing card', async () => {
    const card = new Card({
      id: '1',
      text: 'Test card',
      editions: ['First Edition']
    });

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      version: '1.0',
      cards: [card.toJSON()]
    }));

    const updatedCard = new Card({
      id: '1',
      text: 'Updated card',
      editions: ['First Edition']
    });

    const success = await storageService.updateCard('1', updatedCard);
    expect(success).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('should delete a card', async () => {
    const card = new Card({
      id: '1',
      text: 'Test card',
      editions: ['First Edition']
    });

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      version: '1.0',
      cards: [card.toJSON()]
    }));

    const success = await storageService.deleteCard('1');
    expect(success).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('should check storage availability', async () => {
    const available = await storageService.checkStorageAvailability();
    expect(available).toBe(true);
  });

  it('should clear storage', async () => {
    const success = await storageService.clearStorage();
    expect(success).toBe(true);
    expect(mockLocalStorage.removeItem).toHaveBeenCalled();
  });
}); 