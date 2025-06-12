import { JSDOM } from 'jsdom';
import { SearchBar } from '../../src/components/SearchBar.js';
import { jest } from '@jest/globals';

describe('SearchBar Component', () => {
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

  it('should render search bar with placeholder', () => {
    const searchBar = new SearchBar({
      placeholder: 'Test placeholder'
    });
    
    const input = document.querySelector('.search-input');
    expect(input.placeholder).toBe('Test placeholder');
  });

  it('should call onSearch with debounce when typing', (done) => {
    const onSearch = jest.fn();
    const searchBar = new SearchBar({
      onSearch,
      debounceMs: 100
    });
    
    const input = document.querySelector('.search-input');
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    
    setTimeout(() => {
      expect(onSearch).toHaveBeenCalledWith('test');
      done();
    }, 150);
  });

  it('should show clear button when input has value', () => {
    const searchBar = new SearchBar();
    const input = document.querySelector('.search-input');
    const clearButton = document.querySelector('.search-clear');
    
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    
    expect(clearButton.classList.contains('visible')).toBe(true);
  });

  it('should clear search when clear button is clicked', () => {
    const onSearch = jest.fn();
    const searchBar = new SearchBar({ onSearch });
    const input = document.querySelector('.search-input');
    const clearButton = document.querySelector('.search-clear');
    
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    clearButton.click();
    
    expect(input.value).toBe('');
    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('should clear search on Escape key', () => {
    const searchBar = new SearchBar();
    const input = document.querySelector('.search-input');
    
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    
    expect(input.value).toBe('');
  });

  it('should update status with result count', () => {
    const searchBar = new SearchBar({
      onSearch: () => 5
    });
    const input = document.querySelector('.search-input');
    const status = document.querySelector('.search-status');
    
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    
    setTimeout(() => {
      expect(status.textContent).toBe('Found 5 cards');
    }, 350);
  });

  it('should handle singular result in status', () => {
    const searchBar = new SearchBar({
      onSearch: () => 1
    });
    const input = document.querySelector('.search-input');
    const status = document.querySelector('.search-status');
    
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    
    setTimeout(() => {
      expect(status.textContent).toBe('Found 1 card');
    }, 350);
  });

  it('should set search term programmatically', () => {
    const searchBar = new SearchBar();
    searchBar.setSearchTerm('test');
    
    const input = document.querySelector('.search-input');
    const clearButton = document.querySelector('.search-clear');
    
    expect(input.value).toBe('test');
    expect(clearButton.classList.contains('visible')).toBe(true);
  });

  it('should focus input when requested', () => {
    const searchBar = new SearchBar();
    const input = document.querySelector('.search-input');
    
    searchBar.focus();
    expect(document.activeElement).toBe(input);
  });

  it('should cleanup properly', () => {
    const searchBar = new SearchBar();
    searchBar.cleanup();
    
    expect(document.querySelector('.search-bar')).toBeNull();
  });
}); 