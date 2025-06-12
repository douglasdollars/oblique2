export class SortingUtils {
  static compareValues(a, b, direction = 'asc') {
    // Handle null/undefined values
    if (a == null) return direction === 'asc' ? -1 : 1;
    if (b == null) return direction === 'asc' ? 1 : -1;

    // Convert to strings for consistent comparison
    const valueA = String(a).toLowerCase();
    const valueB = String(b).toLowerCase();

    // Compare values
    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  }

  static compareArrays(a, b, direction = 'asc') {
    // Handle null/undefined values
    if (!a || !a.length) return direction === 'asc' ? -1 : 1;
    if (!b || !b.length) return direction === 'asc' ? 1 : -1;

    // Compare arrays by their first different element
    const minLength = Math.min(a.length, b.length);
    for (let i = 0; i < minLength; i++) {
      const comparison = this.compareValues(a[i], b[i], direction);
      if (comparison !== 0) return comparison;
    }

    // If all elements are equal up to the minimum length,
    // the shorter array comes first
    return direction === 'asc' ?
      a.length - b.length :
      b.length - a.length;
  }

  static sortData(data, sortConfig) {
    if (!sortConfig || !sortConfig.column) return [...data];

    const { column, direction } = sortConfig;

    return [...data].sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      // Handle arrays (e.g., editions)
      if (Array.isArray(valueA) || Array.isArray(valueB)) {
        return this.compareArrays(valueA, valueB, direction);
      }

      return this.compareValues(valueA, valueB, direction);
    });
  }

  static getNextSortDirection(currentDirection) {
    switch (currentDirection) {
      case 'asc': return 'desc';
      case 'desc': return null;
      default: return 'asc';
    }
  }

  static getSortIndicator(currentDirection) {
    switch (currentDirection) {
      case 'asc': return '↑';
      case 'desc': return '↓';
      default: return '';
    }
  }
} 