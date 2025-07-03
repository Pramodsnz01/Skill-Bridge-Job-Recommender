import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Create axios instance with auth header
const createAuthInstance = () => {
    const token = getAuthToken();
    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// MOCK DATA FOR DEMO PURPOSES

// 1. Dashboard Analytics
export const getDashboardAnalytics = async (period = '30d') => {
    try {
        const authInstance = createAuthInstance();
        const response = await authInstance.get(`/dashboard/analytics?period=${period}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        throw error;
    }
};

// 2. Recent Analyses
export const getRecentAnalyses = async (limit = 5) => {
    try {
        const authInstance = createAuthInstance();
        const response = await authInstance.get(`/dashboard/recent-analyses?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recent analyses:', error);
        throw error;
    }
};

// 3. User Stats
export const getUserStats = async () => {
    try {
        const authInstance = createAuthInstance();
        const response = await authInstance.get('/dashboard/user-stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
};

// 4. Skills Summary
export const getSkillsSummary = async () => {
    try {
        const authInstance = createAuthInstance();
        const response = await authInstance.get('/dashboard/skills-summary');
        return response.data;
    } catch (error) {
        console.error('Error fetching skills summary:', error);
        throw error;
    }
};

// 5. Career Domains Summary
export const getCareerDomainsSummary = async () => {
    try {
        const authInstance = createAuthInstance();
        const response = await authInstance.get('/dashboard/career-domains-summary');
        return response.data;
    } catch (error) {
        console.error('Error fetching career domains summary:', error);
        throw error;
    }
};

// Get analysis history
export const getAnalysisHistory = async (page = 1, limit = 10) => {
    try {
        const authInstance = createAuthInstance();
        const response = await authInstance.get(`/dashboard/analysis-history?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching analysis history:', error);
        throw error;
    }
};

// Update learning progress
export const updateLearningProgress = async (analysisId, progressData) => {
    try {
        const authInstance = createAuthInstance();
        const response = await authInstance.put(`/dashboard/learning-progress/${analysisId}`, progressData);
        return response.data;
    } catch (error) {
        console.error('Error updating learning progress:', error);
        throw error;
    }
};

// Get skill gaps summary
export const getSkillGapsSummary = async (period = '30d') => {
    try {
        const authInstance = createAuthInstance();
        const response = await authInstance.get(`/dashboard/skill-gaps?period=${period}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching skill gaps summary:', error);
        throw error;
    }
};

// Delete analysis from history
export const deleteAnalysis = async (analysisId) => {
    try {
        const authInstance = createAuthInstance();
        const response = await authInstance.delete(`/dashboard/analysis/${analysisId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting analysis:', error);
        throw error;
    }
};

// Export analysis as PDF
export const exportAnalysisPDF = async (analysisId) => {
    try {
        const authInstance = createAuthInstance();
        const response = await authInstance.get(`/dashboard/export-analysis/${analysisId}`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Error exporting analysis PDF:', error);
        throw error;
    }
}; 