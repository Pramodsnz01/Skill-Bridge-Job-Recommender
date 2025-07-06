// skillbridge-backend/controllers/insightsController.js
exports.getInsights = (req, res) => {
  const type = req.query.type || 'all';
  const userName = req.query.name || 'User';
  const targetRole = req.query.role || 'your target job';

  // Personalize tips with explanations
  const resumeTips = [
    {
      text: `Tailor your resume for the ${targetRole} role.`,
      explanation: "Customizing your resume for the specific job you want increases your chances of getting noticed by recruiters."
    },
    {
      text: "Add quantifiable results to your work experience.",
      explanation: "Numbers (like 'increased sales by 20%') make your achievements more concrete and impressive."
    },
    {
      text: "Include relevant keywords for your target job.",
      explanation: "Many companies use software to scan resumes for keywords. Using the right ones helps your resume get seen."
    },
    {
      text: "Highlight your most recent achievements at the top.",
      explanation: "Recruiters often skim resumes, so put your best and most recent work where it's most visible."
    },
    {
      text: `Use a summary section to introduce yourself, e.g., \"Hi, I'm ${userName}, a passionate learner!\"`,
      explanation: "A summary gives recruiters a quick sense of who you are and what you offer."
    },
    {
      text: "Keep formatting clean and consistent.",
      explanation: "A well-formatted resume is easier to read and looks more professional."
    },
    {
      text: "Proofread for grammar and spelling errors.",
      explanation: "Mistakes can make you look careless. Always double-check your resume."
    },
    {
      text: "Showcase relevant certifications or courses.",
      explanation: "Extra credentials can set you apart from other candidates."
    },
    {
      text: "Use action verbs to describe your achievements.",
      explanation: "Words like 'led', 'created', or 'improved' make your contributions stand out."
    },
    {
      text: "Limit your resume to 1-2 pages.",
      explanation: "Recruiters often have limited time, so keep your resume concise and focused."
    }
  ];

  // Interview questions with explanations
  const interviewQuestions = [
    {
      text: "Tell me about a time you faced a challenge at work and how you handled it.",
      explanation: "This behavioral question assesses your problem-solving and resilience."
    },
    {
      text: "Describe a situation where you had to work as part of a team.",
      explanation: "Employers want to know you can collaborate effectively with others."
    },
    {
      text: "How do you prioritize your tasks when working on multiple projects?",
      explanation: "This shows your time management and organizational skills."
    },
    {
      text: "Explain a complex technical concept to someone without a technical background.",
      explanation: "Tests your communication skills and ability to simplify complex ideas."
    },
    {
      text: "What recent technology or tool have you learned and how did you use it?",
      explanation: "Demonstrates your willingness to learn and adapt to new tools."
    },
    {
      text: `Describe a project where you used a skill relevant to ${targetRole}.",`,
      explanation: "Shows your hands-on experience with skills that matter for the job."
    },
    {
      text: "What motivates you to apply for this position?",
      explanation: "Employers want to know your goals align with the company and role."
    },
    {
      text: "Where do you see yourself in five years?",
      explanation: "Assesses your ambition and whether you plan to grow with the company."
    },
    {
      text: "Why should we hire you for this role?",
      explanation: "Gives you a chance to summarize your strengths and fit for the job."
    },
    {
      text: "How do you stay productive when working remotely?",
      explanation: "Remote work is common; this shows your self-motivation and discipline."
    },
    {
      text: "How do you keep your skills up to date in a fast-changing industry?",
      explanation: "Shows your commitment to continuous learning."
    },
    {
      text: "What is your greatest strength?",
      explanation: "Lets you highlight your best qualities relevant to the job."
    },
    {
      text: "What is your greatest weakness?",
      explanation: "Tests your self-awareness and honesty."
    },
    {
      text: "Tell me about a challenging project you worked on.",
      explanation: "Shows your experience with difficult situations and how you handle them."
    },
    {
      text: "How do you stay updated with the latest trends in your field?",
      explanation: "Demonstrates your engagement with your profession."
    }
  ];

  let result = {};
  if (type === 'tips') result.resumeTips = resumeTips;
  else if (type === 'questions') result.interviewQuestions = interviewQuestions;
  else result = { resumeTips, interviewQuestions };

  res.json(result);
}; 