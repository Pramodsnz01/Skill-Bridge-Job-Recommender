const AnalysisHistory = require('../models/AnalysisHistory');
const Analysis = require('../models/Analysis');

// Get dashboard analytics for a user
const getDashboardAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;
        const { period = '30d' } = req.query; // 7d, 30d, 90d, 1y

        // Calculate date range
        const now = new Date();
        let startDate;
        switch (period) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '1y':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Get analysis history for the user
        const analysisHistory = await AnalysisHistory.find({
            user: userId,
            analysisDate: { $gte: startDate },
            status: 'active'
        }).populate('analysis');

        // 1. Number of resumes analyzed
        const totalAnalyses = analysisHistory.length;
        const analysesByWeek = await getAnalysesByWeek(userId, startDate);

        // 3. Weekly learning progress
        const learningProgress = await getLearningProgress(userId, startDate);

        // 4. Skills distribution
        const skillsDistribution = await getSkillsDistribution(userId, startDate);

        // 5. Career domains analysis
        const careerDomains = await getCareerDomainsAnalytics(userId, startDate);

        // 6. Experience level trends
        const experienceTrends = await getExperienceTrends(userId, startDate);

        // 7. Extract real skill gaps from analysis data
        let realSkillGaps = [];
        for (const hist of analysisHistory) {
            if (hist.analysis && Array.isArray(hist.analysis.learningGaps)) {
                for (const gap of hist.analysis.learningGaps) {
                    // For each missing skill in the gap, add an entry
                    if (Array.isArray(gap.missingSkills)) {
                        for (const skill of gap.missingSkills) {
                            realSkillGaps.push({
                                skill: skill,
                                domain: gap.domain || '',
                                priority: gap.priority || 'Medium',
                                frequency: 1
                            });
                        }
                    }
                }
            }
        }
        
        // Group by skill and priority
        const groupedSkillGaps = {};
        for (const gap of realSkillGaps) {
            const key = `${gap.skill}|${gap.priority}`;
            if (!groupedSkillGaps[key]) {
                groupedSkillGaps[key] = { ...gap };
            } else {
                groupedSkillGaps[key].frequency += 1;
            }
        }
        const mappedSkillGaps = Object.values(groupedSkillGaps);

        // Map backend fields to frontend expectations
        // 1. Map analysesByWeek to analysisTrend (convert week/count to date/analyses)
        const analysisTrend = analysesByWeek.map(item => ({
            date: item.week,
            analyses: item.count
        }));

        // 2. Map skillsDistribution to include 'name' property
        const mappedSkillsDistribution = (skillsDistribution || []).map(item => ({
            name: item.category || '',
            count: item.count || 0,
            skills: item.skills || []
        }));

        // 3. Map careerDomains to include 'name' property
        const mappedCareerDomains = (careerDomains || []).map(item => ({
            name: item.domain || '',
            count: item.frequency || 0,
            confidence: item.confidence || 0
        }));

        // 4. Map skillGaps to include category, priority, description
        const mappedSkillGapsForFrontend = (mappedSkillGaps || []).map(item => ({
            category: item.skill || '',
            priority: item.priority || '',
            description: '', // No description in backend, leave empty
            frequency: item.frequency || 0,
            domain: item.domain || '',
            marketDemand: item.marketDemand || 0
        }));

        // Guarantee skillGaps is always an array
        const safeSkillGaps = Array.isArray(mappedSkillGapsForFrontend) ? mappedSkillGapsForFrontend : [];

        const analyticsData = {
            overview: {
                totalAnalyses,
                period,
                startDate,
                endDate: now
            },
            analysisTrend,
            skillsDistribution: mappedSkillsDistribution,
            careerDomains: mappedCareerDomains,
            skillGaps: safeSkillGaps,
            learningProgress,
            experienceTrends
        };
        console.log('Outgoing analytics data:', JSON.stringify(analyticsData, null, 2));
        res.json({
            success: true,
            data: analyticsData
        });

    } catch (error) {
        console.error('Dashboard analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard analytics',
            error: error.message
        });
    }
};

