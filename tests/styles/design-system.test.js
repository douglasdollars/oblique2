import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

describe('Design System and Typography', () => {
  let dom;
  let document;

  beforeEach(() => {
    // Create a new JSDOM instance
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    document = dom.window.document;

    // Load our CSS files
    const designSystemCSS = fs.readFileSync(path.resolve(__dirname, '../../src/styles/design-system.css'), 'utf8');
    const typographyCSS = fs.readFileSync(path.resolve(__dirname, '../../src/styles/typography.css'), 'utf8');
    const componentsCSS = fs.readFileSync(path.resolve(__dirname, '../../src/styles/components.css'), 'utf8');

    // Create style elements and append CSS
    const style = document.createElement('style');
    style.textContent = designSystemCSS + typographyCSS + componentsCSS;
    document.head.appendChild(style);
  });

  describe('Color System', () => {
    it('should have the correct color variables defined', () => {
      const root = document.documentElement;
      const computedStyle = dom.window.getComputedStyle(root);

      expect(computedStyle.getPropertyValue('--color-black')).toBe('#000000');
      expect(computedStyle.getPropertyValue('--color-dark-grey')).toBe('#1a1a1a');
      expect(computedStyle.getPropertyValue('--color-gold')).toBe('#ffd700');
      expect(computedStyle.getPropertyValue('--color-gold-bright')).toBe('#ffeb3b');
    });
  });

  describe('Typography', () => {
    it('should have the correct font stack defined', () => {
      const root = document.documentElement;
      const computedStyle = dom.window.getComputedStyle(root);

      expect(computedStyle.getPropertyValue('--font-sans')).toContain('-apple-system');
      expect(computedStyle.getPropertyValue('--font-sans')).toContain('BlinkMacSystemFont');
    });

    it('should apply base typography styles to body', () => {
      const body = document.body;
      const computedStyle = dom.window.getComputedStyle(body);

      expect(computedStyle.color).toBe('rgb(245, 245, 245)'); // var(--color-text-light)
      expect(computedStyle.fontSize).toBe('16px');
      expect(computedStyle.lineHeight).toBe('1.5');
    });
  });

  describe('Component Styles', () => {
    it('should have proper button styles', () => {
      const button = document.createElement('button');
      button.className = 'btn';
      document.body.appendChild(button);

      const computedStyle = dom.window.getComputedStyle(button);

      expect(computedStyle.display).toBe('inline-flex');
      expect(computedStyle.alignItems).toBe('center');
      expect(computedStyle.justifyContent).toBe('center');
      expect(computedStyle.backgroundColor).toBe('rgb(26, 26, 26)'); // var(--color-surface)
      expect(computedStyle.color).toBe('rgb(255, 215, 0)'); // var(--color-primary)
    });

    it('should have proper form input styles', () => {
      const input = document.createElement('input');
      input.className = 'form-input';
      document.body.appendChild(input);

      const computedStyle = dom.window.getComputedStyle(input);

      expect(computedStyle.display).toBe('block');
      expect(computedStyle.width).toBe('100%');
      expect(computedStyle.backgroundColor).toBe('rgb(26, 26, 26)'); // var(--color-surface)
      expect(computedStyle.color).toBe('rgb(245, 245, 245)'); // var(--color-text-light)
    });

    it('should have proper table styles', () => {
      const table = document.createElement('table');
      table.className = 'table';
      const th = document.createElement('th');
      const td = document.createElement('td');
      table.appendChild(th);
      table.appendChild(td);
      document.body.appendChild(table);

      const thStyle = dom.window.getComputedStyle(th);
      const tdStyle = dom.window.getComputedStyle(td);

      expect(thStyle.color).toBe('rgb(255, 215, 0)'); // var(--color-primary)
      expect(thStyle.fontWeight).toBe('600');
      expect(tdStyle.padding).toBe('8px 16px'); // var(--space-2) var(--space-3)
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive typography', () => {
      const root = document.documentElement;
      const computedStyle = dom.window.getComputedStyle(root);

      // Check if media queries are defined
      const styleSheet = document.styleSheets[0];
      const mediaQueries = Array.from(styleSheet.cssRules).filter(rule => rule.type === 4);
      
      expect(mediaQueries.length).toBeGreaterThan(0);
      expect(mediaQueries.some(mq => mq.conditionText.includes('min-width: 640px'))).toBe(true);
      expect(mediaQueries.some(mq => mq.conditionText.includes('min-width: 1024px'))).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have reduced motion media query', () => {
      const styleSheet = document.styleSheets[0];
      const mediaQueries = Array.from(styleSheet.cssRules).filter(rule => rule.type === 4);
      
      expect(mediaQueries.some(mq => mq.conditionText.includes('prefers-reduced-motion'))).toBe(true);
    });

    it('should have proper color contrast', () => {
      const button = document.createElement('button');
      button.className = 'btn';
      document.body.appendChild(button);

      const computedStyle = dom.window.getComputedStyle(button);
      const backgroundColor = computedStyle.backgroundColor;
      const color = computedStyle.color;

      // Basic contrast check (this is a simplified version)
      expect(backgroundColor).not.toBe(color);
    });
  });
}); 