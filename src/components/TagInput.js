import { EditionService } from '../services/EditionService.js';

export class TagInput {
  constructor(options = {}) {
    this.options = {
      onChange: () => {},
      maxLength: 30,
      placeholder: 'Type and press Enter to add',
      initialTags: [],
      ...options
    };
    this.tags = [...this.options.initialTags];
    this.editionService = new EditionService();
    this.suggestions = [];
    this.selectedSuggestionIndex = -1;
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'tag-input-container';
    
    container.innerHTML = `
      <div class="tag-input-wrapper">
        <div class="tags-list" role="list">
          ${this.renderTags()}
        </div>
        <input
          type="text"
          class="tag-input"
          placeholder="${this.options.placeholder}"
          maxlength="${this.options.maxLength}"
          aria-label="Add new edition tag"
          role="combobox"
          aria-expanded="false"
          aria-controls="tagSuggestions"
          aria-autocomplete="list"
        />
      </div>
      <div id="tagSuggestions" class="tag-suggestions" role="listbox" aria-label="Edition suggestions">
        ${this.renderSuggestions()}
      </div>
      <div class="tag-input-error" role="alert"></div>
    `;

    // Replace existing container if it exists
    const existingContainer = document.querySelector('.tag-input-container');
    if (existingContainer) {
      existingContainer.replaceWith(container);
    }

    this.element = container;
    this.input = container.querySelector('.tag-input');
    this.tagsList = container.querySelector('.tags-list');
    this.suggestionsContainer = container.querySelector('.tag-suggestions');
    this.errorDisplay = container.querySelector('.tag-input-error');
  }

  renderTags() {
    return this.tags.map(tag => `
      <span class="tag" role="listitem">
        ${this.escapeHtml(tag)}
        <button
          type="button"
          class="tag-remove"
          data-tag="${this.escapeHtml(tag)}"
          aria-label="Remove ${this.escapeHtml(tag)}"
        >×</button>
      </span>
    `).join('');
  }

  renderSuggestions() {
    if (!this.suggestions.length) return '';

    return this.suggestions.map((suggestion, index) => `
      <div
        class="tag-suggestion ${index === this.selectedSuggestionIndex ? 'selected' : ''}"
        role="option"
        aria-selected="${index === this.selectedSuggestionIndex}"
        data-suggestion="${this.escapeHtml(suggestion)}"
      >
        ${this.escapeHtml(suggestion)}
      </div>
    `).join('');
  }

  attachEventListeners() {
    // Add tag on Enter or suggestion click
    this.input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (this.selectedSuggestionIndex >= 0) {
          this.addTag(this.suggestions[this.selectedSuggestionIndex]);
        } else {
          this.addTag();
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.selectNextSuggestion();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.selectPreviousSuggestion();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        this.clearSuggestions();
      } else if (event.key === 'Backspace' && !this.input.value && this.tags.length > 0) {
        this.removeTag(this.tags[this.tags.length - 1]);
      }
    });

    // Update suggestions on input
    this.input.addEventListener('input', () => {
      this.clearError();
      this.updateSuggestions();
    });

    // Remove tag on click
    this.tagsList.addEventListener('click', (event) => {
      const removeButton = event.target.closest('.tag-remove');
      if (removeButton) {
        const tag = removeButton.dataset.tag;
        this.removeTag(tag);
      }
    });

    // Add tag on suggestion click
    this.suggestionsContainer.addEventListener('click', (event) => {
      const suggestion = event.target.closest('.tag-suggestion');
      if (suggestion) {
        this.addTag(suggestion.dataset.suggestion);
      }
    });

    // Handle suggestion hover
    this.suggestionsContainer.addEventListener('mouseover', (event) => {
      const suggestion = event.target.closest('.tag-suggestion');
      if (suggestion) {
        const index = Array.from(this.suggestionsContainer.children).indexOf(suggestion);
        this.selectedSuggestionIndex = index;
        this.render();
      }
    });

    // Clear suggestions on blur (with delay to allow click handling)
    this.input.addEventListener('blur', () => {
      setTimeout(() => {
        this.clearSuggestions();
      }, 200);
    });
  }

  updateSuggestions() {
    const value = this.input.value.trim();
    if (!value) {
      this.suggestions = this.editionService.getPopularEditions();
    } else {
      this.suggestions = this.editionService.searchEditions(value);
    }
    this.selectedSuggestionIndex = -1;
    this.input.setAttribute('aria-expanded', 'true');
    this.render();
  }

  clearSuggestions() {
    this.suggestions = [];
    this.selectedSuggestionIndex = -1;
    this.input.setAttribute('aria-expanded', 'false');
    this.render();
  }

  selectNextSuggestion() {
    if (this.suggestions.length === 0) return;
    this.selectedSuggestionIndex = (this.selectedSuggestionIndex + 1) % this.suggestions.length;
    this.render();
  }

  selectPreviousSuggestion() {
    if (this.suggestions.length === 0) return;
    this.selectedSuggestionIndex = this.selectedSuggestionIndex <= 0 ?
      this.suggestions.length - 1 :
      this.selectedSuggestionIndex - 1;
    this.render();
  }

  addTag(value = null) {
    const tagValue = (value || this.input.value).trim();
    if (!tagValue) return;

    if (!this.validateTag(tagValue)) return;

    if (this.tags.includes(tagValue)) {
      this.showError('This edition has already been added');
      return;
    }

    this.tags.push(tagValue);
    this.input.value = '';
    this.clearSuggestions();
    this.render();
    this.options.onChange(this.tags);
  }

  removeTag(tag) {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
      this.render();
      this.options.onChange(this.tags);
    }
  }

  validateTag(tag) {
    if (tag.length > this.options.maxLength) {
      this.showError(`Edition name must be ${this.options.maxLength} characters or less`);
      return false;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(tag)) {
      this.showError('Edition name can only contain letters, numbers, and spaces');
      return false;
    }

    return true;
  }

  showError(message) {
    this.errorDisplay.textContent = message;
    this.errorDisplay.classList.add('visible');
  }

  clearError() {
    this.errorDisplay.textContent = '';
    this.errorDisplay.classList.remove('visible');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  getTags() {
    return [...this.tags];
  }

  setTags(tags) {
    this.tags = [...tags];
    this.render();
  }

  cleanup() {
    if (this.element) {
      this.element.remove();
    }
  }
} 