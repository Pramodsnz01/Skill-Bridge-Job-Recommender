import React, { useState, useRef, useEffect } from 'react';
import chatService from '../services/chatService';
import Button from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { getRecentAnalyses } from '../services/dashboardService';

const ChatBot = ({ userId, experienceLevel = 'entry' }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session-${Date.now()}`);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [topDomain, setTopDomain] = useState(null);
  const messagesEndRef = useRef(null);

  // Quick questions based on experience level
  const quickQuestions = {
    entry: [
      "What is a resume?",
      "How to prepare for my first interview?",
      "What skills should I learn?",
      "How to start networking?",
      "Career advice for beginners"
    ],
    mid: [
      "How to advance my career?",
      "Resume tips for experienced professionals",
      "Leadership skills development",
      "Salary negotiation strategies",
      "Career change advice"
    ],
    senior: [
      "Executive career development",
      "Strategic leadership skills",
      "Industry thought leadership",
      "Mentorship and coaching",
      "Career legacy planning"
    ]
  };

  useEffect(() => {
    // Load chat history
    loadChatHistory();
    // Load performance metrics
    loadPerformanceMetrics();
    // Fetch top domain for personalized welcome
    fetchTopDomain();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchTopDomain = async () => {
    try {
      const response = await getRecentAnalyses(1);
      if (response.success && response.data && response.data.length > 0) {
        const analysis = response.data[0].analysis;
        if (analysis && analysis.analysisSummary && analysis.analysisSummary.topDomain) {
          setTopDomain(analysis.analysisSummary.topDomain);
        }
      }
    } catch (error) {
      // Ignore errors, just don't personalize
    }
    addWelcomeMessage();
  };

  const loadChatHistory = async () => {
    if (!userId) return;
    try {
      const response = await chatService.getChatHistory(userId, 20, sessionId);
      if (response.success && response.chats.length > 0) {
        const formattedMessages = response.chats.map(chat => ({
          id: chat._id,
          text: chat.userMessage,
          isUser: true,
          timestamp: new Date(chat.timestamp),
          context: chat.context
        })).concat(response.chats.map(chat => ({
          id: `${chat._id}-response`,
          text: chat.aiResponse,
          isUser: false,
          timestamp: new Date(chat.timestamp),
          context: chat.context,
          suggestions: chat.context?.followUpQuestions || []
        })));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const loadPerformanceMetrics = async () => {
    try {
      const response = await chatService.getPerformanceMetrics();
      if (response.success) {
        setPerformanceMetrics(response.metrics);
      }
    } catch (error) {
      console.error('Error loading performance metrics:', error);
    }
  };

  const addWelcomeMessage = () => {
    let welcomeText = `Hello! I'm SkillBridge AI, your career development assistant.`;
    if (user && user.name) {
      welcomeText = `Hello ${user.name.split(' ')[0]}! I'm SkillBridge AI, your career development assistant.`;
    }
    if (topDomain) {
      welcomeText += ` I see your top domain is ${topDomain}. I can help you grow your career in this field!`;
    }
    welcomeText += ` How can I assist you today?`;
    const welcomeMessage = {
      id: 'welcome',
      text: welcomeText,
      isUser: false,
      timestamp: new Date(),
      suggestions: quickQuestions[experienceLevel] || quickQuestions.entry
    };
    setMessages([welcomeMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(inputMessage, userId, sessionId);
      
      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          text: response.message,
          isUser: false,
          timestamp: new Date(),
          suggestions: response.suggestions || [],
          context: response.context
        };

        setMessages(prev => [...prev, aiMessage]);
        
        // Update performance metrics
        if (response.performance) {
          setPerformanceMetrics(prev => ({
            ...prev,
            lastResponseTime: response.performance.responseTime,
            cacheHit: response.performance.cacheHit
          }));
        }
      } else {
        // Handle error response
        const errorMessage = {
          id: Date.now() + 1,
          text: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
          isUser: false,
          timestamp: new Date(),
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please check your internet connection and try again.",
        isUser: false,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">SkillBridge AI Assistant</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Career Development & Guidance</p>
          </div>
        </div>
        
        {/* Performance metrics display */}
        {performanceMetrics && (
          <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Response: {performanceMetrics.lastResponseTime || performanceMetrics.averageResponseTime || 0}ms</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Cache: {performanceMetrics.cacheHits || 0}/{performanceMetrics.totalRequests || 0}</span>
            </span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                message.isUser
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                  : message.isError
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                  : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white border border-gray-200/50 dark:border-gray-700/50'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p className={`text-xs mt-2 ${
                message.isUser 
                  ? 'text-indigo-100' 
                  : message.isError 
                  ? 'text-red-600 dark:text-red-300' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {formatTimestamp(message.timestamp)}
              </p>
              
              {/* Context information for AI messages */}
              {!message.isUser && message.context && (
                <div className="mt-3 text-xs">
                  <span className="inline-block bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg text-gray-600 dark:text-gray-300">
                    {message.context.category} • {Math.round(message.context.confidence * 100)}% confidence
                  </span>
                  {message.context.personalized && (
                    <span className="ml-2 inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-lg">
                      ✨ Personalized
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 p-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Quick Questions:</h4>
          <div className="flex flex-wrap gap-2">
            {(quickQuestions[experienceLevel] || quickQuestions.entry).map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="px-4 py-2 text-xs bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 text-gray-700 dark:text-gray-200 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {messages.length > 1 && messages[messages.length - 1]?.suggestions?.length > 0 && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 p-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Suggested follow-ups:</h4>
          <div className="flex flex-wrap gap-2">
            {messages[messages.length - 1].suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 text-xs bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-800/40 dark:hover:to-purple-800/40 text-indigo-700 dark:text-indigo-200 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 p-4">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message here..."
            className="flex-1 px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200 backdrop-blur-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot; 