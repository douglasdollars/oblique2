import { Card } from '../../src/models/Card.js';

describe('Card Model', () => {
  let validCardData;

  beforeEach(() => {
    validCardData = {
      id: 'test-id',
      text: 'Test card text',
      editions: ['First Edition'],
      notes: 'Test notes',
      imageUrl: 'https://example.com/image.jpg'
    };
  });

  it('should create a valid card instance', () => {
    const card = new Card(validCardData);
    expect(card).toBeInstanceOf(Card);
    expect(card.id).toBe(validCardData.id);
    expect(card.text).toBe(validCardData.text);
    expect(card.editions).toEqual(validCardData.editions);
    expect(card.notes).toBe(validCardData.notes);
    expect(card.imageUrl).toBe(validCardData.imageUrl);
  });

  it('should validate a valid card', () => {
    const card = new Card(validCardData);
    expect(card.validate()).toBe(true);
  });

  it('should reject invalid text', () => {
    const card = new Card({ ...validCardData, text: '' });
    expect(card.validate()).toBe(false);
  });

  it('should reject invalid editions', () => {
    const card = new Card({ ...validCardData, editions: [] });
    expect(card.validate()).toBe(false);
  });

  it('should reject invalid edition names', () => {
    const card = new Card({ ...validCardData, editions: ['Invalid@Edition'] });
    expect(card.validate()).toBe(false);
  });

  it('should reject edition names longer than 30 characters', () => {
    const card = new Card({
      ...validCardData,
      editions: ['This is a very long edition name that exceeds thirty characters']
    });
    expect(card.validate()).toBe(false);
  });

  it('should reject invalid image URLs', () => {
    const card = new Card({ ...validCardData, imageUrl: 'not-a-url' });
    expect(card.validate()).toBe(false);
  });

  it('should convert to JSON', () => {
    const card = new Card(validCardData);
    const json = card.toJSON();
    expect(json).toEqual(validCardData);
  });

  it('should create from JSON', () => {
    const card = Card.fromJSON(validCardData);
    expect(card).toBeInstanceOf(Card);
    expect(card.toJSON()).toEqual(validCardData);
  });
}); 