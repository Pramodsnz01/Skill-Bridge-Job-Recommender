import React from 'react';
import ChatBot from './ChatBot';

const FloatingChatModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed z-50 sm:bottom-24 sm:right-6 bottom-0 right-0 w-[350px] max-w-[95vw] h-[500px] sm:w-[350px] sm:max-w-[95vw] sm:h-[500px] w-full h-[90vh] bg-white dark:bg-gray-900 rounded-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-fade-in">
      {/* Header with close button */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-600">
        <span className="text-white font-semibold">SkillBridge AI Assistant</span>
        <button onClick={onClose} aria-label="Close chat" className="text-white text-xl font-bold hover:text-gray-200 focus:outline-none">×</button>
      </div>
      <div className="flex-1 min-h-0">
        <ChatBot />
      </div>
    </div>
  );
};

export default FloatingChatModal; 