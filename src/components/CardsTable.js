import { SortingUtils } from '../utils/SortingUtils.js';
import { Pagination } from './Pagination.js';

export class CardsTable {
  constructor(options = {}) {
    this.options = {
      columns: [
        { id: 'text', label: 'Card Text', sortable: true },
        { id: 'editions', label: 'Edition', sortable: true },
        { id: 'notes', label: 'Notes', sortable: true },
        { id: 'imageUrl', label: 'Imagery URL', sortable: true },
        { id: 'actions', label: 'Actions', sortable: false }
      ],
      data: [],
      onEdit: () => {},
      onDelete: () => {},
      itemsPerPage: 25,
      ...options
    };
    this.sortConfig = {
      column: null,
      direction: null
    };
    this.searchTerm = '';
    this.currentPage = this.getInitialPage();
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'table-container';
    
    const filteredData = this.getFilteredData();
    const sortedData = SortingUtils.sortData(filteredData, this.sortConfig);
    const paginatedData = this.getPaginatedData(sortedData);

    container.innerHTML = `
      <table class="cards-table">
        <thead>
          <tr>
            ${this.options.columns.map(column => `
              <th class="${column.sortable ? 'sortable' : ''}" data-column="${column.id}">
                ${column.label}
                ${column.sortable ? `
                  <span class="sort-indicator" aria-hidden="true">
                    ${this.sortConfig.column === column.id ? 
                      SortingUtils.getSortIndicator(this.sortConfig.direction) : ''}
                  </span>
                ` : ''}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${paginatedData.length ? paginatedData.map(card => `
            <tr>
              <td>${this.highlightSearchTerm(card.text)}</td>
              <td>${this.renderEditions(card.editions)}</td>
              <td>${this.highlightSearchTerm(card.notes || '')}</td>
              <td>${card.imageUrl ? `<a href="${card.imageUrl}" target="_blank" rel="noopener noreferrer">${card.imageUrl}</a>` : ''}</td>
              <td class="actions">
                <button type="button" class="edit-button" data-id="${card.id}">Edit</button>
                <button type="button" class="delete-button" data-id="${card.id}">Delete</button>
              </td>
            </tr>
          `).join('') : `
            <tr>
              <td colspan="${this.options.columns.length}" class="no-data">
                ${this.searchTerm ? 'No cards match your search.' : 'No cards available.'}
              </td>
            </tr>
          `}
        </tbody>
      </table>
    `;

    // Replace existing table if it exists
    const existingTable = document.querySelector('.table-container');
    if (existingTable) {
      existingTable.replaceWith(container);
    }

    this.element = container;

    // Initialize pagination
    if (this.pagination) {
      this.pagination.cleanup();
    }
    this.pagination = new Pagination({
      totalItems: filteredData.length,
      itemsPerPage: this.options.itemsPerPage,
      currentPage: this.currentPage,
      onPageChange: (page) => {
        this.currentPage = page;
        this.render();
      }
    });
  }

  attachEventListeners() {
    if (!this.element) return;

    // Add sort handling
    this.element.querySelectorAll('th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const column = th.dataset.column;
        this.handleSort(column);
      });
    });

    // Add edit button handling
    this.element.querySelectorAll('.edit-button').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.id;
        this.options.onEdit(id);
      });
    });

    // Add delete button handling
    this.element.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.id;
        this.options.onDelete(id);
      });
    });
  }

  handleSort(column) {
    if (this.sortConfig.column === column) {
      this.sortConfig.direction = SortingUtils.getNextSortDirection(this.sortConfig.direction);
      if (!this.sortConfig.direction) {
        this.sortConfig.column = null;
      }
    } else {
      this.sortConfig.column = column;
      this.sortConfig.direction = 'asc';
    }
    this.render();
  }

  getFilteredData() {
    if (!this.searchTerm) return this.options.data;

    const searchTerm = this.searchTerm.toLowerCase();
    return this.options.data.filter(card => {
      const text = (card.text || '').toLowerCase();
      const notes = (card.notes || '').toLowerCase();
      const editions = (card.editions || []).join(' ').toLowerCase();

      return text.includes(searchTerm) ||
             notes.includes(searchTerm) ||
             editions.includes(searchTerm);
    });
  }

  getPaginatedData(data) {
    const start = (this.currentPage - 1) * this.options.itemsPerPage;
    const end = start + this.options.itemsPerPage;
    return data.slice(start, end);
  }

  getInitialPage() {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page'), 10);
    return !isNaN(page) && page > 0 ? page : 1;
  }

  setSearchTerm(term) {
    this.searchTerm = term;
    this.currentPage = 1; // Reset to first page on search
    this.render();
    return this.getFilteredData().length;
  }

  highlightSearchTerm(text) {
    if (!this.searchTerm || !text) return text;

    const escapedSearchTerm = this.searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  renderEditions(editions) {
    if (!editions || !editions.length) return '';
    return editions.map(edition => `
      <span class="edition-tag">${this.highlightSearchTerm(edition)}</span>
    `).join('');
  }

  cleanup() {
    this.pagination?.cleanup();
    if (this.element) {
      this.element.remove();
    }
  }
} 