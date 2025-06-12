import { CardService } from './CardService.js';

export class EditionService {
  constructor() {
    this.cardService = new CardService();
    this.editionCache = new Map(); // edition -> frequency
    this.initializeCache();
  }

  initializeCache() {
    const cards = this.cardService.getCards();
    cards.forEach(card => {
      card.editions.forEach(edition => {
        this.editionCache.set(edition, (this.editionCache.get(edition) || 0) + 1);
      });
    });
  }

  getEditions() {
    return Array.from(this.editionCache.keys());
  }

  getPopularEditions(limit = 5) {
    return Array.from(this.editionCache.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([edition]) => edition);
  }

  searchEditions(query, limit = 5) {
    if (!query) return this.getPopularEditions(limit);

    const normalizedQuery = query.toLowerCase().trim();
    const results = [];
    const exactMatches = new Set();
    const startsWithMatches = new Set();
    const containsMatches = new Set();
    const fuzzyMatches = new Set();

    for (const edition of this.editionCache.keys()) {
      const normalizedEdition = edition.toLowerCase();

      // Exact match
      if (normalizedEdition === normalizedQuery) {
        exactMatches.add(edition);
        continue;
      }

      // Starts with match
      if (normalizedEdition.startsWith(normalizedQuery)) {
        startsWithMatches.add(edition);
        continue;
      }

      // Contains match
      if (normalizedEdition.includes(normalizedQuery)) {
        containsMatches.add(edition);
        continue;
      }

      // Fuzzy match (allow one character difference)
      if (this.calculateLevenshteinDistance(normalizedQuery, normalizedEdition) <= 2) {
        fuzzyMatches.add(edition);
      }
    }

    // Combine results in priority order
    results.push(...exactMatches);
    results.push(...startsWithMatches);
    results.push(...containsMatches);
    results.push(...fuzzyMatches);

    // Sort by frequency within each match type
    return results
      .slice(0, limit)
      .sort((a, b) => this.editionCache.get(b) - this.editionCache.get(a));
  }

  calculateLevenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j - 1] + 1, // substitution
            dp[i - 1][j] + 1,     // deletion
            dp[i][j - 1] + 1      // insertion
          );
        }
      }
    }

    return dp[m][n];
  }

  addEdition(edition) {
    this.editionCache.set(edition, (this.editionCache.get(edition) || 0) + 1);
  }

  removeEdition(edition) {
    const count = this.editionCache.get(edition);
    if (count > 1) {
      this.editionCache.set(edition, count - 1);
    } else {
      this.editionCache.delete(edition);
    }
  }

  updateEditionCache(oldEditions, newEditions) {
    // Remove old editions
    oldEditions.forEach(edition => this.removeEdition(edition));
    // Add new editions
    newEditions.forEach(edition => this.addEdition(edition));
  }
} 