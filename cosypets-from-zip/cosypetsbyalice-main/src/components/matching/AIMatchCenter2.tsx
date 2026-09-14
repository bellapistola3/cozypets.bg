import React, { useState, useEffect } from 'react';
import { Filters, MatchResult, SitterWithMatch, Sitter } from '../../types/matching';
import FiltersPanel from './FiltersPanel';
import MatchList from './MatchList';
import AliceInsights from './AliceInsights';
import { dbHelpers } from '../../lib/firebase';

const AIMatchCenter2: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    animalType: 'any',
    dateFrom: null,
    dateTo: null,
    maxDistanceKm: 20,
    minPrice: null,
    maxPrice: null,
    minExperienceYears: null,
    onlyCertified: false,
    availability: []
  });

  const [matches, setMatches] = useState<SitterWithMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<SitterWithMatch | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateMatch = (sitter: any, filters: Filters): MatchResult => {
    // Basic client-side matching logic to replace the Edge Function for now
    // In a real scenario, this would be an AI call, but we map the Firestore data to the expected UI structure

    let matchPct = 85; // Base match

    // Price fit
    if (filters.maxPrice && sitter.hourly_rate > filters.maxPrice) matchPct -= 20;

    // Animal type fit
    const sitterAnimals = sitter.preferred_animals || sitter.preferredAnimals || [];
    if (filters.animalType !== 'any' && !sitterAnimals.includes(filters.animalType)) {
      matchPct -= 30;
    }

    // Mapping Firestore fields to the MatchResult structure
    return {
      sitterId: sitter.id,
      matchPct: Math.max(0, matchPct),
      reasoning: sitter.bio || "Този гледач има отличен опит с животни във вашия район.",
      risks: "Няма открити критични рискове.",
      compatibilityScore: Math.round(matchPct / 20),
      petNeedsFit: "Отговаря на основните нужди от разходка и внимание.",
      aiSuggestion: matchPct > 80 ? "Силно препоръчан за вашия любимец!" : "Добър вариант за избор."
    };
  };

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      // Fetch real sitters from Firestore
      const sittersData = await dbHelpers.getSitters({
        location: undefined, // Add more granular filtering if needed
        min_rate: filters.minPrice || undefined,
        max_rate: filters.maxPrice || undefined,
      });

      const matchesWithSitters: SitterWithMatch[] = sittersData.map(sitterData => {
        const matchResult = calculateMatch(sitterData, filters);

        // Map Firestore sitter to the Sitter interface expected by the UI
        const sitter: Sitter = {
          id: sitterData.id,
          name: sitterData.full_name || sitterData.name || 'Мария Петкова',
          profileImage: sitterData.photo_url || sitterData.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=compress&cs=tinysrgb&w=200',
          distanceKm: sitterData.distanceKm || 2.5,
          pricePerHour: sitterData.hourly_rate || sitterData.pricePerHour || 15,
          rating: sitterData.rating || sitterData.average_rating || 4.8,
          reviewsCount: sitterData.total_reviews || sitterData.reviewsCount || 12,
          experienceYears: sitterData.experience_years || sitterData.experienceYears || 3,
          preferredAnimals: sitterData.preferred_animals || sitterData.preferredAnimals || ['dog', 'cat'],
          availabilityTags: sitterData.availability_tags || sitterData.availabilityTags || ['weekdays'],
          certifications: sitterData.qualifications ? [sitterData.qualifications] : (sitterData.certifications || []),
          city: sitterData.city || 'София'
        };

        return {
          ...matchResult,
          sitter
        };
      });

      // Sort by match percentage
      const sortedMatches = matchesWithSitters.sort((a, b) => b.matchPct - a.matchPct);

      setMatches(sortedMatches);

      if (sortedMatches.length > 0 && !selectedMatch) {
        setSelectedMatch(sortedMatches[0]);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [filters]);

  const handleViewProfile = (match: SitterWithMatch) => {
    console.log('View profile:', match.sitter.name);
  };

  const handleRequestBooking = (match: SitterWithMatch) => {
    console.log('Request booking:', match.sitter.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Match Center 2.0
          </h1>
          <p className="text-gray-600">
            Alice ще ви помогне да намерите перфектния гледач за вашия любимец
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
          <aside className="lg:block">
            <FiltersPanel filters={filters} onFiltersChange={setFilters} />
          </aside>

          <main>
            <MatchList
              matches={matches}
              selectedSitterId={selectedMatch?.sitterId || null}
              onSelectSitter={setSelectedMatch}
              onViewProfile={handleViewProfile}
              onRequestBooking={handleRequestBooking}
              isLoading={isLoading}
            />
          </main>

          <aside className="lg:block">
            <AliceInsights selectedMatch={selectedMatch} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AIMatchCenter2;
