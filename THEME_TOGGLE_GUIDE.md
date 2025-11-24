# 🎨 Dark/Light Theme Toggle Guide

## Overview

Your MERN stack application now includes a fully functional dark/light theme toggle with system preference support!

## ✨ Features

- **🌙 Dark Mode** - Easy on the eyes in low-light environments
- **☀️ Light Mode** - Crisp and clear for bright environments
- **💻 System Mode** - Automatically follows your OS theme preference
- **🎯 Persistent** - Remembers your choice across sessions
- **⚡ Smooth Transitions** - Animated theme switching

---

## 🎯 How It Works

### 1. Theme Detection Priority

```
1. User's saved preference (localStorage)
   ↓
2. System preference (prefers-color-scheme)
   ↓
3. Default theme (system)
```

### 2. Theme Toggle Location

The theme toggle button is located in the **top-right corner** of the application:
- 🌞 Sun icon = Currently in Light mode
- 🌙 Moon icon = Currently in Dark mode
- Click to open dropdown with 3 options

### 3. Theme Options

| Option | Description | Icon |
|--------|-------------|------|
| **Light** | Always use light theme | ☀️ Sun |
| **Dark** | Always use dark theme | 🌙 Moon |
| **System** | Follow OS preference | 💻 Monitor |

---

## 🏗️ Implementation Details

### File Structure

```
/frontend/src
├── components/
│   ├── ThemeProvider.jsx       # Wraps app with theme context
│   ├── ThemeToggle.jsx         # Theme toggle dropdown component
│   └── ui/
│       ├── button.jsx          # Button component
│       └── dropdown-menu.jsx   # Dropdown menu component
├── lib/
│   └── utils.js                # Utility functions (cn helper)
└── App.js                      # Updated with ThemeProvider
```

### Key Components

#### 1. ThemeProvider
```javascript
// Wraps entire app to provide theme context
import { ThemeProvider } from '@/components/ThemeProvider';

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <App />
</ThemeProvider>
```

**Props:**
- `attribute="class"` - Adds class to HTML element
- `defaultTheme="system"` - Default to system preference
- `enableSystem` - Allow system theme detection

#### 2. ThemeToggle Component
```javascript
import { ThemeToggle } from '@/components/ThemeToggle';

// Use anywhere in your app
<ThemeToggle />
```

Features:
- Dropdown menu with 3 theme options
- Animated icon transitions
- Keyboard accessible

---

## 🎨 Tailwind Configuration

### Dark Mode Setup

**tailwind.config.js:**
```javascript
module.exports = {
  darkMode: ["class"], // Uses class-based dark mode
  // ... rest of config
};
```

### CSS Variables

**index.css** defines theme colors using CSS variables:

```css
:root {
  --background: 0 0% 100%;      /* Light mode colors */
  --foreground: 0 0% 3.9%;
  /* ... more variables */
}

.dark {
  --background: 0 0% 3.9%;      /* Dark mode colors */
  --foreground: 0 0% 98%;
  /* ... more variables */
}
```

---

## 💻 Using Themes in Your Code

### Automatic Styling

Use Tailwind's theme classes - they automatically switch:

```jsx
<div className="bg-background text-foreground">
  {/* Automatically adapts to theme */}
</div>

<button className="bg-primary text-primary-foreground">
  {/* Button colors change with theme */}
</button>
```

### Common Theme Classes

| Purpose | Class | Light Mode | Dark Mode |
|---------|-------|------------|-----------|
| Background | `bg-background` | White | Dark gray |
| Text | `text-foreground` | Black | White |
| Cards | `bg-card` | White | Dark gray |
| Muted text | `text-muted-foreground` | Gray | Light gray |
| Borders | `border-border` | Light gray | Dark gray |
| Primary | `bg-primary` | Black | White |
| Accent | `bg-accent` | Light gray | Dark gray |

### Dark Mode Specific Classes

You can also use `dark:` prefix for dark-mode-only styles:

```jsx
<div className="bg-white dark:bg-gray-900">
  {/* White in light mode, dark gray in dark mode */}
</div>

<p className="text-black dark:text-white">
  {/* Black text in light, white in dark */}
</p>
```

---

## 🔧 Customization

### Change Default Theme

In `App.js`:
```javascript
<ThemeProvider 
  attribute="class" 
  defaultTheme="dark"    // Change to "light", "dark", or "system"
  enableSystem
>
```

### Disable System Theme

```javascript
<ThemeProvider 
  attribute="class" 
  defaultTheme="light"
  enableSystem={false}  // Disable system preference
>
```

### Custom Theme Colors

Edit `/frontend/src/index.css` to customize colors:

```css
:root {
  --background: 0 0% 100%;        /* Change light mode background */
  --primary: 220 100% 50%;        /* Change primary color */
  /* ... customize as needed */
}

.dark {
  --background: 0 0% 3.9%;        /* Change dark mode background */
  --primary: 220 100% 60%;        /* Different primary for dark */
  /* ... customize as needed */
}
```

### Move Theme Toggle Position

In `App.js` or any component:
```jsx
{/* Current: Top-right */}
<div className="fixed top-4 right-4 z-50">
  <ThemeToggle />
</div>

{/* Bottom-right */}
<div className="fixed bottom-4 right-4 z-50">
  <ThemeToggle />
</div>

{/* Top-left */}
<div className="fixed top-4 left-4 z-50">
  <ThemeToggle />
</div>

{/* In navbar */}
<nav className="flex items-center justify-between p-4">
  <Logo />
  <ThemeToggle />
</nav>
```

