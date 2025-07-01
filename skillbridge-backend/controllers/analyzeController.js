const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const AnalysisHistory = require('../models/AnalysisHistory');
const { extractTextFromFile } = require('../utils/textExtractor');
const axios = require('axios');
const fs = require('fs');

// Configuration
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5001';
const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Test Python API connectivity
 * @returns {Promise<boolean>} - True if API is reachable
 */
const testPythonAPI = async () => {
    try {
        console.log(`🔍 Testing Python API connectivity to: ${PYTHON_API_URL}/health`);
        const response = await axios.get(`${PYTHON_API_URL}/health`, {
            timeout: 5000
        });
        console.log('✅ Python API health check successful:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Python API health check failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('💡 Make sure the Python Flask server is running on port 5001');
        }
        return false;
    }
};

/**
 * Analyze a resume by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const analyzeResume = async (req, res) => {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`🚀 [${requestId}] Starting resume analysis...`);
    console.log(`📋 [${requestId}] Request details:`, {
        resumeId: req.params.id,
        userId: req.user._id,
        userEmail: req.user.email,
        timestamp: new Date().toISOString()
    });
    
    try {
        const { id } = req.params;
        console.log(`🔍 [${requestId}] Looking for resume with ID: ${id}`);
        
        // Find the resume and verify ownership
        const resume = await Resume.findOne({ 
            _id: id, 
            user: req.user._id 
        });

        if (!resume) {
            console.error(`❌ [${requestId}] Resume not found: ${id}`);
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
                errors: ['Resume not found']
            });
        }

        console.log(`✅ [${requestId}] Found resume:`, {
            filename: resume.originalName,
            filePath: resume.filePath,
            fileSize: resume.fileSize,
            mimeType: resume.mimeType,
            status: resume.status
        });

        // Check if file exists
        if (!fs.existsSync(resume.filePath)) {
            console.error(`❌ [${requestId}] Resume file not found on server: ${resume.filePath}`);
            return res.status(404).json({
                success: false,
                message: 'Resume file not found on server'
            });
        }

        console.log(`✅ [${requestId}] File exists on server`);

        // Check if analysis already exists and is recent (within 24 hours)
        const existingAnalysis = await Analysis.findOne({
            resume: resume._id,
            status: 'completed',
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }).sort({ createdAt: -1 });

        if (existingAnalysis) {
            console.log(`✅ [${requestId}] Returning cached analysis for resume: ${id}`);
            return res.json({
                success: true,
                message: 'Analysis retrieved from cache',
                data: existingAnalysis,
                cached: true
            });
        }

        // Test Python API connectivity before proceeding
        console.log(`🔍 [${requestId}] Testing Python API connectivity...`);
        const apiAvailable = await testPythonAPI();
        if (!apiAvailable) {
            console.error(`❌ [${requestId}] Python API not available`);
            return res.status(503).json({
                success: false,
                message: 'Analysis service is currently unavailable. Please try again later.',
                error: 'Python API not reachable'
            });
        }

        // Create or update analysis record
        let analysis = await Analysis.findOne({ resume: resume._id });
        if (!analysis) {
            console.log(`📝 [${requestId}] Creating new analysis record`);
            analysis = new Analysis({
                resume: resume._id,
                user: req.user._id,
                status: 'processing'
            });
        } else {
            console.log(`📝 [${requestId}] Updating existing analysis record`);
            analysis.status = 'processing';
            analysis.errorMessage = null;
        }
        await analysis.save();

        // Update resume status
        resume.status = 'analyzing';
        await resume.save();

        // Extract text from resume file
        let resumeText;
        try {
            console.log(`📄 [${requestId}] Extracting text from file: ${resume.filePath}`);
            console.log(`📄 [${requestId}] File type: ${resume.mimeType}`);
            
            resumeText = await extractTextFromFile(resume.filePath, resume.mimeType);
            
            // Additional validation after extraction
            if (!resumeText || resumeText.trim().length < 50) {
                throw new Error('Insufficient text content extracted from resume. Please ensure the document contains readable text.');
            }
            
            console.log(`✅ [${requestId}] Text extraction successful:`, {
                textLength: resumeText.length,
                first100Chars: resumeText.substring(0, 100) + '...',
                validationPassed: true
            });
        } catch (extractError) {
            console.error(`❌ [${requestId}] Text extraction failed:`, extractError);
            
            // Provide user-friendly error messages
            let userMessage = 'Failed to extract text from resume.';
            let technicalError = extractError.message;
            
            if (extractError.message.includes('corrupted') || extractError.message.includes('bad XRef')) {
                userMessage = 'The PDF file appears to be corrupted or has an invalid structure. Please try uploading a different PDF file.';
            } else if (extractError.message.includes('password protected')) {
                userMessage = 'The PDF file is password protected. Please remove the password and try again.';
            } else if (extractError.message.includes('scanned document') || extractError.message.includes('image')) {
                userMessage = 'The file appears to be a scanned document or image. Please upload a text-based PDF or convert scanned documents to text.';
            } else if (extractError.message.includes('not appear to be a resume')) {
                userMessage = 'The uploaded file does not appear to be a resume. Please upload a valid resume document.';
            } else if (extractError.message.includes('too large')) {
                userMessage = 'The file is too large. Please upload a file smaller than 10MB.';
            } else if (extractError.message.includes('Unsupported file type')) {
                userMessage = 'Unsupported file format. Please upload a PDF, DOCX, or TXT file.';
            } else if (extractError.message.includes('Insufficient text content')) {
                userMessage = 'The document contains too little text to analyze. Please ensure it is a text-based resume.';
            } else if (extractError.message.includes('No text content provided')) {
                userMessage = 'No text content was extracted from the file. Please upload a valid, text-based resume.';
            } else {
                userMessage = 'Resume analysis failed. Please check your file and try again.';
            }
            
            analysis.status = 'failed';
            analysis.errorMessage = userMessage;
            analysis.processingTime = Date.now() - startTime;
            await analysis.save();
            
            resume.status = 'failed';
            await resume.save();
            
            return res.status(400).json({
                success: false,
                message: userMessage,
                error: technicalError,
                suggestions: [
                    'Ensure the file is not corrupted',
                    'Convert scanned documents to text-based PDFs',
                    'Remove any password protection',
                    'Use standard resume formats (PDF, DOCX, TXT)',
                    'Ensure the document contains sufficient text content'
                ]
            });
        }

        // Send to Python API for analysis
        let analysisResult;
        try {
            console.log(`🚀 [${requestId}] Sending text to Python API: ${PYTHON_API_URL}/analyze-resume`);
            console.log(`📊 [${requestId}] Request payload:`, {
                textLength: resumeText.length,
                timeout: REQUEST_TIMEOUT
            });
            
            const response = await axios.post(`${PYTHON_API_URL}/analyze-resume`, {
                text: resumeText
            }, {
                timeout: REQUEST_TIMEOUT,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            analysisResult = response.data;
            console.log(`✅ [${requestId}] Python API response received:`, {
                skills: analysisResult.extracted_skills?.length || 0,
                domains: analysisResult.predicted_career_domains?.length || 0,
                gaps: analysisResult.learning_gaps?.length || 0,
                experience: analysisResult.experience_years?.total_years || 0
            });
        } catch (apiError) {
            console.error(`❌ [${requestId}] Python API error:`, {
                code: apiError.code,
                message: apiError.message,
                response: apiError.response?.data,
                status: apiError.response?.status
            });
            
            let errorMessage = 'Analysis service unavailable';
            if (apiError.code === 'ECONNABORTED') {
                errorMessage = 'Analysis request timed out';
            } else if (apiError.response) {
                errorMessage = `Analysis failed: ${apiError.response.data?.error || apiError.response.statusText}`;
            } else if (apiError.request) {
                errorMessage = 'Analysis service not responding';
            }

            analysis.status = 'failed';
            analysis.errorMessage = errorMessage;
            analysis.processingTime = Date.now() - startTime;
            await analysis.save();
            
            resume.status = 'failed';
            await resume.save();
            
            return res.status(503).json({
                success: false,
                message: errorMessage,
                error: apiError.message
            });
        }

        // Save analysis results to database
        console.log(`💾 [${requestId}] Saving analysis results to database`);
        analysis.extractedSkills = analysisResult.extracted_skills || [];
        analysis.experienceYears = {
            totalYears: analysisResult.experience_years?.total_years || 0,
            mentions: analysisResult.experience_years?.mentions || []
        };
        analysis.keywords = analysisResult.keywords || [];
        analysis.predictedCareerDomains = analysisResult.predicted_career_domains || [];
        analysis.learningGaps = analysisResult.learning_gaps || [];
        analysis.analysisSummary = {
            totalSkillsFound: analysisResult.analysis_summary?.total_skills_found || analysis.extractedSkills.length,
            yearsExperience: analysisResult.analysis_summary?.years_experience || analysis.experienceYears.totalYears,
            topDomain: analysisResult.analysis_summary?.top_domain || (analysis.predictedCareerDomains[0] || 'Unknown'),
            gapsIdentified: analysisResult.analysis_summary?.gaps_identified || analysis.learningGaps.length
        };
        analysis.status = 'completed';
        analysis.processingTime = Date.now() - startTime;
        await analysis.save();

        // Save to analysis history
        try {
            console.log(`📚 [${requestId}] Saving analysis history`);
            const analysisHistory = new AnalysisHistory({
                user: req.user._id,
                resume: resume._id,
                analysis: analysis._id,
                analysisMetrics: {
                    totalSkillsFound: analysis.analysisSummary.totalSkillsFound,
                    totalGapsIdentified: analysis.analysisSummary.gapsIdentified,
                    processingTime: analysis.processingTime,
                    confidenceScore: 0.8
                }
            });
            
            await analysisHistory.save();
            console.log(`✅ [${requestId}] Analysis history saved`);
        } catch (historyError) {
            console.error(`⚠️ [${requestId}] Failed to save analysis history:`, historyError);
            // Don't fail the main analysis if history saving fails
        }

        // Update resume status
        resume.status = 'completed';
        await resume.save();

        const totalTime = Date.now() - startTime;
        console.log(`🎉 [${requestId}] Analysis completed successfully!`, {
            resumeId: id,
            processingTime: totalTime,
            skillsFound: analysis.extractedSkills.length,
            domains: analysis.predictedCareerDomains.length,
            gaps: analysis.learningGaps.length
        });

        // Return success response
        res.json({
            success: true,
            message: 'Resume analysis completed successfully',
            data: analysis,
            processingTime: analysis.processingTime
        });

    } catch (error) {
        console.error(`❌ [${requestId}] Analyze resume error:`, error);
        
        // Try to update analysis record if it exists
        try {
            if (req.params.id) {
                const analysis = await Analysis.findOne({ 
                    resume: req.params.id,
                    user: req.user._id 
                });
                if (analysis) {
                    analysis.status = 'failed';
                    analysis.errorMessage = error.message;
                    analysis.processingTime = Date.now() - startTime;
                    await analysis.save();
                }
            }
        } catch (updateError) {
            console.error(`❌ [${requestId}] Failed to update analysis record:`, updateError);
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error during analysis',
            error: error.message
        });
    }
};

/**
 * Get analysis results for a resume
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAnalysis = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔍 Getting analysis for resume ID: ${id}`);
        
        // Find the resume and verify ownership
        const resume = await Resume.findOne({ 
            _id: id, 
            user: req.user._id 
        });

        if (!resume) {
            console.log(`❌ Resume not found: ${id}`);
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        // Find the latest analysis
        const analysis = await Analysis.findOne({
            resume: resume._id,
            user: req.user._id
        }).sort({ createdAt: -1 });

        if (!analysis) {
            console.log(`❌ No analysis found for resume: ${id}`);
            return res.status(404).json({
                success: false,
                message: 'No analysis found for this resume'
            });
        }

        console.log(`✅ Analysis found for resume: ${id}`, {
            status: analysis.status,
            skillsFound: analysis.extractedSkills?.length || 0
        });

        res.json({
            success: true,
            data: analysis
        });

    } catch (error) {
        console.error('❌ Get analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching analysis results'
        });
    }
};

/**
 * Get analysis results by resume ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAnalysisByResumeId = async (req, res) => {
    try {
        const { resumeId } = req.params;
        console.log(`🔍 Getting analysis for resume ID: ${resumeId}`);
        
        // Find the latest completed analysis for the given resume ID and user
        const analysis = await Analysis.findOne({
            resume: resumeId,
            user: req.user._id,
            status: 'completed'
        }).sort({ createdAt: -1 });

        if (!analysis) {
            console.log(`❌ No completed analysis found for resume: ${resumeId}`);
            return res.status(404).json({
                success: false,
                message: 'No completed analysis found for this resume. Please analyze it first.'
            });
        }

        console.log(`✅ Analysis found for resume: ${resumeId}`);
        res.json({
            success: true,
            data: analysis
        });

    } catch (error) {
        console.error('❌ Get analysis by resume ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching analysis results'
        });
    }
};

/**
 * Helper function to categorize skills
 * @param {string} skill - The skill name
 * @returns {string} - The skill category
 */
