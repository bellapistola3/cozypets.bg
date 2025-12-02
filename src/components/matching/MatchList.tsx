import React from 'react';
import { SitterWithMatch } from '../../types/matching';
import MatchCard from './MatchCard';
import { Loader2 } from 'lucide-react';

interface MatchListProps {
  matches: SitterWithMatch[];
  selectedSitterId: string | null;
  onSelectSitter: (match: SitterWithMatch) => void;
  onViewProfile: (match: SitterWithMatch) => void;
  onRequestBooking: (match: SitterWithMatch) => void;
  isLoading: boolean;
}

const MatchList: React.FC<MatchListProps> = ({
  matches,
  selectedSitterId,
  onSelectSitter,
  onViewProfile,
  onRequestBooking,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">
            Alice актуализира вашите съвпадения...
          </p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Няма намерени гледачи
          </h3>
          <p className="text-gray-600">
            Опитайте да разширите филтрите си, за да видите повече резултати.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Най-добри съвпадения за вашия любимец
        </h2>
        <p className="text-gray-600">
          Намерени {matches.length} {matches.length === 1 ? 'гледач' : 'гледачи'}
        </p>
      </div>

      {matches.map((match) => (
        <MatchCard
          key={match.sitterId}
          match={match}
          isSelected={match.sitterId === selectedSitterId}
          onSelect={() => onSelectSitter(match)}
          onViewProfile={() => onViewProfile(match)}
          onRequestBooking={() => onRequestBooking(match)}
        />
      ))}
    </div>
  );
};

export default MatchList;
