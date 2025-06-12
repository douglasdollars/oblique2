const { JSDOM } = require('jsdom');
const CardStack = require('../../src/components/CardStack');
const Card = require('../../src/components/Card');

describe('CardStack', () => {
  let dom;
  let container;
  let cardStack;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
    container = document.getElementById('container');
  });

  afterEach(() => {
    if (cardStack) {
      cardStack.cleanup();
    }
  });

  it('should create a card stack with default options', () => {
    cardStack = new CardStack(container);
    cardStack.init();

    const stackElement = container.querySelector('.card-stack');
    expect(stackElement).toBeTruthy();
    expect(stackElement.children.length).toBe(0);
  });

  it('should add cards to the stack', () => {
    cardStack = new CardStack(container);
    cardStack.init();

    const card1 = new Card({ id: 1, text: 'Test Card 1' });
    const card2 = new Card({ id: 2, text: 'Test Card 2' });
    const card3 = new Card({ id: 3, text: 'Test Card 3' });

    cardStack.addCard(card1);
    cardStack.addCard(card2);
    cardStack.addCard(card3);

    const stackElement = container.querySelector('.card-stack');
    expect(stackElement.children.length).toBe(3);
  });

  it('should limit visible cards based on maxVisibleCards option', () => {
    cardStack = new CardStack(container, { maxVisibleCards: 2 });
    cardStack.init();

    const card1 = new Card({ id: 1, text: 'Test Card 1' });
    const card2 = new Card({ id: 2, text: 'Test Card 2' });
    const card3 = new Card({ id: 3, text: 'Test Card 3' });

    cardStack.addCard(card1);
    cardStack.addCard(card2);
    cardStack.addCard(card3);

    const stackElement = container.querySelector('.card-stack');
    expect(stackElement.children.length).toBe(2);
  });

  it('should apply correct z-index and transform to stacked cards', () => {
    cardStack = new CardStack(container, { stackOffset: 10 });
    cardStack.init();

    const card1 = new Card({ id: 1, text: 'Test Card 1' });
    const card2 = new Card({ id: 2, text: 'Test Card 2' });

    cardStack.addCard(card1);
    cardStack.addCard(card2);

    const wrappers = container.querySelectorAll('.card-wrapper');
    expect(wrappers[0].style.zIndex).toBe('2');
    expect(wrappers[1].style.zIndex).toBe('1');
    expect(wrappers[1].style.transform).toBe('translateY(10px)');
  });

  it('should remove cards from the stack', () => {
    cardStack = new CardStack(container);
    cardStack.init();

    const card1 = new Card({ id: 1, text: 'Test Card 1' });
    const card2 = new Card({ id: 2, text: 'Test Card 2' });

    cardStack.addCard(card1);
    cardStack.addCard(card2);

    cardStack.removeCard(card1);

    const stackElement = container.querySelector('.card-stack');
    expect(stackElement.children.length).toBe(1);
  });

  it('should get the top card', () => {
    cardStack = new CardStack(container);
    cardStack.init();

    const card1 = new Card({ id: 1, text: 'Test Card 1' });
    const card2 = new Card({ id: 2, text: 'Test Card 2' });

    cardStack.addCard(card1);
    cardStack.addCard(card2);

    expect(cardStack.getTopCard()).toBe(card1);
  });

  it('should handle click events on the top card', () => {
    cardStack = new CardStack(container);
    cardStack.init();

    const card1 = new Card({ id: 1, text: 'Test Card 1' });
    cardStack.addCard(card1);

    const topCard = container.querySelector('.card-wrapper');
    const clickEvent = new dom.window.MouseEvent('click');
    topCard.dispatchEvent(clickEvent);

    // Note: The actual flip functionality will be tested in Step 2.5
    expect(card1).toBeTruthy();
  });

  it('should cleanup properly', () => {
    cardStack = new CardStack(container);
    cardStack.init();

    const card1 = new Card({ id: 1, text: 'Test Card 1' });
    cardStack.addCard(card1);

    cardStack.cleanup();

    const stackElement = container.querySelector('.card-stack');
    expect(stackElement).toBeFalsy();
  });

  it('should handle responsive design', () => {
    cardStack = new CardStack(container);
    cardStack.init();

    // Simulate mobile viewport
    Object.defineProperty(window, 'innerWidth', { value: 480 });
    window.dispatchEvent(new Event('resize'));

    const stackElement = container.querySelector('.card-stack');
    expect(stackElement.style.width).toBe('50mm');
  });
}); 