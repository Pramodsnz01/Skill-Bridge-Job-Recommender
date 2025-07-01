const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    // Basic auth fields
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    
    // Profile fields
    firstName: {
        type: String,
        trim: true,
        minlength: [2, 'First name must be at least 2 characters'],
        maxlength: [50, 'First name cannot be more than 50 characters']
    },
    lastName: {
        type: String,
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters'],
        maxlength: [50, 'Last name cannot be more than 50 characters']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        // Nepal phone number validation
        validate: {
            validator: function(v) {
                return /^(\+977)?[9][0-9]{9}$|^[0][1-9][0-9]{7}$/.test(v);
            },
            message: 'Please enter a valid Nepali phone number'
        }
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        maxlength: [200, 'Address cannot be more than 200 characters']
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        maxlength: [50, 'City cannot be more than 50 characters']
    },
    district: {
        type: String,
        required: [true, 'District is required'],
        trim: true,
        maxlength: [50, 'District cannot be more than 50 characters']
    },
    province: {
        type: String,
        required: [true, 'Province is required'],
        trim: true,
        enum: ['province1', 'province2', 'province3', 'province4', 'province5', 'province6', 'province7'],
        default: 'province3' // Default to Bagmati (Kathmandu area)
    },
    country: {
        type: String,
        trim: true,
        default: 'Nepal'
    },
    location: {
        type: String,
        trim: true,
        maxlength: [100, 'Location cannot be more than 100 characters']
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    skills: [{
        type: String,
        trim: true
    }],
    experience: {
        type: String,
        trim: true,
        match: [/^\d+\s*years?$/i, 'Experience must be in format "X years"']
    },
    education: {
        type: String,
        trim: true,
        maxlength: [200, 'Education cannot be more than 200 characters']
    },
    
    // Nepal-specific preferences
    preferences: {
        currency: {
            type: String,
            enum: ['NPR'],
            default: 'NPR'
        },
        dateFormat: {
            type: String,
            enum: ['DD-MM-YYYY'],
            default: 'DD-MM-YYYY'
        },
        timezone: {
            type: String,
            default: 'Asia/Kathmandu'
        }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to generate JWT token
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        { 
            userId: this._id,
            email: this.email,
            role: this.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );
    return token;
};

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user info without password
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema); 