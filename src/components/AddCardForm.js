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
        <div class="tag-input-container">
          <input
            id="cardEditions"
            class="form-input tag-input"
            type="text"
            placeholder="Type and press Enter to add editions"
            aria-describedby="editionsError"
          />
          <div class="tags-container">
            ${this.formData.editions.map(edition => `
              <span class="tag">
                ${edition}
                <button type="button" class="tag-remove" data-edition="${edition}">×</button>
              </span>
            `).join('')}
          </div>
        </div>
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
        <label class="form-label" for="cardImageUrl">Image URL</label>
        <input
          id="cardImageUrl"
          class="form-input"
          type="url"
          name="imageUrl"
          placeholder="Optional image URL"
          value="${this.formData.imageUrl}"
          aria-describedby="imageUrlError"
        />
        ${this.errors.imageUrl ? `
          <span class="error-message" id="imageUrlError">${this.errors.imageUrl}</span>
        ` : ''}
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Add Card</button>
      </div>
    `;

    // Replace existing form if it exists
    const existingForm = document.querySelector('.add-card-form');
    if (existingForm) {
      existingForm.replaceWith(form);
    } else {
      document.querySelector('.edit-cards-content').appendChild(form);
    }

    this.element = form;
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

    // Tag input handling
    const tagInput = this.element.querySelector('.tag-input');
    tagInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const value = event.target.value.trim();
        if (value && this.validateEdition(value)) {
          this.addEdition(value);
          event.target.value = '';
        }
      }
    });

    // Tag removal
    this.element.addEventListener('click', (event) => {
      const removeButton = event.target.closest('.tag-remove');
      if (removeButton) {
        const edition = removeButton.dataset.edition;
        this.removeEdition(edition);
      }
    });

    // Real-time validation
    this.element.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input.name);
      });
    });
  }

  validateForm() {
    this.errors = {};
    
    // Validate text
    if (!this.formData.text.trim()) {
      this.errors.text = 'Card text is required';
    }

    // Validate editions
    if (this.formData.editions.length === 0) {
      this.errors.editions = 'At least one edition is required';
    }

    // Validate image URL if provided
    if (this.formData.imageUrl && !this.validateUrl(this.formData.imageUrl)) {
      this.errors.imageUrl = 'Please enter a valid URL';
    }

    this.render();
    return Object.keys(this.errors).length === 0;
  }

  validateField(fieldName) {
    switch (fieldName) {
      case 'text':
        if (!this.formData.text.trim()) {
          this.errors.text = 'Card text is required';
        } else {
          delete this.errors.text;
        }
        break;
      case 'imageUrl':
        if (this.formData.imageUrl && !this.validateUrl(this.formData.imageUrl)) {
          this.errors.imageUrl = 'Please enter a valid URL';
        } else {
          delete this.errors.imageUrl;
        }
        break;
    }
    this.render();
  }

  validateEdition(edition) {
    if (!edition) return false;
    if (edition.length > 30) {
      this.errors.editions = 'Edition name must be 30 characters or less';
      this.render();
      return false;
    }
    if (!/^[a-zA-Z0-9\s]+$/.test(edition)) {
      this.errors.editions = 'Edition name can only contain letters, numbers, and spaces';
      this.render();
      return false;
    }
    if (this.formData.editions.includes(edition)) {
      this.errors.editions = 'This edition has already been added';
      this.render();
      return false;
    }
    delete this.errors.editions;
    return true;
  }

  validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  addEdition(edition) {
    this.formData.editions.push(edition);
    delete this.errors.editions;
    this.render();
  }

  removeEdition(edition) {
    this.formData.editions = this.formData.editions.filter(e => e !== edition);
    if (this.formData.editions.length === 0) {
      this.errors.editions = 'At least one edition is required';
    }
    this.render();
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
    if (this.element) {
      this.element.remove();
    }
  }
} 