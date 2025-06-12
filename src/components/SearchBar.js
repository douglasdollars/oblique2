import { debounce } from '../utils/debounce.js';

export class SearchBar {
  constructor(options = {}) {
    this.options = {
      placeholder: 'Search cards...',
      debounceMs: 300,
      onSearch: () => {},
      ...options
    };
    this.searchTerm = '';
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'search-bar';
    container.setAttribute('role', 'search');

    container.innerHTML = `
      <div class="search-input-wrapper">
        <input
          type="search"
          class="search-input"
          placeholder="${this.options.placeholder}"
          value="${this.searchTerm}"
          aria-label="Search cards"
        />
        <button
          type="button"
          class="search-clear ${this.searchTerm ? 'visible' : ''}"
          aria-label="Clear search"
        >
          ×
        </button>
      </div>
      <div class="search-status" role="status" aria-live="polite"></div>
    `;

    // Replace existing search bar if it exists
    const existingSearchBar = document.querySelector('.search-bar');
    if (existingSearchBar) {
      existingSearchBar.replaceWith(container);
    }

    this.element = container;
    this.input = container.querySelector('.search-input');
    this.clearButton = container.querySelector('.search-clear');
    this.status = container.querySelector('.search-status');
  }

  attachEventListeners() {
    if (!this.element) return;

    // Debounced search handler
    const debouncedSearch = debounce((value) => {
      this.searchTerm = value;
      const resultCount = this.options.onSearch(value);
      this.updateStatus(resultCount);
    }, this.options.debounceMs);

    // Input handler
    this.input.addEventListener('input', (event) => {
      const value = event.target.value.trim();
      this.clearButton.classList.toggle('visible', value.length > 0);
      debouncedSearch(value);
    });

    // Clear button handler
    this.clearButton.addEventListener('click', () => {
      this.input.value = '';
      this.clearButton.classList.remove('visible');
      this.searchTerm = '';
      const resultCount = this.options.onSearch('');
      this.updateStatus(resultCount);
      this.input.focus();
    });

    // Keyboard shortcuts
    this.input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (this.input.value) {
          event.preventDefault();
          this.clearButton.click();
        }
      }
    });
  }

  updateStatus(resultCount) {
    if (!this.searchTerm) {
      this.status.textContent = '';
      return;
    }

    this.status.textContent = `Found ${resultCount} ${resultCount === 1 ? 'card' : 'cards'}`;
  }

  getSearchTerm() {
    return this.searchTerm;
  }

  setSearchTerm(term) {
    this.searchTerm = term;
    this.input.value = term;
    this.clearButton.classList.toggle('visible', term.length > 0);
    this.render();
  }

  focus() {
    this.input.focus();
  }

  cleanup() {
    if (this.element) {
      this.element.remove();
    }
  }
} 