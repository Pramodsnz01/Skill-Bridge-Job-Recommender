const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const resumeRoutes = require('./resumeRoutes');
const analyzeRoutes = require('./analyzeRoutes');
const chatRoutes = require('./chatRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const translateRoutes = require('./translateRoutes');

// Define routes
router.get('/status', (req, res) => {
    res.json({ status: "API Working" });
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        message: 'SkillBridge Backend API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Use other routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/resume', resumeRoutes);
router.use('/analyze', analyzeRoutes); // This will handle /api/analyze/:id
router.use('/dashboard', dashboardRoutes); // This will handle /api/dashboard/analytics, etc.
router.use('/chat', chatRoutes); // This will handle /api/chat/send, /api/chat/history, etc.
router.use('/translate', translateRoutes); // This will handle /api/translate/*

module.exports = router; 