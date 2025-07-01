const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, logout, changePassword, deleteAccount } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { registerValidation, loginValidation, changePasswordValidation, deleteAccountValidation } = require('../middleware/validation');

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', auth, getCurrentUser);
router.post('/logout', auth, logout);
router.put('/change-password', auth, changePasswordValidation, changePassword);
router.delete('/delete-account', auth, deleteAccountValidation, deleteAccount);

module.exports = router; 