import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const DarkModeDemo = () => {
  const { isDark, isLoaded } = useTheme();
  const [activeTab, setActiveTab] = useState('components');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 custom-scrollbar">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Dark Mode Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Current theme: <span className="font-semibold text-blue-600 dark:text-blue-400">
              {isDark ? 'Dark' : 'Light'}
            </span>
          </p>
          <div className="flex justify-center mb-8">
            <ThemeToggle />
          </div>
          
          {/* Tab Navigation */}
          <div className="flex justify-center space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md">
            {['components', 'forms', 'animations', 'utilities'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  activeTab === tab
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Components Tab */}
        {activeTab === 'components' && (
          <div className="space-y-12">
            {/* Cards Demo */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Interactive Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-interactive group">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Interactive Card</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Hover over this card to see the scale animation and enhanced shadows.
                  </p>
                  <div className="flex space-x-2">
                    <span className="badge-primary">New</span>
                    <span className="badge-success">Active</span>
                  </div>
                </div>

                <div className="card-interactive group">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Success Card</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    This card demonstrates success states with green accents.
                  </p>
                  <div className="flex space-x-2">
                    <span className="badge-success">Completed</span>
                  </div>
                </div>

                <div className="card-interactive group">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Settings Card</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Configuration and settings with purple theme colors.
                  </p>
                  <div className="flex space-x-2">
                    <span className="badge-warning">Pending</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons Demo */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Enhanced Buttons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Button Variants</h3>
                  <div className="space-y-4">
                    <button className="btn-primary w-full">Primary Button</button>
                    <button className="btn-secondary w-full">Secondary Button</button>
                    <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
                      Danger Button
                    </button>
                    <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
                      Success Button
                    </button>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Interactive Elements</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label className="text-gray-700 dark:text-gray-300">Checkbox option</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="radio" name="radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label className="text-gray-700 dark:text-gray-300">Radio option 1</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="radio" name="radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label className="text-gray-700 dark:text-gray-300">Radio option 2</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Forms Tab */}
        {activeTab === 'forms' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Form Elements</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Form</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name..."
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email..."
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Enter your message..."
                      className="textarea-field"
                    />
                  </div>
                  
                  <button type="submit" className="btn-primary w-full">
                    Send Message
                  </button>
                </form>
              </div>

              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Select Options</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Country
                    </label>
                    <select className="language-selector w-full">
                      <option>Select a country</option>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Language
                    </label>
                    <select className="language-selector w-full">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Theme Preference
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <input type="radio" name="theme" id="light" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="light" className="text-gray-700 dark:text-gray-300">Light Mode</label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input type="radio" name="theme" id="dark" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="dark" className="text-gray-700 dark:text-gray-300">Dark Mode</label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input type="radio" name="theme" id="auto" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="auto" className="text-gray-700 dark:text-gray-300">Auto (System)</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Animations Tab */}
        {activeTab === 'animations' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Animations & Effects</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center group">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bounce Effect</h3>
                <p className="text-gray-600 dark:text-gray-400">Hover to see bounce animation</p>
              </div>

              <div className="card text-center group">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pulse Effect</h3>
                <p className="text-gray-600 dark:text-gray-400">Hover to see pulse animation</p>
              </div>

              <div className="card text-center group">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-spin">
                  <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Spin Effect</h3>
                <p className="text-gray-600 dark:text-gray-400">Hover to see spin animation</p>
              </div>

              <div className="card text-center group">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-ping">
                  <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ping Effect</h3>
                <p className="text-gray-600 dark:text-gray-400">Hover to see ping animation</p>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Loading States</h3>
              <div className="flex items-center space-x-4">
                <div className="loading-spinner w-8 h-8"></div>
                <div className="loading-spinner w-6 h-6"></div>
                <div className="loading-spinner w-4 h-4"></div>
                <span className="text-gray-600 dark:text-gray-400">Loading...</span>
              </div>
            </div>
          </div>
        )}

        {/* Utilities Tab */}
        {activeTab === 'utilities' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Utility Classes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Typography</h3>
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Heading 1</h1>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Heading 2</h2>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">Heading 3</h3>
                  <p className="text-base text-gray-700 dark:text-gray-300">Regular paragraph text</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Small text for captions</p>
                  <p className="gradient-text text-lg font-semibold">Gradient text effect</p>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Badges & Status</h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="badge-primary">Primary</span>
                    <span className="badge-success">Success</span>
                    <span className="badge-warning">Warning</span>
                    <span className="badge-error">Error</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Online</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Away</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Offline</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DarkModeDemo; 