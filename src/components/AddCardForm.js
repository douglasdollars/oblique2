import { TagInput } from './TagInput.js';

export class AddCardForm {
  constructor(options = {}) {
    this.options = {
      onSubmit: () => {},
      ...options
    };
    this.formData = {
      text: '',
      editions: [],
      notes: '',
      imageUrl: ''
    };
    this.errors = {};
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const form = document.createElement('form');
    form.className = 'add-card-form';
    form.setAttribute('novalidate', '');

    form.innerHTML = `
      <div class="form-group ${this.errors.text ? 'has-error' : ''}">
        <label class="form-label" for="cardText">Card Text *</label>
        <textarea
          id="cardText"
          class="form-input"
          name="text"
          required
          rows="3"
          placeholder="Enter the card text"
          aria-describedby="textError"
        >${this.formData.text}</textarea>
        ${this.errors.text ? `
          <span class="error-message" id="textError">${this.errors.text}</span>
        ` : ''}
      </div>

      <div class="form-group ${this.errors.editions ? 'has-error' : ''}">
        <label class="form-label" for="cardEditions">Editions *</label>
        <div id="editionsInput"></div>
        ${this.errors.editions ? `
          <span class="error-message" id="editionsError">${this.errors.editions}</span>
        ` : ''}
      </div>

      <div class="form-group">
        <label class="form-label" for="cardNotes">Notes</label>
        <textarea
          id="cardNotes"
          class="form-input"
          name="notes"
          rows="2"
          placeholder="Optional notes about the card"
        >${this.formData.notes}</textarea>
      </div>

      <div class="form-group ${this.errors.imageUrl ? 'has-error' : ''}">
        <label class="form-label" for="cardImageUrl">Imagery URL</label>
        <input
          type="url"
          id="cardImageUrl"
          class="form-input"
          name="imageUrl"
          placeholder="Optional URL for card imagery"
          value="${this.formData.imageUrl}"
          aria-describedby="imageUrlError"
        />
        ${this.errors.imageUrl ? `
          <span class="error-message" id="imageUrlError">${this.errors.imageUrl}</span>
        ` : ''}
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-button">Add Card</button>
      </div>
    `;

    // Replace existing form if it exists
    const existingForm = document.querySelector('.add-card-form');
    if (existingForm) {
      existingForm.replaceWith(form);
    } else {
      document.querySelector('#addCardForm').appendChild(form);
    }

    this.element = form;

    // Initialize TagInput
    this.tagInput = new TagInput({
      initialTags: this.formData.editions,
      placeholder: 'Type and press Enter to add editions',
      onChange: (tags) => {
        this.formData.editions = tags;
        this.validateField('editions');
      }
    });
  }

  attachEventListeners() {
    if (!this.element) return;

    // Form submission
    this.element.addEventListener('submit', (event) => {
      event.preventDefault();
      if (this.validateForm()) {
        this.options.onSubmit(this.formData);
        this.resetForm();
      }
    });

    // Real-time validation
    this.element.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input.name);
      });

      input.addEventListener('input', () => {
        this.formData[input.name] = input.value;
      });
    });
  }

  validateForm() {
    let isValid = true;

    // Validate text
    if (!this.formData.text.trim()) {
      this.errors.text = 'Card text is required';
      isValid = false;
    } else {
      delete this.errors.text;
    }

    // Validate editions
    if (!this.formData.editions.length) {
      this.errors.editions = 'At least one edition is required';
      isValid = false;
    } else {
      delete this.errors.editions;
    }

    // Validate imageUrl if provided
    if (this.formData.imageUrl && !this.isValidUrl(this.formData.imageUrl)) {
      this.errors.imageUrl = 'Please enter a valid URL';
      isValid = false;
    } else {
      delete this.errors.imageUrl;
    }

    this.render();
    return isValid;
  }

  validateField(field) {
    switch (field) {
      case 'text':
        if (!this.formData.text.trim()) {
          this.errors.text = 'Card text is required';
        } else {
          delete this.errors.text;
        }
        break;
      case 'editions':
        if (!this.formData.editions.length) {
          this.errors.editions = 'At least one edition is required';
        } else {
          delete this.errors.editions;
        }
        break;
      case 'imageUrl':
        if (this.formData.imageUrl && !this.isValidUrl(this.formData.imageUrl)) {
          this.errors.imageUrl = 'Please enter a valid URL';
        } else {
          delete this.errors.imageUrl;
        }
        break;
    }
    this.render();
  }

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  resetForm() {
    this.formData = {
      text: '',
      editions: [],
      notes: '',
      imageUrl: ''
    };
    this.errors = {};
    this.render();
  }

  cleanup() {
    this.tagInput?.cleanup();
    if (this.element) {
      this.element.remove();
    }
  }
} 