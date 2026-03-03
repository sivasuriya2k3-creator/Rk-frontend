import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import chatbotService from '@/lib/chatbotService';
import { Loader, Star, Check, MessageSquare, Users, MessageCircle, AlertCircle } from 'lucide-react';

interface ChatMessage {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  category: string;
  resolved: boolean;
  adminNotes: string;
  sessionId: string;
}

interface ChatStats {
  totalMessages: number;
  totalUsers: number;
  unresolvedCount: number;
  unreadCount: number;
  messagesByCategory: Array<{ _id: string; count: number }>;
}

export default function ChatbotDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'unresolved'>('all');
  const [adminNotes, setAdminNotes] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('token');
      if (token) {
        chatbotService.setToken(token);
      }
    }
  }, [user?.id, isAuthenticated]);

  useEffect(() => {
    loadData();
  }, [filter, currentPage]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [messagesData, statsData] = await Promise.all([
        chatbotService.getAllMessages(currentPage, 20),
        chatbotService.getChatStats()
      ]);

      let filtered = messagesData.messages;
      if (filter === 'unread') {
        filtered = filtered.filter((m) => !m.isRead && m.sender === 'user');
      } else if (filter === 'unresolved') {
        filtered = filtered.filter((m) => !m.resolved);
      }

      setMessages(filtered);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedBySession = messages.reduce(
    (acc, msg) => {
      if (!acc[msg.sessionId]) {
        acc[msg.sessionId] = [];
      }
      acc[msg.sessionId].push(msg);
      return acc;
    },
    {} as Record<string, ChatMessage[]>
  );

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await chatbotService.markAsRead(messageId);
      loadData();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleResolve = async (sessionId: string) => {
    try {
      await chatbotService.markAsResolved(sessionId, true, adminNotes);
      setAdminNotes('');
      setSelectedSession(null);
      loadData();
    } catch (error) {
      console.error('Error resolving session:', error);
    }
  };

  const handleToggleStar = async (messageId: string, currentStar: boolean) => {
    try {
      await chatbotService.toggleStar(messageId, !currentStar);
      loadData();
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <AlertCircle size={32} className="text-red-500 mr-2" />
        <p>Please log in to access the chatbot dashboard</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-20 px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Chatbot Management</h1>
          <p className="text-gray-600">Manage and monitor all chat conversations</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm md:text-base">Total Messages</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    {stats.totalMessages}
                  </p>
                </div>
                <MessageCircle size={32} className="text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm md:text-base">Total Users</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users size={32} className="text-green-500" />
              </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm md:text-base">Unread</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    {stats.unreadCount}
                  </p>
                </div>
                <MessageSquare size={32} className="text-yellow-500" />
              </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm md:text-base">Unresolved</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    {stats.unresolvedCount}
                  </p>
                </div>
                <AlertCircle size={32} className="text-red-500" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex gap-2 md:gap-4 flex-wrap">
          {(['all', 'unread', 'unresolved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setCurrentPage(1);
              }}
              className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm md:text-base transition-colors ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Messages Table / List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={32} className="animate-spin text-blue-500 mr-3" />
            <p className="text-gray-600">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No messages found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedBySession).map(([sessionId, sessionMessages]) => (
              <div key={sessionId} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 md:p-6 border-b cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                        {sessionMessages[0].userName}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500">{sessionMessages[0].userEmail}</p>
                      <p className="text-xs md:text-sm text-gray-400 mt-1">
                        {new Date(sessionMessages[0].timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs md:text-sm">
                      <span
                        className={`px-2 md:px-3 py-1 rounded-full ${
                          sessionMessages[0].resolved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {sessionMessages[0].resolved ? 'Resolved' : 'Pending'}
                      </span>
                      <span className={`px-2 md:px-3 py-1 rounded-full bg-blue-100 text-blue-800`}>
                        {sessionMessages[0].category}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedSession === sessionId && (
                  <div className="p-4 md:p-6 bg-gray-50 space-y-3">
                    {sessionMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-3 md:p-4 rounded-lg text-sm md:text-base ${
                          msg.sender === 'user'
                            ? 'bg-blue-50 border-l-4 border-blue-500'
                            : 'bg-gray-100 border-l-4 border-gray-400'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold text-xs md:text-sm">
                            {msg.sender === 'user' ? 'User' : 'Bot'}
                          </p>
                          <div className="flex gap-2">
                            {msg.sender === 'user' && !msg.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(msg._id)}
                                className="text-blue-500 hover:text-blue-700 text-xs"
                              >
                                Mark Read
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleStar(msg._id, msg.isStarred)}
                              className={`transition-colors text-xs ${
                                msg.isStarred
                                  ? 'text-yellow-500 hover:text-yellow-700'
                                  : 'text-gray-400 hover:text-yellow-500'
                              }`}
                            >
                              <Star size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-900">{msg.message}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}

                    {/* Admin Notes and Resolve */}
                    <div className="border-t pt-3 md:pt-4">
                      <textarea
                        value={
                          selectedSession === sessionId ? adminNotes : sessionMessages[0].adminNotes || ''
                        }
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add admin notes..."
                        className="w-full p-2 md:p-3 border border-gray-300 rounded-lg text-xs md:text-sm focus:outline-none focus:border-blue-500"
                        rows={2}
                      />
                      {!sessionMessages[0].resolved && (
                        <button
                          onClick={() => handleResolve(sessionId)}
                          className="mt-2 md:mt-3 bg-green-500 hover:bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium flex items-center gap-2"
                        >
                          <Check size={16} />
                          Mark as Resolved
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={() =>
                    setSelectedSession(selectedSession === sessionId ? null : sessionId)
                  }
                  className="w-full p-2 md:p-3 text-blue-500 hover:bg-gray-50 text-xs md:text-sm font-medium transition-colors"
                >
                  {selectedSession === sessionId ? 'Hide Details' : 'View Details'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
