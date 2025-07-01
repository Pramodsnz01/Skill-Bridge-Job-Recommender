import React from 'react';
import { formatToNepaliRupees } from '../../utils/nepalLocalization';

const CareerRecommendationsCard = ({ domains }) => {
  const suggestedCareers = [
    { 
      domain: "Software Development", 
      title: 'Full Stack Developer', 
      company: 'Tech Companies', 
      icon: '💻',
      salary: { min: 60000, max: 120000 }
    },
    { 
      domain: "Data Science", 
      title: 'Data Scientist', 
      company: 'Analytics Firms', 
      icon: '📊',
      salary: { min: 80000, max: 150000 }
    },
    { 
      domain: "Software Development", 
      title: 'DevOps Engineer', 
      company: 'Cloud Platforms', 
      icon: '⚙️',
      salary: { min: 70000, max: 130000 }
    },
    { 
      domain: "Marketing", 
      title: 'Marketing Specialist', 
      company: 'Creative Agencies', 
      icon: '🎯',
      salary: { min: 45000, max: 90000 }
    },
    { 
      domain: "Finance", 
      title: 'Financial Analyst', 
      company: 'Banks & Financial Institutions', 
      icon: '💰',
      salary: { min: 55000, max: 110000 }
    },
    { 
      domain: "Healthcare", 
      title: 'Healthcare Administrator', 
      company: 'Hospitals & Clinics', 
      icon: '🏥',
      salary: { min: 50000, max: 100000 }
    }
  ];

  // Filter careers based on predicted domains, or show top 3 if no match
  const filteredCareers = domains && domains.length > 0
    ? suggestedCareers.filter(career => domains.includes(career.domain))
    : suggestedCareers.slice(0, 3);

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4">Career Recommendations</h3>
      <div className="space-y-4">
        {filteredCareers.length > 0 ? (
          filteredCareers.map((career, index) => (
            <div key={index} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="text-2xl mr-3">{career.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{career.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{career.company}</p>
                  </div>
                </div>
                {career.salary && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      {formatToNepaliRupees(career.salary.min)} - {formatToNepaliRupees(career.salary.max)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">per month</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No specific career recommendations based on this resume.</p>
        )}
      </div>
      
      {/* Nepal-specific note */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600 rounded-lg">
        <div className="flex items-start">
          <span className="text-blue-600 dark:text-blue-400 mr-2">🇳🇵</span>
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Nepal Job Market
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Salary ranges are based on the Nepali job market and may vary by location and experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerRecommendationsCard; 