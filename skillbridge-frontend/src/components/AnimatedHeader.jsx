import { useState, useEffect } from 'react';

const AnimatedHeader = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const words = ['Bridge', 'Your', 'Skills', 'to', 'Success'];
  const colors = [
    'text-blue-600 dark:text-blue-400',
    'text-purple-600 dark:text-purple-400', 
    'text-green-600 dark:text-green-400',
    'text-orange-600 dark:text-orange-400',
    'text-pink-600 dark:text-pink-400'
  ];

  // Word cycling effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for interactive effect
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div 
      className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Glowing orb that follows mouse */}
      <div
        className={`absolute w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
        style={{
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
        }}
      />

      {/* Main header content */}
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {words.map((word, index) => (
            <span
              key={index}
              className={`inline-block mx-2 transition-all duration-700 ease-out ${
                index === currentWordIndex
                  ? `${colors[index]} scale-110 transform rotate-1`
                  : 'text-gray-600 dark:text-gray-300 scale-100'
              } ${
                isHovered ? 'hover:scale-105 hover:rotate-2' : ''
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
                textShadow: index === currentWordIndex 
                  ? '0 0 20px rgba(59, 130, 246, 0.5)' 
                  : 'none'
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Animated subtitle */}
        <div className="relative">
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium">
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.5s' }}>
              🚀
            </span>
            <span className="mx-2">Transform your career with AI-powered insights</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '1s' }}>
              💡
            </span>
          </p>
        </div>

        {/* Interactive floating elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute text-2xl animate-float ${
                isHovered ? 'animate-spin' : ''
              }`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 2) * 60}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`
              }}
            >
              {['🎯', '⚡', '🌟', '🔥', '💎', '🚀'][i]}
            </div>
          ))}
        </div>

        {/* Gradient border animation */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Bottom wave effect */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse" />
    </div>
  );
};

export default AnimatedHeader; 