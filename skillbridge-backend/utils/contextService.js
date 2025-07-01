const UserContext = require('../models/UserContext');
const Chat = require('../models/Chat');

class ContextService {
  constructor() {
    this.contextCache = new Map();
    this.sessionCache = new Map();
  }

  // Get or create user context
  async getUserContext(userId) {
    // Check cache first for performance
    if (this.contextCache.has(userId)) {
      const cached = this.contextCache.get(userId);
      if (Date.now() - cached.timestamp < 300000) { // 5 minutes cache
        return cached.data;
      }
    }

    let userContext = await UserContext.findOne({ userId });
    
    if (!userContext) {
      userContext = new UserContext({ userId });
      await userContext.save();
    }

    // Cache the context
    this.contextCache.set(userId, {
      data: userContext,
      timestamp: Date.now()
    });

    return userContext;
  }

  // Update conversation context
  async updateConversationContext(userId, message, response, sessionId) {
    const userContext = await this.getUserContext(userId);
    const startTime = Date.now();

    // Detect topic and mood
    const topic = this.detectTopic(message);
    const mood = this.detectMood(message);
    const intent = this.detectIntent(message);

    // Update conversation history
    userContext.updateConversationHistory(topic, mood);

    // Update performance metrics
    const responseTime = Date.now() - startTime;
    userContext.updatePerformance(responseTime);

    // Update context memory
    this.updateContextMemory(userContext, topic, intent, sessionId);

    // Save updated context
    await userContext.save();

    // Update cache
    this.contextCache.set(userId, {
      data: userContext,
      timestamp: Date.now()
    });

    return {
      topic,
      mood,
      intent,
      responseTime,
      userContext
    };
  }

