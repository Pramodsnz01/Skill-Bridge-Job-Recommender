// Use Vite environment variable directly for API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

// Enhanced mock responses with context awareness
const mockResponses = {
  // Personal/Identity Questions
  "what is your name": "Hello! I'm SkillBridge AI, your personal career assistant. I'm here to help you with career guidance, resume tips, interview preparation, and professional development. You can call me SkillBridge or just AI!",
  
  "who are you": "I'm SkillBridge AI, your dedicated career development assistant. I help professionals like you with resume optimization, career planning, skill development, interview preparation, and job search strategies. Think of me as your personal career coach!",
  
  "what can you do": "I can help you with: 1) Resume writing and optimization, 2) Career advice and planning, 3) Interview preparation tips, 4) Skills gap analysis, 5) Job search strategies, 6) Salary negotiation advice, 7) Networking tips, 8) Learning path recommendations, 9) Industry insights, and 10) Professional development guidance. What would you like to explore?",
  
  "how do you work": "I work by analyzing your questions and providing personalized career advice based on your experience level, industry, and specific needs. I can help you with resume analysis, career planning, and professional development strategies. Just ask me anything career-related!",
  
  // Resume Related Questions
  "what is resume": "A resume is a professional document that summarizes your work experience, education, skills, and achievements. It's your first impression to potential employers and should highlight your qualifications for a specific job. Think of it as your professional story on paper!",
  
  "what is cv": "A CV (Curriculum Vitae) is similar to a resume but more detailed and comprehensive. It's commonly used in academic, scientific, and international contexts. While a resume is typically 1-2 pages, a CV can be longer and includes more detailed information about research, publications, presentations, and academic achievements.",
  
  "how long should resume be": "Resume length depends on your experience: 1) Entry-level: 1 page maximum, 2) Mid-career: 1-2 pages, 3) Senior/Executive: 2-3 pages. Focus on relevance and impact rather than length. Every word should add value!",
  
  "what should i put on resume": "Your resume should include: 1) Contact information, 2) Professional summary, 3) Work experience (with achievements), 4) Education, 5) Skills (technical and soft), 6) Certifications, 7) Projects (if relevant), 8) Languages (if applicable). Focus on achievements, not just responsibilities!",
  
  "resume format": "Popular resume formats: 1) Chronological (most common) - lists experience by date, 2) Functional - focuses on skills, 3) Combination - mixes both approaches. Choose based on your career situation and target role.",
  
  // Resume and CV related
  "resume": {
    entry: "For entry-level positions, focus on: 1) Education and relevant coursework, 2) Internships and projects, 3) Volunteer work and extracurricular activities, 4) Technical skills and certifications, 5) A strong objective statement. Keep it to 1 page and use action verbs!",
    mid: "For mid-level professionals: 1) Quantify achievements with metrics, 2) Focus on leadership and project management, 3) Include relevant certifications and training, 4) Show progression in responsibilities, 5) Tailor to specific job requirements. Aim for 2 pages maximum.",
    senior: "For senior positions: 1) Lead with executive summary, 2) Emphasize strategic impact and business results, 3) Include board/committee experience, 4) Show thought leadership and industry recognition, 5) Focus on transformation and growth initiatives."
  },
  
  // Skills development
  "skills": {
    tech: "For tech professionals, focus on: 1) Cloud platforms (AWS/Azure/GCP), 2) AI/ML and data science, 3) Cybersecurity fundamentals, 4) DevOps and CI/CD, 5) Programming languages (Python, JavaScript, Go), 6) Soft skills like communication and leadership.",
    business: "For business professionals: 1) Data analysis and visualization, 2) Project management methodologies, 3) Digital marketing and analytics, 4) Financial modeling, 5) Strategic planning, 6) Cross-functional collaboration.",
    creative: "For creative professionals: 1) Design software mastery, 2) Digital marketing tools, 3) Content creation and storytelling, 4) User experience design, 5) Brand strategy, 6) Portfolio development."
  },
  
  // Interview preparation
  "interview": {
    entry: "Entry-level interview prep: 1) Research the company culture and values, 2) Prepare STAR method responses for behavioral questions, 3) Practice technical skills if applicable, 4) Prepare thoughtful questions about growth opportunities, 5) Dress professionally and arrive early.",
    mid: "Mid-level interview prep: 1) Research company financials and market position, 2) Prepare examples of leadership and problem-solving, 3) Understand the role's impact on business goals, 4) Prepare questions about team structure and challenges, 5) Discuss salary expectations professionally.",
    senior: "Senior-level interview prep: 1) Research company strategy and competitive landscape, 2) Prepare examples of strategic initiatives and business impact, 3) Understand board/executive dynamics, 4) Prepare questions about organizational challenges, 5) Discuss compensation package and equity."
  },
  
  // Career change
  "career change": {
    tech: "Transitioning to tech: 1) Start with foundational programming (Python/JavaScript), 2) Build a portfolio with personal projects, 3) Get relevant certifications (AWS, Google, Microsoft), 4) Network in tech communities, 5) Consider bootcamps or online courses, 6) Start with entry-level positions to gain experience.",
    business: "Transitioning to business: 1) Develop analytical skills (Excel, SQL, Tableau), 2) Get business certifications (PMP, Six Sigma), 3) Network in business communities, 4) Consider MBA or business courses, 5) Start with consulting or analyst roles, 6) Leverage transferable skills from your current field.",
    creative: "Transitioning to creative: 1) Build a strong portfolio showcasing your work, 2) Learn industry-standard tools (Adobe Creative Suite, Figma), 3) Network in creative communities, 4) Take relevant courses or workshops, 5) Start with freelance work to build experience, 6) Develop your unique style and voice."
  },
  
  // Salary negotiation
  "salary": {
    entry: "Entry-level negotiation: 1) Research market rates for your role and location, 2) Focus on learning opportunities and growth potential, 3) Consider total compensation (benefits, PTO, professional development), 4) Be prepared to discuss your value proposition, 5) Practice your pitch with a mentor.",
    mid: "Mid-level negotiation: 1) Research industry standards and company compensation, 2) Quantify your achievements and impact, 3) Consider equity, bonuses, and benefits, 4) Be prepared to discuss career progression, 5) Have a BATNA (Best Alternative To Negotiated Agreement).",
    senior: "Senior-level negotiation: 1) Research executive compensation in your industry, 2) Focus on strategic value and business impact, 3) Negotiate equity, bonuses, and benefits package, 4) Consider long-term incentives and exit strategies, 5) Work with a compensation consultant if needed."
  },
  
  // General Questions
  "hello": "Hello! 👋 I'm SkillBridge AI, your career development assistant. How can I help you today? I can assist with resume tips, career advice, interview preparation, and much more!",
  
  "hi": "Hi there! 😊 I'm here to help with your career journey. What would you like to know about?",
  
  "help": "I'm here to help! I can assist with: resume writing, career advice, interview prep, job search strategies, skills development, networking, and more. Just ask me anything career-related!",
  
  "thank you": "You're very welcome! 😊 I'm glad I could help. Is there anything else you'd like to know about your career development?",
  
  "thanks": "You're welcome! Feel free to ask me anything else about your career journey. I'm here to help!",
  
  "goodbye": "Goodbye! 👋 Good luck with your career journey. Remember, I'm here whenever you need career advice or guidance. Take care!",
  
  "bye": "Bye! 👋 Feel free to come back anytime for career advice and guidance. Best of luck!",
  
  // Educational Questions
  "what is machine learning": "Machine Learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed. It's used in recommendation systems, image recognition, natural language processing, and many other applications. It's a great skill to learn for tech careers!",
  
  "what is artificial intelligence": "Artificial Intelligence (AI) is technology that enables computers to perform tasks that typically require human intelligence, such as learning, reasoning, problem-solving, and decision-making. It's transforming industries and creating new career opportunities.",
  
  "what is data science": "Data Science combines statistics, programming, and domain expertise to extract insights from data. It involves collecting, cleaning, analyzing, and interpreting data to help organizations make better decisions. It's one of the fastest-growing career fields!",
  
  "what is cloud computing": "Cloud computing provides computing services over the internet, including servers, storage, databases, networking, and software. Major providers include AWS, Azure, and Google Cloud. Cloud skills are highly in demand across industries.",
  
  // Industry Specific
  "tech career": "Tech career paths include: 1) Software Development (Frontend, Backend, Full-stack), 2) Data Science & Analytics, 3) DevOps & Cloud Engineering, 4) Cybersecurity, 5) Product Management, 6) UX/UI Design, 7) AI/ML Engineering. Which area interests you?",
  
  "data science": "Data Science career path: 1) Learn Python/R and SQL, 2) Master statistics and mathematics, 3) Learn machine learning algorithms, 4) Practice with real datasets, 5) Build a portfolio of projects, 6) Get certifications (AWS, Google, Microsoft), 7) Network in data science communities.",
  
  "software development": "Software Development path: 1) Choose a programming language (Python, JavaScript, Java, C#), 2) Learn web development (HTML, CSS, JavaScript), 3) Understand databases and APIs, 4) Learn version control (Git), 5) Build projects for your portfolio, 6) Contribute to open source, 7) Stay updated with new technologies.",
  
  "marketing career": "Marketing career options: 1) Digital Marketing, 2) Content Marketing, 3) Social Media Marketing, 4) SEO/SEM, 5) Brand Management, 6) Marketing Analytics, 7) Product Marketing. Focus on data-driven approaches and digital skills.",
  
  // Interview Questions
  "common interview questions": "Common interview questions: 1) 'Tell me about yourself', 2) 'Why do you want this job?', 3) 'What are your strengths/weaknesses?', 4) 'Where do you see yourself in 5 years?', 5) 'Why should we hire you?', 6) 'Describe a challenging situation', 7) 'What are your salary expectations?'",
  
  "behavioral interview": "Behavioral interview tips: 1) Use the STAR method (Situation, Task, Action, Result), 2) Prepare specific examples, 3) Focus on your role and impact, 4) Be honest and authentic, 5) Practice your responses, 6) Keep answers concise (1-2 minutes), 7) Show growth and learning.",
  
  "technical interview": "Technical interview prep: 1) Review fundamental concepts, 2) Practice coding problems (LeetCode, HackerRank), 3) Understand data structures and algorithms, 4) Practice system design questions, 5) Review your projects thoroughly, 6) Prepare questions about the company's tech stack, 7) Practice explaining your thought process.",
  
  // Professional Development
  "leadership skills": "Develop leadership skills by: 1) Taking initiative on projects, 2) Mentoring junior colleagues, 3) Leading meetings and presentations, 4) Developing emotional intelligence, 5) Learning conflict resolution, 6) Building cross-functional relationships, 7) Taking on stretch assignments.",
  
  "communication skills": "Improve communication: 1) Practice active listening, 2) Write clearly and concisely, 3) Present information effectively, 4) Adapt your style to your audience, 5) Give and receive feedback constructively, 6) Use storytelling in presentations, 7) Practice public speaking.",
  
  "time management": "Time management strategies: 1) Use the Pomodoro Technique, 2) Prioritize tasks (Eisenhower Matrix), 3) Set SMART goals, 4) Eliminate distractions, 5) Delegate when possible, 6) Use productivity tools, 7) Learn to say 'no' to non-essential tasks.",
  
  // Job Search
  "linkedin optimization": "Optimize your LinkedIn: 1) Professional headshot, 2) Compelling headline, 3) Detailed summary, 4) Quantified achievements, 5) Relevant keywords, 6) Active engagement, 7) Regular updates, 8) Professional recommendations.",
  
  "job application": "Job application tips: 1) Customize resume for each role, 2) Write compelling cover letters, 3) Research the company thoroughly, 4) Follow application instructions exactly, 5) Use keywords from job description, 6) Follow up after applying, 7) Keep track of applications.",
  
  "remote work": "Remote work tips: 1) Set up a dedicated workspace, 2) Establish clear boundaries, 3) Use productivity tools, 4) Maintain regular communication, 5) Take breaks and move around, 6) Dress professionally for video calls, 7) Over-communicate with your team.",
  
  // Career Change
  "career change": "Career change strategies: 1) Assess your transferable skills, 2) Research your target industry, 3) Network with professionals in the field, 4) Gain relevant experience through projects or volunteering, 5) Consider additional education or certifications, 6) Start with entry-level positions if needed, 7) Be patient with the transition process.",
  
  "how to switch careers": "To switch careers: 1) Identify your transferable skills, 2) Research your target field thoroughly, 3) Build relevant experience through projects, 4) Network with professionals in your target industry, 5) Consider additional training or education, 6) Update your resume to highlight relevant experience, 7) Be prepared to start at a lower level if necessary.",
  
  // Freelancing
  "freelancing": "Freelancing tips: 1) Build a strong portfolio, 2) Set competitive but fair rates, 3) Use platforms like Upwork, Fiverr, or Freelancer, 4) Network and build relationships, 5) Deliver quality work on time, 6) Manage your finances carefully, 7) Continuously market your services.",
  
  "side hustle": "Side hustle ideas: 1) Freelance writing or design, 2) Online tutoring, 3) Social media management, 4) Virtual assistance, 5) E-commerce (dropshipping, print-on-demand), 6) Content creation, 7) Consulting in your area of expertise.",
  
  // Personal Branding
  "personal branding": "Build your personal brand: 1) Define your unique value proposition, 2) Create consistent messaging across platforms, 3) Share valuable content regularly, 4) Network authentically, 5) Showcase your expertise, 6) Maintain professional online presence, 7) Be consistent and authentic.",
  
  "online presence": "Improve your online presence: 1) Optimize your LinkedIn profile, 2) Create a professional website or portfolio, 3) Share industry insights on social media, 4) Engage with professional communities, 5) Publish articles or blog posts, 6) Maintain consistent branding, 7) Monitor your online reputation."
};

