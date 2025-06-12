import { JSDOM } from 'jsdom';
import { TagInput } from '../../src/components/TagInput.js';
import { jest } from '@jest/globals';

describe('TagInput Component', () => {
  let dom;
  let document;
  let container;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    document = dom.window.document;
    container = document.getElementById('container');
  });

  afterEach(() => {
    dom.window.close();
  });

  it('should render tag input with initial tags', () => {
    const initialTags = ['Edition 1', 'Edition 2'];
    const tagInput = new TagInput(container, { initialTags });
    
    const tags = document.querySelectorAll('.tag');
    expect(tags.length).toBe(2);
    expect(tags[0].textContent).toContain('Edition 1');
  });

  it('should add new tag on Enter key press', () => {
    const tagInput = new TagInput(container);
    const input = document.querySelector('.tag-input');
    
    input.value = 'New Edition';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    
    const tags = document.querySelectorAll('.tag');
    expect(tags.length).toBe(1);
    expect(tags[0].textContent).toContain('New Edition');
  });

  it('should validate tag length (30 chars max)', () => {
    const tagInput = new TagInput(container);
    const input = document.querySelector('.tag-input');
    
    input.value = 'A'.repeat(31);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    
    const tags = document.querySelectorAll('.tag');
    expect(tags.length).toBe(0);
    expect(document.querySelector('.error-message')).toBeTruthy();
  });

  it('should validate tag format (alphanumeric + spaces)', () => {
    const tagInput = new TagInput(container);
    const input = document.querySelector('.tag-input');
    
    input.value = 'Invalid@Tag!';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    
    const tags = document.querySelectorAll('.tag');
    expect(tags.length).toBe(0);
    expect(document.querySelector('.error-message')).toBeTruthy();
  });

  it('should remove tag when delete button clicked', () => {
    const initialTags = ['Edition 1'];
    const tagInput = new TagInput(container, { initialTags });
    
    const deleteButton = document.querySelector('.tag-delete');
    deleteButton.click();
    
    const tags = document.querySelectorAll('.tag');
    expect(tags.length).toBe(0);
  });

  it('should prevent duplicate tags', () => {
    const tagInput = new TagInput(container);
    const input = document.querySelector('.tag-input');
    
    input.value = 'Edition 1';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    input.value = 'Edition 1';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    
    const tags = document.querySelectorAll('.tag');
    expect(tags.length).toBe(1);
  });

  it('should remove last tag on backspace when input is empty', () => {
    const initialTags = ['Edition 1', 'Edition 2'];
    const tagInput = new TagInput(container, { initialTags });
    const input = document.querySelector('.tag-input');
    
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    
    const tags = document.querySelectorAll('.tag');
    expect(tags.length).toBe(1);
    expect(tags[0].textContent).toContain('Edition 1');
  });

  it('should handle focus and blur events', () => {
    const tagInput = new TagInput(container);
    const input = document.querySelector('.tag-input');
    
    input.dispatchEvent(new Event('focus'));
    expect(container.classList.contains('focused')).toBe(true);
    
    input.dispatchEvent(new Event('blur'));
    expect(container.classList.contains('focused')).toBe(false);
  });

  it('should emit change events when tags are modified', () => {
    const onChange = jest.fn();
    const tagInput = new TagInput(container, { onChange });
    const input = document.querySelector('.tag-input');
    
    input.value = 'New Edition';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    
    expect(onChange).toHaveBeenCalledWith(['New Edition']);
  });

  it('should handle keyboard navigation', () => {
    const initialTags = ['Edition 1', 'Edition 2'];
    const tagInput = new TagInput(container, { initialTags });
    const input = document.querySelector('.tag-input');
    
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    const tags = document.querySelectorAll('.tag');
    expect(tags[1].classList.contains('selected')).toBe(true);
  });
}); 