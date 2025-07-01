import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardAnalytics } from '../services/dashboardService';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';

const AnalyticsDashboard = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [period, setPeriod] = useState('30d');

    // Color palette for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await getDashboardAnalytics(period);
            setAnalytics(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load analytics data');
            console.error('Analytics error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatPeriodLabel = (period) => {
        switch (period) {
            case '7d': return 'Last 7 Days';
            case '30d': return 'Last 30 Days';
            case '90d': return 'Last 90 Days';
            case '1y': return 'Last Year';
            default: return 'Last 30 Days';
        }
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

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
                <div className="text-center">
                    <div className="text-red-600 dark:text-red-400 text-6xl mb-4 transition-colors duration-300">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Error Loading Analytics</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">{error}</p>
                    <button
                        onClick={fetchAnalytics}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all duration-200 transform hover:scale-105"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
                <div className="text-center">
                    <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4 transition-colors duration-300">📊</div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">No Analytics Data</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">Start by analyzing your first resume to see analytics here.</p>
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Analytics Dashboard</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">
                                Welcome back, {user?.name || 'User'}! Here's your career analytics overview.
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                            >
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="90d">Last 90 Days</option>
                                <option value="1y">Last Year</option>
                            </select>
                            <Link
                                to="/dashboard"
                                className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm transition-all duration-200 transform hover:scale-105"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600 rounded-lg p-4 transition-colors duration-300">
                        <p className="text-blue-800 dark:text-blue-200 transition-colors duration-300">
                            <strong>Period:</strong> {formatPeriodLabel(period)} | 
                            <strong> Total Analyses:</strong> {analytics.overview.totalAnalyses} |
                            <strong> Date Range:</strong> {new Date(analytics.overview.startDate).toLocaleDateString()} - {new Date(analytics.overview.endDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center transition-colors duration-300">
                                    <span className="text-blue-600 dark:text-blue-400 text-lg transition-colors duration-300">📊</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Total Analyses</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{analytics.overview.totalAnalyses}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center transition-colors duration-300">
                                    <span className="text-green-600 dark:text-green-400 text-lg transition-colors duration-300">⚡</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Skills Found</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                                    {analytics.skillsDistribution.reduce((sum, item) => sum + item.count, 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center transition-colors duration-300">
                                    <span className="text-orange-600 dark:text-orange-400 text-lg transition-colors duration-300">🎯</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Skill Gaps</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{analytics.skillGaps.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center transition-colors duration-300">
                                    <span className="text-purple-600 dark:text-purple-400 text-lg transition-colors duration-300">📈</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Career Domains</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{analytics.careerDomains.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Resume Analysis Trend - Line Chart */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Resume Analysis Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.analysisTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#6b7280" 
                                    className="dark:stroke-gray-400"
                                    tick={{ fill: '#6b7280' }}
                                />
                                <YAxis 
                                    stroke="#6b7280" 
                                    className="dark:stroke-gray-400"
                                    tick={{ fill: '#6b7280' }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        color: '#374151'
                                    }}
                                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="analyses" 
                                    stroke="#3b82f6" 
                                    strokeWidth={2}
                                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Skills Distribution - Pie Chart */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Top Skills Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.skillsDistribution.slice(0, 5)}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {analytics.skillsDistribution.slice(0, 5).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        color: '#374151'
                                    }}
                                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Career Domains - Bar Chart */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Career Domains</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.careerDomains}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                                <XAxis 
                                    dataKey="domain" 
                                    stroke="#6b7280" 
                                    className="dark:stroke-gray-400"
                                    tick={{ fill: '#6b7280' }}
                                />
                                <YAxis 
                                    stroke="#6b7280" 
                                    className="dark:stroke-gray-400"
                                    tick={{ fill: '#6b7280' }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        color: '#374151'
                                    }}
                                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                />
                                <Bar dataKey="count" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Skill Gaps - Area Chart */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Skill Gaps by Priority</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={analytics.skillGaps}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                                <XAxis 
                                    dataKey="category" 
                                    stroke="#6b7280" 
                                    className="dark:stroke-gray-400"
                                    tick={{ fill: '#6b7280' }}
                                />
                                <YAxis 
                                    stroke="#6b7280" 
                                    className="dark:stroke-gray-400"
                                    tick={{ fill: '#6b7280' }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        color: '#374151'
                                    }}
                                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="high" 
                                    stackId="1" 
                                    stroke="#ef4444" 
                                    fill="#ef4444" 
                                    fillOpacity={0.6}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="medium" 
                                    stackId="1" 
                                    stroke="#f59e0b" 
                                    fill="#f59e0b" 
                                    fillOpacity={0.6}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="low" 
                                    stackId="1" 
                                    stroke="#10b981" 
                                    fill="#10b981" 
                                    fillOpacity={0.6}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Skills */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Top Skills Found</h3>
                        <div className="space-y-3">
                            {analytics.skillsDistribution.slice(0, 10).map((skill, index) => (
                                <div key={skill.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">{index + 1}.</span>
                                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">{skill.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 transition-colors duration-300">{skill.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Skill Gaps */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Recent Skill Gaps</h3>
                        <div className="space-y-3">
                            {analytics.skillGaps.slice(0, 10).map((gap, index) => (
                                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">{gap.category}</span>
                                        <span className={`px-2 py-1 text-xs rounded-full transition-colors duration-300 ${
                                            gap.priority === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' :
                                            gap.priority === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                                            'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                        }`}>
                                            {gap.priority}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{gap.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard; 