// Enhanced Chat Service with advanced features
class ChatService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/chat`;
    this.userPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    this.conversationContext = {
      currentTopic: null,
      userMood: 'neutral',
      conversationFlow: [],
      sessionStartTime: new Date()
    };
  }

  // Set user preferences
  setUserPreferences(preferences) {
    this.userPreferences = { ...this.userPreferences, ...preferences };
    localStorage.setItem('userPreferences', JSON.stringify(this.userPreferences));
  }

  // Get user preferences
  getUserPreferences() {
    return this.userPreferences;
  }

  // Send message with enhanced features
  async sendMessage(message, userId, sessionId = null) {
    try {
      const response = await fetch(`${this.baseURL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message,
          userId,
          sessionId,
          preferences: this.userPreferences
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Store performance metrics
      if (data.performance) {
        this.storePerformanceMetrics(data.performance);
      }

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback to local response if API fails
      return this.getFallbackResponse(message);
    }
  }

  // Get chat history with context
  async getChatHistory(limit = 50, sessionId = null) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString()
      });
      
      if (sessionId) {
        params.append('sessionId', sessionId);
      }

      const response = await fetch(`${this.baseURL}/history?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting chat history:', error);
      return { success: false, chats: [] };
    }
  }

  // Get user insights and analytics
  async getUserInsights(userId) {
    try {
      const response = await fetch(`${this.baseURL}/insights/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user insights:', error);
      return { success: false, insights: null };
    }
  }

  // Update user preferences
  async updatePreferences(userId, preferences) {
    try {
      const response = await fetch(`${this.baseURL}/preferences/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update local preferences
      this.setUserPreferences(data.preferences);
      
      return data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return { success: false, message: 'Failed to update preferences' };
    }
  }

  // Get performance metrics
  async getPerformanceMetrics() {
    try {
      const response = await fetch(`${this.baseURL}/performance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      return { success: false, metrics: {} };
    }
  }

  // Clear caches
  async clearCaches() {
    try {
      const response = await fetch(`${this.baseURL}/clear-cache`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error clearing caches:', error);
      return { success: false, message: 'Failed to clear caches' };
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET'
      });

      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Store performance metrics locally
  storePerformanceMetrics(metrics) {
    const storedMetrics = JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
    storedMetrics.push({
      ...metrics,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 100 metrics
    if (storedMetrics.length > 100) {
      storedMetrics.splice(0, storedMetrics.length - 100);
    }
    
    localStorage.setItem('performanceMetrics', JSON.stringify(storedMetrics));
  }

  // Get local performance metrics
  getLocalPerformanceMetrics() {
    return JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
  }

  // Enhanced fallback response with better matching
  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    // Enhanced exact matches
    const exactMatches = {
      "what is your name": "Hello! I'm SkillBridge AI, your personal career development assistant. I'm here to help you with career guidance, resume tips, interview preparation, and professional development.",
      "who are you": "Hello! I'm SkillBridge AI, your personal career development assistant. I'm here to help you with career guidance, resume tips, interview preparation, and professional development.",
      "what is resume": "A resume is a professional document that summarizes your work experience, education, skills, and achievements. It's your first impression to potential employers and should be tailored to each job application.",
      "what is cv": "A CV (Curriculum Vitae) is a detailed document that outlines your academic and professional history. It's typically longer than a resume and includes publications, research, and academic achievements.",
      "hello": "Hello! I'm SkillBridge AI, your career development assistant. How can I help you today?",
      "hi": "Hi there! I'm SkillBridge AI, your career development assistant. How can I help you today?",
      "help": "I'm here to help! I can assist with: resume writing, career advice, interview prep, job search strategies, skills development, networking, and more. What would you like to know?",
      "thank you": "You're very welcome! I'm glad I could help. Is there anything else you'd like to know about your career development?",
      "thanks": "You're very welcome! I'm glad I could help. Is there anything else you'd like to know about your career development?"
    };

    // Check exact matches first
    if (exactMatches[lowerMessage]) {
      return {
        success: true,
        message: exactMatches[lowerMessage],
        suggestions: this.getContextualSuggestions(lowerMessage),
        context: {
          category: 'exact_match',
          confidence: 1.0,
          personalized: false
        }
      };
    }

    // Enhanced pattern matching
    const patterns = {
      resume: {
        keywords: ['resume', 'cv', 'curriculum vitae', 'application'],
        response: "A resume is a professional document that summarizes your work experience, education, skills, and achievements. It's your first impression to potential employers.",
        suggestions: ["How to improve my resume?", "Resume format options", "What to include in resume"]
      },
      interview: {
        keywords: ['interview', 'interviewing', 'questions', 'preparation'],
        response: "Interview preparation involves research, practice, and confidence. Focus on the STAR method for behavioral questions and always prepare thoughtful questions to ask.",
        suggestions: ["Common interview questions", "Interview preparation tips", "Behavioral interview techniques"]
      },
      career: {
        keywords: ['career', 'job', 'profession', 'work', 'employment'],
        response: "Career development involves continuous learning, skill building, networking, and strategic planning to achieve your professional goals.",
        suggestions: ["Career change advice", "Career advancement strategies", "Industry insights"]
      },
      skills: {
        keywords: ['skill', 'learn', 'training', 'development', 'competency'],
        response: "Skill development is crucial for career growth. Focus on both technical and soft skills relevant to your target role and industry.",
        suggestions: ["What skills should I learn next?", "Skills gap analysis", "Learning resources"]
      },
      networking: {
        keywords: ['network', 'connect', 'relationship', 'linkedin'],
        response: "Networking is about building genuine relationships. Focus on offering value to others and maintaining long-term connections.",
        suggestions: ["Networking tips", "LinkedIn optimization", "Building professional relationships"]
      }
    };

    // Check pattern matches
    for (const [category, pattern] of Object.entries(patterns)) {
      const matchCount = pattern.keywords.filter(keyword => 
        lowerMessage.includes(keyword)
      ).length;
      
      if (matchCount > 0) {
        return {
          success: true,
          message: pattern.response,
          suggestions: pattern.suggestions,
          context: {
            category: category,
            confidence: 0.8 + (matchCount * 0.1),
            personalized: false
          }
        };
      }
    }

    // Fallback response
    return {
      success: true,
      message: "I'm here to help with your career development! I can assist with resume writing, interview preparation, career advice, skills development, networking, and more. What specific area would you like to focus on?",
      suggestions: ["Resume writing tips", "Interview preparation", "Career advice", "Skills development"],
      context: {
        category: 'fallback',
        confidence: 0.5,
        personalized: false
      }
    };
  }

  // Get contextual suggestions based on message
  getContextualSuggestions(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
      return ["How to improve my resume?", "Resume format options", "What to include in resume"];
    }
    if (lowerMessage.includes('interview')) {
      return ["Common interview questions", "Interview preparation tips", "Behavioral interview techniques"];
    }
    if (lowerMessage.includes('career')) {
      return ["Career change advice", "Career advancement strategies", "Industry insights"];
    }
    if (lowerMessage.includes('skill')) {
      return ["What skills should I learn next?", "Skills gap analysis", "Learning resources"];
    }
    if (lowerMessage.includes('network')) {
      return ["Networking tips", "LinkedIn optimization", "Building professional relationships"];
    }
    
    return ["Resume writing tips", "Interview preparation", "Career advice", "Skills development"];
  }

  // Analyze user message for intent and topics
  analyzeMessage(message) {
    const text = message.toLowerCase();
    const topics = [];
    const intent = 'general';
    
    // Topic detection
    if (text.includes('resume') || text.includes('cv')) {
      topics.push('resume');
    }
    if (text.includes('interview') || text.includes('interviewing')) {
      topics.push('interview');
    }
    if (text.includes('skill') || text.includes('learn') || text.includes('development')) {
      topics.push('skills');
    }
    if (text.includes('career') || text.includes('job') || text.includes('position')) {
      topics.push('career');
    }
    if (text.includes('salary') || text.includes('pay') || text.includes('compensation')) {
      topics.push('salary');
    }
    if (text.includes('network') || text.includes('connect') || text.includes('relationship')) {
      topics.push('networking');
    }
    if (text.includes('leadership') || text.includes('manage') || text.includes('team')) {
      topics.push('leadership');
    }

    // Mood detection
    let mood = 'neutral';
    const positiveWords = ['great', 'awesome', 'excellent', 'good', 'happy', 'excited', 'thank'];
    const negativeWords = ['frustrated', 'worried', 'confused', 'stressed', 'difficult', 'help'];
    
    if (positiveWords.some(word => text.includes(word))) {
      mood = 'positive';
    } else if (negativeWords.some(word => text.includes(word))) {
      mood = 'concerned';
    }

    return { topics, intent, mood };
  }

  // Generate personalized response based on user profile and context
  generateResponse(message, userProfile, conversationContext, messageHistory, conversationStats) {
    const analysis = this.analyzeMessage(message.text);
    const userText = message.text.toLowerCase();
    
    // Update conversation context
    this.conversationContext.currentTopic = analysis.topics[0] || this.conversationContext.currentTopic;
    this.conversationContext.userMood = analysis.mood;
    this.conversationContext.conversationFlow.push({
      message: message.text,
      topics: analysis.topics,
      mood: analysis.mood,
      timestamp: new Date()
    });

    // Generate response based on experience level
    let response = this.getExperienceBasedResponse(userProfile.experience, analysis, userText);
    
    // Add industry-specific advice
    if (userProfile.industry) {
      response += this.getIndustrySpecificAdvice(userProfile.industry, analysis.topics);
    }

    // Add personalized suggestions
    const suggestions = this.generateSuggestions(analysis, userProfile, conversationContext);
    
    // Add follow-up questions
    const followUps = this.generateFollowUpQuestions(analysis, userProfile, conversationStats);

    return {
      message: response,
      suggestions: suggestions,
      followUpQuestions: followUps,
      context: {
        currentTopic: analysis.topics[0],
        userMood: analysis.mood,
        confidence: this.calculateConfidence(analysis, userProfile),
        topics: analysis.topics
      },
      type: this.determineResponseType(analysis, userText),
      confidence: this.calculateConfidence(analysis, userProfile)
    };
  }

  getExperienceBasedResponse(experience, analysis, userText) {
    const { topics, mood } = analysis;
    
    if (experience === 'entry') {
      return this.getEntryLevelResponse(topics, mood, userText);
    } else if (experience === 'mid') {
      return this.getMidLevelResponse(topics, mood, userText);
    } else if (experience === 'senior') {
      return this.getSeniorLevelResponse(topics, mood, userText);
    }
    
    return this.getGeneralResponse(topics, mood, userText);
  }

  getEntryLevelResponse(topics, mood, userText) {
    if (topics.includes('resume')) {
      return "For entry-level positions, focus on highlighting your education, relevant coursework, projects, and any internships. Use action verbs and quantify achievements where possible. Consider including a skills section with technical and soft skills. Would you like me to help you structure specific sections of your resume?";
    }
    if (topics.includes('interview')) {
      return "Entry-level interviews often focus on your potential and cultural fit. Practice common behavioral questions using the STAR method (Situation, Task, Action, Result). Research the company thoroughly and prepare thoughtful questions. What type of role are you interviewing for?";
    }
    if (topics.includes('skills')) {
      return "As an entry-level professional, focus on building both technical and soft skills. Consider online courses, certifications, and personal projects to demonstrate your abilities. What specific skills are you looking to develop?";
    }
    if (topics.includes('career')) {
      return "Starting your career journey is exciting! Focus on gaining experience, building your network, and identifying your interests. Consider informational interviews and mentorship opportunities. What industry interests you most?";
    }
    
    return "As you begin your career journey, focus on building a strong foundation. What specific aspect of career development would you like to explore?";
  }

  getMidLevelResponse(topics, mood, userText) {
    if (topics.includes('resume')) {
      return "For mid-level positions, emphasize your achievements and impact. Use metrics to quantify your contributions and highlight leadership experiences. Focus on results rather than just responsibilities. What specific achievements would you like to highlight?";
    }
    if (topics.includes('interview')) {
      return "Mid-level interviews often focus on your past achievements and future potential. Be prepared to discuss specific projects, challenges you've overcome, and how you've grown in your career. What's your biggest professional achievement?";
    }
    if (topics.includes('skills')) {
      return "At the mid-level, focus on developing specialized skills and leadership abilities. Consider advanced certifications, mentoring others, and taking on stretch assignments. What skills would help you advance to the next level?";
    }
    if (topics.includes('career')) {
      return "Mid-career is a great time to specialize or pivot. Consider your long-term goals and what skills/experiences you need to get there. Are you looking to advance in your current path or explore new opportunities?";
    }
    
    return "You're at a crucial point in your career where you can specialize or expand your scope. What direction interests you most?";
  }

  getSeniorLevelResponse(topics, mood, userText) {
    if (topics.includes('resume')) {
      return "Senior-level resumes should emphasize strategic impact, leadership, and business results. Focus on how you've influenced organizational outcomes and led teams or initiatives. What strategic initiatives have you led?";
    }
    if (topics.includes('interview')) {
      return "Senior-level interviews focus on strategic thinking, leadership, and business impact. Be prepared to discuss how you've influenced organizational strategy and led through change. What's your leadership philosophy?";
    }
    if (topics.includes('skills')) {
      return "At the senior level, focus on strategic thinking, executive communication, and business acumen. Consider executive education programs and board/advisor roles. What strategic skills would enhance your impact?";
    }
    if (topics.includes('career')) {
      return "Senior professionals often focus on legacy, mentorship, and strategic impact. Consider how you want to shape your industry or organization. What lasting impact do you want to make?";
    }
    
    return "You have valuable experience to share. How can I help you maximize your impact and achieve your next career milestone?";
  }

  getGeneralResponse(topics, mood, userText) {
    if (topics.includes('resume')) {
      return "Resume writing is crucial for career success. Focus on achievements, use action verbs, and tailor it to each position. What specific aspect of resume writing would you like to improve?";
    }
    if (topics.includes('interview')) {
      return "Interview preparation is key to success. Research the company, practice common questions, and prepare thoughtful responses. What type of interview are you preparing for?";
    }
    if (topics.includes('skills')) {
      return "Skill development is ongoing throughout your career. Identify gaps, seek learning opportunities, and practice regularly. What skills are most important for your goals?";
    }
    if (topics.includes('career')) {
      return "Career development is a journey. Set clear goals, build your network, and continuously learn and adapt. What's your current career focus?";
    }
    
    return "I'm here to help with your career development! What specific area would you like to explore?";
  }

  getIndustrySpecificAdvice(industry, topics) {
    const industryAdvice = {
      'technology': " In tech, staying current with emerging technologies and building a strong online presence through GitHub, LinkedIn, and technical blogs is crucial.",
      'healthcare': " In healthcare, focus on patient care experience, certifications, and staying updated with medical advancements and regulations.",
      'finance': " In finance, emphasize analytical skills, regulatory knowledge, and understanding of market trends and financial instruments.",
      'education': " In education, highlight teaching experience, curriculum development, and student outcomes. Professional development and certifications are valuable.",
      'marketing': " In marketing, focus on data-driven results, campaign performance, and staying current with digital marketing trends and tools."
    };
    
    return industryAdvice[industry] || "";
  }

  generateSuggestions(analysis, userProfile, conversationContext) {
    const suggestions = [];
    const { topics, mood } = analysis;
    
    if (topics.includes('resume')) {
      suggestions.push("Review resume formatting tips", "Add quantifiable achievements", "Optimize for ATS systems");
    }
    if (topics.includes('interview')) {
      suggestions.push("Practice common questions", "Research company culture", "Prepare STAR method responses");
    }
    if (topics.includes('skills')) {
      suggestions.push("Take online courses", "Work on personal projects", "Seek mentorship opportunities");
    }
    if (topics.includes('career')) {
      suggestions.push("Set SMART goals", "Build professional network", "Create career roadmap");
    }
    if (topics.includes('salary')) {
      suggestions.push("Research market rates", "Prepare negotiation script", "Highlight unique value");
    }
    
    // Add mood-based suggestions
    if (mood === 'concerned') {
      suggestions.push("Let's break this down step by step", "What specific challenges are you facing?");
    }
    
    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }

  generateFollowUpQuestions(analysis, userProfile, conversationStats) {
    const questions = [];
    const { topics } = analysis;
    
    if (topics.includes('resume')) {
      questions.push("What industry are you targeting?", "Do you have specific achievements to highlight?");
    }
    if (topics.includes('interview')) {
      questions.push("What type of role are you interviewing for?", "What's your biggest professional challenge?");
    }
    if (topics.includes('skills')) {
      questions.push("What skills are most in demand in your field?", "How do you prefer to learn new skills?");
    }
    if (topics.includes('career')) {
      questions.push("What's your 5-year career vision?", "What motivates you professionally?");
    }
    
    return questions.slice(0, 2); // Limit to 2 questions
  }

  calculateConfidence(analysis, userProfile) {
    let confidence = 0.7; // Base confidence
    
    // Increase confidence based on profile completeness
    if (userProfile.experience && userProfile.industry) {
      confidence += 0.1;
    }
    
    // Increase confidence based on topic specificity
    if (analysis.topics.length > 0) {
      confidence += 0.1;
    }
    
    // Decrease confidence for vague queries
    if (analysis.topics.length === 0) {
      confidence -= 0.1;
    }
    
    return Math.min(confidence, 0.95); // Cap at 95%
  }

  determineResponseType(analysis, userText) {
    if (userText.includes('thank')) return 'gratitude';
    if (analysis.topics.length > 0) return 'topic_specific';
    if (userText.includes('help')) return 'assistance';
    return 'general';
  }

  // Get conversation analytics
  getConversationAnalytics(messages) {
    const userMessages = messages.filter(m => m.sender === 'user');
    const topics = {};
    let totalWords = 0;
    
    userMessages.forEach(msg => {
      const words = msg.text.toLowerCase().split(' ');
      totalWords += words.length;
      
      words.forEach(word => {
        if (['resume', 'interview', 'skills', 'career', 'job', 'salary', 'network', 'leadership'].includes(word)) {
          topics[word] = (topics[word] || 0) + 1;
        }
      });
    });
    
    return {
      totalMessages: messages.length,
      userMessages: userMessages.length,
      averageWordsPerMessage: totalWords / userMessages.length || 0,
      topTopics: Object.entries(topics)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([topic, count]) => ({ topic, count })),
      conversationDuration: this.calculateConversationDuration(messages)
    };
  }

  calculateConversationDuration(messages) {
    if (messages.length < 2) return 0;
    
    const firstMessage = messages[0];
    const lastMessage = messages[messages.length - 1];
    
    return Math.floor((lastMessage.timestamp - firstMessage.timestamp) / 1000 / 60); // in minutes
  }

  // Get personalized recommendations
  getPersonalizedRecommendations(userProfile, conversationHistory) {
    const recommendations = [];
    
    if (userProfile.experience === 'entry') {
      recommendations.push({
        type: 'skill',
        title: 'Build Technical Foundation',
        description: 'Focus on core technical skills and get hands-on experience through projects',
        priority: 'high'
      });
    } else if (userProfile.experience === 'mid') {
      recommendations.push({
        type: 'leadership',
        title: 'Develop Leadership Skills',
        description: 'Take on mentoring roles and lead small projects to advance your career',
        priority: 'medium'
      });
    } else if (userProfile.experience === 'senior') {
      recommendations.push({
        type: 'strategy',
        title: 'Strategic Thinking',
        description: 'Focus on business impact and strategic initiatives to reach executive level',
        priority: 'high'
      });
    }
    
    return recommendations;
  }
}

