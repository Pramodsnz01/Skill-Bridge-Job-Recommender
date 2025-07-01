const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    extractedSkills: [{
        type: String
    }],
    experienceYears: {
        totalYears: {
            type: Number,
            default: 0
        },
        mentions: [{
            type: Number
        }]
    },
    keywords: [{
        type: String
    }],
    predictedCareerDomains: [{
        type: String
    }],
    learningGaps: [{
        domain: {
            type: String
        },
        missingSkills: [{
            type: String
        }],
        priority: {
            type: String,
            enum: ['High', 'Medium', 'Low'],
            default: 'Medium'
        }
    }],
    analysisSummary: {
        totalSkillsFound: {
            type: Number,
            default: 0
        },
        yearsExperience: {
            type: Number,
            default: 0
        },
        topDomain: {
            type: String,
            default: 'Unknown'
        },
        gapsIdentified: {
            type: Number,
            default: 0
        }
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    errorMessage: {
        type: String
    },
    processingTime: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Analysis', analysisSchema); 