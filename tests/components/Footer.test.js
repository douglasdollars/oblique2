import { JSDOM } from 'jsdom';
import { Footer } from '../../src/components/Footer.js';
import { jest } from '@jest/globals';

describe('Footer Component', () => {
  let dom;
  let footer;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { height: 2000px; }
            .site-footer { position: fixed; bottom: 0; }
          </style>
        </head>
        <body></body>
      </html>
    `, { 
      url: 'http://localhost/',
      pretendToBeVisual: true,
      resources: 'usable'
    });

    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;

    // Mock window properties
    Object.defineProperty(dom.window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800
    });

    Object.defineProperty(dom.window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 0
    });

    Object.defineProperty(dom.window.document.documentElement, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: 2000
    });

    Object.defineProperty(dom.window.document.documentElement, 'scrollTop', {
      writable: true,
      configurable: true,
      value: 0
    });
  });

  afterEach(() => {
    if (footer) {
      footer.cleanup();
    }
    dom.window.close();
  });

  it('should create footer with proper structure', () => {
    footer = new Footer();
    
    const footerElement = document.querySelector('.site-footer');
    expect(footerElement).toBeTruthy();
    expect(footerElement.getAttribute('role')).toBe('contentinfo');
    
    const leafGlow = footerElement.querySelector('.leaf-glow');
    expect(leafGlow).toBeTruthy();
    expect(leafGlow.textContent).toBe('🍃');
    
    const credits = footerElement.querySelector('.footer-credits p');
    expect(credits).toBeTruthy();
    expect(credits.textContent).toBe('Concept and cards by Brian Eno and Peter Schmidt');
  });

  it('should be hidden by default', () => {
    footer = new Footer();
    
    const footerElement = document.querySelector('.site-footer');
    expect(footerElement.classList.contains('visible')).toBe(false);
    expect(footerElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('should show when scroll threshold is reached', () => {
    footer = new Footer({ scrollThreshold: 0.8 });
    
    // Simulate scrolling to 80% of page
    Object.defineProperty(dom.window, 'pageYOffset', {
      value: 960 // 80% of (2000 - 800)
    });
    
    footer.checkScrollPosition();
    
    const footerElement = document.querySelector('.site-footer');
    expect(footerElement.classList.contains('visible')).toBe(true);
    expect(footerElement.getAttribute('aria-hidden')).toBe('false');
  });

  it('should hide when scrolling back up', () => {
    footer = new Footer({ scrollThreshold: 0.8 });
    
    // First scroll down to show footer
    Object.defineProperty(dom.window, 'pageYOffset', {
      value: 960
    });
    footer.checkScrollPosition();
    
    // Then scroll back up
    Object.defineProperty(dom.window, 'pageYOffset', {
      value: 500
    });
    footer.checkScrollPosition();
    
    const footerElement = document.querySelector('.site-footer');
    expect(footerElement.classList.contains('visible')).toBe(false);
    expect(footerElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('should handle scroll events', () => {
    footer = new Footer();
    const checkScrollSpy = jest.spyOn(footer, 'checkScrollPosition');
    
    // Simulate scroll event
    const scrollEvent = new dom.window.Event('scroll');
    dom.window.dispatchEvent(scrollEvent);
    
    expect(checkScrollSpy).toHaveBeenCalled();
  });

  it('should handle resize events', () => {
    footer = new Footer();
    const checkScrollSpy = jest.spyOn(footer, 'checkScrollPosition');
    
    // Simulate resize event
    const resizeEvent = new dom.window.Event('resize');
    dom.window.dispatchEvent(resizeEvent);
    
    expect(checkScrollSpy).toHaveBeenCalled();
  });

  it('should manually show and hide', () => {
    footer = new Footer();
    const footerElement = document.querySelector('.site-footer');
    
    footer.show();
    expect(footerElement.classList.contains('visible')).toBe(true);
    expect(footerElement.getAttribute('aria-hidden')).toBe('false');
    
    footer.hide();
    expect(footerElement.classList.contains('visible')).toBe(false);
    expect(footerElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('should clean up event listeners on destroy', () => {
    footer = new Footer();
    const removeEventListenerSpy = jest.spyOn(dom.window, 'removeEventListener');
    
    footer.cleanup();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should remove element on cleanup', () => {
    footer = new Footer();
    
    expect(document.querySelector('.site-footer')).toBeTruthy();
    
    footer.cleanup();
    
    expect(document.querySelector('.site-footer')).toBeFalsy();
  });

  it('should handle custom scroll threshold', () => {
    footer = new Footer({ scrollThreshold: 0.5 });
    
    // Simulate scrolling to 50% of page
    Object.defineProperty(dom.window, 'pageYOffset', {
      value: 600 // 50% of (2000 - 800)
    });
    
    footer.checkScrollPosition();
    
    const footerElement = document.querySelector('.site-footer');
    expect(footerElement.classList.contains('visible')).toBe(true);
  });

  it('should handle edge case with no scrollable content', () => {
    // Set document height equal to window height
    Object.defineProperty(dom.window.document.documentElement, 'scrollHeight', {
      value: 800
    });
    
    footer = new Footer();
    footer.checkScrollPosition();
    
    // Should not throw error and footer should remain hidden
    const footerElement = document.querySelector('.site-footer');
    expect(footerElement.classList.contains('visible')).toBe(false);
  });

  it('should replace existing footer if one exists', () => {
    // Create first footer
    const firstFooter = new Footer();
    const firstElement = document.querySelector('.site-footer');
    
    // Create second footer
    const secondFooter = new Footer();
    const footerElements = document.querySelectorAll('.site-footer');
    
    expect(footerElements.length).toBe(1);
    expect(document.querySelector('.site-footer')).not.toBe(firstElement);
    
    firstFooter.cleanup();
    secondFooter.cleanup();
  });
}); 