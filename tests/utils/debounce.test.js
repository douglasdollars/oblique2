import { debounce } from '../../src/utils/debounce.js';
import { jest } from '@jest/globals';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should delay function execution', () => {
    const callback = jest.fn();
    const debounced = debounce(callback, 100);

    debounced();
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should only execute once for multiple calls within wait period', () => {
    const callback = jest.fn();
    const debounced = debounce(callback, 100);

    debounced();
    debounced();
    debounced();

    jest.advanceTimersByTime(99);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to the callback', () => {
    const callback = jest.fn();
    const debounced = debounce(callback, 100);

    debounced('test', 123);
    jest.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledWith('test', 123);
  });

  it('should use latest arguments for multiple calls', () => {
    const callback = jest.fn();
    const debounced = debounce(callback, 100);

    debounced('first');
    debounced('second');
    debounced('third');

    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledWith('third');
  });

  it('should execute again after wait period', () => {
    const callback = jest.fn();
    const debounced = debounce(callback, 100);

    debounced();
    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);

    debounced();
    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(2);
  });
}); 