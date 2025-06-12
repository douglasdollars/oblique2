# Troubleshooting Guide - Oblique Strategies Website

## Common Issues and Solutions

### 1. Application Won't Load

**Symptoms:**

- Blank white screen
- "Loading..." message that never completes
- Console errors about missing files

**Solutions:**

**Check Browser Compatibility:**

```javascript
// Open browser console and run:
console.log(navigator.userAgent);
```

Ensure you're using a supported browser (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+).

**Clear Browser Cache:**

1. Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Or manually clear cache in browser settings
3. Try incognito/private browsing mode

**Check Console Errors:**

1. Open Developer Tools (`F12`)
2. Check Console tab for JavaScript errors
3. Check Network tab for failed requests

### 2. Cards Not Displaying

**Symptoms:**

- Card area is empty
- "Another" button doesn't work
- Error message about missing cards

**Solutions:**

**Check Local Storage:**

```javascript
// Open browser console and run:
console.log(localStorage.getItem('oblique-strategies-cards'));
```

**Reset Card Data:**

```javascript
// Clear and reload default cards:
localStorage.removeItem('oblique-strategies-cards');
location.reload();
```

**Verify Fallback Card:**
If no cards load, you should see "[we've created mystery]" - if not, there's a deeper issue.

### 3. Animations Not Working

**Symptoms:**

- Cards don't flip when clicked
- No shuffle animation
- Buttons don't glow on hover

**Solutions:**

**Check Reduced Motion Settings:**

- Some users have "prefers-reduced-motion" enabled
- This disables animations for accessibility
- Test in different browser or disable the setting

**Verify CSS Loading:**

```javascript
// Check if animations are defined:
console.log(getComputedStyle(document.body).getPropertyValue('--transition-normal'));
```

**Hardware Acceleration:**

- Try disabling browser hardware acceleration
- Update graphics drivers
- Test on different device

### 4. Offline Functionality Issues

**Symptoms:**

- App doesn't work when offline
- Data not syncing when back online
- Service worker errors

**Solutions:**

**Check Service Worker:**

```javascript
// Check service worker status:
navigator.serviceWorker.getRegistrations().then((registrations) => {
  console.log('Service Workers:', registrations);
});
```

**Clear Service Worker:**

1. Open Developer Tools
2. Go to Application tab
3. Click "Service Workers"
4. Click "Unregister" for the app
5. Reload page

**Check Storage Quota:**

```javascript
// Check available storage:
navigator.storage.estimate().then((estimate) => {
  console.log('Storage:', estimate);
});
```

### 5. Edit Cards Page Problems

**Symptoms:**

- Can't add new cards
- Edit form doesn't save
- Delete confirmation not working

**Solutions:**

**Check Form Validation:**

- Ensure required fields are filled
- Card text must not be empty
- Edition names must be alphanumeric + spaces only (max 30 chars)

**Verify Local Storage Permissions:**

```javascript
// Test storage access:
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('Storage available');
} catch (e) {
  console.error('Storage blocked:', e);
}
```

**Reset Form State:**

- Refresh the page
- Clear browser data for the site
- Try in incognito mode

### 6. Search and Filtering Issues

**Symptoms:**

- Search doesn't return results
- Filters not working
- Table sorting broken

**Solutions:**

**Check Search Terms:**

- Search is case-insensitive
- Searches card text and notes
- Try simpler search terms

**Verify Data Integrity:**

```javascript
// Check card data structure:
const cards = JSON.parse(localStorage.getItem('oblique-strategies-cards') || '[]');
console.log('Cards:', cards);
console.log('First card:', cards[0]);
```

**Reset Search State:**

- Clear search box
- Refresh page
- Check for JavaScript errors in console

### 7. Responsive Design Issues

**Symptoms:**

- Layout broken on mobile
- Text too small/large
- Elements overlapping

**Solutions:**

**Check Viewport Meta Tag:**