  // Detect conversation topic
  detectTopic(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) return 'resume';
    if (lowerMessage.includes('interview')) return 'interview';
    if (lowerMessage.includes('career') || lowerMessage.includes('job')) return 'career';
    if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) return 'skills';
    if (lowerMessage.includes('salary') || lowerMessage.includes('pay')) return 'salary';
    if (lowerMessage.includes('network')) return 'networking';
    if (lowerMessage.includes('leadership')) return 'leadership';
    if (lowerMessage.includes('communication')) return 'communication';
    if (lowerMessage.includes('time management')) return 'time_management';
    if (lowerMessage.includes('linkedin')) return 'linkedin';
    if (lowerMessage.includes('remote') || lowerMessage.includes('work')) return 'remote_work';
    if (lowerMessage.includes('freelance')) return 'freelancing';
    if (lowerMessage.includes('brand') || lowerMessage.includes('personal')) return 'personal_branding';
    
    return 'general';
  }

  // Detect user mood
  detectMood(message) {
    const lowerMessage = message.toLowerCase();
    
    const positiveWords = ['great', 'awesome', 'excellent', 'good', 'happy', 'excited', 'thank', 'love', 'amazing'];
    const negativeWords = ['frustrated', 'worried', 'confused', 'stressed', 'difficult', 'help', 'problem', 'issue', 'bad'];
    const concernedWords = ['concerned', 'unsure', 'maybe', 'think', 'wonder', 'question'];
    
    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
    const concernedCount = concernedWords.filter(word => lowerMessage.includes(word)).length;
    
    if (positiveCount > negativeCount && positiveCount > concernedCount) return 'positive';
    if (negativeCount > positiveCount) return 'frustrated';
    if (concernedCount > 0) return 'concerned';
    
    return 'neutral';
  }

  // Detect user intent
  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('what') || lowerMessage.includes('how') || lowerMessage.includes('why')) return 'question';
    if (lowerMessage.includes('help') || lowerMessage.includes('assist')) return 'help_request';
    if (lowerMessage.includes('thank')) return 'gratitude';
    if (lowerMessage.includes('goodbye') || lowerMessage.includes('bye')) return 'farewell';
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) return 'greeting';
    
    return 'information_request';
  }

  // Update context memory
  updateContextMemory(userContext, topic, intent, sessionId) {
    // Update recent topics
    const existingTopic = userContext.contextMemory.recentTopics.find(t => t.topic === topic);
    if (existingTopic) {
      existingTopic.frequency += 1;
      existingTopic.lastDiscussed = new Date();
    } else {
      userContext.contextMemory.recentTopics.push({
        topic,
        lastDiscussed: new Date(),
        frequency: 1
      });
    }

    // Keep only top 10 recent topics
    userContext.contextMemory.recentTopics.sort((a, b) => b.frequency - a.frequency);
    userContext.contextMemory.recentTopics = userContext.contextMemory.recentTopics.slice(0, 10);

    // Update conversation flow
    const sessionFlow = userContext.contextMemory.conversationFlow.find(f => f.sessionId === sessionId);
    if (sessionFlow) {
      if (!sessionFlow.topics.includes(topic)) {
        sessionFlow.topics.push(topic);
      }
    } else {
      userContext.contextMemory.conversationFlow.push({
        sessionId,
        topics: [topic],
        duration: 0,
        satisfaction: 0
      });
    }

    // Keep only last 20 sessions
    if (userContext.contextMemory.conversationFlow.length > 20) {
      userContext.contextMemory.conversationFlow = userContext.contextMemory.conversationFlow.slice(-20);
    }
  }

  // Get personalized response based on context
  async getPersonalizedResponse(userId, message, baseResponse) {
    const userContext = await this.getUserContext(userId);
    const topic = this.detectTopic(message);
    
    // Check for cached personalized response
    const cachedResponse = userContext.getPersonalizedResponse(topic);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Personalize based on user preferences
    let personalizedResponse = baseResponse;

    // Adjust response based on experience level
    if (userContext.preferences.experienceLevel === 'entry') {
      personalizedResponse = this.addEntryLevelContext(personalizedResponse, topic);
    } else if (userContext.preferences.experienceLevel === 'senior') {
      personalizedResponse = this.addSeniorLevelContext(personalizedResponse, topic);
    }

    // Adjust response based on communication style
    if (userContext.preferences.communicationStyle === 'formal') {
      personalizedResponse = this.makeFormal(personalizedResponse);
    } else if (userContext.preferences.communicationStyle === 'casual') {
      personalizedResponse = this.makeCasual(personalizedResponse);
    }

    // Adjust response length
    if (userContext.preferences.responseLength === 'brief') {
      personalizedResponse = this.makeBrief(personalizedResponse);
    } else if (userContext.preferences.responseLength === 'comprehensive') {
      personalizedResponse = this.makeComprehensive(personalizedResponse, topic);
    }

    // Add context-aware follow-ups
    const followUps = this.generateContextualFollowUps(userContext, topic);
    
    return {
      message: personalizedResponse,
      suggestions: followUps,
      context: {
        topic,
        experienceLevel: userContext.preferences.experienceLevel,
        communicationStyle: userContext.preferences.communicationStyle,
        personalized: true
      }
    };
  }

  // Add entry-level context
  addEntryLevelContext(response, topic) {
    const entryLevelAdditions = {
      resume: " Since you're just starting your career, focus on highlighting your education, projects, and any relevant experience.",
      interview: " As an entry-level candidate, emphasize your potential, willingness to learn, and cultural fit.",
      skills: " Start with foundational skills and build up gradually. Don't worry about having everything mastered yet.",
      career: " This is a great time to explore different paths and find what interests you most."
    };

    return response + (entryLevelAdditions[topic] || "");
  }

  // Add senior-level context
  addSeniorLevelContext(response, topic) {
    const seniorLevelAdditions = {
      resume: " At your level, focus on strategic impact, leadership, and quantifiable business results.",
      interview: " Senior-level interviews focus on strategic thinking, leadership, and business impact.",
      skills: " Consider executive education and thought leadership opportunities to advance further.",
      career: " Focus on legacy, mentorship, and strategic impact in your industry."
    };

    return response + (seniorLevelAdditions[topic] || "");
  }

  // Make response formal
  makeFormal(response) {
    return response.replace(/I'm/g, "I am")
                  .replace(/you're/g, "you are")
                  .replace(/don't/g, "do not")
                  .replace(/can't/g, "cannot");
  }

  // Make response casual
  makeCasual(response) {
    return response.replace(/I am/g, "I'm")
                  .replace(/you are/g, "you're")
                  .replace(/do not/g, "don't")
                  .replace(/cannot/g, "can't");
  }

  // Make response brief
  makeBrief(response) {
    const sentences = response.split('.');
    return sentences.slice(0, 2).join('.') + '.';
  }

  // Make response comprehensive
  makeComprehensive(response, topic) {
    const comprehensiveAdditions = {
      resume: " Additionally, consider including a skills section, certifications, and relevant projects. Remember to quantify achievements where possible.",
      interview: " Also prepare for behavioral questions using the STAR method, research the company thoroughly, and prepare thoughtful questions to ask.",
      skills: " Consider both technical and soft skills, and how they complement each other in your target role.",
      career: " Think about your long-term goals, work-life balance preferences, and the type of company culture that suits you best."
    };

    return response + (comprehensiveAdditions[topic] || "");
  }

  // Generate contextual follow-ups
  generateContextualFollowUps(userContext, topic) {
    const followUps = {
      resume: ["How to improve my resume?", "Resume format options", "What to include in resume"],
      interview: ["Common interview questions", "Interview preparation tips", "Behavioral interview techniques"],
      skills: ["What skills should I learn next?", "Skills gap analysis", "Learning resources"],
      career: ["Career change advice", "Career advancement strategies", "Industry insights"]
    };

    // Add personalized follow-ups based on user history
    const userTopics = userContext.contextMemory.recentTopics.map(t => t.topic);
    const personalizedFollowUps = followUps[topic] || [];

    // Add follow-ups for topics the user hasn't discussed recently
    const unusedTopics = Object.keys(followUps).filter(t => !userTopics.includes(t));
    if (unusedTopics.length > 0) {
      const randomTopic = unusedTopics[Math.floor(Math.random() * unusedTopics.length)];
      personalizedFollowUps.push(`Learn about ${randomTopic.replace('_', ' ')}`);
    }

    return personalizedFollowUps.slice(0, 3);
  }

  // Clear cache for performance
  clearCache() {
    this.contextCache.clear();
    this.sessionCache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      contextCacheSize: this.contextCache.size,
      sessionCacheSize: this.sessionCache.size
    };
  }
}

// Create singleton instance
const contextService = new ContextService();

module.exports = contextService; 