const Chat = require('../models/Chat');
const UserContext = require('../models/UserContext');
const contextService = require('../utils/contextService');
const languageService = require('../utils/languageService');

// Performance monitoring
const performanceMetrics = {
  totalRequests: 0,
  averageResponseTime: 0,
  cacheHits: 0,
  cacheMisses: 0
};

// Enhanced mock responses with context awareness
const enhancedResponses = {
  // Identity and Introduction
  identity: {
    exact: {
      "what is your name": "Hello! I'm SkillBridge AI, your personal career development assistant. I'm here to help you with career guidance, resume tips, interview preparation, and professional development.",
      "who are you": "Hello! I'm SkillBridge AI, your personal career development assistant. I'm here to help you with career guidance, resume tips, interview preparation, and professional development.",
      "what can you do": "I'm your career development assistant! I can help with resume writing, interview preparation, career advice, skills development, job search strategies, networking tips, and professional growth guidance.",
      "introduce yourself": "Hello! I'm SkillBridge AI, your dedicated career development assistant. I specialize in helping professionals like you achieve their career goals through personalized guidance and expert advice."
    },
    patterns: {
      "name": "Hello! I'm SkillBridge AI, your personal career development assistant. I'm here to help you with career guidance, resume tips, interview preparation, and professional development.",
      "who": "Hello! I'm SkillBridge AI, your personal career development assistant. I'm here to help you with career guidance, resume tips, interview preparation, and professional development.",
      "introduce": "Hello! I'm SkillBridge AI, your dedicated career development assistant. I specialize in helping professionals like you achieve their career goals through personalized guidance and expert advice."
    }
  },

  // Resume and CV
  resume: {
    exact: {
      "what is resume": "A resume is a professional document that summarizes your work experience, education, skills, and achievements. It's your first impression to potential employers and should be tailored to each job application.",
      "what is cv": "A CV (Curriculum Vitae) is a detailed document that outlines your academic and professional history. It's typically longer than a resume and includes publications, research, and academic achievements.",
      "how to write resume": "To write an effective resume: 1) Start with a strong summary, 2) List relevant experience with quantifiable achievements, 3) Include key skills, 4) Add education and certifications, 5) Use action verbs, 6) Keep it concise (1-2 pages), 7) Proofread carefully.",
      "resume tips": "Key resume tips: Use action verbs, quantify achievements, tailor to job description, keep it clean and readable, include relevant keywords, proofread multiple times, and update regularly.",
      "resume format": "Common resume formats: 1) Chronological (most common) - lists experience by date, 2) Functional - focuses on skills, 3) Combination - mixes both approaches. Choose based on your experience level and career goals."
    },
    patterns: {
      "resume": "A resume is a professional document that summarizes your work experience, education, skills, and achievements. It's your first impression to potential employers.",
      "cv": "A CV (Curriculum Vitae) is a detailed document that outlines your academic and professional history, typically longer than a resume.",
      "write": "To write an effective resume: start with a strong summary, list relevant experience with quantifiable achievements, include key skills, and keep it concise."
    }
  },

  // Career Development
  career: {
    exact: {
      "career advice": "Career advice: 1) Continuously learn and upskill, 2) Build a strong network, 3) Set clear goals, 4) Seek mentorship, 5) Stay adaptable to change, 6) Focus on value creation, 7) Maintain work-life balance, 8) Build your personal brand.",
      "how to advance career": "To advance your career: 1) Identify your goals, 2) Develop relevant skills, 3) Build relationships, 4) Take on challenging projects, 5) Seek feedback, 6) Stay updated with industry trends, 7) Consider further education, 8) Be proactive about opportunities.",
      "career change": "Career change tips: 1) Assess your transferable skills, 2) Research your target industry, 3) Network with professionals in the field, 4) Gain relevant experience through projects or volunteering, 5) Update your skills, 6) Be patient with the transition.",
      "job search": "Effective job search strategies: 1) Optimize your resume and LinkedIn, 2) Network actively, 3) Use multiple job boards, 4) Research companies thoroughly, 5) Prepare for interviews, 6) Follow up appropriately, 7) Stay organized and persistent."
    },
    patterns: {
      "career": "Career development involves continuous learning, skill building, networking, and strategic planning to achieve your professional goals.",
      "advance": "Career advancement requires skill development, networking, taking initiative, and demonstrating value to your organization.",
      "change": "Career changes require careful planning, skill assessment, networking, and sometimes additional education or training."
    }
  },

  // Interview Preparation
  interview: {
    exact: {
      "interview tips": "Interview tips: 1) Research the company thoroughly, 2) Prepare STAR method answers, 3) Dress appropriately, 4) Arrive early, 5) Ask thoughtful questions, 6) Follow up with a thank-you note, 7) Practice common questions, 8) Show enthusiasm and confidence.",
      "interview questions": "Common interview questions: Tell me about yourself, Why do you want this job, What are your strengths/weaknesses, Where do you see yourself in 5 years, Why should we hire you, What are your salary expectations, Do you have any questions for us.",
      "behavioral interview": "Behavioral interviews use the STAR method: Situation (describe the context), Task (explain your responsibility), Action (detail what you did), Result (share the outcome). Prepare examples for leadership, teamwork, problem-solving, and conflict resolution.",
      "interview preparation": "Interview preparation: 1) Research the company and role, 2) Prepare your elevator pitch, 3) Practice common questions, 4) Prepare questions to ask, 5) Plan your outfit, 6) Know your resume inside out, 7) Practice with a friend or mentor."
    },
    patterns: {
      "interview": "Interview preparation involves research, practice, and confidence. Focus on the STAR method for behavioral questions and always prepare thoughtful questions to ask.",
      "behavioral": "Behavioral interviews use the STAR method: Situation, Task, Action, Result. Prepare specific examples from your experience.",
      "questions": "Common interview questions include: Tell me about yourself, Why this role, What are your strengths/weaknesses, and Where do you see yourself in 5 years."
    }
  },

  // Skills Development
  skills: {
    exact: {
      "what skills should i learn": "Focus on skills relevant to your target role: 1) Technical skills for your field, 2) Soft skills (communication, leadership, teamwork), 3) Digital skills (data analysis, project management tools), 4) Industry-specific certifications, 5) Languages if relevant to your market.",
      "skill development": "Skill development strategies: 1) Identify skill gaps, 2) Set learning goals, 3) Use online courses and resources, 4) Practice through projects, 5) Seek feedback, 6) Apply skills in real situations, 7) Stay updated with industry trends, 8) Network with experts.",
      "learning resources": "Learning resources: 1) Online platforms (Coursera, Udemy, LinkedIn Learning), 2) Industry certifications, 3) Books and podcasts, 4) Professional associations, 5) Mentorship programs, 6) Workshops and conferences, 7) Practice projects, 8) Networking groups."
    },
    patterns: {
      "skill": "Skill development is crucial for career growth. Focus on both technical and soft skills relevant to your target role and industry.",
      "learn": "Continuous learning is essential for career success. Use online resources, certifications, and practical projects to develop new skills.",
      "development": "Skill development requires consistent effort, practice, and application in real-world situations."
    }
  },

  // Networking
  networking: {
    exact: {
      "networking tips": "Networking tips: 1) Be genuine and authentic, 2) Listen more than you talk, 3) Offer value to others, 4) Follow up appropriately, 5) Use LinkedIn effectively, 6) Attend industry events, 7) Join professional groups, 8) Maintain relationships over time.",
      "how to network": "Effective networking: 1) Start with your existing contacts, 2) Attend industry events and conferences, 3) Join professional associations, 4) Use social media platforms, 5) Offer help before asking for it, 6) Follow up and stay in touch, 7) Be patient and consistent.",
      "linkedin tips": "LinkedIn optimization: 1) Complete your profile thoroughly, 2) Use a professional photo, 3) Write a compelling headline, 4) Share relevant content, 5) Engage with others' posts, 6) Join relevant groups, 7) Connect with industry professionals, 8) Keep your profile updated."
    },
    patterns: {
      "network": "Networking is about building genuine relationships. Focus on offering value to others and maintaining long-term connections.",
      "linkedin": "LinkedIn is a powerful networking tool. Optimize your profile, share relevant content, and engage with your network regularly."
    }
  },

  // Greetings and General
  general: {
    exact: {
      "hello": "Hello! I'm SkillBridge AI, your career development assistant. How can I help you today?",
      "hi": "Hi there! I'm SkillBridge AI, your career development assistant. How can I help you today?",
      "help": "I'm here to help! I can assist with: resume writing, career advice, interview prep, job search strategies, skills development, networking, and more. What would you like to know?",
      "thank you": "You're very welcome! I'm glad I could help. Is there anything else you'd like to know about your career development?",
      "thanks": "You're very welcome! I'm glad I could help. Is there anything else you'd like to know about your career development?"
    },
    patterns: {
      "hello": "Hello! I'm SkillBridge AI, your career development assistant. How can I help you today?",
      "hi": "Hi there! I'm SkillBridge AI, your career development assistant. How can I help you today?",
      "help": "I'm here to help! I can assist with resume writing, career advice, interview prep, job search strategies, skills development, networking, and more.",
      "thank": "You're very welcome! I'm glad I could help. Is there anything else you'd like to know about your career development?"
    }
  }
};

