import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const publicNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' },
  ];

  const authenticatedNavItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Upload Resume', path: '/upload-resume' },
    { name: 'Career Path', path: '/career-path' },
    { name: 'AI Assistant', path: '/ai-assistant' },
    { name: 'Settings', path: '/settings' },
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  return (
    <nav className="bg-[#232b39] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Logo size="lg" showText={true} />
          </Link>
          {/* Menu */}
          <div className="hidden md:flex items-center gap-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 text-base font-medium outline-none transition-all duration-200
                  ${isActive(item.path)
                    ? 'text-purple-400 after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-purple-400 after:rounded after:content-[\'\']'
                    : 'text-white hover:text-purple-300'}
                `}
                tabIndex={0}
                style={{ whiteSpace: 'nowrap' }}
              >
                {item.name}
              </Link>
            ))}
          </div>
          {/* Right side */}
          <div className="flex items-center gap-4 ml-8">
            <ThemeToggle />
            {isAuthenticated && (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold text-base">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                  <span className="text-white text-sm font-medium">
                    Welcome, <span className="font-semibold">{user?.name || 'User'}</span>
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-full bg-red-500 text-white font-medium shadow hover:bg-red-600 transition"
                  style={{ fontSize: '0.95rem' }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated && (
              <>
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                  Welcome, {user?.name || 'User'}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 