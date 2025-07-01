import React from 'react';

const LearningPathsCard = ({ gaps }) => (
  <div className="card">
    <h3 className="text-xl font-bold mb-4">Recommended Learning Paths</h3>
    <div className="space-y-4">
      {gaps && gaps.length > 0 ? (
        gaps.map((gap, index) => (
          <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-900 dark:text-white">{gap.domain}</p>
              <span className={`badge ${gap.priority === 'High' ? 'badge-error' : 'badge-warning'}`}>
                {gap.priority} Priority
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Skills to develop:
            </p>
            <div className="flex flex-wrap gap-2">
              {gap.missingSkills && gap.missingSkills.map((skill, i) => (
                <span key={i} className="badge badge-success">{skill}</span>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No specific learning gaps identified. Great job!</p>
      )}
    </div>
  </div>
);

export default LearningPathsCard; 