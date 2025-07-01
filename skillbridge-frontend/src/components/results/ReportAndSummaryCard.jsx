import React from 'react';
import pdfService from '../../services/pdfService';

const ReportAndSummaryCard = ({ summary, user, resumeId, fullAnalysis }) => (
  <div className="card">
    <h3 className="text-xl font-bold mb-4">Summary & Report</h3>
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{summary?.totalSkillsFound || 0}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Skills Found</p>
      </div>
      <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{summary?.yearsExperience || 0}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Years Experience</p>
      </div>
    </div>
    <button
      onClick={() => pdfService.downloadReport(fullAnalysis, user, `resume-analysis-${resumeId}.pdf`)}
      className="btn-primary w-full flex items-center justify-center"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Download Detailed Report
    </button>
  </div>
);

export default ReportAndSummaryCard; 