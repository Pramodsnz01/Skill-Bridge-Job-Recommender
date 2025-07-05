import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLatestAnalysisForUser } from '../services/dashboardService';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const AnalyticsDashboard = () => {
    const { user } = useAuth();
    const [latestAnalysis, setLatestAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLatestAnalysis();
    }, []);

    const fetchLatestAnalysis = async () => {
        try {
            setLoading(true);
            const response = await getLatestAnalysisForUser();
            setLatestAnalysis(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load latest analysis');
            setLatestAnalysis(null);
            console.error('Latest analysis error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Transform skill gaps for AreaChart
    const transformSkillGapsForChart = (learningGaps) => {
        if (!Array.isArray(learningGaps)) return [];
        // Group by skill and priority
        const grouped = {};
        learningGaps.forEach(gap => {
            (gap.missingSkills || []).forEach(skill => {
                const key = skill;
                if (!grouped[key]) {
                    grouped[key] = { category: skill, high: 0, medium: 0, low: 0, total: 0 };
                }
                const priority = (gap.priority || 'Medium').toLowerCase();
                grouped[key][priority] += 1;
                grouped[key].total += 1;
            });
        });
        return Object.values(grouped).sort((a, b) => b.total - a.total).slice(0, 10);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto transition-colors duration-300"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 transition-colors duration-300">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (error || !latestAnalysis) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
                <div className="text-center">
                    <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4 transition-colors duration-300">📊</div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">No Analysis Data</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">Analyze a resume to see skill gaps here.</p>
                    <Link
                        to="/upload-resume"
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all duration-200 transform hover:scale-105"
                    >
                        Upload Resume
                    </Link>
                </div>
            </div>
        );
    }

    const skillGapsChartData = transformSkillGapsForChart(latestAnalysis.learningGaps);
    const totalSkillGaps = latestAnalysis.learningGaps?.reduce((sum, gap) => sum + (gap.missingSkills?.length || 0), 0) || 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300 mb-2">Latest Resume Analysis</h1>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 mb-2">
                        {latestAnalysis.createdAt ? `Analyzed on ${new Date(latestAnalysis.createdAt).toLocaleString()}` : ''}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 mb-2">
                        <strong>Skill Gaps:</strong> {totalSkillGaps}
                    </p>
                </div>
                <div className="card mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Skill Gaps by Priority</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={skillGapsChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                            <XAxis dataKey="category" stroke="#6b7280" className="dark:stroke-gray-400" tick={{ fill: '#6b7280' }} />
                            <YAxis stroke="#6b7280" className="dark:stroke-gray-400" tick={{ fill: '#6b7280' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#374151' }} className="dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                            <Area type="monotone" dataKey="high" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                            <Area type="monotone" dataKey="medium" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                            <Area type="monotone" dataKey="low" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Detailed Skill Gaps</h3>
                    <div className="space-y-3">
                        {latestAnalysis.learningGaps && latestAnalysis.learningGaps.length > 0 ? (
                            latestAnalysis.learningGaps.map((gap, idx) => (
                                <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                                            {gap.domain || 'Unknown Domain'}
                                        </span>
                                        <span className={`px-2 py-1 text-xs rounded-full transition-colors duration-300 ${
                                            gap.priority === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' :
                                            gap.priority === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                                            'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                        }`}>
                                            {gap.priority}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                                        {gap.missingSkills && gap.missingSkills.length > 0 ? (
                                            <ul className="list-disc ml-5">
                                                {gap.missingSkills.map((skill, i) => (
                                                    <li key={i}>{skill}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>No missing skills listed.</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <p>No skill gaps found in the latest analysis</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard; 