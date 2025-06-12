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
    const main = document.querySelector('main');
    main.innerHTML = `
      <div class="edit-cards-page">
        <h1>Edit Cards</h1>
        <div class="edit-cards-content">
          <div class="add-card-section">
            <h2>Add New Card</h2>
            <div id="addCardForm"></div>
          </div>
          <div class="cards-list-section">
            <h2>All Cards</h2>
            <div id="searchAndTable"></div>
          </div>
        </div>
      </div>
    `;
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
      onSubmit: (data) => {
        this.cardService.addCard(data);
        this.table.render();
      }
    });
  }

  handleEditCard(id) {
    const card = this.cardService.getCard(id);
    if (!card) return;

    const editForm = new EditCardForm({
      card,
      onSubmit: (data) => {
        this.cardService.updateCard(id, data);
        this.table.render();
        editForm.cleanup();
      },
      onCancel: () => editForm.cleanup()
    });
  }

  handleDeleteCard(id) {
    const card = this.cardService.getCard(id);
    if (!card) return;

    const deleteDialog = new DeleteConfirmation({
      card,
      onConfirm: () => {
        this.cardService.deleteCard(id);
        this.table.render();
        deleteDialog.cleanup();
      },
      onCancel: () => deleteDialog.cleanup()
    });
  }

  cleanup() {
    this.searchBar?.cleanup();
    this.table?.cleanup();
    this.addForm?.cleanup();
  }
} 