export class Footer {
  constructor(options = {}) {
    this.options = {
      scrollThreshold: 0.8, // Show footer when 80% scrolled
      ...options
    };
    this.isVisible = false;
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
    this.checkScrollPosition();
  }

  render() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.setAttribute('role', 'contentinfo');
    footer.innerHTML = `
      <div class="footer-content">
        <div class="footer-separator">
          <span class="leaf-glow">🍃</span>
        </div>
        <div class="footer-credits">
          <p>Concept and cards by Brian Eno and Peter Schmidt</p>
        </div>
      </div>
    `;

    // Replace existing footer if it exists
    const existingFooter = document.querySelector('.site-footer');
    if (existingFooter) {
      existingFooter.replaceWith(footer);
    } else {
      document.body.appendChild(footer);
    }

    this.element = footer;
  }

  attachEventListeners() {
    this.handleScroll = this.handleScroll.bind(this);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.handleScroll, { passive: true });
  }

  handleScroll() {
    this.checkScrollPosition();
  }

  checkScrollPosition() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Calculate scroll percentage
    const scrollPercentage = scrollTop / (documentHeight - windowHeight);
    
    const shouldShow = scrollPercentage >= this.options.scrollThreshold;
    
    if (shouldShow !== this.isVisible) {
      this.isVisible = shouldShow;
      this.updateVisibility();
    }
  }

  updateVisibility() {
    if (!this.element) return;

    if (this.isVisible) {
      this.element.classList.add('visible');
      this.element.setAttribute('aria-hidden', 'false');
    } else {
      this.element.classList.remove('visible');
      this.element.setAttribute('aria-hidden', 'true');
    }
  }

  show() {
    this.isVisible = true;
    this.updateVisibility();
  }

  hide() {
    this.isVisible = false;
    this.updateVisibility();
  }

  cleanup() {
    if (this.handleScroll) {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.handleScroll);
    }
    if (this.element) {
      this.element.remove();
    }
  }
} 