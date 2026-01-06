import React, { useState } from 'react';

const ComparisonMode = ({ onCompare, onBack }) => {
  const [product1, setProduct1] = useState({ name: '', ingredients: '' });
  const [product2, setProduct2] = useState({ name: '', ingredients: '' });
  const [comparison, setComparison] = useState(null);
  const [isComparing, setIsComparing] = useState(false);

  const handleCompare = async () => {
    if (!product1.ingredients.trim() || !product2.ingredients.trim()) {
      alert('Please fill in ingredients for both products!');
      return;
    }

    setIsComparing(true);
    try {
      const result = await onCompare(product1, product2);
      setComparison(result);
    } catch (error) {
      console.error('Comparison failed:', error);
      alert('Failed to compare products. Please try again.');
    } finally {
      setIsComparing(false);
    }
  };

  const loadExamples = () => {
    setProduct1({
      name: 'Regular Cereal',
      ingredients: 'Sugar, corn syrup, wheat flour, salt, food coloring (Red 40, Yellow 5), BHT (preservative)'
    });
    setProduct2({
      name: 'Healthy Cereal',
      ingredients: 'Whole grain oats, honey, almonds, dried cranberries, sea salt'
    });
  };

  if (comparison) {
    return (
      <div className="space-y-4">
        {/* Comparison Results */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">📊 Product Comparison</h2>
            <button
              onClick={() => setComparison(null)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← New Comparison
            </button>
          </div>

          {/* Overall Winner */}
          {comparison.winner && (
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <span>🏆</span> Recommendation
              </h3>
              <p className="text-green-800">{comparison.winner}</p>
            </div>
          )}

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product 1 */}
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
              <h3 className="font-bold text-lg mb-2 text-gray-900">{product1.name || 'Product A'}</h3>

              {comparison.product1 && (
                <div className="space-y-3">
                  {/* Score */}
                  {comparison.product1.score !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Score:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            comparison.product1.score >= 7 ? 'bg-green-500' :
                            comparison.product1.score >= 4 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${comparison.product1.score * 10}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold">{comparison.product1.score}/10</span>
                    </div>
                  )}

                  {/* Pros */}
                  {comparison.product1.pros && comparison.product1.pros.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-green-700 mb-1">✅ Pros:</p>
                      <ul className="space-y-1">
                        {comparison.product1.pros.map((pro, i) => (
                          <li key={i} className="text-sm text-gray-700">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cons */}
                  {comparison.product1.cons && comparison.product1.cons.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-red-700 mb-1">⚠️ Cons:</p>
                      <ul className="space-y-1">
                        {comparison.product1.cons.map((con, i) => (
                          <li key={i} className="text-sm text-gray-700">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Summary */}
                  {comparison.product1.summary && (
                    <div className="bg-gray-50 rounded p-2 text-xs text-gray-700">
                      {comparison.product1.summary}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
              <h3 className="font-bold text-lg mb-2 text-gray-900">{product2.name || 'Product B'}</h3>

              {comparison.product2 && (
                <div className="space-y-3">
                  {/* Score */}
                  {comparison.product2.score !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Score:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            comparison.product2.score >= 7 ? 'bg-green-500' :
                            comparison.product2.score >= 4 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${comparison.product2.score * 10}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold">{comparison.product2.score}/10</span>
                    </div>
                  )}

                  {/* Pros */}
                  {comparison.product2.pros && comparison.product2.pros.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-green-700 mb-1">✅ Pros:</p>
                      <ul className="space-y-1">
                        {comparison.product2.pros.map((pro, i) => (
                          <li key={i} className="text-sm text-gray-700">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cons */}
                  {comparison.product2.cons && comparison.product2.cons.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-red-700 mb-1">⚠️ Cons:</p>
                      <ul className="space-y-1">
                        {comparison.product2.cons.map((con, i) => (
                          <li key={i} className="text-sm text-gray-700">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Summary */}
                  {comparison.product2.summary && (
                    <div className="bg-gray-50 rounded p-2 text-xs text-gray-700">
                      {comparison.product2.summary}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Key Differences */}
          {comparison.keyDifferences && comparison.keyDifferences.length > 0 && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">🔍 Key Differences:</h3>
              <ul className="space-y-1">
                {comparison.keyDifferences.map((diff, i) => (
                  <li key={i} className="text-sm text-blue-800">• {diff}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={onBack}
          className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Compare Products</h2>
            <p className="text-sm text-gray-600">Side-by-side ingredient analysis</p>
          </div>
        </div>

        {/* Product 1 Input */}
        <div className="mb-4 bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Product 1</h3>
          <input
            type="text"
            value={product1.name}
            onChange={(e) => setProduct1({ ...product1, name: e.target.value })}
            placeholder="Product name (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <textarea
            value={product1.ingredients}
            onChange={(e) => setProduct1({ ...product1, ingredients: e.target.value })}
            placeholder="Paste ingredients here..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>

        {/* Product 2 Input */}
        <div className="mb-4 bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Product 2</h3>
          <input
            type="text"
            value={product2.name}
            onChange={(e) => setProduct2({ ...product2, name: e.target.value })}
            placeholder="Product name (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <textarea
            value={product2.ingredients}
            onChange={(e) => setProduct2({ ...product2, ingredients: e.target.value })}
            placeholder="Paste ingredients here..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCompare}
            disabled={isComparing || !product1.ingredients.trim() || !product2.ingredients.trim()}
            className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isComparing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Comparing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Compare Products
              </>
            )}
          </button>
          <button
            onClick={loadExamples}
            className="px-4 py-3 border-2 border-orange-300 text-orange-700 rounded-xl font-medium hover:bg-orange-50 transition-colors"
          >
            Load Example
          </button>
          <button
            onClick={onBack}
            className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <span>💡</span> How it works
        </h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Compare any two products side-by-side</li>
          <li>• Get AI-powered pros & cons for each</li>
          <li>• See which is better for YOUR health goals</li>
          <li>• Understand key differences instantly</li>
        </ul>
      </div>
    </div>
  );
};

export default ComparisonMode;
