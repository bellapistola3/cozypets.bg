import React from 'react';
import { SitterWithMatch } from '../../types/matching';
import { Sparkles, AlertTriangle, Heart } from 'lucide-react';

interface AliceInsightsProps {
  selectedMatch: SitterWithMatch | null;
}

const AliceInsights: React.FC<AliceInsightsProps> = ({ selectedMatch }) => {
  if (!selectedMatch) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Alice Insights</h2>
        </div>

        <div className="text-center py-12">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-gray-600 leading-relaxed">
            Изберете гледач от списъка, за да видите защо Alice го препоръчва.
          </p>
        </div>
      </div>
    );
  }

  const { sitter, reasoning, risks, compatibilityScore } = selectedMatch;

  const renderCompatibilityHearts = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((num) => (
          <Heart
            key={num}
            className={`w-5 h-5 ${
              num <= compatibilityScore
                ? 'fill-pink-500 text-pink-500'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-900">Alice Insights</h2>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <img
            src={sitter.profileImage}
            alt={sitter.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-bold text-gray-900">{sitter.name}</h3>
            <p className="text-sm text-gray-600">{sitter.city}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-start gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <h3 className="font-bold text-blue-900">Защо този гледач?</h3>
          </div>
          <p className="text-sm text-blue-800 leading-relaxed">
            {reasoning}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <h3 className="font-bold text-amber-900">Потенциални рискове</h3>
          </div>
          <p className="text-sm text-amber-800 leading-relaxed">
            {risks}
          </p>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4">
          <div className="flex items-start gap-2 mb-3">
            <Heart className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
            <h3 className="font-bold text-pink-900">Съвместимост</h3>
          </div>
          <div className="flex items-center gap-3">
            {renderCompatibilityHearts()}
            <span className="text-sm font-medium text-pink-800">
              {compatibilityScore}/5
            </span>
          </div>
          <p className="text-xs text-pink-700 mt-2">
            {compatibilityScore >= 4 && 'Отлично съвпадение за вашия любимец!'}
            {compatibilityScore === 3 && 'Добро съвпадение с малки компромиси.'}
            {compatibilityScore <= 2 && 'Приемливо, но не идеално съвпадение.'}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-purple-50 rounded-lg p-3">
          <p className="text-xs text-purple-800 leading-relaxed">
            <strong>Alice съвет:</strong> Винаги преглеждайте профила и отзивите
            на гледача преди да направите резервация. Не се колебайте да зададете
            въпроси за специфичните нужди на вашия любимец.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AliceInsights;
