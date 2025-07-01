const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Protected routes - require authentication
router.get('/profile', auth, getUserProfile);
router.put('/update-profile', auth, updateUserProfile);

module.exports = router; 