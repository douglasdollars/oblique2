const { JSDOM } = require('jsdom');
const CardDisplay = require('../../src/components/CardDisplay');
const CardService = require('../../src/services/CardService');
const CardStack = require('../../src/components/CardStack');

// Mock dependencies
jest.mock('../../src/services/CardService');
jest.mock('../../src/components/CardStack');

describe('CardDisplay', () => {
  let dom;
  let container;
  let cardDisplay;
  let mockCardService;
  let mockCardStack;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
    container = document.getElementById('container');

    // Setup CardService mock
    mockCardService = {
      getRandomCard: jest.fn(),
      fallbackCard: {
        id: 'fallback',
        text: '[we\'ve created mystery]',
        editions: ['fallback']
      }
    };
    CardService.mockImplementation(() => mockCardService);

    // Setup CardStack mock
    mockCardStack = {
      init: jest.fn(),
      addCard: jest.fn(),
      cleanup: jest.fn()
    };
    CardStack.mockImplementation(() => mockCardStack);

    cardDisplay = new CardDisplay(container);
  });

  afterEach(() => {
    if (cardDisplay) {
      cardDisplay.cleanup();
    }
  });

  describe('initialization', () => {
    it('should initialize card stack and load initial card', async () => {
      const testCard = {
        id: '1',
        text: 'Test Card',
        editions: ['test']
      };
      mockCardService.getRandomCard.mockResolvedValue(testCard);

      await cardDisplay.init();

      expect(mockCardStack.init).toHaveBeenCalled();
      expect(mockCardService.getRandomCard).toHaveBeenCalled();
      expect(mockCardStack.addCard).toHaveBeenCalled();
    });

    it('should display fallback card if initial load fails', async () => {
      mockCardService.getRandomCard.mockRejectedValue(new Error('Load failed'));

      await cardDisplay.init();

      expect(mockCardStack.addCard).toHaveBeenCalledWith(expect.objectContaining({
        text: '[we\'ve created mystery]'
      }));
    });
  });

  describe('loading new cards', () => {
    it('should load and display a new card', async () => {
      const testCard = {
        id: '1',
        text: 'Test Card',
        editions: ['test']
      };
      mockCardService.getRandomCard.mockResolvedValue(testCard);

      await cardDisplay.loadNewCard();

      expect(mockCardService.getRandomCard).toHaveBeenCalled();
      expect(mockCardStack.addCard).toHaveBeenCalled();
    });

    it('should not load new card if already loading', async () => {
      cardDisplay.isLoading = true;
      await cardDisplay.loadNewCard();

      expect(mockCardService.getRandomCard).not.toHaveBeenCalled();
    });

    it('should display fallback card if load fails', async () => {
      mockCardService.getRandomCard.mockRejectedValue(new Error('Load failed'));

      await cardDisplay.loadNewCard();

      expect(mockCardStack.addCard).toHaveBeenCalledWith(expect.objectContaining({
        text: '[we\'ve created mystery]'
      }));
    });
  });

  describe('loading state', () => {
    it('should set loading state correctly', () => {
      cardDisplay.setLoading(true);
      expect(container.classList.contains('is-loading')).toBe(true);

      cardDisplay.setLoading(false);
      expect(container.classList.contains('is-loading')).toBe(false);
    });
  });

  describe('cleanup', () => {
    it('should cleanup card stack on destroy', () => {
      cardDisplay.cleanup();
      expect(mockCardStack.cleanup).toHaveBeenCalled();
    });
  });
}); 