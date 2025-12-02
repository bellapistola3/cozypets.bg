import React, { useState, useEffect } from 'react';
import FiltersPanel from '../components/matching/FiltersPanel';
import MatchList from '../components/matching/MatchList';
import AliceInsights from '../components/matching/AliceInsights';
import { SitterWithMatch } from '../types/matching';
import { mockSitters } from '../data/mockSitters';
import CozyMascot from '../components/mascots/CozyMascot';

const MatchCenter: React.FC = () => {
  const [filters, setFilters] = useState({
    animalTypes: [] as string[],
    startDate: '',
    endDate: '',
    maxDistance: 50,
    minPrice: 0,
    maxPrice: 100,
    minExperience: 0,
    certifications: [] as string[],
    availability: 'any'
  });

  const [matches, setMatches] = useState<SitterWithMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<SitterWithMatch | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    runMatchingEngine();
  }, [filters]);

  const runMatchingEngine = async () => {
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const matchedSitters: SitterWithMatch[] = mockSitters
      .map(sitter => {
        let matchPct = 70;

        if (filters.animalTypes.length > 0) {
          const hasMatch = sitter.preferredAnimals.some(animal =>
            filters.animalTypes.includes(animal)
          );
          matchPct += hasMatch ? 15 : -20;
        }

        if (sitter.distanceKm <= filters.maxDistance * 0.5) matchPct += 10;
        else if (sitter.distanceKm > filters.maxDistance) matchPct -= 15;

        if (sitter.pricePerHour >= filters.minPrice && sitter.pricePerHour <= filters.maxPrice) {
          matchPct += 5;
        } else {
          matchPct -= 10;
        }

        if (sitter.experienceYears >= filters.minExperience + 3) matchPct += 10;

        matchPct += Math.min(sitter.rating * 4, 15);
        matchPct += sitter.certifications.length * 3;

        matchPct = Math.max(0, Math.min(100, matchPct));

        const reasoning = `${sitter.name} е отличен избор благодарение на ${sitter.experienceYears} години опит и рейтинг ${sitter.rating}/5. Намира се на ${sitter.distanceKm} км от вас.`;

        const risks = matchPct < 60
          ? 'Ниска съвместимост - препоръчваме проверка на профила.'
          : matchPct < 80
          ? 'Средна съвместимост - добър избор с малки резерви.'
          : 'Висока съвместимост - минимални рискове.';

        const petNeedsFit = matchPct >= 80
          ? 'Перфектно съвпадение с нуждите на вашето животинче.'
          : matchPct >= 60
          ? 'Добро съвпадение, но има място за подобрение.'
          : 'Ограничена съвместимост с изискванията.';

        const aiSuggestion = matchPct >= 85
          ? 'Силно препоръчано - резервирайте сега!'
          : matchPct >= 70
          ? 'Добър избор - разгледайте профила.'
          : 'Умерено - сравнете с други опции.';

        return {
          sitter,
          matchPct,
          reasoning,
          risks,
          compatibilityScore: matchPct,
          petNeedsFit,
          aiSuggestion
        };
      })
      .filter(match => {
        if (filters.maxDistance && match.sitter.distanceKm > filters.maxDistance) return false;
        if (match.sitter.pricePerHour < filters.minPrice || match.sitter.pricePerHour > filters.maxPrice) return false;
        if (match.sitter.experienceYears < filters.minExperience) return false;
        return true;
      })
      .sort((a, b) => b.matchPct - a.matchPct);

    setMatches(matchedSitters);
    setIsLoading(false);

    if (matchedSitters.length > 0 && !selectedMatch) {
      setSelectedMatch(matchedSitters[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <CozyMascot variant="thinking" size="medium" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Match Center 🐾
          </h1>
          <p className="text-gray-600">
            Alice is analyzing the best sitters for your pet
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr_320px] gap-6">
          <div className="lg:sticky lg:top-6 h-fit">
            <FiltersPanel
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          <div>
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-thinking">
                  <CozyMascot variant="thinking" size="large" />
                </div>
              </div>
            ) : (
              <MatchList
                matches={matches}
                selectedMatch={selectedMatch}
                onSelectMatch={setSelectedMatch}
              />
            )}
          </div>

          <div className="lg:sticky lg:top-6 h-fit">
            <AliceInsights selectedMatch={selectedMatch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCenter;
