const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );
};

// Register User
const register = async (req, res) => {
    try {
        console.log('Registration attempt for email:', req.body.email);
        
        const { 
            name, 
            email, 
            password, 
            role,
            phone,
            address,
            city,
            district,
            province,
            country,
            preferences
        } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        // Validate Nepal-specific required fields
        if (!phone || !address || !city || !district || !province) {
            return res.status(400).json({
                success: false,
                message: 'Phone, address, city, district, and province are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Registration failed: Email already exists:', email);
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }

        // Create new user with Nepal-specific fields
        const userData = {
            name,
            email,
            password,
            role: role || 'user',
            phone,
            address,
            city,
            district,
            province: province || 'province3', // Default to Bagmati
            country: country || 'Nepal',
            preferences: {
                currency: 'NPR',
                dateFormat: 'DD-MM-YYYY',
                timezone: 'Asia/Kathmandu'
            }
        };

        const user = new User(userData);
        await user.save();
        console.log('User registered successfully:', email);

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Account created successfully! Welcome to SkillBridge.',
            data: {
                user: user.toJSON(),
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Please check your input and try again',
                errors
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Unable to create account. Please try again later.'
        });
    }
};

// Login User
const login = async (req, res) => {
    try {
        console.log('Login attempt for email:', req.body.email);
        
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Login failed: User not found:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            console.log('Login failed: Invalid password for user:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);
        console.log('User logged in successfully:', email);

        res.json({
            success: true,
            message: 'Welcome back!',
            data: {
                user: user.toJSON(),
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to sign in. Please try again later.'
        });
    }
};

// Get Current User
const getCurrentUser = async (req, res) => {
    try {
        console.log('Getting current user for ID:', req.user._id);
        
        res.json({
            success: true,
            data: {
                user: req.user.toJSON()
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to fetch user information'
        });
    }
};

// Logout (client-side token removal)
const logout = async (req, res) => {
    try {
        console.log('User logout:', req.user.email);
        
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during logout'
        });
    }
};

// Change Password
const changePassword = async (req, res) => {
    try {
        console.log('Password change attempt for user:', req.user._id);
        
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        // Validate new password
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await req.user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            console.log('Password change failed: Invalid current password for user:', req.user.email);
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Check if new password is same as current
        const isSamePassword = await req.user.comparePassword(newPassword);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: 'New password must be different from current password'
            });
        }

        // Update password
        req.user.password = newPassword;
        await req.user.save();
        
        console.log('Password changed successfully for user:', req.user.email);

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to change password. Please try again later.'
        });
    }
};

// Delete Account
const deleteAccount = async (req, res) => {
    try {
        console.log('Account deletion attempt for user:', req.user._id);
        
        const { password } = req.body;

        // Validate input
        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required to delete account'
            });
        }

        // Verify password
        const isPasswordValid = await req.user.comparePassword(password);
        if (!isPasswordValid) {
            console.log('Account deletion failed: Invalid password for user:', req.user.email);
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect'
            });
        }

        const userId = req.user._id;
        const userEmail = req.user.email;

        // Delete related data first (if any models exist)
        try {
            // Delete analysis history
            const AnalysisHistory = require('../models/AnalysisHistory');
            await AnalysisHistory.deleteMany({ userId });
            console.log('Deleted analysis history for user:', userEmail);
        } catch (error) {
            console.log('No analysis history to delete or error:', error.message);
        }

        try {
            // Delete chat history
            const Chat = require('../models/Chat');
            await Chat.deleteMany({ userId });
            console.log('Deleted chat history for user:', userEmail);
        } catch (error) {
            console.log('No chat history to delete or error:', error.message);
        }

        try {
            // Delete analysis data
            const Analysis = require('../models/Analysis');
            await Analysis.deleteMany({ userId });
            console.log('Deleted analysis data for user:', userEmail);
        } catch (error) {
            console.log('No analysis data to delete or error:', error.message);
        }

        // Delete user profile
        await User.findByIdAndDelete(userId);
        console.log('Account deleted successfully for user:', userEmail);

        res.json({
            success: true,
            message: 'Account deleted successfully. All your data has been removed.'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to delete account. Please try again later.'
        });
    }
};

module.exports = {
    register,
    login,
    getCurrentUser,
    logout,
    changePassword,
    deleteAccount
}; 