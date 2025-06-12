# Development Blueprint: Oblique Strategies Website

## Architecture Overview

This project will be built as a Progressive Web App using vanilla JavaScript, HTML5, and CSS3 to maintain simplicity while providing offline functionality. The architecture will consist of:

- **Frontend**: Vanilla JS with modular components
- **Storage**: Local Storage for offline capability + JSON file/API for data persistence
- **Styling**: CSS3 with CSS Custom Properties for theming
- **Testing**: Jest for unit testing, Cypress for integration testing
- **Build**: Webpack for bundling and optimization

## Development Phases

The project is broken down into 7 phases with 37 total steps, each building incrementally on the previous work.

---

## Phase 1: Foundation (5 steps)

### Step 1.1: Project Setup and Build Tools

```
Create a new Oblique Strategies website project with the following requirements:

1. Set up a basic project structure with:
   - `src/` directory for source code
   - `dist/` directory for built files
   - `tests/` directory for test files
   - `package.json` with appropriate dependencies

2. Install and configure:
   - Webpack for bundling
   - Jest for unit testing
   - ESLint for code quality
   - Prettier for code formatting
   - CSS autoprefixer for cross-browser compatibility

3. Create a basic webpack configuration that:
   - Bundles JavaScript modules
   - Processes CSS files
   - Serves files during development
   - Supports ES6+ syntax

4. Set up npm scripts for:
   - `npm start` - development server
   - `npm run build` - production build
   - `npm test` - run tests
   - `npm run lint` - code linting

5. Create a basic test to ensure Jest is working correctly

Write all code with proper error handling and include comprehensive tests for the setup configuration.
```

### Step 1.2: Basic HTML Structure and CSS Reset

```
Building on the previous project setup, create the basic HTML structure and CSS foundation:

1. Create `src/index.html` with:
   - Semantic HTML5 structure
   - Proper meta tags for responsive design
   - Basic accessibility attributes
   - Links to CSS and JS files

2. Create `src/styles/reset.css` with:
   - Modern CSS reset/normalize
   - Box-sizing border-box for all elements
   - Basic typography reset

3. Create `src/styles/main.css` with:
   - CSS Custom Properties for the design system (colors, spacing, fonts)
   - Basic grid layout structure for header, main, and footer
   - Mobile-first responsive approach

4. Set up the basic page layout structure:
   - Header for navigation
   - Main content area
   - Footer (initially hidden)

5. Write tests to verify:
   - HTML validates correctly
   - CSS loads without errors
   - Basic responsive layout works

Ensure all styles follow the specification's black/dark grey background with golden accents color scheme.
```

### Step 1.3: Core Data Model and Local Storage

```
Create the core data management system for the Oblique Strategies cards:

1. Create `src/models/Card.js` with:
   - Card class/object structure with properties: id, text, editions[], notes, imageUrl
   - Validation methods for required fields (text, editions)
   - Edition name validation (30 chars max, alphanumeric + spaces only)

2. Create `src/services/StorageService.js` with:
   - LocalStorage wrapper with error handling
   - Methods for: getCards(), saveCards(), addCard(), updateCard(), deleteCard()
   - Data serialization/deserialization
   - Storage quota checking

3. Create `src/services/CardService.js` with:
   - Business logic for card operations
   - Random card selection with fallback handling
   - Card pool management
   - Fallback card creation ("[we've created mystery]")

4. Create initial seed data with at least 10 sample Oblique Strategy cards

5. Write comprehensive tests for:
   - Data model validation
   - Storage operations
   - Card service methods
   - Error handling scenarios

Include proper error boundaries and data validation throughout.
```

### Step 1.4: Design System and Typography

```
Implement the complete design system and typography based on the specification:

1. Create `src/styles/design-system.css` with CSS Custom Properties for:
   - Primary colors: black (#000000), dark grey (#1a1a1a), gold (#ffd700)
   - Text colors: light grey for contrast, bright gold for accents
   - Spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
   - Border radius values
   - Box shadow definitions

2. Create `src/styles/typography.css` with:
   - Sans-serif font stack selection
   - Font size scale and line heights
   - Text styling utilities (center alignment, weights)
   - Responsive text scaling

3. Create `src/styles/components.css` for reusable component styles:
   - Button base styles with golden accents
   - Card base styles with paper texture
   - Table base styles
   - Form input base styles

4. Create utility classes for:
   - Text alignment and color variations
   - Spacing (margin/padding utilities)
   - Display and positioning utilities

5. Write tests to verify:
   - CSS custom properties are defined correctly
   - Typography scales appropriately
   - Color contrast meets accessibility standards

Focus on creating a cohesive, maintainable design system that matches the specification's aesthetic.
```

### Step 1.5: Navigation Header Component

