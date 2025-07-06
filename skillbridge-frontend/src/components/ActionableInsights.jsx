import React, { useState } from "react";
import { FaLightbulb, FaQuestionCircle, FaCheck, FaSync } from "react-icons/fa";

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

const ActionableInsights = () => {
  const [tab, setTab] = useState("tips");
  const [tipIndex, setTipIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [tipDone, setTipDone] = useState(false);

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % resumeTips.length);
    setTipDone(false);
  };

  const handleNextQuestion = () => {
    setQuestionIndex((prev) => (prev + 1) % interviewQuestions.length);
  };

  return (
    <div className="bg-[#23293a] rounded-lg p-6 shadow-md w-full h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-white">Actionable Insights</h2>
      <div className="flex mb-4">
        <button
          className={`px-4 py-2 rounded-tl-lg rounded-bl-lg ${tab === "tips" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
          onClick={() => setTab("tips")}
        >
          Resume Tips
        </button>
        <button
          className={`px-4 py-2 rounded-tr-lg rounded-br-lg ${tab === "interview" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
          onClick={() => setTab("interview")}
        >
          Interview Prep
        </button>
      </div>
      {tab === "tips" ? (
        <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg">
          <FaLightbulb className="text-yellow-400 text-2xl" />
          <span className="text-white flex-1">{resumeTips[tipIndex]}</span>
          <button
            className="ml-2 text-green-400 hover:text-green-600"
            onClick={() => setTipDone(true)}
            disabled={tipDone}
            title="Mark as Done"
          >
            <FaCheck />
          </button>
          <button
            className="ml-2 text-blue-400 hover:text-blue-600"
            onClick={handleNextTip}
            title="Next Tip"
          >
            <FaSync />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg">
          <FaQuestionCircle className="text-blue-400 text-2xl" />
          <span className="text-white flex-1">{interviewQuestions[questionIndex]}</span>
          <button
            className="ml-2 text-blue-400 hover:text-blue-600"
            onClick={handleNextQuestion}
            title="Next Question"
          >
            <FaSync />
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionableInsights; 