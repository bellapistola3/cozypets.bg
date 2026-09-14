import React from 'react';
import { SitterWithMatch } from '../../types/matching';
import { Sparkles, AlertTriangle, Heart, Lightbulb, CheckCircle } from 'lucide-react';
import LunaMascot from '../mascots/LunaMascot';

interface AliceInsightsProps {
  selectedMatch: SitterWithMatch | null;
}

const AliceInsights: React.FC<AliceInsightsProps> = ({ selectedMatch }) => {
  if (!selectedMatch) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 transition-all duration-300">
        <div className="flex items-center gap-2 mb-6">
          <div className="text-2xl">🤖</div>
          <h2 className="text-xl font-bold text-gray-900">Alice Insights</h2>
        </div>

        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-10 h-10 text-purple-600" />
          </div>
          <p className="text-gray-600 leading-relaxed text-base">
            Изберете гледач от списъка, за да видите интелигентни insights от Alice.
          </p>
        </div>
      </div>
    );
  }

  const { sitter, reasoning, risks, compatibilityScore, petNeedsFit, aiSuggestion } = selectedMatch;

  const getCompatibilityText = () => {
    if (compatibilityScore === 5) return 'Перфектно съвпадение';
    if (compatibilityScore === 4) return 'Силно съвпадение';
    if (compatibilityScore === 3) return 'Умерено съвпадение';
    if (compatibilityScore === 2) return 'Слабо съвпадение';
    return 'Ниско съвпадение';
  };

  const getSuggestionColor = () => {
    if (aiSuggestion.includes('Силно препоръчан')) return 'from-green-50 to-emerald-100';
    if (aiSuggestion.includes('Препоръчан')) return 'from-green-50 to-green-100';
    if (aiSuggestion.includes('Умерено')) return 'from-yellow-50 to-amber-100';
    return 'from-red-50 to-orange-100';
  };

  const getSuggestionTextColor = () => {
    if (aiSuggestion.includes('Силно препоръчан')) return 'text-emerald-900';
    if (aiSuggestion.includes('Препоръчан')) return 'text-green-900';
    if (aiSuggestion.includes('Умерено')) return 'text-amber-900';
    return 'text-red-900';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 animate-fadeIn">
      <div className="flex items-center gap-2 mb-6">
        <LunaMascot variant="insight" size="small" />
        <h2 className="text-xl font-bold text-gray-900">Alice Insights</h2>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src={sitter.profileImage}
            alt={sitter.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-pink-200"
          />
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{sitter.name}</h3>
            <p className="text-sm text-gray-600">{sitter.city}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-br from-blue-50 to-sky-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-2 mb-3">
            <div className="text-xl">🤖</div>
            <h3 className="font-bold text-blue-900 text-base">Защо Alice препоръчва този гледач</h3>
          </div>
          <p className="text-sm text-blue-800 leading-relaxed">
            {reasoning}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-2 mb-3">
            <div className="text-xl">⚠️</div>
            <h3 className="font-bold text-amber-900 text-base">Потенциални рискове</h3>
          </div>
          <p className="text-sm text-amber-800 leading-relaxed">
            {risks}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-lavender-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-2 mb-3">
            <div className="text-xl">🐾</div>
            <h3 className="font-bold text-purple-900 text-base">Нужди на любимеца & Съвместимост</h3>
          </div>
          <p className="text-sm text-purple-800 leading-relaxed mb-4">
            {petNeedsFit}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-purple-200">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="relative">
                  <Heart
                    className={`w-6 h-6 transition-all duration-300 ${
                      num <= compatibilityScore
                        ? 'fill-pink-500 text-pink-500 scale-110'
                        : 'text-gray-300'
                    }`}
                  />
                </div>
              ))}
            </div>
            <span className="text-sm font-bold text-purple-900">
              {compatibilityScore}/5 • {getCompatibilityText()}
            </span>
          </div>
        </div>

        <div className={`bg-gradient-to-br ${getSuggestionColor()} rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border-2 border-opacity-30`}>
          <div className="flex items-start gap-2 mb-3">
            <div className="text-xl">💡</div>
            <h3 className="font-bold text-base" style={{ color: getSuggestionTextColor() }}>
              Alice препоръка за резервация
            </h3>
          </div>
          <p className={`text-sm leading-relaxed font-medium ${getSuggestionTextColor()}`}>
            {aiSuggestion}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-purple-900 leading-relaxed font-medium">
                <strong className="text-purple-700">Alice съвет:</strong> Винаги преглеждайте профила и отзивите
                на гледача преди да направите резервация. Не се колебайте да зададете
                въпроси за специфичните нужди на вашия любимец. 🐾
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AliceInsights;
