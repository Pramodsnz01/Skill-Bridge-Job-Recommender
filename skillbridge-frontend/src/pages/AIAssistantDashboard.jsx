import React, { useState, useEffect } from 'react';
import ChatBot from '../components/ChatBot';
import AIInsightsCard from '../components/AIInsightsCard';
import SmartRecommendations from '../components/SmartRecommendations';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const AIAssistantDashboard = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [conversationStats, setConversationStats] = useState({
    totalMessages: 0,
    topics: {},
    mood: 'neutral',
    sessionDuration: 0
  });
  const [insights, setInsights] = useState({
    totalConversations: 0,
    averageSessionTime: 0,
    topTopics: [],
    improvementAreas: [],
    recentActivity: []
  });
  const [userStats, setUserStats] = useState({
    profileCompleteness: 0,
    skillsGap: [],
    careerGoals: [],
    nextSteps: []
  });
  const [conversationContext, setConversationContext] = useState({
    currentTopic: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading conversation history
    const mockHistory = [
      {
        id: 1,
        date: new Date(Date.now() - 86400000), // 1 day ago
        topic: 'Resume Improvement',
        duration: 15,
        messages: 8,
        satisfaction: 4.5
      },
      {
        id: 2,
        date: new Date(Date.now() - 172800000), // 2 days ago
        topic: 'Interview Preparation',
        duration: 22,
        messages: 12,
        satisfaction: 4.8
      },
      {
        id: 3,
        date: new Date(Date.now() - 259200000), // 3 days ago
        topic: 'Career Change Advice',
        duration: 18,
        messages: 10,
        satisfaction: 4.2
      }
    ];

    setConversationHistory(mockHistory);

    // Mock insights
    setInsights({
      totalConversations: 15,
      averageSessionTime: 18.5,
      topTopics: [
        { topic: 'Resume Tips', count: 5, percentage: 33 },
        { topic: 'Interview Prep', count: 4, percentage: 27 },
        { topic: 'Skills Development', count: 3, percentage: 20 },
        { topic: 'Career Planning', count: 2, percentage: 13 },
        { topic: 'Salary Negotiation', count: 1, percentage: 7 }
      ],
      improvementAreas: [
        'Technical skills in React and Node.js',
        'Leadership and project management',
        'Networking and relationship building'
      ],
      recentActivity: [
        { type: 'profile_updated', time: '2 hours ago', description: 'Updated skills and experience' },
        { type: 'conversation', time: '1 day ago', description: 'Discussed resume improvements' },
        { type: 'goal_set', time: '3 days ago', description: 'Set career advancement goals' }
      ]
    });

    // Mock user stats
    setUserStats({
      profileCompleteness: 85,
      skillsGap: [
        { skill: 'React.js', current: 'Beginner', target: 'Advanced', priority: 'High' },
        { skill: 'Project Management', current: 'Intermediate', target: 'Advanced', priority: 'Medium' },
        { skill: 'Data Analysis', current: 'None', target: 'Intermediate', priority: 'Low' }
      ],
      careerGoals: [
        'Advance to Senior Developer within 2 years',
        'Lead a team of 5+ developers',
        'Contribute to open source projects'
      ],
      nextSteps: [
        'Complete React certification course',
        'Join project management workshop',
        'Attend industry networking events'
      ]
    });
  }, []);

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'chat':
        return '💬';
      case 'analytics':
        return '📊';
      case 'insights':
        return '💡';
      case 'history':
        return '📚';
      case 'goals':
        return '🎯';
      default:
        return '📋';
    }
  };

  const getSatisfactionColor = (rating) => {
    if (rating >= 4.5) return 'text-green-500';
    if (rating >= 4.0) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const tabs = [
    { id: 'chat', label: 'AI Chat', description: 'Start a conversation with your AI assistant' },
    { id: 'analytics', label: 'Analytics', description: 'View your conversation statistics and trends' },
    { id: 'insights', label: 'Insights', description: 'Get personalized career insights and recommendations' },
    { id: 'history', label: 'History', description: 'Review your past conversations and topics' },
    { id: 'goals', label: 'Goals', description: 'Track your career goals and progress' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🤖</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  AI Career Assistant
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your personalized career development companion
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="text-lg">{getTabIcon(tab.id)}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chat Interface - Made Larger */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <ChatBot />
              </div>
            </div>

            {/* Quick Stats and Insights */}
            <div className="space-y-6">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Profile Complete</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {userStats.profileCompleteness}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${userStats.profileCompleteness}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Conversations</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {insights.totalConversations}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg Session Time</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {insights.averageSessionTime} min
                    </span>
                  </div>
                </div>
              </Card>

              <AIInsightsCard 
                userProfile={userStats}
                conversationStats={conversationStats}
              />

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {insights.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Conversation Analytics */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Conversation Analytics
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {insights.totalConversations}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Conversations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {insights.averageSessionTime}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {insights.topTopics.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Topics Discussed</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                    Top Discussion Topics
                  </h4>
                  <div className="space-y-3">
                    {insights.topTopics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{topic.topic}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${topic.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 w-8">
                            {topic.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Conversation History */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Recent Conversations
              </h3>
              <div className="space-y-4">
                {conversationHistory.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{conversation.topic}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getSatisfactionColor(conversation.satisfaction)}`}>
                          ⭐ {conversation.satisfaction}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{conversation.date.toLocaleDateString()}</span>
                      <div className="flex items-center space-x-4">
                        <span>{conversation.duration} min</span>
                        <span>{conversation.messages} messages</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skills Gap Analysis */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Skills Gap Analysis
              </h3>
              <div className="space-y-4">
                {userStats.skillsGap.map((skill, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{skill.skill}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(skill.priority)}`}>
                        {skill.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Current: {skill.current}</span>
                      <span>Target: {skill.target}</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: skill.current === 'None' ? '0%' : skill.current === 'Beginner' ? '25%' : skill.current === 'Intermediate' ? '50%' : '75%' }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Smart Recommendations */}
            <SmartRecommendations 
              userProfile={userStats}
              conversationHistory={conversationHistory}
              currentTopic={conversationContext.currentTopic}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Conversation History
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Messages
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Satisfaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {conversationHistory.map((conversation) => (
                    <tr key={conversation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {conversation.date.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {conversation.topic}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {conversation.duration} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {conversation.messages}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getSatisfactionColor(conversation.satisfaction)}`}>
                          ⭐ {conversation.satisfaction}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'goals' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Goal Progress */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Goal Progress Tracker
              </h3>
              <div className="space-y-6">
                {userStats.careerGoals.map((goal, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">{goal}</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">In Progress</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.random() * 60 + 20}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Started 2 weeks ago</span>
                      <span>Target: 2 years</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Action Items */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Action Items
              </h3>
              <div className="space-y-4">
                {userStats.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{step}</span>
                    <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">Due: Next week</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistantDashboard; 