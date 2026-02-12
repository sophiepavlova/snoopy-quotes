# Snoopy Quotes

A delightful, interactive quote generator inspired by the beloved Peanuts comic strip. Click Snoopy typing on his typewriter to receive wisdom from various thinkers, displayed with a charming typewriter effect.

## Features

- 🎨 **Vintage Peanuts Aesthetic** - Paper texture, hand-drawn fonts, and sky-blue backgrounds
- ⌨️ **Typewriter Animation** - Watch quotes appear letter-by-letter with typing sounds
- 🎭 **Three Modes** - Switch between Lucy (philosophical), Snoopy (creative), and Charlie Brown (thoughtful) quote collections
- 🔊 **Sound Toggle** - Enable/disable typing sounds
- ❄️ **Seasonal Theme** - Toggle snowfall effect overlay
- 💾 **Persistent Preferences** - Settings saved across sessions
- ♿ **Accessible** - Keyboard navigation, ARIA labels, reduced motion support
- 📱 **Responsive** - Works beautifully on desktop and mobile

## How to Run

### Option 1: Open Directly

Simply open `index.html` in your web browser by double-clicking the file.

### Option 2: Local Server (Recommended)

For the best experience, run a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (if you have npx)
npx serve

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## File Structure

```
snoopy-quotes/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── app.js              # JavaScript logic and interactions
├── README.md           # This file
└── assets/
    ├── images/
    │   ├── lucy.svg              # Lucy character icon
    │   ├── snoopy-icon.svg       # Snoopy head icon
    │   ├── charlie.svg           # Charlie Brown icon
    │   └── snoopy-typewriter.svg # Main Snoopy illustration
    └── audio/
        └── (optional typing sounds)
```

## How to Replace Assets

### Images

The app uses SVG placeholders. To use custom images:

1. Replace any SVG file in `assets/images/` with your own
2. Keep the same filename to avoid code changes
3. Recommended formats: SVG (scalable), PNG (with transparency)
4. Dimensions:
   - Character icons: 100x100px minimum
   - Snoopy typewriter: 300x250px minimum

### Audio

The app generates typing sounds programmatically using Web Audio API. To use a custom sound file:

1. Add `typing.mp3` or `typing.wav` to `assets/audio/`
2. Modify the `TypewriterSound` class in `app.js`:

```javascript
// Replace the playClick() method with:
playClick() {
    if (!state.soundEnabled) return;
    const audio = new Audio('assets/audio/typing.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Handle autoplay restrictions
}
```

## How to Add Quotes

Edit the `QUOTES` array in `app.js`:

```javascript
const QUOTES = [
  {
    id: 37, // Unique ID (increment from last)
    text: "Your quote text here",
    author: "AUTHOR NAME",
    mode: "lucy", // or "snoopy" or "charlie"
  },
  // ... more quotes
];
```

**Tips:**

- Each mode should have at least 10 quotes for variety
- IDs must be unique
- The app prevents immediate repeats automatically
- Author names are displayed in uppercase for visual consistency

## LocalStorage Keys

The app uses these localStorage keys to persist preferences:

- `snoopy_sound` - Sound toggle state (true/false)
- `snoopy_seasonal` - Seasonal theme state (true/false)
- `snoopy_mode` - Current mode selection (lucy/snoopy/charlie)

To reset preferences, run this in the browser console:

```javascript
localStorage.clear();
location.reload();
```

## Keyboard Shortcuts

- **Spacebar** - Generate a new quote (when page is focused)
- **Tab** - Navigate between interactive elements
- **Enter** - Activate focused button

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Respects `prefers-reduced-motion` system setting
- Progressive enhancement (works without Web Audio API)

## Accessibility Features

- Semantic HTML with proper ARIA labels
- Keyboard navigation support
- Focus indicators on all interactive elements
- Live regions announce new quotes to screen readers
- Reduced motion support for users who prefer minimal animation
- Sufficient color contrast ratios

## Customization Ideas

1. **Add more modes** - Create new character modes with unique quote pools
2. **Different themes** - Seasonal themes for holidays (autumn leaves, spring flowers)
3. **Quote categories** - Filter quotes by topic within each mode
4. **Share functionality** - Add buttons to share quotes on social media
5. **Favorites** - Let users save their favorite quotes
6. **Daily quote** - Show a different quote each day automatically

## Tech Stack

- Pure HTML5, CSS3, JavaScript (ES6+)
- No frameworks or build tools required
- Web Audio API for typing sounds
- LocalStorage API for persistence
- CSS Grid and Flexbox for layout
- CSS custom properties for theming
- Google Fonts (Caveat, Special Elite, Patrick Hand, 🤚 Schoolbell)

## Credits

- Inspired by Charles M. Schulz's Peanuts comic strip
- Quotes from various authors and thinkers
- Fan project created with love for the Peanuts gang 🥜

## License

This is a fan project for educational and entertainment purposes. Peanuts characters and related intellectual property are owned by Peanuts Worldwide LLC.

---

**Enjoy your daily dose of wisdom from the Peanuts gang!** 🐶✨
