import { SortingUtils } from '../utils/SortingUtils.js';
import { Pagination } from './Pagination.js';
import { TableAnimations } from '../animations/TableAnimations.js';
import { KeyboardService } from '../services/KeyboardService.js';
import { SearchBar } from './SearchBar.js';

export class CardsTable {
  constructor(options = {}) {
    this.options = {
      columns: [
        { id: 'select', label: '', sortable: false, width: '40px' },
        { id: 'text', label: 'Card Text', sortable: true },
        { id: 'editions', label: 'Edition', sortable: true },
        { id: 'notes', label: 'Notes', sortable: true },
        { id: 'imageUrl', label: 'Imagery URL', sortable: true },
        { id: 'actions', label: 'Actions', sortable: false }
      ],
      data: [],
      onEdit: () => {},
      onDelete: () => {},
      onBulkAction: () => {},
      itemsPerPage: 25,
      ...options
    };
    this.selectedRows = new Set();
    this.sortConfig = {
      column: null,
      direction: null
    };
    this.searchTerm = '';
    this.currentPage = this.getInitialPage();
    this.isLoading = false;
    this.keyboardService = new KeyboardService({
      onTableKeyPress: this.handleKeyboardShortcut.bind(this)
    });
    this.init();
  }

  init() {
    this.searchBar = new SearchBar({
      onSearch: (term) => {
        this.searchTerm = term;
        this.currentPage = 1; // Reset to first page on search
        this.render();
        return this.getFilteredData().length;
      }
    });
    this.render();
    this.attachEventListeners();
  }

