import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme, isLoaded } = useTheme();

  if (!isLoaded) {
    return (
      <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transform hover:scale-110 active:scale-95"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Background */}
      <div className={`w-12 h-6 rounded-full transition-all duration-500 ${
        isDark ? 'bg-blue-600 shadow-lg shadow-blue-600/30' : 'bg-gray-200 shadow-md'
      }`}>
        {/* Toggle handle */}
        <div className={`relative w-5 h-5 bg-white rounded-full shadow-lg transform transition-all duration-500 ${
          isDark ? 'translate-x-6 rotate-180' : 'translate-x-0.5 rotate-0'
        }`}>
          {/* Icons */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isDark ? (
              // Moon icon for dark mode
              <svg 
                className="w-3 h-3 text-blue-600 transition-all duration-500 transform rotate-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              // Sun icon for light mode
              <svg 
                className="w-3 h-3 text-yellow-500 transition-all duration-500 transform rotate-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
        
        {/* Stars for dark mode */}
        {isDark && (
          <>
            <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-2 right-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-1 left-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle; 