// Get analyses by week for line chart
const getAnalysesByWeek = async (userId, startDate) => {
    const analyses = await AnalysisHistory.aggregate([
        {
            $match: {
                user: userId,
                analysisDate: { $gte: startDate },
                status: 'active'
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$analysisDate' },
                    week: { $week: '$analysisDate' }
                },
                count: { $sum: 1 },
                analyses: { $push: '$$ROOT' }
            }
        },
        {
            $sort: { '_id.year': 1, '_id.week': 1 }
        }
    ]);

    return analyses.map(item => ({
        week: `${item._id.year}-W${item._id.week.toString().padStart(2, '0')}`,
        count: item.count,
        analyses: item.analyses
    }));
};



// Get learning progress for line chart
const getLearningProgress = async (userId, startDate) => {
    const progress = await AnalysisHistory.aggregate([
        {
            $match: {
                user: userId,
                analysisDate: { $gte: startDate },
                status: 'active'
            }
        },
        {
            $unwind: '$learningProgress.weeklyGoals'
        },
        {
            $unwind: '$learningProgress.weeklyGoals.goals'
        },
        {
            $group: {
                _id: '$learningProgress.weeklyGoals.week',
                totalTargetHours: { $sum: '$learningProgress.weeklyGoals.goals.targetHours' },
                totalCompletedHours: { $sum: '$learningProgress.weeklyGoals.goals.completedHours' },
                completedGoals: {
                    $sum: {
                        $cond: [
                            { $eq: ['$learningProgress.weeklyGoals.goals.status', 'Completed'] },
                            1,
                            0
                        ]
                    }
                },
                totalGoals: { $sum: 1 }
            }
        },
        {
            $sort: { '_id': 1 }
        }
    ]);

    return progress.map(week => ({
        week: week._id,
        targetHours: week.totalTargetHours,
        completedHours: week.totalCompletedHours,
        completionRate: week.totalGoals > 0 ? (week.completedGoals / week.totalGoals) * 100 : 0,
        progressPercentage: week.totalTargetHours > 0 ? (week.totalCompletedHours / week.totalTargetHours) * 100 : 0
    }));
};

// Get skills distribution for pie chart
const getSkillsDistribution = async (userId, startDate) => {
    const skills = await AnalysisHistory.aggregate([
        {
            $match: {
                user: userId,
                analysisDate: { $gte: startDate },
                status: 'active'
            }
        },
        {
            $unwind: '$skillsFound'
        },
        {
            $group: {
                _id: '$skillsFound.category',
                count: { $sum: 1 },
                skills: { $addToSet: '$skillsFound.skill' }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);

    return skills.map(category => ({
        category: category._id,
        count: category.count,
        skills: category.skills,
        percentage: 0 // Will be calculated on frontend
    }));
};

// Get career domains analytics
const getCareerDomainsAnalytics = async (userId, startDate) => {
    const domains = await AnalysisHistory.aggregate([
        {
            $match: {
                user: userId,
                analysisDate: { $gte: startDate },
                status: 'active'
            }
        },
        {
            $unwind: '$careerDomains'
        },
        {
            $group: {
                _id: '$careerDomains.domain',
                count: { $sum: 1 },
                avgConfidence: { $avg: '$careerDomains.confidence' }
            }
        },
        {
            $sort: { count: -1, avgConfidence: -1 }
        }
    ]);

    return domains.map(domain => ({
        domain: domain._id,
        frequency: domain.count,
        confidence: Math.round(domain.avgConfidence * 100) / 100
    }));
};

// Get experience level trends
const getExperienceTrends = async (userId, startDate) => {
    const trends = await AnalysisHistory.aggregate([
        {
            $match: {
                user: userId,
                analysisDate: { $gte: startDate },
                status: 'active'
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$analysisDate' },
                    month: { $month: '$analysisDate' }
                },
                avgYears: { $avg: '$experienceLevel.years' },
                mostCommonLevel: {
                    $push: '$experienceLevel.level'
                }
            }
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 }
        }
    ]);

    return trends.map(trend => {
        const levelCounts = {};
        trend.mostCommonLevel.forEach(level => {
            levelCounts[level] = (levelCounts[level] || 0) + 1;
        });
        const levelKeys = Object.keys(levelCounts);
        let mostCommon = '';
        if (levelKeys.length > 0) {
            mostCommon = levelKeys.reduce((a, b) =>
                levelCounts[a] > levelCounts[b] ? a : b
            );
        }

        return {
            period: `${trend._id.year}-${trend._id.month.toString().padStart(2, '0')}`,
            avgYears: Math.round(trend.avgYears * 10) / 10,
            mostCommonLevel: mostCommon
        };
    });
};

// Get recent analyses for dashboard
const getRecentAnalyses = async (req, res) => {
    try {
        const userId = req.user._id;
        const { limit = 5 } = req.query;

        const recentAnalyses = await AnalysisHistory.find({
            user: userId,
            status: 'active'
        })
        .populate('analysis')
        .sort({ analysisDate: -1 })
        .limit(parseInt(limit));

        res.json({
            success: true,
            data: recentAnalyses
        });

    } catch (error) {
        console.error('Recent analyses error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent analyses',
            error: error.message
        });
    }
};

