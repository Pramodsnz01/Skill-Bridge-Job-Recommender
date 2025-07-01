import React, { useState } from 'react';
import Button from './ui/Button';

const UserProfileSetup = ({ onProfileUpdate, onClose, currentProfile = {} }) => {
  const [profile, setProfile] = useState({
    experience: currentProfile.experience || '',
    industry: currentProfile.industry || '',
    goals: currentProfile.goals || '',
    skills: currentProfile.skills || [],
    interests: currentProfile.interests || []
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)', description: 'Just starting your career journey' },
    { value: 'mid', label: 'Mid Level (3-7 years)', description: 'Building expertise and taking on more responsibility' },
    { value: 'senior', label: 'Senior Level (8+ years)', description: 'Leading teams and driving strategic initiatives' }
  ];

  const industries = [
    { value: 'tech', label: 'Technology', description: 'Software, IT, Data Science, etc.' },
    { value: 'business', label: 'Business', description: 'Finance, Marketing, Operations, etc.' },
    { value: 'creative', label: 'Creative', description: 'Design, Media, Arts, etc.' },
    { value: 'healthcare', label: 'Healthcare', description: 'Medical, Pharma, Biotech, etc.' },
    { value: 'education', label: 'Education', description: 'Teaching, Training, EdTech, etc.' },
    { value: 'other', label: 'Other', description: 'Other industries' }
  ];

  const commonSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Kubernetes',
    'Project Management', 'Data Analysis', 'Digital Marketing', 'Sales', 'Leadership',
    'Communication', 'Problem Solving', 'Team Management', 'Strategic Planning'
  ];

  const commonInterests = [
    'AI/ML', 'Cloud Computing', 'Cybersecurity', 'DevOps', 'Mobile Development',
    'Data Science', 'Product Management', 'UX/UI Design', 'Digital Transformation',
    'Sustainability', 'Innovation', 'Remote Work', 'Startups', 'Consulting'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onProfileUpdate(profile);
    onClose();
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const addCommonSkill = (skill) => {
    if (!profile.skills.includes(skill)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const addCommonInterest = (interest) => {
    if (!profile.interests.includes(interest)) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Profile Setup
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Help me provide more personalized career advice by sharing your background.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Experience Level *
            </label>
            <div className="grid gap-3">
              {experienceLevels.map((level) => (
                <label
                  key={level.value}
                  className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    profile.experience === level.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="experience"
                    value={level.value}
                    checked={profile.experience === level.value}
                    onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {level.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {level.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Industry *
            </label>
            <div className="grid gap-3">
              {industries.map((industry) => (
                <label
                  key={industry.value}
                  className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    profile.industry === industry.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="industry"
                    value={industry.value}
                    checked={profile.industry === industry.value}
                    onChange={(e) => setProfile(prev => ({ ...prev, industry: e.target.value }))}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {industry.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {industry.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Career Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Career Goals
            </label>
            <textarea
              value={profile.goals}
              onChange={(e) => setProfile(prev => ({ ...prev, goals: e.target.value }))}
              placeholder="What are your short-term and long-term career goals?"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              rows="3"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Skills
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addSkill}
                disabled={!newSkill.trim()}
              >
                Add
              </Button>
            </div>
            
            {/* Common Skills */}
            <div className="mb-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Common skills:</p>
              <div className="flex flex-wrap gap-2">
                {commonSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addCommonSkill(skill)}
                    disabled={profile.skills.includes(skill)}
                    className={`text-xs px-3 py-1 rounded-full transition-all duration-200 ${
                      profile.skills.includes(skill)
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Skills */}
            {profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm px-3 py-1 rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interests
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addInterest}
                disabled={!newInterest.trim()}
              >
                Add
              </Button>
            </div>
            
            {/* Common Interests */}
            <div className="mb-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Common interests:</p>
              <div className="flex flex-wrap gap-2">
                {commonInterests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => addCommonInterest(interest)}
                    disabled={profile.interests.includes(interest)}
                    className={`text-xs px-3 py-1 rounded-full transition-all duration-200 ${
                      profile.interests.includes(interest)
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Interests */}
            {profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm px-3 py-1 rounded-full"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-200"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!profile.experience || !profile.industry}
              className="flex-1"
            >
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileSetup;