```
Create the navigation header component with title and menu links:

1. Create `src/components/Navigation.js` with:
   - Navigation component class/module
   - Render method for header HTML structure
   - Event handlers for navigation links
   - Active state management

2. Implement the header layout with:
   - "Oblique Strategies" title in top-left (clickable, golden text)
   - "About" and "Edit Cards" links in top-right (golden text)
   - Proper spacing and alignment
   - Mobile-responsive layout

3. Create `src/styles/navigation.css` with:
   - Header positioning and layout
   - Golden text styling with hover effects
   - Responsive behavior for smaller screens
   - Z-index management for layering

4. Create `src/router/Router.js` with:
   - Basic hash-based routing system
   - Route registration and matching
   - Navigation event handling
   - Default route handling

5. Write tests for:
   - Navigation component rendering
   - Link click handling
   - Routing functionality
   - Responsive layout behavior

Integrate the navigation into the main application and ensure it functions correctly across different screen sizes.
```

---

## Phase 2: Basic Card Interface (7 steps)

### Step 2.1: Static Card Component

```
Create the basic card component with proper styling and structure:

1. Create `src/components/Card.js` with:
   - Card component class that renders individual cards
   - Methods for setting card content (text, front/back states)
   - Proper DOM element creation and management
   - Card state management (front/back)

2. Implement card structure with:
   - Card container with proper dimensions (7cm x 9cm ratio)
   - Front face with white background
   - Back face with black background
   - Proper semantic HTML structure

3. Create `src/styles/card.css` with:
   - Card dimensions and aspect ratio (7:9)
   - Base positioning and display properties
   - Border and shadow styling for realism
   - Transition properties for future animations

4. Create responsive scaling logic:
   - Cards maintain aspect ratio across screen sizes
   - Maximum and minimum size constraints
   - Proper scaling for mobile devices

5. Write tests for:
   - Card component instantiation
   - Content rendering
   - Responsive scaling behavior
   - DOM structure validation

Ensure the card component is reusable and properly encapsulated for future animation work.
```

### Step 2.2: Card Dimensions and Paper Texture

```
Enhance the card component with realistic paper texture and proper dimensions:

1. Update `src/styles/card.css` with:
   - Precise card dimensions maintaining 7cm x 9cm ratio
   - CSS techniques for paper texture effect (subtle gradients, box-shadows)
   - Realistic depth and shadow effects
   - Proper border styling

2. Create texture and visual effects:
   - Subtle paper grain using CSS patterns or pseudo-elements
   - Soft shadows for card depth
   - Slight rounded corners for realism
   - Anti-aliasing considerations

3. Optimize for different screen densities:
   - High DPI display support
   - Consistent appearance across devices
   - Performance-conscious texture implementation

4. Update responsive behavior:
   - Maintain texture quality at different sizes
   - Ensure readability on smaller screens
   - Preserve visual hierarchy

5. Write tests for:
   - Card visual rendering
   - Texture application
   - Cross-device consistency
   - Performance impact

Focus on creating a realistic, tactile appearance that matches the physical Oblique Strategies cards.
```

### Step 2.3: Card Text Rendering and Centering

```
Implement the text rendering system for card content with proper centering and wrapping:

1. Update `src/components/Card.js` with:
   - Text content management and rendering
   - Dynamic text sizing and line height calculation
   - Text wrapping logic (maximum 3 lines)
   - Vertical and horizontal centering algorithms

2. Create `src/styles/card-text.css` with:
   - Fixed font size that supports multi-line wrapping
   - Perfect vertical and horizontal centering using flexbox/grid
   - Line height optimization for readability
   - Text overflow handling

3. Implement text processing features:
   - Automatic line breaking for long phrases
   - Consistent spacing between lines
   - Handling of edge cases (very short/long text)
   - Special character support

4. Add text accessibility features:
   - Proper contrast ratios
   - Readable font selection
   - Support for screen readers
   - Keyboard navigation compatibility

5. Write comprehensive tests for:
   - Text rendering accuracy
   - Centering behavior with various text lengths
   - Line wrapping functionality
   - Accessibility compliance

Ensure text appears exactly as specified: simple, centered sans-serif with no additional styling.
```

### Step 2.4: Card Stack Visualization

```
Create the visual card stack effect showing multiple cards with only the top card visible:

1. Create `src/components/CardStack.js` with:
   - CardStack component that manages multiple card visuals
   - Layering system for stacked card appearance
   - Top card highlighting and interaction management
   - Stack depth and offset calculations

2. Implement stack visual effects:
   - Multiple card layers with proper z-index management
   - Subtle offset positioning for depth illusion
   - Shadow gradation for realistic stacking
   - Consistent card back styling for stack layers

3. Create `src/styles/card-stack.css` with:
   - Positioning system for stacked cards
   - Transform properties for offset effects
   - Shadow and depth styling
   - Responsive stack behavior

4. Add stack interaction preparation:
   - Top card identification and highlighting
   - Hover state management
   - Click target preparation
   - Stack stability during interactions

5. Write tests for:
   - Stack rendering with multiple cards
   - Proper layering and z-index management
   - Visual depth effects
   - Responsive behavior

Create a convincing illusion of a physical card deck while maintaining performance and accessibility.
```

### Step 2.5: Random Card Selection Logic

