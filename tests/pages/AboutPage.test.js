import { JSDOM } from 'jsdom';
import { AboutPage } from '../../src/pages/AboutPage.js';

describe('AboutPage Component', () => {
  let dom;
  let aboutPage;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <main></main>
        </body>
      </html>
    `, { url: 'http://localhost/' });

    global.window = dom.window;
    global.document = dom.window.document;
  });

  afterEach(() => {
    if (aboutPage) {
      aboutPage.cleanup();
    }
    dom.window.close();
  });

  it('should create about page with proper structure', () => {
    aboutPage = new AboutPage();
    
    const pageElement = document.querySelector('.about-page');
    expect(pageElement).toBeTruthy();
    
    const article = pageElement.querySelector('.about-content');
    expect(article).toBeTruthy();
    
    const header = article.querySelector('.about-header');
    expect(header).toBeTruthy();
    
    const title = header.querySelector('h1');
    expect(title).toBeTruthy();
    expect(title.textContent).toBe('About Oblique Strategies');
  });

  it('should have all required sections', () => {
    aboutPage = new AboutPage();
    
    const sections = document.querySelectorAll('.about-section');
    expect(sections.length).toBeGreaterThanOrEqual(6);
    
    const sectionTitles = Array.from(sections).map(section => 
      section.querySelector('h2').textContent
    );
    
    expect(sectionTitles).toContain('What are Oblique Strategies?');
    expect(sectionTitles).toContain('The Creators');
    expect(sectionTitles).toContain('History and Development');
    expect(sectionTitles).toContain('How to Use Oblique Strategies');
    expect(sectionTitles).toContain('Creative Applications');
    expect(sectionTitles).toContain('About This Website');
  });

  it('should have creators grid with Brian Eno and Peter Schmidt', () => {
    aboutPage = new AboutPage();
    
    const creatorsGrid = document.querySelector('.creators-grid');
    expect(creatorsGrid).toBeTruthy();
    
    const creators = creatorsGrid.querySelectorAll('.creator');
    expect(creators.length).toBe(2);
    
    const creatorNames = Array.from(creators).map(creator => 
      creator.querySelector('h3').textContent
    );
    
    expect(creatorNames).toContain('Brian Eno');
    expect(creatorNames).toContain('Peter Schmidt');
  });

  it('should have usage instructions with ordered list', () => {
    aboutPage = new AboutPage();
    
    const usageInstructions = document.querySelector('.usage-instructions');
    expect(usageInstructions).toBeTruthy();
    
    const orderedList = usageInstructions.querySelector('ol');
    expect(orderedList).toBeTruthy();
    
    const listItems = orderedList.querySelectorAll('li');
    expect(listItems.length).toBeGreaterThanOrEqual(5);
    
    // Check for key instruction elements
    const instructionTexts = Array.from(listItems).map(li => li.textContent);
    expect(instructionTexts.some(text => text.includes('stuck'))).toBe(true);
    expect(instructionTexts.some(text => text.includes('reflect'))).toBe(true);
    expect(instructionTexts.some(text => text.includes('experiment'))).toBe(true);
  });

  it('should have applications list with various disciplines', () => {
    aboutPage = new AboutPage();
    
    const applicationsList = document.querySelector('.applications-list');
    expect(applicationsList).toBeTruthy();
    
    const applications = applicationsList.querySelectorAll('li');
    expect(applications.length).toBeGreaterThanOrEqual(6);
    
    const applicationTexts = Array.from(applications).map(li => li.textContent);
    expect(applicationTexts.some(text => text.includes('Music'))).toBe(true);
    expect(applicationTexts.some(text => text.includes('Visual Arts'))).toBe(true);
    expect(applicationTexts.some(text => text.includes('Writing'))).toBe(true);
    expect(applicationTexts.some(text => text.includes('Design'))).toBe(true);
  });

  it('should have proper heading hierarchy', () => {
    aboutPage = new AboutPage();
    
    const h1 = document.querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1.textContent).toBe('About Oblique Strategies');
    
    const h2Elements = document.querySelectorAll('h2');
    expect(h2Elements.length).toBeGreaterThanOrEqual(6);
    
    const h3Elements = document.querySelectorAll('h3');
    expect(h3Elements.length).toBe(2); // Brian Eno and Peter Schmidt
  });

  it('should have informative content about Oblique Strategies', () => {
    aboutPage = new AboutPage();
    
    const content = document.querySelector('.about-content').textContent;
    
    // Check for key concepts
    expect(content).toContain('Brian Eno');
    expect(content).toContain('Peter Schmidt');
    expect(content).toContain('creative blocks');
    expect(content).toContain('lateral thinking');
    expect(content).toContain('1975');
    expect(content).toContain('cybernetics');
  });

  it('should mention historical context', () => {
    aboutPage = new AboutPage();
    
    const historySection = Array.from(document.querySelectorAll('.about-section'))
      .find(section => section.querySelector('h2').textContent === 'History and Development');
    
    expect(historySection).toBeTruthy();
    
    const historyText = historySection.textContent;
    expect(historyText).toContain('1975');
    expect(historyText).toContain('500 copies');
    expect(historyText).toContain('editions');
  });

  it('should provide usage guidance', () => {
    aboutPage = new AboutPage();
    
    const usageSection = Array.from(document.querySelectorAll('.about-section'))
      .find(section => section.querySelector('h2').textContent === 'How to Use Oblique Strategies');
    
    expect(usageSection).toBeTruthy();
    
    const usageText = usageSection.textContent;
    expect(usageText).toContain('stuck');
    expect(usageText).toContain('reflect');
    expect(usageText).toContain('experiment');
    expect(usageText).toContain('process');
  });

  it('should explain the website purpose', () => {
    aboutPage = new AboutPage();
    
    const websiteSection = Array.from(document.querySelectorAll('.about-section'))
      .find(section => section.querySelector('h2').textContent === 'About This Website');
    
    expect(websiteSection).toBeTruthy();
    
    const websiteText = websiteSection.textContent;
    expect(websiteText).toContain('digital version');
    expect(websiteText).toContain('tactile experience');
    expect(websiteText).toContain('creative possibilities');
  });

  it('should clean up properly', () => {
    aboutPage = new AboutPage();
    
    expect(document.querySelector('.about-page')).toBeTruthy();
    
    aboutPage.cleanup();
    
    expect(document.querySelector('.about-page')).toBeFalsy();
  });

  it('should replace existing page if one exists', () => {
    // Create first page
    const firstPage = new AboutPage();
    const firstElement = document.querySelector('.about-page');
    
    // Create second page
    const secondPage = new AboutPage();
    const pageElements = document.querySelectorAll('.about-page');
    
    expect(pageElements.length).toBe(1);
    expect(document.querySelector('.about-page')).not.toBe(firstElement);
    
    firstPage.cleanup();
    secondPage.cleanup();
  });

  it('should have accessible content structure', () => {
    aboutPage = new AboutPage();
    
    // Check for proper article structure
    const article = document.querySelector('article');
    expect(article).toBeTruthy();
    
    // Check for proper header structure
    const header = document.querySelector('header');
    expect(header).toBeTruthy();
    
    // Check for proper section structure
    const sections = document.querySelectorAll('section');
    expect(sections.length).toBeGreaterThanOrEqual(6);
    
    // Each section should have a heading
    sections.forEach(section => {
      const heading = section.querySelector('h2');
      expect(heading).toBeTruthy();
    });
  });

  it('should have proper text content formatting', () => {
    aboutPage = new AboutPage();
    
    // Check for paragraphs
    const paragraphs = document.querySelectorAll('p');
    expect(paragraphs.length).toBeGreaterThan(10);
    
    // Check for strong elements for emphasis
    const strongElements = document.querySelectorAll('strong');
    expect(strongElements.length).toBeGreaterThan(5);
    
    // Check for lists
    const lists = document.querySelectorAll('ul, ol');
    expect(lists.length).toBeGreaterThanOrEqual(2);
  });
}); 