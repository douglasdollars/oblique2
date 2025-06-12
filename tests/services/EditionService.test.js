import { EditionService } from '../../src/services/EditionService.js';
import { jest } from '@jest/globals';

describe('EditionService', () => {
  let editionService;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    editionService = new EditionService();
  });

  it('should initialize with empty editions if no data exists', () => {
    expect(editionService.getAllEditions()).toEqual([]);
  });

  it('should add new edition', () => {
    editionService.addEdition('First Edition');
    expect(editionService.getAllEditions()).toContain('First Edition');
  });

  it('should track edition usage', () => {
    editionService.addEdition('Popular Edition');
    editionService.trackUsage('Popular Edition');
    editionService.trackUsage('Popular Edition');
    
    const popular = editionService.getPopularEditions(1);
    expect(popular[0]).toBe('Popular Edition');
  });

  it('should provide fuzzy matching suggestions', () => {
    editionService.addEdition('First Edition');
    editionService.addEdition('Second Edition');
    editionService.addEdition('Third Edition');
    
    const matches = editionService.getSuggestions('Fist');
    expect(matches).toContain('First Edition');
  });

  it('should handle case-insensitive matching', () => {
    editionService.addEdition('Test Edition');
    const matches = editionService.getSuggestions('test');
    expect(matches).toContain('Test Edition');
  });

  it('should persist editions to localStorage', () => {
    editionService.addEdition('Persistent Edition');
    
    // Create new instance to test persistence
    const newService = new EditionService();
    expect(newService.getAllEditions()).toContain('Persistent Edition');
  });

  it('should validate edition names', () => {
    expect(() => editionService.addEdition('')).toThrow();
    expect(() => editionService.addEdition('A'.repeat(31))).toThrow();
    expect(() => editionService.addEdition('Invalid@Edition')).toThrow();
  });

  it('should prevent duplicate editions', () => {
    editionService.addEdition('Unique Edition');
    expect(() => editionService.addEdition('Unique Edition')).toThrow();
  });

  it('should sort suggestions by usage count', () => {
    editionService.addEdition('Popular Edition');
    editionService.addEdition('Rare Edition');
    
    editionService.trackUsage('Popular Edition');
    editionService.trackUsage('Popular Edition');
    editionService.trackUsage('Rare Edition');
    
    const suggestions = editionService.getSuggestions('Edition');
    expect(suggestions[0]).toBe('Popular Edition');
  });

  it('should handle partial word matching', () => {
    editionService.addEdition('Special Edition One');
    editionService.addEdition('Special Edition Two');
    
    const matches = editionService.getSuggestions('One');
    expect(matches).toContain('Special Edition One');
    expect(matches).not.toContain('Special Edition Two');
  });

  it('should clean up old usage data', () => {
    editionService.addEdition('Old Edition');
    editionService.trackUsage('Old Edition');
    
    // Simulate old data cleanup
    editionService.cleanupUsageData(30); // 30 days
    
    const popular = editionService.getPopularEditions(1);
    expect(popular).not.toContain('Old Edition');
  });
}); 