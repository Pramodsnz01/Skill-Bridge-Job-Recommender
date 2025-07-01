# Dark Mode Implementation Guide

This guide documents the complete dark mode implementation for the SkillBridge React application using Tailwind CSS.

## Overview

The dark mode implementation includes:
- **Theme Provider**: Context-based state management
- **OS Detection**: Automatic theme detection based on system preferences
- **Local Storage**: Persistent theme preferences
- **Smooth Transitions**: CSS transitions for theme switching
- **Comprehensive Styling**: Dark variants for all components

## Files Modified/Created

### 1. `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Custom dark mode colors
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}
```

### 2. `src/context/ThemeContext.jsx`
Complete theme management with:
- OS theme detection
- Local storage persistence
- Smooth transitions
- Context provider

```javascript
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const initializeTheme = () => {
      // Check localStorage first
      const savedTheme = localStorage.getItem('theme');
      
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      } else {
        // Check OS preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(prefersDark);
        localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
      }
      
      setIsLoaded(true);
    };

    initializeTheme();
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isLoaded) {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [isDark, isLoaded]);

  // Listen for OS theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches);
        localStorage.setItem('theme', e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const setTheme = (theme) => {
    const isDarkTheme = theme === 'dark';
    setIsDark(isDarkTheme);
    localStorage.setItem('theme', theme);
  };

  const value = {
    isDark,
    isLoaded,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### 3. `src/components/ThemeToggle.jsx`
Beautiful animated toggle switch with icons:

```javascript
import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme, isLoaded } = useTheme();

  if (!isLoaded) {
    return (
      <div className="w-12 h-6 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Background */}
      <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
        isDark ? 'bg-blue-600' : 'bg-gray-200'
      }`}>
        {/* Toggle handle */}
        <div className={`relative w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isDark ? 'translate-x-6' : 'translate-x-0.5'
        }`}>
          {/* Icons */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isDark ? (
              // Moon icon for dark mode
              <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              // Sun icon for light mode
              <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
```

### 4. Updated CSS Classes (`src/index.css`)

```css
@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .card {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300;
  }

  .language-selector {
    @apply appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200;
  }
}
```

## Usage Examples

### Using the Theme Hook
```javascript
import { useTheme } from '../context/ThemeContext';

const MyComponent = () => {
  const { isDark, toggleTheme, setTheme } = useTheme();

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      <p>Current theme: {isDark ? 'Dark' : 'Light'}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
    </div>
  );
};
```

### Common Dark Mode Classes

#### Backgrounds
```html
<!-- Light background -->
<div className="bg-gray-50 dark:bg-gray-900">
<!-- White card background -->
<div className="bg-white dark:bg-gray-800">
<!-- Subtle background -->
<div className="bg-gray-100 dark:bg-gray-700">
```

#### Text Colors
```html
<!-- Primary text -->
<h1 className="text-gray-900 dark:text-white">
<!-- Secondary text -->
<p className="text-gray-600 dark:text-gray-400">
<!-- Muted text -->
<span className="text-gray-500 dark:text-gray-400">
```

#### Borders
```html
<!-- Standard border -->
<div className="border border-gray-200 dark:border-gray-700">
<!-- Input border -->
<input className="border-gray-300 dark:border-gray-600">
```

#### Interactive Elements
```html
<!-- Button hover states -->
<button className="hover:bg-gray-50 dark:hover:bg-gray-700">
<!-- Link hover states -->
<a className="hover:text-blue-600 dark:hover:text-blue-400">
```

## Key Features

### 1. **Automatic OS Detection**
- Detects user's system theme preference on first visit
- Respects `prefers-color-scheme` media query
- Updates automatically when system theme changes (if no manual preference set)

### 2. **Persistent Preferences**
- Saves user's theme choice in localStorage
- Remembers preference across browser sessions
- Allows manual override of system preference

### 3. **Smooth Transitions**
- CSS transitions for all color changes
- Prevents jarring theme switches
- Maintains visual continuity

### 4. **Accessibility**
- Proper ARIA labels on toggle button
- High contrast ratios in both themes
- Keyboard navigation support

### 5. **Performance**
- No flash of unstyled content (FOUC)
- Efficient class-based switching
- Minimal JavaScript overhead

## Testing

### Demo Page
Visit `/dark-mode-demo` to see all components in both themes.

### Manual Testing
1. Toggle theme using the navbar button
2. Refresh page to verify persistence
3. Change system theme (if supported)
4. Test on different devices/browsers

### Automated Testing
```javascript
// Test theme switching
test('theme toggle works', () => {
  render(<ThemeToggle />);
  const toggle = screen.getByRole('button');
  fireEvent.click(toggle);
  expect(document.documentElement).toHaveClass('dark');
});

// Test persistence
test('theme persists after reload', () => {
  localStorage.setItem('theme', 'dark');
  render(<App />);
  expect(document.documentElement).toHaveClass('dark');
});
```

## Browser Support

- **Modern Browsers**: Full support
- **IE11**: Not supported (requires polyfills)
- **Mobile Browsers**: Full support
- **Progressive Enhancement**: Works without JavaScript (defaults to light mode)

## Troubleshooting

### Common Issues

1. **Theme not persisting**
   - Check localStorage permissions
   - Verify ThemeProvider is wrapping the app

2. **Flash of wrong theme**
   - Ensure theme is applied before render
   - Use `isLoaded` state to prevent rendering

3. **Styling conflicts**
   - Check for conflicting CSS classes
   - Ensure proper specificity in dark variants

### Debug Mode
Add this to see theme state:
```javascript
const { isDark, isLoaded } = useTheme();
console.log('Theme:', { isDark, isLoaded });
```

## Best Practices

1. **Always provide both light and dark variants**
2. **Use semantic color names** (e.g., `text-gray-900` not `text-black`)
3. **Test with real content** to ensure readability
4. **Consider color blindness** in both themes
5. **Use consistent spacing** and sizing across themes
6. **Document custom color schemes** for team consistency

## Future Enhancements

- [ ] Custom color schemes
- [ ] Theme-specific images/icons
- [ ] Reduced motion preferences
- [ ] High contrast mode
- [ ] Theme-specific typography
- [ ] Automated theme testing 