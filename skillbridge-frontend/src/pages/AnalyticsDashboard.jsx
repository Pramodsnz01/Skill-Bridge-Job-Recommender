import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLatestAnalysisForUser } from '../services/dashboardService';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
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

    // Transform skill gaps for BarChart - group by domain only
    const transformSkillGapsForChart = (learningGaps) => {
        if (!Array.isArray(learningGaps)) return [];
        
        // Group by domain and count total missing skills
        const grouped = {};
        learningGaps.forEach(gap => {
            const domain = gap.domain || 'Unknown Domain';
            if (!grouped[domain]) {
                grouped[domain] = { 
                    domain: domain, 
                    totalGaps: 0,
                    highPriority: 0,
                    mediumPriority: 0,
                    lowPriority: 0
                };
            }
            
            const skillCount = gap.missingSkills?.length || 0;
            grouped[domain].totalGaps += skillCount;
            
            // Count by priority
            const priority = (gap.priority || 'Medium').toLowerCase();
            if (priority === 'high') {
                grouped[domain].highPriority += skillCount;
            } else if (priority === 'medium') {
                grouped[domain].mediumPriority += skillCount;
            } else {
                grouped[domain].lowPriority += skillCount;
            }
        });
        
        return Object.values(grouped)
            .filter(item => item.totalGaps > 0)
            .sort((a, b) => b.totalGaps - a.totalGaps);
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

                {skillGapsChartData.length > 0 ? (
                    <div className="card mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Skill Gaps by Domain</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={skillGapsChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                                <XAxis 
                                    dataKey="domain" 
                                    stroke="#6b7280" 
                                    className="dark:stroke-gray-400"
                                    tick={{ fill: '#6b7280' }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis stroke="#6b7280" className="dark:stroke-gray-400" tick={{ fill: '#6b7280' }} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        color: '#374151'
                                    }}
                                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    formatter={(value, name) => [
                                        value, 
                                        name === 'totalGaps' ? 'Total Gaps' : 
                                        name === 'highPriority' ? 'High Priority' :
                                        name === 'mediumPriority' ? 'Medium Priority' : 'Low Priority'
                                    ]}
                                />
                                <Bar dataKey="totalGaps" fill="#3b82f6" name="Total Gaps" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="card mb-8">
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <p>No skill gaps found in the latest analysis</p>
                        </div>
                    </div>
                )}

                    <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Domain Summary</h3>
                        <div className="space-y-3">
                        {skillGapsChartData.length > 0 ? (
                            skillGapsChartData.map((domainData, idx) => (
                                <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                                            {domainData.domain}
                                        </span>
                                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">
                                            {domainData.totalGaps}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex space-x-4 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                                        {domainData.highPriority > 0 && (
                                            <span className="flex items-center">
                                                <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                                                High: {domainData.highPriority}
                                            </span>
                                        )}
                                        {domainData.mediumPriority > 0 && (
                                            <span className="flex items-center">
                                                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
                                                Medium: {domainData.mediumPriority}
                                            </span>
                                        )}
                                        {domainData.lowPriority > 0 && (
                                            <span className="flex items-center">
                                                <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                                                Low: {domainData.lowPriority}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <p>No domains with skill gaps found</p>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard; 