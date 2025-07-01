const mongoose = require('mongoose');

const analysisHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
        required: true
    },
    analysis: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Analysis',
        required: true
    },
    analysisMetrics: {
        totalSkillsFound: {
            type: Number,
            default: 0
        },
        totalGapsIdentified: {
            type: Number,
            default: 0
        },
        processingTime: {
            type: Number,
            default: 0
        },
        confidenceScore: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AnalysisHistory', analysisHistorySchema); 