```
Implement the core random card selection and display functionality:

1. Update `src/services/CardService.js` with:
   - Random card selection algorithm
   - Fallback card generation for errors
   - Card pool management and validation
   - Selection history tracking (optional for debugging)

2. Create `src/components/CardDisplay.js` with:
   - Integration of CardStack and Card components
   - Card content updating mechanism
   - Error state handling and fallback display
   - Current card state management

3. Implement card selection features:
   - True random selection from full pool (allowing repeats)
   - Graceful error handling with "[we've created mystery]" fallback
   - Card content validation before display
   - Performance optimization for large card pools

4. Add debugging and testing utilities:
   - Card selection logging (development only)
   - Test mode with predictable sequences
   - Error simulation for testing
   - Performance monitoring hooks

5. Write comprehensive tests for:
   - Random selection algorithm
   - Fallback card generation
   - Error handling scenarios
   - Integration with storage service

Ensure robust card selection that handles all edge cases gracefully while maintaining true randomness.
```

### Step 2.6: "Another" Button Component

```
Create the "Another" button component with proper styling and basic interaction:

1. Create `src/components/AnotherButton.js` with:
   - Button component with proper event handling
   - Click event management and delegation
   - Button state management (enabled/disabled)
   - Integration with card selection system

2. Implement button styling in `src/styles/button.css`:
   - Black background with golden accents as specified
   - Proper typography and spacing
   - Button sizing and positioning below the card stack
   - Accessibility features (focus indicators, ARIA labels)

3. Add button functionality:
   - Click handler that triggers new card selection
   - Integration with CardDisplay component
   - Proper event propagation management
   - Loading state handling during card transitions

4. Implement basic interaction feedback:
   - Visual feedback on click (prepare for future animations)
   - Proper cursor states
   - Active/inactive state management
   - Keyboard accessibility (Enter/Space key support)

5. Write tests for:
   - Button rendering and styling
   - Click event handling
   - Integration with card selection
   - Accessibility features

Create a foundational button component that will be enhanced with animations in the next phase.
```

### Step 2.7: Button Hover Effects and Click Handling

```
Add interactive hover effects and complete the click handling for the "Another" button:

1. Update `src/styles/button.css` with:
   - Smooth hover transition effects
   - Golden glow effect on hover as specified
   - Proper transition timing and easing
   - Focus and active state styling

2. Enhance `src/components/AnotherButton.js` with:
   - Complete click handling integration
   - Hover state management
   - Animation preparation hooks
   - Event listener optimization

3. Implement glow effect:
   - CSS box-shadow based glow using golden colors
   - Smooth transition in/out animations
   - Intensity and spread control
   - Performance optimization for the effect

4. Add interaction polish:
   - Subtle scale or transform effects on hover
   - Proper timing for visual feedback
   - Consistent interaction patterns
   - Mobile touch interaction optimization

5. Write tests for:
   - Hover effect application and removal
   - Click handling integration
   - Visual transition smoothness
   - Cross-device interaction behavior

Complete the basic card interface by ensuring the button provides clear, attractive interaction feedback.
```

---

## Phase 3: Card Animations (4 steps)

### Step 3.1: Card Flip Animation Implementation

```
Implement the realistic card flip animation using CSS transforms and JavaScript:

1. Create `src/animations/CardFlip.js` with:
   - CardFlip animation class with configurable parameters
   - 3D transform-based flip animation (0.3 seconds as specified)
   - Animation state management and callbacks
   - Performance optimization using requestAnimationFrame

2. Update `src/styles/card.css` with:
   - 3D perspective and transform-style properties
   - Flip animation keyframes and transitions
   - Proper backface visibility handling
   - Hardware acceleration optimization

3. Implement flip animation features:
   - Smooth rotation along the horizontal axis
   - Front-to-back card face transitions
   - Content update during animation midpoint
   - Animation completion callbacks

4. Add animation controls:
   - Start/stop animation methods
   - Animation state querying
   - Chain-able animation promises
   - Error handling for animation failures

5. Write comprehensive tests for:
   - Animation timing and duration
   - Proper card face transitions
   - Content updates during animation
   - Performance and memory management

Create a smooth, realistic card flip that mimics the physical action of flipping a card.
```

### Step 3.2: Shuffle Animation Implementation

```
Create the shuffle animation that precedes the card flip:

1. Create `src/animations/ShuffleAnimation.js` with:
   - Shuffle animation class with 0.5 second duration
   - Card stack movement and rotation effects
   - Realistic shuffling motion simulation
   - Integration with CardFlip animation

2. Implement shuffle visual effects:
   - Subtle card stack movement and rotation
   - Staggered animation timing for multiple cards
   - Realistic motion easing and physics
   - Smooth transition to flip animation

3. Update `src/styles/card-stack.css` with:
   - Transform-based shuffle animations
   - Proper z-index management during animation
   - Hardware acceleration properties
   - Animation keyframes for shuffle motion

4. Create animation sequencing:
   - Shuffle animation followed by card flip
   - Proper timing coordination between animations
   - Animation state management across sequence
   - Error handling and fallback behaviors

5. Write tests for:
   - Shuffle animation timing and motion
   - Sequence coordination with card flip
   - Visual continuity throughout animation
   - Performance impact and optimization

Ensure the shuffle animation feels natural and provides engaging visual feedback before revealing the new card.
```

