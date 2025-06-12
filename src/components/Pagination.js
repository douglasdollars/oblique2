export class Pagination {
  constructor(options = {}) {
    this.options = {
      totalItems: 0,
      itemsPerPage: 25,
      currentPage: 1,
      maxVisiblePages: 5,
      onPageChange: () => {},
      ...options
    };
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'pagination';
    container.setAttribute('role', 'navigation');
    container.setAttribute('aria-label', 'Table pagination');

    const totalPages = Math.ceil(this.options.totalItems / this.options.itemsPerPage);
    if (totalPages <= 1) return;

    container.innerHTML = `
      <div class="pagination-info">
        Showing ${this.getPageStart()}-${this.getPageEnd()} of ${this.options.totalItems} items
      </div>
      <div class="pagination-controls">
        ${this.renderPaginationButtons(totalPages)}
      </div>
    `;

    // Replace existing pagination if it exists
    const existingPagination = document.querySelector('.pagination');
    if (existingPagination) {
      existingPagination.replaceWith(container);
    }

    this.element = container;
  }

  renderPaginationButtons(totalPages) {
    const buttons = [];
    const currentPage = this.options.currentPage;
    const maxVisiblePages = this.options.maxVisiblePages;

    // Previous button
    buttons.push(`
      <button
        type="button"
        class="pagination-button previous ${currentPage === 1 ? 'disabled' : ''}"
        ${currentPage === 1 ? 'disabled' : ''}
        aria-label="Previous page"
      >
        ←
      </button>
    `);

    // Calculate visible page range
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if end page is maxed out
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page and ellipsis
    if (startPage > 1) {
      buttons.push(`
        <button
          type="button"
          class="pagination-button"
          data-page="1"
          aria-label="Go to page 1"
        >
          1
        </button>
      `);
      if (startPage > 2) {
        buttons.push('<span class="pagination-ellipsis">...</span>');
      }
    }

    // Page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(`
        <button
          type="button"
          class="pagination-button ${i === currentPage ? 'active' : ''}"
          data-page="${i}"
          aria-label="Go to page ${i}"
          ${i === currentPage ? 'aria-current="page"' : ''}
        >
          ${i}
        </button>
      `);
    }

    // Last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push('<span class="pagination-ellipsis">...</span>');
      }
      buttons.push(`
        <button
          type="button"
          class="pagination-button"
          data-page="${totalPages}"
          aria-label="Go to page ${totalPages}"
        >
          ${totalPages}
        </button>
      `);
    }

    // Next button
    buttons.push(`
      <button
        type="button"
        class="pagination-button next ${currentPage === totalPages ? 'disabled' : ''}"
        ${currentPage === totalPages ? 'disabled' : ''}
        aria-label="Next page"
      >
        →
      </button>
    `);

    return buttons.join('');
  }

  attachEventListeners() {
    if (!this.element) return;

    // Page button click handlers
    this.element.addEventListener('click', (event) => {
      const button = event.target.closest('.pagination-button');
      if (!button || button.disabled) return;

      const totalPages = Math.ceil(this.options.totalItems / this.options.itemsPerPage);

      if (button.classList.contains('previous')) {
        this.goToPage(Math.max(1, this.options.currentPage - 1));
      } else if (button.classList.contains('next')) {
        this.goToPage(Math.min(totalPages, this.options.currentPage + 1));
      } else {
        const page = parseInt(button.dataset.page, 10);
        if (!isNaN(page)) {
          this.goToPage(page);
        }
      }
    });

    // Keyboard navigation
    this.element.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const prevButton = this.element.querySelector('.pagination-button.previous');
        if (prevButton && !prevButton.disabled) {
          prevButton.click();
        }
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        const nextButton = this.element.querySelector('.pagination-button.next');
        if (nextButton && !nextButton.disabled) {
          nextButton.click();
        }
      }
    });
  }

  goToPage(page) {
    if (page === this.options.currentPage) return;

    this.options.currentPage = page;
    this.render();
    this.options.onPageChange(page);

    // Update URL state
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url);
  }

  getPageStart() {
    return (this.options.currentPage - 1) * this.options.itemsPerPage + 1;
  }

  getPageEnd() {
    return Math.min(
      this.options.currentPage * this.options.itemsPerPage,
      this.options.totalItems
    );
  }

  getCurrentPage() {
    return this.options.currentPage;
  }

  setTotalItems(totalItems) {
    this.options.totalItems = totalItems;
    const totalPages = Math.ceil(totalItems / this.options.itemsPerPage);
    if (this.options.currentPage > totalPages) {
      this.options.currentPage = Math.max(1, totalPages);
    }
    this.render();
  }

  cleanup() {
    if (this.element) {
      this.element.remove();
    }
  }
} 