const User = require('../models/User');
const { validateNepaliPhone } = require('../utils/nepalLocalization');

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                user
            }
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            location,
            bio,
            skills,
            experience,
            education,
            address,
            province,
            district,
            city
        } = req.body;

        // Enhanced validation
        const errors = [];

        // First/Last Name validation
        if (!firstName || firstName.trim().length < 2) {
            errors.push('First name is required and must be at least 2 characters');
            console.error('Validation failed: firstName too short or missing:', firstName);
        }
        if (firstName && firstName.trim().length > 50) {
            errors.push('First name cannot exceed 50 characters');
            console.error('Validation failed: firstName too long:', firstName);
        }
        
        if (!lastName || lastName.trim().length < 2) {
            errors.push('Last name is required and must be at least 2 characters');
            console.error('Validation failed: lastName too short or missing:', lastName);
        }
        if (lastName && lastName.trim().length > 50) {
            errors.push('Last name cannot exceed 50 characters');
            console.error('Validation failed: lastName too long:', lastName);
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.push('Please enter a valid email address');
            console.error('Validation failed: invalid email:', email);
        }

        // Phone validation (Nepali format)
        if (phone && !validateNepaliPhone(phone)) {
            errors.push('Please enter a valid Nepali phone number (e.g., 98xxxxxxxx)');
            console.error('Validation failed: invalid phone:', phone);
        }

        // Skills validation
        if (!skills || !Array.isArray(skills) || skills.length === 0) {
            errors.push('At least one skill is required');
            console.error('Validation failed: skills missing or not array:', skills);
        } else {
            const validSkills = skills.filter(skill => skill && skill.trim().length > 0);
            if (validSkills.length === 0) {
                errors.push('Skills cannot be empty');
                console.error('Validation failed: all skills empty:', skills);
            }
        }

        // Experience validation
        if (experience) {
            const experienceRegex = /^\d+\s*years?$/i;
            if (!experienceRegex.test(experience)) {
                errors.push('Experience must be in format "X years" (e.g., "5 years")');
                console.error('Validation failed: experience format:', experience);
            } else {
                const years = parseInt(experience);
                if (years < 0 || years > 50) {
                    errors.push('Experience must be between 0 and 50 years');
                    console.error('Validation failed: experience out of range:', experience);
                }
            }
        }

        // Education validation
        if (!education || education.trim().length === 0) {
            errors.push('Education is required');
            console.error('Validation failed: education missing:', education);
        }
        if (education && education.trim().length > 200) {
            errors.push('Education cannot exceed 200 characters');
            console.error('Validation failed: education too long:', education);
        }

        // Bio validation
        if (bio && bio.trim().length > 500) {
            errors.push('Bio cannot exceed 500 characters');
            console.error('Validation failed: bio too long:', bio);
        }

        // Address validation
        if (address && address.trim().length > 200) {
            errors.push('Address cannot exceed 200 characters');
            console.error('Validation failed: address too long:', address);
        }

        // Location validation
        if (location && location.trim().length > 100) {
            errors.push('Location cannot exceed 100 characters');
            console.error('Validation failed: location too long:', location);
        }

        if (errors.length > 0) {
            console.error('Validation errors:', errors);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        // Check if email is already taken by another user
        if (email && email !== req.user.email) {
            const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already taken by another user'
                });
            }
        }

        // Prepare update data
        const updateData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            skills: skills.filter(skill => skill && skill.trim().length > 0).map(skill => skill.trim()),
            education: education.trim()
        };

        // Add optional fields only if they have values
        if (phone) updateData.phone = phone.trim();
        if (location) updateData.location = location.trim();
        if (bio) updateData.bio = bio.trim();
        if (experience) updateData.experience = experience.trim();
        if (address) updateData.address = address.trim();
        if (province) updateData.province = province;
        if (district) updateData.district = district.trim();
        if (city) updateData.city = city.trim();

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: updatedUser
            }
        });
    } catch (error) {
        console.error('Update user profile error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile
}; 