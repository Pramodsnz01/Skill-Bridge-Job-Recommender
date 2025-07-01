import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { analyzeResumeWithProgress } from '../services/analyzeService';

const ResumeAnalyzer = ({ resumeId, onAnalysisComplete }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState('');
    const [error, setError] = useState('');
    const [analysis, setAnalysis] = useState(null);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setError('');
        setProgress('Starting analysis...');
        setAnalysis(null);

        try {
            const result = await analyzeResumeWithProgress(resumeId, (status, data, errorMsg) => {
                switch (status) {
                    case 'processing':
                        setProgress('Analyzing resume... This may take a few moments.');
                        break;
                    case 'completed':
                        setProgress('Analysis completed successfully!');
                        setAnalysis(data);
                        onAnalysisComplete?.(data);
                        break;
                    case 'failed':
                        setError(errorMsg || 'Analysis failed');
                        break;
                    default:
                        setProgress(`Status: ${status}`);
                }
            });

            console.log('Analysis result:', result);
        } catch (err) {
            setError(err.message);
            console.error('Analysis error:', err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const renderAnalysisResults = () => {
        if (!analysis) return null;

        return (
            <div className="analysis-results mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-green-800">
                        Analysis Results
                    </h3>
                    <Link
                        to={`/results/${resumeId}`}
                        className="btn-primary text-sm"
                    >
                        View Detailed Results
                    </Link>
                </div>
                
                {/* Summary */}
                <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Skills Found:</span> {analysis.analysisSummary?.totalSkillsFound || 0}
                        </div>
                        <div>
                            <span className="font-medium">Years Experience:</span> {analysis.analysisSummary?.yearsExperience || 0}
                        </div>
                        <div>
                            <span className="font-medium">Top Domain:</span> {analysis.analysisSummary?.topDomain || 'Unknown'}
                        </div>
                        <div>
                            <span className="font-medium">Learning Gaps:</span> {analysis.analysisSummary?.gapsIdentified || 0}
                        </div>
                    </div>
                </div>

                {/* Skills */}
                {analysis.extractedSkills && analysis.extractedSkills.length > 0 && (
                    <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Extracted Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {analysis.extractedSkills.map((skill, index) => (
                                <span 
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Career Domains */}
                {analysis.predictedCareerDomains && analysis.predictedCareerDomains.length > 0 && (
                    <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Predicted Career Domains</h4>
                        <div className="flex flex-wrap gap-2">
                            {analysis.predictedCareerDomains.map((domain, index) => (
                                <span 
                                    key={index}
                                    className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                                >
                                    {domain}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Learning Gaps */}
                {analysis.learningGaps && analysis.learningGaps.length > 0 && (
                    <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Learning Gaps</h4>
                        <div className="space-y-2">
                            {analysis.learningGaps.map((gap, index) => (
                                <div key={index} className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-yellow-800">{gap.domain}</span>
                                        <span className={`px-2 py-1 text-xs rounded ${
                                            gap.priority === 'High' ? 'bg-red-100 text-red-800' :
                                            gap.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {gap.priority} Priority
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {gap.missingSkills.map((skill, skillIndex) => (
                                            <span 
                                                key={skillIndex}
                                                className="px-2 py-1 bg-white text-gray-700 text-xs rounded border"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Keywords */}
                {analysis.keywords && analysis.keywords.length > 0 && (
                    <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Key Terms</h4>
                        <div className="flex flex-wrap gap-1">
                            {analysis.keywords.slice(0, 10).map((keyword, index) => (
                                <span 
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                >
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="resume-analyzer">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Resume Analysis
                </h2>
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isAnalyzing
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
                </button>
            </div>

            {/* Progress/Status */}
            {isAnalyzing && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                        <span className="text-blue-800">{progress}</span>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-800">{error}</span>
                    </div>
                </div>
            )}

            {/* Analysis Results */}
            {renderAnalysisResults()}
        </div>
    );
};

export default ResumeAnalyzer; 