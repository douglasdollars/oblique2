# Oblique Strategies Website - Development TODO

## Phase 1: Foundation

### ✅ Step 1.1: Project Setup and Build Tools

- [x] Set up basic project structure
  - [x] Create `src/` directory for source code
  - [x] Create `dist/` directory for built files
  - [x] Create `tests/` directory for test files
  - [x] Create `package.json` with appropriate dependencies
- [x] Install and configure development tools
  - [x] Install Webpack for bundling
  - [x] Install Jest for unit testing
  - [x] Install ESLint for code quality
  - [x] Install Prettier for code formatting
  - [x] Install CSS autoprefixer for cross-browser compatibility
- [x] Create webpack configuration
  - [x] Configure JavaScript module bundling
  - [x] Configure CSS file processing
  - [x] Set up development server
  - [x] Add ES6+ syntax support
- [x] Set up npm scripts
  - [x] `npm start` - development server
  - [x] `npm run build` - production build
  - [x] `npm test` - run tests
  - [x] `npm run lint` - code linting
- [x] Create basic test to ensure Jest is working correctly
- [x] Write tests for setup configuration

### ✅ Step 1.2: Basic HTML Structure and CSS Reset

- [x] Create `src/index.html`
  - [x] Add semantic HTML5 structure
  - [x] Add proper meta tags for responsive design
  - [x] Add basic accessibility attributes
  - [x] Add links to CSS and JS files
- [x] Create `src/styles/reset.css`
  - [x] Implement modern CSS reset/normalize
  - [x] Set box-sizing border-box for all elements
  - [x] Add basic typography reset
- [x] Create `src/styles/main.css`
  - [x] Add CSS Custom Properties for design system (colors, spacing, fonts)
  - [x] Create basic grid layout structure for header, main, and footer
  - [x] Implement mobile-first responsive approach
- [x] Set up basic page layout structure
  - [x] Add header for navigation
  - [x] Add main content area
  - [x] Add footer (initially hidden)
- [x] Write tests
  - [x] Verify HTML validates correctly
  - [x] Test CSS loads without errors
  - [x] Test basic responsive layout works
- [x] Ensure all styles follow black/dark grey background with golden accents color scheme

### ✅ Step 1.3: Core Data Model and Local Storage

- [x] Create `src/models/Card.js`
  - [x] Create Card class/object structure with properties: id, text, editions[], notes, imageUrl
  - [x] Add validation methods for required fields (text, editions)
  - [x] Implement edition name validation (30 chars max, alphanumeric + spaces only)
- [x] Create `src/services/StorageService.js`
  - [x] Create LocalStorage wrapper with error handling
  - [x] Implement getCards() method
  - [x] Implement saveCards() method
  - [x] Implement addCard() method
  - [x] Implement updateCard() method
  - [x] Implement deleteCard() method
  - [x] Add data serialization/deserialization
  - [x] Add storage quota checking
- [x] Create `src/services/CardService.js`
  - [x] Add business logic for card operations
  - [x] Implement random card selection with fallback handling
  - [x] Add card pool management
  - [x] Create fallback card creation ("[we've created mystery]")
- [x] Create initial seed data with at least 10 sample Oblique Strategy cards
- [x] Write comprehensive tests
  - [x] Test data model validation
  - [x] Test storage operations
  - [x] Test card service methods
  - [x] Test error handling scenarios
- [x] Include proper error boundaries and data validation throughout

### ✅ Step 1.4: Design System and Typography