```html
<!-- Should be present in <head>: -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

**Test Different Screen Sizes:**

1. Open Developer Tools
2. Click device toolbar icon
3. Test various device sizes
4. Check for CSS media query issues

**Zoom Level:**

- Reset browser zoom to 100%
- Check if issue persists at different zoom levels

### 8. Performance Issues

**Symptoms:**

- Slow loading
- Laggy animations
- High memory usage

**Solutions:**

**Check Network Performance:**

1. Open Developer Tools
2. Go to Network tab
3. Reload page
4. Check for large files or slow requests

**Monitor Memory Usage:**

1. Open Developer Tools
2. Go to Performance tab
3. Record a session
4. Look for memory leaks

**Optimize Browser:**

- Close other tabs
- Disable browser extensions
- Update browser to latest version

### 9. Accessibility Issues

**Symptoms:**

- Screen reader not working
- Keyboard navigation broken
- Poor contrast

**Solutions:**

**Test Keyboard Navigation:**

- Tab through all interactive elements
- Ensure focus indicators are visible
- Test spacebar for card shuffling

**Check Screen Reader:**

- Test with built-in screen reader
- Verify ARIA labels are present
- Check heading structure

**Verify Color Contrast:**

- Use browser accessibility tools
- Check in high contrast mode
- Test with color blindness simulators

### 10. Data Loss Issues

**Symptoms:**

- Cards disappear after browser restart
- Edits not saving
- Data corruption

**Solutions:**

**Backup Data:**

```javascript
// Export current data:
const data = localStorage.getItem('oblique-strategies-cards');
console.log('Backup data:', data);
// Copy this to a text file
```

**Check Storage Limits:**

- Browser may clear data if storage is full
- Check available disk space
- Consider using export feature regularly

**Restore Default Data:**

```javascript
// Reset to default cards:
localStorage.removeItem('oblique-strategies-cards');
location.reload();
```

## Browser-Specific Issues

### Chrome

- Check for extension conflicts
- Disable "Lite mode" if enabled
- Clear site data in Settings > Privacy

### Firefox

- Check Enhanced Tracking Protection settings
- Disable strict mode temporarily
- Clear cookies and site data

### Safari

- Check Intelligent Tracking Prevention
- Enable JavaScript if disabled
- Clear website data in Preferences

### Edge

- Similar to Chrome solutions
- Check SmartScreen settings
- Reset browser if needed

## Mobile-Specific Issues

### iOS Safari

- Check if in Private Browsing mode
- Disable content blockers
- Update iOS version

### Android Chrome

- Check Data Saver settings
- Disable "Lite mode"
- Clear app cache

## Development Issues

### Build Problems

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 16+
```

### Test Failures

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- tests/components/Card.test.js

# Update snapshots if needed
npm test -- --updateSnapshot
```

## Getting Help

### Information to Provide

When reporting issues, include:

1. **Browser and Version:**

   ```javascript
   console.log(navigator.userAgent);
   ```

2. **Console Errors:**

   - Screenshot of console errors
   - Full error messages

3. **Steps to Reproduce:**

   - Exact steps taken
   - Expected vs actual behavior

4. **Environment:**
   - Operating system
   - Screen resolution
   - Network conditions

### Debug Information

Run this in console for debug info:

```javascript
console.log({
  userAgent: navigator.userAgent,
  localStorage: !!window.localStorage,
  serviceWorker: !!navigator.serviceWorker,
  storage: localStorage.getItem('oblique-strategies-cards')?.length || 0,
  online: navigator.onLine,
  cookieEnabled: navigator.cookieEnabled,
});
```

### Contact Support

For persistent issues:

1. Check GitHub issues for similar problems
2. Create new issue with debug information
3. Include steps to reproduce
4. Attach screenshots if helpful

## Prevention Tips

### Regular Maintenance

- Keep browser updated
- Clear cache monthly
- Export card data regularly
- Test in multiple browsers

### Best Practices

- Use supported browsers
- Enable JavaScript
- Allow local storage
- Keep stable internet connection for initial load

### Backup Strategy

- Export cards before major browser updates
- Keep backup of custom cards
- Document any customizations made

This troubleshooting guide covers the most common issues. For additional help, refer to the deployment documentation or create an issue in the project repository.
