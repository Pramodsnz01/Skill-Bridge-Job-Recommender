import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const resumeService = {
  // Upload resume
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post('/resume/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get user's resumes
  getUserResumes: async () => {
    const response = await api.get('/resume/resumes');
    return response.data;
  },

  // Delete resume
  deleteResume: async (resumeId) => {
    const response = await api.delete(`/resume/resumes/${resumeId}`);
    return response.data;
  },
}; 