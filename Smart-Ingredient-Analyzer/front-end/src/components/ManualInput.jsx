import React, { useState } from 'react';

const ManualInput = ({ onAnalyze, onBack }) => {
  const [ingredients, setIngredients] = useState('');
  const [productName, setProductName] = useState('');

  const handleSubmit = () => {
    if (!ingredients.trim()) {
      alert('Please enter some ingredients!');
      return;
    }
    onAnalyze(ingredients, productName);
  };

  const exampleIngredients = "Whole grain wheat, sugar, corn syrup, salt, malt flavoring, vitamins and minerals (niacinamide, reduced iron, zinc oxide, vitamin B6, vitamin B2, vitamin B1, folic acid, vitamin B12)";

  const loadExample = () => {
    setProductName('Example Cereal');
    setIngredients(exampleIngredients);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Type Ingredients Manually</h2>
            <p className="text-sm text-gray-600">No photo? No problem! Just paste the ingredient list.</p>
          </div>
        </div>

        {/* Product Name (Optional) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name (Optional)
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g., Whole Grain Cereal, Protein Bar, etc."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Ingredients Text Area */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingredient List <span className="text-red-500">*</span>
          </label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Paste or type the ingredient list here...&#10;&#10;Example: Whole grain wheat, sugar, corn syrup, salt, malt flavoring..."
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
          <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
            <span>{ingredients.length} characters</span>
            <button
              onClick={loadExample}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Load Example
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips for Best Results:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Copy the ingredient list exactly as it appears on the package</li>
            <li>• Include quantities if shown (e.g., "sugar (15g)")</li>
            <li>• Separate ingredients with commas</li>
            <li>• Don't worry about perfect formatting - the AI will understand!</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={!ingredients.trim()}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Analyze Ingredients
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
        </div>
      </div>

      {/* Why Manual Input? */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <span>❓</span> When to use manual input?
        </h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• When you can't take a photo right now</li>
          <li>• When researching products online (copy from website)</li>
          <li>• When the label photo quality is poor</li>
          <li>• When you want to compare ingredients before buying</li>
          <li>• When you're planning meals and checking recipes</li>
        </ul>
      </div>
    </div>
  );
};

export default ManualInput;
