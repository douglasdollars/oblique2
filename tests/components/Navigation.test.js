import { JSDOM } from 'jsdom';
import { Navigation } from '../../src/components/Navigation.js';

describe('Navigation', () => {
  let dom;
  let document;
  let navigation;

  beforeEach(() => {
    // Create a new JSDOM instance
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'http://localhost/',
    });
    document = dom.window.document;
    global.window = dom.window;
    global.document = document;

    // Mock location.hash
    Object.defineProperty(window, 'location', {
      value: {
        hash: '#/',
      },
      writable: true,
    });

    navigation = new Navigation();
  });

  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
  });

  it('should create navigation with correct structure', () => {
    const header = document.querySelector('.site-header');
    expect(header).toBeTruthy();
    expect(header.getAttribute('role')).toBe('banner');

    const nav = document.querySelector('.main-nav');
    expect(nav).toBeTruthy();
    expect(nav.getAttribute('role')).toBe('navigation');

    const title = document.querySelector('.site-title');
    expect(title).toBeTruthy();
    expect(title.textContent.trim()).toBe('Oblique Strategies');

    const navLinks = document.querySelectorAll('.nav-link');
    expect(navLinks.length).toBe(2);
    expect(navLinks[0].textContent.trim()).toBe('About');
    expect(navLinks[1].textContent.trim()).toBe('Edit Cards');
  });

  it('should handle navigation clicks', () => {
    const aboutLink = document.querySelector('a[href="#/about"]');
    aboutLink.click();

    expect(window.location.hash).toBe('#/about');
    expect(navigation.getActiveRoute()).toBe('/about');

    const editCardsLink = document.querySelector('a[href="#/edit-cards"]');
    editCardsLink.click();

    expect(window.location.hash).toBe('#/edit-cards');
    expect(navigation.getActiveRoute()).toBe('/edit-cards');
  });

  it('should update active state of navigation links', () => {
    window.location.hash = '#/about';
    navigation.render();

    const aboutLink = document.querySelector('a[href="#/about"]');
    const editCardsLink = document.querySelector('a[href="#/edit-cards"]');

    expect(aboutLink.classList.contains('active')).toBe(true);
    expect(editCardsLink.classList.contains('active')).toBe(false);
    expect(aboutLink.getAttribute('aria-current')).toBe('page');
    expect(editCardsLink.getAttribute('aria-current')).toBe('false');
  });

  it('should handle browser back/forward navigation', () => {
    // Simulate browser back/forward
    window.location.hash = '#/about';
    window.dispatchEvent(new window.HashChangeEvent('hashchange'));

    expect(navigation.getActiveRoute()).toBe('/about');

    window.location.hash = '#/edit-cards';
    window.dispatchEvent(new window.HashChangeEvent('hashchange'));

    expect(navigation.getActiveRoute()).toBe('/edit-cards');
  });
}); 