# Website Specification: Oblique Strategies

## Website Overview

A website inspired by the "Oblique Strategies" cards, designed to provide creative inspiration by drawing cards at random. The site features a clean, tactile design with dark backgrounds, golden accents, and realistic card styling.

---

## Core Features

### 1. Card Drawing Interface

- **Card Stack**: Cards appear in a stack with only the top card visible.
- **Shuffle and Draw**:
  - Users can shuffle and draw a new card by:
    - Clicking the **"another" button** (black with gold accents, glowing on hover).
    - Clicking the visible top card (with a press-down effect).
  - Shuffle animation: **0.5 seconds**.
  - Card flip animation: **0.3 seconds**.
- **Random Draw**: Cards are drawn completely at random from the full pool, allowing repeats.
- **Fallback Card**: If there are issues (e.g., missing data), a card will appear with the text: **"[we've created mystery]"**.

### 2. Card Design

- **Back**: Black.
- **Front**: White paper-textured background.
- **Dimensions**: **7 cm x 9 cm** (2.8 in x 3.5 in).
- **Text**:
  - Simple, centered sans-serif text.
  - Fixed size, allowing wrapping (up to 3 lines).
  - No additional styling beyond centering.

### 3. Navigation

- **Title**: "Oblique Strategies" in the top-left (golden text), clickable to return to the main interface.
- **Links**: "About" and "Edit Cards" in the top-right (golden text).

### 4. Footer

- **Visibility**: Appears only when scrolling to the bottom of the page.
- **Text**: **"Concept and cards by Brian Eno and Peter Schmidt"** (centered, light color).
- **Separator**: **North West Pointing Leaf Unicode symbol (🍃)** with a subtle phasing glow (4 seconds, looping).

---

## "About" Page

- Explains the concept of Oblique Strategies.
- Provides background on Brian Eno and Peter Schmidt.
- Styled to match the site's aesthetic.

---

## "Edit Cards" Section

### 1. Features

- **Table View**:
  - Sortable columns: Card Text, Edition, Notes, Imagery URL.
  - Pagination: 25 cards per page.
- **Search and Filters**:
  - Search bar for card text.
  - Filters for editions (both dynamically update the table).
- **Edit and Delete**:
  - **Edit Icon**: Opens a form to modify card fields (Card Text, Edition, Notes, Imagery URL).
  - **Delete Icon**: Triggers a confirmation dialog before removing the card.

### 2. Editing Cards

- **Fields**:
  - **Card Text**: Required, cannot be blank.
  - **Edition**: Required, supports multiple editions via tag-based input with autocomplete.
  - **Notes**: Optional.
  - **Imagery URL**: Optional, metadata only for now.
- **Edition Names**:
  - Limited to numbers, spaces, and standard text characters.
  - Maximum length: 30 characters.
- **Saving**:
  - Automatic saving with visual feedback (row briefly glows gold).

### 3. Offline Functionality

- Users can add, edit, and delete cards offline.
- Changes sync automatically when back online.
- **Conflict Resolution**: Online version is prioritized (silent discard of offline changes).

---

## Design and Responsiveness

### 1. Aesthetic

- **Colors**: Black or dark grey backgrounds with golden accents.
- **Consistency**: Styling is consistent across all pages (including "Edit Cards" and "About").
- **Responsive Design**:
  - Stacked layout for tables on smaller screens.
  - Larger buttons for easier tapping.
  - Scaled cards and footer elements.

### 2. Animations

- Smooth shuffle and card flip animations.
- Glowing leaf separator in the footer (golden to brighter gold, 4-second loop).

### 3. Offline Support

- Entire card pool cached via local storage.
- Silent updates when back online.

---

## Exclusions

- No analytics or tracking.
- No export functionality.
- No settings or customization options.
- No favicon or browser tab branding.

---
