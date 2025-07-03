import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnalysis, pollAnalysisCompletion } from '../services/analyzeService';
import { useAuth } from '../context/AuthContext';
import SkillAnalysisCard from '../components/results/SkillAnalysisCard';
import CareerRecommendationsCard from '../components/results/CareerRecommendationsCard';
import LearningPathsCard from '../components/results/LearningPathsCard';
import ReportAndSummaryCard from '../components/results/ReportAndSummaryCard';

// Error boundary component for individual cards
const SafeComponent = ({ children, fallback, componentName }) => {
  try {
    return children;
  } catch (error) {
    console.error(`Error rendering ${componentName}:`, error);
    return fallback;
  }
};

const Results = () => {
  const { resumeId } = useParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debug logging
  console.log('🔍 Results component rendered with:', {
    resumeId,
    user,
    isAuthenticated,
    authLoading,
    analysis: !!analysis,
    loading,
    error
  });

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching analysis for resumeId:', resumeId);
        
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        console.log('🔐 Token check:', { hasToken: !!token, tokenLength: token?.length });
        
        if (!token) {
          setError('You need to be logged in to view analysis results. Please sign in and try again.');
          setLoading(false);
          return;
        }
        
        const response = await getAnalysis(resumeId);
        console.log('✅ Analysis data received:', response);
        
        // Handle both direct data and nested data structures
        const analysisData = response.data || response;
        console.log('📊 Processed analysis data:', analysisData);
        setAnalysis(analysisData);
        // If processing, start polling
        if (analysisData.status === 'processing') {
          setError('');
          setLoading(true);
          try {
            const result = await pollAnalysisCompletion(resumeId, 3000, 40);
            setAnalysis(result.data);
            setLoading(false);
          } catch (pollError) {
            setError(pollError.message || 'Analysis failed.');
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('❌ Error fetching analysis:', err);
        
        // Handle specific error cases
        if (err.message.includes('Access denied') || err.message.includes('sign in')) {
          setError('Your session has expired. Please sign in again to view the analysis results.');
        } else if (err.message.includes('not found')) {
          setError('Analysis not found. The resume may not have been analyzed yet.');
        } else {
          setError(err.message || 'An unexpected error occurred while loading the analysis.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (resumeId && !authLoading) {
      fetchAnalysis();
    }
  }, [resumeId, authLoading]);

  // Show loading while auth is checking
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading while fetching data or processing
  if (loading || (analysis && analysis.status === 'processing')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{analysis && analysis.status === 'processing' ? 'Your resume is being analyzed. This may take a moment...' : 'Loading analysis...'}</p>
        </div>
      </div>
    );
  }

  // Show error if any
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="space-y-3">
            {error.includes('sign in') || error.includes('logged in') ? (
              <>
                <Link to="/login" className="btn-primary block w-full">Sign In</Link>
                <Link to="/register" className="btn-secondary block w-full">Create Account</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="btn-primary block w-full">Back to Dashboard</Link>
                <Link to="/upload-resume" className="btn-secondary block w-full">Upload New Resume</Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show message if no analysis data
  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Analysis Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">No analysis data found for this resume.</p>
          <Link to="/upload-resume" className="btn-primary">Upload New Resume</Link>
        </div>
      </div>
    );
  }

  // Debug: Log the analysis data structure
  console.log('📊 Rendering analysis with data:', {
    hasSkills: !!analysis.extractedSkills,
    skillsCount: analysis.extractedSkills?.length || 0,
    hasDomains: !!analysis.predictedCareerDomains,
    domainsCount: analysis.predictedCareerDomains?.length || 0,
    hasGaps: !!analysis.learningGaps,
    gapsCount: analysis.learningGaps?.length || 0,
    hasSummary: !!analysis.analysisSummary,
    status: analysis.status
  });

  // Debug: Log authentication status
  console.log('🔐 Authentication status:', {
    hasToken: !!localStorage.getItem('token'),
    user: user,
    isAuthenticated: !!user
  });

  // Validate analysis data
  if (!analysis.extractedSkills && !analysis.predictedCareerDomains && !analysis.learningGaps) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Incomplete Analysis</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The analysis data appears to be incomplete. Please try analyzing the resume again.
          </p>
          <Link to="/upload-resume" className="btn-primary">Upload New Resume</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analysis Results</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Here's the breakdown of your resume.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <SafeComponent 
              componentName="SkillAnalysisCard"
              fallback={
                <div className="card">
                  <h3 className="text-xl font-bold mb-4">Skills Analysis</h3>
                  <p className="text-gray-500">Unable to load skills analysis.</p>
                </div>
              }
            >
              <SkillAnalysisCard 
                skills={analysis.extractedSkills || []} 
                experience={analysis.experienceYears || {}} 
              />
            </SafeComponent>
            
            <SafeComponent 
              componentName="LearningPathsCard"
              fallback={
                <div className="card">
                  <h3 className="text-xl font-bold mb-4">Learning Paths</h3>
                  <p className="text-gray-500">Unable to load learning paths.</p>
                </div>
              }
            >
              <LearningPathsCard gaps={analysis.learningGaps || []} />
            </SafeComponent>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <SafeComponent 
              componentName="ReportAndSummaryCard"
              fallback={
                <div className="card">
                  <h3 className="text-xl font-bold mb-4">Summary</h3>
                  <p className="text-gray-500">Unable to load summary.</p>
                </div>
              }
            >
              <ReportAndSummaryCard
                summary={analysis.analysisSummary || {}}
                user={user}
                resumeId={resumeId}
                fullAnalysis={analysis}
              />
            </SafeComponent>
            
            <SafeComponent 
              componentName="CareerRecommendationsCard"
              fallback={
                <div className="card">
                  <h3 className="text-xl font-bold mb-4">Career Recommendations</h3>
                  <p className="text-gray-500">Unable to load career recommendations.</p>
                </div>
              }
            >
              <CareerRecommendationsCard domains={analysis.predictedCareerDomains || []} />
            </SafeComponent>
          </div>
        </div>

        {/* Debug section - only show in development */}
        {/* Debug info removed for production and development safety */}
      </div>
    </div>
  );
};

export default Results;
