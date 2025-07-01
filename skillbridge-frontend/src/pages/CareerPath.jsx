import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { convertUSDToNPR, formatToNepaliRupees } from '../utils/nepalLocalization';

const CareerPath = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [salaryFilter, setSalaryFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('growth');
  const [userSkills, setUserSkills] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: 'all', name: 'All Careers' },
    { id: 'tech', name: 'Technology' },
    { id: 'business', name: 'Business' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'creative', name: 'Creative' },
    { id: 'education', name: 'Education' },
    { id: 'finance', name: 'Finance' },
    { id: 'marketing', name: 'Marketing' }
  ];

  // Enhanced career data with more details
  const careerPaths = [
    {
      id: 1,
      title: 'Software Developer',
      category: 'tech',
      description: 'Design, develop, and maintain software applications using various programming languages and frameworks.',
      detailedDescription: 'Software developers create applications that run on computers, mobile devices, and the web. They work with programming languages like JavaScript, Python, Java, and C++, and use frameworks like React, Angular, and Node.js.',
      salary: { min: 45000, max: 120000 },
      growth: 'High',
      skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Git', 'SQL', 'AWS'],
      experience: '2-5 years',
      companies: ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix'],
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        'Proficiency in at least one programming language',
        'Understanding of software development lifecycle',
        'Experience with version control systems'
      ],
      responsibilities: [
        'Write clean, maintainable code',
        'Collaborate with cross-functional teams',
        'Debug and troubleshoot software issues',
        'Participate in code reviews',
        'Stay updated with industry trends'
      ],
      learningPath: [
        { level: 'Beginner', skills: ['HTML/CSS', 'JavaScript Basics', 'Git'] },
        { level: 'Intermediate', skills: ['React/Vue/Angular', 'Node.js', 'Database Design'] },
        { level: 'Advanced', skills: ['System Design', 'Cloud Platforms', 'DevOps'] }
      ]
    },
    {
      id: 2,
      title: 'Data Scientist',
      category: 'tech',
      description: 'Analyze complex data to help organizations make better decisions using statistical methods and machine learning.',
      detailedDescription: 'Data scientists extract insights from large datasets to help organizations make data-driven decisions. They use statistical analysis, machine learning algorithms, and data visualization techniques.',
      salary: { min: 60000, max: 150000 },
      growth: 'Very High',
      skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Tableau', 'TensorFlow'],
      experience: '3-7 years',
      companies: ['Netflix', 'Uber', 'Airbnb', 'Spotify', 'Google', 'Amazon'],
      requirements: [
        'Master\'s degree in Statistics, Mathematics, or related field',
        'Strong programming skills in Python or R',
        'Experience with machine learning algorithms',
        'Knowledge of statistical analysis methods'
      ],
      responsibilities: [
        'Collect and clean large datasets',
        'Develop predictive models',
        'Create data visualizations',
        'Present findings to stakeholders',
        'Collaborate with engineering teams'
      ],
      learningPath: [
        { level: 'Beginner', skills: ['Python Basics', 'Statistics Fundamentals', 'SQL'] },
        { level: 'Intermediate', skills: ['Machine Learning', 'Data Visualization', 'Big Data Tools'] },
        { level: 'Advanced', skills: ['Deep Learning', 'MLOps', 'Advanced Statistics'] }
      ]
    },
    {
      id: 3,
      title: 'Product Manager',
      category: 'business',
      description: 'Lead product development and strategy, working with cross-functional teams to deliver successful products.',
      detailedDescription: 'Product managers are responsible for the strategy, roadmap, and feature definition of a product. They work closely with engineering, design, and marketing teams.',
      salary: { min: 80000, max: 180000 },
      growth: 'High',
      skills: ['Product Strategy', 'User Research', 'Agile', 'Analytics', 'Leadership', 'A/B Testing'],
      experience: '4-8 years',
      companies: ['Facebook', 'Google', 'Amazon', 'Netflix', 'Apple', 'Microsoft'],
      requirements: [
        'Bachelor\'s degree in Business, Engineering, or related field',
        'Experience in product management or related role',
        'Strong analytical and problem-solving skills',
        'Excellent communication and leadership abilities'
      ],
      responsibilities: [
        'Define product vision and strategy',
        'Gather and prioritize product requirements',
        'Work with development teams to deliver features',
        'Analyze product metrics and user feedback',
        'Coordinate with marketing and sales teams'
      ],
      learningPath: [
        { level: 'Beginner', skills: ['Product Fundamentals', 'User Research', 'Agile Methodologies'] },
        { level: 'Intermediate', skills: ['Data Analysis', 'A/B Testing', 'Stakeholder Management'] },
        { level: 'Advanced', skills: ['Product Strategy', 'Team Leadership', 'Business Development'] }
      ]
    },
    {
      id: 4,
      title: 'UX Designer',
      category: 'creative',
      description: 'Create user-centered digital experiences through research, design, and testing.',
      detailedDescription: 'UX designers focus on creating products that provide meaningful and relevant experiences to users. They conduct user research, create wireframes, and test designs.',
      salary: { min: 35000, max: 90000 },
      growth: 'High',
      skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'Design Systems', 'Usability Testing'],
      experience: '2-6 years',
      companies: ['Apple', 'Google', 'Airbnb', 'Spotify', 'Facebook', 'Netflix'],
      requirements: [
        'Bachelor\'s degree in Design, HCI, or related field',
        'Portfolio demonstrating UX design work',
        'Experience with design tools like Figma or Sketch',
        'Understanding of user-centered design principles'
      ],
      responsibilities: [
        'Conduct user research and usability testing',
        'Create wireframes and prototypes',
        'Design user interfaces and interactions',
        'Collaborate with developers and product managers',
        'Maintain design systems and guidelines'
      ],
      learningPath: [
        { level: 'Beginner', skills: ['Design Fundamentals', 'Figma/Sketch', 'User Research Basics'] },
        { level: 'Intermediate', skills: ['Prototyping', 'Usability Testing', 'Design Systems'] },
        { level: 'Advanced', skills: ['Advanced Research Methods', 'Design Strategy', 'Team Leadership'] }
      ]
    },
    {
      id: 5,
      title: 'Digital Marketing Manager',
      category: 'marketing',
      description: 'Develop and execute digital marketing strategies to drive brand awareness and customer acquisition.',
      detailedDescription: 'Digital marketing managers oversee online marketing campaigns across various channels including social media, email, SEO, and paid advertising.',
      salary: { min: 30000, max: 80000 },
      growth: 'Medium',
      skills: ['SEO', 'SEM', 'Social Media', 'Analytics', 'Content Marketing', 'Email Marketing'],
      experience: '3-6 years',
      companies: ['HubSpot', 'Mailchimp', 'Shopify', 'Salesforce', 'Google', 'Facebook'],
      requirements: [
        'Bachelor\'s degree in Marketing, Communications, or related field',
        'Experience with digital marketing tools and platforms',
        'Strong analytical skills and data-driven mindset',
        'Excellent communication and project management skills'
      ],
      responsibilities: [
        'Develop and execute digital marketing campaigns',
        'Manage social media presence and content',
        'Optimize website for search engines',
        'Analyze campaign performance and ROI',
        'Stay updated with digital marketing trends'
      ],
      learningPath: [
        { level: 'Beginner', skills: ['Marketing Fundamentals', 'Social Media Basics', 'Google Analytics'] },
        { level: 'Intermediate', skills: ['SEO/SEM', 'Email Marketing', 'Content Strategy'] },
        { level: 'Advanced', skills: ['Marketing Automation', 'Advanced Analytics', 'Team Management'] }
      ]
    },
    {
      id: 6,
      title: 'Nurse Practitioner',
      category: 'healthcare',
      description: 'Provide advanced nursing care and treatment, often serving as primary care providers.',
      detailedDescription: 'Nurse practitioners are advanced practice registered nurses who provide primary and specialty healthcare services. They can diagnose, treat, and prescribe medications.',
      salary: { min: 50000, max: 120000 },
      growth: 'Very High',
      skills: ['Patient Care', 'Diagnosis', 'Treatment Planning', 'Communication', 'Clinical Skills', 'Electronic Health Records'],
      experience: '5-10 years',
      companies: ['Mayo Clinic', 'Cleveland Clinic', 'Johns Hopkins', 'UCLA Health', 'Kaiser Permanente'],
      requirements: [
        'Master\'s degree in Nursing (MSN)',
        'Nurse Practitioner certification',
        'State nursing license',
        'Clinical experience in healthcare setting'
      ],
      responsibilities: [
        'Conduct patient assessments and physical examinations',
        'Diagnose and treat acute and chronic conditions',
        'Prescribe medications and treatments',
        'Order and interpret diagnostic tests',
        'Provide patient education and counseling'
      ],
      learningPath: [
        { level: 'Beginner', skills: ['Nursing Fundamentals', 'Patient Assessment', 'Clinical Skills'] },
        { level: 'Intermediate', skills: ['Advanced Practice Nursing', 'Diagnosis Skills', 'Treatment Planning'] },
        { level: 'Advanced', skills: ['Specialty Practice', 'Leadership', 'Research Methods'] }
      ]
    }
  ];

  // Validation functions
  const validateSearchTerm = (term) => {
    if (term.length > 100) {
      return 'Search term is too long. Please use fewer characters.';
    }
    if (term.length < 2 && term.length > 0) {
      return 'Search term must be at least 2 characters long.';
    }
    return '';
  };

  const validateCareerData = (career) => {
    if (!career || typeof career !== 'object') return false;
    if (!career.title || !career.description || !career.salary) return false;
    if (!career.salary.min || !career.salary.max) return false;
    if (career.salary.min > career.salary.max) return false;
    return true;
  };

  // Calculate skill match percentage
  const calculateSkillMatch = (careerSkills) => {
    if (!userSkills || userSkills.length === 0) return 0;
    if (!careerSkills || !Array.isArray(careerSkills)) return 0;
    
    const matchedSkills = careerSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    return Math.round((matchedSkills.length / careerSkills.length) * 100);
  };

  // Format salary in NPR directly (no conversion needed)
  const formatSalaryInNPR = (salary) => {
    try {
      if (!salary || typeof salary !== 'object' || !salary.min || !salary.max) {
        return 'Salary information not available';
      }
      
      if (salary.min < 0 || salary.max < 0) {
        return 'Invalid salary range';
      }
      
      return `${formatToNepaliRupees(salary.min)} - ${formatToNepaliRupees(salary.max)}`;
    } catch (error) {
      console.error('Error formatting salary:', error);
      return 'Salary information not available';
    }
  };

  // Handle search input with validation
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    const error = validateSearchTerm(value);
    setSearchError(error);
  };

  // Filter and sort careers with validation
  const filteredCareers = careerPaths
    .filter(career => {
      // Validate career data
      if (!validateCareerData(career)) return false;
      
      const matchesCategory = selectedCategory === 'all' || career.category === selectedCategory;
      const matchesSearch = career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           career.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Salary filter (using NPR values directly)
      const matchesSalary = salaryFilter === 'all' || 
        (salaryFilter === 'low' && career.salary.max <= 50000) ||
        (salaryFilter === 'medium' && career.salary.min >= 40000 && career.salary.max <= 100000) ||
        (salaryFilter === 'high' && career.salary.min >= 80000);
      
      // Experience filter
      const matchesExperience = experienceFilter === 'all' ||
        (experienceFilter === 'entry' && career.experience.includes('2-')) ||
        (experienceFilter === 'mid' && career.experience.includes('3-') || career.experience.includes('4-')) ||
        (experienceFilter === 'senior' && career.experience.includes('5-') || career.experience.includes('7-'));
      
      return matchesCategory && matchesSearch && matchesSalary && matchesExperience;
    })
    .map(career => ({
      ...career,
      skillMatch: calculateSkillMatch(career.skills)
    }))
    .sort((a, b) => {
      switch (sortBy) {
        case 'growth':
          const growthOrder = { 'Very High': 3, 'High': 2, 'Medium': 1 };
          return growthOrder[b.growth] - growthOrder[a.growth];
        case 'salary':
          return b.salary.max - a.salary.max;
        case 'match':
          return b.skillMatch - a.skillMatch;
        default:
          return 0;
      }
    });

  const getGrowthColor = (growth) => {
    switch (growth) {
      case 'Very High': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'High': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  const openCareerModal = (career) => {
    if (!validateCareerData(career)) {
      console.error('Invalid career data:', career);
      return;
    }
    setSelectedCareer(career);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCareer(null);
  };

  // Load user skills from localStorage or context
  useEffect(() => {
    try {
      if (user && user.skills) {
        setUserSkills(Array.isArray(user.skills) ? user.skills : []);
      }
    } catch (error) {
      console.error('Error loading user skills:', error);
      setUserSkills([]);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Explore Career Paths</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">
            Discover exciting career opportunities and find the perfect path for your skills and interests
          </p>
        </div>

        {/* Enhanced Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search careers..."
                value={searchTerm}
                onChange={handleSearchChange}
                maxLength={100}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 ${
                  searchError ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {searchError && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{searchError}</p>
              )}
            </div>
            <div className="flex gap-2">
              <select
                value={salaryFilter}
                onChange={(e) => setSalaryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
              >
                <option value="all">All Salaries</option>
                <option value="low">Under Rs. 50,000</option>
                <option value="medium">Rs. 40,000 - Rs. 1,00,000</option>
                <option value="high">Over Rs. 80,000</option>
              </select>
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
              >
                <option value="all">All Experience</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
              >
                <option value="growth">Sort by Growth</option>
                <option value="salary">Sort by Salary</option>
                <option value="match">Sort by Skill Match</option>
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div className="category-nav flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`category-button px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:shadow-md'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading careers...</p>
          </div>
        )}

        {/* Career Paths Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCareers.map((career) => (
              <div 
                key={career.id} 
                className="card group relative overflow-hidden transition-all duration-300 ease-out hover:shadow-xl dark:hover:shadow-gray-800/50 hover:-translate-y-1 cursor-pointer"
                onClick={() => openCareerModal(career)}
                style={{ 
                  transform: 'translateZ(0)',
                  willChange: 'transform, box-shadow'
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">{career.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${getGrowthColor(career.growth)}`}>
                    {career.growth} Growth
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">{career.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Salary Range:</span>
                    <span className="text-sm text-gray-900 dark:text-white transition-colors duration-300">
                      {formatSalaryInNPR(career.salary)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Experience:</span>
                    <span className="text-sm text-gray-900 dark:text-white transition-colors duration-300">{career.experience}</span>
                  </div>

                  {career.skillMatch > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Skill Match:</span>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400 transition-colors duration-300">
                        {career.skillMatch}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Key Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {career.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full transition-colors duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                    {career.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full transition-colors duration-300">
                        +{career.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Top Companies:</h4>
                  <div className="flex flex-wrap gap-1">
                    {career.companies.slice(0, 2).map((company, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full transition-colors duration-300"
                      >
                        {company}
                      </span>
                    ))}
                    {career.companies.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full transition-colors duration-300">
                        +{career.companies.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <button className="w-full btn-primary group-hover:bg-blue-700 dark:group-hover:bg-blue-600">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredCareers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4 transition-colors duration-300">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">No careers found</h3>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}

        {/* Career Tips */}
        <div className="mt-12">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Career Development Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">Continuous Learning</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
                  Stay updated with industry trends and new technologies. Consider online courses, 
                  certifications, and attending conferences to enhance your skills.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">Networking</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
                  Build professional relationships through LinkedIn, industry events, and 
                  professional organizations. Networking can open doors to new opportunities.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">Skill Development</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
                  Focus on both technical and soft skills. Employers value communication, 
                  leadership, and problem-solving abilities alongside technical expertise.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">Career Planning</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
                  Set clear career goals and create a roadmap to achieve them. Regularly 
                  assess your progress and adjust your plan as needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Career Detail Modal */}
      {showModal && selectedCareer && validateCareerData(selectedCareer) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                    {selectedCareer.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">
                    {selectedCareer.detailedDescription}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Key Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Salary Range:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatSalaryInNPR(selectedCareer.salary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Experience Required:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedCareer.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Growth Potential:</span>
                      <span className={`font-medium px-2 py-1 rounded-full text-xs ${getGrowthColor(selectedCareer.growth)}`}>
                        {selectedCareer.growth}
                      </span>
                    </div>
                    {selectedCareer.skillMatch > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Your Skill Match:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">{selectedCareer.skillMatch}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCareer.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full transition-colors duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Requirements</h3>
                  <ul className="space-y-2">
                    {selectedCareer.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Responsibilities</h3>
                  <ul className="space-y-2">
                    {selectedCareer.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Learning Path</h3>
                <div className="space-y-4">
                  {selectedCareer.learningPath.map((level, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">{level.level} Level</h4>
                      <div className="flex flex-wrap gap-2">
                        {level.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full transition-colors duration-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Top Companies</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCareer.companies.map((company, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm rounded-full transition-colors duration-300"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  Close
                </button>
                <button className="btn-primary">
                  Save to Favorites
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerPath; 