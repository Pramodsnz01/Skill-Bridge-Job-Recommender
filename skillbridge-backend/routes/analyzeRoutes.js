const express = require('express');
const { auth } = require('../middleware/auth');
const { idParamValidation } = require('../middleware/validation');
const { analyzeResume, getAnalysis, getAnalysisByResumeId, debugListAnalysesForResume } = require('../controllers/analyzeController');

const router = express.Router();

// Analyze a resume by ID
router.post('/:id', auth, idParamValidation, analyzeResume);

// Get analysis results for a resume (status check)
router.get('/:id', auth, idParamValidation, getAnalysis);

// Get completed analysis results by resume ID
router.get('/resume/:resumeId', auth, getAnalysisByResumeId);

// TEMPORARY DEBUG ENDPOINT
router.get('/debug/:resumeId', debugListAnalysesForResume);

module.exports = router; 