// Get user statistics summary
const getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get total analyses
        const totalAnalyses = await AnalysisHistory.countDocuments({
            user: userId,
            status: 'active'
        });

        // Get average experience from analyses
        const experienceData = await AnalysisHistory.aggregate([
            {
                $match: {
                    user: userId,
                    status: 'active'
                }
            },
            {
                $lookup: {
                    from: 'analyses',
                    localField: 'analysis',
                    foreignField: '_id',
                    as: 'analysisData'
                }
            },
            {
                $unwind: '$analysisData'
            },
            {
                $group: {
                    _id: null,
                    avgExperience: { $avg: '$analysisData.experienceYears.totalYears' },
                    totalSkills: { $sum: { $size: '$analysisData.extractedSkills' } }
                }
            }
        ]);

        // Calculate profile completion (mock data for now)
        const profileCompletion = Math.min(85 + Math.floor(Math.random() * 15), 100);

        res.json({
            success: true,
            data: {
                totalAnalyses,
                averageExperience: Math.round((experienceData[0]?.avgExperience || 0) * 10) / 10,
                totalSkills: experienceData[0]?.totalSkills || 0,
                profileCompletion,
                lastAnalysisDate: new Date()
            }
        });

    } catch (error) {
        console.error('User stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user statistics',
            error: error.message
        });
    }
};

// Get skills summary
const getSkillsSummary = async (req, res) => {
    try {
        const userId = req.user._id;

        const skillsData = await AnalysisHistory.aggregate([
            {
                $match: {
                    user: userId,
                    status: 'active'
                }
            },
            {
                $lookup: {
                    from: 'analyses',
                    localField: 'analysis',
                    foreignField: '_id',
                    as: 'analysisData'
                }
            },
            {
                $unwind: '$analysisData'
            },
            {
                $unwind: '$analysisData.extractedSkills'
            },
            {
                $group: {
                    _id: '$analysisData.extractedSkills',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10
            }
        ]);

        res.json({
            success: true,
            data: {
                totalSkills: skillsData.length,
                topSkills: skillsData.map(skill => ({
                    skill: skill._id,
                    frequency: skill.count
                }))
            }
        });

    } catch (error) {
        console.error('Skills summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch skills summary',
            error: error.message
        });
    }
};