// Get response with enhanced matching
async function getEnhancedResponseWithContext(userMessage, userId) {
  const startTime = Date.now();
  const lowerMessage = userMessage.toLowerCase().trim();

  // Performance tracking
  performanceMetrics.totalRequests++;

  // Context-aware: What should I learn next?
  if (userId && (
    lowerMessage.includes('what should i learn next') ||
    lowerMessage.includes('what skills should i learn') ||
    lowerMessage.includes('what to learn next') ||
    lowerMessage.includes('which skills to learn')
  )) {
    try {
      const Analysis = require('../models/Analysis');
      const latest = await Analysis.findOne({ user: userId, status: 'completed' }).sort({ createdAt: -1 });
      if (latest && latest.learningGaps && latest.learningGaps.length > 0) {
        const gap = latest.learningGaps[0];
        if (gap.missingSkills && gap.missingSkills.length > 0) {
          return {
            message: `Based on your recent analysis, you should focus on developing these skills in the domain of ${gap.domain}: ${gap.missingSkills.join(', ')}. Would you like resources or a learning plan for these?`,
            confidence: 1.0,
            category: 'context_aware_skills',
            responseTime: Date.now() - startTime
          };
        } else {
          return {
            message: `Your top learning gap is in ${gap.domain}. Would you like advice or resources to improve in this area?`,
            confidence: 0.9,
            category: 'context_aware_skills',
            responseTime: Date.now() - startTime
          };
        }
      }
    } catch (e) {
      // Ignore errors, fallback to generic
    }
  }

  // Check for exact matches first (highest priority)
  for (const category of Object.values(enhancedResponses)) {
    if (category.exact && category.exact[lowerMessage]) {
      performanceMetrics.cacheHits++;
      return {
        message: category.exact[lowerMessage],
        confidence: 1.0,
        category: 'exact_match',
        responseTime: Date.now() - startTime
      };
    }
  }

  // Check for pattern matches
  for (const [categoryName, category] of Object.entries(enhancedResponses)) {
    if (category.patterns) {
      for (const [pattern, response] of Object.entries(category.patterns)) {
        if (lowerMessage.includes(pattern)) {
          performanceMetrics.cacheHits++;
          return {
            message: response,
            confidence: 0.9,
            category: categoryName,
            pattern: pattern,
            responseTime: Date.now() - startTime
          };
        }
      }
    }
  }

  // Enhanced keyword analysis for better matching
  const keywords = {
    resume: ['resume', 'cv', 'curriculum vitae', 'application'],
    interview: ['interview', 'interviewing', 'questions', 'preparation'],
    career: ['career', 'job', 'profession', 'work', 'employment'],
    skills: ['skill', 'learn', 'training', 'development', 'competency'],
    networking: ['network', 'connect', 'relationship', 'linkedin'],
    salary: ['salary', 'pay', 'compensation', 'money', 'earnings'],
    leadership: ['lead', 'leadership', 'manage', 'supervise', 'direct'],
    communication: ['communicate', 'presentation', 'speaking', 'writing'],
    time: ['time management', 'productivity', 'efficiency', 'schedule'],
    remote: ['remote', 'work from home', 'telecommute', 'virtual'],
    freelance: ['freelance', 'contract', 'consulting', 'self-employed'],
    branding: ['brand', 'personal brand', 'reputation', 'image']
  };

  let bestMatch = null;
  let highestScore = 0;

  for (const [category, keywordList] of Object.entries(keywords)) {
    const score = keywordList.reduce((total, keyword) => {
      return total + (lowerMessage.includes(keyword) ? 1 : 0);
    }, 0);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = category;
    }
  }

  if (bestMatch && highestScore > 0) {
    performanceMetrics.cacheHits++;
    const categoryResponses = enhancedResponses[bestMatch];
    const response = categoryResponses?.patterns?.[bestMatch] || 
                    categoryResponses?.exact?.[Object.keys(categoryResponses.exact)[0]] ||
                    "I can help you with that! Could you please provide more specific details about what you'd like to know?";
    return {
      message: response,
      confidence: 0.7 + (highestScore * 0.1),
      category: bestMatch,
      responseTime: Date.now() - startTime
    };
  }

  // Fallback: Suggest something from user's latest analysis
  let personalizedFallback = "I'm not sure how to help with that. Would you like advice on your career, skills, or learning paths?";
  if (userId) {
    try {
      const Analysis = require('../models/Analysis');
      const latest = await Analysis.findOne({ user: userId, status: 'completed' }).sort({ createdAt: -1 });
      if (latest) {
        if (latest.learningGaps && latest.learningGaps.length > 0) {
          const gap = latest.learningGaps[0];
          personalizedFallback = `I'm not sure how to help with that. But I noticed you have a learning gap in ${gap.domain}. Would you like resources or advice to improve in this area?`;
        } else if (latest.analysisSummary && latest.analysisSummary.topDomain) {
          personalizedFallback = `I'm not sure how to help with that. But your top domain is ${latest.analysisSummary.topDomain}. Would you like tips or resources for this field?`;
        }
      }
    } catch (e) {
      // Ignore errors, fallback to generic
    }
  }
  return {
    message: personalizedFallback,
    confidence: 0.5,
    category: 'fallback',
    responseTime: Date.now() - startTime
  };
}

