import React, { useState } from 'react';

const faqs = [
  {
    question: 'What is SkillBridge?',
    answer: 'SkillBridge is an AI-powered platform for career guidance, resume analysis, and professional development.'
  },
  {
    question: 'How do I upload my resume?',
    answer: 'Go to the Upload Resume page and follow the instructions to upload your resume in PDF format.'
  },
  {
    question: 'How can I contact support?',
    answer: 'You can email us at support@skillbridge.com.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we use industry-standard security practices to protect your data.'
  }
];

const HelpCenter = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <div className="modal-dialog relative w-full max-w-2xl">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
            onClick={onClose}
            aria-label="Close Help Center"
          >
            ×
          </button>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Help Center</h2>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-500">Frequently Asked Questions</h3>
            <ul className="space-y-3">
              {faqs.map((faq, idx) => (
                <li key={idx}>
                  <details className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                    <summary className="font-medium cursor-pointer text-gray-800 dark:text-gray-200">{faq.question}</summary>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">{faq.answer}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter; 