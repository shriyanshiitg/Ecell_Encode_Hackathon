import React from 'react';

const ContextDisplay = ({ userContext }) => {
  if (!userContext || (
    (!userContext.healthConcerns || userContext.healthConcerns.length === 0) &&
    (!userContext.allergens || userContext.allergens.length === 0) &&
    (!userContext.dietaryPreferences || userContext.dietaryPreferences.length === 0) &&
    (!userContext.goals || userContext.goals.length === 0)
  )) {
    return null;
  }

  const hasAnyContext =
    (userContext.healthConcerns && userContext.healthConcerns.length > 0) ||
    (userContext.allergens && userContext.allergens.length > 0) ||
    (userContext.dietaryPreferences && userContext.dietaryPreferences.length > 0) ||
    (userContext.goals && userContext.goals.length > 0);

  if (!hasAnyContext) return null;

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="font-semibold text-gray-900 text-sm">What I've Learned About You</h3>
        {userContext.confidence && (
          <span className={`text-xs px-2 py-1 rounded-full border ${getConfidenceColor(userContext.confidence)}`}>
            {userContext.confidence} confidence
          </span>
        )}
      </div>

      <div className="space-y-2">
        {userContext.healthConcerns && userContext.healthConcerns.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Health Priorities:</p>
            <div className="flex flex-wrap gap-1">
              {userContext.healthConcerns.map((concern, i) => (
                <span key={i} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full border border-red-200">
                  {concern}
                </span>
              ))}
            </div>
          </div>
        )}

        {userContext.allergens && userContext.allergens.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Allergens to Watch:</p>
            <div className="flex flex-wrap gap-1">
              {userContext.allergens.map((allergen, i) => (
                <span key={i} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full border border-orange-200">
                  ⚠️ {allergen}
                </span>
              ))}
            </div>
          </div>
        )}

        {userContext.dietaryPreferences && userContext.dietaryPreferences.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Dietary Preferences:</p>
            <div className="flex flex-wrap gap-1">
              {userContext.dietaryPreferences.map((pref, i) => (
                <span key={i} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full border border-green-200">
                  {pref}
                </span>
              ))}
            </div>
          </div>
        )}

        {userContext.goals && userContext.goals.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Your Goals:</p>
            <div className="flex flex-wrap gap-1">
              {userContext.goals.map((goal, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full border border-blue-200">
                  🎯 {goal}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2 italic">
        💡 I'll use this to personalize my analysis for you
      </p>
    </div>
  );
};

export default ContextDisplay;
