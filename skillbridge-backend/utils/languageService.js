// Multi-language support service
const supportedLanguages = {
  en: {
    name: 'English',
    code: 'en',
    flag: '🇺🇸'
  },
  ne: {
    name: 'नेपाली',
    code: 'ne',
    flag: '🇳🇵'
  },
  hi: {
    name: 'हिंदी',
    code: 'hi',
    flag: '🇮🇳'
  },
  es: {
    name: 'Español',
    code: 'es',
    flag: '🇪🇸'
  },
  fr: {
    name: 'Français',
    code: 'fr',
    flag: '🇫🇷'
  }
};

// Translation cache for performance
const translationCache = new Map();

// Common phrases translations
const translations = {
  // Greetings
  greetings: {
    en: "Hello! I'm SkillBridge AI, your career development assistant. How can I help you today?",
    ne: "नमस्ते! म SkillBridge AI हुँ, तपाईंको करियर विकास सहायक। म आज तपाईंलाई कसरी मद्दत गर्न सक्छु?",
    hi: "नमस्ते! मैं SkillBridge AI हूं, आपका करियर विकास सहायक। मैं आज आपकी कैसे मदद कर सकता हूं?",
    es: "¡Hola! Soy SkillBridge AI, tu asistente de desarrollo profesional. ¿Cómo puedo ayudarte hoy?",
    fr: "Bonjour! Je suis SkillBridge AI, votre assistant de développement de carrière. Comment puis-je vous aider aujourd'hui?"
  },
  
  // Identity
  identity: {
    en: "Hello! I'm SkillBridge AI, your personal career assistant. I'm here to help you with career guidance, resume tips, interview preparation, and professional development.",
    ne: "नमस्ते! म SkillBridge AI हुँ, तपाईंको व्यक्तिगत करियर सहायक। म तपाईंलाई करियर मार्गदर्शन, रिज्युमे सुझाव, साक्षात्कार तयारी र व्यावसायिक विकासमा मद्दत गर्न यहाँ छु।",
    hi: "नमस्ते! मैं SkillBridge AI हूं, आपका व्यक्तिगत करियर सहायक। मैं आपको करियर मार्गदर्शन, रिज्यूमे टिप्स, इंटरव्यू तैयारी और व्यावसायिक विकास में मदद करने के लिए यहां हूं।",
    es: "¡Hola! Soy SkillBridge AI, tu asistente de carrera personal. Estoy aquí para ayudarte con orientación profesional, consejos de currículum, preparación de entrevistas y desarrollo profesional.",
    fr: "Bonjour! Je suis SkillBridge AI, votre assistant de carrière personnel. Je suis ici pour vous aider avec l'orientation de carrière, les conseils de CV, la préparation aux entretiens et le développement professionnel."
  },
  
  // Resume
  resume: {
    en: "A resume is a professional document that summarizes your work experience, education, skills, and achievements. It's your first impression to potential employers.",
    ne: "रिज्युमे भनेको व्यावसायिक कागजात हो जसले तपाईंको कामको अनुभव, शिक्षा, सीप र उपलब्धिहरू संक्षेपमा प्रस्तुत गर्दछ। यो सम्भावित नियोक्ताहरूलाई तपाईंको पहिलो छाप हो।",
    hi: "रिज्यूमे एक व्यावसायिक दस्तावेज है जो आपके कार्य अनुभव, शिक्षा, कौशल और उपलब्धियों का सारांश प्रस्तुत करता है। यह संभावित नियोक्ताओं के लिए आपका पहला प्रभाव है।",
    es: "Un currículum es un documento profesional que resume tu experiencia laboral, educación, habilidades y logros. Es tu primera impresión para posibles empleadores.",
    fr: "Un CV est un document professionnel qui résume votre expérience de travail, votre éducation, vos compétences et vos réalisations. C'est votre première impression auprès des employeurs potentiels."
  },
  
  // Help
  help: {
    en: "I'm here to help! I can assist with: resume writing, career advice, interview prep, job search strategies, skills development, networking, and more.",
    ne: "म मद्दत गर्न यहाँ छु! म सहयोग गर्न सक्छु: रिज्युमे लेखन, करियर सल्लाह, साक्षात्कार तयारी, नोकरी खोज रणनीतिहरू, सीप विकास, नेटवर्किङ र थप।",
    hi: "मैं मदद करने के लिए यहां हूं! मैं सहायता कर सकता हूं: रिज्यूमे लेखन, करियर सलाह, इंटरव्यू तैयारी, नौकरी खोज रणनीतियां, कौशल विकास, नेटवर्किंग और अधिक।",
    es: "¡Estoy aquí para ayudar! Puedo ayudarte con: escritura de currículum, consejos de carrera, preparación de entrevistas, estrategias de búsqueda de empleo, desarrollo de habilidades, networking y más.",
    fr: "Je suis là pour vous aider! Je peux vous aider avec: la rédaction de CV, les conseils de carrière, la préparation aux entretiens, les stratégies de recherche d'emploi, le développement des compétences, le réseautage et plus encore."
  },
  
  // Thank you
  thanks: {
    en: "You're very welcome! I'm glad I could help. Is there anything else you'd like to know about your career development?",
    ne: "तपाईंलाई स्वागत छ! म खुसी छु कि म मद्दत गर्न सकें। तपाईंको करियर विकासको बारेमा अरू केही जान्न चाहनुहुन्छ?",
    hi: "आपका स्वागत है! मुझे खुशी है कि मैं मदद कर सका। क्या आप अपने करियर विकास के बारे में कुछ और जानना चाहते हैं?",
    es: "¡De nada! Me alegra haber podido ayudar. ¿Hay algo más que te gustaría saber sobre tu desarrollo profesional?",
    fr: "Je vous en prie! Je suis ravi d'avoir pu vous aider. Y a-t-il autre chose que vous aimeriez savoir sur votre développement de carrière?"
  }
};