### Step 3.3: Clickable Card with Press-Down Effect

```
Add direct card interaction with press-down effect and animation triggering:

1. Update `src/components/CardStack.js` with:
   - Click event handling for the top card
   - Press-down visual effect on click
   - Integration with shuffle and flip animations
   - Touch device optimization

2. Create press-down effect in `src/styles/card-interactions.css`:
   - Subtle scale and shadow reduction on click
   - Smooth transition for press effect
   - Proper timing to feel responsive
   - Visual feedback that simulates physical pressing

3. Implement interaction logic:
   - Click detection specifically for the top card
   - Prevention of multiple simultaneous interactions
   - Proper event handling and propagation
   - Integration with existing animation system

4. Add interaction states:
   - Hover effects for the clickable card
   - Active/pressed state management
   - Disabled state during animations
   - Visual indicators for interactivity

5. Write tests for:
   - Click detection and handling
   - Press-down effect application
   - Animation triggering from card clicks
   - Touch device compatibility

Create an intuitive, tactile interaction that makes the card feel like a physical object you can press and interact with.
```

### Step 3.4: Spacebar Keyboard Support

```
Add keyboard support for card shuffling using the spacebar:

1. Create `src/services/KeyboardService.js` with:
   - Global keyboard event management
   - Spacebar detection and handling
   - Event delegation and cleanup
   - Focus management for accessibility

2. Implement spacebar functionality:
   - Global spacebar listener for card shuffling
   - Integration with existing shuffle/flip animation system
   - Proper event prevention and handling
   - Conflict resolution with form inputs

3. Add keyboard accessibility features:
   - Visual focus indicators for keyboard users
   - Proper ARIA attributes and roles
   - Screen reader announcements for card changes
   - Keyboard navigation support

4. Create interaction management:
   - Coordination between mouse, touch, and keyboard inputs
   - Prevention of conflicting simultaneous interactions
   - Consistent behavior across input methods
   - Error handling for edge cases

5. Write comprehensive tests for:
   - Spacebar event detection and handling
   - Integration with animation system
   - Accessibility compliance
   - Cross-browser keyboard support

Complete the core card interaction system with full keyboard accessibility and consistent behavior across all input methods.
```

---

## Phase 4: Basic CRUD Foundation (6 steps)

### Step 4.1: Edit Cards Page Structure and Routing

```
Create the Edit Cards page foundation with routing integration:

1. Update `src/router/Router.js` with:
   - Route handling for '/edit-cards' path
   - Page component loading and rendering
   - Navigation state management
   - URL hash change detection

2. Create `src/pages/EditCardsPage.js` with:
   - EditCardsPage component structure
   - Basic page layout and container elements
   - Integration with navigation system
   - Page initialization and cleanup methods

3. Create `src/styles/edit-cards.css` with:
   - Page layout matching site aesthetic (black/gold theme)
   - Container and section styling
   - Responsive layout foundation
   - Typography consistency with main site

4. Implement page structure:
   - Header section for page title and actions
   - Main content area for table and forms
   - Proper semantic HTML structure
   - Accessibility landmarks and navigation

5. Write tests for:
   - Route navigation to edit cards page
   - Page component rendering
   - Layout responsiveness
   - Navigation integration

Establish the foundation for the CRUD interface while maintaining visual consistency with the main card interface.
```

### Step 4.2: Basic Table Component with Static Data

```
Create the cards table component with sortable columns and static test data:

1. Create `src/components/CardsTable.js` with:
   - Table component with header and row rendering
   - Column definitions for: Card Text, Edition, Notes, Imagery URL
   - Static test data for initial development
   - Basic table structure and styling

2. Implement table features:
   - Sortable column headers with click handlers
   - Row rendering with proper data display
   - Action column for edit/delete buttons (placeholder)
   - Responsive table layout

3. Create `src/styles/table.css` with:
   - Table styling matching site theme
   - Column width management and responsive behavior
   - Header styling with sort indicators
   - Row hover effects and visual hierarchy

4. Add sorting functionality:
   - Column sorting state management
   - Sort direction indicators (ascending/descending)
   - Multi-column sorting preparation
   - Alphanumeric sorting algorithms

5. Write tests for:
   - Table rendering with test data
   - Column sorting functionality
   - Responsive layout behavior
   - Visual styling compliance

Create a solid table foundation that will be enhanced with real data and advanced features in subsequent steps.
```

### Step 4.3: Add New Card Form with Validation

