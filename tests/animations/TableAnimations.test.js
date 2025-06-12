import { JSDOM } from 'jsdom';
import { TableAnimations } from '../../src/animations/TableAnimations.js';
import { jest } from '@jest/globals';

describe('TableAnimations', () => {
  let dom;
  let document;
  let element;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    document = dom.window.document;

    // Create test element
    element = document.createElement('div');
    document.body.appendChild(element);

    // Mock the Web Animations API
    const mockAnimation = {
      onfinish: null,
      finished: Promise.resolve(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };
    
    element.animate = jest.fn().mockReturnValue(mockAnimation);
    
    // Immediately trigger the finish callback
    element.animate.mockImplementation(() => {
      setTimeout(() => {
        if (mockAnimation.onfinish) {
          mockAnimation.onfinish();
        }
      }, 0);
      return mockAnimation;
    });
  });

  afterEach(() => {
    dom.window.close();
  });

  describe('highlightRow', () => {
    it('should add and remove highlight class', async () => {
      await TableAnimations.highlightRow(element, 'success');
      expect(element.classList.contains('highlight-success')).toBe(false);
      expect(element.animate).toHaveBeenCalled();
    });

    it('should apply correct glow effect', async () => {
      await TableAnimations.highlightRow(element, 'success');
      expect(element.style.boxShadow).toBe('');
    });

    it('should handle error type', async () => {
      await TableAnimations.highlightRow(element, 'error');
      expect(element.classList.contains('highlight-error')).toBe(false);
      expect(element.animate).toHaveBeenCalled();
    });
  });

  describe('fadeOut', () => {
    it('should hide element after animation', async () => {
      await TableAnimations.fadeOut(element);
      expect(element.style.display).toBe('none');
      expect(element.animate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ opacity: 1 }),
          expect.objectContaining({ opacity: 0 })
        ]),
        expect.any(Object)
      );
    });
  });

  describe('fadeIn', () => {
    it('should show element and animate', async () => {
      element.style.display = 'none';
      await TableAnimations.fadeIn(element);
      expect(element.style.display).toBe('');
      expect(element.animate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ opacity: 0 }),
          expect.objectContaining({ opacity: 1 })
        ]),
        expect.any(Object)
      );
    });
  });

  describe('slideOut', () => {
    it('should slide out to the left by default', async () => {
      await TableAnimations.slideOut(element);
      expect(element.style.display).toBe('none');
      expect(element.animate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ transform: 'translateX(0)' }),
          expect.objectContaining({ transform: 'translateX(-100%)' })
        ]),
        expect.any(Object)
      );
    });

    it('should slide out to the right when specified', async () => {
      await TableAnimations.slideOut(element, 'right');
      expect(element.style.display).toBe('none');
      expect(element.animate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ transform: 'translateX(0)' }),
          expect.objectContaining({ transform: 'translateX(100%)' })
        ]),
        expect.any(Object)
      );
    });
  });

  describe('slideIn', () => {
    it('should slide in from the right by default', async () => {
      await TableAnimations.slideIn(element);
      expect(element.style.display).toBe('');
      expect(element.animate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ transform: 'translateX(100%)' }),
          expect.objectContaining({ transform: 'translateX(0)' })
        ]),
        expect.any(Object)
      );
    });

    it('should slide in from the left when specified', async () => {
      await TableAnimations.slideIn(element, 'left');
      expect(element.style.display).toBe('');
      expect(element.animate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ transform: 'translateX(-100%)' }),
          expect.objectContaining({ transform: 'translateX(0)' })
        ]),
        expect.any(Object)
      );
    });
  });
}); 