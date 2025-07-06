// skillbridge-backend/controllers/insightsController.js
exports.getInsights = (req, res) => {
  const type = req.query.type || 'all';

  const resumeTips = [
    "Add quantifiable results to your work experience.",
    "Include relevant keywords for your target job.",
    "Highlight your most recent achievements at the top.",
  ];

  const interviewQuestions = [
    "What is your greatest strength?",
    "Tell me about a challenging project you worked on.",
    "How do you stay updated with the latest trends in your field?",
  ];

  let result = {};
  if (type === 'tips') result.resumeTips = resumeTips;
  else if (type === 'questions') result.interviewQuestions = interviewQuestions;
  else result = { resumeTips, interviewQuestions };

  res.json(result);
}; 