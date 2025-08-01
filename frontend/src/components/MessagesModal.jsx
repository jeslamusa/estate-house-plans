import { useState, useEffect } from 'react';
import { X, MessageSquare, Send, User, Clock, Search } from 'lucide-react';

const MessagesModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'John Smith',
      email: 'john@example.com',
      subject: 'Question about Luxury Villa plan',
      message: 'Hi, I have a question about the Luxury Villa plan. Can you provide more details about the foundation requirements?',
      time: '2 minutes ago',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      sender: 'Sarah Johnson',
      email: 'sarah@example.com',
      subject: 'Custom plan request',
      message: 'I love your Modern Family Home design! Would it be possible to create a custom version with an additional bedroom?',
      time: '1 hour ago',
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      sender: 'Mike Wilson',
      email: 'mike@example.com',
      subject: 'Payment issue resolved',
      message: 'Thank you for helping me resolve the payment issue. The download worked perfectly!',
      time: '3 hours ago',
      read: true,
      priority: 'low'
    },
    {
      id: 4,
      sender: 'Emily Davis',
      email: 'emily@example.com',
      subject: 'Feedback on Cozy Cottage',
      message: 'I downloaded the Cozy Cottage plan and it\'s exactly what I was looking for. Great work!',
      time: '1 day ago',
      read: true,
      priority: 'low'
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const unreadCount = messages.filter(m => !m.read).length;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const markAsRead = (id) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      )
    );
  };

  const deleteMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };

  const sendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;

    // In a real app, you would send this to the backend
    const newMessage = {
      id: Date.now(),
      sender: 'Admin',
      email: 'admin@estateplans.com',
      subject: `Re: ${selectedMessage.subject}`,
      message: replyText,
      time: 'Just now',
      read: true,
      priority: 'low',
      isReply: true
    };

    setMessages(prev => [newMessage, ...prev]);
    setReplyText('');
    toast.success('Reply sent successfully!');
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !message.read) ||
                         (filter === 'priority' && message.priority === 'high');

    return matchesSearch && matchesFilter;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Messages List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Search and Filter */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === 'all' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === 'unread' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setFilter('priority')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === 'priority' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Priority
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              {filteredMessages.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => {
                        setSelectedMessage(message);
                        markAsRead(message.id);
                      }}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                      } ${!message.read ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {message.sender.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium truncate ${
                              !message.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {message.sender}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(message.priority)}`}>
                              {message.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {message.subject}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {message.time}
                          </p>
                          {!message.read && (
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No messages found</p>
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="flex-1 flex flex-col">
            {selectedMessage ? (
              <>
                {/* Message Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedMessage.subject}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        From: {selectedMessage.sender} ({selectedMessage.email})
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedMessage.time}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(selectedMessage.priority)}`}>
                        {selectedMessage.priority} priority
                      </span>
                      <button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Reply Section */}
                <div className="p-6 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={sendReply}
                      disabled={!replyText.trim()}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a message to view</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesModal; 