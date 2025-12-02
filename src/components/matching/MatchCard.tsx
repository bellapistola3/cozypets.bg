import React from 'react';
import { SitterWithMatch } from '../../types/matching';
import { MapPin, Star, Award, Clock } from 'lucide-react';

interface MatchCardProps {
  match: SitterWithMatch;
  isSelected: boolean;
  onSelect: () => void;
  onViewProfile: () => void;
  onRequestBooking: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  isSelected,
  onSelect,
  onViewProfile,
  onRequestBooking
}) => {
  const { sitter, matchPct } = match;

  const animalLabels: Record<string, string> = {
    dog: 'Кучета',
    cat: 'Котки',
    rabbit: 'Зайци',
    bird: 'Птици',
    other: 'Други'
  };

  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
        isSelected ? 'ring-2 ring-blue-500 shadow-xl' : ''
      }`}
    >
      <div className="p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <img
              src={sitter.profileImage}
              alt={sitter.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {sitter.name}
                </h3>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{sitter.distanceKm} км</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{sitter.rating} · {sitter.reviewsCount} отзива</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{sitter.experienceYears}+ год. опит</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl px-4 py-3">
                <div className="text-3xl font-bold text-blue-600">
                  {matchPct}%
                </div>
                <div className="text-xs font-medium text-blue-700 whitespace-nowrap">
                  AI Съвпадение
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {sitter.pricePerHour} лв/час
              </span>
              {sitter.preferredAnimals.map(animal => (
                <span
                  key={animal}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {animalLabels[animal] || animal}
                </span>
              ))}
              {sitter.certifications.length > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  <Award className="w-3 h-3" />
                  {sitter.certifications.length} сертификата
                </span>
              )}
            </div>

            {sitter.certifications.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {sitter.certifications.slice(0, 2).map((cert, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md"
                    >
                      {cert}
                    </span>
                  ))}
                  {sitter.certifications.length > 2 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
                      +{sitter.certifications.length - 2} още
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewProfile();
                }}
                className="flex-1 px-4 py-2.5 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Виж профил
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestBooking();
                }}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Заяви резервация
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