```
Implement the add new card form with proper validation and user feedback:

1. Create `src/components/AddCardForm.js` with:
   - Form component with all required fields
   - Field validation and error handling
   - Form submission and data processing
   - Integration with CardService for data persistence

2. Implement form fields:
   - Card Text field (required, multi-line textarea)
   - Edition field (required, tag-based input - basic version)
   - Notes field (optional, textarea)
   - Imagery URL field (optional, URL input)

3. Create `src/styles/forms.css` with:
   - Form styling consistent with site theme
   - Input field styling and focus states
   - Error message styling and positioning
   - Form layout and spacing

4. Add validation logic:
   - Required field validation for Card Text and Edition
   - URL format validation for Imagery URL
   - Edition name format validation (alphanumeric + spaces, 30 char max)
   - Real-time validation feedback

5. Write comprehensive tests for:
   - Form rendering and field setup
   - Validation logic for all fields
   - Form submission and data handling
   - Error state management and display

Build a robust form foundation that handles data input validation while providing clear user feedback.
```

### Step 4.4: Edit Card Form with Field Population

```
Create the edit card functionality with form pre-population and update logic:

1. Create `src/components/EditCardForm.js` with:
   - Edit form component based on AddCardForm
   - Card data loading and field population
   - Update vs. create mode handling
   - Form state management for editing

2. Implement edit functionality:
   - Load existing card data into form fields
   - Handle form submission for updates
   - Integration with CardService update methods
   - Cancel editing functionality

3. Add edit mode features:
   - Form pre-population with existing card values
   - Changed field tracking and validation
   - Update confirmation and feedback
   - Proper error handling for update failures

4. Create edit interaction flow:
   - Edit button integration in table rows
   - Modal or inline editing interface
   - Form mode switching (add vs. edit)
   - Navigation between edit and table views

5. Write tests for:
   - Form population with existing data
   - Edit mode functionality
   - Update operation success and failure cases
   - Integration with table component

Ensure seamless editing experience with proper data loading and user feedback throughout the process.
```

### Step 4.5: Delete Functionality with Confirmation

```
Implement card deletion with proper confirmation dialog and safety measures:

1. Create `src/components/ConfirmationDialog.js` with:
   - Reusable confirmation dialog component
   - Customizable message and action buttons
   - Modal overlay and focus management
   - Keyboard navigation support (Escape, Enter)

2. Implement delete functionality:
   - Delete button integration in table rows
   - Confirmation dialog triggering
   - Card removal from storage
   - Table refresh after deletion

3. Create `src/styles/dialog.css` with:
   - Modal dialog styling with overlay
   - Dialog positioning and responsiveness
   - Button styling within dialog
   - Animation for dialog appearance/disappearance

4. Add safety measures:
   - Clear confirmation message: "Are you sure you want to delete this card?"
   - Prominent cancel option
   - Prevent accidental deletions
   - Undo functionality consideration (optional)

5. Write comprehensive tests for:
   - Confirmation dialog display and behavior
   - Delete operation execution
   - Dialog keyboard navigation
   - Error handling for delete failures

Provide a safe, clear deletion process that prevents accidental data loss while maintaining good user experience.
```

### Step 4.6: Form Submission and Data Persistence

```
Complete the data persistence layer with proper error handling and user feedback:

1. Update `src/services/CardService.js` with:
   - Complete CRUD operations (Create, Read, Update, Delete)
   - Data validation and sanitization
   - Error handling and logging
   - Data integrity checks

2. Implement automatic saving:
   - Form submission handling for add/edit operations
   - Immediate data persistence to local storage
   - Success/failure feedback to users
   - Data synchronization preparation

3. Create `src/components/StatusFeedback.js` with:
   - Success/error message display system
   - Auto-dismissing notifications
   - Visual feedback integration (golden glow for success)
   - Accessible announcements for screen readers

4. Add data integrity features:
   - Duplicate detection and handling
   - Data validation before persistence
   - Rollback capabilities for failed operations
   - Backup and recovery mechanisms

5. Write comprehensive tests for:
   - All CRUD operations
   - Data validation and error scenarios
   - User feedback display and timing
   - Data integrity and consistency

Ensure robust data management with comprehensive error handling and clear user feedback for all operations.
```

---

## Phase 5: CRUD Advanced Features (6 steps)

### Step 5.1: Search Functionality Implementation

```
Implement dynamic search functionality for the cards table:

1. Create `src/components/SearchBar.js` with:
   - Search input component with live filtering
   - Search term state management
   - Debounced search to optimize performance
   - Search result highlighting and feedback

2. Implement search logic:
   - Real-time filtering of cards by text content
   - Case-insensitive search algorithm
   - Partial match support
   - Search across multiple fields (card text, notes)

3. Update `src/components/CardsTable.js` with:
   - Integration with search functionality
   - Filtered data display
   - Search result count and feedback
   - No results state handling

4. Create `src/styles/search.css` with:
   - Search bar styling consistent with theme
   - Search result highlighting
   - Loading states during search
   - Mobile-responsive search interface

5. Write tests for:
   - Search functionality accuracy
   - Performance with large datasets
   - Real-time filtering behavior
   - Search result display and highlighting

Provide fast, intuitive search that helps users quickly find specific cards in large collections.
```

