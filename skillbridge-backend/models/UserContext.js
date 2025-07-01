const mongoose = require('mongoose');

const userContextSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Smart Context Memory
  conversationHistory: {
    totalConversations: {
      type: Number,
      default: 0
    },
    averageSessionDuration: {
      type: Number,
      default: 0
    },
    lastActiveSession: Date,
    currentSessionId: String,
    conversationTopics: [{
      topic: String,
      frequency: Number,
      lastDiscussed: Date
    }],
    userMoodHistory: [{
      mood: String,
      timestamp: Date
    }]
  },
  // Enhanced Personalization
  preferences: {
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior'],
      default: 'entry'
    },
    industry: String,
    careerGoals: [String],
    skills: [String],
    interests: [String],
    preferredLanguage: {
      type: String,
      default: 'en'
    },
    learningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'kinesthetic', 'reading'],
      default: 'visual'
    },
    communicationStyle: {
      type: String,
      enum: ['formal', 'casual', 'technical', 'conversational'],
      default: 'conversational'
    },
    responseLength: {
      type: String,
      enum: ['brief', 'detailed', 'comprehensive'],
      default: 'detailed'
    }
  },
  // Performance Tracking
  performance: {
    totalMessages: {
      type: Number,
      default: 0
    },
    averageResponseTime: {
      type: Number,
      default: 0
    },
    satisfactionScore: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    engagementMetrics: {
      dailyActiveMinutes: Number,
      weeklySessions: Number,
      monthlyGoals: Number
    }
  },
  // Multi-language Support
  languageSettings: {
    primaryLanguage: {
      type: String,
      default: 'en'
    },
    supportedLanguages: [String],
    autoTranslate: {
      type: Boolean,
      default: false
    },
    translationPreferences: {
      preserveOriginal: {
        type: Boolean,
        default: true
      },
      showBothLanguages: {
        type: Boolean,
        default: false
      }
    }
  },
  // Context Memory
  contextMemory: {
    recentTopics: [{
      topic: String,
      lastDiscussed: Date,
      frequency: Number
    }],
    userPatterns: {
      preferredTimes: [String],
      commonQuestions: [String],
      skillGaps: [String],
      careerInterests: [String]
    },
    conversationFlow: [{
      sessionId: String,
      topics: [String],
      duration: Number,
      satisfaction: Number
    }]
  },
  // Caching for Performance
  cache: {
    lastUpdated: Date,
    frequentlyAskedQuestions: [{
      question: String,
      answer: String,
      frequency: Number
    }],
    personalizedResponses: [{
      context: String,
      response: String,
      confidence: Number
    }]
  }
}, {
  timestamps: true
});

// Indexes for performance optimization
userContextSchema.index({ userId: 1 });
userContextSchema.index({ 'preferences.experienceLevel': 1 });
userContextSchema.index({ 'languageSettings.primaryLanguage': 1 });
userContextSchema.index({ 'conversationHistory.lastActiveSession': -1 });

// Methods for context management
userContextSchema.methods.updateConversationHistory = function(topic, mood) {
  this.conversationHistory.totalConversations += 1;
  this.conversationHistory.lastActiveSession = new Date();
  
  // Update topic frequency
  const existingTopic = this.conversationHistory.conversationTopics.find(t => t.topic === topic);
  if (existingTopic) {
    existingTopic.frequency += 1;
    existingTopic.lastDiscussed = new Date();
  } else {
    this.conversationHistory.conversationTopics.push({
      topic,
      frequency: 1,
      lastDiscussed: new Date()
    });
  }
  
  // Update mood history
  this.conversationHistory.userMoodHistory.push({
    mood,
    timestamp: new Date()
  });
  
  // Keep only last 50 mood entries for performance
  if (this.conversationHistory.userMoodHistory.length > 50) {
    this.conversationHistory.userMoodHistory = this.conversationHistory.userMoodHistory.slice(-50);
  }
};

userContextSchema.methods.getPersonalizedResponse = function(context) {
  // Find cached personalized response
  const cachedResponse = this.cache.personalizedResponses.find(r => r.context === context);
  if (cachedResponse && cachedResponse.confidence > 0.8) {
    return cachedResponse.response;
  }
  return null;
};

userContextSchema.methods.updatePerformance = function(responseTime, satisfaction) {
  this.performance.totalMessages += 1;
  
  // Update average response time
  const totalTime = this.performance.averageResponseTime * (this.performance.totalMessages - 1) + responseTime;
  this.performance.averageResponseTime = totalTime / this.performance.totalMessages;
  
  // Update satisfaction score
  if (satisfaction) {
    const totalSatisfaction = this.performance.satisfactionScore * (this.performance.totalMessages - 1) + satisfaction;
    this.performance.satisfactionScore = totalSatisfaction / this.performance.totalMessages;
  }
};

// Static methods for analytics
userContextSchema.statics.getUserInsights = function(userId) {
  return this.findOne({ userId }).select('preferences conversationHistory performance');
};

userContextSchema.statics.updateLanguagePreference = function(userId, language) {
  return this.findOneAndUpdate(
    { userId },
    { 
      'languageSettings.primaryLanguage': language,
      'preferences.preferredLanguage': language
    },
    { new: true }
  );
};

module.exports = mongoose.model('UserContext', userContextSchema); 