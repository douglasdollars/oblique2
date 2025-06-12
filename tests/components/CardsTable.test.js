import { JSDOM } from 'jsdom';
import { CardsTable } from '../../src/components/CardsTable.js';
import { jest } from '@jest/globals';

describe('CardsTable Component', () => {
  let dom;
  let document;
  let container;

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
  });

  afterEach(() => {
    dom.window.close();
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
    const table = new CardsTable(container, mockData);
    table.search('Card 2');
    
    const rows = document.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].querySelector('td').textContent).toBe('Card 2');
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