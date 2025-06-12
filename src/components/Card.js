export class Card {
  constructor(data = {}) {
    this.data = {
      id: data.id || '',
      text: data.text || '',
      editions: data.editions || [],
      notes: data.notes || '',
      imageUrl: data.imageUrl || ''
    };
    this.isFlipped = false;
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', 'Oblique Strategy Card');

    card.innerHTML = `
      <div class="card-inner ${this.isFlipped ? 'is-flipped' : ''}">
        <div class="card-face card-front">
          <div class="card-content">
            <p class="card-text">${this.data.text}</p>
          </div>
        </div>
        <div class="card-face card-back">
          <div class="card-content">
            <div class="card-editions">
              ${this.data.editions.map(edition => `
                <span class="edition-tag">${edition}</span>
              `).join('')}
            </div>
            ${this.data.notes ? `
              <div class="card-notes">
                <p>${this.data.notes}</p>
              </div>
            ` : ''}
            ${this.data.imageUrl ? `
              <div class="card-image">
                <img src="${this.data.imageUrl}" alt="Card illustration" />
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    // Replace existing card if it exists
    const existingCard = document.querySelector('.card');
    if (existingCard) {
      existingCard.replaceWith(card);
    } else {
      document.querySelector('main').appendChild(card);
    }

    this.element = card;
  }

  attachEventListeners() {
    if (this.element) {
      this.element.addEventListener('click', () => this.flip());
    }
  }

  flip() {
    this.isFlipped = !this.isFlipped;
    this.render();
  }

  update(data) {
    this.data = { ...this.data, ...data };
    this.render();
  }

  getData() {
    return { ...this.data };
  }

  cleanup() {
    if (this.element) {
      this.element.remove();
    }
  }
} 