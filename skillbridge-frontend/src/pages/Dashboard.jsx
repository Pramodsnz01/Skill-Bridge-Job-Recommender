import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatToNepaliRupees, formatNepaliDate } from '../utils/nepalLocalization';
import {
  getDashboardAnalytics,
  getRecentAnalyses,
  getUserStats,
  getSkillsSummary,
  getCareerDomainsSummary,
  deleteAnalysis,
  exportAnalysisPDF
} from '../services/dashboardService';
import Toast from '../components/Toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('30d');
  
  // Dashboard data
  const [analytics, setAnalytics] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [skillsSummary, setSkillsSummary] = useState(null);
  const [careerDomains, setCareerDomains] = useState(null);
  
  // UI state
  const [showCharts, setShowCharts] = useState(true);
  const [deletingAnalysis, setDeletingAnalysis] = useState(null);
  const [exportingAnalysis, setExportingAnalysis] = useState(null);
  const [toast, setToast] = useState(null);

  // Color palette for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchDashboardData();
  }, [user, period]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all dashboard data in parallel
      const [
        analyticsResponse,
        recentAnalysesResponse,
        userStatsResponse,
        skillsSummaryResponse,
        careerDomainsResponse
      ] = await Promise.allSettled([
        getDashboardAnalytics(period),
        getRecentAnalyses(5),
        getUserStats(),
        getSkillsSummary(),
        getCareerDomainsSummary()
      ]);

      // Handle analytics data
      if (analyticsResponse.status === 'fulfilled') {
        setAnalytics(analyticsResponse.value.data);
      }

      // Handle recent analyses
      if (recentAnalysesResponse.status === 'fulfilled') {
        setRecentAnalyses(recentAnalysesResponse.value.data || []);
      }

      // Handle user stats
      if (userStatsResponse.status === 'fulfilled') {
        setUserStats(userStatsResponse.value.data);
      }

      // Handle skills summary
      if (skillsSummaryResponse.status === 'fulfilled') {
        setSkillsSummary(skillsSummaryResponse.value.data);
      }

      // Handle career domains
      if (careerDomainsResponse.status === 'fulfilled') {
        setCareerDomains(careerDomainsResponse.value.data);
      }

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Failed to load dashboard data. Please try again.');
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteAnalysis = async (analysisId) => {
    try {
      setDeletingAnalysis(analysisId);
      await deleteAnalysis(analysisId);
      // Refresh recent analyses
      const response = await getRecentAnalyses(5);
      setRecentAnalyses(response.data || []);
      showToast('Analysis deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting analysis:', err);
      showToast('Failed to delete analysis', 'error');
    } finally {
      setDeletingAnalysis(null);
    }
  };

  const handleExportAnalysis = async (analysisId) => {
    try {
      setExportingAnalysis(analysisId);
      const blob = await exportAnalysisPDF(analysisId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analysis-${analysisId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showToast('Analysis exported successfully', 'success');
    } catch (err) {
      console.error('Error exporting analysis:', err);
      showToast('Failed to export analysis', 'error');
    } finally {
      setExportingAnalysis(null);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">
                Here's your career journey overview and latest insights.
              </p>
            </div>
            
            {/* User Profile Picture */}
            <div className="flex items-center space-x-3">
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600"
                />
              ) : (
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="btn-secondary"
            >
              {showCharts ? '📊 Hide Charts' : '📊 Show Charts'}
            </button>
            <button
              onClick={handleLogout}
              className="btn-danger"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-6">
            <p>{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Period Selector */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Time Period:
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="form-field w-auto"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatPeriodLabel(period)}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center transition-colors duration-300">
                  <span className="text-blue-600 dark:text-blue-400 text-lg">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Total Analyses
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  {analytics?.overview?.totalAnalyses || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center transition-colors duration-300">
                  <span className="text-green-600 dark:text-green-400 text-lg">⚡</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Skills Found
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  {skillsSummary?.totalSkills || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center transition-colors duration-300">
                  <span className="text-purple-600 dark:text-purple-400 text-lg">🎯</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Career Domains
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  {careerDomains?.totalDomains || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center transition-colors duration-300">
                  <span className="text-orange-600 dark:text-orange-400 text-lg">📈</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Avg Experience
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  {userStats?.averageExperience || 0}y
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {showCharts && analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Analyses Over Time */}
            {analytics.analysesByWeek && analytics.analysesByWeek.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                  Analyses Over Time
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.analysesByWeek}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="week" 
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Skills Distribution */}
            {analytics.skillsDistribution && analytics.skillsDistribution.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                  Skills Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.skillsDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.skillsDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Quick Actions
              </h3>
              <div className="space-y-4">
                <Link
                  to="/upload-resume"
                  className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md dark:hover:shadow-gray-800/50 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-lg">
                      📄
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                        Upload Resume
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        Analyze your latest resume
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/career-path"
                  className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-600 hover:shadow-md dark:hover:shadow-gray-800/50 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white text-lg">
                      🚀
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                        Explore Careers
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        Discover new opportunities
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/ai-assistant"
                  className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md dark:hover:shadow-gray-800/50 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white text-lg">
                      🤖
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                        AI Assistant
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        Get personalized advice
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/analytics"
                  className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md dark:hover:shadow-gray-800/50 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white text-lg">
                      📈
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                        Detailed Analytics
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        View comprehensive insights
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Analyses */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  Recent Analyses
                </h3>
                <Link
                  to="/analytics"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors duration-300"
                >
                  View All →
                </Link>
              </div>
              
              {recentAnalyses.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📄</div>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No analyses yet</p>
                  <Link
                    to="/upload-resume"
                    className="btn-primary"
                  >
                    Upload Your First Resume
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAnalyses.map((analysis) => (
                    <div key={analysis._id} className="flex items-start space-x-3 p-4 border border-gray-100 dark:border-gray-700 rounded-lg transition-all duration-300 hover:shadow-md dark:hover:shadow-gray-800/50">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center transition-colors duration-300">
                          <span className="text-blue-600 dark:text-blue-400 text-sm">📊</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                            {analysis.analysis?.resume?.originalName || 'Resume Analysis'}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(analysis.analysis?.status)}`}>
                            {analysis.analysis?.status || 'Unknown'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                            {new Date(analysis.analysisDate).toLocaleDateString()}
                          </p>
                          {analysis.analysisMetrics && (
                            <>
                              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                {analysis.analysisMetrics.totalSkillsFound} skills found
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                {analysis.analysisMetrics.totalGapsIdentified} gaps identified
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 flex space-x-2">
                        <Link
                          to={`/results/${analysis.analysis?._id}`}
                          className="btn-sm btn-primary"
                        >
                          View
                        </Link>
                        
                        <button
                          onClick={() => handleExportAnalysis(analysis.analysis?._id)}
                          disabled={exportingAnalysis === analysis.analysis?._id}
                          className="btn-sm btn-secondary"
                        >
                          {exportingAnalysis === analysis.analysis?._id ? 'Exporting...' : 'Export'}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteAnalysis(analysis._id)}
                          disabled={deletingAnalysis === analysis._id}
                          className="btn-sm btn-danger"
                        >
                          {deletingAnalysis === analysis._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Completion Progress */}
        {userStats && (
          <div className="mt-8">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Completion</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {userStats.profileCompletion || 0}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${userStats.profileCompletion || 0}%` }}
                ></div>
              </div>
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Complete your profile to increase your chances of getting hired. 
                <Link to="/settings" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 ml-1">
                  Update now →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 