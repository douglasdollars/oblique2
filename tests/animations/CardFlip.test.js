import { jest } from '@jest/globals';
import { CardFlip } from '../../src/animations/CardFlip';

describe('CardFlip', () => {
  let cardFlip;
  let mockElement;
  let mockOnStart;
  let mockOnComplete;

  beforeEach(() => {
    mockOnStart = jest.fn();
    mockOnComplete = jest.fn();
    cardFlip = new CardFlip({
      onStart: mockOnStart,
      onComplete: mockOnComplete
    });

    // Create mock DOM element
    mockElement = document.createElement('div');
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    mockElement.appendChild(cardInner);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default options', () => {
    const defaultCardFlip = new CardFlip();
    expect(defaultCardFlip.options.duration).toBe(300);
    expect(defaultCardFlip.options.easing).toBe('ease-in-out');
  });

  test('should not flip if already animating', async () => {
    cardFlip.isAnimating = true;
    await cardFlip.flip(mockElement);
    expect(mockOnStart).not.toHaveBeenCalled();
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  test('should handle missing card-inner element', async () => {
    const emptyElement = document.createElement('div');
    await cardFlip.flip(emptyElement);
    expect(mockOnStart).not.toHaveBeenCalled();
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  test('should call onStart when animation begins', async () => {
    await cardFlip.flip(mockElement);
    expect(mockOnStart).toHaveBeenCalled();
  });

  test('should call onComplete when animation ends', async () => {
    await cardFlip.flip(mockElement);
    expect(mockOnComplete).toHaveBeenCalled();
  });

  test('should toggle is-flipped class after animation', async () => {
    const cardInner = mockElement.querySelector('.card-inner');
    await cardFlip.flip(mockElement);
    expect(cardInner.classList.contains('is-flipped')).toBe(true);
  });

  test('should cancel ongoing animation', () => {
    cardFlip.isAnimating = true;
    cardFlip.cancel();
    expect(cardFlip.isAnimating).toBe(false);
  });

  test('should check animation progress', () => {
    expect(cardFlip.isInProgress()).toBe(false);
    cardFlip.isAnimating = true;
    expect(cardFlip.isInProgress()).toBe(true);
  });
}); 