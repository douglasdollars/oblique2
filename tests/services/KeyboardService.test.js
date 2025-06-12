import { jest } from '@jest/globals';
import { KeyboardService } from '../../src/services/KeyboardService';

describe('KeyboardService', () => {
  let keyboardService;
  let mockOnSpacebar;
  let mockOnEscape;

  beforeEach(() => {
    mockOnSpacebar = jest.fn();
    mockOnEscape = jest.fn();
    keyboardService = new KeyboardService({
      onSpacebar: mockOnSpacebar,
      onEscape: mockOnEscape
    });
    keyboardService.init();
  });

  afterEach(() => {
    keyboardService.cleanup();
    jest.clearAllMocks();
  });

  test('should initialize with default options', () => {
    const defaultService = new KeyboardService();
    expect(defaultService.isEnabled).toBe(true);
  });

  test('should handle spacebar press', () => {
    const event = new KeyboardEvent('keydown', { code: 'Space' });
    document.dispatchEvent(event);
    expect(mockOnSpacebar).toHaveBeenCalled();
  });

  test('should handle escape press', () => {
    const event = new KeyboardEvent('keydown', { code: 'Escape' });
    document.dispatchEvent(event);
    expect(mockOnEscape).toHaveBeenCalled();
  });

  test('should not handle spacebar when disabled', () => {
    keyboardService.disable();
    const event = new KeyboardEvent('keydown', { code: 'Space' });
    document.dispatchEvent(event);
    expect(mockOnSpacebar).not.toHaveBeenCalled();
  });

  test('should not handle spacebar in input elements', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    
    const event = new KeyboardEvent('keydown', { code: 'Space' });
    document.dispatchEvent(event);
    expect(mockOnSpacebar).not.toHaveBeenCalled();
    
    document.body.removeChild(input);
  });

  test('should re-enable after being disabled', () => {
    keyboardService.disable();
    keyboardService.enable();
    
    const event = new KeyboardEvent('keydown', { code: 'Space' });
    document.dispatchEvent(event);
    expect(mockOnSpacebar).toHaveBeenCalled();
  });

  test('should prevent default behavior for handled keys', () => {
    const event = new KeyboardEvent('keydown', { code: 'Space' });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    
    document.dispatchEvent(event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  test('should cleanup event listeners', () => {
    keyboardService.cleanup();
    
    const event = new KeyboardEvent('keydown', { code: 'Space' });
    document.dispatchEvent(event);
    expect(mockOnSpacebar).not.toHaveBeenCalled();
  });
}); 