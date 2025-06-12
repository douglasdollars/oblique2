export class Router {
  constructor(routes = {}) {
    this.routes = routes;
    this.currentRoute = null;
    this.currentComponent = null;
    this.init();
  }

  init() {
    // Handle initial route
    this.handleRoute();

    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  addRoute(path, component) {
    this.routes[path] = component;
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const route = this.routes[hash] || this.routes['/'];

    if (route) {
      this.navigateTo(route);
    }
  }

  navigateTo(component) {
    // Clean up current component if it exists
    if (this.currentComponent && typeof this.currentComponent.cleanup === 'function') {
      this.currentComponent.cleanup();
    }

    // Create and mount new component
    this.currentComponent = new component();
    this.currentRoute = window.location.hash.slice(1) || '/';

    // If component has a mount method, call it
    if (typeof this.currentComponent.mount === 'function') {
      this.currentComponent.mount();
    }
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  getCurrentComponent() {
    return this.currentComponent;
  }
} 