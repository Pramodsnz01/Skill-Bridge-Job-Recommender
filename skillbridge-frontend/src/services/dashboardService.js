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
    return {
        data: {
            overview: {
                totalAnalyses: 5,
                period,
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                endDate: new Date()
            },
            analysesByWeek: [
                { week: '2024-W22', count: 1 },
                { week: '2024-W23', count: 2 },
                { week: '2024-W24', count: 1 },
                { week: '2024-W25', count: 1 }
            ],
            skillsDistribution: [
                { category: 'Programming', count: 4 },
                { category: 'Communication', count: 2 },
                { category: 'Leadership', count: 1 }
            ],
            skillGaps: [
                { skill: 'React', domain: 'Web', priority: 'High', frequency: 2, marketDemand: 8.5 },
                { skill: 'Node.js', domain: 'Backend', priority: 'Medium', frequency: 1, marketDemand: 7.2 }
            ],
            careerDomains: [
                { domain: 'Software', count: 3 },
                { domain: 'Management', count: 2 }
            ],
            experienceTrends: [
                { year: 2022, avg: 1 },
                { year: 2023, avg: 2 },
                { year: 2024, avg: 2.5 }
            ]
        }
    };
};

// 2. Recent Analyses
export const getRecentAnalyses = async (limit = 5) => {
    return {
        data: [
            {
                _id: '1',
                analysis: {
                    _id: '1',
                    resume: { originalName: 'Resume_JohnDoe.pdf' },
                    status: 'completed'
                },
                analysisDate: new Date().toISOString(),
                analysisMetrics: { totalSkillsFound: 5, totalGapsIdentified: 2 }
            },
            {
                _id: '2',
                analysis: {
                    _id: '2',
                    resume: { originalName: 'Resume_JaneSmith.pdf' },
                    status: 'completed'
                },
                analysisDate: new Date(Date.now() - 86400000).toISOString(),
                analysisMetrics: { totalSkillsFound: 3, totalGapsIdentified: 1 }
            }
        ]
    };
};

// 3. User Stats
export const getUserStats = async () => {
    return {
        data: {
            averageExperience: 2,
            profileCompletion: 80
        }
    };
};

// 4. Skills Summary
export const getSkillsSummary = async () => {
    return {
        data: {
            totalSkills: 7,
            topSkills: ['JavaScript', 'React', 'Node.js']
        }
    };
};

// 5. Career Domains Summary
export const getCareerDomainsSummary = async () => {
    return {
        data: {
            totalDomains: 2,
            domains: ['Software', 'Management']
        }
    };
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