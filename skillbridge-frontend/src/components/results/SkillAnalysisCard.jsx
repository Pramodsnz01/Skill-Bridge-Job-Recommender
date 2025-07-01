import React from 'react';

const SkillAnalysisCard = ({ skills, experience }) => (
  <div className="card">
    <h3 className="text-xl font-bold mb-4">Skill Analysis</h3>
    
    {/* Skills Section */}
    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Extracted Skills</h4>
      <div className="flex flex-wrap gap-2">
        {skills && skills.length > 0 ? (
          skills.map((skill, index) => (
            <span key={index} className="badge badge-primary">
              {skill}
            </span>
          ))
        ) : (
          <p className="text-gray-500">No skills were extracted.</p>
        )}
      </div>
    </div>

    {/* Experience Section */}
    {experience && experience.totalYears > 0 && (
      <div>
        <h4 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Experience</h4>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200">
            <span className="font-semibold">{experience.totalYears} years</span> of experience detected
          </p>
          {experience.mentions && experience.mentions.length > 0 && (
            <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
              Experience mentions: {experience.mentions.join(', ')} years
            </p>
          )}
        </div>
      </div>
    )}
  </div>
);

export default SkillAnalysisCard; 