---

## 🎯 Advanced Usage

### Access Theme in Component

```javascript
import { useTheme } from 'next-themes';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('dark')}>
        Force Dark Mode
      </button>
    </div>
  );
}
```

### Programmatically Change Theme

```javascript
import { useTheme } from 'next-themes';

function SettingsPage() {
  const { setTheme } = useTheme();
  
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // Optional: Save to user preferences in backend
  };
  
  return (
    <div>
      <button onClick={() => handleThemeChange('light')}>Light</button>
      <button onClick={() => handleThemeChange('dark')}>Dark</button>
      <button onClick={() => handleThemeChange('system')}>System</button>
    </div>
  );
}
```

### Listen to Theme Changes

```javascript
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

function ThemeListener() {
  const { theme, resolvedTheme } = useTheme();
  
  useEffect(() => {
    console.log('Theme changed to:', resolvedTheme);
    // Do something when theme changes
  }, [resolvedTheme]);
  
  return null;
}
```

---

## 🐛 Troubleshooting

### Theme Not Persisting

**Issue:** Theme resets on page reload

**Solution:** Check localStorage is enabled in browser
```javascript
// Test in browser console
localStorage.setItem('test', 'value');
console.log(localStorage.getItem('test')); // Should output 'value'
```

### Flash of Wrong Theme (FOUC)

**Issue:** Brief flash of light theme before dark theme loads

**Solution:** This is minimal due to `next-themes` optimization, but can be further reduced by:

1. Add script in `public/index.html`:
```html
<script>
  // Prevent FOUC by setting theme class immediately
  try {
    const theme = localStorage.getItem('theme') || 'system';
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
</script>
```

### Theme Not Updating

**Issue:** Changing theme doesn't update UI

**Solutions:**
1. Ensure ThemeProvider wraps your entire app
2. Check Tailwind config has `darkMode: ["class"]`
3. Clear browser cache and reload

### System Theme Not Detected

**Issue:** System option doesn't follow OS preference

**Solutions:**
1. Check `enableSystem` prop is true
2. Test OS theme detection:
```javascript
window.matchMedia('(prefers-color-scheme: dark)').matches
```
3. Ensure browser supports `prefers-color-scheme`

---

## 📱 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 76+ | ✅ Full |
| Firefox | 67+ | ✅ Full |
| Safari | 12.1+ | ✅ Full |
| Edge | 79+ | ✅ Full |
| Opera | 62+ | ✅ Full |

All modern browsers support `prefers-color-scheme` media query for system theme detection.

---

## 🎓 Best Practices

### 1. Use Semantic Colors
```jsx
// ✅ Good - Uses theme variables
<div className="bg-background text-foreground">

// ❌ Bad - Hardcoded colors
<div className="bg-white text-black">
```

### 2. Test Both Themes
Always test your UI in both light and dark modes to ensure good contrast and readability.

### 3. Provide User Choice
Don't force a theme - let users choose what works best for them.

### 4. Consider Accessibility
Ensure sufficient contrast ratios:
- Light mode: Dark text on light background (ratio > 4.5:1)
- Dark mode: Light text on dark background (ratio > 4.5:1)

### 5. Smooth Transitions
Use Tailwind's `transition-colors` for smooth theme switching:
```jsx
<div className="bg-background transition-colors duration-200">
```

---

## 🚀 Testing

### Manual Testing

1. **Test Theme Toggle:**
   - Click theme toggle button
   - Select each option (Light, Dark, System)
   - Verify UI updates correctly

2. **Test Persistence:**
   - Change theme
   - Reload page
   - Verify theme persists

3. **Test System Preference:**
   - Select "System" option
   - Change OS theme
   - Verify app follows OS theme

### Browser DevTools Testing

**Test system preference:**
```javascript
// In browser console
window.matchMedia('(prefers-color-scheme: dark)').matches
// true = dark mode, false = light mode
```

**Test theme storage:**
```javascript
// Check saved theme
localStorage.getItem('theme')
// Should be 'light', 'dark', or 'system'
```

---

## 📚 Dependencies

The theme system uses these packages (already installed):

```json
{
  "next-themes": "^0.4.6",        // Theme provider
  "lucide-react": "^0.507.0",     // Icons (Sun, Moon, Monitor)
  "@radix-ui/react-dropdown-menu": "^2.1.12"  // Dropdown UI
}
```

---

## 🎯 Example: Complete Theme-Aware Component

```jsx
import React from 'react';
import { useTheme } from 'next-themes';

function ThemeAwareCard() {
  const { theme, resolvedTheme } = useTheme();
  
  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg p-6 shadow-lg transition-colors">
      <h2 className="text-2xl font-bold mb-2">Theme-Aware Card</h2>
      <p className="text-muted-foreground mb-4">
        This card automatically adapts to the current theme.
      </p>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Current theme:</span>
        <span className="px-2 py-1 bg-accent text-accent-foreground rounded">
          {resolvedTheme || theme}
        </span>
      </div>
    </div>
  );
}

export default ThemeAwareCard;
```

---

## 🎉 Summary

✅ Dark/Light theme toggle implemented  
✅ System preference support enabled  
✅ Persistent theme selection  
✅ Smooth transitions  
✅ Fully customizable  
✅ Production-ready

Your app now provides an excellent user experience with theme support!

---

**Last Updated:** November 24, 2024  
**Status:** ✅ Fully Functional  
**Location:** Top-right corner of the app