// Get career domains summary
const getCareerDomainsSummary = async (req, res) => {
    try {
        const userId = req.user._id;

        const domainsData = await AnalysisHistory.aggregate([
            {
                $match: {
                    user: userId,
                    status: 'active'
                }
            },
            {
                $lookup: {
                    from: 'analyses',
                    localField: 'analysis',
                    foreignField: '_id',
                    as: 'analysisData'
                }
            },
            {
                $unwind: '$analysisData'
            },
            {
                $unwind: '$analysisData.predictedCareerDomains'
            },
            {
                $group: {
                    _id: '$analysisData.predictedCareerDomains',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.json({
            success: true,
            data: {
                totalDomains: domainsData.length,
                topDomains: domainsData.map(domain => ({
                    domain: domain._id,
                    frequency: domain.count
                }))
            }
        });

    } catch (error) {
        console.error('Career domains summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch career domains summary',
            error: error.message
        });
    }
};

// Delete analysis from history
const deleteAnalysis = async (req, res) => {
    try {
        const userId = req.user._id;
        const { analysisId } = req.params;

        const analysisHistory = await AnalysisHistory.findOneAndDelete({
            _id: analysisId,
            user: userId
        });

        if (!analysisHistory) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        res.json({
            success: true,
            message: 'Analysis deleted successfully'
        });

    } catch (error) {
        console.error('Delete analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete analysis',
            error: error.message
        });
    }
};

// Export analysis as PDF (placeholder)
const exportAnalysisPDF = async (req, res) => {
    try {
        const userId = req.user._id;
        const { analysisId } = req.params;

        // Find the analysis
        const analysisHistory = await AnalysisHistory.findOne({
            _id: analysisId,
            user: userId
        }).populate('analysis');

        if (!analysisHistory) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        // For now, return a simple text response
        // In a real implementation, you would generate a PDF
        const pdfContent = `Analysis Report for ${analysisHistory.analysis?.resume?.originalName || 'Resume'}
        
Generated on: ${new Date().toLocaleDateString()}
Total Skills Found: ${analysisHistory.analysis?.extractedSkills?.length || 0}
Experience Level: ${analysisHistory.analysis?.experienceYears?.totalYears || 0} years
Career Domains: ${analysisHistory.analysis?.predictedCareerDomains?.join(', ') || 'None'}`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=analysis-${analysisId}.pdf`);
        res.send(Buffer.from(pdfContent));

    } catch (error) {
        console.error('Export analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export analysis',
            error: error.message
        });
    }
};

// TEMPORARY DEBUG ENDPOINT: List all analyses for the current user
const debugListAnalysesForUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const analyses = await Analysis.find({ user: userId }).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: analyses.length,
            analyses
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// DEBUG ENDPOINT: Check skill gaps in recent analyses
const debugSkillGaps = async (req, res) => {
    try {
        const userId = req.user._id;
        const { period = '30d' } = req.query;
        
        // Calculate date range
        const now = new Date();
        let startDate;
        switch (period) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '1y':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Get analysis history with populated analysis
        const analysisHistory = await AnalysisHistory.find({
            user: userId,
            analysisDate: { $gte: startDate },
            status: 'active'
        }).populate('analysis');

        // Extract skill gaps
        let allSkillGaps = [];
        let analysesWithGaps = 0;
        
        for (const hist of analysisHistory) {
            if (hist.analysis && Array.isArray(hist.analysis.learningGaps)) {
                if (hist.analysis.learningGaps.length > 0) {
                    analysesWithGaps++;
                }
                for (const gap of hist.analysis.learningGaps) {
                    if (Array.isArray(gap.missingSkills)) {
                        for (const skill of gap.missingSkills) {
                            allSkillGaps.push({
                                skill: skill,
                                domain: gap.domain || '',
                                priority: gap.priority || 'Medium',
                                analysisId: hist.analysis._id,
                                analysisDate: hist.analysisDate
                            });
                        }
                    }
                }
            }
        }

        res.json({
            success: true,
            data: {
                totalAnalyses: analysisHistory.length,
                analysesWithGaps,
                totalSkillGaps: allSkillGaps.length,
                skillGaps: allSkillGaps,
                period,
                startDate,
                endDate: now
            }
        });
    } catch (error) {
        console.error('Debug skill gaps error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get the latest analysis for the current user
const getLatestAnalysisForUser = async (req, res) => {
    try {
        const userId = req.user._id;
        // Find the most recent analysis history for the user
        const latestHistory = await AnalysisHistory.findOne({
            user: userId,
            status: 'active'
        })
        .sort({ analysisDate: -1 })
        .populate('analysis');

        if (!latestHistory || !latestHistory.analysis) {
            return res.json({ success: true, data: null });
        }

        // Return the analysis, including learningGaps
        res.json({
            success: true,
            data: {
                _id: latestHistory.analysis._id,
                createdAt: latestHistory.analysis.createdAt,
                learningGaps: latestHistory.analysis.learningGaps || [],
                analysisSummary: latestHistory.analysis.analysisSummary || {},
                predictedCareerDomains: latestHistory.analysis.predictedCareerDomains || [],
                extractedSkills: latestHistory.analysis.extractedSkills || [],
                resume: latestHistory.resume,
            }
        });
    } catch (error) {
        console.error('Latest analysis error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch latest analysis', error: error.message });
    }
};

module.exports = {
    getDashboardAnalytics,
    getRecentAnalyses,
    getUserStats,
    getSkillsSummary,
    getCareerDomainsSummary,
    deleteAnalysis,
    exportAnalysisPDF,
    debugListAnalysesForUser,
    debugSkillGaps,
    getLatestAnalysisForUser
}; 