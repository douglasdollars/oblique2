import { CardService } from '../../src/services/CardService.js';
import { Card } from '../../src/models/Card.js';

describe('CardService', () => {
  let cardService;
  let mockStorageService;

  beforeEach(() => {
    mockStorageService = {
      getCards: jest.fn(),
      saveCards: jest.fn(),
      addCard: jest.fn(),
      updateCard: jest.fn(),
      deleteCard: jest.fn()
    };

    // Mock the StorageService constructor
    jest.spyOn(global, 'StorageService').mockImplementation(() => mockStorageService);
    cardService = new CardService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all cards', async () => {
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

    mockStorageService.getCards.mockResolvedValue(mockCards);
    const cards = await cardService.getAllCards();
    expect(cards).toEqual(mockCards);
  });

  it('should get a random card', async () => {
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

    mockStorageService.getCards.mockResolvedValue(mockCards);
    const card = await cardService.getRandomCard();
    expect(mockCards).toContain(card);
  });

  it('should return fallback card when no cards exist', async () => {
    mockStorageService.getCards.mockResolvedValue([]);
    const card = await cardService.getRandomCard();
    expect(card).toBe(cardService.fallbackCard);
  });

  it('should add a new card', async () => {
    const cardData = {
      text: 'New card',
      editions: ['First Edition']
    };

    mockStorageService.addCard.mockResolvedValue(true);
    const card = await cardService.addCard(cardData);
    expect(card).toBeInstanceOf(Card);
    expect(card.text).toBe(cardData.text);
    expect(card.editions).toEqual(cardData.editions);
  });

  it('should reject invalid card data', async () => {
    const cardData = {
      text: '',
      editions: []
    };

    const card = await cardService.addCard(cardData);
    expect(card).toBeNull();
  });

  it('should update an existing card', async () => {
    const existingCard = new Card({
      id: '1',
      text: 'Original card',
      editions: ['First Edition']
    });

    const updateData = {
      text: 'Updated card'
    };

    mockStorageService.getCards.mockResolvedValue([existingCard]);
    mockStorageService.updateCard.mockResolvedValue(true);

    const updatedCard = await cardService.updateCard('1', updateData);
    expect(updatedCard).toBeInstanceOf(Card);
    expect(updatedCard.text).toBe(updateData.text);
  });

  it('should return null when updating non-existent card', async () => {
    mockStorageService.getCards.mockResolvedValue([]);
    const updatedCard = await cardService.updateCard('1', { text: 'Updated' });
    expect(updatedCard).toBeNull();
  });

  it('should delete a card', async () => {
    mockStorageService.deleteCard.mockResolvedValue(true);
    const success = await cardService.deleteCard('1');
    expect(success).toBe(true);
  });

  it('should initialize storage with sample cards', async () => {
    mockStorageService.getCards.mockResolvedValue([]);
    mockStorageService.addCard.mockResolvedValue(true);

    const success = await cardService.initializeStorage();
    expect(success).toBe(true);
    expect(mockStorageService.addCard).toHaveBeenCalledTimes(10);
  });

  it('should not initialize storage if cards exist', async () => {
    const existingCard = new Card({
      id: '1',
      text: 'Existing card',
      editions: ['First Edition']
    });

    mockStorageService.getCards.mockResolvedValue([existingCard]);
    const success = await cardService.initializeStorage();
    expect(success).toBe(true);
    expect(mockStorageService.addCard).not.toHaveBeenCalled();
  });
}); 