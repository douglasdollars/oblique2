export class EditCardsPage {
  constructor() {
    this.element = null;
  }

  init() {
    this.render();
  }

  render() {
    const container = document.createElement('section');
    container.className = 'edit-cards-page';
    container.innerHTML = `
      <header class="edit-cards-header">
        <h1>Edit Cards</h1>
      </header>
      <main class="edit-cards-main" tabindex="-1">
        <div class="edit-cards-content">
          <p class="edit-cards-desc">Manage your Oblique Strategies cards here. (Table and forms coming soon.)</p>
        </div>
      </main>
    `;
    this.element = container;
    document.querySelector('main').innerHTML = '';
    document.querySelector('main').appendChild(container);
  }

  cleanup() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
} 