### Step 5.2: Edition Tag-Based Input Component

```
Create the tag-based input system for edition management:

1. Create `src/components/TagInput.js` with:
   - Tag-based input component for edition selection
   - Tag creation, editing, and deletion
   - Visual tag representation with styling
   - Multiple tag selection support

2. Implement tag functionality:
   - Add new tags by typing and pressing Enter
   - Remove tags with click or backspace
   - Tag validation (30 char limit, alphanumeric + spaces)
   - Visual feedback for validation errors

3. Create `src/styles/tag-input.css` with:
   - Tag styling with golden accents
   - Input field integration with tags
   - Tag removal buttons and hover effects
   - Responsive tag layout and wrapping

4. Add tag management features:
   - Duplicate tag prevention
   - Tag list state management
   - Integration with form validation
   - Accessibility support for screen readers

5. Write comprehensive tests for:
   - Tag creation and removal
   - Validation logic and error handling
   - Integration with card forms
   - Accessibility compliance

Build a user-friendly tag system that makes edition management intuitive and efficient.
```

### Step 5.3: Edition Autocomplete Functionality

```
Add autocomplete functionality to the tag input for existing editions:

1. Update `src/components/TagInput.js` with:
   - Autocomplete dropdown integration
   - Existing edition suggestion display
   - Keyboard navigation for suggestions
   - Selection and completion handling

2. Create `src/services/EditionService.js` with:
   - Edition data management and caching
   - Autocomplete search algorithms
   - Edition usage tracking and popularity
   - New edition creation handling

3. Implement autocomplete features:
   - Dynamic suggestion filtering as user types
   - Fuzzy matching for typos and partial matches
   - Recent/popular editions prioritization
   - New edition creation when no matches found

4. Create `src/styles/autocomplete.css` with:
   - Dropdown styling and positioning
   - Suggestion item highlighting
   - Keyboard navigation visual feedback
   - Loading states and empty results styling

5. Write tests for:
   - Autocomplete suggestion accuracy
   - Keyboard navigation functionality
   - New edition creation workflow
   - Performance with large edition lists

Enhance the tag input with intelligent autocomplete that speeds up edition selection while allowing new edition creation.
```

### Step 5.4: Table Sorting by Columns

```
Implement comprehensive table sorting functionality:

1. Update `src/components/CardsTable.js` with:
   - Multi-column sorting support
   - Sort state management and persistence
   - Visual sort indicators in column headers
   - Sort direction toggling (asc/desc/none)

2. Create `src/utils/SortingUtils.js` with:
   - Sorting algorithms for different data types
   - String, number, and date comparison functions
   - Multi-level sorting logic
   - Stable sorting implementation

3. Implement sorting features:
   - Click-to-sort on column headers
   - Visual indicators for current sort state
   - Secondary sort column support
   - Sort persistence across page refreshes

4. Update `src/styles/table.css` with:
   - Sort indicator styling (arrows, icons)
   - Hover effects for sortable columns
   - Active sort column highlighting
   - Responsive sort controls

5. Write comprehensive tests for:
   - Sorting accuracy for all data types
   - Multi-column sorting behavior
   - Sort state persistence
   - Visual indicator updates

Provide powerful sorting capabilities that help users organize and find cards efficiently.
```

### Step 5.5: Pagination Component

```
Implement pagination for the cards table with 25 cards per page:

1. Create `src/components/Pagination.js` with:
   - Pagination component with page number links
   - Previous/Next navigation buttons
   - Page size management (25 cards per page)
   - Current page state and navigation

2. Implement pagination logic:
   - Page calculation and range management
   - Data slicing for current page display
   - URL state management for bookmarkable pages
   - Edge case handling (empty data, single page)

3. Create `src/styles/pagination.css` with:
   - Pagination styling with golden accents
   - Button and link styling consistent with theme
   - Active page highlighting
   - Responsive pagination layout

4. Add pagination features:
   - Numbered page links with range ellipsis
   - Jump to first/last page functionality
   - Page size selector (future consideration)
   - Keyboard navigation support

5. Write tests for:
   - Pagination calculation accuracy
   - Navigation functionality
   - Data slicing and display
   - URL state management

Create efficient pagination that handles large datasets while maintaining performance and usability.
```

### Step 5.6: Dynamic Table Updates and Visual Feedback

```
Implement dynamic table updates with visual feedback for all operations:

1. Update `src/components/CardsTable.js` with:
   - Real-time table updates for add/edit/delete operations
   - Row-level visual feedback (golden glow for saves)
   - Smooth transitions for table changes
   - Optimistic UI updates

2. Create `src/animations/TableAnimations.js` with:
   - Row highlight animations for save feedback
   - Smooth row insertion and removal animations
   - Table sorting transition effects
   - Loading state animations

3. Implement visual feedback system:
   - Golden glow effect for successful saves (as specified)
   - Error highlighting for failed operations
   - Loading indicators for async operations
   - Success/error message integration

4. Add advanced table features:
   - Bulk operation preparation
   - Selection state management
   - Keyboard shortcuts for common actions
   - Undo/redo functionality consideration

5. Write comprehensive tests for:
   - Dynamic update functionality
   - Visual feedback timing and appearance
   - Animation performance and smoothness
   - User interaction responsiveness

Complete the CRUD interface with polished interactions and clear visual feedback that keeps users informed of all operations.
```

