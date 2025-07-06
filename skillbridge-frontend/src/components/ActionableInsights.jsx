import React, { useState, useEffect } from "react";
import { FaLightbulb, FaQuestionCircle, FaSync } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';

const ActionableInsights = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState("tips");
  const [tipIndex, setTipIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [resumeTips, setResumeTips] = useState([]);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        const name = user?.name || 'User';
        // If you have a target role field, use it; otherwise, default
        const role = user?.targetRole || 'your target job';
        const res = await fetch(`/api/insights?name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}`);
        if (!res.ok) throw new Error("Failed to fetch insights");
        const data = await res.json();
        setResumeTips(data.resumeTips || []);
        setInterviewQuestions(data.interviewQuestions || []);
      } catch (err) {
        setError("Could not load insights. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Reset tip/question index when switching tabs
  useEffect(() => {
    setTipIndex(0);
    setQuestionIndex(0);
  }, [tab]);

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % resumeTips.length);
  };

  const handleNextQuestion = () => {
    setQuestionIndex((prev) => (prev + 1) % interviewQuestions.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span className="text-gray-400">Loading insights...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span className="text-red-400">{error}</span>
      </div>
    );
  }

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
        resumeTips.length > 0 ? (
          <div className="flex flex-col gap-2 bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <FaLightbulb className="text-yellow-400 text-2xl" />
              <span className="text-white flex-1">{resumeTips[tipIndex]?.text}</span>
              <button
                className="ml-2 text-blue-400 hover:text-blue-600"
                onClick={handleNextTip}
                title="Next Tip"
              >
                <FaSync />
              </button>
            </div>
            {resumeTips[tipIndex]?.explanation && (
              <div className="text-xs text-gray-400 mt-2 pl-8">{resumeTips[tipIndex].explanation}</div>
            )}
          </div>
        ) : (
          <div className="text-gray-400">No resume tips available.</div>
        )
      ) : (
        interviewQuestions.length > 0 ? (
          <div className="flex flex-col gap-2 bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <FaQuestionCircle className="text-blue-400 text-2xl" />
              <span className="text-white flex-1">{interviewQuestions[questionIndex]?.text}</span>
              <button
                className="ml-2 text-blue-400 hover:text-blue-600"
                onClick={handleNextQuestion}
                title="Next Question"
              >
                <FaSync />
              </button>
            </div>
            {interviewQuestions[questionIndex]?.explanation && (
              <div className="text-xs text-gray-400 mt-2 pl-8">{interviewQuestions[questionIndex].explanation}</div>
            )}
          </div>
        ) : (
          <div className="text-gray-400">No interview questions available.</div>
        )
      )}
    </div>
  );
};

export default ActionableInsights; 