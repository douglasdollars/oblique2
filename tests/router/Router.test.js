import { JSDOM } from 'jsdom';
import { Router } from '../../src/router/Router.js';

describe('Router', () => {
  let dom;
  let document;
  let router;
  let mockComponent;
  let mockDefaultComponent;

  beforeEach(() => {
    // Create a new JSDOM instance
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'http://localhost/',
    });
    document = dom.window.document;
    global.window = dom.window;
    global.document = document;

    // Mock location.hash
    if (!window.location.hash) {
      window.location.hash = '#/';
    }

    // Create mock components
    mockComponent = class {
      constructor() {
        this.mounted = false;
        this.cleaned = false;
      }
      mount() {
        this.mounted = true;
      }
      cleanup() {
        this.cleaned = true;
      }
    };

    mockDefaultComponent = class {
      constructor() {
        this.mounted = false;
        this.cleaned = false;
      }
      mount() {
        this.mounted = true;
      }
      cleanup() {
        this.cleaned = true;
      }
    };

    // Initialize router with routes
    router = new Router({
      '/': mockDefaultComponent,
      '/about': mockComponent,
      '/edit-cards': mockComponent,
    });
  });

  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
  });

  it('should initialize with default route', () => {
    expect(router.getCurrentRoute()).toBe('/');
    expect(router.getCurrentComponent()).toBeInstanceOf(mockDefaultComponent);
  });

  it('should handle route changes', () => {
    window.location.hash = '#/about';
    window.dispatchEvent(new window.HashChangeEvent('hashchange'));

    expect(router.getCurrentRoute()).toBe('/about');
    expect(router.getCurrentComponent()).toBeInstanceOf(mockComponent);
  });

  it('should add new routes', () => {
    const newComponent = class {};
    router.addRoute('/new-route', newComponent);

    window.location.hash = '#/new-route';
    window.dispatchEvent(new window.HashChangeEvent('hashchange'));

    expect(router.getCurrentRoute()).toBe('/new-route');
    expect(router.getCurrentComponent()).toBeInstanceOf(newComponent);
  });

  it('should cleanup previous component before mounting new one', () => {
    const firstComponent = router.getCurrentComponent();
    window.location.hash = '#/about';
    window.dispatchEvent(new window.HashChangeEvent('hashchange'));

    expect(firstComponent.cleaned).toBe(true);
    expect(router.getCurrentComponent().mounted).toBe(true);
  });

  it('should handle non-existent routes by falling back to default', () => {
    window.location.hash = '#/non-existent';
    window.dispatchEvent(new window.HashChangeEvent('hashchange'));

    expect(router.getCurrentRoute()).toBe('/');
    expect(router.getCurrentComponent()).toBeInstanceOf(mockDefaultComponent);
  });

  it('should handle components without mount/cleanup methods', () => {
    const simpleComponent = class {};
    router.addRoute('/simple', simpleComponent);

    window.location.hash = '#/simple';
    window.dispatchEvent(new window.HashChangeEvent('hashchange'));

    expect(router.getCurrentRoute()).toBe('/simple');
    expect(router.getCurrentComponent()).toBeInstanceOf(simpleComponent);
  });
}); 