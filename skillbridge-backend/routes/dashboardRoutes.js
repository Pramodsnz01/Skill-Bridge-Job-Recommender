const express = require('express');
const { auth } = require('../middleware/auth');
const { 
  getDashboardAnalytics, 
  getRecentAnalyses, 
  getUserStats, 
  getSkillsSummary, 
  getCareerDomainsSummary, 
  deleteAnalysis, 
  exportAnalysisPDF, 
  debugListAnalysesForUser,
  debugSkillGaps,
  getLatestAnalysisForUser
} = require('../controllers/dashboardController');

const router = express.Router();

// Get dashboard analytics with period filter
router.get('/analytics', auth, getDashboardAnalytics);

// Get recent analyses for dashboard
router.get('/recent-analyses', auth, getRecentAnalyses);

// Get user statistics summary
router.get('/user-stats', auth, getUserStats);

// Get skills summary
router.get('/skills-summary', auth, getSkillsSummary);

// Get career domains summary
router.get('/career-domains-summary', auth, getCareerDomainsSummary);

// Delete analysis from history
router.delete('/analysis/:analysisId', auth, deleteAnalysis);

// Export analysis as PDF
router.get('/export-analysis/:analysisId', auth, exportAnalysisPDF);

// Get latest analysis for dashboard per-resume chart
router.get('/latest-analysis', auth, getLatestAnalysisForUser);

// TEMPORARY DEBUG ENDPOINT
router.get('/debug/analyses', auth, debugListAnalysesForUser);

// DEBUG ENDPOINT: Check skill gaps
router.get('/debug/skill-gaps', auth, debugSkillGaps);

module.exports = router; 