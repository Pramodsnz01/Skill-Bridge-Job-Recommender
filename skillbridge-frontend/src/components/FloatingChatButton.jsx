import React from 'react';

const FloatingChatButton = ({ onClick, isOpen }) => (
  <button
    onClick={onClick}
    aria-label="Open chat assistant"
    className="fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full shadow-lg w-16 h-16 sm:w-16 sm:h-16 w-12 h-12 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300"
    style={{ boxShadow: '0 4px 24px rgba(80, 0, 200, 0.15)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
  >
    {/* Simple chat bubble SVG */}
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 sm:w-8 sm:h-8 w-6 h-6">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
    {/* Optionally, show a close icon if open */}
    {isOpen && (
      <span className="absolute top-2 right-2 text-xs bg-white text-indigo-600 rounded-full px-1.5 py-0.5 shadow">×</span>
    )}
  </button>
);

export default FloatingChatButton; 