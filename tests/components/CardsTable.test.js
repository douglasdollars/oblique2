import { JSDOM } from 'jsdom';
import { CardsTable } from '../../src/components/CardsTable.js';
import { jest } from '@jest/globals';

describe('CardsTable Component', () => {
  let dom;
  let document;
  let container;
  let cardsTable;
  let mockOnBulkAction;

  const mockData = [
    { id: '1', text: 'Card 1', editions: ['Ed1'], notes: 'Note 1', imageUrl: 'img1.jpg' },
    { id: '2', text: 'Card 2', editions: ['Ed2'], notes: 'Note 2', imageUrl: 'img2.jpg' },
    { id: '3', text: 'Card 3', editions: ['Ed3'], notes: 'Note 3', imageUrl: 'img3.jpg' }
  ];

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    document = dom.window.document;
    container = document.getElementById('container');
    mockOnBulkAction = jest.fn();

    cardsTable = new CardsTable({
      data: mockData,
      onBulkAction: mockOnBulkAction
    });
    container.appendChild(cardsTable.render());
  });

  afterEach(() => {
    if (cardsTable && cardsTable.cleanup) {
      cardsTable.cleanup();
    }
    dom.window.close();
  });

  describe('Bulk Operations', () => {
    it('should toggle row selection', () => {
      cardsTable.toggleRowSelection('1');
      expect(cardsTable.selectedRows.has('1')).toBe(true);
      expect(cardsTable.selectedRows.size).toBe(1);

      cardsTable.toggleRowSelection('1');
      expect(cardsTable.selectedRows.has('1')).toBe(false);
      expect(cardsTable.selectedRows.size).toBe(0);
    });

    it('should toggle all selection', () => {
      cardsTable.toggleAllSelection();
      expect(cardsTable.selectedRows.size).toBe(mockData.length);

      cardsTable.toggleAllSelection();
      expect(cardsTable.selectedRows.size).toBe(0);
    });

    it('should show bulk actions toolbar when rows are selected', () => {
      const bulkActions = document.querySelector('.bulk-actions');
      expect(bulkActions.classList.contains('hidden')).toBe(true);

      cardsTable.toggleRowSelection('1');
      expect(bulkActions.classList.contains('hidden')).toBe(false);
      expect(bulkActions.querySelector('.selected-count').textContent).toBe('1');
    });

    it('should execute bulk delete action', async () => {
      cardsTable.toggleRowSelection('1');
      cardsTable.toggleRowSelection('2');

      await cardsTable.executeBulkAction('delete');
      expect(mockOnBulkAction).toHaveBeenCalledWith('delete', [mockData[0], mockData[1]]);
      expect(cardsTable.selectedRows.size).toBe(0);
    });

    it('should execute bulk export action', async () => {
      cardsTable.toggleRowSelection('1');
      cardsTable.toggleRowSelection('2');

      await cardsTable.executeBulkAction('export');
      expect(mockOnBulkAction).toHaveBeenCalledWith('export', [mockData[0], mockData[1]]);
      expect(cardsTable.selectedRows.size).toBe(0);
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should handle select all shortcut', () => {
      cardsTable.handleKeyboardShortcut('selectAll');
      expect(cardsTable.selectedRows.size).toBe(mockData.length);
    });

    it('should handle clear selection shortcut', () => {
      cardsTable.toggleRowSelection('1');
      cardsTable.toggleRowSelection('2');
      cardsTable.handleKeyboardShortcut('clearSelection');
      expect(cardsTable.selectedRows.size).toBe(0);
    });

    it('should handle bulk delete shortcut', () => {
      cardsTable.toggleRowSelection('1');
      cardsTable.toggleRowSelection('2');
      cardsTable.handleKeyboardShortcut('bulkDelete');
      expect(mockOnBulkAction).toHaveBeenCalledWith('delete', [mockData[0], mockData[1]]);
    });

    it('should handle adjacent row selection', () => {
      const rows = document.querySelectorAll('tr[data-id]');
      rows[0].focus();

      cardsTable.handleKeyboardShortcut('selectNext');
      expect(cardsTable.selectedRows.has('2')).toBe(true);
      expect(document.activeElement).toBe(rows[1]);

      cardsTable.handleKeyboardShortcut('selectPrevious');
      expect(cardsTable.selectedRows.has('1')).toBe(true);
      expect(document.activeElement).toBe(rows[0]);
    });
  });

  it('should render table with correct columns', () => {
    const table = new CardsTable(container, mockData);
    const headers = document.querySelectorAll('th');
    
    expect(headers[0].textContent).toBe('Card Text');
    expect(headers[1].textContent).toBe('Edition');
    expect(headers[2].textContent).toBe('Notes');
    expect(headers[3].textContent).toBe('Imagery URL');
    expect(headers[4].textContent).toBe('Actions');
  });

  it('should render data rows correctly', () => {
    const table = new CardsTable(container, mockData);
    const rows = document.querySelectorAll('tbody tr');
    
    expect(rows.length).toBe(3);
    expect(rows[0].querySelector('td').textContent).toBe('Card 1');
  });

  it('should sort data when clicking column headers', () => {
    const table = new CardsTable(container, mockData);
    const headers = document.querySelectorAll('th');
    
    // Click text column header
    headers[0].click();
    let rows = document.querySelectorAll('tbody tr');
    expect(rows[0].querySelector('td').textContent).toBe('Card 1');
    
    // Click again for reverse sort
    headers[0].click();
    rows = document.querySelectorAll('tbody tr');
    expect(rows[0].querySelector('td').textContent).toBe('Card 3');
  });

  it('should filter data based on search term', () => {
    const mockData = [
      { id: '1', text: 'First card', editions: ['Ed1'] },
      { id: '2', text: 'Second card', editions: ['Ed2'] },
      { id: '3', text: 'Third card', editions: ['Ed3'] }
    ];
    const table = new CardsTable({ data: mockData });
    const searchInput = document.querySelector('.search-input');
    
    searchInput.value = 'Second';
    searchInput.dispatchEvent(new Event('input'));
    
    setTimeout(() => {
      const rows = document.querySelectorAll('tbody tr');
      expect(rows.length).toBe(1);
      expect(rows[0].querySelector('td').textContent).toContain('Second card');
    }, 350);
  });

  it('should highlight search matches', () => {
    const mockData = [
      { id: '1', text: 'Test card', editions: ['Ed1'] }
    ];
    const table = new CardsTable({ data: mockData });
    const searchInput = document.querySelector('.search-input');
    
    searchInput.value = 'test';
    searchInput.dispatchEvent(new Event('input'));
    
    setTimeout(() => {
      const cell = document.querySelector('tbody td');
      expect(cell.innerHTML).toContain('<span class="search-highlight">Test</span>');
    }, 350);
  });

  it('should show no results message when search has no matches', () => {
    const mockData = [
      { id: '1', text: 'Test card', editions: ['Ed1'] }
    ];
    const table = new CardsTable({ data: mockData });
    const searchInput = document.querySelector('.search-input');
    
    searchInput.value = 'nonexistent';
    searchInput.dispatchEvent(new Event('input'));
    
    setTimeout(() => {
      const noData = document.querySelector('.no-data');
      expect(noData.textContent).toContain('No cards match your search');
    }, 350);
  });

  it('should reset to first page when searching', () => {
    const mockData = Array.from({ length: 30 }, (_, i) => ({
      id: String(i + 1),
      text: `Card ${i + 1}`,
      editions: [`Ed${i + 1}`]
    }));
    const table = new CardsTable({ data: mockData, itemsPerPage: 10 });
    
    // Go to second page
    const nextButton = document.querySelector('.pagination-button.next');
    nextButton.click();
    
    // Search
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'Card';
    searchInput.dispatchEvent(new Event('input'));
    
    setTimeout(() => {
      const currentPage = document.querySelector('.pagination-button.active');
      expect(currentPage.textContent.trim()).toBe('1');
    }, 350);
  });

  it('should update search result count', () => {
    const mockData = [
      { id: '1', text: 'Test card 1', editions: ['Ed1'] },
      { id: '2', text: 'Test card 2', editions: ['Ed2'] }
    ];
    const table = new CardsTable({ data: mockData });
    const searchInput = document.querySelector('.search-input');
    
    searchInput.value = 'Test';
    searchInput.dispatchEvent(new Event('input'));
    
    setTimeout(() => {
      const status = document.querySelector('.search-status');
      expect(status.textContent).toBe('Found 2 cards');
    }, 350);
  });

  it('should handle pagination', () => {
    const table = new CardsTable(container, mockData, { pageSize: 2 });
    let rows = document.querySelectorAll('tbody tr');
    
    expect(rows.length).toBe(2);
    
    const nextButton = document.querySelector('.pagination-next');
    nextButton.click();
    
    rows = document.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
  });

  it('should handle row deletion', () => {
    const table = new CardsTable(container, mockData);
    const deleteButton = document.querySelector('[data-action="delete"]');
    
    deleteButton.click();
    const rows = document.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('should handle row editing', () => {
    const table = new CardsTable(container, mockData);
    const editButton = document.querySelector('[data-action="edit"]');
    
    editButton.click();
    const form = document.querySelector('.edit-form');
    expect(form).toBeTruthy();
  });

  it('should maintain sort state across updates', () => {
    const table = new CardsTable(container, mockData);
    const headers = document.querySelectorAll('th');
    
    headers[0].click(); // Sort by text
    table.updateData([...mockData, { id: '4', text: 'Card 0', editions: ['Ed4'] }]);
    
    const rows = document.querySelectorAll('tbody tr');
    expect(rows[0].querySelector('td').textContent).toBe('Card 0');
  });

  it('should show loading state during updates', () => {
    const table = new CardsTable(container, mockData);
    table.setLoading(true);
    
    const loadingIndicator = document.querySelector('.loading-indicator');
    expect(loadingIndicator).toBeTruthy();
  });
}); 