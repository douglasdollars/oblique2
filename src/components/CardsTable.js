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
      ...options
    };
    this.sortState = {
      column: null,
      direction: 'asc'
    };
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const table = document.createElement('div');
    table.className = 'table-container';
    
    table.innerHTML = `
      <table class="table" role="grid">
        <thead>
          <tr>
            ${this.options.columns.map(column => `
              <th 
                class="${column.sortable ? 'sortable' : ''} ${this.getSortClass(column.id)}"
                data-column="${column.id}"
                role="columnheader"
                aria-sort="${this.getAriaSort(column.id)}"
              >
                ${column.label}
                ${column.sortable ? '<span class="sort-indicator"></span>' : ''}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${this.renderRows()}
        </tbody>
      </table>
    `;

    // Replace existing table if it exists
    const existingTable = document.querySelector('.table-container');
    if (existingTable) {
      existingTable.replaceWith(table);
    } else {
      document.querySelector('.edit-cards-content').appendChild(table);
    }

    this.element = table;
  }

  renderRows() {
    const sortedData = this.getSortedData();
    return sortedData.map(row => `
      <tr>
        <td>${row.text}</td>
        <td>${Array.isArray(row.editions) ? row.editions.join(', ') : row.editions}</td>
        <td>${row.notes || ''}</td>
        <td>${row.imageUrl || ''}</td>
        <td>
          <button class="edit-button" data-id="${row.id}" aria-label="Edit card">
            Edit
          </button>
          <button class="delete-button" data-id="${row.id}" aria-label="Delete card">
            Delete
          </button>
        </td>
      </tr>
    `).join('');
  }

  getSortedData() {
    if (!this.sortState.column) return this.options.data;

    return [...this.options.data].sort((a, b) => {
      const column = this.sortState.column;
      const direction = this.sortState.direction === 'asc' ? 1 : -1;
      
      let valueA = a[column];
      let valueB = b[column];

      // Handle special cases
      if (column === 'editions') {
        valueA = Array.isArray(valueA) ? valueA.join(', ') : valueA;
        valueB = Array.isArray(valueB) ? valueB.join(', ') : valueB;
      }

      // Handle null/undefined values
      if (!valueA) return direction;
      if (!valueB) return -direction;

      // Compare values
      return valueA.toString().localeCompare(valueB.toString()) * direction;
    });
  }

  getSortClass(columnId) {
    if (columnId !== this.sortState.column) return '';
    return `sorted ${this.sortState.direction}`;
  }

  getAriaSort(columnId) {
    if (columnId !== this.sortState.column) return 'none';
    return this.sortState.direction === 'asc' ? 'ascending' : 'descending';
  }

  attachEventListeners() {
    if (!this.element) return;

    // Sort header click handlers
    const headers = this.element.querySelectorAll('th.sortable');
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const column = header.dataset.column;
        this.handleSort(column);
      });
    });

    // Action button handlers
    this.element.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;

      const id = button.dataset.id;
      if (!id) return;

      if (button.classList.contains('edit-button')) {
        this.options.onEdit?.(id);
      } else if (button.classList.contains('delete-button')) {
        this.options.onDelete?.(id);
      }
    });
  }

  handleSort(column) {
    if (this.sortState.column === column) {
      // Toggle direction if same column
      this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, default to ascending
      this.sortState.column = column;
      this.sortState.direction = 'asc';
    }
    this.render();
  }

  updateData(data) {
    this.options.data = data;
    this.render();
  }

  cleanup() {
    if (this.element) {
      this.element.remove();
    }
  }
} 