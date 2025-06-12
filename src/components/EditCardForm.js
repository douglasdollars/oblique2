import { AddCardForm } from './AddCardForm';

export class EditCardForm extends AddCardForm {
  constructor(options = {}) {
    super({
      ...options,
      onSubmit: (data) => {
        if (this.validateForm()) {
          this.options.onUpdate?.(this.cardId, data);
          this.cleanup();
        }
      }
    });
    this.cardId = options.cardId;
    this.loadCardData(options.cardData);
  }

  loadCardData(cardData) {
    if (!cardData) return;
    
    this.formData = {
      text: cardData.text || '',
      editions: [...(cardData.editions || [])],
      notes: cardData.notes || '',
      imageUrl: cardData.imageUrl || ''
    };
    this.render();
  }

  render() {
    const form = document.createElement('form');
    form.className = 'edit-card-form';
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
        <button type="button" class="btn btn-secondary" data-action="cancel">Cancel</button>
        <button type="submit" class="btn btn-primary">Update Card</button>
      </div>
    `;

    // Replace existing form if it exists
    const existingForm = document.querySelector('.edit-card-form');
    if (existingForm) {
      existingForm.replaceWith(form);
    } else {
      document.querySelector('.edit-cards-content').appendChild(form);
    }

    this.element = form;
  }

  attachEventListeners() {
    super.attachEventListeners();

    // Add cancel button handler
    const cancelButton = this.element.querySelector('[data-action="cancel"]');
    cancelButton.addEventListener('click', () => {
      this.options.onCancel?.();
      this.cleanup();
    });

    // Add form field change tracking
    this.element.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => {
        const name = input.name;
        if (name && name in this.formData) {
          this.formData[name] = input.value;
        }
      });
    });
  }

  cleanup() {
    if (this.element) {
      this.element.remove();
    }
  }
} 