// Enhanced chat controller with all new features
const chatController = {
  // Send message with enhanced features
  async sendMessage(req, res) {
    try {
      const startTime = Date.now();
      const { message, userId, sessionId, language = 'en' } = req.body;
      
      if (!message || !message.trim()) {
        return res.status(400).json({ 
          success: false, 
          message: 'Message is required' 
        });
      }

      // Detect language if not provided
      const detectedLanguage = languageService.detectLanguage(message);
      const userLanguage = language || detectedLanguage;

      // Get base response
      let personalizedResponse = await getEnhancedResponseWithContext(message, userId);
      
      // Get user context for personalization
      let userContext = null;
      
      if (userId) {
        try {
          userContext = await contextService.getUserContext(userId);
          
          // Get personalized response
          const personalized = await contextService.getPersonalizedResponse(
            userId, 
            message, 
            personalizedResponse.message
          );
          
          personalizedResponse = {
            ...personalizedResponse,
            message: personalized.message,
            suggestions: personalized.suggestions,
            context: personalized.context
          };
          
          // Update conversation context
          await contextService.updateConversationContext(
            userId, 
            message, 
            personalizedResponse.message, 
            sessionId || 'default-session'
          );
        } catch (error) {
          console.error('Context service error:', error);
          // Continue with base response if context service fails
        }
      }

      // Apply language translation if needed
      let finalResponse = personalizedResponse;
      if (userLanguage !== 'en') {
        finalResponse = languageService.formatResponse(personalizedResponse, userLanguage);
      }

      // Save chat to database
      if (userId) {
        try {
          const chat = new Chat({
            userId,
            userMessage: message,
            aiResponse: finalResponse.message,
            context: {
              conversationId: sessionId || 'default-session',
              sessionId: sessionId || 'default-session',
              topic: finalResponse.category,
              userMood: 'neutral', // Will be updated by context service
              userIntent: 'information_request',
              confidence: finalResponse.confidence,
              followUpQuestions: finalResponse.suggestions || []
            },
            personalization: {
              experienceLevel: userContext?.preferences?.experienceLevel || 'entry',
              industry: userContext?.preferences?.industry || '',
              preferredLanguage: userLanguage,
              learningStyle: userContext?.preferences?.learningStyle || 'visual'
            },
            performance: {
              responseTime: Date.now() - startTime,
              messageLength: message.length + finalResponse.message.length,
              complexity: 'moderate'
            },
            language: {
              userLanguage: userLanguage,
              detectedLanguage: detectedLanguage,
              translationNeeded: userLanguage !== 'en'
            }
          });
          
          await chat.save();
        } catch (error) {
          console.error('Database save error:', error);
          // Continue even if save fails
        }
      }

      // Update performance metrics
      const totalTime = Date.now() - startTime;
      performanceMetrics.averageResponseTime = 
        (performanceMetrics.averageResponseTime * (performanceMetrics.totalRequests - 1) + totalTime) / 
        performanceMetrics.totalRequests;

      res.json({
        success: true,
        message: finalResponse.message,
        suggestions: finalResponse.suggestions || [],
        context: {
          category: finalResponse.category,
          confidence: finalResponse.confidence,
          language: userLanguage,
          personalized: !!userContext,
          responseTime: totalTime
        },
        performance: {
          cacheHit: finalResponse.category !== 'fallback',
          responseTime: totalTime
        }
      });

    } catch (error) {
      console.error('Chat controller error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  // Get chat history with context
  async getChatHistory(req, res) {
    try {
      const { limit = 50, sessionId } = req.query;
      const userId = req.user._id;

      let query = { userId };
      if (sessionId) {
        query['context.sessionId'] = sessionId;
      }

      const chats = await Chat.find(query)
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .select('userMessage aiResponse timestamp context personalization');

      res.json({
        success: true,
        chats: chats.reverse(), // Return in chronological order
        total: chats.length
      });

    } catch (error) {
      console.error('Get chat history error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  // Get user context and insights
  async getUserInsights(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'User ID is required' 
        });
      }

      const userContext = await UserContext.getUserInsights(userId);
      
      if (!userContext) {
        return res.status(404).json({ 
          success: false, 
          message: 'User context not found' 
        });
      }

      res.json({
        success: true,
        insights: {
          preferences: userContext.preferences,
          conversationHistory: userContext.conversationHistory,
          performance: userContext.performance,
          recentTopics: userContext.contextMemory.recentTopics.slice(0, 5)
        }
      });

    } catch (error) {
      console.error('Get user insights error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  // Update user preferences
  async updatePreferences(req, res) {
    try {
      const { userId } = req.params;
      const preferences = req.body;
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'User ID is required' 
        });
      }

      const userContext = await UserContext.findOneAndUpdate(
        { userId },
        { $set: { preferences } },
        { new: true, upsert: true }
      );

      // Clear cache for this user
      contextService.clearCache();

      res.json({
        success: true,
        message: 'Preferences updated successfully',
        preferences: userContext.preferences
      });

    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  // Get performance metrics
  async getPerformanceMetrics(req, res) {
    try {
      const cacheStats = contextService.getCacheStats();
      const languageCacheSize = languageService.getCacheSize();
      
      res.json({
        success: true,
        metrics: {
          ...performanceMetrics,
          contextCache: cacheStats,
          languageCache: languageCacheSize,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Get performance metrics error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  // Get supported languages
  async getSupportedLanguages(req, res) {
    try {
      const languages = languageService.getSupportedLanguages();
      
      res.json({
        success: true,
        languages
      });

    } catch (error) {
      console.error('Get supported languages error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  // Clear caches for performance
  async clearCaches(req, res) {
    try {
      contextService.clearCache();
      languageService.clearCache();
      
      res.json({
        success: true,
        message: 'All caches cleared successfully'
      });

    } catch (error) {
      console.error('Clear caches error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
};

module.exports = chatController; 