const getSkillCategory = (skill) => {
    const skillLower = skill.toLowerCase();
    
    // Programming languages
    if (['javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'r', 'matlab'].includes(skillLower)) {
        return 'Programming';
    }
    
    // Frameworks and libraries
    if (['react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'asp.net', 'jquery', 'bootstrap', 'tailwind', 'material-ui'].includes(skillLower)) {
        return 'Framework';
    }
    
    // Databases
    if (['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server', 'dynamodb', 'cassandra', 'elasticsearch'].includes(skillLower)) {
        return 'Database';
    }
    
    // Cloud platforms
    if (['aws', 'azure', 'gcp', 'heroku', 'digitalocean', 'kubernetes', 'docker', 'terraform', 'jenkins', 'gitlab'].includes(skillLower)) {
        return 'Cloud';
    }
    
    // DevOps tools
    if (['git', 'jenkins', 'docker', 'kubernetes', 'terraform', 'ansible', 'chef', 'puppet', 'vagrant', 'vagrant'].includes(skillLower)) {
        return 'DevOps';
    }
    
    // Soft skills
    if (['leadership', 'communication', 'teamwork', 'problem solving', 'project management', 'agile', 'scrum', 'mentoring', 'presentation'].includes(skillLower)) {
        return 'Soft Skills';
    }
    
    return 'Other';
};

/**
 * Helper function to determine experience level based on years
 * @param {number} years - Years of experience
 * @returns {string} - Experience level
 */
const getExperienceLevel = (years) => {
    if (years < 1) return 'Entry';
    if (years < 3) return 'Junior';
    if (years < 5) return 'Mid';
    if (years < 8) return 'Senior';
    if (years < 12) return 'Lead';
    return 'Principal';
};

module.exports = {
    analyzeResume,
    getAnalysis,
    getAnalysisByResumeId,
}; 