---

## Phase 6: Offline and Sync (4 steps)

### Step 6.1: Offline Detection and Local Storage Management

```
Implement comprehensive offline functionality with local storage management:

1. Create `src/services/OfflineService.js` with:
   - Online/offline state detection and monitoring
   - Event handling for connectivity changes
   - Offline mode state management
   - Local storage quota monitoring and management

2. Implement offline storage:
   - Complete card data caching in local storage
   - Offline operation queuing for sync
   - Data versioning and conflict detection
   - Storage cleanup and optimization

3. Create `src/services/PWAService.js` with:
   - Service worker registration and management
   - Cache strategies for offline functionality
   - Background sync preparation
   - Progressive Web App manifest setup

4. Add offline indicators:
   - Visual indicators for offline/online status
   - Offline mode notifications
   - Operation queuing feedback
   - Data freshness indicators

5. Write comprehensive tests for:
   - Offline detection accuracy
   - Local storage operations
   - Data caching and retrieval
   - Connectivity change handling

Build robust offline capabilities that allow full application functionality without internet connectivity.
```

### Step 6.2: Data Synchronization Logic

```
Implement automatic data synchronization when returning online:

1. Create `src/services/SyncService.js` with:
   - Automatic sync triggering when online
   - Conflict detection and resolution logic
   - Sync queue management and processing
   - Error handling and retry mechanisms

2. Implement sync strategies:
   - Silent background synchronization
   - Online version prioritization for conflicts
   - Batch sync operations for efficiency
   - Progressive sync with user feedback

3. Add sync conflict resolution:
   - Server data priority implementation
   - Local change discarding for conflicts
   - Sync status tracking and logging
   - User notification for major conflicts (optional)

4. Create sync monitoring:
   - Sync progress tracking
   - Background sync scheduling
   - Bandwidth optimization
   - Sync failure recovery

5. Write tests for:
   - Sync trigger accuracy
   - Conflict resolution behavior
   - Data integrity after sync
   - Error handling and recovery

Ensure seamless data synchronization that maintains consistency while prioritizing server data as specified.
```

### Step 6.3: Conflict Resolution Logic

```
Implement robust conflict resolution with server data prioritization:

1. Update `src/services/SyncService.js` with:
   - Detailed conflict detection algorithms
   - Server data prioritization logic
   - Local change discarding procedures
   - Conflict logging and analytics

2. Create conflict resolution workflow:
   - Timestamp-based conflict detection
   - Data comparison and diff algorithms
   - Automatic resolution without user intervention
   - Silent conflict handling as specified

3. Implement data integrity measures:
   - Pre-sync data backup
   - Rollback capabilities for sync failures
   - Data validation after conflict resolution
   - Consistency checks across all operations

4. Add conflict prevention:
   - Optimistic locking strategies
   - Real-time data freshness checking
   - Preventive sync scheduling
   - User activity monitoring for sync timing

5. Write comprehensive tests for:
   - Conflict detection accuracy
   - Resolution logic correctness
   - Data integrity preservation
   - Silent operation verification

Create a robust conflict resolution system that maintains data integrity while operating transparently to users.
```

### Step 6.4: Background Sync and Error Handling

```
Complete the offline system with background sync and comprehensive error handling:

1. Create `src/services/BackgroundSync.js` with:
   - Service worker background sync integration
   - Scheduled sync operations
   - Retry logic with exponential backoff
   - Network-aware sync scheduling

2. Implement error handling:
   - Comprehensive error categorization and handling
   - Graceful degradation for sync failures
   - User notification for critical errors
   - Automatic recovery mechanisms

3. Add sync optimization:
   - Intelligent sync scheduling
   - Bandwidth usage optimization
   - Battery usage consideration
   - Data compression for sync operations

4. Create monitoring and debugging:
   - Sync operation logging
   - Performance metrics collection
   - Debug tools for development
   - Health monitoring for production

5. Write extensive tests for:
   - Background sync functionality
   - Error handling scenarios
   - Performance under various conditions
   - Recovery from failure states

Complete the offline functionality with production-ready reliability and performance optimization.
```

---

## Phase 7: Polish and Extras (5 steps)

### Step 7.1: Footer Component with Credits

