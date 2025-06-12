/**
 * Card class representing an Oblique Strategy card
 */
export class Card {
  /**
   * Create a new Card instance
   * @param {Object} data - Card data
   * @param {string} data.id - Unique identifier
   * @param {string} data.text - Card text content
   * @param {string[]} data.editions - Array of edition names
   * @param {string} [data.notes] - Optional notes
   * @param {string} [data.imageUrl] - Optional image URL
   */
  constructor({ id, text, editions, notes = '', imageUrl = '' }) {
    this.id = id;
    this.text = text;
    this.editions = editions;
    this.notes = notes;
    this.imageUrl = imageUrl;
  }

  /**
   * Validate the card data
   * @returns {boolean} True if valid, false otherwise
   */
  validate() {
    return (
      this.validateText() &&
      this.validateEditions() &&
      this.validateNotes() &&
      this.validateImageUrl()
    );
  }

  /**
   * Validate the card text
   * @returns {boolean} True if valid, false otherwise
   */
  validateText() {
    return typeof this.text === 'string' && this.text.trim().length > 0;
  }

  /**
   * Validate the editions array
   * @returns {boolean} True if valid, false otherwise
   */
  validateEditions() {
    return (
      Array.isArray(this.editions) &&
      this.editions.length > 0 &&
      this.editions.every(edition => this.validateEditionName(edition))
    );
  }

  /**
   * Validate a single edition name
   * @param {string} edition - Edition name to validate
   * @returns {boolean} True if valid, false otherwise
   */
  validateEditionName(edition) {
    if (typeof edition !== 'string') return false;
    const trimmed = edition.trim();
    return (
      trimmed.length > 0 &&
      trimmed.length <= 30 &&
      /^[a-zA-Z0-9\s]+$/.test(trimmed)
    );
  }

  /**
   * Validate the notes field
   * @returns {boolean} True if valid, false otherwise
   */
  validateNotes() {
    return typeof this.notes === 'string';
  }

  /**
   * Validate the image URL
   * @returns {boolean} True if valid, false otherwise
   */
  validateImageUrl() {
    if (!this.imageUrl) return true;
    try {
      new URL(this.imageUrl);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Convert card to plain object
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      text: this.text,
      editions: this.editions,
      notes: this.notes,
      imageUrl: this.imageUrl
    };
  }

  /**
   * Create a Card instance from plain object
   * @param {Object} data - Card data
   * @returns {Card} New Card instance
   */
  static fromJSON(data) {
    return new Card(data);
  }
} 