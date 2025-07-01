const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userMessage: {
    type: String,
    required: true,
    trim: true
  },
  aiResponse: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  // Smart Context Memory
  context: {
    conversationId: String,
    sessionId: String,
    topic: String,
    userMood: {
      type: String,
      enum: ['positive', 'neutral', 'concerned', 'frustrated'],
      default: 'neutral'
    },
    userIntent: String,
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8
    },
    followUpQuestions: [String],
    suggestions: [String]
  },
  // Enhanced Personalization
  personalization: {
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
    }
  },
  // Performance Metrics
  performance: {
    responseTime: Number,
    userSatisfaction: {
      type: Number,
      min: 1,
      max: 5
    },
    messageLength: Number,
    complexity: {
      type: String,
      enum: ['simple', 'moderate', 'complex'],
      default: 'moderate'
    }
  },
  // Multi-language Support
  language: {
    userLanguage: {
      type: String,
      default: 'en'
    },
    detectedLanguage: String,
    translationNeeded: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Indexes for performance optimization
chatSchema.index({ userId: 1, timestamp: -1 });
chatSchema.index({ userId: 1, 'context.conversationId': 1 });
chatSchema.index({ userId: 1, 'personalization.experienceLevel': 1 });
chatSchema.index({ 'context.topic': 1 });
chatSchema.index({ 'language.userLanguage': 1 });

// Virtual for conversation duration
chatSchema.virtual('conversationDuration').get(function() {
  return this.timestamp - this.createdAt;
});

// Pre-save middleware for performance optimization
chatSchema.pre('save', function(next) {
  // Calculate message length
  this.performance.messageLength = this.userMessage.length + this.aiResponse.length;
  
  // Determine complexity based on message length and content
  if (this.performance.messageLength < 100) {
    this.performance.complexity = 'simple';
  } else if (this.performance.messageLength < 500) {
    this.performance.complexity = 'moderate';
  } else {
    this.performance.complexity = 'complex';
  }
  
  next();
});

module.exports = mongoose.model('Chat', chatSchema); 