```
Implement the footer component with proper positioning and credits:

1. Create `src/components/Footer.js` with:
   - Footer component with scroll-triggered visibility
   - Credits text rendering and styling
   - Responsive footer layout
   - Integration with all pages

2. Implement footer behavior:
   - Scroll-to-view functionality (off-screen by default)
   - Consistent behavior across all pages
   - Proper positioning and spacing
   - Mobile-responsive footer scaling

3. Create `src/styles/footer.css` with:
   - Footer positioning and layout
   - Credits text styling (light color, centered)
   - Responsive design for smaller screens
   - Z-index management for proper layering

4. Add footer content:
   - "Concept and cards by Brian Eno and Peter Schmidt" text
   - Proper typography and spacing
   - Accessibility attributes and semantic markup
   - Copyright and attribution handling

5. Write tests for:
   - Footer visibility behavior
   - Scroll detection accuracy
   - Cross-page consistency
   - Responsive layout functionality

Create a professional footer that properly credits the creators while maintaining the site's aesthetic.
```

### Step 7.2: Glowing Leaf Animation

```
Implement the animated glowing leaf separator for the footer:

1. Create `src/animations/LeafGlow.js` with:
   - Leaf animation component with CSS animation control
   - 4-second glow cycle with continuous looping
   - Golden to brighter gold color transitions
   - Animation performance optimization

2. Implement the glow effect:
   - North West Pointing Leaf Unicode symbol (🍃) usage
   - CSS-based phasing glow animation
   - Smooth color transitions and intensity changes
   - Hardware acceleration optimization

3. Create `src/styles/leaf-animation.css` with:
   - Keyframe animation for glow effect
   - Color transition definitions (golden to bright gold)
   - Animation timing and easing curves
   - Responsive scaling for different screen sizes

4. Add animation controls:
   - Automatic animation start on component mount
   - Animation pause/resume capabilities
   - Performance monitoring and throttling
   - Accessibility considerations (prefers-reduced-motion)

5. Write tests for:
   - Animation timing accuracy (4-second cycle)
   - Color transition smoothness
   - Performance impact measurement
   - Accessibility compliance

Create an elegant, eye-catching animation that adds visual interest without being distracting.
```

### Step 7.3: About Page Content and Styling

```
Create the About page with comprehensive content about Oblique Strategies:

1. Create `src/pages/AboutPage.js` with:
   - About page component structure
   - Content rendering and layout management
   - Integration with navigation system
   - Responsive content layout

2. Implement About page content:
   - Explanation of Oblique Strategies concept and purpose
   - Background information on Brian Eno and Peter Schmidt
   - History and development of the card system
   - Usage instructions and creative applications

3. Create `src/styles/about.css` with:
   - Typography and content styling consistent with site theme
   - Reading-optimized layout and spacing
   - Responsive design for various screen sizes
   - Visual hierarchy and content organization

4. Add content features:
   - Structured content with proper headings
   - Readable typography and line spacing
   - Accessibility features (proper heading structure, alt text)
   - Links to external resources (if appropriate)

5. Write tests for:
   - Content rendering accuracy
   - Page layout responsiveness
   - Accessibility compliance
   - Navigation integration

Provide informative, well-designed content that educates users about the concept and creators of Oblique Strategies.
```

### Step 7.4: Responsive Design Implementation

```
Implement comprehensive responsive design across all components and pages:

1. Update all CSS files with:
   - Mobile-first responsive breakpoints
   - Flexible grid systems and layouts
   - Scalable typography and spacing
   - Touch-friendly interaction targets

2. Enhance component responsiveness:
   - Card scaling and proportions for mobile devices
   - Table layout adjustments (stacked layout for small screens)
   - Navigation menu adaptations
   - Form layout optimizations

3. Create `src/styles/responsive.css` with:
   - Media query definitions and breakpoints
   - Responsive utility classes
   - Mobile-specific overrides
   - Tablet and desktop enhancements

4. Implement responsive features:
   - Touch gesture support for mobile
   - Larger tap targets for mobile interactions
   - Keyboard navigation for desktop
   - Performance optimizations for different devices

5. Write comprehensive tests for:
   - Layout behavior across all breakpoints
   - Touch interaction functionality
   - Cross-device compatibility
   - Performance on various devices

Ensure the entire application works beautifully and efficiently across all device types and screen sizes.
```

### Step 7.5: Final Error Handling and Fallback Card

```
Complete the application with comprehensive error handling and polish:

1. Create `src/services/ErrorService.js` with:
   - Global error handling and logging
   - User-friendly error message generation
   - Error recovery and fallback mechanisms
   - Error reporting and analytics preparation

2. Implement fallback systems:
   - "[we've created mystery]" fallback card implementation
   - Graceful degradation for all features
   - Service worker fallbacks for offline scenarios
   - Default content for missing data

3. Add final polish features:
   - Loading states and smooth transitions
   - Performance optimization and code splitting
   - Security measures and input sanitization
   - Final accessibility audit and improvements

4. Create comprehensive testing:
   - End-to-end testing scenarios
   - Error condition simulation and testing
   - Performance testing and optimization
   - Cross-browser compatibility verification

5. Write final tests for:
   - Complete application functionality
   - Error handling in all scenarios
   - Performance benchmarks
   - Production readiness verification

Complete the application with production-ready error handling, performance optimization, and comprehensive testing coverage.
```
