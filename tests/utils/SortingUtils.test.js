import { SortingUtils } from '../../src/utils/SortingUtils.js';

describe('SortingUtils', () => {
  const testData = [
    { text: 'B Card', editions: ['Ed2'], notes: 'Note B', date: '2024-02-02' },
    { text: 'A Card', editions: ['Ed1'], notes: 'Note A', date: '2024-01-01' },
    { text: 'C Card', editions: ['Ed3'], notes: 'Note C', date: '2024-03-03' }
  ];

  it('should sort strings in ascending order', () => {
    const sorted = SortingUtils.sort(testData, 'text', 'asc');
    expect(sorted[0].text).toBe('A Card');
    expect(sorted[2].text).toBe('C Card');
  });

  it('should sort strings in descending order', () => {
    const sorted = SortingUtils.sort(testData, 'text', 'desc');
    expect(sorted[0].text).toBe('C Card');
    expect(sorted[2].text).toBe('A Card');
  });

  it('should sort arrays (editions) by first element', () => {
    const sorted = SortingUtils.sort(testData, 'editions', 'asc');
    expect(sorted[0].editions[0]).toBe('Ed1');
    expect(sorted[2].editions[0]).toBe('Ed3');
  });

  it('should sort dates correctly', () => {
    const sorted = SortingUtils.sort(testData, 'date', 'asc');
    expect(sorted[0].date).toBe('2024-01-01');
    expect(sorted[2].date).toBe('2024-03-03');
  });

  it('should handle multi-column sorting', () => {
    const multiData = [
      { text: 'B Card', editions: ['Ed1'] },
      { text: 'B Card', editions: ['Ed2'] },
      { text: 'A Card', editions: ['Ed3'] }
    ];

    const sorted = SortingUtils.multiSort(multiData, [
      { field: 'text', direction: 'asc' },
      { field: 'editions', direction: 'asc' }
    ]);

    expect(sorted[0].text).toBe('A Card');
    expect(sorted[1].editions[0]).toBe('Ed1');
  });

  it('should handle null and undefined values', () => {
    const nullData = [
      { text: null, editions: ['Ed1'] },
      { text: 'B Card', editions: undefined },
      { text: 'A Card', editions: ['Ed2'] }
    ];

    const sorted = SortingUtils.sort(nullData, 'text', 'asc');
    expect(sorted[sorted.length - 1].text).toBeNull();
  });

  it('should maintain stable sort for equal values', () => {
    const equalData = [
      { text: 'Same', order: 1 },
      { text: 'Same', order: 2 },
      { text: 'Same', order: 3 }
    ];

    const sorted = SortingUtils.sort(equalData, 'text', 'asc');
    expect(sorted[0].order).toBe(1);
    expect(sorted[1].order).toBe(2);
    expect(sorted[2].order).toBe(3);
  });

  it('should handle case-insensitive sorting', () => {
    const mixedCaseData = [
      { text: 'beta' },
      { text: 'Alpha' },
      { text: 'GAMMA' }
    ];

    const sorted = SortingUtils.sort(mixedCaseData, 'text', 'asc');
    expect(sorted[0].text).toBe('Alpha');
    expect(sorted[1].text).toBe('beta');
    expect(sorted[2].text).toBe('GAMMA');
  });

  it('should handle nested object properties', () => {
    const nestedData = [
      { meta: { order: 3 } },
      { meta: { order: 1 } },
      { meta: { order: 2 } }
    ];

    const sorted = SortingUtils.sort(nestedData, 'meta.order', 'asc');
    expect(sorted[0].meta.order).toBe(1);
    expect(sorted[2].meta.order).toBe(3);
  });

  it('should handle custom comparison functions', () => {
    const customSort = (a, b) => a.length - b.length;
    const textData = [
      { text: 'Long text here' },
      { text: 'Short' },
      { text: 'Medium text' }
    ];

    const sorted = SortingUtils.sort(textData, 'text', 'asc', customSort);
    expect(sorted[0].text).toBe('Short');
    expect(sorted[2].text).toBe('Long text here');
  });
}); 