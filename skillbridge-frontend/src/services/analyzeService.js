import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000, // 60 seconds for analysis requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error(`❌ API Error: ${error.response?.status || 'Network'} ${error.config?.url}`);
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

/**
 * Analyze a resume by ID
 * @param {string} resumeId - The ID of the resume to analyze
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeResume = async (resumeId) => {
    console.log(`🚀 Starting analysis for resume: ${resumeId}`);
    
    try {
        const response = await apiClient.post(`/analyze/${resumeId}`);
        console.log('✅ Analysis request successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Analysis failed:', error);
        
        // Log detailed error information
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        
        throw new Error(
            error.response?.data?.message || 
            error.response?.data?.error || 
            'Analysis failed. Please try again.'
        );
    }
};

/**
 * Get analysis results for a resume
 * @param {string} resumeId - The ID of the resume
 * @returns {Promise<Object>} Analysis results
 */
export const getAnalysis = async (resumeId) => {
    console.log(`🔍 Getting analysis results for resume: ${resumeId}`);
    
    try {
        const response = await apiClient.get(`/analyze/resume/${resumeId}`);
        console.log('✅ Analysis results retrieved:', response.data);
        
        // Return the data directly if it's already in the correct format
        if (response.data.success && response.data.data) {
            return response.data.data;
        }
        
        // Otherwise return the entire response
        return response.data;
    } catch (error) {
        console.error('❌ Failed to get analysis:', error);
        
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        
        throw new Error(
            error.response?.data?.message || 
            error.response?.data?.error || 
            'Failed to retrieve analysis results.'
        );
    }
};

/**
 * Check if analysis is in progress
 * @param {string} resumeId - The ID of the resume
 * @returns {Promise<boolean>} True if analysis is in progress
 */
export const checkAnalysisStatus = async (resumeId) => {
    console.log(`🔍 Checking analysis status for resume: ${resumeId}`);
    
    try {
        const response = await apiClient.get(`/analyze/${resumeId}`);
        const isProcessing = response.data.data?.status === 'processing';
        console.log(`📊 Analysis status: ${response.data.data?.status || 'unknown'}`);
        return isProcessing;
    } catch (error) {
        // If analysis doesn't exist, it's not in progress
        if (error.response?.status === 404) {
            console.log('📊 Analysis not found (not in progress)');
            return false;
        }
        console.error('❌ Error checking analysis status:', error);
        throw error;
    }
};

/**
 * Poll for analysis completion
 * @param {string} resumeId - The ID of the resume
 * @param {number} interval - Polling interval in milliseconds (default: 2000)
 * @param {number} maxAttempts - Maximum polling attempts (default: 30)
 * @returns {Promise<Object>} Analysis results when completed
 */
export const pollAnalysisCompletion = async (resumeId, interval = 2000, maxAttempts = 30) => {
    console.log(`🔄 Starting polling for analysis completion: ${resumeId}`);
    console.log(`⏱️ Polling interval: ${interval}ms, max attempts: ${maxAttempts}`);
    
    return new Promise((resolve, reject) => {
        let attempts = 0;
        
        const poll = async () => {
            try {
                attempts++;
                console.log(`🔄 Polling attempt ${attempts}/${maxAttempts}`);
                
                const response = await getAnalysis(resumeId);
                console.log('📊 Raw response from getAnalysis:', response);
                
                // Handle different response structures
                let analysis;
                if (response.data) {
                    analysis = response.data;
                } else if (response.status) {
                    analysis = response;
                } else {
                    analysis = response;
                }
                
                console.log(`📊 Analysis status: ${analysis.status}`);
                
                if (analysis.status === 'completed') {
                    console.log('✅ Analysis completed successfully!');
                    resolve({ data: analysis });
                } else if (analysis.status === 'failed') {
                    console.error('❌ Analysis failed:', analysis.errorMessage);
                    reject(new Error(analysis.errorMessage || 'Analysis failed'));
                } else if (attempts >= maxAttempts) {
                    console.error('⏰ Analysis timeout after maximum attempts');
                    reject(new Error('Analysis timeout. Please try again.'));
                } else {
                    console.log(`⏳ Analysis still processing, retrying in ${interval}ms...`);
                    // Continue polling
                    setTimeout(poll, interval);
                }
            } catch (error) {
                if (attempts >= maxAttempts) {
                    console.error('❌ Polling failed after maximum attempts:', error);
                    reject(error);
                } else {
                    console.warn(`⚠️ Polling attempt ${attempts} failed, retrying in ${interval}ms:`, error.message);
                    // Continue polling even if there's an error
                    setTimeout(poll, interval);
                }
            }
        };
        
        poll();
    });
};

/**
 * Analyze resume with progress tracking
 * @param {string} resumeId - The ID of the resume to analyze
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeResumeWithProgress = async (resumeId, onProgress) => {
    console.log(`🚀 Starting analysis with progress tracking: ${resumeId}`);
    
    try {
        // Start analysis
        console.log('📤 Sending analysis request...');
        const startResponse = await analyzeResume(resumeId);
        console.log('📊 Start response:', startResponse);
        
        if (startResponse.cached) {
            // Analysis was cached, return immediately
            console.log('✅ Analysis retrieved from cache');
            onProgress?.('completed', startResponse.data);
            return startResponse;
        }
        
        // Analysis started, poll for completion
        console.log('🔄 Analysis started, beginning polling...');
        onProgress?.('processing', null);
        
        const finalResponse = await pollAnalysisCompletion(resumeId);
        console.log('📊 Final response from polling:', finalResponse);
        
        console.log('✅ Analysis completed with progress tracking');
        onProgress?.('completed', finalResponse.data);
        return finalResponse.data;
        
    } catch (error) {
        console.error('❌ Analysis with progress failed:', error);
        onProgress?.('failed', null, error.message);
        throw error;
    }
};

export default {
    analyzeResume,
    getAnalysis,
    checkAnalysisStatus,
    pollAnalysisCompletion,
    analyzeResumeWithProgress
}; 