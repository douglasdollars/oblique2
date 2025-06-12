import { AddCardForm } from './AddCardForm.js';
import { TagInput } from './TagInput.js';

export class EditCardForm extends AddCardForm {
  constructor(options = {}) {
    super({
      ...options,
      onSubmit: (data) => {
        if (options.onSubmit) {
          options.onSubmit({ ...data, id: options.card.id });
        }
      }
    });

    this.formData = {
      text: options.card?.text || '',
      editions: options.card?.editions || [],
      notes: options.card?.notes || '',
      imageUrl: options.card?.imageUrl || ''
    };
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
        <button type="submit" class="submit-button">Save Changes</button>
        <button type="button" class="cancel-button">Cancel</button>
      </div>
    `;

    // Replace existing form if it exists
    const existingForm = document.querySelector('.edit-card-form');
    if (existingForm) {
      existingForm.replaceWith(form);
    } else {
      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';
      modalContent.appendChild(form);

      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.appendChild(modalContent);

      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('visible'), 10);
    }

    this.element = form;
    this.modal = this.element.closest('.modal');

    // Initialize TagInput
    this.tagInput = new TagInput({
      initialTags: this.formData.editions,
      placeholder: 'Type and press Enter to add editions',
      onChange: (tags) => {
        this.formData.editions = tags;
        this.validateField('editions');
      }
    });

    // Add cancel button handler
    const cancelButton = this.element.querySelector('.cancel-button');
    if (cancelButton) {
      cancelButton.addEventListener('click', () => {
        if (this.options.onCancel) {
          this.options.onCancel();
        }
      });
    }

    // Add modal close on outside click
    if (this.modal) {
      this.modal.addEventListener('click', (event) => {
        if (event.target === this.modal) {
          if (this.options.onCancel) {
            this.options.onCancel();
          }
        }
      });
    }
  }

  cleanup() {
    super.cleanup();
    if (this.modal) {
      this.modal.classList.remove('visible');
      setTimeout(() => this.modal.remove(), 300);
    }
  }
} 