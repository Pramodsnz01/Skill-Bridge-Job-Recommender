const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { auth } = require('../middleware/auth');

// Basic chat routes
router.post('/send', chatController.sendMessage);
router.get('/history', auth, chatController.getChatHistory);

// Enhanced features routes
router.get('/insights/:userId', auth, chatController.getUserInsights);
router.put('/preferences/:userId', auth, chatController.updatePreferences);
router.get('/performance', auth, chatController.getPerformanceMetrics);
router.get('/languages', chatController.getSupportedLanguages);
router.post('/clear-cache', auth, chatController.clearCaches);

// Health check for performance monitoring
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Chat service is healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 