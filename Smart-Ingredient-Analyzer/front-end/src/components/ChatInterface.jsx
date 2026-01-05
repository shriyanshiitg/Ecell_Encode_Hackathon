import React, { useState, useRef, useEffect } from 'react';

const ChatInterface = ({ onImageCapture }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI health copilot. I help you understand food ingredients at the moment of decision-making. Just snap a photo of any food label, and I'll explain what matters to you.",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    setMessages(prev => [...prev, {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }]);

    // Simple intent detection - in real app, this would call context API
    const lowerMsg = inputMessage.toLowerCase();
    let response = '';

    if (lowerMsg.includes('how') || lowerMsg.includes('what')) {
      response = "Great question! To help you understand any food product, just take a photo of its ingredient list. I'll analyze it and explain what matters most based on your needs.";
    } else if (lowerMsg.includes('allerg') || lowerMsg.includes('diabetes') || lowerMsg.includes('health')) {
      response = "I understand you have specific health considerations. When you share a photo of ingredients, I'll automatically flag things relevant to your concerns and explain the trade-offs clearly.";
    } else {
      response = "I'm here to help you make informed food choices. Share a photo of any ingredient list, and I'll break it down in a way that's easy to understand.";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
    }, 500);

    setInputMessage('');
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <button
          onClick={onImageCapture}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Scan Ingredient Label
        </button>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask me anything about ingredients..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
