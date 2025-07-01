import React from 'react';
import pdfService from '../services/pdfService';

const PDFTest = () => {
  // Sample analysis data for testing
  const sampleAnalysis = {
    extractedSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'AWS', 'Docker', 'Git'],
    experienceYears: {
      totalYears: 5,
      mentions: [3, 2]
    },
    keywords: ['software', 'development', 'web', 'application', 'database'],
    predictedCareerDomains: ['Software Development', 'Data Science', 'DevOps'],
    learningGaps: [
      {
        domain: 'Data Science',
        missingSkills: ['R', 'Pandas', 'TensorFlow', 'Jupyter'],
        priority: 'High'
      },
      {
        domain: 'DevOps',
        missingSkills: ['Kubernetes', 'Jenkins', 'Terraform'],
        priority: 'Medium'
      }
    ],
    analysisSummary: {
      totalSkillsFound: 8,
      yearsExperience: 5,
      topDomain: 'Software Development',
      gapsIdentified: 2
    }
  };

  const sampleUser = {
    name: 'John Doe',
    email: 'john.doe@example.com'
  };

  const handleDownloadPDF = () => {
    try {
      pdfService.downloadReport(sampleAnalysis, sampleUser, 'test-resume-analysis.pdf');
      console.log('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">PDF Generation Test</h1>
        <p className="text-gray-600 mb-6">
          Click the button below to test the PDF generation functionality with sample data.
        </p>
        <button
          onClick={handleDownloadPDF}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Generate Test PDF
        </button>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Sample Data Included:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 8 extracted skills</li>
            <li>• 5 years experience</li>
            <li>• 3 career domains</li>
            <li>• 2 learning gaps</li>
            <li>• Suggested careers</li>
            <li>• Learning paths</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PDFTest; 