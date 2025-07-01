import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

const AIInsightsCard = ({ userProfile, conversationStats }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeInsight, setActiveInsight] = useState(0);

  useEffect(() => {
    // Generate insights based on user profile and conversation stats
    const generateInsights = () => {
      const newInsights = [];
      
      // Profile-based insights
      if (userProfile.experience === 'entry') {
        newInsights.push({
          type: 'career',
          title: 'Build Your Foundation',
          description: 'Focus on gaining hands-on experience through internships and projects',
          icon: '🚀',
          priority: 'high',
          action: 'Explore entry-level opportunities'
        });
      } else if (userProfile.experience === 'mid') {
        newInsights.push({
          type: 'leadership',
          title: 'Develop Leadership Skills',
          description: 'Take on mentoring roles and lead small projects to advance your career',
          icon: '👥',
          priority: 'medium',
          action: 'Find leadership opportunities'
        });
      } else if (userProfile.experience === 'senior') {
        newInsights.push({
          type: 'strategy',
          title: 'Strategic Impact',
          description: 'Focus on business outcomes and strategic initiatives',
          icon: '🎯',
          priority: 'high',
          action: 'Explore strategic roles'
        });
      }

      // Conversation-based insights
      if (conversationStats.topics && Object.keys(conversationStats.topics).length > 0) {
        const topTopic = Object.keys(conversationStats.topics)[0];
        newInsights.push({
          type: 'conversation',
          title: `Focus on ${topTopic}`,
          description: `You've been discussing ${topTopic} frequently. Consider diving deeper into this area.`,
          icon: '💬',
          priority: 'medium',
          action: 'Learn more about this topic'
        });
      }

      // Skills gap insights
      if (userProfile.skills && userProfile.skills.length > 0) {
        newInsights.push({
          type: 'skills',
          title: 'Skill Development',
          description: `You have ${userProfile.skills.length} skills listed. Consider adding more specialized skills.`,
          icon: '🛠️',
          priority: 'low',
          action: 'Update your skills'
        });
      }

      // Industry-specific insights
      if (userProfile.industry) {
        newInsights.push({
          type: 'industry',
          title: `${userProfile.industry} Trends`,
          description: `Stay updated with the latest trends in ${userProfile.industry}`,
          icon: '📈',
          priority: 'medium',
          action: 'Explore industry trends'
        });
      }

      setInsights(newInsights);
      setLoading(false);
    };

    generateInsights();
  }, [userProfile, conversationStats]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'low':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      default:
        return 'Priority';
    }
  };

  const handleInsightAction = (insight) => {
    // Handle insight action - could trigger specific features or navigation
    console.log('Insight action:', insight.action);
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Insights Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start a conversation with the AI assistant to get personalized insights!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          AI Insights
        </h3>
        <div className="flex space-x-1">
          {insights.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveInsight(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === activeInsight
                  ? 'bg-blue-600 dark:bg-blue-400'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`transition-all duration-300 ${
              index === activeInsight ? 'opacity-100' : 'opacity-0 absolute inset-0'
            }`}
          >
            <div className={`border rounded-lg p-4 ${getPriorityColor(insight.priority)}`}>
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{insight.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {insight.title}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      insight.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {getPriorityText(insight.priority)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {insight.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInsightAction(insight)}
                    className="w-full"
                  >
                    {insight.action}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {insights.length > 1 && (
        <div className="flex justify-between mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveInsight((prev) => (prev > 0 ? prev - 1 : insights.length - 1))}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveInsight((prev) => (prev < insights.length - 1 ? prev + 1 : 0))}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      )}
    </Card>
  );
};

export default AIInsightsCard; 