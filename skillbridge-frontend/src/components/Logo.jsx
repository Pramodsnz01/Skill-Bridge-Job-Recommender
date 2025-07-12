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
      {/* Logo Icon: exact SVG from uploaded icon */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <svg width="53" height="68" viewBox="0 0 53 68" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M2 34L19.5 16.5L37 34L19.5 51.5L2 34Z" fill="#B983FF"/>
          <path d="M15 34L32.5 16.5L50 34L32.5 51.5L15 34Z" fill="#7F1DFF"/>
        </svg>
      </div>
      {/* Logo Text */}
      {showText && (
        <span className={`font-bold text-[#7F1DFF] dark:text-[#B983FF] ${textSizes[size]}`}>
          SkillBridge
        </span>
      )}
    </div>
  );
};

export default Logo; 