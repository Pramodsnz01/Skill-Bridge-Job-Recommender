const { HfInference } = require('@huggingface/inference');

// Only English supported now
const TRANSLATION_MODELS = {
  'en': null // No translation needed for English
};

const translateController = {
  // Translate text to specified language
  translateText: async (req, res) => {
    try {
      const { text, targetLanguage } = req.body;

      // Validate input
      if (!text || !targetLanguage) {
        return res.status(400).json({
          success: false,
          message: 'Text and target language are required'
        });
      }

      // Only English supported
      if (targetLanguage !== 'en') {
        return res.status(400).json({
          success: false,
          message: 'Only English is supported.'
        });
      }

      // Return original text for English
      return res.json({
        success: true,
        translatedText: text,
        originalText: text,
        targetLanguage
      });
    } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({
        success: false,
        message: 'Translation failed',
        error: error.message
      });
    }
  },

  // Translate analysis results
  translateAnalysis: async (req, res) => {
    try {
      const { analysis, targetLanguage } = req.body;

      // Validate input
      if (!analysis || !targetLanguage) {
        return res.status(400).json({
          success: false,
          message: 'Analysis data and target language are required'
        });
      }

      // Only English supported
      if (targetLanguage !== 'en') {
        return res.status(400).json({
          success: false,
          message: 'Only English is supported.'
        });
      }

      return res.json({
        success: true,
        translatedAnalysis: analysis,
        originalAnalysis: analysis,
        targetLanguage
      });
    } catch (error) {
      console.error('Analysis translation error:', error);
      res.status(500).json({
        success: false,
        message: 'Analysis translation failed',
        error: error.message
      });
    }
  },

  // Get supported languages
  getSupportedLanguages: async (req, res) => {
    try {
      const languages = [
        { code: 'en', name: 'English', nativeName: 'English' }
      ];

      res.json({
        success: true,
        languages
      });

    } catch (error) {
      console.error('Get languages error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get supported languages',
        error: error.message
      });
    }
  }
};

module.exports = translateController; 