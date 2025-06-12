export class Navigation {
  constructor() {
    this.activeRoute = window.location.hash.slice(1) || '/';
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    header.className = 'site-header';

    header.innerHTML = `
      <div class="header-container">
        <a href="#/" class="site-title" aria-label="Oblique Strategies Home">
          <span class="text-primary">Oblique Strategies</span>
        </a>
        <nav class="main-nav" role="navigation" aria-label="Main navigation">
          <ul class="nav-list">
            <li class="nav-item">
              <a href="#/about" class="nav-link ${this.activeRoute === '/about' ? 'active' : ''}" aria-current="${this.activeRoute === '/about' ? 'page' : 'false'}">
                About
              </a>
            </li>
            <li class="nav-item">
              <a href="#/edit-cards" class="nav-link ${this.activeRoute === '/edit-cards' ? 'active' : ''}" aria-current="${this.activeRoute === '/edit-cards' ? 'page' : 'false'}">
                Edit Cards
              </a>
            </li>
          </ul>
        </nav>
      </div>
    `;

    // Replace existing header if it exists
    const existingHeader = document.querySelector('.site-header');
    if (existingHeader) {
      existingHeader.replaceWith(header);
    } else {
      document.body.insertBefore(header, document.body.firstChild);
    }
  }

  attachEventListeners() {
    // Handle navigation clicks
    document.addEventListener('click', (event) => {
      const link = event.target.closest('.nav-link');
      if (link) {
        event.preventDefault();
        const route = link.getAttribute('href').slice(1);
        this.navigate(route);
      }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      this.activeRoute = window.location.hash.slice(1) || '/';
      this.render();
    });
  }

  navigate(route) {
    this.activeRoute = route;
    window.location.hash = route;
    this.render();
  }

  getActiveRoute() {
    return this.activeRoute;
  }
} 