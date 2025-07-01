import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Create axios instance with auth token
const createAuthInstance = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
};

const translateService = {
  // Get supported languages
  getSupportedLanguages: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/translate/languages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      throw error;
    }
  },

  // Translate text
  translateText: async (text, targetLanguage) => {
    try {
      const authInstance = createAuthInstance();
      const response = await authInstance.post('/translate/text', {
        text,
        targetLanguage
      });
      return response.data;
    } catch (error) {
      console.error('Error translating text:', error);
      throw error;
    }
  },

  // Translate analysis results
  translateAnalysis: async (analysis, targetLanguage) => {
    try {
      const authInstance = createAuthInstance();
      const response = await authInstance.post('/translate/analysis', {
        analysis,
        targetLanguage
      });
      return response.data;
    } catch (error) {
      console.error('Error translating analysis:', error);
      throw error;
    }
  }
};

export default translateService; 