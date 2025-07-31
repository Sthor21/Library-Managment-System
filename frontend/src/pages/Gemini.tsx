import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Book, User, Calendar, Search, Plus } from 'lucide-react';
import { GeminiService } from '../services/GeminiService';

const Gemini = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I\'m your library assistant. You can ask me to show overdue books, search for books, check user information, and more. What would you like to do?',
      data:"",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const geminiService = new GeminiService();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message to API
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage,
      data:"",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await geminiService.sendMessage(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.message,
        data: response.data,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: error.message,
        data:"",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Suggested commands
  const suggestedCommands = [
    { text: 'Show me all overdue books', icon: Calendar },
    { text: 'Find books by Stephen King', icon: Search },
    { text: 'Which users have the most books?', icon: User },
    { text: 'What are the most popular books this month?', icon: Book },
    { text: 'Show recent book additions', icon: Plus },
    { text: 'Find all science fiction books', icon: Search }
  ];

  // Format API response data
  const formatData = (data) => {
    if (!data) return null;
    
    if (Array.isArray(data)) {
      return (
        <div className="mt-3 bg-gray-50 rounded-lg p-3 border">
          <div className="text-sm font-semibold text-gray-600 mb-2">
            Results ({data.length} items):
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {data.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded p-2 text-sm border border-gray-200"
              >
                {typeof item === "object" && item !== null ? (
                  <div className="space-y-1">
                    {Object.entries(item).map(([key, value], idx) => (
                      <div key={idx}>
                        <span className="font-medium capitalize text-gray-700">{key}:</span>{" "}
                        <span className="text-gray-900">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-900">{item}</div>
                )}
              </div>
            ))}
          </div>

        </div>
      );
    }
    
    if (typeof data === 'object') {
      return (
        <div className="mt-3 bg-gray-50 rounded-lg p-3 border">
          <div className="text-sm space-y-1">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="text-gray-700">
              <span className="font-medium capitalize text-gray-900">{key}:</span>{' '}
              {typeof value === 'string' || typeof value === 'number' ? (
                value
              ) : (
                JSON.stringify(value)
              )}
            </div>
          ))}
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-7 h-7" />
          <div>
            <h1 className="text-2xl font-semibold">Library Management Assistant</h1>
            <p className="text-blue-100 text-sm mt-1">
              Ask me anything about books, users, or library operations
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl rounded-lg p-4 shadow-sm ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.text}</div>
              {message.data && message.data.length>0 &&  formatData(message.data)}
              <div className="text-xs mt-3 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <span className="text-gray-600">Processing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Commands */}
      {messages.length === 1 && (
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-4">Try these commands:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedCommands.map((cmd, index) => {
              const IconComponent = cmd.icon;
              return (
                <button
                  key={index}
                  onClick={() => setInputMessage(cmd.text)}
                  className="flex items-center gap-3 p-3 text-left text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                >
                  <IconComponent className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                  <span className="text-gray-700 group-hover:text-gray-900">{cmd.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-6 bg-white border-t border-gray-200">
        <div className="flex gap-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me about books, users, or library operations..."
            className="flex-1 resize-none bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
            disabled={isLoading}
            maxLength={500}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gemini;