import { JSDOM } from 'jsdom';
import { Card } from '../../src/components/Card';

describe('Card Component', () => {
  let dom;
  let document;
  let main;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body><main></main></body></html>');
    document = dom.window.document;
    main = document.querySelector('main');
    global.document = document;
  });

  afterEach(() => {
    dom.window.close();
  });

  it('should create a card with default data', () => {
    const card = new Card();
    const cardElement = document.querySelector('.card');
    
    expect(cardElement).toBeTruthy();
    expect(cardElement.getAttribute('role')).toBe('article');
    expect(cardElement.getAttribute('aria-label')).toBe('Oblique Strategy Card');
  });

  it('should create a card with provided data', () => {
    const cardData = {
      id: '1',
      text: 'Test card text',
      editions: ['Edition 1', 'Edition 2'],
      notes: 'Test notes',
      imageUrl: 'test.jpg'
    };

    const card = new Card(cardData);
    const cardElement = document.querySelector('.card');
    
    expect(cardElement).toBeTruthy();
    expect(cardElement.querySelector('.card-text').textContent).toBe('Test card text');
    expect(cardElement.querySelectorAll('.edition-tag').length).toBe(2);
    expect(cardElement.querySelector('.card-notes p').textContent).toBe('Test notes');
    expect(cardElement.querySelector('.card-image img').src).toContain('test.jpg');
  });

  it('should flip the card when clicked', () => {
    const card = new Card();
    const cardElement = document.querySelector('.card');
    const cardInner = cardElement.querySelector('.card-inner');
    
    expect(cardInner.classList.contains('is-flipped')).toBe(false);
    
    cardElement.click();
    expect(cardInner.classList.contains('is-flipped')).toBe(true);
    
    cardElement.click();
    expect(cardInner.classList.contains('is-flipped')).toBe(false);
  });

  it('should update card data', () => {
    const card = new Card();
    const newData = {
      text: 'Updated text',
      editions: ['New Edition']
    };

    card.update(newData);
    const cardElement = document.querySelector('.card');
    
    expect(cardElement.querySelector('.card-text').textContent).toBe('Updated text');
    expect(cardElement.querySelectorAll('.edition-tag').length).toBe(1);
    expect(cardElement.querySelector('.edition-tag').textContent).toBe('New Edition');
  });

  it('should get card data', () => {
    const cardData = {
      id: '1',
      text: 'Test card text',
      editions: ['Edition 1']
    };

    const card = new Card(cardData);
    const retrievedData = card.getData();
    
    expect(retrievedData).toEqual(cardData);
  });

  it('should clean up card element', () => {
    const card = new Card();
    const cardElement = document.querySelector('.card');
    
    expect(cardElement).toBeTruthy();
    
    card.cleanup();
    expect(document.querySelector('.card')).toBeNull();
  });

  it('should maintain aspect ratio across screen sizes', () => {
    const card = new Card();
    const cardElement = document.querySelector('.card');
    
    // Test default size
    expect(cardElement.style.width).toBe('70mm');
    expect(cardElement.style.height).toBe('90mm');
    
    // Simulate mobile viewport
    Object.defineProperty(window, 'innerWidth', { value: 480 });
    window.dispatchEvent(new Event('resize'));
    
    // Check if responsive styles are applied
    const computedStyle = window.getComputedStyle(cardElement);
    expect(computedStyle.width).toBe('50mm');
  });
}); 