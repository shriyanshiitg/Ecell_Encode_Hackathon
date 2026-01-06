import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ConversationalResult = ({ analysis, onReset, apiUrl, userContext }) => {
  const [messages, setMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initial AI message with analysis summary
    if (analysis) {
      setMessages([
        {
          role: 'assistant',
          type: 'analysis',
          content: analysis.summary,
          keyInsights: analysis.keyInsights,
          ingredients: analysis.ingredients,
          inferredConcerns: analysis.inferredConcerns,
          recommendedQuestions: analysis.recommendedQuestions,
          timestamp: new Date()
        }
      ]);
    }
  }, [analysis]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAskQuestion = async () => {
    if (!inputQuestion.trim() || isAsking) return;

    const userMsg = inputQuestion;
    setInputQuestion('');
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMsg,
      timestamp: new Date()
    }]);

    setIsAsking(true);

    try {
      const response = await axios.post(`${apiUrl}/api/ask`, {
        question: userMsg,
        analysisContext: analysis,
        userContext
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        type: 'answer',
        content: response.data.answer,
        reasoning: response.data.reasoning,
        suggestions: response.data.suggestions,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error asking question:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble answering that right now. Could you try rephrasing?",
        timestamp: new Date()
      }]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputQuestion(question);
    setTimeout(() => handleAskQuestion(), 100);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Good': return 'bg-green-100 text-green-800 border-green-300';
      case 'Concerning': return 'bg-red-100 text-red-800 border-red-300';
      case 'Unknown': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getUncertaintyIcon = (level) => {
    switch (level) {
      case 'high': return '⚠️';
      case 'medium': return '❓';
      default: return '✓';
    }
  };

  const getUncertaintyExplanation = (level) => {
    switch (level) {
      case 'high':
        return 'Research shows mixed or conflicting results. The evidence is not conclusive.';
      case 'medium':
        return 'Some studies suggest this, but more research is needed for certainty.';
      default:
        return 'Strong evidence supports this conclusion.';
    }
  };

  const getUncertaintyColor = (level) => {
    switch (level) {
      case 'high': return 'bg-orange-50 border-orange-300';
      case 'medium': return 'bg-yellow-50 border-yellow-300';
      default: return 'bg-green-50 border-green-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Chat Messages */}
      <div className="bg-white rounded-2xl shadow-xl p-6 max-h-[70vh] overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx}>
            {msg.role === 'assistant' && msg.type === 'analysis' ? (
              // Initial Analysis Message
              <div className="space-y-4">
                {/* Summary */}
                <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">🤖</span>
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </div>

                {/* Key Insights */}
                {msg.keyInsights && msg.keyInsights.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <span>💡</span> Key Insights
                    </h3>
                    {msg.keyInsights.map((insight, i) => (
                      <div key={i} className={`rounded-lg p-4 border-2 ${getUncertaintyColor(insight.uncertaintyLevel)}`}>
                        <div className="flex items-start gap-2">
                          <span className="text-2xl">{getUncertaintyIcon(insight.uncertaintyLevel)}</span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{insight.insight}</p>
                            <p className="text-sm text-gray-700 mt-1">{insight.explanation}</p>

                            {/* Trade-off Display */}
                            {insight.tradeoff && (
                              <div className="mt-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded p-2">
                                <p className="text-xs font-semibold text-blue-900 mb-1">⚖️ Trade-off:</p>
                                <p className="text-xs text-blue-800">{insight.tradeoff}</p>
                              </div>
                            )}

                            {insight.reasoning && (
                              <details className="mt-2">
                                <summary className="text-xs text-blue-700 cursor-pointer hover:text-blue-900 font-medium">
                                  💭 Why I think this
                                </summary>
                                <p className="text-xs text-gray-600 mt-1 ml-4 italic border-l-2 border-blue-300 pl-2">
                                  {insight.reasoning}
                                </p>
                              </details>
                            )}
                            {/* Uncertainty Explanation */}
                            <div className="mt-2 flex items-start gap-2">
                              <div className={`flex-1 text-xs p-2 rounded border ${
                                insight.uncertaintyLevel === 'high' ? 'bg-orange-100 border-orange-300 text-orange-900' :
                                insight.uncertaintyLevel === 'medium' ? 'bg-yellow-100 border-yellow-300 text-yellow-900' :
                                'bg-green-100 border-green-300 text-green-900'
                              }`}>
                                <span className="font-semibold">
                                  {insight.uncertaintyLevel === 'low' ? 'High confidence' :
                                   insight.uncertaintyLevel === 'medium' ? 'Moderate confidence' :
                                   'Low confidence'}:
                                </span> {getUncertaintyExplanation(insight.uncertaintyLevel)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inferred Concerns */}
                {msg.inferredConcerns && msg.inferredConcerns.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span>🎯</span> What I think might matter to you
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {msg.inferredConcerns.map((concern, i) => (
                        <span key={i} className="bg-white border border-amber-300 text-amber-800 px-3 py-1 rounded-full text-sm">
                          {concern}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Proactive Suggestions */}
                {msg.proactiveSuggestions && msg.proactiveSuggestions.length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span>🎯</span> AI Recommendations
                    </h3>
                    <div className="space-y-2">
                      {msg.proactiveSuggestions.map((sugg, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="flex items-start gap-2">
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              sugg.priority === 'high' ? 'bg-red-100 text-red-700' :
                              sugg.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {sugg.priority}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{sugg.suggestion}</p>
                              <p className="text-xs text-gray-600 mt-1">{sugg.reasoning}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Questions */}
                {msg.aiQuestions && msg.aiQuestions.length > 0 && (
                  <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span>🤔</span> I'd like to know...
                    </h3>
                    <div className="space-y-2">
                      {msg.aiQuestions.map((question, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickQuestion(question)}
                          className="w-full bg-white hover:bg-purple-50 rounded-lg p-3 border border-purple-200 text-left transition-colors"
                        >
                          <p className="text-sm text-gray-900">{question}</p>
                          <span className="text-xs text-purple-600 font-medium mt-1 inline-block">
                            → Answer this
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-2 italic">
                      💡 Answering these helps me give you better recommendations
                    </p>
                  </div>
                )}

                {/* Overall Assessment */}
                {msg.overallAssessment && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span>⭐</span> Bottom Line
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-3 border-l-4 border-indigo-500">
                        <p className="text-base font-medium text-gray-900">{msg.overallAssessment.verdict}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                          <p className="text-xs font-semibold text-green-900 mb-1">✅ Best for:</p>
                          <p className="text-sm text-green-800">{msg.overallAssessment.bestFor}</p>
                        </div>

                        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                          <p className="text-xs font-semibold text-red-900 mb-1">⚠️ Not ideal for:</p>
                          <p className="text-sm text-red-800">{msg.overallAssessment.notIdealFor}</p>
                        </div>
                      </div>

                      {msg.overallAssessment.betterAlternative && (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <p className="text-xs font-semibold text-blue-900 mb-1">💡 Better option:</p>
                          <p className="text-sm text-blue-800">{msg.overallAssessment.betterAlternative}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Ingredients Detail (Collapsible) */}
                {msg.ingredients && msg.ingredients.length > 0 && (
                  <details className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <summary className="font-semibold text-gray-900 cursor-pointer flex items-center gap-2">
                      <span>📋</span> Detailed Ingredient Breakdown ({msg.ingredients.length} items)
                    </summary>
                    <div className="mt-3 space-y-2">
                      {msg.ingredients.map((ing, i) => (
                        <div key={i} className={`border rounded-lg p-3 ${getCategoryColor(ing.category)}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="font-medium">{ing.name}</h4>
                              <p className="text-sm mt-1">{ing.explanation}</p>
                              {ing.tradeoffs && (
                                <p className="text-xs mt-2 opacity-80">⚖️ {ing.tradeoffs}</p>
                              )}
                              {ing.alternatives && (
                                <p className="text-xs mt-1 bg-white bg-opacity-50 rounded p-1">💡 Better: {ing.alternatives}</p>
                              )}
                              {ing.uncertainty && (
                                <p className="text-xs mt-1 italic opacity-70">❓ {ing.uncertainty}</p>
                              )}
                            </div>
                            <span className="text-xs font-semibold uppercase">{ing.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                )}

                {/* Recommended Questions */}
                {msg.recommendedQuestions && msg.recommendedQuestions.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">Questions you might have:</h3>
                    <div className="flex flex-wrap gap-2">
                      {msg.recommendedQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickQuestion(q)}
                          className="text-sm bg-white border-2 border-blue-200 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Regular chat message
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  {msg.reasoning && (
                    <p className="text-xs mt-2 opacity-75 italic">→ {msg.reasoning}</p>
                  )}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {msg.suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickQuestion(s)}
                          className="block text-xs bg-black bg-opacity-10 px-2 py-1 rounded hover:bg-opacity-20 transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-2xl shadow-xl p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
            placeholder="Ask me anything about these ingredients..."
            disabled={isAsking}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            onClick={handleAskQuestion}
            disabled={isAsking}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isAsking ? '...' : 'Ask'}
          </button>
        </div>
        <button
          onClick={onReset}
          className="w-full mt-3 text-sm text-gray-600 hover:text-gray-900 py-2"
        >
          ← Scan Another Product
        </button>
      </div>
    </div>
  );
};

export default ConversationalResult;
