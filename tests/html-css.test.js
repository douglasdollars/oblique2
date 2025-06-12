import { jest } from '@jest/globals';
import fs from 'fs';

let document;

describe('HTML and CSS Setup', () => {
  beforeEach(() => {
    document = new DOMParser().parseFromString(
      fs.readFileSync('./src/index.html', 'utf8'),
      'text/html'
    );
  });

  it('should have proper HTML structure', () => {
    expect(document.doctype).not.toBeNull();
    expect(document.querySelector('html')).not.toBeNull();
    expect(document.querySelector('head')).not.toBeNull();
    expect(document.querySelector('body')).not.toBeNull();
  });

  it('should have required meta tags', () => {
    expect(document.querySelector('meta[charset="UTF-8"]')).not.toBeNull();
    expect(document.querySelector('meta[name="viewport"]')).not.toBeNull();
    expect(document.querySelector('meta[name="description"]')).not.toBeNull();
  });

  it('should have proper semantic structure', () => {
    expect(document.querySelector('header')).not.toBeNull();
    expect(document.querySelector('main')).not.toBeNull();
    expect(document.querySelector('footer')).not.toBeNull();
    expect(document.querySelector('nav')).not.toBeNull();
  });

  it('should have accessibility attributes', () => {
    expect(document.querySelector('header').getAttribute('role')).toBe('banner');
    expect(document.querySelector('main').getAttribute('role')).toBe('main');
    expect(document.querySelector('footer').getAttribute('role')).toBe('contentinfo');
    expect(document.querySelector('nav').getAttribute('role')).toBe('navigation');
  });

  it('should link to CSS file', () => {
    const cssLink = document.querySelector('link[rel="stylesheet"]');
    expect(cssLink).not.toBeNull();
    expect(cssLink.getAttribute('href')).toBe('styles/main.css');
  });
}); 