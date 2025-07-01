import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

const SmartRecommendations = ({ userProfile, conversationHistory, currentTopic }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    generateRecommendations();
  }, [userProfile, conversationHistory, currentTopic]);

  const generateRecommendations = () => {
    const newRecommendations = [];
    
    // Experience-based recommendations
    if (userProfile.experience === 'entry') {
      newRecommendations.push({
        category: 'learning',
        title: 'Complete Online Courses',
        description: 'Build foundational skills with free online courses',
        icon: '📚',
        priority: 'high',
        action: 'Browse Courses',
        link: '#courses'
      });
      
      newRecommendations.push({
        category: 'networking',
        title: 'Join Professional Groups',
        description: 'Connect with professionals in your field',
        icon: '🤝',
        priority: 'medium',
        action: 'Find Groups',
        link: '#groups'
      });
    } else if (userProfile.experience === 'mid') {
      newRecommendations.push({
        category: 'leadership',
        title: 'Mentor Junior Developers',
        description: 'Share your knowledge and develop leadership skills',
        icon: '👨‍🏫',
        priority: 'high',
        action: 'Start Mentoring',
        link: '#mentoring'
      });
      
      newRecommendations.push({
        category: 'skills',
        title: 'Advanced Certifications',
        description: 'Get certified in advanced technologies',
        icon: '🏆',
        priority: 'medium',
        action: 'View Certifications',
        link: '#certifications'
      });
    } else if (userProfile.experience === 'senior') {
      newRecommendations.push({
        category: 'strategy',
        title: 'Industry Thought Leadership',
        description: 'Share your expertise through speaking and writing',
        icon: '🎤',
        priority: 'high',
        action: 'Start Writing',
        link: '#thought-leadership'
      });
      
      newRecommendations.push({
        category: 'business',
        title: 'Board Advisory Roles',
        description: 'Leverage your experience in advisory positions',
        icon: '💼',
        priority: 'medium',
        action: 'Explore Opportunities',
        link: '#advisory'
      });
    }

    // Topic-based recommendations
    if (currentTopic === 'resume') {
      newRecommendations.push({
        category: 'tools',
        title: 'Resume Builder Tool',
        description: 'Use our AI-powered resume builder',
        icon: '📝',
        priority: 'high',
        action: 'Build Resume',
        link: '/upload-resume'
      });
    }
    
    if (currentTopic === 'interview') {
      newRecommendations.push({
        category: 'practice',
        title: 'Mock Interview Sessions',
        description: 'Practice with AI-powered mock interviews',
        icon: '🎭',
        priority: 'high',
        action: 'Start Practice',
        link: '#mock-interview'
      });
    }
    
    if (currentTopic === 'skills') {
      newRecommendations.push({
        category: 'assessment',
        title: 'Skills Assessment',
        description: 'Evaluate your current skill level',
        icon: '📊',
        priority: 'medium',
        action: 'Take Assessment',
        link: '#assessment'
      });
    }

    // Industry-specific recommendations
    if (userProfile.industry === 'technology') {
      newRecommendations.push({
        category: 'tech',
        title: 'Open Source Contributions',
        description: 'Build your portfolio with open source work',
        icon: '🔧',
        priority: 'medium',
        action: 'Find Projects',
        link: '#open-source'
      });
    }
    
    if (userProfile.industry === 'finance') {
      newRecommendations.push({
        category: 'finance',
        title: 'Financial Modeling Course',
        description: 'Enhance your financial analysis skills',
        icon: '📈',
        priority: 'medium',
        action: 'Enroll Now',
        link: '#finance-course'
      });
    }

    // Conversation-based recommendations
    if (conversationHistory.length > 5) {
      newRecommendations.push({
        category: 'insights',
        title: 'Conversation Analysis',
        description: 'Review insights from your recent conversations',
        icon: '📋',
        priority: 'low',
        action: 'View Analysis',
        link: '#analysis'
      });
    }

    setRecommendations(newRecommendations);
    setLoading(false);
  };

  const categories = [
    { id: 'all', name: 'All', icon: '🌟' },
    { id: 'learning', name: 'Learning', icon: '📚' },
    { id: 'networking', name: 'Networking', icon: '🤝' },
    { id: 'leadership', name: 'Leadership', icon: '👥' },
    { id: 'skills', name: 'Skills', icon: '🛠️' },
    { id: 'tools', name: 'Tools', icon: '🔧' },
    { id: 'practice', name: 'Practice', icon: '🎯' }
  ];

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === selectedCategory);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-l-4 border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const handleRecommendationClick = (recommendation) => {
    // Handle recommendation action
    console.log('Recommendation clicked:', recommendation);
    
    // Could trigger navigation, open modals, or other actions
    if (recommendation.link.startsWith('/')) {
      // Internal navigation
      window.location.href = recommendation.link;
    } else {
      // External action or modal
      alert(`Action: ${recommendation.action} - ${recommendation.title}`);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Smart Recommendations
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {filteredRecommendations.length} recommendations
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🤔</div>
            <p className="text-gray-600 dark:text-gray-400">
              No recommendations for this category. Try selecting a different category or update your profile.
            </p>
          </div>
        ) : (
          filteredRecommendations.map((recommendation, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg transition-all duration-200 hover:shadow-md ${getPriorityColor(recommendation.priority)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{recommendation.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {recommendation.title}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      recommendation.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {recommendation.priority} priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {recommendation.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRecommendationClick(recommendation)}
                    className="w-full"
                  >
                    {recommendation.action}
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Refresh Button */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={generateRecommendations}
          className="w-full"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Recommendations
        </Button>
      </div>
    </Card>
  );
};

export default SmartRecommendations; 