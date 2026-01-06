// App.jsx - AI-Native Health Copilot
import React, { useRef, useState, useCallback, useEffect } from "react";
import WebcamCapture from "./components/WebcamCapture";
import ImageUploader from "./components/ImageUploader";
import ManualInput from "./components/ManualInput";
import ComparisonMode from "./components/ComparisonMode";
import ConversationalResult from "./components/ConversationalResult";
import ContextDisplay from "./components/ContextDisplay";
import { compressImage, detectDeviceCapabilities } from "./utils/imageUtils";
import axios from "axios";

function App() {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [mode, setMode] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [deviceCapabilities, setDeviceCapabilities] = useState(null);
  const [userContext, setUserContext] = useState(null);
  const [showChat, setShowChat] = useState(true);

  // Chat state
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! 👋 I'm your AI health copilot. I help you understand food ingredients right when you need it most - at the moment of decision.\n\nJust snap a photo of any food label, and I'll explain what really matters to you. No forms to fill, no settings to configure - I'll figure out what's important based on what you're looking at.",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  useEffect(() => {
    const capabilities = detectDeviceCapabilities();
    setDeviceCapabilities(capabilities);

    // Load saved user context from localStorage
    try {
      const savedContext = localStorage.getItem('userHealthContext');
      if (savedContext) {
        const parsed = JSON.parse(savedContext);
        setUserContext(parsed);
        console.log('✨ Loaded previous context from localStorage:', parsed);

        // Show welcome back message
        setMessages(prev => [{
          role: 'assistant',
          content: `Welcome back! 👋 I remember you're interested in ${parsed.healthConcerns?.join(', ') || 'health'}. Let's continue from where we left off.`,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Failed to load context:', error);
    }
  }, []);

  // Save context to localStorage whenever it changes
  useEffect(() => {
    if (userContext) {
      try {
        localStorage.setItem('userHealthContext', JSON.stringify(userContext));
        console.log('💾 Saved context to localStorage');
      } catch (error) {
        console.error('Failed to save context:', error);
      }
    }
  }, [userContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getApiUrl = useCallback(() => {
    const possibleUrls = [
      import.meta.env.VITE_API_URL,
      import.meta.env.VITE_API,
      "http://localhost:5001",
    ];
    return possibleUrls.find(url => url && url.trim()) || "http://localhost:5001";
  }, []);

  // Infer context from user message
  const inferContextFromMessage = useCallback(async (message) => {
    try {
      const apiUrl = getApiUrl();
      const response = await axios.post(`${apiUrl}/api/context`, {
        message,
        previousContext: userContext
      });

      if (response.data.context) {
        setUserContext(response.data.context);
        console.log('📊 Inferred context:', response.data.context);
      }
    } catch (error) {
      console.warn('Context inference failed:', error);
    }
  }, [userContext, getApiUrl]);

  // Handle user sending a text message - AI-POWERED
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setInputMessage('');

    setMessages(prev => [...prev, {
      role: 'user',
      content: userMsg,
      timestamp: new Date()
    }]);

    // Show typing indicator
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '💭 Thinking...',
      isTyping: true,
      timestamp: new Date()
    }]);

    try {
      // Infer context from message (updates userContext)
      await inferContextFromMessage(userMsg);

      // Get AI-powered response using context service
      const apiUrl = getApiUrl();
      const response = await axios.post(`${apiUrl}/api/chat`, {
        message: userMsg,
        userContext: userContext,
        conversationHistory: messages.slice(-6).map(m => ({
          role: m.role,
          content: m.content
        }))
      }, {
        timeout: 10000
      });

      // Remove typing indicator and add real response
      setMessages(prev => {
        const withoutTyping = prev.filter(m => !m.isTyping);
        return [...withoutTyping, {
          role: 'assistant',
          content: response.data.response,
          contextLearned: response.data.contextLearned,
          timestamp: new Date()
        }];
      });

    } catch (error) {
      console.error('Chat error:', error);

      // Fallback to smart response if AI fails
      const lowerMsg = userMsg.toLowerCase();
      let fallbackResponse = '';

      if (lowerMsg.includes('diabet') || lowerMsg.includes('sugar')) {
        fallbackResponse = "I understand diabetes management is important to you. When you scan a food label, I'll pay special attention to sugar content, glycemic impact, and ingredients that might affect blood sugar levels. I'll explain the trade-offs in a way that helps you make quick decisions. Ready to scan something?";
      } else if (lowerMsg.includes('allerg')) {
        fallbackResponse = "Got it - allergies are a top priority. I'll flag potential allergens and cross-contamination risks when you scan products. Just share a photo of any ingredient list.";
      } else if (lowerMsg.includes('weight') || lowerMsg.includes('diet')) {
        fallbackResponse = "I'll help you understand the nutritional impact of ingredients for your goals. When you scan a label, I'll highlight what matters for weight management and explain the real-world trade-offs.";
      } else if (lowerMsg.includes('how') || lowerMsg.includes('what') || lowerMsg.includes('?')) {
        fallbackResponse = "Great question! The best way I can help is by analyzing actual ingredients. Just take a photo of any food label - I'll read it, understand it, and explain what you really need to know. No technical jargon, just practical insights.";
      } else {
        fallbackResponse = "I'm here to be your copilot for food decisions. Whenever you're at a store or looking at a food product, just snap a photo of the ingredient list. I'll interpret it based on what matters to you. Want to try it now?";
      }

      setMessages(prev => {
        const withoutTyping = prev.filter(m => !m.isTyping);
        return [...withoutTyping, {
          role: 'assistant',
          content: fallbackResponse,
          timestamp: new Date()
        }];
      });
    }
  }, [inputMessage, inferContextFromMessage, userContext, messages, getApiUrl]);

  // Capture image from webcam
  const captureImage = useCallback(async () => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) {
        setErrorMessage("Could not capture image. Please allow camera access.");
        return;
      }

      const settings = deviceCapabilities || detectDeviceCapabilities();
      const compressedImage = await compressImage(imageSrc, 0.95, Math.max(settings.maxWidth, 2000));

      setImageSrc(compressedImage);
      setMode(null);
      setShowChat(false);

      setMessages(prev => [...prev, {
        role: 'user',
        type: 'image',
        content: '📸 [Ingredient label photo]',
        timestamp: new Date()
      }]);

      analyzeImage(compressedImage);
    } catch (error) {
      console.error('Capture error:', error);
      setErrorMessage("Failed to capture image. Please try again.");
    }
  }, [deviceCapabilities]);

  // Handle uploaded image
  const handleUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const settings = deviceCapabilities || detectDeviceCapabilities();
    const maxSize = settings.isMobile ? 8 * 1024 * 1024 : 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrorMessage(`File too large. Please select an image under ${Math.round(maxSize / (1024 * 1024))}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const compressedImage = await compressImage(reader.result, 0.95, Math.max(settings.maxWidth, 2000));
        setImageSrc(compressedImage);
        setMode(null);
        setShowChat(false);

        setMessages(prev => [...prev, {
          role: 'user',
          type: 'image',
          content: '📸 [Ingredient label photo]',
          timestamp: new Date()
        }]);

        analyzeImage(compressedImage);
      } catch (error) {
        console.error('Upload processing error:', error);
        setErrorMessage("Failed to process image. Please try another image.");
      }
    };
    reader.readAsDataURL(file);
  }, [deviceCapabilities]);

  // Analyze the image
  const analyzeImage = useCallback(async (imageData) => {
    setIsProcessing(true);
    setProcessingStatus('🔍 Reading ingredient label...');

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '🔍 Let me read that label for you...',
      timestamp: new Date()
    }]);

    try {
      const apiUrl = getApiUrl();
      const settings = deviceCapabilities || detectDeviceCapabilities();

      setProcessingStatus('🧠 Understanding ingredients...');

      const response = await axios.post(`${apiUrl}/api/analyze`, {
        image: imageData,
        fastMode: settings.fastMode,
        isMobile: settings.isMobile,
        userContext: userContext
      }, {
        timeout: 30000
      });

      setIsProcessing(false);
      setAnalysis(response.data.analysis);

      setMessages(prev => [...prev, {
        role: 'assistant',
        type: 'analysis',
        content: 'Here\'s what I found:',
        analysis: response.data.analysis,
        timestamp: new Date()
      }]);

    } catch (error) {
      setIsProcessing(false);
      console.error('Analysis error:', error);

      let errorMsg = "";

      if (error.response?.data?.code === 'OCR_NOT_AVAILABLE') {
        errorMsg = "📝 Image OCR is not available on the free hosting tier. No worries though! You can:\n\n1. Type or paste the ingredients manually using the text input below\n2. All other features work perfectly - chat, analysis, comparison, etc.\n\nJust switch to 'Type Ingredients' and paste the text from the ingredient list!";
      } else if (error.response?.data?.code === 'INSUFFICIENT_INGREDIENTS') {
        errorMsg = "I had trouble analyzing that image. Could you try focusing more closely on the ingredient list?";
      } else if (error.response?.data?.code === 'OCR_FAILED') {
        errorMsg = "I had trouble analyzing that image. The image wasn't clear enough. Could you try taking another photo with better lighting?";
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMsg = "I had trouble analyzing that image. That took too long. Let's try again with a clearer image.";
      } else {
        errorMsg = "I had trouble analyzing that image. Let's try again - maybe with better lighting or a closer shot of the ingredients.";
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMsg,
        timestamp: new Date()
      }]);

      setErrorMessage(errorMsg);
      setTimeout(() => {
        setShowChat(true);
        setImageSrc(null);
      }, 3000);
    }
  }, [deviceCapabilities, userContext, getApiUrl]);

  // Analyze manually typed ingredients
  const analyzeManualIngredients = useCallback(async (ingredientsText, productName) => {
    setMode(null);
    setShowChat(false);
    setIsProcessing(true);
    setProcessingStatus('🧠 Analyzing ingredients...');

    setMessages(prev => [...prev, {
      role: 'user',
      content: `📝 [Typed ingredients${productName ? ` for ${productName}` : ''}]`,
      timestamp: new Date()
    }]);

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '🧠 Let me analyze those ingredients for you...',
      timestamp: new Date()
    }]);

    try {
      const apiUrl = getApiUrl();
      const settings = deviceCapabilities || detectDeviceCapabilities();

      const response = await axios.post(`${apiUrl}/api/analyze-text`, {
        ingredients: ingredientsText,
        productName,
        fastMode: settings.fastMode,
        isMobile: settings.isMobile,
        userContext: userContext
      }, {
        timeout: 30000
      });

      setIsProcessing(false);
      setAnalysis(response.data.analysis);

      setMessages(prev => [...prev, {
        role: 'assistant',
        type: 'analysis',
        content: 'Here\'s my analysis:',
        analysis: response.data.analysis,
        timestamp: new Date()
      }]);

    } catch (error) {
      setIsProcessing(false);
      console.error('Manual analysis error:', error);

      let errorMsg = "I had trouble analyzing those ingredients. ";

      if (error.response?.data?.code === 'INSUFFICIENT_INGREDIENTS') {
        errorMsg += "The ingredient list seems too short. Could you provide more details?";
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMsg += "That took too long. Let's try again.";
      } else {
        errorMsg += "Please try again or check your connection.";
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMsg,
        timestamp: new Date()
      }]);

      setErrorMessage(errorMsg);
      setTimeout(() => {
        setShowChat(true);
      }, 3000);
    }
  }, [deviceCapabilities, userContext, getApiUrl]);

  const handleCompareProducts = useCallback(async (product1, product2) => {
    try {
      const apiUrl = getApiUrl();
      const response = await axios.post(`${apiUrl}/api/compare`, {
        product1,
        product2,
        userContext
      }, {
        timeout: 30000
      });

      return response.data.comparison;
    } catch (error) {
      console.error('Comparison error:', error);
      throw error;
    }
  }, [userContext, getApiUrl]);

  const reset = useCallback(() => {
    setImageSrc(null);
    setAnalysis(null);
    setMode(null);
    setShowChat(true);
    setIsProcessing(false);
    setProcessingStatus('');
    setErrorMessage(null);
  }, []);

  const initiateCapture = useCallback((captureMode) => {
    setMode(captureMode);
    setShowChat(false);
  }, []);

  const handleClearContext = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all saved preferences? This will delete what the AI has learned about you.')) {
      // Clear localStorage
      localStorage.removeItem('userHealthContext');

      // Reset context state
      setUserContext(null);

      // Add message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '🗑️ Memory cleared! I\'ve forgotten everything about your preferences. Feel free to tell me about your health concerns again, and I\'ll learn from scratch.',
        timestamp: new Date()
      }]);

      console.log('✅ Context cleared');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center py-6 mb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🤖</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-700 via-slate-700 to-green-700 bg-clip-text text-transparent">
              AI Health Copilot
            </h1>
          </div>
          <p className="text-gray-600 text-sm">Understanding ingredients at the moment of decision</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {showChat && !mode && (
            // Chat Interface
            <div className="flex flex-col h-[600px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.type === 'analysis' ? (
                      <div className="w-full">
                        <ConversationalResult
                          analysis={msg.analysis}
                          onReset={reset}
                          apiUrl={getApiUrl()}
                          userContext={userContext}
                        />
                      </div>
                    ) : (
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                      </div>
                    )}
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <p className="text-sm">{processingStatus}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Context Display */}
              {userContext && (
                <div className="px-4">
                  <ContextDisplay userContext={userContext} onClearContext={handleClearContext} />
                </div>
              )}

              {/* Quick Actions */}
              <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => initiateCapture('camera')}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Camera
                  </button>
                  <button
                    onClick={() => initiateCapture('upload')}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload
                  </button>
                  <button
                    onClick={() => initiateCapture('manual')}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Type
                  </button>
                  <button
                    onClick={() => initiateCapture('compare')}
                    className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Compare
                  </button>
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4 flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about food ingredients..."
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
          )}

          {mode === 'camera' && (
            <div className="p-6">
              <WebcamCapture
                webcamRef={webcamRef}
                onCapture={captureImage}
                onBack={() => { setMode(null); setShowChat(true); }}
              />
            </div>
          )}

          {mode === 'upload' && (
            <div className="p-6">
              <ImageUploader
                handleUpload={handleUpload}
                onBack={() => { setMode(null); setShowChat(true); }}
              />
            </div>
          )}

          {mode === 'manual' && (
            <div className="p-6">
              <ManualInput
                onAnalyze={analyzeManualIngredients}
                onBack={() => { setMode(null); setShowChat(true); }}
              />
            </div>
          )}

          {mode === 'compare' && (
            <div className="p-6">
              <ComparisonMode
                onCompare={handleCompareProducts}
                onBack={() => { setMode(null); setShowChat(true); }}
              />
            </div>
          )}

          {analysis && !showChat && (
            <div className="p-6">
              <ConversationalResult
                analysis={analysis}
                onReset={reset}
                apiUrl={getApiUrl()}
                userContext={userContext}
              />
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mt-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
            {errorMessage}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>AI-native experience • Intent-first • Uncertainty-aware</p>
        </div>
      </div>
    </div>
  );
}

export default App;
