const express = require('express');
const router = express.Router();

// Placeholder for translation routes
router.get('/test', (req, res) => {
    res.json({ message: 'Translation routes working' });
});

router.get('/languages', (req, res) => {
    res.json({ 
        languages: ['en', 'es', 'fr', 'de'],
        message: 'Supported languages endpoint' 
    });
});

router.post('/text', (req, res) => {
    res.json({ message: 'Text translation endpoint' });
});

router.post('/analysis', (req, res) => {
    res.json({ message: 'Analysis translation endpoint' });
});

module.exports = router; 