// Create singleton instance
const chatService = new ChatService();

// Main function to send chat message
export const sendChatMessage = async (messageData) => {
  try {
    // First try to send to backend API
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        message: messageData.text,
        userProfile: messageData.userProfile,
        conversationContext: messageData.conversationContext,
        messageHistory: messageData.messageHistory,
        conversationStats: messageData.conversationStats
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        message: data.message,
        suggestions: data.suggestions || [],
        followUpQuestions: data.followUpQuestions || [],
        context: data.context || {},
        type: data.type || 'response',
        confidence: data.confidence || 0.9
      };
    } else {
      // If backend fails, fall back to mock response
      console.warn('Backend API failed, using mock response');
      return await getMockResponse(messageData);
    }
  } catch (error) {
    console.error('Error in chat service:', error);
    // Fall back to mock response if API call fails
    return await getMockResponse(messageData);
  }
};

// Fallback mock response function
const getMockResponse = async (messageData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const userText = messageData.text.toLowerCase().trim();
  
  // Handle personal/identity questions
  if (userText.includes('what is your name') || userText.includes('who are you')) {
    return {
      message: "Hello! I'm SkillBridge AI, your personal career assistant. I'm here to help you with career guidance, resume tips, interview preparation, and professional development. You can call me SkillBridge or just AI!",
      suggestions: ["What can you do?", "How can you help me?", "Tell me about resume tips"],
      type: 'identity',
      confidence: 0.95
    };
  }
  
  if (userText.includes('what can you do') || userText.includes('how do you work')) {
    return {
      message: "I can help you with: 1) Resume writing and optimization, 2) Career advice and planning, 3) Interview preparation tips, 4) Skills gap analysis, 5) Job search strategies, 6) Salary negotiation advice, 7) Networking tips, 8) Learning path recommendations, 9) Industry insights, and 10) Professional development guidance. What would you like to explore?",
      suggestions: ["Resume tips", "Career advice", "Interview preparation", "Skills development"],
      type: 'capabilities',
      confidence: 0.9
    };
  }
  
  // Handle resume questions
  if (userText.includes('what is resume') || userText.includes('what is cv')) {
    return {
      message: "A resume is a professional document that summarizes your work experience, education, skills, and achievements. It's your first impression to potential employers and should highlight your qualifications for a specific job. Think of it as your professional story on paper!",
      suggestions: ["How to improve my resume", "Resume format", "What to include in resume"],
      type: 'resume_education',
      confidence: 0.9
    };
  }
  
  if (userText.includes('how long should resume be')) {
    return {
      message: "Resume length depends on your experience: 1) Entry-level: 1 page maximum, 2) Mid-career: 1-2 pages, 3) Senior/Executive: 2-3 pages. Focus on relevance and impact rather than length. Every word should add value!",
      suggestions: ["Resume format", "What to include", "Resume tips"],
      type: 'resume_advice',
      confidence: 0.9
    };
  }
  
  if (userText.includes('what should i put on resume')) {
    return {
      message: "Your resume should include: 1) Contact information, 2) Professional summary, 3) Work experience (with achievements), 4) Education, 5) Skills (technical and soft), 6) Certifications, 7) Projects (if relevant), 8) Languages (if applicable). Focus on achievements, not just responsibilities!",
      suggestions: ["Resume format", "How to improve", "Resume tips"],
      type: 'resume_advice',
      confidence: 0.9
    };
  }
  
  if (userText.includes('resume format')) {
    return {
      message: "Popular resume formats: 1) Chronological (most common) - lists experience by date, 2) Functional - focuses on skills, 3) Combination - mixes both approaches. Choose based on your career situation and target role.",
      suggestions: ["What to include", "How to improve", "Resume tips"],
      type: 'resume_advice',
      confidence: 0.9
    };
  }
  
  // Handle greetings
  if (userText.includes('hello') || userText.includes('hi')) {
    return {
      message: "Hello! 👋 I'm SkillBridge AI, your career development assistant. How can I help you today? I can assist with resume tips, career advice, interview preparation, and much more!",
      suggestions: ["Resume tips", "Career advice", "Interview preparation", "Skills development"],
      type: 'greeting',
      confidence: 0.95
    };
  }
  
  if (userText.includes('thank you') || userText.includes('thanks')) {
    return {
      message: "You're very welcome! 😊 I'm glad I could help. Is there anything else you'd like to know about your career development?",
      suggestions: ["More career advice", "Resume help", "Interview tips"],
      type: 'gratitude',
      confidence: 0.9
    };
  }
  
  if (userText.includes('goodbye') || userText.includes('bye')) {
    return {
      message: "Goodbye! 👋 Good luck with your career journey. Remember, I'm here whenever you need career advice or guidance. Take care!",
      suggestions: [],
      type: 'farewell',
      confidence: 0.9
    };
  }
  
  // Handle educational questions
  if (userText.includes('what is machine learning')) {
    return {
      message: "Machine Learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed. It's used in recommendation systems, image recognition, natural language processing, and many other applications. It's a great skill to learn for tech careers!",
      suggestions: ["Data science career", "AI skills", "Tech career path"],
      type: 'education',
      confidence: 0.9
    };
  }
  
  if (userText.includes('what is artificial intelligence') || userText.includes('what is ai')) {
    return {
      message: "Artificial Intelligence (AI) is technology that enables computers to perform tasks that typically require human intelligence, such as learning, reasoning, problem-solving, and decision-making. It's transforming industries and creating new career opportunities.",
      suggestions: ["AI career", "Machine learning", "Tech skills"],
      type: 'education',
      confidence: 0.9
    };
  }
  
  if (userText.includes('what is data science')) {
    return {
      message: "Data Science combines statistics, programming, and domain expertise to extract insights from data. It involves collecting, cleaning, analyzing, and interpreting data to help organizations make better decisions. It's one of the fastest-growing career fields!",
      suggestions: ["Data science career", "Skills needed", "Learning path"],
      type: 'education',
      confidence: 0.9
    };
  }
  
  if (userText.includes('what is cloud computing')) {
    return {
      message: "Cloud computing provides computing services over the internet, including servers, storage, databases, networking, and software. Major providers include AWS, Azure, and Google Cloud. Cloud skills are highly in demand across industries.",
      suggestions: ["Cloud career", "AWS certification", "Tech skills"],
      type: 'education',
      confidence: 0.9
    };
  }
  
  // Handle help requests
  if (userText.includes('help')) {
    return {
      message: "I'm here to help! I can assist with: resume writing, career advice, interview prep, job search strategies, skills development, networking, and more. Just ask me anything career-related!",
      suggestions: ["Resume tips", "Career advice", "Interview preparation", "Job search"],
      type: 'assistance',
      confidence: 0.9
    };
  }
  
  // Handle specific career questions
  if (userText.includes('career change') || userText.includes('switch careers')) {
    return {
      message: "Career change strategies: 1) Assess your transferable skills, 2) Research your target industry, 3) Network with professionals in the field, 4) Gain relevant experience through projects or volunteering, 5) Consider additional education or certifications, 6) Start with entry-level positions if needed, 7) Be patient with the transition process.",
      suggestions: ["Skills assessment", "Networking tips", "Learning paths"],
      type: 'career_advice',
      confidence: 0.9
    };
  }
  
  if (userText.includes('interview preparation') || userText.includes('prepare for interview')) {
    return {
      message: "Interview prep checklist: 1) Research the company thoroughly, 2) Practice common questions, 3) Prepare STAR method responses, 4) Dress appropriately, 5) Prepare thoughtful questions, 6) Practice with mock interviews, 7) Plan your route and arrive early, 8) Bring copies of your resume.",
      suggestions: ["Common questions", "STAR method", "Company research"],
      type: 'interview_advice',
      confidence: 0.9
    };
  }
  
  if (userText.includes('salary negotiation')) {
    return {
      message: "Salary negotiation tips: 1) Research market rates for your role/location, 2) Know your worth and minimum acceptable salary, 3) Don't disclose your current salary first, 4) Focus on value you bring, 5) Consider total compensation package, 6) Practice your pitch, 7) Be prepared to walk away if needed.",
      suggestions: ["Market research", "Value proposition", "Compensation package"],
      type: 'salary_advice',
      confidence: 0.9
    };
  }
  
  // Generate response using the enhanced service for other questions
  const response = chatService.generateResponse(
    messageData.text,
    messageData.userProfile,
    messageData.conversationContext,
    messageData.messageHistory,
    messageData.conversationStats
  );
  
  return response;
};

// Export additional utility functions
export const getConversationAnalytics = (messages) => {
  return chatService.getConversationAnalytics(messages);
};

export const getPersonalizedRecommendations = (userProfile, conversationHistory) => {
  return chatService.getPersonalizedRecommendations(userProfile, conversationHistory);
};

export default chatService;

// Function to get chat history (for future implementation)
export const getChatHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/history`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};

// Function to clear chat history (for future implementation)
export const clearChatHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/clear`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to clear chat history');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
};

// Function to update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
