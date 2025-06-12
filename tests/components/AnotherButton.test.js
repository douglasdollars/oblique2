import { JSDOM } from 'jsdom';
import { AnotherButton } from '../../src/components/AnotherButton';

describe('AnotherButton Component', () => {
  let dom;
  let document;
  let main;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body><main></main></body></html>');
    document = dom.window.document;
    main = document.querySelector('main');
    global.document = document;
  });

  afterEach(() => {
    dom.window.close();
  });

  it('should create a button with default options', () => {
    const button = new AnotherButton();
    const buttonElement = document.querySelector('.another-button');
    
    expect(buttonElement).toBeTruthy();
    expect(buttonElement.textContent).toBe('Another');
    expect(buttonElement.getAttribute('type')).toBe('button');
    expect(buttonElement.getAttribute('aria-label')).toBe('Get another Oblique Strategy card');
    expect(buttonElement.hasAttribute('disabled')).toBe(false);
  });

  it('should create a disabled button when specified', () => {
    const button = new AnotherButton({ disabled: true });
    const buttonElement = document.querySelector('.another-button');
    
    expect(buttonElement.hasAttribute('disabled')).toBe(true);
  });

  it('should call onClick handler when clicked', () => {
    const onClick = jest.fn();
    const button = new AnotherButton({ onClick });
    const buttonElement = document.querySelector('.another-button');
    
    buttonElement.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick handler when disabled', () => {
    const onClick = jest.fn();
    const button = new AnotherButton({ onClick, disabled: true });
    const buttonElement = document.querySelector('.another-button');
    
    buttonElement.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('should handle keyboard events (Enter and Space)', () => {
    const onClick = jest.fn();
    const button = new AnotherButton({ onClick });
    const buttonElement = document.querySelector('.another-button');
    
    // Test Enter key
    buttonElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    
    // Test Space key
    buttonElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('should update disabled state', () => {
    const button = new AnotherButton();
    const buttonElement = document.querySelector('.another-button');
    
    expect(buttonElement.hasAttribute('disabled')).toBe(false);
    
    button.setDisabled(true);
    expect(buttonElement.hasAttribute('disabled')).toBe(true);
    
    button.setDisabled(false);
    expect(buttonElement.hasAttribute('disabled')).toBe(false);
  });

  it('should clean up button element', () => {
    const button = new AnotherButton();
    const buttonElement = document.querySelector('.another-button');
    
    expect(buttonElement).toBeTruthy();
    
    button.cleanup();
    expect(document.querySelector('.another-button')).toBeNull();
  });

  it('should maintain proper styling classes', () => {
    const button = new AnotherButton();
    const buttonElement = document.querySelector('.another-button');
    
    expect(buttonElement.classList.contains('another-button')).toBe(true);
  });

  it('should handle multiple button instances', () => {
    const button1 = new AnotherButton();
    const button2 = new AnotherButton();
    
    const buttons = document.querySelectorAll('.another-button');
    expect(buttons.length).toBe(1); // Should replace existing button
  });

  it('should have proper hover effect styles', () => {
    const button = new AnotherButton();
    const buttonElement = document.querySelector('.another-button');
    const computedStyle = window.getComputedStyle(buttonElement);
    
    expect(computedStyle.getPropertyValue('--button-scale-hover')).toBe('1.02');
    expect(computedStyle.getPropertyValue('--button-scale-active')).toBe('0.98');
    expect(computedStyle.getPropertyValue('will-change')).toContain('transform');
  });

  it('should have proper gradient overlay on hover', () => {
    const button = new AnotherButton();
    const buttonElement = document.querySelector('.another-button');
    const beforeElement = buttonElement.querySelector('::before');
    
    expect(beforeElement).toBeTruthy();
    expect(window.getComputedStyle(beforeElement).backgroundImage).toContain('linear-gradient');
  });

  it('should have proper touch device optimizations', () => {
    const button = new AnotherButton();
    const buttonElement = document.querySelector('.another-button');
    
    // Simulate touch device
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(hover: none)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });
    
    const computedStyle = window.getComputedStyle(buttonElement);
    expect(computedStyle.getPropertyValue('transform')).toBe('none');
  });

  it('should have proper high DPI display optimizations', () => {
    const button = new AnotherButton();
    const buttonElement = document.querySelector('.another-button');
    
    // Simulate high DPI display
    Object.defineProperty(window, 'devicePixelRatio', { value: 2 });
    window.dispatchEvent(new Event('resize'));
    
    const computedStyle = window.getComputedStyle(buttonElement);
    expect(computedStyle.getPropertyValue('--button-shadow')).toBe('0 1px 2px rgba(0, 0, 0, 0.2)');
  });
}); 