- [x] Create `src/styles/design-system.css`
  - [x] Add primary colors: black (#000000), dark grey (#1a1a1a), gold (#ffd700)
  - [x] Add text colors: light grey for contrast, bright gold for accents
  - [x] Add spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
  - [x] Add border radius values
  - [x] Add box shadow definitions
- [x] Create `src/styles/typography.css`
  - [x] Select sans-serif font stack
  - [x] Define font size scale and line heights
  - [x] Create text styling utilities (center alignment, weights)
  - [x] Add responsive text scaling
- [x] Create `src/styles/components.css`
  - [x] Add button base styles with golden accents
  - [x] Add card base styles with paper texture
  - [x] Add table base styles
  - [x] Add form input base styles
- [x] Create utility classes
  - [x] Add text alignment and color variations
  - [x] Add spacing utilities (margin/padding)
  - [x] Add display and positioning utilities
- [x] Write tests
  - [x] Verify CSS custom properties are defined correctly
  - [x] Test typography scales appropriately
- [ ] Create `src/styles/design-system.css`
  - [ ] Add primary colors: black (#000000), dark grey (#1a1a1a), gold (#ffd700)
  - [ ] Add text colors: light grey for contrast, bright gold for accents
  - [ ] Add spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
  - [ ] Add border radius values
  - [ ] Add box shadow definitions
- [ ] Create `src/styles/typography.css`
  - [ ] Select sans-serif font stack
  - [ ] Define font size scale and line heights
  - [ ] Create text styling utilities (center alignment, weights)
  - [ ] Add responsive text scaling
- [ ] Create `src/styles/components.css`
  - [ ] Add button base styles with golden accents
  - [ ] Add card base styles with paper texture
  - [ ] Add table base styles
  - [ ] Add form input base styles
- [ ] Create utility classes
  - [ ] Add text alignment and color variations
  - [ ] Add spacing utilities (margin/padding)
  - [ ] Add display and positioning utilities
- [ ] Write tests
  - [ ] Verify CSS custom properties are defined correctly
  - [ ] Test typography scales appropriately
  - [ ] Test color contrast meets accessibility standards

### ✅ Step 1.5: Navigation Header Component

- [x] Create `src/components/Navigation.js`
  - [x] Create Navigation component class/module
  - [x] Add render method for header HTML structure
  - [x] Add event handlers for navigation links
  - [x] Add active state management
- [x] Implement header layout
  - [x] Add "Oblique Strategies" title in top-left (clickable, golden text)
  - [x] Add "About" and "Edit Cards" links in top-right (golden text)
  - [x] Ensure proper spacing and alignment
  - [x] Make mobile-responsive layout
- [x] Create `src/styles/navigation.css`
  - [x] Add header positioning and layout
  - [x] Add golden text styling with hover effects
  - [x] Add responsive behavior for smaller screens
  - [x] Add z-index management for layering
- [x] Create `src/router/Router.js`
  - [x] Implement basic hash-based routing system
  - [x] Add route registration and matching
  - [x] Add navigation event handling
  - [x] Add default route handling
- [x] Write tests
  - [x] Test navigation component rendering
  - [x] Test link click handling
  - [x] Test routing functionality
  - [x] Test responsive layout behavior
- [x] Integrate navigation into main application

---

## Phase 2: Basic Card Interface

### ✅ Step 2.1: Static Card Component

- [x] Create `src/components/Card.js`
  - [x] Create Card component class that renders individual cards
  - [x] Add methods for setting card content (text, front/back states)
  - [x] Add proper DOM element creation and management
  - [x] Add card state management (front/back)
- [x] Implement card structure
  - [x] Add card container with proper dimensions (7cm x 9cm ratio)
  - [x] Add front face with white background
  - [x] Add back face with black background
  - [x] Use proper semantic HTML structure
- [x] Create `src/styles/card.css`
  - [x] Set card dimensions and aspect ratio (7:9)
  - [x] Add base positioning and display properties
  - [x] Add border and shadow styling for realism
  - [x] Add transition properties for future animations
- [x] Create responsive scaling logic
  - [x] Ensure cards maintain aspect ratio across screen sizes
  - [x] Set maximum and minimum size constraints
  - [x] Add proper scaling for mobile devices
- [x] Write tests
  - [x] Test card component instantiation
  - [x] Test content rendering
  - [x] Test responsive scaling behavior
  - [x] Test DOM structure validation

### ✅ Step 2.2: Card Dimensions and Paper Texture

- [x] Update `src/styles/card.css`
  - [x] Set precise card dimensions maintaining 7cm x 9cm ratio
  - [x] Add CSS techniques for paper texture effect (subtle gradients, box-shadows)
  - [x] Add realistic depth and shadow effects
  - [x] Add proper border styling
- [x] Create texture and visual effects
  - [x] Add subtle paper grain using CSS patterns or pseudo-elements
  - [x] Add soft shadows for card depth
  - [x] Add slight rounded corners for realism
  - [x] Consider anti-aliasing
- [x] Optimize for different screen densities
  - [x] Add high DPI display support
  - [x] Ensure consistent appearance across devices
  - [x] Implement performance-conscious texture
- [x] Update responsive behavior
  - [x] Maintain texture quality at different sizes
  - [x] Ensure readability on smaller screens
  - [x] Preserve visual hierarchy
- [x] Write tests
  - [x] Test card visual rendering
  - [x] Test texture application
  - [x] Test cross-device consistency
  - [x] Test performance impact

### ✅ Step 2.3: Card Text Rendering and Centering

- [ ] Update `src/components/Card.js`
  - [ ] Add text content management and rendering
  - [ ] Add dynamic text sizing and line height calculation
  - [ ] Add text wrapping logic (maximum 3 lines)
  - [ ] Add vertical and horizontal centering algorithms
- [ ] Create `src/styles/card-text.css`
  - [ ] Set fixed font size that supports multi-line wrapping
  - [ ] Perfect vertical and horizontal centering using flexbox/grid
  - [ ] Optimize line height for readability
  - [ ] Handle text overflow
- [ ] Implement text processing features
  - [ ] Add automatic line breaking for long phrases
  - [ ] Ensure consistent spacing between lines
  - [ ] Handle edge cases (very short/long text)
  - [ ] Add special character support
- [ ] Add text accessibility features
  - [ ] Ensure proper contrast ratios
  - [ ] Use readable font selection
  - [ ] Add support for screen readers
  - [ ] Add keyboard navigation compatibility
- [ ] Write comprehensive tests
  - [ ] Test text rendering accuracy
  - [ ] Test centering behavior with various text lengths
  - [ ] Test line wrapping functionality
  - [ ] Test accessibility compliance

### ✅ Step 2.4: Card Stack Visualization

- [ ] Create `src/components/CardStack.js`
  - [ ] Create CardStack component that manages multiple card visuals
  - [ ] Add layering system for stacked card appearance
  - [ ] Add top card highlighting and interaction management
  - [ ] Add stack depth and offset calculations
- [ ] Implement stack visual effects
  - [ ] Add multiple card layers with proper z-index management
  - [ ] Add subtle offset positioning for depth illusion
  - [ ] Add shadow gradation for realistic stacking
  - [ ] Add consistent card back styling for stack layers
- [ ] Create `src/styles/card-stack.css`
  - [ ] Add positioning system for stacked cards
  - [ ] Add transform properties for offset effects
  - [ ] Add shadow and depth styling
  - [ ] Add responsive stack behavior
- [ ] Add stack interaction preparation
  - [ ] Add top card identification and highlighting
  - [ ] Add hover state management
  - [ ] Add click target preparation
  - [ ] Ensure stack stability during interactions
- [ ] Write tests
  - [ ] Test stack rendering with multiple cards
  - [ ] Test proper layering and z-index management
  - [ ] Test visual depth effects
  - [ ] Test responsive behavior

### ✅ Step 2.5: Random Card Selection Logic

- [ ] Update `src/services/CardService.js`
  - [ ] Add random card selection algorithm
  - [ ] Add fallback card generation for errors
  - [ ] Add card pool management and validation
  - [ ] Add selection history tracking (optional for debugging)
- [ ] Create `src/components/CardDisplay.js`
  - [ ] Integrate CardStack and Card components
  - [ ] Add card content updating mechanism
  - [ ] Add error state handling and fallback display
  - [ ] Add current card state management
- [ ] Implement card selection features
  - [ ] Add true random selection from full pool (allowing repeats)
  - [ ] Add graceful error handling with "[we've created mystery]" fallback
  - [ ] Add card content validation before display
  - [ ] Add performance optimization for large card pools
- [ ] Add debugging and testing utilities
  - [ ] Add card selection logging (development only)
  - [ ] Add test mode with predictable sequences
  - [ ] Add error simulation for testing
  - [ ] Add performance monitoring hooks
- [ ] Write comprehensive tests
  - [ ] Test random selection algorithm
  - [ ] Test fallback card generation
  - [ ] Test error handling scenarios
  - [ ] Test integration with storage service

### ✅ Step 2.6: "Another" Button Component

- [ ] Create `src/components/AnotherButton.js`
  - [ ] Create button component with proper event handling
  - [ ] Add click event management and delegation
  - [ ] Add button state management (enabled/disabled)
  - [ ] Add integration with card selection system
- [ ] Implement button styling in `src/styles/button.css`
  - [ ] Add black background with golden accents as specified
  - [ ] Add proper typography and spacing
  - [ ] Add button sizing and positioning below the card stack
  - [ ] Add accessibility features (focus indicators, ARIA labels)
- [ ] Add button functionality
  - [ ] Add click handler that triggers new card selection
  - [ ] Add integration with CardDisplay component
  - [ ] Add proper event propagation management
  - [ ] Add loading state handling during card transitions
- [ ] Implement basic interaction feedback
  - [ ] Add visual feedback on click (prepare for future animations)
  - [ ] Add proper cursor states
  - [ ] Add active/inactive state management
  - [ ] Add keyboard accessibility (Enter/Space key support)
- [ ] Write tests
  - [ ] Test button rendering and styling
  - [ ] Test click event handling
  - [ ] Test integration with card selection
  - [ ] Test accessibility features

### ✅ Step 2.7: Button Hover Effects and Click Handling

- [ ] Update `src/styles/button.css`
  - [ ] Add smooth hover transition effects
  - [ ] Add golden glow effect on hover as specified
  - [ ] Add proper transition timing and easing
  - [ ] Add focus and active state styling
- [ ] Enhance `src/components/AnotherButton.js`
  - [ ] Add complete click handling integration
  - [ ] Add hover state management
  - [ ] Add animation preparation hooks
  - [ ] Add event listener optimization
- [ ] Implement glow effect
  - [ ] Add CSS box-shadow based glow using golden colors
  - [ ] Add smooth transition in/out animations
  - [ ] Add intensity and spread control
  - [ ] Add performance optimization for the effect
- [ ] Add interaction polish
  - [ ] Add subtle scale or transform effects on hover
  - [ ] Add proper timing for visual feedback
  - [ ] Add consistent interaction patterns
  - [ ] Add mobile touch interaction optimization
- [ ] Write tests
  - [ ] Test hover effect application and removal
  - [ ] Test click handling integration
  - [ ] Test visual transition smoothness
  - [ ] Test cross-device interaction behavior

---

## Phase 3: Card Animations

### ✅ Step 3.1: Card Flip Animation Implementation

- [ ] Create `src/animations/CardFlip.js`
  - [ ] Create CardFlip animation class with configurable parameters
  - [ ] Add 3D transform-based flip animation (0.3 seconds as specified)
  - [ ] Add animation state management and callbacks
  - [ ] Add performance optimization using requestAnimationFrame
- [ ] Update `src/styles/card.css`
  - [ ] Add 3D perspective and transform-style properties
  - [ ] Add flip animation keyframes and transitions
  - [ ] Add proper backface visibility handling
  - [ ] Add hardware acceleration optimization
- [ ] Implement flip animation features
  - [ ] Add smooth rotation along the horizontal axis
  - [ ] Add front-to-back card face transitions
  - [ ] Add content update during animation midpoint
  - [ ] Add animation completion callbacks
- [ ] Add animation controls
  - [ ] Add start/stop animation methods
  - [ ] Add animation state querying
  - [ ] Add chain-able animation promises
  - [ ] Add error handling for animation failures
- [ ] Write comprehensive tests
  - [ ] Test animation timing and duration
  - [ ] Test proper card face transitions
  - [ ] Test content updates during animation
  - [ ] Test performance and memory management

### ✅ Step 3.2: Shuffle Animation Implementation

- [ ] Create `src/animations/ShuffleAnimation.js`
  - [ ] Create shuffle animation class with 0.5 second duration
  - [ ] Add card stack movement and rotation effects
  - [ ] Add realistic shuffling motion simulation
  - [ ] Add integration with CardFlip animation
- [ ] Implement shuffle visual effects
  - [ ] Add subtle card stack movement and rotation
  - [ ] Add staggered animation timing for multiple cards
  - [ ] Add realistic motion easing and physics
  - [ ] Add smooth transition to flip animation
- [ ] Update `src/styles/card-stack.css`
  - [ ] Add transform-based shuffle animations
  - [ ] Add proper z-index management during animation
  - [ ] Add hardware acceleration properties
  - [ ] Add animation keyframes for shuffle motion
- [ ] Create animation sequencing
  - [ ] Add shuffle animation followed by card flip
  - [ ] Add proper timing coordination between animations
  - [ ] Add animation state management across sequence
  - [ ] Add error handling and fallback behaviors
- [ ] Write tests
  - [ ] Test shuffle animation timing and motion
  - [ ] Test sequence coordination with card flip
  - [ ] Test visual continuity throughout animation
  - [ ] Test performance impact and optimization

### ✅ Step 3.3: Clickable Card with Press-Down Effect

- [ ] Update `src/components/CardStack.js`
  - [ ] Add click event handling for the top card
  - [ ] Add press-down visual effect on click
  - [ ] Add integration with shuffle and flip animations
  - [ ] Add touch device optimization
- [ ] Create press-down effect in `src/styles/card-interactions.css`
  - [ ] Add subtle scale and shadow reduction on click
  - [ ] Add smooth transition for press effect
  - [ ] Add proper timing to feel responsive
  - [ ] Add visual feedback that simulates physical pressing
- [ ] Implement interaction logic
  - [ ] Add click detection specifically for the top card
  - [ ] Add prevention of multiple simultaneous interactions
  - [ ] Add proper event handling and propagation
  - [ ] Add integration with existing animation system
- [ ] Add interaction states
  - [ ] Add hover effects for the clickable card
  - [ ] Add active/pressed state management
  - [ ] Add disabled state during animations
  - [ ] Add visual indicators for interactivity
- [ ] Write tests
  - [ ] Test click detection and handling
  - [ ] Test press-down effect application
  - [ ] Test animation triggering from card clicks
  - [ ] Test touch device compatibility

### ✅ Step 3.4: Spacebar Keyboard Support

- [ ] Create `src/services/KeyboardService.js`
  - [ ] Add global keyboard event management
  - [ ] Add spacebar detection and handling
  - [ ] Add event delegation and cleanup
  - [ ] Add focus management for accessibility
- [ ] Implement spacebar functionality
  - [ ] Add global spacebar listener for card shuffling
  - [ ] Add integration with existing shuffle/flip animation system
  - [ ] Add proper event prevention and handling
  - [ ] Add conflict resolution with form inputs
- [ ] Add keyboard accessibility features
  - [ ] Add visual focus indicators for keyboard users
  - [ ] Add proper ARIA attributes and roles
  - [ ] Add screen reader announcements for card changes
  - [ ] Add keyboard navigation support
- [ ] Create interaction management
  - [ ] Add coordination between mouse, touch, and keyboard inputs
  - [ ] Add prevention of conflicting simultaneous interactions
  - [ ] Add consistent behavior across input methods
  - [ ] Add error handling for edge cases
- [ ] Write comprehensive tests
  - [ ] Test spacebar event detection and handling
  - [ ] Test integration with animation system
  - [ ] Test accessibility compliance
  - [ ] Test cross-browser keyboard support

---

## Phase 4: Basic CRUD Foundation

### ✅ Step 4.1: Edit Cards Page Structure and Routing

- [ ] Update `src/router/Router.js`
  - [ ] Add route handling for '/edit-cards' path
  - [ ] Add page component loading and rendering
  - [ ] Add navigation state management
  - [ ] Add URL hash change detection
- [ ] Create `src/pages/EditCardsPage.js`
  - [ ] Create EditCardsPage component structure
  - [ ] Add basic page layout and container elements
  - [ ] Add integration with navigation system
  - [ ] Add page initialization and cleanup methods
- [ ] Create `src/styles/edit-cards.css`
  - [ ] Add page layout matching site aesthetic (black/gold theme)
  - [ ] Add container and section styling
  - [ ] Add responsive layout foundation
  - [ ] Add typography consistency with main site
- [ ] Implement page structure
  - [ ] Add header section for page title and actions
  - [ ] Add main content area for table and forms
  - [ ] Add proper semantic HTML structure
  - [ ] Add accessibility landmarks and navigation
- [ ] Write tests
  - [ ] Test route navigation to edit cards page
  - [ ] Test page component rendering
  - [ ] Test layout responsiveness
  - [ ] Test navigation integration

### ✅ Step 4.2: Basic Table Component with Static Data

- [ ] Create `src/components/CardsTable.js`
  - [ ] Create table component with header and row rendering
  - [ ] Add column definitions for: Card Text, Edition, Notes, Imagery URL
  - [ ] Add static test data for initial development
  - [ ] Add basic table structure and styling
- [ ] Implement table features
  - [ ] Add sortable column headers with click handlers
  - [ ] Add row rendering with proper data display
  - [ ] Add action column for edit/delete buttons (placeholder)
  - [ ] Add responsive table layout
- [ ] Create `src/styles/table.css`
  - [ ] Add table styling matching site theme
  - [ ] Add column width management and responsive behavior
  - [ ] Add header styling with sort indicators
  - [ ] Add row hover effects and visual hierarchy
- [ ] Add sorting functionality
  - [ ] Add column sorting state management
  - [ ] Add sort direction indicators (ascending/descending)
  - [ ] Add multi-column sorting preparation
  - [ ] Add alphanumeric sorting algorithms
- [ ] Write tests
  - [ ] Test table rendering with test data
  - [ ] Test column sorting functionality
  - [ ] Test responsive layout behavior
  - [ ] Test visual styling compliance

### ✅ Step 4.3: Add New Card Form with Validation

- [ ] Create `src/components/AddCardForm.js`
  - [ ] Create form component with all required fields
  - [ ] Add field validation and error handling
  - [ ] Add form submission and data processing
  - [ ] Add integration with CardService for data persistence
- [ ] Implement form fields
  - [ ] Add Card Text field (required, multi-line textarea)
  - [ ] Add Edition field (required, tag-based input - basic version)
  - [ ] Add Notes field (optional, textarea)
  - [ ] Add Imagery URL field (optional, URL input)
- [ ] Create `src/styles/forms.css`
  - [ ] Add form styling consistent with site theme
  - [ ] Add input field styling and focus states
  - [ ] Add error message styling and positioning
  - [ ] Add form layout and spacing
- [ ] Add validation logic
  - [ ] Add required field validation for Card Text and Edition
  - [ ] Add URL format validation for Imagery URL
  - [ ] Add edition name format validation (alphanumeric + spaces, 30 char max)
  - [ ] Add real-time validation feedback
- [ ] Write comprehensive tests
  - [ ] Test form rendering and field setup
  - [ ] Test validation logic for all fields
  - [ ] Test form submission and data handling
  - [ ] Test error state management and display

### ✅ Step 4.4: Edit Card Form with Field Population

- [ ] Create `src/components/EditCardForm.js`
  - [ ] Create edit form component based on AddCardForm
  - [ ] Add card data loading and field population
  - [ ] Add update vs. create mode handling
  - [ ] Add form state management for editing
- [ ] Implement edit functionality
  - [ ] Add loading existing card data into form fields
  - [ ] Add form submission handling for updates
  - [ ] Add integration with CardService update methods
  - [ ] Add cancel editing functionality
- [ ] Add edit mode features
  - [ ] Add form pre-population with existing card values
  - [ ] Add changed field tracking and validation
  - [ ] Add update confirmation and feedback
  - [ ] Add proper error handling for update failures
- [ ] Create edit interaction flow
  - [ ] Add edit button integration in table rows
  - [ ] Add modal or inline editing interface
  - [ ] Add form mode switching (add vs. edit)
  - [ ] Add navigation between edit and table views
- [ ] Write tests
  - [ ] Test form population with existing data
  - [ ] Test edit mode functionality
  - [ ] Test update operation success and failure cases
  - [ ] Test integration with table component

### ✅ Step 4.5: Delete Functionality with Confirmation

- [ ] Create `src/components/ConfirmationDialog.js`
  - [ ] Create reusable confirmation dialog component
  - [ ] Add customizable message and action buttons
  - [ ] Add modal overlay and focus management
  - [ ] Add keyboard navigation support (Escape, Enter)
- [ ] Implement delete functionality
  - [ ] Add delete button integration in table rows
  - [ ] Add confirmation dialog triggering
  - [ ] Add card removal from storage
  - [ ] Add table refresh after deletion
- [ ] Create `src/styles/dialog.css`
  - [ ] Add modal dialog styling with overlay
  - [ ] Add dialog positioning and responsiveness
  - [ ] Add button styling within dialog
  - [ ] Add animation for dialog appearance/disappearance
- [ ] Add safety measures
  - [ ] Add clear confirmation message: "Are you sure you want to delete this card?"
  - [ ] Add prominent cancel option
  - [ ] Add prevention of accidental deletions
  - [ ] Consider undo functionality (optional)
- [ ] Write comprehensive tests
  - [ ] Test confirmation dialog display and behavior
  - [ ] Test delete operation execution
  - [ ] Test dialog keyboard navigation
  - [ ] Test error handling for delete failures

### ✅ Step 4.6: Form Submission and Data Persistence

- [ ] Update `src/services/CardService.js`
  - [ ] Add complete CRUD operations (Create, Read, Update, Delete)
  - [ ] Add data validation and sanitization
  - [ ] Add error handling and logging
  - [ ] Add data integrity checks
- [ ] Implement automatic saving
  - [ ] Add form submission handling for add/edit operations
  - [ ] Add immediate data persistence to local storage
  - [ ] Add success/failure feedback to users
  - [ ] Add data synchronization preparation
- [ ] Create `src/components/StatusFeedback.js`
  - [ ] Add success/error message display system
  - [ ] Add auto-dismissing notifications
  - [ ] Add visual feedback integration (golden glow for success)
  - [ ] Add accessible announcements for screen readers
- [ ] Add data integrity features
  - [ ] Add duplicate detection and handling
  - [ ] Add data validation before persistence
  - [ ] Add rollback capabilities for failed operations
  - [ ] Add backup and recovery mechanisms
- [ ] Write comprehensive tests
  - [ ] Test all CRUD operations
  - [ ] Test data validation and error scenarios
  - [ ] Test user feedback display and timing
  - [ ] Test data integrity and consistency

---

## Phase 5: CRUD Advanced Features

### ✅ Step 5.1: Search Functionality Implementation

- [ ] Create `src/components/SearchBar.js`
  - [ ] Create search input component with live filtering
  - [ ] Add search term state management
  - [ ] Add debounced search to optimize performance
  - [ ] Add search result highlighting and feedback
- [ ] Implement search logic
  - [ ] Add real-time filtering of cards by text content
  - [ ] Add case-insensitive search algorithm
  - [ ] Add partial match support
  - [ ] Add search across multiple fields (card text, notes)
- [ ] Update `src/components/CardsTable.js`
  - [ ] Add integration with search functionality
  - [ ] Add filtered data display
  - [ ] Add search result count and feedback
  - [ ] Add no results state handling
- [ ] Create `src/styles/search.css`
  - [ ] Add search bar styling consistent with theme
  - [ ] Add search result highlighting
  - [ ] Add loading states during search
  - [ ] Add mobile-responsive search interface
- [ ] Write tests
  - [ ] Test search functionality accuracy
  - [ ] Test performance with large datasets
  - [ ] Test real-time filtering behavior
  - [ ] Test search result display and highlighting

### ✅ Step 5.2: Edition Tag-Based Input Component

- [ ] Create `src/components/TagInput.js`
  - [ ] Create tag-based input component for edition selection
  - [ ] Add tag creation, editing, and deletion
  - [ ] Add visual tag representation with styling
  - [ ] Add multiple tag selection support
- [ ] Implement tag functionality
  - [ ] Add new tags by typing and pressing Enter
  - [ ] Add tag removal with click or backspace
  - [ ] Add tag validation (30 char limit, alphanumeric + spaces)
  - [ ] Add visual feedback for validation errors
- [ ] Create `src/styles/tag-input.css`
  - [ ] Add tag styling with golden accents
  - [ ] Add input field integration with tags
  - [ ] Add tag removal buttons and hover effects
  - [ ] Add responsive tag layout and wrapping
- [ ] Add tag management features
  - [ ] Add duplicate tag prevention
  - [ ] Add tag list state management
  - [ ] Add integration with form validation
  - [ ] Add accessibility support for screen readers
- [ ] Write comprehensive tests
  - [ ] Test tag creation and removal
  - [ ] Test validation logic and error handling
  - [ ] Test integration with card forms
  - [ ] Test accessibility compliance

### ✅ Step 5.3: Edition Autocomplete Functionality

- [ ] Update `src/components/TagInput.js`
  - [ ] Add autocomplete dropdown integration
  - [ ] Add existing edition suggestion display
  - [ ] Add keyboard navigation for suggestions
  - [ ] Add selection and completion handling
- [ ] Create `src/services/EditionService.js`
  - [ ] Add edition data management and caching
  - [ ] Add autocomplete search algorithms
  - [ ] Add edition usage tracking and popularity
  - [ ] Add new edition creation handling
- [ ] Implement autocomplete features
  - [ ] Add dynamic suggestion filtering as user types
  - [ ] Add fuzzy matching for typos and partial matches
  - [ ] Add recent/popular editions prioritization
  - [ ] Add new edition creation when no matches found
- [ ] Create `src/styles/autocomplete.css`
  - [ ] Add dropdown styling and positioning
  - [ ] Add suggestion item highlighting
  - [ ] Add keyboard navigation visual feedback
  - [ ] Add loading states and empty results styling
- [ ] Write tests
  - [ ] Test autocomplete suggestion accuracy
  - [ ] Test keyboard navigation functionality
  - [ ] Test new edition creation workflow
  - [ ] Test performance with large edition lists

### ✅ Step 5.4: Table Sorting by Columns

- [ ] Update `src/components/CardsTable.js`
  - [ ] Add multi-column sorting support
  - [ ] Add sort state management and persistence
  - [ ] Add visual sort indicators in column headers
  - [ ] Add sort direction toggling (asc/desc/none)
- [ ] Create `src/utils/SortingUtils.js`
  - [ ] Add sorting algorithms for different data types
  - [ ] Add string, number, and date comparison functions
  - [ ] Add multi-level sorting logic
  - [ ] Add stable sorting implementation
- [ ] Implement sorting features
  - [ ] Add click-to-sort on column headers
  - [ ] Add visual indicators for current sort state
  - [ ] Add secondary sort column support
  - [ ] Add sort persistence across page refreshes
- [ ] Update `src/styles/table.css`
  - [ ] Add sort indicator styling (arrows, icons)
  - [ ] Add hover effects for sortable columns
  - [ ] Add active sort column highlighting
  - [ ] Add responsive sort controls
- [ ] Write comprehensive tests
  - [ ] Test sorting accuracy for all data types
  - [ ] Test multi-column sorting behavior
  - [ ] Test sort state persistence
  - [ ] Test visual indicator updates

### ✅ Step 5.5: Pagination Component

- [ ] Create `src/components/Pagination.js`
  - [ ] Create pagination component with page number links
  - [ ] Add Previous/Next navigation buttons
  - [ ] Add page size management (25 cards per page)
  - [ ] Add current page state and navigation
- [ ] Implement pagination logic
  - [ ] Add page calculation and range management
  - [ ] Add data slicing for current page display
  - [ ] Add URL state management for bookmarkable pages
  - [ ] Add edge case handling (empty data, single page)
- [ ] Create `src/styles/pagination.css`
  - [ ] Add pagination styling with golden accents
  - [ ] Add button and link styling consistent with theme
  - [ ] Add active page highlighting
  - [ ] Add responsive pagination layout
- [ ] Add pagination features
  - [ ] Add numbered page links with range ellipsis
  - [ ] Add jump to first/last page functionality
  - [ ] Consider page size selector (future consideration)
  - [ ] Add keyboard navigation support
- [ ] Write tests
  - [ ] Test pagination calculation accuracy
  - [ ] Test navigation functionality
  - [ ] Test data slicing and display
  - [ ] Test URL state management

### ✅ Step 5.6: Dynamic Table Updates and Visual Feedback

- [ ] Update `src/components/CardsTable.js`
  - [ ] Add real-time table updates for add/edit/delete operations
  - [ ] Add row-level visual feedback (golden glow for saves)
  - [ ] Add smooth transitions for table changes
  - [ ] Add optimistic UI updates
- [ ] Create `src/animations/TableAnimations.js`
  - [ ] Add row highlight animations for save feedback
  - [ ] Add smooth row insertion and removal animations
  - [ ] Add table sorting transition effects
  - [ ] Add loading state animations
- [ ] Implement visual feedback system
  - [ ] Add golden glow effect for successful saves (as specified)
  - [ ] Add error highlighting for failed operations
  - [ ] Add loading indicators for async operations
  - [ ] Add success/error message integration
- [ ] Add advanced table features
  - [ ] Add bulk operation preparation
  - [ ] Add selection state management
  - [ ] Add keyboard shortcuts for common actions
  - [ ] Consider undo/redo functionality
- [ ] Write comprehensive tests
  - [ ] Test dynamic update functionality
  - [ ] Test visual feedback timing and appearance
  - [ ] Test animation performance and smoothness
  - [ ] Test user interaction responsiveness

---

## Phase 6: Offline and Sync

### ✅ Step 6.1: Offline Detection and Local Storage Management

- [ ] Create `src/services/OfflineService.js`
  - [ ] Add online/offline state detection and monitoring
  - [ ] Add event handling for connectivity changes
  - [ ] Add offline mode state management
  - [ ] Add local storage quota monitoring and management
- [ ] Implement offline storage
  - [ ] Add complete card data caching in local storage
  - [ ] Add offline operation queuing for sync
  - [ ] Add data versioning and conflict detection
  - [ ] Add storage cleanup and optimization
- [ ] Create `src/services/PWAService.js`
  - [ ] Add service worker registration and management
  - [ ] Add cache strategies for offline functionality
  - [ ] Add background sync preparation
  - [ ] Add Progressive Web App manifest setup
- [ ] Add offline indicators
  - [ ] Add visual indicators for offline/online status
  - [ ] Add offline mode notifications
  - [ ] Add operation queuing feedback
  - [ ] Add data freshness indicators
- [ ] Write comprehensive tests
  - [ ] Test offline detection accuracy
  - [ ] Test local storage operations
  - [ ] Test data caching and retrieval
  - [ ] Test connectivity change handling

### ✅ Step 6.2: Data Synchronization Logic

- [ ] Create `src/services/SyncService.js`
  - [ ] Add automatic sync triggering when online
  - [ ] Add conflict detection and resolution logic
  - [ ] Add sync queue management and processing
  - [ ] Add error handling and retry mechanisms
- [ ] Implement sync strategies
  - [ ] Add silent background synchronization
  - [ ] Add online version prioritization for conflicts
  - [ ] Add batch sync operations for efficiency
  - [ ] Add progressive sync with user feedback
- [ ] Add sync conflict resolution
  - [ ] Add server data priority implementation
  - [ ] Add local change discarding for conflicts
  - [ ] Add sync status tracking and logging
  - [ ] Add user notification for major conflicts (optional)
- [ ] Create sync monitoring
  - [ ] Add sync progress tracking
  - [ ] Add background sync scheduling
  - [ ] Add bandwidth optimization
  - [ ] Add sync failure recovery
- [ ] Write tests
  - [ ] Test sync trigger accuracy
  - [ ] Test conflict resolution behavior
  - [ ] Test data integrity after sync
  - [ ] Test error handling and recovery

### ✅ Step 6.3: Conflict Resolution Logic

- [ ] Update `src/services/SyncService.js`
  - [ ] Add detailed conflict detection algorithms
  - [ ] Add server data prioritization logic
  - [ ] Add local change discarding procedures
  - [ ] Add conflict logging and analytics
- [ ] Create conflict resolution workflow
  - [ ] Add timestamp-based conflict detection
  - [ ] Add data comparison and diff algorithms
  - [ ] Add automatic resolution without user intervention
  - [ ] Add silent conflict handling as specified
- [ ] Implement data integrity measures
  - [ ] Add pre-sync data backup
  - [ ] Add rollback capabilities for sync failures
  - [ ] Add data validation after conflict resolution
  - [ ] Add consistency checks across all operations
- [ ] Add conflict prevention
  - [ ] Add optimistic locking strategies
  - [ ] Add real-time data freshness checking
  - [ ] Add preventive sync scheduling
  - [ ] Add user activity monitoring for sync timing
- [ ] Write comprehensive tests
  - [ ] Test conflict detection accuracy
  - [ ] Test resolution logic correctness
  - [ ] Test data integrity preservation
  - [ ] Test silent operation verification

### ✅ Step 6.4: Background Sync and Error Handling

- [ ] Create `src/services/BackgroundSync.js`
  - [ ] Add service worker background sync integration
  - [ ] Add scheduled sync operations
  - [ ] Add retry logic with exponential backoff
  - [ ] Add network-aware sync scheduling
- [ ] Implement error handling
  - [ ] Add comprehensive error categorization and handling
  - [ ] Add graceful degradation for sync failures
  - [ ] Add user notification for critical errors
  - [ ] Add automatic recovery mechanisms
- [ ] Add sync optimization
  - [ ] Add intelligent sync scheduling
  - [ ] Add bandwidth usage optimization
  - [ ] Add battery usage consideration
  - [ ] Add data compression for sync operations
- [ ] Create monitoring and debugging
  - [ ] Add sync operation logging
  - [ ] Add performance metrics collection
  - [ ] Add debug tools for development
  - [ ] Add health monitoring for production
- [ ] Write extensive tests
  - [ ] Test background sync functionality
  - [ ] Test error handling scenarios
  - [ ] Test performance under various conditions
  - [ ] Test recovery from failure states

---

## Phase 7: Polish and Extras

### ✅ Step 7.1: Footer Component with Credits

- [ ] Create `src/components/Footer.js`
  - [ ] Create footer component with scroll-triggered visibility
  - [ ] Add credits text rendering and styling
  - [ ] Add responsive footer layout
  - [ ] Add integration with all pages
- [ ] Implement footer behavior
  - [ ] Add scroll-to-view functionality (off-screen by default)
  - [ ] Add consistent behavior across all pages
  - [ ] Add proper positioning and spacing
  - [ ] Add mobile-responsive footer scaling
- [ ] Create `src/styles/footer.css`
  - [ ] Add footer positioning and layout
  - [ ] Add credits text styling (light color, centered)
  - [ ] Add responsive design for smaller screens
  - [ ] Add z-index management for proper layering
- [ ] Add footer content
  - [ ] Add "Concept and cards by Brian Eno and Peter Schmidt" text
  - [ ] Add proper typography and spacing
  - [ ] Add accessibility attributes and semantic markup
  - [ ] Add copyright and attribution handling
- [ ] Write tests
  - [ ] Test footer visibility behavior
  - [ ] Test scroll detection accuracy
  - [ ] Test cross-page consistency
  - [ ] Test responsive layout functionality

### ✅ Step 7.2: Glowing Leaf Animation

- [ ] Create `src/animations/LeafGlow.js`
  - [ ] Create leaf animation component with CSS animation control
  - [ ] Add 4-second glow cycle with continuous looping
  - [ ] Add golden to brighter gold color transitions
  - [ ] Add animation performance optimization
- [ ] Implement the glow effect
  - [ ] Add North West Pointing Leaf Unicode symbol (🍃) usage
  - [ ] Add CSS-based phasing glow animation
  - [ ] Add smooth color transitions and intensity changes
  - [ ] Add hardware acceleration optimization
- [ ] Create `src/styles/leaf-animation.css`
  - [ ] Add keyframe animation for glow effect
  - [ ] Add color transition definitions (golden to bright gold)
  - [ ] Add animation timing and easing curves
  - [ ] Add responsive scaling for different screen sizes
- [ ] Add animation controls
  - [ ] Add automatic animation start on component mount
  - [ ] Add animation pause/resume capabilities
  - [ ] Add performance monitoring and throttling
  - [ ] Add accessibility considerations (prefers-reduced-motion)
- [ ] Write tests
  - [ ] Test animation timing accuracy (4-second cycle)
  - [ ] Test color transition smoothness
  - [ ] Test performance impact measurement
  - [ ] Test accessibility compliance

### ✅ Step 7.3: About Page Content and Styling

- [ ] Create `src/pages/AboutPage.js`
  - [ ] Create About page component structure
  - [ ] Add content rendering and layout management
  - [ ] Add integration with navigation system
  - [ ] Add responsive content layout
- [ ] Implement About page content
  - [ ] Add explanation of Oblique Strategies concept and purpose
  - [ ] Add background information on Brian Eno and Peter Schmidt
  - [ ] Add history and development of the card system
  - [ ] Add usage instructions and creative applications
- [ ] Create `src/styles/about.css`
  - [ ] Add typography and content styling consistent with site theme
  - [ ] Add reading-optimized layout and spacing
  - [ ] Add responsive design for various screen sizes
  - [ ] Add visual hierarchy and content organization
- [ ] Add content features
  - [ ] Add structured content with proper headings
  - [ ] Add readable typography and line spacing
  - [ ] Add accessibility features (proper heading structure, alt text)
  - [ ] Add links to external resources (if appropriate)
- [ ] Write tests
  - [ ] Test content rendering accuracy
  - [ ] Test page layout responsiveness
  - [ ] Test accessibility compliance
  - [ ] Test navigation integration

### ✅ Step 7.4: Responsive Design Implementation

- [ ] Update all CSS files
  - [ ] Add mobile-first responsive breakpoints
  - [ ] Add flexible grid systems and layouts
  - [ ] Add scalable typography and spacing
  - [ ] Add touch-friendly interaction targets
- [ ] Enhance component responsiveness
  - [ ] Add card scaling and proportions for mobile devices
  - [ ] Add table layout adjustments (stacked layout for small screens)
  - [ ] Add navigation menu adaptations
  - [ ] Add form layout optimizations
- [ ] Create `src/styles/responsive.css`
  - [ ] Add media query definitions and breakpoints
  - [ ] Add responsive utility classes
  - [ ] Add mobile-specific overrides
  - [ ] Add tablet and desktop enhancements
- [ ] Implement responsive features
  - [ ] Add touch gesture support for mobile
  - [ ] Add larger tap targets for mobile interactions
  - [ ] Add keyboard navigation for desktop
  - [ ] Add performance optimizations for different devices
- [ ] Write comprehensive tests
  - [ ] Test layout behavior across all breakpoints
  - [ ] Test touch interaction functionality
  - [ ] Test cross-device compatibility
  - [ ] Test performance on various devices

### ✅ Step 7.5: Final Error Handling and Fallback Card

- [ ] Create `src/services/ErrorService.js`
  - [ ] Add global error handling and logging
  - [ ] Add user-friendly error message generation
  - [ ] Add error recovery and fallback mechanisms
  - [ ] Add error reporting and analytics preparation
- [ ] Implement fallback systems
  - [ ] Add "[we've created mystery]" fallback card implementation
  - [ ] Add graceful degradation for all features
  - [ ] Add service worker fallbacks for offline scenarios
  - [ ] Add default content for missing data
- [ ] Add final polish features
  - [ ] Add loading states and smooth transitions
  - [ ] Add performance optimization and code splitting
  - [ ] Add security measures and input sanitization
  - [ ] Add final accessibility audit and improvements
- [ ] Create comprehensive testing
  - [ ] Add end-to-end testing scenarios
  - [ ] Add error condition simulation and testing
  - [ ] Add performance testing and optimization
  - [ ] Add cross-browser compatibility verification
- [ ] Write final tests
  - [ ] Test complete application functionality
  - [ ] Test error handling in all scenarios
  - [ ] Test performance benchmarks
  - [ ] Test production readiness verification

---

## Final Checklist

### 🚀 Deployment Preparation

- [ ] Run final build and optimization
- [ ] Verify all tests pass
- [ ] Check cross-browser compatibility
- [ ] Validate accessibility compliance
- [ ] Test offline functionality
- [ ] Verify responsive design on all devices
- [ ] Check performance metrics
- [ ] Validate error handling scenarios
- [ ] Test with realistic data volumes
- [ ] Create deployment documentation

### 📝 Documentation

- [ ] Update README.md with setup instructions
- [ ] Document API and component interfaces
- [ ] Create user guide for card management
- [ ] Document deployment process
- [ ] Create troubleshooting guide

### ✅ Quality Assurance

- [ ] Code review and cleanup
- [ ] Security audit
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Edge case testing
- [ ] User acceptance testing