  async setLoading(loading) {
    this.isLoading = loading;
    const container = this.element;
    if (!container) return;

    let indicator = container.querySelector('.loading-indicator');
    
    if (loading) {
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'loading-indicator';
        container.appendChild(indicator);
      }
      await TableAnimations.fadeIn(indicator);
    } else if (indicator) {
      await TableAnimations.fadeOut(indicator);
      indicator.remove();
    }
  }

  async updateData(newData, highlightId = null) {
    const oldData = this.options.data;
    this.options.data = newData;

    // If we're highlighting a specific row, find its position
    let highlightIndex = -1;
    if (highlightId) {
      highlightIndex = newData.findIndex(item => item.id === highlightId);
    }

    await this.renderWithAnimation(oldData, newData, highlightIndex);
  }

  async renderWithAnimation(oldData, newData, highlightIndex = -1) {
    const tbody = this.element.querySelector('tbody');
    if (!tbody) return;

    const filteredOldData = this.getFilteredData(oldData);
    const filteredNewData = this.getFilteredData(newData);
    const sortedOldData = SortingUtils.sortData(filteredOldData, this.sortConfig);
    const sortedNewData = SortingUtils.sortData(filteredNewData, this.sortConfig);
    
    const paginatedOldData = this.getPaginatedData(sortedOldData);
    const paginatedNewData = this.getPaginatedData(sortedNewData);

    // Animate out old rows that are being removed or updated
    const promises = [];
    tbody.querySelectorAll('tr').forEach((row, index) => {
      if (index >= paginatedNewData.length || 
          JSON.stringify(paginatedOldData[index]) !== JSON.stringify(paginatedNewData[index])) {
        promises.push(TableAnimations.slideOut(row));
      }
    });
    await Promise.all(promises);

    // Update the table content
    this.render();

    // Animate in new rows and highlight if needed
    const newRows = tbody.querySelectorAll('tr');
    const animationPromises = [];

    newRows.forEach((row, index) => {
      if (index >= paginatedOldData.length || 
          JSON.stringify(paginatedOldData[index]) !== JSON.stringify(paginatedNewData[index])) {
        animationPromises.push(TableAnimations.slideIn(row));
      }
      
      // If this is the highlighted row, add the highlight effect
      if (index === highlightIndex) {
        animationPromises.push(TableAnimations.highlightRow(row, 'success'));
      }
    });

    await Promise.all(animationPromises);
  }

  render() {
    const container = document.createElement('div');
    container.className = 'table-container';
    
    // Add keyboard shortcut help
    const helpText = document.createElement('div');
    helpText.className = 'keyboard-shortcuts-help';
    helpText.innerHTML = `
      <details>
        <summary>Keyboard Shortcuts</summary>
        <ul>
          <li><kbd>Ctrl/⌘</kbd> + <kbd>A</kbd> - Select all cards</li>
          <li><kbd>Esc</kbd> - Clear selection</li>
          <li><kbd>Delete</kbd> - Delete focused card</li>
          <li><kbd>Shift</kbd> + <kbd>Delete</kbd> - Delete selected cards</li>
          <li><kbd>Shift</kbd> + <kbd>↑/↓</kbd> - Select previous/next card</li>
          <li><kbd>Enter</kbd> - Edit focused card</li>
          <li><kbd>Ctrl/⌘</kbd> + <kbd>E</kbd> - Export selected cards</li>
        </ul>
      </details>
    `;
    container.appendChild(helpText);

    // Add bulk actions toolbar
    const bulkActions = document.createElement('div');
    bulkActions.className = 'bulk-actions hidden';
    bulkActions.innerHTML = `
      <span><span class="selected-count">0</span> items selected</span>
      <button class="bulk-delete" title="Delete selected cards">Delete Selected</button>
      <button class="bulk-export" title="Export selected cards">Export Selected</button>
    `;

    // Add event listeners for bulk actions
    bulkActions.querySelector('.bulk-delete').addEventListener('click', () => 
      this.executeBulkAction('delete')
    );
    bulkActions.querySelector('.bulk-export').addEventListener('click', () => 
      this.executeBulkAction('export')
    );

    container.appendChild(bulkActions);

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
            <tr data-id="${card.id}">
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

    // Restore loading state if needed
    if (this.isLoading) {
      this.setLoading(true);
    }
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
      button.addEventListener('click', async () => {
        const id = button.dataset.id;
        const row = button.closest('tr');
        
        try {
          await this.options.onEdit(id);
          await TableAnimations.highlightRow(row, 'success');
        } catch (error) {
          await TableAnimations.highlightRow(row, 'error');
        }
      });
    });

    // Add delete button handling
    this.element.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.dataset.id;
        const row = button.closest('tr');
        
        try {
          await TableAnimations.slideOut(row);
          await this.options.onDelete(id);
        } catch (error) {
          await TableAnimations.slideIn(row);
          await TableAnimations.highlightRow(row, 'error');
        }
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

  getFilteredData(data = this.options.data) {
    if (!this.searchTerm) return data;

    const searchTerm = this.searchTerm.toLowerCase();
    return data.filter(card => {
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

  renderEditions(editions) {
    if (!editions || !editions.length) return '';
    return editions.map(edition => `
      <span class="edition-tag">${this.highlightSearchTerm(edition)}</span>
    `).join('');
  }

  highlightSearchTerm(text) {
    if (!text || !this.searchTerm) return text;
    
    const escapedTerm = this.searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedTerm})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  }

  cleanup() {
    this.pagination?.cleanup();
    this.keyboardService.destroy();
    if (this.element) {
      this.element.remove();
    }
  }

  // Add selection methods
  toggleRowSelection(rowId) {
    if (this.selectedRows.has(rowId)) {
      this.selectedRows.delete(rowId);
    } else {
      this.selectedRows.add(rowId);
    }
    this.updateBulkActionState();
  }

  toggleAllSelection() {
    const currentPageData = this.getCurrentPageData();
    if (this.selectedRows.size === currentPageData.length) {
      currentPageData.forEach(row => this.selectedRows.delete(row.id));
    } else {
      currentPageData.forEach(row => this.selectedRows.add(row.id));
    }
    this.updateBulkActionState();
  }

  updateBulkActionState() {
    const bulkActions = document.querySelector('.bulk-actions');
    if (!bulkActions) return;

    if (this.selectedRows.size > 0) {
      bulkActions.classList.remove('hidden');
      bulkActions.querySelector('.selected-count').textContent = this.selectedRows.size;
    } else {
      bulkActions.classList.add('hidden');
    }
  }

  // Add bulk action methods
  async executeBulkAction(action) {
    const selectedCards = Array.from(this.selectedRows).map(id => 
      this.options.data.find(card => card.id === id)
    ).filter(Boolean);

    try {
      await this.options.onBulkAction(action, selectedCards);
      await TableAnimations.highlightRows(
        Array.from(this.selectedRows),
        'success'
      );
      this.selectedRows.clear();
      this.updateBulkActionState();
    } catch (error) {
      await TableAnimations.highlightRows(
        Array.from(this.selectedRows),
        'error'
      );
      console.error('Bulk action failed:', error);
    }
  }

  handleKeyboardShortcut(action) {
    switch (action) {
      case 'selectAll':
        this.toggleAllSelection();
        break;
      case 'clearSelection':
        this.selectedRows.clear();
        this.updateBulkActionState();
        break;
      case 'bulkDelete':
        if (this.selectedRows.size > 0) {
          this.executeBulkAction('delete');
        }
        break;
      case 'delete':
        const focusedRow = document.activeElement.closest('tr');
        if (focusedRow) {
          const rowId = focusedRow.dataset.id;
          this.options.onDelete(rowId);
        }
        break;
      case 'selectPrevious':
        this.selectAdjacentRow('previous');
        break;
      case 'selectNext':
        this.selectAdjacentRow('next');
        break;
      case 'edit':
        const editRow = document.activeElement.closest('tr');
        if (editRow) {
          const rowId = editRow.dataset.id;
          this.options.onEdit(rowId);
        }
        break;
      case 'export':
        if (this.selectedRows.size > 0) {
          this.executeBulkAction('export');
        }
        break;
    }
  }

  selectAdjacentRow(direction) {
    const rows = Array.from(document.querySelectorAll('.table-container tr[data-id]'));
    const currentRow = document.activeElement.closest('tr');
    if (!currentRow) return;

    const currentIndex = rows.indexOf(currentRow);
    const targetIndex = direction === 'previous' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(rows.length - 1, currentIndex + 1);

    const targetRow = rows[targetIndex];
    if (targetRow) {
      const rowId = targetRow.dataset.id;
      this.toggleRowSelection(rowId);
      targetRow.focus();
    }
  }
} 