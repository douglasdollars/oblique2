import { CardsTable } from '../components/CardsTable.js';
import { AddCardForm } from '../components/AddCardForm.js';
import { EditCardForm } from '../components/EditCardForm.js';
import { DeleteConfirmation } from '../components/DeleteConfirmation.js';
import { SearchBar } from '../components/SearchBar.js';
import { CardService } from '../services/CardService.js';

export class EditCardsPage {
  constructor() {
    this.cardService = new CardService();
    this.init();
  }

  init() {
    this.render();
    this.initializeComponents();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'edit-cards-page';
    container.innerHTML = `
      <h1>Edit Cards</h1>
      <div class="search-container"></div>
      <div class="table-container"></div>
      <div class="form-container">
        <h2>Add New Card</h2>
        <div class="add-form-container"></div>
      </div>
    `;

    // Replace existing page if it exists
    const existingPage = document.querySelector('.edit-cards-page');
    if (existingPage) {
      existingPage.replaceWith(container);
    } else {
      document.querySelector('main').appendChild(container);
    }

    this.element = container;
  }

  initializeComponents() {
    // Initialize search bar
    this.searchBar = new SearchBar({
      onSearch: (term) => {
        const count = this.table.setSearchTerm(term);
        this.searchBar.updateResultsCount(count, this.cardService.getCards().length);
      }
    });

    // Initialize table
    this.table = new CardsTable({
      data: this.cardService.getCards(),
      onEdit: (id) => this.handleEditCard(id),
      onDelete: (id) => this.handleDeleteCard(id)
    });

    // Initialize add form
    this.addForm = new AddCardForm({
      onSubmit: async (data) => {
        try {
          await this.table.setLoading(true);
          const newCard = await this.cardService.addCard(data);
          const newData = this.cardService.getCards();
          await this.table.updateData(newData, newCard.id);
        } catch (error) {
          console.error('Failed to add card:', error);
        } finally {
          await this.table.setLoading(false);
        }
      }
    });
  }

  async handleEditCard(id) {
    const card = this.cardService.getCard(id);
    if (!card) return;

    const editForm = new EditCardForm({
      card,
      onSubmit: async (data) => {
        try {
          await this.table.setLoading(true);
          await this.cardService.updateCard(id, data);
          const newData = this.cardService.getCards();
          await this.table.updateData(newData, id);
          editForm.cleanup();
        } catch (error) {
          console.error('Failed to update card:', error);
        } finally {
          await this.table.setLoading(false);
        }
      },
      onCancel: () => editForm.cleanup()
    });
  }

  async handleDeleteCard(id) {
    const card = this.cardService.getCard(id);
    if (!card) return;

    const deleteDialog = new DeleteConfirmation({
      card,
      onConfirm: async () => {
        try {
          await this.cardService.deleteCard(id);
          const newData = this.cardService.getCards();
          await this.table.updateData(newData);
          deleteDialog.cleanup();
        } catch (error) {
          console.error('Failed to delete card:', error);
        }
      },
      onCancel: () => deleteDialog.cleanup()
    });
  }

  cleanup() {
    this.searchBar?.cleanup();
    this.table?.cleanup();
    this.addForm?.cleanup();
    if (this.element) {
      this.element.remove();
    }
  }
} 