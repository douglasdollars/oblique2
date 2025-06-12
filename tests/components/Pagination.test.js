import { JSDOM } from 'jsdom';
import { Pagination } from '../../src/components/Pagination.js';
import { jest } from '@jest/globals';

describe('Pagination Component', () => {
  let dom;
  let document;
  let container;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    document = dom.window.document;
    container = document.getElementById('container');
    
    // Mock URL API
    global.URL = {
      searchParams: new URLSearchParams(),
      toString: () => 'http://localhost'
    };
  });

  afterEach(() => {
    dom.window.close();
  });

  it('should render pagination with correct number of pages', () => {
    const pagination = new Pagination(container, {
      totalItems: 100,
      pageSize: 25,
      currentPage: 1
    });
    
    const pageLinks = document.querySelectorAll('.page-link');
    expect(pageLinks.length).toBe(4); // 4 pages for 100 items with 25 per page
  });

  it('should handle page changes', () => {
    const onPageChange = jest.fn();
    const pagination = new Pagination(container, {
      totalItems: 100,
      pageSize: 25,
      currentPage: 1,
      onPageChange
    });
    
    const pageTwo = document.querySelector('[data-page="2"]');
    pageTwo.click();
    
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should disable previous button on first page', () => {
    const pagination = new Pagination(container, {
      totalItems: 100,
      pageSize: 25,
      currentPage: 1
    });
    
    const prevButton = document.querySelector('.pagination-prev');
    expect(prevButton.disabled).toBe(true);
  });

  it('should disable next button on last page', () => {
    const pagination = new Pagination(container, {
      totalItems: 100,
      pageSize: 25,
      currentPage: 4
    });
    
    const nextButton = document.querySelector('.pagination-next');
    expect(nextButton.disabled).toBe(true);
  });

  it('should update URL state when page changes', () => {
    const pagination = new Pagination(container, {
      totalItems: 100,
      pageSize: 25,
      currentPage: 1
    });
    
    const pageTwo = document.querySelector('[data-page="2"]');
    pageTwo.click();
    
    expect(window.location.search).toContain('page=2');
  });

  it('should handle keyboard navigation', () => {
    const onPageChange = jest.fn();
    const pagination = new Pagination(container, {
      totalItems: 100,
      pageSize: 25,
      currentPage: 2,
      onPageChange
    });
    
    // Test right arrow key
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    
    // Test left arrow key
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('should show ellipsis for many pages', () => {
    const pagination = new Pagination(container, {
      totalItems: 250,
      pageSize: 25,
      currentPage: 5
    });
    
    const ellipsis = document.querySelectorAll('.pagination-ellipsis');
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('should maintain current page when total items changes', () => {
    const pagination = new Pagination(container, {
      totalItems: 100,
      pageSize: 25,
      currentPage: 2
    });
    
    pagination.update({ totalItems: 75 }); // Now only 3 pages
    expect(pagination.getCurrentPage()).toBe(2); // Should stay on page 2
  });

  it('should adjust to last page if current page is out of bounds', () => {
    const pagination = new Pagination(container, {
      totalItems: 100,
      pageSize: 25,
      currentPage: 4
    });
    
    pagination.update({ totalItems: 50 }); // Now only 2 pages
    expect(pagination.getCurrentPage()).toBe(2);
  });

  it('should handle empty state', () => {
    const pagination = new Pagination(container, {
      totalItems: 0,
      pageSize: 25,
      currentPage: 1
    });
    
    const pageLinks = document.querySelectorAll('.page-link');
    expect(pageLinks.length).toBe(0);
  });
}); 