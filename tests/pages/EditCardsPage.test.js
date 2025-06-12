import { JSDOM } from 'jsdom';
import { EditCardsPage } from '../../src/pages/EditCardsPage.js';
import { jest } from '@jest/globals';

describe('EditCardsPage', () => {
  let dom;
  let page;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body><main></main></body></html>', { url: 'http://localhost/' });
    global.window = dom.window;
    global.document = dom.window.document;
    page = new EditCardsPage();
  });

  afterEach(() => {
    if (page && page.cleanup) {
      page.cleanup();
    }
    dom.window.close();
  });

  it('should render the Edit Cards page structure', () => {
    page.init();
    const section = document.querySelector('.edit-cards-page');
    expect(section).not.toBeNull();
    expect(section.querySelector('.edit-cards-header h1').textContent).toBe('Edit Cards');
    expect(section.querySelector('.edit-cards-desc')).not.toBeNull();
  });

  it('should clean up the page from the DOM', () => {
    page.init();
    page.cleanup();
    expect(document.querySelector('.edit-cards-page')).toBeNull();
  });
}); 