import { jest } from '@jest/globals';
import { ShuffleAnimation } from '../../src/animations/ShuffleAnimation';

describe('ShuffleAnimation', () => {
  let shuffleAnimation;
  let mockElement;
  let mockOnStart;
  let mockOnComplete;

  beforeEach(() => {
    mockOnStart = jest.fn();
    mockOnComplete = jest.fn();
    shuffleAnimation = new ShuffleAnimation({
      onStart: mockOnStart,
      onComplete: mockOnComplete
    });

    // Create mock DOM element with card stack
    mockElement = document.createElement('div');
    const cardStack = document.createElement('div');
    cardStack.className = 'card-stack';
    
    // Add three mock cards
    for (let i = 0; i < 3; i++) {
      const card = document.createElement('div');
      card.className = 'card';
      cardStack.appendChild(card);
    }
    
    mockElement.appendChild(cardStack);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default options', () => {
    const defaultShuffleAnimation = new ShuffleAnimation();
    expect(defaultShuffleAnimation.options.duration).toBe(500);
    expect(defaultShuffleAnimation.options.easing).toBe('ease-in-out');
  });

  test('should not shuffle if already animating', async () => {
    shuffleAnimation.isAnimating = true;
    await shuffleAnimation.shuffle(mockElement);
    expect(mockOnStart).not.toHaveBeenCalled();
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  test('should handle missing card-stack element', async () => {
    const emptyElement = document.createElement('div');
    await shuffleAnimation.shuffle(emptyElement);
    expect(mockOnStart).not.toHaveBeenCalled();
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  test('should call onStart when animation begins', async () => {
    await shuffleAnimation.shuffle(mockElement);
    expect(mockOnStart).toHaveBeenCalled();
  });

  test('should call onComplete when animation ends', async () => {
    await shuffleAnimation.shuffle(mockElement);
    expect(mockOnComplete).toHaveBeenCalled();
  });

  test('should add is-shuffling class during animation', async () => {
    const cardStack = mockElement.querySelector('.card-stack');
    await shuffleAnimation.shuffle(mockElement);
    expect(cardStack.classList.contains('is-shuffling')).toBe(false);
  });

  test('should apply staggered delays to cards', async () => {
    const cards = mockElement.querySelectorAll('.card');
    await shuffleAnimation.shuffle(mockElement);
    
    cards.forEach((card, index) => {
      const delay = card.style.transitionDelay;
      expect(delay).toBe(`${index * 50}ms`);
    });
  });

  test('should cancel ongoing animation', () => {
    shuffleAnimation.isAnimating = true;
    shuffleAnimation.cancel();
    expect(shuffleAnimation.isAnimating).toBe(false);
  });

  test('should check animation progress', () => {
    expect(shuffleAnimation.isInProgress()).toBe(false);
    shuffleAnimation.isAnimating = true;
    expect(shuffleAnimation.isInProgress()).toBe(true);
  });
}); 