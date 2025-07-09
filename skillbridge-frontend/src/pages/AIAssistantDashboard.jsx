import React, { useState, useEffect } from 'react';
import ChatBot from '../components/ChatBot';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { getChatHistory, deleteChatHistory } from '../services/chatService';
import { FaEye, FaTrash } from 'react-icons/fa';

const AIAssistantDashboard = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedConv, setSelectedConv] = useState(null);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchChatHistory();
    }
  }, [activeTab]);

  const fetchChatHistory = async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const result = await getChatHistory();
      const chats = Array.isArray(result) ? result : (result.chats || []);
      setChatHistory(chats);
    } catch (err) {
      setHistoryError('Failed to load conversation history.');
      setChatHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleDelete = async (idOrIdx) => {
    setDeleteError(null);
    setDeletingId(idOrIdx);
    try {
      // Find the conversation by _id, id, or idx
      const conv = chatHistory.find((c, idx) => (c._id ?? c.id ?? idx) === idOrIdx);
      if (conv && conv._id) {
        await deleteChatHistory(conv._id);
      }
      setChatHistory(prev => prev.filter((c, idx) => (c._id ?? c.id ?? idx) !== idOrIdx));
    } catch (err) {
      setDeleteError('Failed to delete conversation.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (conv) => {
    setSelectedConv(conv);
    setViewModalOpen(true);
  };

  const closeModal = () => {
    setViewModalOpen(false);
    setSelectedConv(null);
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'chat':
        return '💬';
      case 'history':
        return '📚';
      default:
        return '📋';
    }
  };

  const tabs = [
    { id: 'chat', label: 'AI Chat', description: 'Start a conversation with your AI assistant' },
    { id: 'history', label: 'History', description: 'Review your past conversations and topics' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🤖</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  AI Career Assistant
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your personalized career development companion
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="text-lg">{getTabIcon(tab.id)}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <ChatBot />
              </div>
            </div>
            {/* Placeholder for future quick stats or info */}
            <div></div>
          </div>
        )}

        {activeTab === 'history' && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Conversation History
            </h3>
            {historyLoading ? (
              <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            ) : historyError ? (
              <div className="text-red-500 dark:text-red-400">{historyError}</div>
            ) : (
              <>
                {deleteError && <div className="text-red-500 dark:text-red-400 mb-2">{deleteError}</div>}
                {chatHistory.length === 0 ? (
                  <div className="text-gray-500 dark:text-gray-400">No conversation history available.</div>
                ) : (
                  <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-gray-800 dark:bg-gray-900 rounded-lg overflow-hidden">
                      <thead className="bg-gray-700 dark:bg-gray-800">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-300 dark:text-gray-400 uppercase tracking-wider">Date</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-300 dark:text-gray-400 uppercase tracking-wider">Topic / Summary</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-300 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700 dark:divide-gray-800">
                        {chatHistory.map((conv, idx) => {
                          const rowId = conv._id ?? conv.id ?? idx;
                          return (
                            <tr
                              key={rowId}
                              className={
                                `transition-colors text-xs ${idx % 2 === 0 ? 'bg-gray-900/70 dark:bg-gray-800/60' : 'bg-gray-800/60 dark:bg-gray-900/40'} ` +
                                'hover:bg-blue-900/10 dark:hover:bg-blue-900/30'
                              }
                            >
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-100 dark:text-white">
                                {conv.timestamp ? new Date(conv.timestamp).toLocaleDateString() : '—'}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs font-semibold text-blue-200 dark:text-blue-300">
                                {(conv.context?.topic && conv.context.topic !== 'exact_match' && conv.context.topic !== 'fallback')
                                  ? conv.context.topic
                                  : (conv.userMessage ? conv.userMessage.slice(0, 30) : '—')}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs font-medium flex gap-1">
                                <Button
                                  size="sm"
                                  variant="primary"
                                  className="flex items-center gap-1 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-blue-700 transition-colors"
                                  onClick={() => handleView(conv)}
                                  disabled={deletingId === rowId}
                                  aria-label="View conversation"
                                >
                                  <FaEye className="inline-block text-base" />
                                  <span>View</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex items-center gap-1 px-2 py-1 rounded border border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
                                  onClick={() => handleDelete(rowId)}
                                  disabled={deletingId === rowId}
                                  aria-label="Delete conversation"
                                >
                                  <FaTrash className="inline-block text-base" />
                                  <span>{deletingId === rowId ? 'Deleting...' : 'Delete'}</span>
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </Card>
        )}
      </div>

      {/* Modal for viewing conversation */}
      {viewModalOpen && selectedConv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Conversation Details</h2>
            <div className="mb-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">User Message:</span>
              <div className="text-gray-900 dark:text-white mt-1 whitespace-pre-line">{selectedConv.userMessage || '—'}</div>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">AI Response:</span>
              <div className="text-gray-900 dark:text-white mt-1 whitespace-pre-line">{selectedConv.aiResponse || '—'}</div>
            </div>
            <div className="flex justify-end mt-4">
              <Button size="sm" variant="outline" onClick={closeModal}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistantDashboard; 