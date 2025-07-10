import React from 'react';

const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Background circle */}
          <circle cx="16" cy="16" r="15" fill="#2563eb" stroke="#1e40af" strokeWidth="2"/>
          
          {/* Bridge structure */}
          <path d="M6 20 L26 20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          
          {/* Bridge supports */}
          <line x1="8" y1="20" x2="8" y2="24" stroke="white" strokeWidth="2"/>
          <line x1="16" y1="20" x2="16" y2="24" stroke="white" strokeWidth="2"/>
          <line x1="24" y1="20" x2="24" y2="24" stroke="white" strokeWidth="2"/>
          
          {/* Connection lines (representing skills) */}
          <path d="M6 18 L10 16 L14 18 L18 16 L22 18 L26 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
          
          {/* Small dots representing skill nodes */}
          <circle cx="10" cy="16" r="1" fill="white"/>
          <circle cx="14" cy="18" r="1" fill="white"/>
          <circle cx="18" cy="16" r="1" fill="white"/>
          <circle cx="22" cy="18" r="1" fill="white"/>
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className={`font-bold text-blue-600 dark:text-blue-400 ${textSizes[size]}`}>
          SkillBridge
        </span>
      )}
    </div>
  );
};

export default Logo; 