class LanguageService {
  constructor() {
    this.supportedLanguages = supportedLanguages;
    this.translations = translations;
    this.cache = translationCache;
  }

  // Detect language from text
  detectLanguage(text) {
    const nepaliPattern = /[\u0900-\u097F]/;
    const hindiPattern = /[\u0900-\u097F]/;
    const spanishPattern = /[áéíóúñü]/i;
    const frenchPattern = /[àâäéèêëïîôöùûüÿç]/i;

    if (nepaliPattern.test(text)) return 'ne';
    if (hindiPattern.test(text)) return 'hi';
    if (spanishPattern.test(text)) return 'es';
    if (frenchPattern.test(text)) return 'fr';
    
    return 'en'; // Default to English
  }

  // Translate text to target language
  translateText(text, targetLanguage, sourceLanguage = 'en') {
    if (targetLanguage === sourceLanguage) return text;

    const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // For now, return common phrases or original text
    // In production, integrate with Google Translate API or similar
    const translatedText = this.getCommonTranslation(text, targetLanguage) || text;
    
    this.cache.set(cacheKey, translatedText);
    return translatedText;
  }

  // Get common translation for known phrases
  getCommonTranslation(text, targetLanguage) {
    const lowerText = text.toLowerCase();
    
    // Check greetings
    if (lowerText.includes('hello') || lowerText.includes('hi')) {
      return this.translations.greetings[targetLanguage] || this.translations.greetings.en;
    }
    
    // Check identity questions
    if (lowerText.includes('what is your name') || lowerText.includes('who are you')) {
      return this.translations.identity[targetLanguage] || this.translations.identity.en;
    }
    
    // Check resume questions
    if (lowerText.includes('what is resume') || lowerText.includes('what is cv')) {
      return this.translations.resume[targetLanguage] || this.translations.resume.en;
    }
    
    // Check help requests
    if (lowerText.includes('help')) {
      return this.translations.help[targetLanguage] || this.translations.help.en;
    }
    
    // Check thank you
    if (lowerText.includes('thank you') || lowerText.includes('thanks')) {
      return this.translations.thanks[targetLanguage] || this.translations.thanks.en;
    }
    
    return null;
  }

  // Get supported languages
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  // Check if language is supported
  isLanguageSupported(languageCode) {
    return Object.keys(this.supportedLanguages).includes(languageCode);
  }

  // Get language info
  getLanguageInfo(languageCode) {
    return this.supportedLanguages[languageCode] || this.supportedLanguages.en;
  }

  // Clear cache for performance
  clearCache() {
    this.cache.clear();
  }

  // Get cache size for monitoring
  getCacheSize() {
    return this.cache.size;
  }

  // Format response with language support
  formatResponse(response, userLanguage = 'en') {
    if (userLanguage === 'en') {
      return response;
    }

    return {
      ...response,
      message: this.translateText(response.message, userLanguage),
      suggestions: response.suggestions?.map(suggestion => 
        this.translateText(suggestion, userLanguage)
      ) || [],
      originalMessage: response.message, // Keep original for reference
      translated: true
    };
  }
}

// Create singleton instance
const languageService = new LanguageService();

module.exports = languageService; 